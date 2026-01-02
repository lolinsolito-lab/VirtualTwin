-- =============================================
-- CHANNELS ENHANCEMENT MIGRATION
-- Adds simple api_key and phone_number columns for easier management
-- =============================================

-- Aggiungi colonne per WhatsApp 360Dialog
ALTER TABLE channels 
ADD COLUMN IF NOT EXISTS api_key TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS page_id TEXT;

-- Rimuovi constraint clone_id NOT NULL se esiste (channels può esistere senza clone)
-- ALTER TABLE channels ALTER COLUMN clone_id DROP NOT NULL;

-- Renomina is_connected in is_active per consistenza (se non esiste)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'channels' AND column_name = 'is_connected'
    ) AND NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'channels' AND column_name = 'is_active'
    ) THEN
        ALTER TABLE channels RENAME COLUMN is_connected TO is_active;
    END IF;
END $$;

-- Se is_active non esiste, creala
ALTER TABLE channels 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- Aggiorna RLS per permettere insert senza clone_id
DROP POLICY IF EXISTS "Users can manage own channels" ON channels;
CREATE POLICY "Users can manage own channels" ON channels
    FOR ALL USING (auth.uid() = user_id);

-- Commento
COMMENT ON COLUMN channels.api_key IS '360Dialog or Meta API key';
COMMENT ON COLUMN channels.phone_number IS 'WhatsApp phone number ID';
COMMENT ON COLUMN channels.page_id IS 'WABA ID or Facebook Page ID';
