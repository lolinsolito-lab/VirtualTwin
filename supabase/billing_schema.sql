-- 1. Create Subscriptions Table
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    stripe_subscription_id TEXT UNIQUE,
    stripe_customer_id TEXT,
    plan_type TEXT NOT NULL, -- 'free', 'starter', 'pro', 'agency'
    status TEXT NOT NULL, -- 'active', 'trialing', 'past_due', 'canceled'
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add subscription fields to tenants table
ALTER TABLE public.tenants 
ADD COLUMN IF NOT EXISTS plan_type TEXT DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES public.subscriptions(id);

-- 3. Enable RLS on subscriptions
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policy: Tenants can only see their own subscriptions
-- Note: This policy assumes that tenant_id is the same as the user's organization/tenant
-- Adjust based on your actual auth structure (e.g., using auth.jwt() claims)
CREATE POLICY "Tenants can view own subscriptions" ON public.subscriptions
    FOR SELECT USING (true); -- Permissive for now, tighten based on your auth model

-- Alternative: If you have a user_tenants junction table, use:
-- CREATE POLICY "Tenants can view own subscriptions" ON public.subscriptions
--     FOR SELECT USING (tenant_id IN (
--         SELECT tenant_id FROM public.user_tenants WHERE user_id = auth.uid()
--     ));

-- 5. Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
