/**
 * Environment Variables Validator
 * VirtualTwin Sovereign Edition
 * 
 * Best practice: validates required env vars at runtime
 */

// Client-side env vars (pubbliche, visibili al browser)
export const ENV = {
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    GEMINI_API_KEY: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
} as const;

// Server-side env vars (private, solo server)
export const SERVER_ENV = {
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
} as const;

/**
 * Check if we're in build time (no runtime env available)
 */
export function isBuildTime(): boolean {
    // During Vercel build, VERCEL env is set but other vars might not be
    return typeof window === 'undefined' && !process.env.VERCEL_ENV;
}

/**
 * Validate required client env vars at runtime
 * Call this in app initialization
 */
export function validateClientEnv(): { valid: boolean; missing: string[] } {
    // Skip validation during build time
    if (isBuildTime()) {
        return { valid: true, missing: [] };
    }

    const missing: string[] = [];

    if (!ENV.SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL');
    if (!ENV.SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY');

    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Validate required server env vars
 * Call this in API routes that need specific vars
 */
export function validateServerEnv(required: (keyof typeof SERVER_ENV)[]): { valid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const key of required) {
        if (!SERVER_ENV[key]) {
            missing.push(key);
        }
    }

    return {
        valid: missing.length === 0,
        missing
    };
}

/**
 * Get env var with fallback for build time
 * Uses real value at runtime, placeholder during build
 */
export function getEnvSafe(key: keyof typeof ENV, fallback: string = ''): string {
    return ENV[key] || fallback;
}

/**
 * Get env var strictly - throws if missing at runtime
 */
export function getEnvStrict(key: keyof typeof ENV): string {
    const value = ENV[key];

    if (!value && !isBuildTime()) {
        throw new Error(
            `❌ Missing required environment variable: ${key}\n` +
            `Configure it in Vercel Dashboard or .env.local`
        );
    }

    return value || '';
}

/**
 * Log env status (for debugging - remove in production)
 */
export function logEnvStatus(): void {
    console.log('🔧 Environment Status:');
    console.log('  SUPABASE_URL:', ENV.SUPABASE_URL ? '✅ Set' : '❌ Missing');
    console.log('  SUPABASE_ANON_KEY:', ENV.SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing');
    console.log('  GEMINI_API_KEY:', ENV.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
    console.log('  Build Time:', isBuildTime() ? 'Yes' : 'No');
}
