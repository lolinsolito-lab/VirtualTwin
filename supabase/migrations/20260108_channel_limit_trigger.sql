-- =============================================
-- CHANNEL LIMIT ENFORCEMENT TRIGGER
-- Prevents users from creating channels beyond their plan limit
-- =============================================

-- Drop existing trigger if exists (for re-running)
DROP TRIGGER IF EXISTS enforce_channel_limit ON public.channels;
DROP FUNCTION IF EXISTS check_channel_limit();

-- =============================================
-- FUNCTION: check_channel_limit
-- =============================================
CREATE OR REPLACE FUNCTION check_channel_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    plan_limit INTEGER;
    user_plan TEXT;
BEGIN
    -- Get user's plan tier
    SELECT plan_tier INTO user_plan 
    FROM public.profiles 
    WHERE id = NEW.user_id;
    
    -- Define limits per plan (matching lib/pricing.ts PLAN_LIMITS)
    plan_limit := CASE user_plan
        WHEN 'curioso' THEN 0
        WHEN 'solopreneur' THEN 1
        WHEN 'entrepreneur' THEN 3
        WHEN 'conquistatore' THEN 10
        WHEN 'imperatore' THEN 25
        WHEN 'sovereignty' THEN -1  -- Unlimited
        -- Legacy tier names (backward compatibility)
        WHEN 'aspirante' THEN 1
        WHEN 'esploratore' THEN 2
        WHEN 'pioniere' THEN 5
        ELSE 1  -- Default to 1 for unknown tiers
    END;
    
    -- -1 = unlimited, skip check
    IF plan_limit = -1 THEN
        RETURN NEW;
    END IF;
    
    -- 0 = no channels allowed (trial)
    IF plan_limit = 0 THEN
        RAISE EXCEPTION 'Il piano Curioso non include canali. Effettua l''upgrade per connettere WhatsApp.';
    END IF;
    
    -- Count active channels for this user
    SELECT COUNT(*) INTO current_count 
    FROM public.channels 
    WHERE user_id = NEW.user_id 
    AND is_active = true;
    
    -- Block if limit reached
    IF current_count >= plan_limit THEN
        RAISE EXCEPTION 'Limite canali raggiunto (% / %). Effettua l''upgrade per aggiungere altri canali.', current_count, plan_limit;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGER: enforce_channel_limit
-- Fires BEFORE INSERT on channels table
-- =============================================
CREATE TRIGGER enforce_channel_limit
    BEFORE INSERT ON public.channels
    FOR EACH ROW
    EXECUTE FUNCTION check_channel_limit();

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check trigger exists
SELECT 
    trigger_name, 
    event_manipulation, 
    action_timing,
    action_statement 
FROM information_schema.triggers 
WHERE trigger_name = 'enforce_channel_limit';

-- Test messages (comment out in production)
-- These will show successful creation
DO $$
BEGIN
    RAISE NOTICE 'Channel limit enforcement trigger created successfully!';
    RAISE NOTICE 'Limits: curioso=0, solopreneur=1, entrepreneur=3, conquistatore=10, imperatore=25, sovereignty=unlimited';
END $$;
