-- =========================================
-- COMPLETE DATABASE AUDIT FOR VIRTUALTWIN
-- Run this to verify ALL tables and structure
-- =========================================

-- ==========================================
-- PART 1: LIST ALL TABLES
-- ==========================================
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Expected tables:
-- ✓ profiles
-- ✓ clones
-- ✓ channels
-- ✓ conversations
-- ✓ messages
-- ✓ analytics
-- ✓ billing_events
-- ✓ waitlist

-- ==========================================
-- PART 2: PROFILES TABLE VERIFICATION
-- ==========================================
SELECT 'PROFILES TABLE' as table_check;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Critical columns:
-- ✓ id (uuid)
-- ✓ email (text)
-- ✓ plan_tier (text)
-- ✓ subscription_status (text)
-- ✓ is_founder (boolean)
-- ✓ stripe_customer_id (text)
-- ✓ stripe_subscription_id (text)
-- ✓ messages_used (integer)
-- ✓ messages_limit (integer)
-- ✓ trial_started_at (timestamptz)
-- ✓ trial_ends_at (timestamptz)

-- ==========================================
-- PART 3: CLONES TABLE VERIFICATION
-- ==========================================
SELECT 'CLONES TABLE' as table_check;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'clones'
ORDER BY ordinal_position;

-- Critical columns:
-- ✓ id (uuid)
-- ✓ user_id (uuid)
-- ✓ business_name (text)
-- ✓ ai_personality (text)
-- ✓ faqs (jsonb)

-- ==========================================
-- PART 4: CHANNELS TABLE VERIFICATION
-- ==========================================
SELECT 'CHANNELS TABLE' as table_check;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'channels'
ORDER BY ordinal_position;

-- Critical columns:
-- ✓ id (uuid)
-- ✓ user_id (uuid)
-- ✓ channel_type (text)
-- ✓ status (text)
-- ✓ whatsapp_api_key (text)

-- ==========================================
-- PART 5: CONVERSATIONS TABLE VERIFICATION
-- ==========================================
SELECT 'CONVERSATIONS TABLE' as table_check;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'conversations'
ORDER BY ordinal_position;

-- Critical columns:
-- ✓ id (uuid)
-- ✓ user_id (uuid)
-- ✓ channel_id (uuid)
-- ✓ lead_name (text)
-- ✓ lead_phone (text)
-- ✓ status (text)

-- ==========================================
-- PART 6: MESSAGES TABLE VERIFICATION
-- ==========================================
SELECT 'MESSAGES TABLE' as table_check;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'messages'
ORDER BY ordinal_position;

-- Critical columns:
-- ✓ id (uuid)
-- ✓ conversation_id (uuid)
-- ✓ sender_type (text)
-- ✓ content (text)
-- ✓ created_at (timestamptz)

-- ==========================================
-- PART 7: BILLING_EVENTS TABLE VERIFICATION
-- ==========================================
SELECT 'BILLING_EVENTS TABLE' as table_check;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'billing_events'
ORDER BY ordinal_position;

-- Critical columns:
-- ✓ id (uuid)
-- ✓ user_id (uuid)
-- ✓ event_type (text)
-- ✓ stripe_event_id (text)
-- ✓ amount (numeric)

-- ==========================================
-- PART 8: WAITLIST TABLE VERIFICATION
-- ==========================================
SELECT 'WAITLIST TABLE' as table_check;

SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'waitlist'
ORDER BY ordinal_position;

-- Critical columns:
-- ✓ id (uuid)
-- ✓ email (text) - CRITICAL
-- ✓ plan (text) - CRITICAL
-- ✓ next_wave (text) - CRITICAL
-- ✓ checkout_token (uuid)
-- ✓ token_status (text)

-- ==========================================
-- PART 9: CHECK ALL INDEXES
-- ==========================================
SELECT 'DATABASE INDEXES' as check_type;

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ==========================================
-- PART 10: CHECK RLS POLICIES
-- ==========================================
SELECT 'RLS POLICIES' as check_type;

SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- ==========================================
-- PART 11: CHECK FOREIGN KEY CONSTRAINTS
-- ==========================================
SELECT 'FOREIGN KEY CONSTRAINTS' as check_type;

SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ==========================================
-- PART 12: CHECK TRIGGERS
-- ==========================================
SELECT 'DATABASE TRIGGERS' as check_type;

SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- ==========================================
-- PART 13: CRITICAL COLUMNS CHECK
-- ==========================================
SELECT 'CRITICAL MISSING COLUMNS CHECK' as check_type;

-- Check if critical columns exist
SELECT 
    'profiles' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'messages_used'
    ) THEN '✓' ELSE '✗ MISSING' END as messages_used,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_founder'
    ) THEN '✓' ELSE '✗ MISSING' END as is_founder

UNION ALL

SELECT 
    'waitlist' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' AND column_name = 'email'
    ) THEN '✓' ELSE '✗ MISSING' END as email_column,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' AND column_name = 'plan'
    ) THEN '✓' ELSE '✗ MISSING' END as plan_column

UNION ALL

SELECT 
    'waitlist' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' AND column_name = 'next_wave'
    ) THEN '✓' ELSE '✗ MISSING' END as next_wave_column,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'waitlist' AND column_name = 'checkout_token'
    ) THEN '✓' ELSE '✗ MISSING' END as checkout_token;

-- ==========================================
-- PART 14: TABLE SUMMARY
-- ==========================================
SELECT 'TABLE SUMMARY' as summary_type;

SELECT 
    t.table_name,
    (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name) as columns,
    (SELECT COUNT(*) FROM pg_indexes i WHERE i.tablename = t.table_name) as indexes,
    (SELECT COUNT(*) FROM pg_policies p WHERE p.tablename = t.table_name) as rls_policies
FROM information_schema.tables t
WHERE t.table_schema = 'public' 
    AND t.table_type = 'BASE TABLE'
ORDER BY t.table_name;
