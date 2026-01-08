-- =============================================
-- VIRTUALTWIN - COMPLETE TIER MIGRATION
-- Data: 2026-01-08
-- =============================================
-- ESEGUI SU SUPABASE SQL EDITOR
-- ATTENZIONE: Fai backup prima di eseguire!
-- =============================================

BEGIN;

-- =============================================
-- 1. PRICING_PLANS - Rinomina e Aggiorna
-- =============================================

-- 1.1 Rinomina aspirante → solopreneur
UPDATE pricing_plans 
SET name = 'solopreneur', 
    display_name = 'Solopreneur',
    tagline = 'Per freelancer e coach in P.IVA',
    clones_limit = 1,
    messages_limit = 1000,
    channels_limit = 1
WHERE name = 'aspirante';

-- 1.2 Rinomina pioniere → entrepreneur
UPDATE pricing_plans 
SET name = 'entrepreneur', 
    display_name = 'Entrepreneur',
    tagline = 'Il più scelto dai professionisti (68%)',
    clones_limit = 3,
    messages_limit = 5000,
    channels_limit = 3
WHERE name = 'pioniere';

-- 1.3 Elimina esploratore (obsoleto)
DELETE FROM pricing_plans WHERE name = 'esploratore';

-- 1.4 Aggiorna curioso
UPDATE pricing_plans 
SET tagline = 'Prova gratuita 14 giorni',
    clones_limit = 1,
    messages_limit = 100,
    channels_limit = 0
WHERE name = 'curioso';

-- 1.5 Aggiorna conquistatore
UPDATE pricing_plans 
SET tagline = 'Per PMI e agenzie Scale-Up',
    clones_limit = 5,
    messages_limit = 20000,
    channels_limit = 999
WHERE name = 'conquistatore';

-- 1.6 Aggiorna imperatore
UPDATE pricing_plans 
SET tagline = 'Enterprise White-Label',
    clones_limit = 15,
    messages_limit = 100000,
    channels_limit = 999
WHERE name = 'imperatore';

-- 1.7 Aggiorna sovereignty (Partnership Custom - già esistente nel DB)
UPDATE pricing_plans 
SET display_name = 'Sovereignty',
    tagline = 'Partnership Strategica - Solo su Invito',
    founder_price_monthly = 0,
    founder_price_yearly = 0,
    public_price_monthly = 0,
    public_price_yearly = 0,
    clones_limit = 0,
    messages_limit = 0,
    channels_limit = 0,
    is_active = true,
    sort_order = 6
WHERE name = 'sovereignty';

-- =============================================
-- 2. PLAN_LIMITS - Rinomina e Aggiorna
-- =============================================

-- 2.1 Elimina esploratore
DELETE FROM plan_limits WHERE plan = 'esploratore';

-- 2.2 Rinomina pioniere → entrepreneur
UPDATE plan_limits 
SET plan = 'entrepreneur',
    max_clones = 3,
    max_messages_monthly = 5000,
    max_channels = 3
WHERE plan = 'pioniere';

-- 2.3 Aggiorna curioso
UPDATE plan_limits 
SET max_clones = 1,
    max_messages_monthly = 100,
    max_channels = 0
WHERE plan = 'curioso';

-- 2.4 Aggiorna conquistatore
UPDATE plan_limits 
SET max_clones = 5,
    max_messages_monthly = 20000,
    max_channels = 999
WHERE plan = 'conquistatore';

-- 2.5 Aggiorna imperatore
UPDATE plan_limits 
SET max_clones = 15,
    max_messages_monthly = 100000,
    max_channels = 999
WHERE plan = 'imperatore';

-- 2.6 Aggiungi solopreneur (founder + public)
INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, a_b_testing_enabled)
VALUES 
    ('solopreneur', 'founder', 49, 1, 1000, 1, false, false),
    ('solopreneur', 'public', 347, 1, 1000, 1, false, false)
ON CONFLICT DO NOTHING;

-- 2.7 Aggiorna sovereignty se esiste, altrimenti inserisci
DELETE FROM plan_limits WHERE plan = 'sovereignty';
INSERT INTO plan_limits (plan, tier, price_eur, max_clones, max_messages_monthly, max_channels, api_enabled, a_b_testing_enabled)
VALUES 
    ('sovereignty', 'founder', 0, 0, 0, 0, true, true),
    ('sovereignty', 'public', 0, 0, 0, 0, true, true);

-- =============================================
-- 3. PROFILES - Aggiorna CHECK Constraint
-- =============================================

-- 3.1 Rimuovi vecchio constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_plan_tier_check;

-- 3.2 Migra dati esistenti
UPDATE profiles SET plan_tier = 'solopreneur' WHERE plan_tier = 'aspirante';
UPDATE profiles SET plan_tier = 'entrepreneur' WHERE plan_tier = 'pioniere';
UPDATE profiles SET plan_tier = 'solopreneur' WHERE plan_tier = 'esploratore';

-- 3.3 Migra anche colonna "plan"
UPDATE profiles SET plan = 'solopreneur' WHERE plan = 'aspirante';
UPDATE profiles SET plan = 'entrepreneur' WHERE plan = 'pioniere';
UPDATE profiles SET plan = 'solopreneur' WHERE plan = 'esploratore';

-- 3.4 Aggiungi nuovo constraint
ALTER TABLE profiles 
ADD CONSTRAINT profiles_plan_tier_check 
CHECK (plan_tier IN ('curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore', 'sovereignty'));

-- =============================================
-- 4. SYNC_PLAN_LIMITS Function - Aggiorna
-- NOTA: Sovereignty NON viene sincronizzato (custom partnership)
-- =============================================

CREATE OR REPLACE FUNCTION public.sync_plan_limits()
RETURNS TRIGGER AS $$
BEGIN
  -- Sovereignty: limiti gestiti manualmente per ogni partner
  IF NEW.plan_tier = 'sovereignty' THEN
    RETURN NEW;
  END IF;
  
  -- Sincronizza messages_limit per tier standard
  IF NEW.plan_tier = 'curioso' THEN
    NEW.messages_limit := 100;
  ELSIF NEW.plan_tier = 'solopreneur' THEN
    NEW.messages_limit := 1000;
  ELSIF NEW.plan_tier = 'entrepreneur' THEN
    NEW.messages_limit := 5000;
  ELSIF NEW.plan_tier = 'conquistatore' THEN
    NEW.messages_limit := 20000;
  ELSIF NEW.plan_tier = 'imperatore' THEN
    NEW.messages_limit := 100000;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMIT;

-- =============================================
-- 5. VERIFICA (esegui DOPO il COMMIT)
-- =============================================

SELECT '=== PRICING_PLANS ===' as check_type, name, display_name, clones_limit, messages_limit 
FROM pricing_plans ORDER BY sort_order;

SELECT '=== PLAN_LIMITS ===' as check_type, plan, tier, max_clones, max_messages_monthly 
FROM plan_limits ORDER BY plan, tier;

SELECT '=== PROFILES ===' as check_type, email, plan_tier, messages_limit 
FROM profiles;

SELECT '=== CONSTRAINT ===' as check_type, pg_get_constraintdef(oid) as definition
FROM pg_constraint WHERE conname = 'profiles_plan_tier_check';