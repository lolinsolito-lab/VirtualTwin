-- =============================================
-- 🗄️ VIRTUALTWIN - CHANNEL ADD-ONS MIGRATION
-- Run this in Supabase SQL Editor
-- Last Updated: 2026-01-17
-- =============================================

-- =============================================
-- 1. ADD MISSING COLUMNS TO PROFILES
-- =============================================

-- Add overage columns if not exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS overage_channels INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS overage_clones INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS overage_messages INTEGER DEFAULT 0;

-- Add message tracking columns if not exist
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS messages_used_this_month INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS limit_warning_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS limit_critical_sent_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS limit_exceeded_sent_at TIMESTAMPTZ;

-- =============================================
-- 2. CREATE ADDONS TABLE (IF NOT EXISTS)
-- =============================================

CREATE TABLE IF NOT EXISTS addons (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT DEFAULT 'gift',
    product_type TEXT DEFAULT 'service', -- 'channel_addon', 'service', 'course', etc.
    promo_price INTEGER DEFAULT 0, -- in cents
    regular_price INTEGER DEFAULT 0, -- in cents
    stripe_product_id TEXT,
    stripe_promo_price_id TEXT,
    stripe_regular_price_id TEXT,
    features TEXT[] DEFAULT '{}',
    available_for_tiers TEXT[] DEFAULT '{}',
    pre_selected_for TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_recommended BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    delivery_url TEXT,
    delivery_instructions TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_addons_product_type ON addons(product_type);
CREATE INDEX IF NOT EXISTS idx_addons_is_active ON addons(is_active);

-- =============================================
-- 3. CREATE USER_ADDONS TABLE (IF NOT EXISTS)
-- =============================================

CREATE TABLE IF NOT EXISTS user_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    addon_id TEXT NOT NULL REFERENCES addons(id),
    addon_name TEXT,
    addon_type TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'cancelled', 'expired'
    purchased_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    stripe_subscription_id TEXT,
    price_paid INTEGER DEFAULT 0, -- in cents
    delivery_url TEXT,
    delivery_instructions TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate active purchases
    UNIQUE(user_id, addon_id, status)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_user_addons_user_id ON user_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_addon_id ON user_addons(addon_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_status ON user_addons(status);

-- =============================================
-- 4. CREATE CLONES TABLE (IF NOT EXISTS)
-- =============================================

CREATE TABLE IF NOT EXISTS clones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT DEFAULT 'Clone AI',
    personality TEXT DEFAULT 'professional',
    is_active BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_clones_user_id ON clones(user_id);
CREATE INDEX IF NOT EXISTS idx_clones_is_active ON clones(is_active);

-- =============================================
-- 5. CREATE CHANNELS TABLE (IF NOT EXISTS)
-- =============================================

CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    channel_type TEXT NOT NULL, -- 'whatsapp', 'instagram', 'messenger', etc.
    is_active BOOLEAN DEFAULT false,
    page_id TEXT, -- For Meta channels
    access_token TEXT, -- Encrypted
    waba_id TEXT, -- For WhatsApp
    phone_number TEXT,
    webhook_verified BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    connected_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- One channel type per user
    UNIQUE(user_id, channel_type)
);

CREATE INDEX IF NOT EXISTS idx_channels_user_id ON channels(user_id);
CREATE INDEX IF NOT EXISTS idx_channels_channel_type ON channels(channel_type);

-- =============================================
-- 6. CREATE HELPER FUNCTIONS
-- =============================================

-- Increment message usage
CREATE OR REPLACE FUNCTION increment_message_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET messages_used_this_month = COALESCE(messages_used_this_month, 0) + 1,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET messages_used_this_month = 0,
        limit_warning_sent_at = NULL,
        limit_critical_sent_at = NULL,
        limit_exceeded_sent_at = NULL,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Add bonus messages
CREATE OR REPLACE FUNCTION add_bonus_messages(p_user_id UUID, p_bonus INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE profiles 
    SET overage_messages = COALESCE(overage_messages, 0) + p_bonus,
        updated_at = NOW()
    WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS
ALTER TABLE addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE clones ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;

-- Addons: Everyone can read active addons
DROP POLICY IF EXISTS "Anyone can read active addons" ON addons;
CREATE POLICY "Anyone can read active addons" ON addons
    FOR SELECT USING (is_active = true);

-- User_addons: Users can only see their own
DROP POLICY IF EXISTS "Users can view own addons" ON user_addons;
CREATE POLICY "Users can view own addons" ON user_addons
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own addons" ON user_addons;
CREATE POLICY "Users can insert own addons" ON user_addons
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Clones: Users can only see their own
DROP POLICY IF EXISTS "Users can view own clones" ON clones;
CREATE POLICY "Users can view own clones" ON clones
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own clones" ON clones;
CREATE POLICY "Users can manage own clones" ON clones
    FOR ALL USING (auth.uid() = user_id);

-- Channels: Users can only see their own
DROP POLICY IF EXISTS "Users can view own channels" ON channels;
CREATE POLICY "Users can view own channels" ON channels
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own channels" ON channels;
CREATE POLICY "Users can manage own channels" ON channels
    FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- 8. GRANT SERVICE ROLE ACCESS (for API routes)
-- =============================================

-- These allow the service role (used by API routes) to bypass RLS
GRANT ALL ON addons TO service_role;
GRANT ALL ON user_addons TO service_role;
GRANT ALL ON clones TO service_role;
GRANT ALL ON channels TO service_role;

-- =============================================
-- ✅ MIGRATION COMPLETE
-- =============================================

-- Verify tables exist
SELECT 
    'profiles' as table_name, 
    COUNT(*) as has_overage_columns 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'overage_channels'
UNION ALL
SELECT 'addons', COUNT(*) FROM addons WHERE 1=0
UNION ALL
SELECT 'user_addons', COUNT(*) FROM user_addons WHERE 1=0
UNION ALL
SELECT 'clones', COUNT(*) FROM clones WHERE 1=0
UNION ALL
SELECT 'channels', COUNT(*) FROM channels WHERE 1=0;
