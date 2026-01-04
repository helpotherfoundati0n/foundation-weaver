import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SiteContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export const useSiteContent = () => {
  return useQuery({
    queryKey: ['site-content'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .order('section_key');
      
      if (error) throw error;
      return data as SiteContent[];
    },
  });
};

export const useSiteContentByKey = (key: string) => {
  return useQuery({
    queryKey: ['site-content', key],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_content')
        .select('*')
        .eq('section_key', key)
        .maybeSingle();
      
      if (error) throw error;
      return data as SiteContent | null;
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, content }: { id: string; title?: string; content?: string }) => {
      const { error } = await supabase
        .from('site_content')
        .update({ title, content })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast.success('Content updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update content: ' + error.message);
    },
  });
};

export const useCreateSiteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ section_key, title, content }: { section_key: string; title: string; content: string }) => {
      const { error } = await supabase
        .from('site_content')
        .insert({ section_key, title, content });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast.success('Content created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create content: ' + error.message);
    },
  });
};
