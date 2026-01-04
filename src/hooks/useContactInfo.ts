import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ContactInfo {
  id: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  qr_code_url: string | null;
  created_at: string;
  updated_at: string;
}

export const useContactInfo = () => {
  return useQuery({
    queryKey: ['contact-info'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_info')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as ContactInfo | null;
    },
  });
};

export const useUpdateContactInfo = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<ContactInfo> & { id: string }) => {
      const { error } = await supabase
        .from('contact_info')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-info'] });
      toast.success('Contact info updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update contact info: ' + error.message);
    },
  });
};
