-- ============================================
-- VIRTUALTWIN: Complete Add-ons System Migration
-- ============================================
-- Run this ENTIRE script in Supabase SQL Editor
-- This is safe to run multiple times (uses IF NOT EXISTS)
-- ============================================

-- STEP 1: Add Setup Premium tracking columns to profiles (if not exists)
-- ============================================
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS setup_premium_purchased BOOLEAN DEFAULT FALSE;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS setup_premium_purchased_at TIMESTAMPTZ;

-- Index for Setup Premium customers (safe to run multiple times)
DROP INDEX IF EXISTS idx_profiles_setup_premium;
CREATE INDEX idx_profiles_setup_premium 
ON profiles(setup_premium_purchased) 
WHERE setup_premium_purchased = TRUE;

-- STEP 2: Create addons table for dynamic products
-- ============================================
CREATE TABLE IF NOT EXISTS addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'gift',
    
    -- Pricing (in cents for precision)
    promo_price INTEGER NOT NULL,
    regular_price INTEGER NOT NULL,
    
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
    created_by UUID
);

-- STEP 3: Create indexes (safe to run multiple times)
-- ============================================
DROP INDEX IF EXISTS idx_addons_active;
CREATE INDEX idx_addons_active ON addons(is_active) WHERE is_active = true;

DROP INDEX IF EXISTS idx_addons_order;
CREATE INDEX idx_addons_order ON addons(display_order);

-- STEP 4: Enable RLS (safe to run multiple times)
-- ============================================
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;

-- Drop policies if they exist (to recreate cleanly)
DROP POLICY IF EXISTS "Anyone can read active addons" ON addons;
DROP POLICY IF EXISTS "Super admins can manage addons" ON addons;
DROP POLICY IF EXISTS "Service role full access" ON addons;

-- Anyone can read active addons (needed for checkout page)
CREATE POLICY "Anyone can read active addons" ON addons
    FOR SELECT USING (is_active = true);

-- Super admins can manage all addons
CREATE POLICY "Super admins can manage addons" ON addons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.is_super_admin = true
        )
    );

-- Service role has full access (for API operations)
CREATE POLICY "Service role full access" ON addons
    FOR ALL USING (auth.role() = 'service_role');

-- STEP 5: Auto-update trigger for updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_addons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_addons_updated_at ON addons;
CREATE TRIGGER trigger_addons_updated_at
    BEFORE UPDATE ON addons
    FOR EACH ROW
    EXECUTE FUNCTION update_addons_updated_at();

-- STEP 6: Migrate existing Setup Premium to addons table
-- ============================================
-- Only insert if it doesn't already exist
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
) 
SELECT 
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
WHERE NOT EXISTS (
    SELECT 1 FROM addons WHERE name = 'Setup Premium'
);

-- STEP 7: Verify installation
-- ============================================
DO $$
DECLARE
    addons_count INTEGER;
    columns_exist BOOLEAN;
BEGIN
    -- Check addons table
    SELECT COUNT(*) INTO addons_count FROM addons;
    RAISE NOTICE '✅ Addons table ready with % products', addons_count;
    
    -- Check profile columns
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'setup_premium_purchased'
    ) INTO columns_exist;
    
    IF columns_exist THEN
        RAISE NOTICE '✅ Profile setup_premium tracking columns exist';
    ELSE
        RAISE NOTICE '❌ Profile columns missing - please check migration';
    END IF;
    
    RAISE NOTICE '🎉 Add-ons System installation complete!';
END $$;

-- ============================================
-- DONE! Your Add-ons System is ready.
-- Go to /admin/addons to manage your products.
-- ============================================
