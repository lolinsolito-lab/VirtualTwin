-- Add "curioso" tier to Academy for free users
-- This allows free users to see preview content and understand what they're missing

-- Update the constraint on academy_courses to include 'curioso'
ALTER TABLE academy_courses 
DROP CONSTRAINT IF EXISTS academy_courses_min_tier_check;

ALTER TABLE academy_courses 
ADD CONSTRAINT academy_courses_min_tier_check 
CHECK (min_tier IN ('curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'));

-- Update the constraint on academy_modules to include 'curioso'
ALTER TABLE academy_modules 
DROP CONSTRAINT IF EXISTS academy_modules_min_tier_check;

ALTER TABLE academy_modules 
ADD CONSTRAINT academy_modules_min_tier_check 
CHECK (min_tier IN ('curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'));

-- Insert a sample course for "curioso" (free users)
INSERT INTO academy_courses (title, description, min_tier, is_published, is_featured, display_order) 
VALUES (
    'Benvenuto in VirtualTwin',
    'Scopri come il tuo clone digitale può rivoluzionare il tuo business. Anteprima gratuita.',
    'curioso',
    true,
    true,
    0
)
ON CONFLICT DO NOTHING;
