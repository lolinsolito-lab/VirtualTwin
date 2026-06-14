// =============================================
// VIRTUALTWIN API RATE LIMITING — v2.0
// Usa Upstash Redis per funzionare su Vercel
// (la Map() in-memory si resettava ad ogni deploy!)
//
// SETUP:
// 1. Vai su https://console.upstash.com → crea DB Redis free
// 2. Copia UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN
// 3. Aggiungili su Vercel → Settings → Environment Variables
// 4. npm install @upstash/redis @upstash/ratelimit
//
// COSTO: €0 fino a 10.000 req/giorno, poi ~€0.20 ogni 100K req
// =============================================

import { NextRequest, NextResponse } from 'next/server';

// Rate limits by plan (per minute)
export const RATE_LIMITS = {
    curioso: 5,           // 5 req/min (solo demo, no API access)
    solopreneur: 10,      // 10 req/min
    entrepreneur: 20,     // 20 req/min
    conquistatore: 60,    // 60 req/min
    imperatore: 300,      // 300 req/min (5 req/sec)
    sovereignty: 1000,    // Custom partnership
} as const;

// Monthly message limits (allineati con pricing.ts PLAN_LIMITS)
export const MONTHLY_LIMITS = {
    curioso: 100,
    solopreneur: 1000,
    entrepreneur: 5000,
    conquistatore: 20000,
    imperatore: 100000,
    sovereignty: 999999,
} as const;

export type PlanTier = keyof typeof RATE_LIMITS;

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    reset: Date;
    plan: PlanTier;
    error?: string;
}

// =============================================
// STRATEGIA FALLBACK:
// - Se Upstash è configurato → usa Redis (produzione)
// - Se NON configurato → usa Map() in-memory (sviluppo locale)
// =============================================

// In-memory fallback per sviluppo locale
const memoryStore: Map<string, { count: number; resetTime: number }> = new Map();

/**
 * Rate limit usando Redis Upstash (produzione) o Map in-memory (dev)
 */
export async function checkRateLimit(
    userId: string,
    plan: PlanTier
): Promise<RateLimitResult> {
    const limit = RATE_LIMITS[plan] || 5;
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minuto
    const key = `ratelimit:${userId}:${Math.floor(now / windowMs)}`;
    const resetTime = (Math.floor(now / windowMs) + 1) * windowMs;

    // Prova a usare Upstash Redis se configurato
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
        try {
            return await checkRateLimitRedis(userId, plan, limit, key, resetTime);
        } catch (err) {
            console.warn('[RateLimit] Redis non disponibile, fallback in-memory:', err);
            // Fall through to in-memory
        }
    }

    // Fallback in-memory (sviluppo locale)
    return checkRateLimitMemory(userId, plan, limit, key, resetTime, now);
}

/**
 * Rate limit con Upstash Redis — funziona su Vercel serverless
 */
async function checkRateLimitRedis(
    userId: string,
    plan: PlanTier,
    limit: number,
    key: string,
    resetTime: number
): Promise<RateLimitResult> {
    const url = `${process.env.UPSTASH_REDIS_REST_URL}/pipeline`;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN!;

    // Pipeline: INCR + EXPIRE in una sola chiamata
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify([
            ['INCR', key],
            ['EXPIRE', key, 60],  // TTL 60 secondi
        ]),
    });

    if (!response.ok) throw new Error(`Upstash error: ${response.status}`);

    const [incrResult] = await response.json();
    const count = incrResult.result as number;

    if (count > limit) {
        return {
            allowed: false,
            remaining: 0,
            reset: new Date(resetTime),
            plan,
            error: `Rate limit superato. Max ${limit} richieste/minuto sul piano ${plan}.`,
        };
    }

    return {
        allowed: true,
        remaining: limit - count,
        reset: new Date(resetTime),
        plan,
    };
}

/**
 * Rate limit in-memory — solo per sviluppo locale
 * ⚠️ NON usare in produzione Vercel (stateless functions)
 */
function checkRateLimitMemory(
    userId: string,
    plan: PlanTier,
    limit: number,
    key: string,
    resetTime: number,
    now: number
): RateLimitResult {
    const current = memoryStore.get(key) || { count: 0, resetTime };

    if (current.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            reset: new Date(current.resetTime),
            plan,
            error: `Rate limit superato. Max ${limit} richieste/minuto.`,
        };
    }

    memoryStore.set(key, {
        count: current.count + 1,
        resetTime: current.resetTime,
    });

    // Cleanup entries scadute
    for (const [k, v] of memoryStore.entries()) {
        if (v.resetTime < now) memoryStore.delete(k);
    }

    return {
        allowed: true,
        remaining: limit - current.count - 1,
        reset: new Date(current.resetTime),
        plan,
    };
}

/**
 * Check monthly message limit (usa Supabase, non Redis)
 */
export async function checkMonthlyLimit(
    userId: string,
    plan: PlanTier,
    currentUsage: number
): Promise<{ allowed: boolean; remaining: number; limit: number; error?: string }> {
    const limit = MONTHLY_LIMITS[plan] ?? 100;

    if (currentUsage >= limit) {
        return {
            allowed: false,
            remaining: 0,
            limit,
            error: `Limite mensile raggiunto (${limit.toLocaleString('it-IT')} messaggi). Fai upgrade per continuare.`,
        };
    }

    return {
        allowed: true,
        remaining: limit - currentUsage,
        limit,
    };
}

/**
 * Middleware helper — aggiunge rate limit headers alla response
 */
export function addRateLimitHeaders(
    response: NextResponse,
    result: RateLimitResult
): NextResponse {
    const limit = RATE_LIMITS[result.plan] || 5;
    response.headers.set('X-RateLimit-Limit', String(limit));
    response.headers.set('X-RateLimit-Remaining', String(result.remaining));
    response.headers.set('X-RateLimit-Reset', result.reset.toISOString());
    return response;
}

/**
 * Middleware wrapper con rate limiting integrato
 */
export function withRateLimit(
    handler: (req: NextRequest, userId: string, plan: PlanTier) => Promise<NextResponse>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid Authorization header' },
                { status: 401 }
            );
        }

        const apiKey = authHeader.replace('Bearer ', '');

        // Importazione lazy per evitare problemi di circular dependency
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id, plan_tier')
            .eq('api_key', apiKey)
            .single();

        if (error || !profile) {
            return NextResponse.json({ error: 'API key non valida' }, { status: 401 });
        }

        const plan = (profile.plan_tier?.toLowerCase() || 'curioso') as PlanTier;
        const rateResult = await checkRateLimit(profile.id, plan);

        if (!rateResult.allowed) {
            const res = NextResponse.json(
                { error: rateResult.error },
                { status: 429 }
            );
            return addRateLimitHeaders(res, rateResult);
        }

        const response = await handler(req, profile.id, plan);
        return addRateLimitHeaders(response, rateResult);
    };
}
