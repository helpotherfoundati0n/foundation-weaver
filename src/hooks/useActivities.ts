import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Activity {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  image_url: string | null;
  image_width: number;
  image_height: number;
  list_items: string[];
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const useActivities = () => {
  return useQuery({
    queryKey: ['activities'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        list_items: Array.isArray(item.list_items) ? item.list_items : JSON.parse(item.list_items || '[]')
      })) as Activity[];
    },
  });
};

export const useActiveActivities = () => {
  return useQuery({
    queryKey: ['activities', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true });
      
      if (error) throw error;
      return (data as any[]).map(item => ({
        ...item,
        list_items: Array.isArray(item.list_items) ? item.list_items : JSON.parse(item.list_items || '[]')
      })) as Activity[];
    },
  });
};

export const useCreateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (activity: Omit<Activity, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase
        .from('activities')
        .insert({
          ...activity,
          list_items: JSON.stringify(activity.list_items)
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create activity: ' + error.message);
    },
  });
};

export const useUpdateActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Activity> & { id: string }) => {
      const updateData = {
        ...updates,
        list_items: updates.list_items ? JSON.stringify(updates.list_items) : undefined
      };
      
      const { error } = await supabase
        .from('activities')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update activity: ' + error.message);
    },
  });
};

export const useDeleteActivity = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      toast.success('Activity deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete activity: ' + error.message);
    },
  });
};
