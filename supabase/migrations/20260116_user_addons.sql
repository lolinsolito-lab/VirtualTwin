-- Create user_addons table to track purchased add-ons
-- This enables the "I Miei Acquisti" section in user dashboard

CREATE TABLE IF NOT EXISTS user_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    addon_id UUID REFERENCES addons(id), -- Link to the addon product
    addon_name TEXT NOT NULL,
    addon_type TEXT NOT NULL DEFAULT 'service', -- service, pdf, ebook, video, audio, webinar, course, template
    price_paid INTEGER NOT NULL, -- in cents
    delivery_url TEXT, -- URL for digital products
    delivery_instructions TEXT, -- Instructions for access
    stripe_payment_intent_id TEXT,
    stripe_invoice_id TEXT,
    stripe_checkout_session_id TEXT,
    purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'active', -- active, refunded, expired, pending
    accessed_at TIMESTAMPTZ, -- When user first accessed the content
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_addons_user ON user_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_addon ON user_addons(addon_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_status ON user_addons(status);

-- RLS policies
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;

-- Users can view their own purchases
DROP POLICY IF EXISTS "Users can view their own add-ons" ON user_addons;
CREATE POLICY "Users can view their own add-ons" ON user_addons
    FOR SELECT USING (auth.uid() = user_id);

-- Service role can manage all (for webhooks/admin)
DROP POLICY IF EXISTS "Service role can manage all add-ons" ON user_addons;
CREATE POLICY "Service role can manage all add-ons" ON user_addons
    FOR ALL USING (true);

-- Comments
COMMENT ON TABLE user_addons IS 'Tracks user purchases of add-on products';
COMMENT ON COLUMN user_addons.addon_type IS 'Type: service, pdf, ebook, video, audio, webinar, course, template';
COMMENT ON COLUMN user_addons.delivery_url IS 'URL for accessing digital products';
