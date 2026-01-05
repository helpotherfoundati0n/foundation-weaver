import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContentHistory {
  id: string;
  content_id: string;
  previous_title: string | null;
  previous_content: string | null;
  previous_styles: Record<string, any>;
  previous_metadata: Record<string, any>;
  changed_at: string;
  changed_by: string | null;
}

export const useContentHistory = (contentId: string) => {
  return useQuery({
    queryKey: ['content-history', contentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_history')
        .select('*')
        .eq('content_id', contentId)
        .order('changed_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data as ContentHistory[];
    },
    enabled: !!contentId,
  });
};

export const useRestoreContentVersion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ contentId, historyId }: { contentId: string; historyId: string }) => {
      // Get the history record
      const { data: history, error: historyError } = await supabase
        .from('content_history')
        .select('*')
        .eq('id', historyId)
        .single();
      
      if (historyError) throw historyError;
      
      // Restore the content
      const { error: updateError } = await supabase
        .from('site_content')
        .update({
          title: history.previous_title,
          content: history.previous_content,
          styles: history.previous_styles,
          metadata: history.previous_metadata,
        })
        .eq('id', contentId);
      
      if (updateError) throw updateError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['site-content'] });
      queryClient.invalidateQueries({ queryKey: ['content-history'] });
      toast.success('Content restored successfully');
    },
    onError: (error) => {
      toast.error('Failed to restore content: ' + error.message);
    },
  });
};
