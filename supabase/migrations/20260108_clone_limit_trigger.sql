-- =============================================
-- CLONE LIMIT ENFORCEMENT TRIGGER
-- Prevents users from creating clones beyond their plan limit
-- =============================================

-- Drop existing trigger if exists (for re-running)
DROP TRIGGER IF EXISTS enforce_clone_limit ON public.clones;
DROP FUNCTION IF EXISTS check_clone_limit();

-- =============================================
-- FUNCTION: check_clone_limit
-- =============================================
CREATE OR REPLACE FUNCTION check_clone_limit()
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
        WHEN 'curioso' THEN 1
        WHEN 'solopreneur' THEN 1
        WHEN 'entrepreneur' THEN 3
        WHEN 'conquistatore' THEN 5
        WHEN 'imperatore' THEN 15
        WHEN 'sovereignty' THEN 999  -- Unlimited
        -- Legacy tier names (backward compatibility)
        WHEN 'aspirante' THEN 1
        WHEN 'esploratore' THEN 2
        WHEN 'pioniere' THEN 5
        ELSE 1  -- Default to 1 for unknown tiers
    END;
    
    -- 999 = unlimited, skip check
    IF plan_limit >= 999 THEN
        RETURN NEW;
    END IF;
    
    -- Count active clones for this user
    SELECT COUNT(*) INTO current_count 
    FROM public.clones 
    WHERE user_id = NEW.user_id 
    AND is_active = true;
    
    -- Block if limit reached
    IF current_count >= plan_limit THEN
        RAISE EXCEPTION 'Limite cloni raggiunto (% / %). Effettua l''upgrade per aggiungere altri cloni.', current_count, plan_limit;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- TRIGGER: enforce_clone_limit
-- Fires BEFORE INSERT on clones table
-- =============================================
CREATE TRIGGER enforce_clone_limit
    BEFORE INSERT ON public.clones
    FOR EACH ROW
    EXECUTE FUNCTION check_clone_limit();

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
WHERE trigger_name = 'enforce_clone_limit';

-- Test messages (comment out in production)
DO $$
BEGIN
    RAISE NOTICE 'Clone limit enforcement trigger created successfully!';
    RAISE NOTICE 'Limits: curioso=1, solopreneur=1, entrepreneur=3, conquistatore=5, imperatore=15, sovereignty=unlimited';
END $$;
