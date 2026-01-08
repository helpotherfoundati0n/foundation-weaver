import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Album {
  id: string;
  title: string;
  description: string | null;
  cover_image_url: string | null;
  created_at: string;
  updated_at: string;
  photo_count?: number;
}

export interface AlbumWithPhotos extends Album {
  photos: {
    id: string;
    image_url: string;
    caption: string | null;
    display_order: number | null;
  }[];
}

export const useAlbums = () => {
  return useQuery({
    queryKey: ['albums'],
    queryFn: async () => {
      const { data: albums, error } = await supabase
        .from('albums')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      // Get photo counts for each album
      const albumsWithCounts = await Promise.all(
        albums.map(async (album) => {
          const { count } = await supabase
            .from('gallery')
            .select('*', { count: 'exact', head: true })
            .eq('album_id', album.id);
          
          return { ...album, photo_count: count || 0 };
        })
      );

      return albumsWithCounts as Album[];
    },
  });
};

export const useAlbumWithPhotos = (albumId: string | null) => {
  return useQuery({
    queryKey: ['album', albumId],
    queryFn: async () => {
      if (!albumId) return null;

      const { data: album, error: albumError } = await supabase
        .from('albums')
        .select('*')
        .eq('id', albumId)
        .single();
      
      if (albumError) throw albumError;

      const { data: photos, error: photosError } = await supabase
        .from('gallery')
        .select('*')
        .eq('album_id', albumId)
        .order('display_order', { ascending: true });
      
      if (photosError) throw photosError;

      return { ...album, photos: photos || [] } as AlbumWithPhotos;
    },
    enabled: !!albumId,
  });
};

export const useCreateAlbum = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ title, description, cover_image_url }: Omit<Album, 'id' | 'created_at' | 'updated_at' | 'photo_count'>) => {
      const { data, error } = await supabase
        .from('albums')
        .insert({ title, description, cover_image_url })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      toast.success('Album created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create album: ' + error.message);
    },
  });
};

export const useUpdateAlbum = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Album> & { id: string }) => {
      const { error } = await supabase
        .from('albums')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      queryClient.invalidateQueries({ queryKey: ['album'] });
      toast.success('Album updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update album: ' + error.message);
    },
  });
};

export const useDeleteAlbum = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('albums')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
      toast.success('Album deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete album: ' + error.message);
    },
  });
};
