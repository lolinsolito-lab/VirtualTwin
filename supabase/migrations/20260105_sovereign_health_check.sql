-- =============================================
-- SOVEREIGN IMPERIAL HEALTH CHECK
-- Goal: Verify the database state after Wave 2 Sync
-- =============================================

-- 1. VERIFY PROFILES COLUMNS (SOVEREIGN FIELDS)
SELECT 
    column_name, 
    data_type, 
    column_default, 
    is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
AND column_name IN (
    'xp', 'level', 'completed_video_ids', 
    'onboarding_completed', 'business_sector', 
    'ai_tone', 'badges', 'quizzes_passed'
)
ORDER BY column_name;

-- 2. VERIFY NEW TABLES
SELECT 
    table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('clone_faqs', 'billing_events', 'waitlist');

-- 3. VERIFY TIER CONSTRAINTS
SELECT 
    conname as constraint_name, 
    pg_get_constraintdef(oid) as definition
FROM pg_constraint 
WHERE conname = 'profiles_plan_tier_check';

-- 4. VERIFY ONBOARDING DEFAULTS (SAMPLED)
-- Checks if existing users have onboarding_completed set
SELECT 
    id, email, onboarding_completed, plan_tier, xp, level
FROM public.profiles 
LIMIT 5;

-- 5. VERIFY CLONE_FAQS STRUCTURE
SELECT 
    column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clone_faqs';

-- =============================================
-- HEALTH CHECK SCRIPT END
-- =============================================
