-- ========================================
-- STEP 1: VERIFY EXISTING WAITLIST TABLE
-- ========================================
-- Run this query FIRST to see what columns already exist

SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'waitlist' 
ORDER BY ordinal_position;

-- Expected columns we need:
-- ✓ id (uuid)
-- ✓ email (text)
-- ✓ name (text)
-- ✓ plan (text)
-- ✓ created_at (timestamp)
-- ✓ next_wave (text)
-- ✓ current_wave (text)
-- ✓ checkout_token (uuid)
-- ✓ token_expires_at (timestamptz)
-- ✓ token_status (text)
-- ✓ position_in_queue (integer)
-- ✓ stripe_customer_id (text)
-- ✓ stripe_payment_intent_id (text)
