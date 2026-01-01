-- ============================================
-- VirtualTwin Sovereign Economics Migration
-- Date: 1 Gennaio 2026
-- Version: 1.0
-- ============================================

BEGIN;

-- 1. UPDATE profiles table - Add trial tracking columns
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS is_trial_active BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS monthly_messages_used INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_api_requests INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS usage_reset_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS api_key TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS api_enabled BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS founder_joined_at TIMESTAMPTZ;

-- 2. Initialize trial for existing curioso users
UPDATE profiles
SET 
  trial_started_at = created_at,
  trial_ends_at = created_at + INTERVAL '14 days',
  is_trial_active = CASE 
    WHEN created_at + INTERVAL '14 days' > NOW() THEN true
    ELSE false
  END
WHERE plan = 'curioso' 
  AND trial_started_at IS NULL;

-- 3. CREATE plan_limits table
CREATE TABLE IF NOT EXISTS plan_limits (
  plan TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('founder', 'public')),
  price_eur INTEGER NOT NULL,
  max_clones INTEGER NOT NULL,
  max_messages_monthly INTEGER NOT NULL,
  max_channels INTEGER NOT NULL,
  api_enabled BOOLEAN DEFAULT false,
  api_rate_limit_per_minute INTEGER,
  a_b_testing_enabled BOOLEAN DEFAULT false,
  a_b_testing_traffic_percent INTEGER DEFAULT 0,
  fair_use_soft_limit INTEGER,
  fair_use_hard_limit INTEGER,
  PRIMARY KEY (plan, tier)
);

-- 4. INSERT plan limits (Founder + Public tiers)
INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('curioso', 'public', 0, 1, 100, 1, false, null, false, 0, null, null),
  ('esploratore', 'founder', 39, 1, 1000, 1, false, null, false, 0, null, null),
  ('esploratore', 'public', 79, 1, 1000, 1, false, null, false, 0, null, null),
  ('pioniere', 'founder', 97, 1, 5000, 3, false, null, true, 20, null, null),
  ('pioniere', 'public', 197, 1, 5000, 3, false, null, true, 20, null, null),
  ('conquistatore', 'founder', 197, 3, 20000, 9, true, 60, true, 100, null, null),
  ('conquistatore', 'public', 397, 3, 20000, 9, true, 60, true, 100, null, null),
  ('imperatore', 'founder', 595, 10, 50000, 999, true, 300, true, 100, 100000, 250000),
  ('imperatore', 'public', 797, 10, 50000, 999, true, 300, true, 100, 100000, 250000)
ON CONFLICT (plan, tier) DO NOTHING;

-- 5. CREATE api_usage_logs table
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  tokens_used INTEGER,
  cost_eur DECIMAL(10,4),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_user_date 
  ON api_usage_logs(user_id, created_at DESC);

-- 6. Function: get monthly API usage
CREATE OR REPLACE FUNCTION get_monthly_api_usage(p_user_id UUID)
RETURNS TABLE (
  total_requests BIGINT,
  total_tokens BIGINT,
  total_cost_eur DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT,
    COALESCE(SUM(tokens_used), 0)::BIGINT,
    COALESCE(SUM(cost_eur), 0)::DECIMAL
  FROM api_usage_logs
  WHERE user_id = p_user_id
    AND created_at >= date_trunc('month', NOW());
END;
$$ LANGUAGE plpgsql;

-- 7. Function: reset monthly usage
CREATE OR REPLACE FUNCTION reset_monthly_usage()
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET 
    monthly_messages_used = 0,
    monthly_api_requests = 0,
    usage_reset_at = NOW()
  WHERE date_trunc('month', usage_reset_at) < date_trunc('month', NOW());
END;
$$ LANGUAGE plpgsql;

-- 8. Function: check trial expiry
CREATE OR REPLACE FUNCTION is_trial_expired(p_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_trial_ends_at TIMESTAMPTZ;
BEGIN
  SELECT trial_ends_at INTO v_trial_ends_at
  FROM profiles
  WHERE id = p_user_id;
  
  RETURN (v_trial_ends_at IS NOT NULL AND v_trial_ends_at < NOW());
END;
$$ LANGUAGE plpgsql;

-- 9. RLS Policies: profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- 10. RLS Policies: plan_limits (read-only for authenticated)
ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view plan limits" ON plan_limits;
CREATE POLICY "Everyone can view plan limits"
  ON plan_limits FOR SELECT
  TO authenticated
  USING (true);

-- 11. RLS Policies: api_usage_logs
ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own API logs" ON api_usage_logs;
CREATE POLICY "Users can view own API logs"
  ON api_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own API logs" ON api_usage_logs;
CREATE POLICY "Users can insert own API logs"
  ON api_usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 12. Performance indexes
CREATE INDEX IF NOT EXISTS idx_profiles_plan_tier 
  ON profiles(plan, plan_tier);

CREATE INDEX IF NOT EXISTS idx_profiles_trial_status 
  ON profiles(is_trial_active, trial_ends_at) 
  WHERE is_trial_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_founder 
  ON profiles(is_founder) 
  WHERE is_founder = true;

-- 13. Trigger: auto-update trial status
CREATE OR REPLACE FUNCTION update_trial_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.trial_ends_at < NOW() AND NEW.is_trial_active = true THEN
    NEW.is_trial_active = false;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_trial_status ON profiles;
CREATE TRIGGER trigger_update_trial_status
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_trial_status();

-- 14. View: active_founder_count (for 153 limit tracking)
CREATE OR REPLACE VIEW active_founder_count AS
SELECT COUNT(*) as total_founders
FROM profiles
WHERE is_founder = true;

COMMIT;

-- ============================================
-- Migration Complete ✅
-- Run this in Supabase SQL Editor
-- ============================================
