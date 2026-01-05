-- Add JSONB columns to site_content for dynamic styling and metadata
ALTER TABLE public.site_content 
ADD COLUMN IF NOT EXISTS styles JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS section_type TEXT DEFAULT 'text';

-- Create content_history table for version control
CREATE TABLE IF NOT EXISTS public.content_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_id UUID NOT NULL REFERENCES public.site_content(id) ON DELETE CASCADE,
  previous_title TEXT,
  previous_content TEXT,
  previous_styles JSONB DEFAULT '{}',
  previous_metadata JSONB DEFAULT '{}',
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  changed_by UUID
);

-- Enable RLS on content_history
ALTER TABLE public.content_history ENABLE ROW LEVEL SECURITY;

-- Create policies for content_history
CREATE POLICY "Admins can manage content history" 
ON public.content_history 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can read content history" 
ON public.content_history 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create activities table for dynamic key activities
CREATE TABLE IF NOT EXISTS public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'HeartPulse',
  image_url TEXT,
  image_width INTEGER DEFAULT 400,
  image_height INTEGER DEFAULT 300,
  list_items JSONB DEFAULT '[]',
  order_index INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on activities
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- Create policies for activities
CREATE POLICY "Public can read active activities" 
ON public.activities 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Admins can manage activities" 
ON public.activities 
FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger for activities updated_at
CREATE TRIGGER update_activities_updated_at
BEFORE UPDATE ON public.activities
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- Create function to save content history before update
CREATE OR REPLACE FUNCTION public.save_content_history()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.content_history (content_id, previous_title, previous_content, previous_styles, previous_metadata, changed_by)
  VALUES (OLD.id, OLD.title, OLD.content, OLD.styles, OLD.metadata, auth.uid());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to auto-save history on content update
CREATE TRIGGER save_content_history_trigger
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.save_content_history();

-- Insert default activities if table is empty
INSERT INTO public.activities (title, description, icon, image_url, list_items, order_index)
SELECT 'Medical Help', 
  'We provide crucial support for emergency medical cases and assist with medical expenses for those who cannot afford treatment.',
  'HeartPulse',
  '/images/Medical-Help.png',
  '["Emergency medical assistance", "Support for ongoing treatment costs", "Guidance for MAA/Ayushman Card enrollment", "Medical camps and health awareness programs"]',
  0
WHERE NOT EXISTS (SELECT 1 FROM public.activities LIMIT 1);

INSERT INTO public.activities (title, description, icon, image_url, list_items, order_index)
SELECT 'Education Help',
  'We believe education is key to breaking the cycle of poverty and creating sustainable change in communities.',
  'BookOpen',
  '/images/education-help.png',
  '["School fee assistance", "Educational materials and supplies", "Tutoring and mentoring programs", "Scholarship opportunities"]',
  1
WHERE (SELECT COUNT(*) FROM public.activities) < 2;

INSERT INTO public.activities (title, description, icon, image_url, list_items, order_index)
SELECT 'Aatma Nirbhar Help',
  'We empower individuals to become self-reliant through various initiatives and support programs.',
  'Wrench',
  '/images/atmanirbhar-help.png',
  '["Vocational training programs", "Small business setup support", "Tools and equipment provision", "Skills development workshops"]',
  2
WHERE (SELECT COUNT(*) FROM public.activities) < 3;