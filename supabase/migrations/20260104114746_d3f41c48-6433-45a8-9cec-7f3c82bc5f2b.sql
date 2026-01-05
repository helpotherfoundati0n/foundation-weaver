-- Add second QR code column for Lillah donations
ALTER TABLE public.contact_info 
ADD COLUMN IF NOT EXISTS qr_code_url_2 TEXT;