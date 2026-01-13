-- ========================================
-- 👑 VIRTUALTWIN REFERRAL SYSTEM - MIGRATION
-- Safe migration that doesn't damage existing data
-- Run this in Supabase SQL Editor
-- ========================================

-- 1. Add referral columns to profiles table (IF NOT EXISTS for safety)
DO $$ 
BEGIN
    -- Add referral_code column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'referral_code'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referral_code TEXT UNIQUE;
    END IF;
    
    -- Add referrals_count column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'referrals_count'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referrals_count INTEGER DEFAULT 0;
    END IF;
    
    -- Add referral_reward_pending column
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'referral_reward_pending'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referral_reward_pending BOOLEAN DEFAULT FALSE;
    END IF;
    
    -- Add referred_by column (who referred this user)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'referred_by'
    ) THEN
        ALTER TABLE profiles ADD COLUMN referred_by UUID REFERENCES profiles(id);
    END IF;
END $$;

-- 2. Create index for fast referral code lookup
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON profiles(referral_code);

-- 3. Create referral_logs table for analytics
CREATE TABLE IF NOT EXISTS referral_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    referred_user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    referred_email TEXT,
    referral_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Enable RLS on referral_logs
ALTER TABLE referral_logs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policy: Users can only see their own referral logs
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'referral_logs' AND policyname = 'Users can view own referral logs'
    ) THEN
        CREATE POLICY "Users can view own referral logs"
            ON referral_logs
            FOR SELECT
            USING (referrer_id = auth.uid());
    END IF;
END $$;

-- 6. RLS Policy: Allow inserts from authenticated users (for tracking)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'referral_logs' AND policyname = 'Allow referral log inserts'
    ) THEN
        CREATE POLICY "Allow referral log inserts"
            ON referral_logs
            FOR INSERT
            WITH CHECK (true);
    END IF;
END $$;

-- 7. Create index for analytics queries
CREATE INDEX IF NOT EXISTS idx_referral_logs_referrer ON referral_logs(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referral_logs_created ON referral_logs(created_at);

-- ========================================
-- ✅ VERIFICATION QUERY (Run after migration)
-- ========================================
-- SELECT 
--     column_name, 
--     data_type, 
--     column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'profiles' 
-- AND column_name IN ('referral_code', 'referrals_count', 'referral_reward_pending', 'referred_by');

-- ========================================
-- Done! The referral system is ready.
-- ========================================
