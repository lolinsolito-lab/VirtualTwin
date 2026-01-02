-- =============================================
-- ONBOARDING SYSTEM MIGRATION
-- Aggiunge supporto per tracking onboarding completion
-- =============================================

-- Aggiungi colonna onboarding_completed a profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;

-- Aggiungi colonne business profile per l'onboarding
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS business_name TEXT,
ADD COLUMN IF NOT EXISTS business_sector TEXT,
ADD COLUMN IF NOT EXISTS target_client TEXT,
ADD COLUMN IF NOT EXISTS ai_tone TEXT DEFAULT 'professionale';

-- Crea tabella FAQ per il clone AI
CREATE TABLE IF NOT EXISTS clone_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indice per query veloci
CREATE INDEX IF NOT EXISTS idx_clone_faqs_user_id ON clone_faqs(user_id);

-- RLS per clone_faqs
ALTER TABLE clone_faqs ENABLE ROW LEVEL SECURITY;

-- Policy: utenti possono vedere solo le proprie FAQ
CREATE POLICY "Users can view own faqs" ON clone_faqs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own faqs" ON clone_faqs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own faqs" ON clone_faqs
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own faqs" ON clone_faqs
    FOR DELETE USING (auth.uid() = user_id);

-- Imposta onboarding_completed = true per utenti esistenti
-- (così non vengono forzati all'onboarding)
UPDATE profiles SET onboarding_completed = TRUE WHERE onboarding_completed IS NULL;

-- Commento
COMMENT ON COLUMN profiles.onboarding_completed IS 'Indica se l''utente ha completato l''onboarding wizard';
COMMENT ON TABLE clone_faqs IS 'FAQ personalizzate per addestrare il clone AI di ogni utente';
