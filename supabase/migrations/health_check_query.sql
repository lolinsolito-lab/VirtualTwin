-- =============================================
-- 🔍 VIRTUALTWIN DATABASE HEALTH CHECK
-- Versione UNIFICATA - Mostra tutto insieme
-- Esegui su Supabase SQL Editor
-- =============================================

WITH health_check AS (
    -- 1. UTENTI PER TIER
    SELECT '01. UTENTI' as sezione, plan_tier as key1, subscription_status as key2, 
           COUNT(*)::text as value1, 
           SUM(CASE WHEN is_founder THEN 1 ELSE 0 END)::text as value2,
           '' as value3
    FROM profiles GROUP BY plan_tier, subscription_status
    
    UNION ALL
    
    -- 2. TRIGGERS
    SELECT '02. TRIGGERS', trigger_name, event_object_table, event_manipulation, action_timing, ''
    FROM information_schema.triggers WHERE trigger_schema = 'public'
    
    UNION ALL
    
    -- 3. FOUNDERS (without ORDER BY)
    SELECT '03. FOUNDERS', email, plan_tier, 
           COALESCE(founder_number::text, 'N/A'),
           CASE WHEN stripe_customer_id IS NOT NULL THEN '✅ Stripe' ELSE '❌ No Stripe' END,
           ''
    FROM profiles WHERE is_founder = true
    
    UNION ALL
    
    -- 4. BILLING EVENTS (without ORDER BY)
    SELECT '04. BILLING', event_type, 
           COALESCE(amount::text, '0'), 
           '', '', ''
    FROM billing_events
    
    UNION ALL
    
    -- 5. ADMIN/GOD MODE
    SELECT '05. ADMINS', email, 
           COALESCE(role, 'user'),
           CASE WHEN is_super_admin THEN '👑 Super Admin' ELSE '' END,
           plan_tier, ''
    FROM profiles WHERE is_super_admin = true OR role = 'admin'
    
    UNION ALL
    
    -- 6. OVERAGE STATUS
    SELECT '06. OVERAGE', plan_tier, 
           'ch:' || COALESCE(overage_channels, 0)::text,
           'cl:' || COALESCE(overage_clones, 0)::text,
           'cv:' || COALESCE(overage_conversations, 0)::text, ''
    FROM profiles WHERE overage_channels > 0 OR overage_clones > 0 OR overage_conversations > 0
    
    UNION ALL
    
    -- 7. TIER MISMATCH
    SELECT '07. MISMATCH', email, plan_tier,
           CASE 
               WHEN plan_tier IN ('aspirante', 'esploratore', 'pioniere') THEN '⚠️ LEGACY'
               ELSE '❌ UNKNOWN'
           END, '', ''
    FROM profiles 
    WHERE plan_tier IN ('aspirante', 'esploratore', 'pioniere')
       OR plan_tier NOT IN ('curioso','solopreneur','entrepreneur','conquistatore','imperatore','sovereignty','aspirante','esploratore','pioniere')
    
    UNION ALL
    
    -- 8. TOP CANALI
    SELECT '08. CHANNELS', p.email, p.plan_tier,
           COUNT(c.id)::text || ' canali',
           '', ''
    FROM profiles p
    LEFT JOIN channels c ON p.id = c.user_id AND c.is_active = true
    GROUP BY p.id, p.email, p.plan_tier
    HAVING COUNT(c.id) > 0
    
    UNION ALL
    
    -- 9. WAITLIST
    SELECT '09. WAITLIST', 
           'Total: ' || COUNT(*)::text,
           'Pending: ' || SUM(CASE WHEN token_status = 'pending' THEN 1 ELSE 0 END)::text,
           'Used: ' || SUM(CASE WHEN token_status = 'used' THEN 1 ELSE 0 END)::text,
           '', ''
    FROM waitlist
    
    UNION ALL
    
    -- 10. SUMMARY TOTALS
    SELECT '10. SUMMARY',
           'Users: ' || (SELECT COUNT(*) FROM profiles)::text,
           'Active: ' || (SELECT COUNT(*) FROM profiles WHERE subscription_status = 'active')::text,
           'Founders: ' || (SELECT COUNT(*) FROM profiles WHERE is_founder = true)::text,
           'Channels: ' || (SELECT COUNT(*) FROM channels WHERE is_active = true)::text,
           'Clones: ' || (SELECT COUNT(*) FROM clones WHERE is_active = true)::text
)
SELECT * FROM health_check ORDER BY sezione;
