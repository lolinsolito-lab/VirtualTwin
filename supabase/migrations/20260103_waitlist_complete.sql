-- ========================================
-- COMPLETE WAITLIST TABLE SETUP
-- Run this AFTER checking existing structure
-- ========================================

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL,
    name TEXT,
    plan TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Wave tracking
    current_wave TEXT,
    next_wave TEXT,
    
    -- Token-based checkout
    checkout_token UUID DEFAULT uuid_generate_v4(),
    token_expires_at TIMESTAMPTZ,
    token_status TEXT DEFAULT 'pending',
    position_in_queue INTEGER,
    
    -- Stripe integration
    stripe_customer_id TEXT,
    stripe_payment_intent_id TEXT,
    
    -- Metadata
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS plan TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS current_wave TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS next_wave TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS checkout_token UUID DEFAULT uuid_generate_v4();
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS token_status TEXT DEFAULT 'pending';
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS position_in_queue INTEGER;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Add CHECK constraint for token_status
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'waitlist_token_status_check'
    ) THEN
        ALTER TABLE waitlist ADD CONSTRAINT waitlist_token_status_check 
        CHECK (token_status IN ('pending', 'sent', 'used', 'expired'));
    END IF;
END $$;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_token ON waitlist(checkout_token);
CREATE INDEX IF NOT EXISTS idx_waitlist_status_queue ON waitlist(token_status, position_in_queue);
CREATE INDEX IF NOT EXISTS idx_waitlist_expires ON waitlist(token_expires_at) WHERE token_status = 'sent';
CREATE INDEX IF NOT EXISTS idx_waitlist_wave_plan ON waitlist(next_wave, plan, token_status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE waitlist IS 'Automated waitlist system for sold-out Founder waves';
COMMENT ON COLUMN waitlist.checkout_token IS 'Unique token for 24h exclusive checkout access';
COMMENT ON COLUMN waitlist.token_status IS 'pending: in queue | sent: email sent | used: purchased | expired: 24h passed';
COMMENT ON COLUMN waitlist.position_in_queue IS 'Position in waitlist queue (1 = first)';
COMMENT ON COLUMN waitlist.next_wave IS 'Wave ID user is waiting for (e.g., pioneer, elite)';
COMMENT ON COLUMN waitlist.current_wave IS 'Wave ID that was sold out when user joined waitlist';

-- Verify final structure
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
ORDER BY ordinal_position;
