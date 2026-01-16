import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

/**
 * Academy Courses API - Full CRUD
 * 
 * GET /api/admin/academy/courses - List all courses
 * POST /api/admin/academy/courses - Create new course
 * PUT /api/admin/academy/courses - Update course
 * DELETE /api/admin/academy/courses - Delete course
 */

// GET - List all courses with module count
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const publishedOnly = searchParams.get('published') === 'true';
        const tier = searchParams.get('tier');

        let query = supabaseAdmin
            .from('academy_courses')
            .select(`
                *,
                modules:academy_modules(count)
            `)
            .order('display_order', { ascending: true });

        if (publishedOnly) {
            query = query.eq('is_published', true);
        }

        if (tier) {
            // Filter by tier access (users can access courses <= their tier)
            const tierOrder = ['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'];
            const userTierIndex = tierOrder.indexOf(tier);
            const accessibleTiers = tierOrder.slice(0, userTierIndex + 1);
            query = query.in('min_tier', accessibleTiers);
        }

        const { data, error } = await query;

        if (error) throw error;

        // Transform module count
        const courses = data?.map(course => ({
            ...course,
            module_count: course.modules?.[0]?.count || 0
        })) || [];

        return NextResponse.json({ courses });
    } catch (error: any) {
        console.error('[Academy API] GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new course
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const {
            title,
            description,
            thumbnail_url,
            min_tier = 'solopreneur',
            is_published = false,
            is_featured = false,
            display_order = 0
        } = body;

        if (!title) {
            return NextResponse.json(
                { error: 'Title is required' },
                { status: 400 }
            );
        }

        const { data: course, error } = await supabaseAdmin
            .from('academy_courses')
            .insert({
                title,
                description,
                thumbnail_url,
                min_tier,
                is_published,
                is_featured,
                display_order
            })
            .select()
            .single();

        if (error) throw error;

        console.log(`[Academy API] ✅ Course created: ${course.title}`);

        return NextResponse.json({ success: true, course });

    } catch (error: any) {
        console.error('[Academy API] POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update course
export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const { data: course, error } = await supabaseAdmin
            .from('academy_courses')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        console.log(`[Academy API] ✅ Course updated: ${course.title}`);

        return NextResponse.json({ success: true, course });

    } catch (error: any) {
        console.error('[Academy API] PUT Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete course (and all its modules via CASCADE)
export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('academy_courses')
            .delete()
            .eq('id', id);

        if (error) throw error;

        console.log(`[Academy API] ✅ Course deleted: ${id}`);

        return NextResponse.json({ success: true, message: 'Course deleted' });

    } catch (error: any) {
        console.error('[Academy API] DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
