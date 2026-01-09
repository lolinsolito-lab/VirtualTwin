-- =============================================
-- OMNI-CHANNEL SOVEREIGN SYNC
-- Final alignment for WhatsApp, IG, and Messenger
-- =============================================

-- 1. Ensure channels table has all necessary columns
ALTER TABLE public.channels 
ADD COLUMN IF NOT EXISTS channel_type TEXT DEFAULT 'whatsapp' CHECK (channel_type IN ('whatsapp', 'instagram', 'messenger', 'telegram', 'webchat')),
ADD COLUMN IF NOT EXISTS page_access_token TEXT,
ADD COLUMN IF NOT EXISTS instance_id TEXT; -- For future use with other providers

-- 2. Ensure conversations table is the single source of truth
ALTER TABLE public.conversations
ADD COLUMN IF NOT EXISTS channel_type TEXT DEFAULT 'whatsapp',
ADD COLUMN IF NOT EXISTS contact_platform_id TEXT, -- e.g., phone number for WA, IG user ID
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 3. Optimization: Index for channel/platform lookups
CREATE INDEX IF NOT EXISTS idx_conversations_channel_platform ON public.conversations(channel_type, contact_platform_id);

-- 4. Clean up: (Optional) If you want to officially mark the leads table as legacy
-- COMMENT ON TABLE public.leads IS 'LEGACY: Use public.conversations instead for Omni-channel support';

-- 5. Fix possible RLS gaps for multi-channel
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
CREATE POLICY "Users can view own conversations" 
  ON public.conversations FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can manage own conversations" ON public.conversations;
CREATE POLICY "Users can manage own conversations" 
  ON public.conversations FOR ALL 
  USING (auth.uid() = user_id);

-- DONE! The Neural Bridge is ready. ✅
