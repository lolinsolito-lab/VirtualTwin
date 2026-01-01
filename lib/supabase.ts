import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getEnvSafe, isBuildTime } from './env';

// Get environment variables with build-time safety
const supabaseUrl = getEnvSafe('SUPABASE_URL', 'https://placeholder.supabase.co');
const supabaseAnonKey = getEnvSafe('SUPABASE_ANON_KEY', 'placeholder-key-for-build');

// Create client - uses placeholder during build, real values at runtime
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Admin client for server-side operations (bypasses RLS)
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-for-build';
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

// Helper to check if a user is a SuperAdmin
export const isSuperAdmin = async (userId: string): Promise<boolean> => {
    if (!userId) return false;
    const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('is_super_admin')
        .eq('id', userId)
        .single();

    if (error || !data) return false;
    return !!data.is_super_admin;
};

// Export for components that need to check configuration
export { isBuildTime };
