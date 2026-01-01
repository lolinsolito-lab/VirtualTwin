-- Add SuperAdmin capability to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_super_admin BOOLEAN DEFAULT FALSE;

-- Grant SuperAdmin status to the owner
-- Note: Replace with the actual ID if needed, but for now we target the specific email
UPDATE public.profiles 
SET is_super_admin = TRUE 
WHERE email = 'lordinsolito@gmail.com';

COMMENT ON COLUMN public.profiles.is_super_admin IS 'Cryptographic flag for God-Mode Admin access';
