-- =============================================
-- 🎯 INSERT CHANNEL ADD-ONS WITH STRIPE IDS
-- Run after the migration
-- Created: 2026-01-17
-- =============================================

INSERT INTO addons (
    id,
    name,
    description,
    icon,
    product_type,
    promo_price,
    regular_price,
    stripe_product_id,
    stripe_promo_price_id,
    stripe_regular_price_id,
    features,
    available_for_tiers,
    pre_selected_for,
    is_active,
    is_recommended,
    display_order,
    delivery_instructions,
    metadata
) VALUES 
-- Telegram Bot Pro
(
    'addon_telegram',
    'Telegram Bot Pro',
    'Connetti il tuo bot Telegram per assistenza clienti automatizzata',
    'telegram',
    'channel_addon',
    1900,  -- €19.00 in cents
    1900,
    'prod_ToIUtqMJP9ZEtF',
    'price_1SqftP7141DXdb9vzJwHOAok',  -- Monthly
    'price_1SqftP7141DXdb9vf8s026UO',  -- Yearly
    ARRAY['Bot Telegram illimitato', 'Risposte AI personalizzate', 'Notifiche in tempo reale', 'Integrazione con CRM'],
    ARRAY['conquistatore', 'imperatore', 'sovereignty'],
    ARRAY[]::TEXT[],
    true,
    false,
    0,
    'Canale Telegram Bot Pro ora disponibile nella sezione Canali',
    '{"channel_type": "telegram", "min_tier": "conquistatore", "available_from": "2026-04-01"}'::JSONB
),
-- Webchat Premium
(
    'addon_webchat',
    'Webchat Premium',
    'Widget AI premium da integrare nel tuo sito web',
    'webchat',
    'channel_addon',
    3900,  -- €39.00 in cents
    3900,
    'prod_ToIUkOufQvhcVx',
    'price_1SqftQ7141DXdb9vCWF9anvo',  -- Monthly
    'price_1SqftQ7141DXdb9vragqq8bd',  -- Yearly
    ARRAY['Widget personalizzabile', 'AI conversazionale avanzata', 'Lead capture automatico', 'Analytics integrati', 'White-label (no branding)'],
    ARRAY['imperatore', 'sovereignty'],
    ARRAY[]::TEXT[],
    true,
    true,  -- Recommended
    1,
    'Canale Webchat Premium ora disponibile nella sezione Canali',
    '{"channel_type": "webchat", "min_tier": "imperatore", "available_from": "2026-04-01"}'::JSONB
),
-- LinkedIn Direct AI
(
    'addon_linkedin',
    'LinkedIn Direct AI',
    'Espandi il tuo network B2B con messaggi AI automatizzati',
    'linkedin',
    'channel_addon',
    4900,  -- €49.00 in cents
    4900,
    'prod_ToIUWZyYyKz3HD',
    'price_1SqftR7141DXdb9vECocLJzU',  -- Monthly
    'price_1SqftS7141DXdb9vQvms0YuD',  -- Yearly
    ARRAY['Outreach automatizzato', 'Follow-up intelligenti', 'Lead scoring B2B', 'Integrazione Sales Navigator', 'Compliance-safe messaging'],
    ARRAY['imperatore', 'sovereignty'],
    ARRAY[]::TEXT[],
    true,
    false,
    2,
    'Canale LinkedIn Direct AI ora disponibile nella sezione Canali',
    '{"channel_type": "linkedin", "min_tier": "imperatore", "available_from": "2026-07-01"}'::JSONB
),
-- TikTok Shop AI
(
    'addon_tiktok',
    'TikTok Shop AI',
    'Interagisci con la tua audience creator e vendi',
    'tiktok',
    'channel_addon',
    4900,  -- €49.00 in cents
    4900,
    'prod_ToIUBQxEXNb9p0',
    'price_1SqftS7141DXdb9vjNs7DPKp',  -- Monthly
    'price_1SqftS7141DXdb9vYXnF6C5l',  -- Yearly
    ARRAY['Risposte DM automatiche', 'Integrazione TikTok Shop', 'Lead capture da commenti', 'Analytics creator', 'Cross-posting automation'],
    ARRAY['imperatore', 'sovereignty'],
    ARRAY[]::TEXT[],
    true,
    false,
    3,
    'Canale TikTok Shop AI ora disponibile nella sezione Canali',
    '{"channel_type": "tiktok", "min_tier": "imperatore", "available_from": "2026-10-01"}'::JSONB
)
ON CONFLICT (id) DO UPDATE SET
    stripe_product_id = EXCLUDED.stripe_product_id,
    stripe_promo_price_id = EXCLUDED.stripe_promo_price_id,
    stripe_regular_price_id = EXCLUDED.stripe_regular_price_id,
    updated_at = NOW();

-- Verify insert
SELECT id, name, stripe_product_id, promo_price/100 as price_eur FROM addons WHERE product_type = 'channel_addon';
