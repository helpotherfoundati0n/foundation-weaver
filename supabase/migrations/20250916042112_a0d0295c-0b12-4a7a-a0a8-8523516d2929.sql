-- Create storage buckets for images
INSERT INTO storage.buckets (id, name, public) VALUES ('website-images', 'website-images', true);

-- Create content sections table for dynamic text content
CREATE TABLE public.content_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section_key TEXT NOT NULL UNIQUE,
  title TEXT,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create images table for managing website images
CREATE TABLE public.website_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  image_key TEXT NOT NULL UNIQUE,
  file_path TEXT NOT NULL,
  alt_text TEXT,
  title TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create team members table
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT,
  bio TEXT,
  image_path TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create events table
CREATE TABLE public.events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  image_path TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create gallery items table
CREATE TABLE public.gallery_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT,
  description TEXT,
  image_path TEXT NOT NULL,
  category TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact info table
CREATE TABLE public.contact_info (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  info_key TEXT NOT NULL UNIQUE,
  label TEXT,
  value TEXT NOT NULL,
  icon TEXT,
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (make all tables publicly readable since no auth system)
ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_info ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access to content_sections" 
ON public.content_sections FOR SELECT USING (true);

CREATE POLICY "Allow public read access to website_images" 
ON public.website_images FOR SELECT USING (true);

CREATE POLICY "Allow public read access to team_members" 
ON public.team_members FOR SELECT USING (true);

CREATE POLICY "Allow public read access to events" 
ON public.events FOR SELECT USING (true);

CREATE POLICY "Allow public read access to gallery_items" 
ON public.gallery_items FOR SELECT USING (true);

CREATE POLICY "Allow public read access to contact_info" 
ON public.contact_info FOR SELECT USING (true);

-- Create policies for admin access (all operations allowed)
CREATE POLICY "Allow all operations on content_sections" 
ON public.content_sections FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on website_images" 
ON public.website_images FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on team_members" 
ON public.team_members FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on events" 
ON public.events FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on gallery_items" 
ON public.gallery_items FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on contact_info" 
ON public.contact_info FOR ALL USING (true) WITH CHECK (true);

-- Create storage policies for public read access to images
CREATE POLICY "Allow public read access to website images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'website-images');

CREATE POLICY "Allow all operations on website images" 
ON storage.objects FOR ALL 
USING (bucket_id = 'website-images') 
WITH CHECK (bucket_id = 'website-images');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_images_updated_at
  BEFORE UPDATE ON public.website_images
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON public.events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_gallery_items_updated_at
  BEFORE UPDATE ON public.gallery_items
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_contact_info_updated_at
  BEFORE UPDATE ON public.contact_info
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some default content sections
INSERT INTO public.content_sections (section_key, title, content) VALUES
('hero_title', 'Welcome to Our Foundation', 'Making a difference in our community through compassion and action'),
('hero_subtitle', 'Hero Subtitle', 'Join us in our mission to help those in need'),
('about_title', 'About Our Foundation', 'Learn about our mission and values'),
('about_description', 'About Description', 'We are dedicated to making a positive impact in our community through various charitable initiatives and programs.'),
('donation_title', 'Support Our Cause', 'Your donation can make a real difference'),
('donation_description', 'Donation Description', 'Every contribution helps us continue our mission to help those in need.');

-- Insert default contact information
INSERT INTO public.contact_info (info_key, label, value, icon) VALUES
('email', 'Email', 'contact@foundation.org', 'mail'),
('phone', 'Phone', '+1 (555) 123-4567', 'phone'),
('address', 'Address', '123 Foundation St, City, State 12345', 'map-pin');