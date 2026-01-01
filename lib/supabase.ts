import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get environment variables with fallbacks for build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key-for-build';

// Create client - will use placeholder during build, real values at runtime
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if we have real credentials
export const isSupabaseConfigured = (): boolean => {
    return !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
};
