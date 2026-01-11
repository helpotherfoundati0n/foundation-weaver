-- Create hero_images table for the background slider
CREATE TABLE public.hero_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.hero_images ENABLE ROW LEVEL SECURITY;

-- Public can read active images
CREATE POLICY "Public can read active hero images" 
ON public.hero_images 
FOR SELECT 
USING (is_active = true);

-- Admins can manage hero images
CREATE POLICY "Admins can manage hero images" 
ON public.hero_images 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for updated_at
CREATE TRIGGER update_hero_images_updated_at
BEFORE UPDATE ON public.hero_images
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();