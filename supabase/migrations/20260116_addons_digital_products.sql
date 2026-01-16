-- Migration: Add product_type and delivery_url to addons table
-- For selling digital products (PDF, eBook, Video, Audio, Webinar)

-- Add product type column
ALTER TABLE addons 
ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'service' 
CHECK (product_type IN ('service', 'pdf', 'ebook', 'video', 'audio', 'webinar', 'course', 'template'));

-- Add delivery URL for digital products
ALTER TABLE addons 
ADD COLUMN IF NOT EXISTS delivery_url TEXT;

-- Add delivery instructions (shown after purchase)
ALTER TABLE addons 
ADD COLUMN IF NOT EXISTS delivery_instructions TEXT;

-- Comments
COMMENT ON COLUMN addons.product_type IS 'Type of product: service, pdf, ebook, video, audio, webinar, course, template';
COMMENT ON COLUMN addons.delivery_url IS 'URL for digital product download/access (shown after purchase)';
COMMENT ON COLUMN addons.delivery_instructions IS 'Instructions shown to customer after purchase';

-- Update existing Setup Premium to be "service" type (should already be default)
UPDATE addons SET product_type = 'service' WHERE product_type IS NULL;
