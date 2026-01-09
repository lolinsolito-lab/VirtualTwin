-- Add wave_id to profiles table for founder wave tracking
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS wave_id TEXT;

COMMENT ON COLUMN public.profiles.wave_id IS 'Founder Wave ID (genesis, pioneer, elite) the user joined with';
