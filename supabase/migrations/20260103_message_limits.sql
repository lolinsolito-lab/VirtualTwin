-- =============================================
-- MESSAGE LIMITS TRACKING SYSTEM
-- Adds columns for usage tracking and notification timestamps
-- =============================================

-- Add usage tracking columns to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS messages_used_this_month INTEGER DEFAULT 0;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS limit_warning_sent_at TIMESTAMPTZ;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS limit_critical_sent_at TIMESTAMPTZ;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS limit_exceeded_sent_at TIMESTAMPTZ;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS billing_cycle_start DATE DEFAULT CURRENT_DATE;

-- Function to increment usage atomically
CREATE OR REPLACE FUNCTION increment_message_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET messages_used_this_month = COALESCE(messages_used_this_month, 0) + 1
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to reset monthly usage (called on payment)
CREATE OR REPLACE FUNCTION reset_monthly_usage(p_user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    messages_used_this_month = 0,
    limit_warning_sent_at = NULL,
    limit_critical_sent_at = NULL,
    limit_exceeded_sent_at = NULL,
    billing_cycle_start = CURRENT_DATE
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Function to add bonus messages (for upgrades/referrals)
CREATE OR REPLACE FUNCTION add_bonus_messages(p_user_id UUID, p_bonus INTEGER)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET messages_used_this_month = GREATEST(0, COALESCE(messages_used_this_month, 0) - p_bonus)
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql;

-- Index for quick lookups
CREATE INDEX IF NOT EXISTS idx_profiles_messages_used 
ON profiles(messages_used_this_month);

-- Comments
COMMENT ON COLUMN profiles.messages_used_this_month IS 'Number of AI messages used in current billing cycle';
COMMENT ON COLUMN profiles.limit_warning_sent_at IS 'When 75% limit warning email was sent';
COMMENT ON COLUMN profiles.limit_critical_sent_at IS 'When 90% critical email was sent';
COMMENT ON COLUMN profiles.limit_exceeded_sent_at IS 'When 100% exceeded email was sent';
COMMENT ON COLUMN profiles.billing_cycle_start IS 'Start date of current billing cycle';
