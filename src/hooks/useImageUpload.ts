import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File, folder: string = 'general'): Promise<string | null> => {
    setIsUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('site-images')
        .upload(fileName, file);
      
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('site-images')
        .getPublicUrl(fileName);
      
      return publicUrl;
    } catch (error: any) {
      toast.error('Failed to upload image: ' + error.message);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const deleteImage = async (url: string): Promise<boolean> => {
    try {
      // Extract the path from the URL
      const urlParts = url.split('/site-images/');
      if (urlParts.length < 2) return false;
      
      const path = urlParts[1];
      
      const { error } = await supabase.storage
        .from('site-images')
        .remove([path]);
      
      if (error) throw error;
      return true;
    } catch (error: any) {
      toast.error('Failed to delete image: ' + error.message);
      return false;
    }
  };

  return { uploadImage, deleteImage, isUploading };
};
