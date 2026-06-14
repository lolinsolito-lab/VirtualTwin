import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRequest } from '@/lib/apiAuth';

/**
 * Public Academy API - For authenticated users
 * 
 * GET /api/academy/courses - Get courses accessible to user based on their tier
 */

// Tier hierarchy for access control
const TIER_HIERARCHY = ['curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'];

export async function GET(req: NextRequest) {
    try {
        const auth = await authenticateRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const userTier = auth.profile.plan_tier || 'curioso';

        // Get user's tier index
        const userTierIndex = TIER_HIERARCHY.indexOf(userTier);

        // User can access courses with min_tier <= their tier
        const accessibleTiers = TIER_HIERARCHY.slice(0, userTierIndex + 1);

        // Fetch published courses with modules
        const { data: courses, error } = await supabaseAdmin
            .from('academy_courses')
            .select(`
                *,
                modules:academy_modules(
                    id,
                    title,
                    description,
                    content_type,
                    content_url,
                    duration_minutes,
                    min_tier,
                    is_published,
                    is_preview,
                    display_order
                )
            `)
            .eq('is_published', true)
            .order('display_order', { ascending: true });

        if (error) throw error;

        // Process courses - mark which ones are accessible
        const processedCourses = courses?.map(course => {
            const isAccessible = accessibleTiers.includes(course.min_tier);

            // Filter and process modules
            const modules = (course.modules || [])
                .filter((m: any) => m.is_published)
                .sort((a: any, b: any) => a.display_order - b.display_order)
                .map((module: any) => ({
                    ...module,
                    // Module is accessible if course is accessible OR module is preview
                    isAccessible: isAccessible || module.is_preview,
                    isLocked: !isAccessible && !module.is_preview
                }));

            return {
                ...course,
                isAccessible,
                isLocked: !isAccessible,
                modules,
                module_count: modules.length
            };
        }) || [];

        return NextResponse.json({
            courses: processedCourses,
            userTier,
            accessibleTiers
        });

    } catch (error: any) {
        console.error('[Academy Public API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
