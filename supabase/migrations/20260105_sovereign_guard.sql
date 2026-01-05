-- =============================================
-- WAVE 1: SOVEREIGN GUARD INFRASTRUCTURE
-- =============================================
-- Adds XP, Leveling, and Progress tracking to profiles
-- =============================================

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS xp INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS completed_video_ids TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS quizzes_passed JSONB DEFAULT '[]'::jsonb;

-- Comment for documentation
COMMENT ON COLUMN public.profiles.xp IS 'Points earned through academy and platform engagement';
COMMENT ON COLUMN public.profiles.level IS 'Sovereign rank based on XP';
COMMENT ON COLUMN public.profiles.completed_video_ids IS 'Array of Academy video IDs completed by the user';
COMMENT ON COLUMN public.profiles.badges IS 'JSON array of earned achievement badges';
COMMENT ON COLUMN public.profiles.streak_days IS 'Consecutive days of platform activity';
COMMENT ON COLUMN public.profiles.quizzes_passed IS 'JSON object tracking results of academy quizzes';
