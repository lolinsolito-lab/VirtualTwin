-- ============================================
-- VirtualTwin Sovereign Economics Migration
-- ELITE EDITION - Bulletproof
-- Date: 1 Gennaio 2026
-- ============================================

-- =========================================
-- STEP 1: Add all columns to profiles table
-- =========================================
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'curioso';

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_trial_active BOOLEAN DEFAULT false;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'public';

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS monthly_messages_used INTEGER DEFAULT 0;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS monthly_api_requests INTEGER DEFAULT 0;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS usage_reset_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS api_key TEXT;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS api_enabled BOOLEAN DEFAULT false;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_founder BOOLEAN DEFAULT false;

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS founder_joined_at TIMESTAMPTZ;

-- =========================================
-- STEP 2: Create plan_limits table
-- =========================================
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

-- =========================================
-- STEP 3: Insert plan limits data
-- =========================================
INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('curioso', 'public', 0, 1, 100, 1, false, null, false, 0, null, null)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('esploratore', 'founder', 39, 1, 1000, 1, false, null, false, 0, null, null)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('esploratore', 'public', 79, 1, 1000, 1, false, null, false, 0, null, null)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('pioniere', 'founder', 97, 1, 5000, 3, false, null, true, 20, null, null)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('pioniere', 'public', 197, 1, 5000, 3, false, null, true, 20, null, null)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('conquistatore', 'founder', 197, 3, 20000, 9, true, 60, true, 100, null, null)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('conquistatore', 'public', 397, 3, 20000, 9, true, 60, true, 100, null, null)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('imperatore', 'founder', 595, 10, 50000, 999, true, 300, true, 100, 100000, 250000)
ON CONFLICT (plan, tier) DO NOTHING;

INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, api_rate_limit_per_minute, a_b_testing_enabled, a_b_testing_traffic_percent, fair_use_soft_limit, fair_use_hard_limit) VALUES
  ('imperatore', 'public', 797, 10, 50000, 999, true, 300, true, 100, 100000, 250000)
ON CONFLICT (plan, tier) DO NOTHING;

-- =========================================
-- STEP 4: Create api_usage_logs table
-- =========================================
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

-- =========================================
-- STEP 5: Create helper functions
-- =========================================
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

-- =========================================
-- STEP 6: Enable RLS and create policies
-- =========================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

ALTER TABLE plan_limits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Everyone can view plan limits" ON plan_limits;
CREATE POLICY "Everyone can view plan limits"
  ON plan_limits FOR SELECT
  TO authenticated
  USING (true);

ALTER TABLE api_usage_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own API logs" ON api_usage_logs;
CREATE POLICY "Users can view own API logs"
  ON api_usage_logs FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own API logs" ON api_usage_logs;
CREATE POLICY "Users can insert own API logs"
  ON api_usage_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =========================================
-- STEP 7: Create indexes for performance
-- =========================================
CREATE INDEX IF NOT EXISTS idx_profiles_plan_tier 
  ON profiles(plan, plan_tier);

CREATE INDEX IF NOT EXISTS idx_profiles_trial_status 
  ON profiles(is_trial_active, trial_ends_at) 
  WHERE is_trial_active = true;

CREATE INDEX IF NOT EXISTS idx_profiles_founder 
  ON profiles(is_founder) 
  WHERE is_founder = true;

-- =========================================
-- STEP 8: Create founder count view
-- =========================================
CREATE OR REPLACE VIEW active_founder_count AS
SELECT COUNT(*) as total_founders
FROM profiles
WHERE is_founder = true;

-- ============================================
-- MIGRATION COMPLETE ✅
-- ============================================
