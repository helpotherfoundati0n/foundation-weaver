import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HeroImage {
  id: string;
  image_url: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useHeroImages = () => {
  return useQuery({
    queryKey: ['hero-images'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as HeroImage[];
    },
  });
};

export const useActiveHeroImages = () => {
  return useQuery({
    queryKey: ['hero-images', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('hero_images')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });
      
      if (error) throw error;
      return data as HeroImage[];
    },
  });
};

export const useAddHeroImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ image_url, display_order }: { image_url: string; display_order?: number }) => {
      const { error } = await supabase
        .from('hero_images')
        .insert({ image_url, display_order: display_order ?? 0 });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast.success('Hero image added successfully');
    },
    onError: (error) => {
      toast.error('Failed to add hero image: ' + error.message);
    },
  });
};

export const useUpdateHeroImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from('hero_images')
        .update({ is_active })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast.success('Hero image updated');
    },
    onError: (error) => {
      toast.error('Failed to update: ' + error.message);
    },
  });
};

export const useDeleteHeroImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('hero_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
      toast.success('Hero image deleted');
    },
    onError: (error) => {
      toast.error('Failed to delete: ' + error.message);
    },
  });
};

export const useReorderHeroImages = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (images: { id: string; display_order: number }[]) => {
      const updates = images.map(({ id, display_order }) =>
        supabase.from('hero_images').update({ display_order }).eq('id', id)
      );
      
      const results = await Promise.all(updates);
      const error = results.find(r => r.error)?.error;
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hero-images'] });
    },
    onError: (error) => {
      toast.error('Failed to reorder: ' + error.message);
    },
  });
};
