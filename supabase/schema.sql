-- =============================================
-- VIRTUALTWIN MVP - COMPLETE DATABASE SCHEMA
-- =============================================
-- Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste & Run
-- =============================================

-- =============================================
-- 1. PROFILES (Extends Supabase Auth)
-- =============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  
  -- Subscription info
  plan_tier TEXT DEFAULT 'curioso' CHECK (plan_tier IN ('curioso', 'aspirante', 'esploratore', 'pioniere', 'conquistatore', 'imperatore')),
  subscription_status TEXT DEFAULT 'trialing' CHECK (subscription_status IN ('trialing', 'active', 'canceled', 'past_due')),
  trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '14 days'),
  
  -- Sovereign metrics
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  completed_video_ids TEXT[] DEFAULT '{}',
  badges JSONB DEFAULT '[]'::jsonb,
  streak_days INTEGER DEFAULT 0,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Onboarding info
  onboarding_completed BOOLEAN DEFAULT FALSE,
  business_name TEXT,
  business_sector TEXT,
  target_client TEXT,
  ai_tone TEXT DEFAULT 'professionale',

  -- Founder status
  is_founder BOOLEAN DEFAULT FALSE,
  founder_number INTEGER UNIQUE, -- 1 to 1000
  founder_joined_at TIMESTAMPTZ,
  
  -- Usage tracking
  messages_used_this_month INTEGER DEFAULT 0,
  messages_limit INTEGER DEFAULT 100, -- Based on plan
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX idx_profiles_plan_tier ON public.profiles(plan_tier);

-- RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- =============================================
-- 2. CLONES (AI Assistants)
-- =============================================
CREATE TABLE public.clones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Clone config
  name TEXT NOT NULL DEFAULT 'Clone Principale',
  description TEXT,
  avatar_url TEXT,
  
  -- Business context
  business_name TEXT NOT NULL,
  business_description TEXT NOT NULL,
  product_service TEXT NOT NULL,
  target_audience TEXT,
  
  -- AI personality
  tone_of_voice TEXT DEFAULT 'friendly' CHECK (tone_of_voice IN ('formal', 'casual', 'friendly', 'professional')),
  language TEXT DEFAULT 'it' CHECK (language IN ('it', 'en', 'es', 'fr', 'de')),
  custom_instructions TEXT,
  
  -- Training data
  faq_data JSONB DEFAULT '[]'::jsonb,
  sample_conversations TEXT[],
  
  -- AI model config
  ai_provider TEXT DEFAULT 'gemini' CHECK (ai_provider IN ('gemini', 'openai', 'claude')),
  ai_model TEXT DEFAULT 'gemini-1.5-pro',
  temperature REAL DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 1),
  max_tokens INTEGER DEFAULT 500,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_trained BOOLEAN DEFAULT FALSE,
  training_status TEXT DEFAULT 'pending' CHECK (training_status IN ('pending', 'training', 'completed', 'failed')),
  
  -- Stats
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  avg_response_time_ms INTEGER DEFAULT 0,
  conversion_rate REAL DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_clones_user_id ON public.clones(user_id);
CREATE INDEX idx_clones_is_active ON public.clones(is_active);

-- RLS
ALTER TABLE public.clones ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clones" 
  ON public.clones FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own clones" 
  ON public.clones FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own clones" 
  ON public.clones FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own clones" 
  ON public.clones FOR DELETE 
  USING (auth.uid() = user_id);

-- =============================================
-- 3. CHANNELS (WhatsApp, Instagram, Messenger)
-- =============================================
CREATE TABLE public.channels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clone_id UUID REFERENCES public.clones(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Channel info
  channel_type TEXT NOT NULL CHECK (channel_type IN ('whatsapp', 'instagram', 'messenger', 'telegram', 'webchat')),
  channel_name TEXT,
  
  -- Connection config
  is_connected BOOLEAN DEFAULT FALSE,
  connection_status TEXT DEFAULT 'disconnected' CHECK (connection_status IN ('connected', 'disconnected', 'error', 'pending')),
  
  -- Platform credentials (encrypted)
  credentials JSONB DEFAULT '{}'::jsonb,
  webhook_url TEXT,
  
  -- Stats
  total_messages_sent INTEGER DEFAULT 0,
  total_messages_received INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  
  -- Metadata
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_channels_clone_id ON public.channels(clone_id);
CREATE INDEX idx_channels_user_id ON public.channels(user_id);
CREATE INDEX idx_channels_type ON public.channels(channel_type);

-- RLS
ALTER TABLE public.channels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own channels" 
  ON public.channels FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own channels" 
  ON public.channels FOR ALL 
  USING (auth.uid() = user_id);

-- =============================================
-- 4. CONVERSATIONS (Chat Sessions)
-- =============================================
CREATE TABLE public.conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clone_id UUID REFERENCES public.clones(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  channel_id UUID REFERENCES public.channels(id) ON DELETE SET NULL,
  
  -- Contact info
  contact_name TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  contact_platform_id TEXT NOT NULL,
  
  -- Conversation state
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'qualified', 'converted', 'closed', 'archived')),
  lead_quality TEXT CHECK (lead_quality IN ('hot', 'warm', 'cold', 'spam')),
  
  -- AI handling
  is_handled_by_ai BOOLEAN DEFAULT TRUE,
  human_takeover BOOLEAN DEFAULT FALSE,
  human_takeover_at TIMESTAMPTZ,
  human_takeover_reason TEXT,
  
  -- Tags & notes
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  notes TEXT,
  
  -- Stats
  total_messages INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  first_response_time_ms INTEGER,
  avg_response_time_ms INTEGER,
  
  -- Conversion tracking
  is_converted BOOLEAN DEFAULT FALSE,
  converted_at TIMESTAMPTZ,
  conversion_value DECIMAL(10,2),
  
  -- Metadata
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_conversations_clone_id ON public.conversations(clone_id);
CREATE INDEX idx_conversations_user_id ON public.conversations(user_id);
CREATE INDEX idx_conversations_contact_platform ON public.conversations(contact_platform_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_conversations_last_message ON public.conversations(last_message_at DESC);

-- RLS
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" 
  ON public.conversations FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own conversations" 
  ON public.conversations FOR ALL 
  USING (auth.uid() = user_id);

-- =============================================
-- 5. MESSAGES (Individual Messages)
-- =============================================
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE NOT NULL,
  clone_id UUID REFERENCES public.clones(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  
  -- Message content
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document', 'location', 'contact')),
  media_url TEXT,
  
  -- Direction
  direction TEXT NOT NULL CHECK (direction IN ('incoming', 'outgoing')),
  sender_type TEXT NOT NULL CHECK (sender_type IN ('contact', 'ai', 'human')),
  
  -- AI processing
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_confidence REAL,
  ai_prompt_tokens INTEGER,
  ai_completion_tokens INTEGER,
  
  -- Status
  status TEXT DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  error_message TEXT,
  
  -- Platform IDs
  platform_message_id TEXT,
  
  -- Metadata
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  delivered_at TIMESTAMPTZ,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id, created_at DESC);
CREATE INDEX idx_messages_user_id ON public.messages(user_id);
CREATE INDEX idx_messages_direction ON public.messages(direction);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own messages" 
  ON public.messages FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- 6. ANALYTICS (Daily Stats)
-- =============================================
CREATE TABLE public.analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  clone_id UUID REFERENCES public.clones(id) ON DELETE CASCADE,
  
  -- Date
  date DATE NOT NULL,
  
  -- Metrics
  total_messages INTEGER DEFAULT 0,
  total_conversations INTEGER DEFAULT 0,
  new_conversations INTEGER DEFAULT 0,
  active_conversations INTEGER DEFAULT 0,
  
  -- Lead quality
  hot_leads INTEGER DEFAULT 0,
  warm_leads INTEGER DEFAULT 0,
  cold_leads INTEGER DEFAULT 0,
  
  -- Conversions
  conversions INTEGER DEFAULT 0,
  conversion_rate REAL DEFAULT 0,
  total_revenue DECIMAL(10,2) DEFAULT 0,
  
  -- Response times
  avg_response_time_ms INTEGER DEFAULT 0,
  first_response_time_ms INTEGER DEFAULT 0,
  
  -- AI performance
  ai_success_rate REAL DEFAULT 0,
  human_takeover_count INTEGER DEFAULT 0,
  
  -- Created
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Unique constraint
  UNIQUE(user_id, clone_id, date)
);

-- Indexes
CREATE INDEX idx_analytics_user_date ON public.analytics(user_id, date DESC);
CREATE INDEX idx_analytics_clone_date ON public.analytics(clone_id, date DESC);

-- RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics" 
  ON public.analytics FOR SELECT 
  USING (auth.uid() = user_id);

-- =============================================
-- 7. CLONE_FAQS (AI Training Data)
-- =============================================
CREATE TABLE public.clone_faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for clone_faqs
ALTER TABLE public.clone_faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own clone_faqs"
  ON public.clone_faqs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own clone_faqs"
  ON public.clone_faqs FOR ALL
  USING (auth.uid() = user_id);

-- =============================================
-- 8. BILLING_EVENTS (Stripe Webhooks)
-- =============================================
CREATE TABLE public.billing_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  
  -- Stripe event
  stripe_event_id TEXT UNIQUE NOT NULL,
  stripe_event_type TEXT NOT NULL,
  
  -- Payload
  payload JSONB NOT NULL,
  
  -- Processing
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_billing_events_user ON public.billing_events(user_id);
CREATE INDEX idx_billing_events_stripe ON public.billing_events(stripe_event_id);
CREATE INDEX idx_billing_events_processed ON public.billing_events(processed);

-- =============================================
-- 9. WAITLIST
-- =============================================
CREATE TABLE public.waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  sector TEXT,
  source TEXT DEFAULT 'landing',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist" 
  ON public.waitlist FOR INSERT 
  WITH CHECK (true);

-- =============================================
-- 9. TRIGGERS (Auto-update timestamps)
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clones_updated_at BEFORE UPDATE ON public.clones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON public.channels
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON public.conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 10. HELPER FUNCTIONS
-- =============================================

-- Auto-create profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, company_name)
  VALUES (
    NEW.id, 
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- DONE! Database is ready for VirtualTwin
-- =============================================
