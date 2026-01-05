import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface SectionStyles {
  backgroundColor?: string;
  titleColor?: string;
  titleSize?: string;
  contentColor?: string;
  contentSize?: string;
}

export interface SiteContent {
  id: string;
  section_key: string;
  title: string | null;
  content: string | null;
  styles: SectionStyles;
  metadata: Record<string, any>;
  order_index: number;
  section_type: string;
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
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        styles: item.styles || {},
        metadata: item.metadata || {},
      })) as SiteContent[];
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
      if (!data) return null;
      return {
        ...data,
        styles: data.styles || {},
        metadata: data.metadata || {},
      } as SiteContent;
    },
  });
};

export const useUpdateSiteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, title, content, styles, metadata }: { 
      id: string; 
      title?: string; 
      content?: string;
      styles?: SectionStyles;
      metadata?: Record<string, any>;
    }) => {
      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (content !== undefined) updateData.content = content;
      if (styles !== undefined) updateData.styles = styles;
      if (metadata !== undefined) updateData.metadata = metadata;
      
      const { error } = await supabase
        .from('site_content')
        .update(updateData)
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
    mutationFn: async ({ section_key, title, content, styles, metadata, order_index, section_type }: { 
      section_key: string; 
      title?: string; 
      content?: string;
      styles?: SectionStyles;
      metadata?: Record<string, any>;
      order_index?: number;
      section_type?: string;
    }) => {
      const insertData: any = { 
        section_key, 
      };
      
      if (title !== undefined) insertData.title = title;
      if (content !== undefined) insertData.content = content;
      if (styles) insertData.styles = styles;
      if (metadata) insertData.metadata = metadata;
      if (order_index !== undefined) insertData.order_index = order_index;
      if (section_type) insertData.section_type = section_type;
      
      const { error } = await supabase
        .from('site_content')
        .insert(insertData);
      
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

export const useDeleteSiteContent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('site_content')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      toast.success('Content deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete content: ' + error.message);
    },
  });
};
