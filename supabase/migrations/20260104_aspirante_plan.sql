-- ============================================
-- VirtualTwin Piano Aspirante Migration
-- Date: 4 Gennaio 2026
-- Adds Aspirante €49 entry-level plan to database
-- ============================================

-- =========================================
-- 1. UPDATE profiles.plan_tier CHECK CONSTRAINT
-- =========================================

-- Drop old constraint
ALTER TABLE public.profiles 
DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;

-- Add new constraint with 'aspirante'
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_plan_tier_check 
CHECK (plan_tier IN ('curioso', 'aspirante', 'esploratore', 'pioniere', 'conquistatore', 'imperatore'));

-- =========================================
-- 2. INSERT ASPIRANTE PLAN INTO pricing_plans
-- =========================================

INSERT INTO public.pricing_plans (
    name, display_name, tagline,
    founder_price_monthly, founder_price_yearly, 
    founder_spots_total, founder_spots_remaining,
    public_price_monthly, public_price_yearly,
    clones_limit, messages_limit, channels_limit, team_members_limit,
    analytics_retention_days, api_access, white_label, priority_support,
    ai_provider, ai_max_tokens, ai_priority,
    is_popular, is_active, sort_order
) VALUES (
    'aspirante',                           -- name
    'Aspirante',                           -- display_name
    'Il primo passo nel tuo impero',       -- tagline
    49,                                    -- founder_price_monthly (€49)
    490,                                   -- founder_price_yearly (€490)
    0,                                     -- founder_spots_total (no founder waves)
    0,                                     -- founder_spots_remaining
    49,                                    -- public_price_monthly (same as founder)
    490,                                   -- public_price_yearly
    1,                                     -- clones_limit
    500,                                   -- messages_limit
    1,                                     -- channels_limit
    1,                                     -- team_members_limit
    14,                                    -- analytics_retention_days
    FALSE,                                 -- api_access
    FALSE,                                 -- white_label
    FALSE,                                 -- priority_support
    'gemini-flash',                        -- ai_provider
    400,                                   -- ai_max_tokens
    'standard',                            -- ai_priority
    FALSE,                                 -- is_popular
    TRUE,                                  -- is_active
    1.5                                    -- sort_order (between curioso:1 and esploratore:2)
)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    tagline = EXCLUDED.tagline,
    founder_price_monthly = EXCLUDED.founder_price_monthly,
    public_price_monthly = EXCLUDED.public_price_monthly,
    messages_limit = EXCLUDED.messages_limit,
    updated_at = NOW();

-- =========================================
-- 3. VERIFY INSERTION
-- =========================================

-- This should return the Aspirante row:
-- SELECT name, display_name, founder_price_monthly, messages_limit 
-- FROM public.pricing_plans 
-- WHERE name = 'aspirante';

-- Expected result:
-- | name      | display_name | founder_price_monthly | messages_limit |
-- |-----------|--------------|----------------------|----------------|
-- | aspirante | Aspirante    | 49.00                | 500            |

-- ============================================
-- ASPIRANTE PLAN MIGRATION COMPLETE ✅
-- ============================================

-- Summary:
-- 1. Updated profiles.plan_tier CHECK constraint to include 'aspirante'
-- 2. Inserted Aspirante plan into pricing_plans table
-- 3. €49/mese permanent price (no founder discount)
-- 4. 500 messages/month, Gemini Flash AI
-- 5. Entry-level features: 1 clone, 1 channel, community, templates, course

-- Next Steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Create Stripe Product + Price
-- 3. Update pricing_plans.stripe_product_id with real Stripe ID
-- 4. Test checkout flow
