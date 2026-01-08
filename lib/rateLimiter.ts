// =============================================
// VIRTUALTWIN API RATE LIMITING
// Plan-based rate limits for API access
// =============================================

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Rate limits by plan (per minute)
export const RATE_LIMITS = {
    curioso: 0,          // No API access
    solopreneur: 0,      // No API access
    entrepreneur: 0,     // No API access
    conquistatore: 60,   // 60 req/min
    imperatore: 300,     // 300 req/min (5 req/sec)
    sovereignty: 1000    // Custom partnership
} as const;

// Monthly message limits
export const MONTHLY_LIMITS = {
    curioso: 100,
    solopreneur: 1000,
    entrepreneur: 5000,
    conquistatore: 20000,
    imperatore: 100000,
    sovereignty: 999999
} as const;

export type PlanTier = keyof typeof RATE_LIMITS;

interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    reset: Date;
    plan: PlanTier;
    error?: string;
}

// In-memory rate limiting (for production, use Redis/Upstash)
const rateLimitStore: Map<string, { count: number; resetTime: number }> = new Map();

/**
 * Check if request is within rate limits
 */
export async function checkRateLimit(
    userId: string,
    plan: PlanTier
): Promise<RateLimitResult> {
    const limit = RATE_LIMITS[plan];

    // Plans without API access
    if (limit === 0) {
        return {
            allowed: false,
            remaining: 0,
            reset: new Date(),
            plan,
            error: `API access not available on ${plan} plan. Upgrade to Conquistatore or higher.`
        };
    }

    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute window
    const key = `${userId}:${Math.floor(now / windowMs)}`;

    const current = rateLimitStore.get(key) || { count: 0, resetTime: now + windowMs };

    if (current.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            reset: new Date(current.resetTime),
            plan,
            error: `Rate limit exceeded. Max ${limit} requests per minute.`
        };
    }

    // Increment counter
    rateLimitStore.set(key, {
        count: current.count + 1,
        resetTime: current.resetTime
    });

    // Cleanup old entries
    for (const [k, v] of rateLimitStore.entries()) {
        if (v.resetTime < now) {
            rateLimitStore.delete(k);
        }
    }

    return {
        allowed: true,
        remaining: limit - current.count - 1,
        reset: new Date(current.resetTime),
        plan
    };
}

/**
 * Check if user is within monthly message limit
 */
export async function checkMonthlyLimit(
    userId: string,
    plan: PlanTier,
    currentUsage: number
): Promise<{ allowed: boolean; remaining: number; limit: number; error?: string }> {
    const limit = MONTHLY_LIMITS[plan];

    if (currentUsage >= limit) {
        return {
            allowed: false,
            remaining: 0,
            limit,
            error: `Monthly limit reached (${limit} messages). Upgrade to increase your limit.`
        };
    }

    return {
        allowed: true,
        remaining: limit - currentUsage,
        limit
    };
}

/**
 * API middleware for rate limiting
 */
export function withRateLimit(
    handler: (req: NextRequest, userId: string, plan: PlanTier) => Promise<NextResponse>
) {
    return async (req: NextRequest): Promise<NextResponse> => {
        // Extract API key from Authorization header
        const authHeader = req.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Missing or invalid Authorization header' },
                { status: 401 }
            );
        }

        const apiKey = authHeader.replace('Bearer ', '');

        // Validate API key and get user info
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
            return NextResponse.json(
                { error: 'Invalid API key' },
                { status: 401 }
            );
        }

        const plan = (profile.plan_tier?.toLowerCase() || 'curioso') as PlanTier;

        // Check rate limit
        const rateResult = await checkRateLimit(profile.id, plan);
        if (!rateResult.allowed) {
            return NextResponse.json(
                { error: rateResult.error },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': String(RATE_LIMITS[plan]),
                        'X-RateLimit-Remaining': String(rateResult.remaining),
                        'X-RateLimit-Reset': rateResult.reset.toISOString()
                    }
                }
            );
        }

        // Add rate limit headers to response
        const response = await handler(req, profile.id, plan);
        response.headers.set('X-RateLimit-Limit', String(RATE_LIMITS[plan]));
        response.headers.set('X-RateLimit-Remaining', String(rateResult.remaining));
        response.headers.set('X-RateLimit-Reset', rateResult.reset.toISOString());

        return response;
    };
}
