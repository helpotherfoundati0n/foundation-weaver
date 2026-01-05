import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  display_order: number;
  created_at: string;
}

export const useGallery = () => {
  return useQuery({
    queryKey: ['gallery'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gallery')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as GalleryItem[];
    },
  });
};

export const useCreateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ image_url, caption, display_order }: Omit<GalleryItem, 'id' | 'created_at'>) => {
      const { error } = await supabase
        .from('gallery')
        .insert({ image_url, caption, display_order });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery item added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add gallery item: ' + error.message);
    },
  });
};

export const useUpdateGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GalleryItem> & { id: string }) => {
      const { error } = await supabase
        .from('gallery')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery item updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update gallery item: ' + error.message);
    },
  });
};

export const useDeleteGalleryItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('gallery')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery item deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete gallery item: ' + error.message);
    },
  });
};

export const useReorderGallery = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (items: { id: string; display_order: number }[]) => {
      const updates = items.map(item => 
        supabase
          .from('gallery')
          .update({ display_order: item.display_order })
          .eq('id', item.id)
      );
      
      const results = await Promise.all(updates);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gallery'] });
      toast.success('Gallery order updated');
    },
    onError: (error) => {
      toast.error('Failed to reorder gallery: ' + error.message);
    },
  });
};