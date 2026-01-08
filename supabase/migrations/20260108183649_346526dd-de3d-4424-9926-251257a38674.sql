-- Add display_order column to albums table
ALTER TABLE public.albums ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- Update existing albums with sequential order based on created_at
WITH ordered_albums AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) - 1 as new_order
  FROM public.albums
)
UPDATE public.albums 
SET display_order = ordered_albums.new_order
FROM ordered_albums
WHERE public.albums.id = ordered_albums.id;