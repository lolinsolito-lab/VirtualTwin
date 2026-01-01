-- Add missing columns to waitlist table for Beta Program support
ALTER TABLE public.waitlist 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- Keep 'name' for backward compatibility but allow migration
COMMENT ON COLUMN public.waitlist.full_name IS 'Full name captured from Beta or Landing pages';
COMMENT ON COLUMN public.waitlist.metadata IS 'Technical metadata like referrer and timestamp';
