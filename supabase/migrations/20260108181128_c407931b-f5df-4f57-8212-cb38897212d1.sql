-- Create albums table for event albums architecture
CREATE TABLE public.albums (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add album_id to gallery table
ALTER TABLE public.gallery ADD COLUMN album_id UUID REFERENCES public.albums(id) ON DELETE CASCADE;

-- Enable RLS on albums
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for albums
CREATE POLICY "Public can read albums" 
ON public.albums 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage albums" 
ON public.albums 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Create trigger for updated_at on albums
CREATE TRIGGER update_albums_updated_at
  BEFORE UPDATE ON public.albums
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();