-- =============================================
-- WAVE 15: ADMIN OPS & MANUAL PAYMENTS
-- Author: Michael Jara (Insolito Experiences)
-- Date: 2026-01-05
-- =============================================

-- 1. Add role and legal info to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
ADD COLUMN IF NOT EXISTS business_iban TEXT,
ADD COLUMN IF NOT EXISTS business_vat TEXT,
ADD COLUMN IF NOT EXISTS legal_address TEXT;

-- 2. Create System Settings Table (Global Config)
CREATE TABLE IF NOT EXISTS public.system_settings (
    id TEXT PRIMARY KEY, -- e.g., 'platform_billing'
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES public.profiles(id)
);

-- Enable RLS
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Only Admins can view and manage system settings
CREATE POLICY "Admins can manage system_settings" 
ON public.system_settings 
FOR ALL 
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
);

-- Allow public read only for specific public keys if needed (e.g., public_iban)
-- For now, we'll fetch via a secure RPC or server-side

-- 3. Initial Seed
INSERT INTO public.system_settings (id, data)
VALUES (
    'platform_billing', 
    '{
        "iban": "IT00 0000 0000 0000 0000 0000 000",
        "owner_name": "Insolito Experiences di Michael Jara",
        "vat_number": "IT00000000000",
        "bank_name": "Lumina Bank (Placeholder)",
        "swift_bic": "LUMNITXX"
    }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 4. Set Michael Jara as Admin
UPDATE public.profiles SET role = 'admin' WHERE email = 'jaramichael@hotmail.com';
