import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { getEnvSafe, isBuildTime } from './env';

// Get environment variables with build-time safety
const supabaseUrl = getEnvSafe('SUPABASE_URL', 'https://placeholder.supabase.co');
const supabaseAnonKey = getEnvSafe('SUPABASE_ANON_KEY', 'placeholder-key-for-build');

// Create client - uses placeholder during build, real values at runtime
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};

// Export for components that need to check configuration
export { isBuildTime };
