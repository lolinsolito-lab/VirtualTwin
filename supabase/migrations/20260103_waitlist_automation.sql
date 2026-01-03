-- Upgrade waitlist table for automated system
-- Run as migration: 20260103_waitlist_automation.sql

-- Add new columns for token-based checkout system
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS checkout_token UUID DEFAULT uuid_generate_v4();
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS token_expires_at TIMESTAMPTZ;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS token_status TEXT DEFAULT 'pending';
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS position_in_queue INTEGER;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS stripe_payment_intent_id TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS next_wave TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS current_wave TEXT;

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
CREATE INDEX IF NOT EXISTS idx_waitlist_token ON waitlist(checkout_token);
CREATE INDEX IF NOT EXISTS idx_waitlist_status_queue ON waitlist(token_status, position_in_queue);
CREATE INDEX IF NOT EXISTS idx_waitlist_expires ON waitlist(token_expires_at) WHERE token_status = 'sent';
CREATE INDEX IF NOT EXISTS idx_waitlist_wave_plan ON waitlist(next_wave, plan, token_status);

-- Add comment for documentation
COMMENT ON COLUMN waitlist.checkout_token IS 'Unique token for 24h exclusive checkout access';
COMMENT ON COLUMN waitlist.token_status IS 'pending: in queue | sent: email sent | used: purchased | expired: 24h passed';
COMMENT ON COLUMN waitlist.position_in_queue IS 'Position in waitlist queue (1 = first)';
