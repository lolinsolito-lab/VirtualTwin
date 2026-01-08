-- =============================================
-- PRICING SUSTAINABILITY UPDATE
-- Update channel limits to sustainable levels
-- =============================================

-- 1. Update pricing_plans table
UPDATE pricing_plans 
SET channels_limit = 10 
WHERE name = 'conquistatore';

UPDATE pricing_plans 
SET channels_limit = 25 
WHERE name = 'imperatore';

-- 2. Update plan_limits table
UPDATE plan_limits 
SET max_channels = 10 
WHERE plan = 'conquistatore';

UPDATE plan_limits 
SET max_channels = 25 
WHERE plan = 'imperatore';

-- 3. Add overage columns to profiles (if not exists)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS overage_channels INT DEFAULT 0;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS overage_clones INT DEFAULT 0;

ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS overage_conversations INT DEFAULT 0;

-- 4. Verify updates
SELECT name, channels_limit FROM pricing_plans ORDER BY sort_order;
SELECT plan, tier, max_channels FROM plan_limits ORDER BY plan, tier;
