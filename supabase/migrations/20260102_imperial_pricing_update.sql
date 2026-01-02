-- ============================================
-- VirtualTwin Imperial Pricing Update
-- Date: 2 Gennaio 2026
-- Updates plan_limits to Imperial Strategy prices
-- ============================================

-- =========================================
-- UPDATE FOUNDER PRICES
-- =========================================

-- Pioniere: €97 → €147
UPDATE plan_limits 
SET price_eur = 147 
WHERE plan = 'pioniere' AND tier = 'founder';

-- Conquistatore: €197 → €347
UPDATE plan_limits 
SET price_eur = 347 
WHERE plan = 'conquistatore' AND tier = 'founder';

-- Imperatore: €595 → €697
UPDATE plan_limits 
SET price_eur = 697 
WHERE plan = 'imperatore' AND tier = 'founder';

-- =========================================
-- UPDATE PUBLIC PRICES
-- =========================================

-- Pioniere: €197 → €297
UPDATE plan_limits 
SET price_eur = 297 
WHERE plan = 'pioniere' AND tier = 'public';

-- Conquistatore: €397 → €697
UPDATE plan_limits 
SET price_eur = 697 
WHERE plan = 'conquistatore' AND tier = 'public';

-- Imperatore: €797 → €1197
UPDATE plan_limits 
SET price_eur = 1197 
WHERE plan = 'imperatore' AND tier = 'public';

-- =========================================
-- VERIFY UPDATE
-- =========================================
-- Run this to verify:
-- SELECT plan, tier, price_eur FROM plan_limits ORDER BY plan, tier;

-- Expected result:
-- | plan          | tier    | price_eur |
-- |---------------|---------|-----------|
-- | conquistatore | founder | 347       |
-- | conquistatore | public  | 697       |
-- | curioso       | public  | 0         |
-- | esploratore   | founder | 39        |
-- | esploratore   | public  | 79        |
-- | imperatore    | founder | 697       |
-- | imperatore    | public  | 1197      |
-- | pioniere      | founder | 147       |
-- | pioniere      | public  | 297       |

-- ============================================
-- IMPERIAL PRICING UPDATE COMPLETE ✅
-- ============================================
