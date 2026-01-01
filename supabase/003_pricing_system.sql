-- =============================================
-- VIRTUALTWIN - PRICING SYSTEM MIGRATION
-- Founder vs Public Pricing + Stripe Integration
-- =============================================
-- Run AFTER schema.sql and 002_critical_fixes.sql
-- =============================================

-- =============================================
-- 1. PRICING PLANS TABLE (Reference table)
-- =============================================
CREATE TABLE IF NOT EXISTS public.pricing_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,  -- curioso, esploratore, etc.
    display_name VARCHAR(100) NOT NULL,
    tagline TEXT,
    
    -- Founder Pricing
    founder_price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    founder_price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
    founder_spots_total INTEGER NOT NULL DEFAULT 0,
    founder_spots_remaining INTEGER NOT NULL DEFAULT 0,
    founder_discount_percent INTEGER DEFAULT 40,
    
    -- Public Pricing
    public_price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
    public_price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0,
    
    -- Stripe IDs
    stripe_product_id VARCHAR(100),
    stripe_founder_price_monthly VARCHAR(100),
    stripe_founder_price_yearly VARCHAR(100),
    stripe_public_price_monthly VARCHAR(100),
    stripe_public_price_yearly VARCHAR(100),
    
    -- Features & Limits
    clones_limit INTEGER DEFAULT 1,
    messages_limit INTEGER DEFAULT 100,
    channels_limit INTEGER DEFAULT 1,
    team_members_limit INTEGER DEFAULT 1,
    analytics_retention_days INTEGER DEFAULT 7,
    api_access BOOLEAN DEFAULT FALSE,
    white_label BOOLEAN DEFAULT FALSE,
    priority_support BOOLEAN DEFAULT FALSE,
    
    -- AI Configuration
    ai_provider VARCHAR(50) DEFAULT 'gemini-flash',
    ai_max_tokens INTEGER DEFAULT 300,
    ai_priority VARCHAR(20) DEFAULT 'standard',
    
    -- Flags
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 2. INSERT PRICING PLANS DATA
-- =============================================

-- Clear existing plans (if re-running migration)
DELETE FROM public.pricing_plans;

INSERT INTO public.pricing_plans (
    name, display_name, tagline,
    founder_price_monthly, founder_price_yearly, founder_spots_total, founder_spots_remaining,
    public_price_monthly, public_price_yearly,
    clones_limit, messages_limit, channels_limit, team_members_limit,
    analytics_retention_days, api_access, white_label, priority_support,
    ai_provider, ai_max_tokens, ai_priority,
    is_popular, sort_order
) VALUES
-- CURIOSO (Free)
(
    'curioso', 'Curioso', 'Per testare il potere dell''AI',
    0, 0, 1000, 1000,
    0, 0,
    1, 100, 1, 1,
    7, FALSE, FALSE, FALSE,
    'gemini-flash', 300, 'standard',
    FALSE, 1
),
-- ESPLORATORE
(
    'esploratore', 'Esploratore', 'Per chi inizia a scalare',
    39, 390, 200, 200,
    65, 650,
    1, 1000, 2, 1,
    30, FALSE, FALSE, FALSE,
    'gemini-flash', 500, 'standard',
    FALSE, 2
),
-- PIONIERE (Popular)
(
    'pioniere', 'Pioniere', 'Il più scelto dai professionisti',
    97, 970, 150, 150,
    162, 1620,
    3, 5000, 3, 3,
    90, TRUE, FALSE, TRUE,
    'gemini-pro', 800, 'high',
    TRUE, 3
),
-- CONQUISTATORE
(
    'conquistatore', 'Conquistatore', 'Per chi domina il mercato',
    197, 1970, 50, 50,
    328, 3280,
    5, 20000, 10, 10,
    365, TRUE, FALSE, TRUE,
    'gpt-4o', 1000, 'priority',
    FALSE, 4
),
-- IMPERATORE
(
    'imperatore', 'Imperatore', 'L''impero digitale definitivo',
    397, 3970, 25, 25,
    662, 6620,
    10, 999999, 999, 50,
    730, TRUE, TRUE, TRUE,
    'gpt-4-turbo', 1500, 'priority',
    FALSE, 5
);

-- =============================================
-- 3. UPDATE PROFILES TABLE FOR NEW PRICING
-- =============================================

-- Add new pricing-related columns
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS pricing_type VARCHAR(20) DEFAULT 'founder' CHECK (pricing_type IN ('founder', 'public', 'grandfathered'));

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(20) DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly'));

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS current_price DECIMAL(10,2) DEFAULT 0;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMPTZ;

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN DEFAULT FALSE;

-- =============================================
-- 4. FOUNDER TRACKING FUNCTION
-- =============================================

-- Function to assign founder number and decrement spots
CREATE OR REPLACE FUNCTION assign_founder_spot()
RETURNS TRIGGER AS $$
DECLARE
    plan_spots INTEGER;
    new_founder_number INTEGER;
BEGIN
    -- Only for new founders
    IF NEW.is_founder = TRUE AND (OLD IS NULL OR OLD.is_founder = FALSE) THEN
        -- Get remaining spots for the plan
        SELECT founder_spots_remaining INTO plan_spots
        FROM public.pricing_plans
        WHERE name = NEW.plan_tier;
        
        -- Check if spots available
        IF plan_spots <= 0 THEN
            RAISE EXCEPTION 'No founder spots remaining for plan %', NEW.plan_tier;
        END IF;
        
        -- Decrement spots
        UPDATE public.pricing_plans
        SET founder_spots_remaining = founder_spots_remaining - 1,
            updated_at = NOW()
        WHERE name = NEW.plan_tier;
        
        -- Get next founder number
        SELECT COALESCE(MAX(founder_number), 0) + 1 INTO new_founder_number
        FROM public.profiles
        WHERE is_founder = TRUE;
        
        -- Assign founder number
        NEW.founder_number = new_founder_number;
        NEW.founder_joined_at = NOW();
        NEW.pricing_type = 'founder';
        
        -- Set founder price
        SELECT founder_price_monthly INTO NEW.current_price
        FROM public.pricing_plans
        WHERE name = NEW.plan_tier;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS on_founder_assignment ON public.profiles;
CREATE TRIGGER on_founder_assignment
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_founder_spot();

-- =============================================
-- 5. PRICING VIEW (For API/Dashboard)
-- =============================================

CREATE OR REPLACE VIEW public.pricing_availability AS
SELECT 
    name,
    display_name,
    tagline,
    founder_price_monthly,
    founder_price_yearly,
    public_price_monthly,
    public_price_yearly,
    founder_spots_total,
    founder_spots_remaining,
    CASE WHEN founder_spots_remaining <= 0 THEN TRUE ELSE FALSE END as is_sold_out,
    ROUND((1.0 - (founder_spots_remaining::DECIMAL / NULLIF(founder_spots_total, 0))) * 100, 1) as percent_sold,
    founder_discount_percent,
    clones_limit,
    messages_limit,
    channels_limit,
    ai_provider,
    is_popular,
    sort_order
FROM public.pricing_plans
WHERE is_active = TRUE
ORDER BY sort_order;

-- Grant public access to pricing view
GRANT SELECT ON public.pricing_availability TO anon;
GRANT SELECT ON public.pricing_availability TO authenticated;

-- =============================================
-- 6. INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_pricing_plans_name ON public.pricing_plans(name);
CREATE INDEX IF NOT EXISTS idx_profiles_pricing_type ON public.profiles(pricing_type);
CREATE INDEX IF NOT EXISTS idx_profiles_billing_cycle ON public.profiles(billing_cycle);

-- =============================================
-- DONE! Pricing system ready ✅
-- =============================================

-- Summary:
-- - pricing_plans table with all 5 tiers
-- - Founder vs Public pricing structure
-- - Auto founder assignment trigger
-- - pricing_availability view for frontend
-- - Stripe ID placeholders ready
