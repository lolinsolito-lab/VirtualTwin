-- Update LinkedIn Direct AI price to €59
UPDATE addons 
SET promo_price = 5900, 
    regular_price = 5900,
    updated_at = NOW()
WHERE icon = 'linkedin' AND product_type = 'channel_addon';

-- Verify
SELECT name, promo_price/100 as price_eur FROM addons WHERE icon = 'linkedin';
