// lib/supabase/admin.ts
// Server-side Supabase client with admin privileges
// ONLY use in API routes, never expose to client!

import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with service role key (admin access)
 * Use this for server-side operations that need to bypass RLS
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables for admin client');
    }

    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    });
}

// Singleton instance for reuse
let adminClient: ReturnType<typeof createAdminClient> | null = null;

export function getAdminClient() {
    if (!adminClient) {
        adminClient = createAdminClient();
    }
    return adminClient;
}
