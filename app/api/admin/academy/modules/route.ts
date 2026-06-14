import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateAdminRequest } from '@/lib/apiAuth';

/**
 * Academy Modules API - Full CRUD
 * 
 * GET /api/admin/academy/modules - List modules (optional: by course_id) (Admin only)
 * POST /api/admin/academy/modules - Create new module (Admin only)
 * PUT /api/admin/academy/modules - Update module (Admin only)
 * DELETE /api/admin/academy/modules - Delete module (Admin only)
 */

// GET - List modules
export async function GET(req: NextRequest) {
    try {
        const auth = await authenticateAdminRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const { searchParams } = new URL(req.url);
        const courseId = searchParams.get('course_id');
        const publishedOnly = searchParams.get('published') === 'true';

        let query = supabaseAdmin
            .from('academy_modules')
            .select('*')
            .order('display_order', { ascending: true });

        if (courseId) {
            query = query.eq('course_id', courseId);
        }

        if (publishedOnly) {
            query = query.eq('is_published', true);
        }

        const { data, error } = await query;

        if (error) throw error;

        return NextResponse.json({ modules: data || [] });
    } catch (error: any) {
        console.error('[Academy Modules API] GET Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create new module
export async function POST(req: NextRequest) {
    try {
        const auth = await authenticateAdminRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const body = await req.json();

        const {
            course_id,
            title,
            description,
            content_type = 'video',
            content_url,
            thumbnail_url,
            duration_minutes,
            min_tier,
            is_published = false,
            is_preview = false,
            display_order = 0
        } = body;

        if (!course_id || !title) {
            return NextResponse.json(
                { error: 'course_id and title are required' },
                { status: 400 }
            );
        }

        const { data: module, error } = await supabaseAdmin
            .from('academy_modules')
            .insert({
                course_id,
                title,
                description,
                content_type,
                content_url,
                thumbnail_url,
                duration_minutes,
                min_tier,
                is_published,
                is_preview,
                display_order
            })
            .select()
            .single();

        if (error) throw error;

        console.log(`[Academy Modules API] ✅ Module created: ${module.title}`);

        return NextResponse.json({ success: true, module });

    } catch (error: any) {
        console.error('[Academy Modules API] POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PUT - Update module
export async function PUT(req: NextRequest) {
    try {
        const auth = await authenticateAdminRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
        }

        const { data: module, error } = await supabaseAdmin
            .from('academy_modules')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        console.log(`[Academy Modules API] ✅ Module updated: ${module.title}`);

        return NextResponse.json({ success: true, module });

    } catch (error: any) {
        console.error('[Academy Modules API] PUT Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE - Delete module
export async function DELETE(req: NextRequest) {
    try {
        const auth = await authenticateAdminRequest(req);
        if (auth.error) {
            return NextResponse.json({ error: auth.error }, { status: auth.statusCode });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
        }

        const { error } = await supabaseAdmin
            .from('academy_modules')
            .delete()
            .eq('id', id);

        if (error) throw error;

        console.log(`[Academy Modules API] ✅ Module deleted: ${id}`);

        return NextResponse.json({ success: true, message: 'Module deleted' });

    } catch (error: any) {
        console.error('[Academy Modules API] DELETE Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
