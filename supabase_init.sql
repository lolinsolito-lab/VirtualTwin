
-- ==========================================
-- 👑 VIRTUALTWIN SOVEREIGN DB SCHEMA (ELITE)
-- ==========================================

-- 0. EXTENSIONS & SETUP
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CORE TENANT MANAGEMENT
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    domain TEXT UNIQUE,
    subscription_status TEXT DEFAULT 'trialing', -- trialing, active, past_due, cancelled
    subscription_plan TEXT DEFAULT 'starter',   -- starter, professional, agency
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'member', -- owner, admin, member
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BOT CONFIGURATION (NUCLEO AI)
CREATE TABLE IF NOT EXISTS settings_bot (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    bot_name TEXT DEFAULT 'Assistente AI',
    tone TEXT DEFAULT 'friendly', -- formal, friendly, casual, bold, poetic
    language TEXT DEFAULT 'it',
    welcome_message TEXT,
    qualification_questions JSONB DEFAULT '[]', -- Array di domande strutturate
    business_info JSONB DEFAULT '{}',          -- Servizi, prodotti, FAQ
    active_hours JSONB DEFAULT '{"start": "09:00", "end": "18:00", "timezone": "Europe/Rome"}',
    auto_reply_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- 3. WHATSAPP CHANNELS
CREATE TABLE IF NOT EXISTS channels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'whatsapp', -- whatsapp, instagram, messenger
    phone_number TEXT,
    account_id TEXT, -- 360dialog WABA ID
    api_key TEXT,    -- Encrypted at application level
    status TEXT DEFAULT 'pending', -- pending, active, error
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. CRM PIPELINE & LEADS
CREATE TABLE IF NOT EXISTS pipeline_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    color TEXT DEFAULT '#3B82F6',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, order_index)
);

CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    stage_id UUID REFERENCES pipeline_stages(id),
    phone_number TEXT NOT NULL,
    full_name TEXT,
    email TEXT,
    source TEXT DEFAULT 'whatsapp', -- whatsapp, form, ads, referral
    tags TEXT[] DEFAULT '{}',
    estimated_value NUMERIC(10,2) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, phone_number)
);

CREATE TABLE IF NOT EXISTS lead_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    desires TEXT,   -- Estratto da AI
    problems TEXT,  -- Estratto da AI
    objectives TEXT,-- Estratto da AI
    budget_range TEXT, -- "1k-5k", ">10k", etc.
    custom_fields JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(lead_id)
);

-- 5. CONVERSATIONS & MESSAGES
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    channel_type TEXT DEFAULT 'whatsapp',
    status TEXT DEFAULT 'active', -- active, archived, spam
    last_message_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, lead_id)
);

CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    direction TEXT NOT NULL, -- inbound, outbound
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text', -- text, image, audio, file
    media_url TEXT,
    ai_generated BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TASKS & FOLLOW-UPS (SISTEMA DI AZIONE)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    type TEXT DEFAULT 'follow_up', -- call, meeting, demo
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    status TEXT DEFAULT 'pending', -- pending, completed, cancelled
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 7. BILLING (INTEGRAZIONE STRIPE)
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan TEXT NOT NULL, -- starter, professional, agency
    status TEXT NOT NULL, -- active, trialing, past_due, etc.
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    cancel_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id)
);

-- 8. ROW LEVEL SECURITY (RLS) - PROTEZIONE TOTALE
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings_bot ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE pipeline_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 9. SOVEREIGN POLICIES (ISOLAMENTO TENANT)
-- Concetto: Gli utenti possono accedere solo ai dati legati al proprio tenant_id.

-- RLS per USERS (Semplificato per evitare recursione infinita)
CREATE POLICY "Users can view their own data"
    ON public.users
    FOR SELECT
    USING (auth.uid() = id);

-- RLS per LEADS (Ottimizzato)
CREATE POLICY "Users can view leads of their tenant"
    ON public.leads
    FOR SELECT
    USING (
        tenant_id IN (
            SELECT t.id FROM public.tenants t
            JOIN public.users u ON u.tenant_id = t.id
            WHERE u.id = auth.uid()
        )
    );

-- Policy: SETTINGS (Il bot del cliente)
CREATE POLICY "Tenant isolation for bot settings" ON settings_bot
    FOR ALL USING (tenant_id = (SELECT tenant_id FROM users WHERE id = auth.uid()));

-- ... (Applica a tutte le altre tabelle nello stesso modo durante il setup fine)

-- 10. INDEXES PER PERFORMANCE 10k MRR
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tasks_lead ON tasks(lead_id);
