-- =============================================
-- IMPERIAL ARCHITECTURAL VALIDATION (FINAL)
-- Goal: 100% Verification of Sovereignty Infrastructure
-- =============================================

SELECT 
    CASE 
        WHEN count(*) = 11 THEN '✅ ARCHITECTURE: PERFECT'
        ELSE '⚠️ ARCHITECTURE: INCOMPLETE (' || count(*) || '/11 fields found)'
    END as status
FROM (
    -- Check Profiles Columns
    SELECT column_name FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name IN ('xp', 'level', 'completed_video_ids', 'onboarding_completed', 'business_sector', 'ai_tone', 'badges')
    
    UNION ALL
    
    -- Check Tables
    SELECT table_name FROM information_schema.tables 
    WHERE table_name IN ('clone_faqs', 'billing_events', 'waitlist')
    
    UNION ALL
    
    -- Check Constraints
    SELECT conname FROM pg_constraint 
    WHERE conname = 'profiles_plan_tier_check'
) as validation;

-- RECAP OF THE INFRASTRUCTURE
SELECT 'Profiles' as category, column_name, data_type FROM information_schema.columns WHERE table_name = 'profiles' AND column_name IN ('xp', 'level', 'completed_video_ids', 'onboarding_completed')
UNION ALL
SELECT 'Tables' as category, table_name, 'EXISTING' FROM information_schema.tables WHERE table_name IN ('clone_faqs', 'billing_events', 'waitlist');
