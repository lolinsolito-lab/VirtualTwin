-- Migration: Add Setup Premium tracking columns
-- Run this in Supabase SQL Editor

-- Add columns to track Setup Premium purchases
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS setup_premium_purchased BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS setup_premium_purchased_at TIMESTAMPTZ;

-- Create index for faster queries on setup premium customers
CREATE INDEX IF NOT EXISTS idx_profiles_setup_premium 
ON profiles(setup_premium_purchased) 
WHERE setup_premium_purchased = TRUE;

-- Comment for documentation
COMMENT ON COLUMN profiles.setup_premium_purchased IS 'Whether user purchased the Setup Premium add-on';
COMMENT ON COLUMN profiles.setup_premium_purchased_at IS 'When the Setup Premium was purchased';

-- Optional: Create a general add-ons table for future scalability
-- Uncomment if you want to track multiple add-ons dynamically

/*
CREATE TABLE IF NOT EXISTS user_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    addon_id TEXT NOT NULL, -- e.g., 'setup_premium', 'extra_training', etc.
    addon_name TEXT NOT NULL,
    price_paid INTEGER NOT NULL, -- in cents
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active', -- active, refunded, expired
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, addon_id, purchased_at)
);

CREATE INDEX idx_user_addons_user ON user_addons(user_id);
CREATE INDEX idx_user_addons_addon ON user_addons(addon_id);

-- RLS policies for user_addons
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own add-ons" ON user_addons
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all add-ons" ON user_addons
    FOR ALL USING (auth.role() = 'service_role');
*/
