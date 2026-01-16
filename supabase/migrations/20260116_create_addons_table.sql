-- Migration: Create addons table for dynamic upsell products
-- Run this in Supabase SQL Editor AFTER the previous migration

-- Main addons table
CREATE TABLE IF NOT EXISTS addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'gift', -- lucide icon name
    
    -- Pricing (in cents for precision)
    promo_price INTEGER NOT NULL, -- e.g., 9900 = €99
    regular_price INTEGER NOT NULL, -- e.g., 29700 = €297
    
    -- Stripe IDs (auto-populated by API)
    stripe_product_id TEXT,
    stripe_promo_price_id TEXT,
    stripe_regular_price_id TEXT,
    
    -- Features (array of bullet points)
    features JSONB DEFAULT '[]'::jsonb,
    
    -- Tier configuration
    available_for_tiers TEXT[] DEFAULT ARRAY['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'],
    pre_selected_for TEXT[] DEFAULT ARRAY['entrepreneur', 'conquistatore', 'imperatore'],
    
    -- Display settings
    is_active BOOLEAN DEFAULT true,
    is_recommended BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Index for fast queries
CREATE INDEX IF NOT EXISTS idx_addons_active ON addons(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_addons_order ON addons(display_order);

-- RLS Policies
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

-- Anyone can read active addons (for checkout page)
CREATE POLICY "Anyone can read active addons" ON addons
    FOR SELECT USING (is_active = true);

-- Only super_admins can manage addons
CREATE POLICY "Super admins can manage addons" ON addons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_super_admin = true
        )
    );

-- Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_addons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_addons_updated_at
    BEFORE UPDATE ON addons
    FOR EACH ROW
    EXECUTE FUNCTION update_addons_updated_at();

-- Insert the existing Setup Premium as the first addon
-- (This migrates the hardcoded setup premium to the database)
INSERT INTO addons (
    name,
    description,
    icon,
    promo_price,
    regular_price,
    stripe_product_id,
    stripe_promo_price_id,
    stripe_regular_price_id,
    features,
    available_for_tiers,
    pre_selected_for,
    is_active,
    is_recommended,
    display_order
) VALUES (
    'Setup Premium',
    'Configurazione Done-For-You in 48h con call strategica 1:1',
    'gift',
    9900, -- €99
    29700, -- €297
    'prod_TnjD8ssoztDQXK',
    'price_1Sq7lG7141DXdb9vPlJMv2ZQ',
    'price_1Sq7lG7141DXdb9vckVkJl0l',
    '["Configurazione completa in 48h", "Call 1:1 strategica di onboarding", "Training personalità + Tone of Voice", "Integrazione di tutti i canali", "Importazione FAQ e knowledge base", "Test e ottimizzazione iniziale"]'::jsonb,
    ARRAY['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'],
    ARRAY['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'],
    true,
    true,
    1
) ON CONFLICT DO NOTHING;

-- Add comment for documentation
COMMENT ON TABLE addons IS 'Dynamic add-on products for checkout upsells. Synced with Stripe automatically.';
