-- =============================================
-- WAVE 12: IMPERIAL QUOTA ENFORCEMENT & ENTERPRISE FEATURES
-- Ensures "Zero Smoke" technical enforcement of limits.
-- =============================================

-- 1. Add API Key and White-label support to Clones
ALTER TABLE public.clones 
ADD COLUMN IF NOT EXISTS api_key UUID DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS white_label_active BOOLEAN DEFAULT FALSE;

-- BACKFILL: Ensure existing clones get an API key
UPDATE public.clones SET api_key = gen_random_uuid() WHERE api_key IS NULL;

-- 2. Add Quota Reset logic metadata to Profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS quota_reset_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '30 days');

-- 3. Function to sync message limits based on plan_tier
-- This ensures the DB always knows the exact limit without relying on frontend.
CREATE OR REPLACE FUNCTION public.sync_plan_limits()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.plan_tier = 'curioso' THEN
    NEW.messages_limit := 100;
  ELSIF NEW.plan_tier = 'aspirante' THEN
    NEW.messages_limit := 500;
  ELSIF NEW.plan_tier = 'esploratore' THEN
    NEW.messages_limit := 1000;
  ELSIF NEW.plan_tier = 'pioniere' THEN
    NEW.messages_limit := 5000;
  ELSIF NEW.plan_tier = 'conquistatore' THEN
    NEW.messages_limit := 20000;
  ELSIF NEW.plan_tier = 'imperatore' THEN
    NEW.messages_limit := 50000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger to sync limits on insert or update of plan_tier
DROP TRIGGER IF EXISTS trigger_sync_plan_limits ON public.profiles;
CREATE TRIGGER trigger_sync_plan_limits
BEFORE INSERT OR UPDATE OF plan_tier ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.sync_plan_limits();

-- 5. Trigger to automatically activate white-label for Imperatore
CREATE OR REPLACE FUNCTION public.handle_enterprise_features()
RETURNS TRIGGER AS $$
BEGIN
  -- If plan is Imperatore, enable white-label for ALL their clones
  IF NEW.plan_tier = 'imperatore' THEN
    UPDATE public.clones 
    SET white_label_active = TRUE 
    WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_enterprise_features ON public.profiles;
CREATE TRIGGER trigger_enterprise_features
AFTER UPDATE OF plan_tier ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.handle_enterprise_features();

-- 6. RPC Function for atomic message increment
CREATE OR REPLACE FUNCTION public.increment_message_usage(p_user_id UUID, p_clone_id UUID)
RETURNS VOID AS $$
BEGIN
  -- Increment Profile counter
  UPDATE public.profiles 
  SET messages_used_this_month = messages_used_this_month + 1 
  WHERE id = p_user_id;

  -- Increment Clone counter
  UPDATE public.clones 
  SET total_messages = total_messages + 1 
  WHERE id = p_clone_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Update existing profiles with their limits
UPDATE public.profiles SET plan_tier = plan_tier; 
