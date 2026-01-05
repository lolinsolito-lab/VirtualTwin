-- =============================================
-- IMPERIAL MASTER SYNC MIGRATION
-- Date: Gennaio 2026
-- Goal: Synchronizes Supabase with all Wave 1.5 & Wave 2 features
-- =============================================

-- 1. EXTEND PROFILES WITH SOVEREIGN METRICS
-- XP, Levels, and progress tracking for the Academy
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS completed_video_ids TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_sector TEXT,
ADD COLUMN IF NOT EXISTS target_client TEXT,
ADD COLUMN IF NOT EXISTS ai_tone TEXT DEFAULT 'professionale',
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS quizzes_passed JSONB DEFAULT '[]'::jsonb;

-- 2. UPDATE PLAN_TIER CONSTRAINTS
-- Ensure the check constraint includes 'aspirante' and follows the hierarchy
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_plan_tier_check 
CHECK (plan_tier IN ('curioso', 'aspirante', 'esploratore', 'pioniere', 'conquistatore', 'imperatore'));

-- 3. CLONE FAQS TABLE
-- Support for personalized AI training data
CREATE TABLE IF NOT EXISTS public.clone_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_clone_faqs_user_id ON public.clone_faqs(user_id);

-- RLS Security for clone_faqs
ALTER TABLE public.clone_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own faqs" ON public.clone_faqs
    FOR ALL USING (auth.uid() = user_id);

-- 4. CLEANUP & DEFAULTS
-- Ensure existing users have onboarding_completed set appropriately
UPDATE public.profiles SET onboarding_completed = TRUE WHERE onboarding_completed IS NULL;

-- 5. DOCUMENTATION
COMMENT ON COLUMN public.profiles.xp IS 'Sovereign XP for gamification';
COMMENT ON COLUMN public.profiles.level IS 'Sovereign Rank (calculated from XP)';
COMMENT ON COLUMN public.profiles.completed_video_ids IS 'Academy progress tracking';
COMMENT ON TABLE public.clone_faqs IS 'Training data for individual AI clones';

-- =============================================
-- FINAL SYNC COMPLETE ✅
-- =============================================
