-- Multi-Channel Schema Extension

-- 1. Add channel_type to channels table
ALTER TABLE public.channels 
ADD COLUMN IF NOT EXISTS channel_type TEXT DEFAULT 'whatsapp',
ADD COLUMN IF NOT EXISTS page_id TEXT,
ADD COLUMN IF NOT EXISTS page_access_token TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Add channel_type to conversations for tracking source
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS channel_type TEXT DEFAULT 'whatsapp';

-- 3. Add source to leads to know where they came from
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS source_channel TEXT DEFAULT 'whatsapp';

-- 4. Create index for faster channel lookups
CREATE INDEX IF NOT EXISTS idx_channels_page_id ON public.channels(page_id);
CREATE INDEX IF NOT EXISTS idx_channels_type ON public.channels(channel_type);

-- 5. Update RLS policies to include channel_type
-- (Existing RLS should already work since we're just adding columns)

COMMENT ON COLUMN public.channels.channel_type IS 'whatsapp, instagram, or messenger';
COMMENT ON COLUMN public.channels.page_id IS 'Facebook/Instagram Page ID for Meta Graph API';
