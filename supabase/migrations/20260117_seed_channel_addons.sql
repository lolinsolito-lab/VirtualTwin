-- =============================================
-- 🎯 CHANNEL ADD-ONS - COMPLETE SETUP
-- Step 1: Extend constraint
-- Step 2: Insert channel add-ons
-- Created: 2026-01-17
-- =============================================

-- STEP 1: Extend the product_type constraint to include channel_addon
ALTER TABLE addons DROP CONSTRAINT IF EXISTS addons_product_type_check;

ALTER TABLE addons ADD CONSTRAINT addons_product_type_check 
    CHECK (product_type IN ('service', 'pdf', 'ebook', 'video', 'audio', 'webinar', 'course', 'template', 'channel_addon'));

-- STEP 2: Insert channel add-ons
-- Telegram Bot Pro - €19/mese - disponibile per Conquistatore+
INSERT INTO addons (
    name, description, icon, product_type, promo_price, regular_price,
    stripe_product_id, stripe_promo_price_id, stripe_regular_price_id,
    features, available_for_tiers, pre_selected_for, is_active, is_recommended, display_order, delivery_instructions
) VALUES (
    'Telegram Bot Pro',
    'Connetti il tuo bot Telegram per assistenza clienti automatizzata',
    'telegram', 'channel_addon', 1900, 1900,
    'prod_ToIUtqMJP9ZEtF',
    'price_1SqftP7141DXdb9vzJwHOAok',
    'price_1SqftP7141DXdb9vf8s026UO',
    '["Bot Telegram illimitato", "Risposte AI personalizzate", "Notifiche in tempo reale", "Integrazione con CRM"]'::JSONB,
    ARRAY['conquistatore', 'imperatore'],
    ARRAY[]::TEXT[],
    true, false, 10,
    'Canale Telegram Bot Pro ora disponibile nella sezione Canali'
);

-- Webchat Premium - €39/mese - disponibile per Imperatore
INSERT INTO addons (
    name, description, icon, product_type, promo_price, regular_price,
    stripe_product_id, stripe_promo_price_id, stripe_regular_price_id,
    features, available_for_tiers, pre_selected_for, is_active, is_recommended, display_order, delivery_instructions
) VALUES (
    'Webchat Premium',
    'Widget AI premium da integrare nel tuo sito web',
    'webchat', 'channel_addon', 3900, 3900,
    'prod_ToIUkOufQvhcVx',
    'price_1SqftQ7141DXdb9vCWF9anvo',
    'price_1SqftQ7141DXdb9vragqq8bd',
    '["Widget personalizzabile", "AI conversazionale avanzata", "Lead capture automatico", "Analytics integrati", "White-label (no branding)"]'::JSONB,
    ARRAY['imperatore'],
    ARRAY[]::TEXT[],
    true, true, 11,
    'Canale Webchat Premium ora disponibile nella sezione Canali'
);

-- LinkedIn Direct AI - €49/mese - disponibile per Imperatore
INSERT INTO addons (
    name, description, icon, product_type, promo_price, regular_price,
    stripe_product_id, stripe_promo_price_id, stripe_regular_price_id,
    features, available_for_tiers, pre_selected_for, is_active, is_recommended, display_order, delivery_instructions
) VALUES (
    'LinkedIn Direct AI',
    'Espandi il tuo network B2B con messaggi AI automatizzati',
    'linkedin', 'channel_addon', 4900, 4900,
    'prod_ToIUWZyYyKz3HD',
    'price_1SqftR7141DXdb9vECocLJzU',
    'price_1SqftS7141DXdb9vQvms0YuD',
    '["Outreach automatizzato", "Follow-up intelligenti", "Lead scoring B2B", "Integrazione Sales Navigator", "Compliance-safe messaging"]'::JSONB,
    ARRAY['imperatore'],
    ARRAY[]::TEXT[],
    true, false, 12,
    'Canale LinkedIn Direct AI ora disponibile nella sezione Canali'
);

-- TikTok Shop AI - €49/mese - disponibile per Imperatore
INSERT INTO addons (
    name, description, icon, product_type, promo_price, regular_price,
    stripe_product_id, stripe_promo_price_id, stripe_regular_price_id,
    features, available_for_tiers, pre_selected_for, is_active, is_recommended, display_order, delivery_instructions
) VALUES (
    'TikTok Shop AI',
    'Interagisci con la tua audience creator e vendi',
    'tiktok', 'channel_addon', 4900, 4900,
    'prod_ToIUBQxEXNb9p0',
    'price_1SqftS7141DXdb9vjNs7DPKp',
    'price_1SqftS7141DXdb9vYXnF6C5l',
    '["Risposte DM automatiche", "Integrazione TikTok Shop", "Lead capture da commenti", "Analytics creator", "Cross-posting automation"]'::JSONB,
    ARRAY['imperatore'],
    ARRAY[]::TEXT[],
    true, false, 13,
    'Canale TikTok Shop AI ora disponibile nella sezione Canali'
);

-- STEP 3: Verify
SELECT id, name, product_type, icon, promo_price/100 as price_eur, available_for_tiers 
FROM addons 
WHERE product_type = 'channel_addon'
ORDER BY display_order;
