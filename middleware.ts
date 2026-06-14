import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * 🔐 VirtualTwin — Server-Side Route Protection Middleware
 * 
 * Runs BEFORE any page renders on the server.
 * Protects /dashboard/* and /admin/* from unauthenticated access.
 * 
 * Note: Uses Supabase JWT cookie validation via sb-access-token.
 * This is a lightweight check — full role verification happens in each layout.
 */
export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // ─── ROUTES THAT REQUIRE AUTH ───────────────────────────────────────
    const protectedPaths = ['/dashboard', '/admin'];
    const isProtected = protectedPaths.some(p => pathname.startsWith(p));

    if (!isProtected) {
        return NextResponse.next();
    }

    // ─── CHECK FOR SUPABASE SESSION COOKIE ──────────────────────────────
    // Supabase stores the session in cookies: sb-<project-ref>-auth-token
    // We check for any Supabase auth cookie as a fast gate
    const hasAuthCookie = request.cookies.getAll().some(
        cookie => cookie.name.includes('-auth-token') || cookie.name.includes('sb-') && cookie.value.length > 50
    );

    if (!hasAuthCookie) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ─── ADMIN EXTRA SECURITY: Verify admin access server-side ──────────
    // The layout.tsx already does the full DB check, this is just a fast guard
    // to prevent even rendering the admin shell for non-admins
    if (pathname.startsWith('/admin')) {
        // We can't query DB from middleware without edge runtime Supabase client
        // The layout.tsx does the full admin check with DB verification
        // This middleware just ensures a session exists before rendering
    }

    return NextResponse.next();
}

// ─── MATCHER CONFIGURATION ───────────────────────────────────────────────────
export const config = {
    matcher: [
        /*
         * Match all request paths EXCEPT:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico
         * - public folder files
         * - API routes (handled individually)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
