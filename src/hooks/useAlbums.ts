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
  display_order: number;
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
        .order('display_order', { ascending: true });
      
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

export const useReorderAlbums = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (updates: { id: string; display_order: number }[]) => {
      const promises = updates.map((update) =>
        supabase
          .from('albums')
          .update({ display_order: update.display_order })
          .eq('id', update.id)
      );
      
      const results = await Promise.all(promises);
      const error = results.find((r) => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['albums'] });
    },
    onError: (error) => {
      toast.error('Failed to reorder albums: ' + error.message);
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
    mutationFn: async ({ title, description, cover_image_url }: { title: string; description: string | null; cover_image_url: string | null }) => {
      // Get max display_order
      const { data: existingAlbums } = await supabase
        .from('albums')
        .select('display_order')
        .order('display_order', { ascending: false })
        .limit(1);
      
      const maxOrder = existingAlbums?.[0]?.display_order ?? -1;
      
      const { data, error } = await supabase
        .from('albums')
        .insert({ title, description, cover_image_url, display_order: maxOrder + 1 })
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
