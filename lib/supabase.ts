import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Lazy initialization to prevent build errors when env vars are not available
let _supabase: SupabaseClient | null = null;

export const getSupabase = (): SupabaseClient => {
    if (!_supabase) {
        if (!supabaseUrl || !supabaseAnonKey) {
            // During build time, return a mock client that won't be used
            console.warn('Supabase credentials not available, using placeholder client');
        }
        _supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseAnonKey || 'placeholder');
    }
    return _supabase;
};

// Export for backward compatibility - lazy initialized
export const supabase = {
    get from() {
        return getSupabase().from.bind(getSupabase());
    },
    get auth() {
        return getSupabase().auth;
    },
    get storage() {
        return getSupabase().storage;
    },
    get functions() {
        return getSupabase().functions;
    },
    get realtime() {
        return getSupabase().realtime;
    },
    get rpc() {
        return getSupabase().rpc.bind(getSupabase());
    },
    get channel() {
        return getSupabase().channel.bind(getSupabase());
    }
};
