-- =============================================
-- CHANNEL LIMIT TRIGGER V2 (WITH OVERAGE SUPPORT)
-- Now considers overage_channels in addition to base plan limit
-- =============================================

-- Drop existing trigger and function
DROP TRIGGER IF EXISTS enforce_channel_limit ON public.channels;
DROP FUNCTION IF EXISTS check_channel_limit();

-- =============================================
-- FUNCTION: check_channel_limit (V2)
-- =============================================
CREATE OR REPLACE FUNCTION check_channel_limit()
RETURNS TRIGGER AS $$
DECLARE
    current_count INTEGER;
    base_limit INTEGER;
    overage_amount INTEGER;
    total_limit INTEGER;
    user_plan TEXT;
BEGIN
    -- Get user's plan tier and overage
    SELECT plan_tier, COALESCE(overage_channels, 0) 
    INTO user_plan, overage_amount
    FROM public.profiles 
    WHERE id = NEW.user_id;
    
    -- Define BASE limits per plan
    base_limit := CASE user_plan
        WHEN 'curioso' THEN 0
        WHEN 'solopreneur' THEN 1
        WHEN 'entrepreneur' THEN 3
        WHEN 'conquistatore' THEN 10
        WHEN 'imperatore' THEN 25
        WHEN 'sovereignty' THEN -1  -- Unlimited
        -- Legacy tier names
        WHEN 'aspirante' THEN 1
        WHEN 'esploratore' THEN 2
        WHEN 'pioniere' THEN 5
        ELSE 1
    END;
    
    -- -1 = unlimited, skip check
    IF base_limit = -1 THEN
        RETURN NEW;
    END IF;
    
    -- 0 = no channels allowed (trial)
    IF base_limit = 0 THEN
        RAISE EXCEPTION 'Il piano Curioso non include canali. Effettua l''upgrade per connettere WhatsApp.';
    END IF;
    
    -- TOTAL = base + overage
    total_limit := base_limit + overage_amount;
    
    -- Count active channels
    SELECT COUNT(*) INTO current_count 
    FROM public.channels 
    WHERE user_id = NEW.user_id 
    AND is_active = true;
    
    -- Block if limit reached
    IF current_count >= total_limit THEN
        IF overage_amount > 0 THEN
            RAISE EXCEPTION 'Limite canali raggiunto (% / % con % extra). Acquista altri pacchetti.', 
                current_count, total_limit, overage_amount;
        ELSE
            RAISE EXCEPTION 'Limite canali raggiunto (% / %). Acquista canali extra o effettua upgrade.', 
                current_count, total_limit;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate trigger
CREATE TRIGGER enforce_channel_limit
    BEFORE INSERT ON public.channels
    FOR EACH ROW
    EXECUTE FUNCTION check_channel_limit();

-- Verification
SELECT trigger_name, event_manipulation, action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'enforce_channel_limit';

DO $$ BEGIN
    RAISE NOTICE 'Channel limit trigger V2 (with overage) created!';
END $$;
