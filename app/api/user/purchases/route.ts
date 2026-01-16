import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin } from '@/lib/supabase';

/**
 * API: Get user's purchased add-ons
 * GET /api/user/purchases
 */
export async function GET(req: NextRequest) {
    try {
        // Get current user from session
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch user's purchases with addon details
        const { data: purchases, error } = await supabaseAdmin
            .from('user_addons')
            .select(`
                id,
                addon_id,
                addon_name,
                addon_type,
                price_paid,
                delivery_url,
                delivery_instructions,
                purchased_at,
                status,
                accessed_at,
                metadata
            `)
            .eq('user_id', user.id)
            .eq('status', 'active')
            .order('purchased_at', { ascending: false });

        if (error) {
            console.error('[Purchases API] Error:', error);
            throw error;
        }

        // Enrich with addon info if addon_id exists
        const enrichedPurchases = await Promise.all(
            (purchases || []).map(async (purchase) => {
                if (purchase.addon_id) {
                    const { data: addon } = await supabaseAdmin
                        .from('addons')
                        .select('icon, description, product_type, delivery_url, delivery_instructions')
                        .eq('id', purchase.addon_id)
                        .single();

                    return {
                        ...purchase,
                        icon: addon?.icon || 'gift',
                        description: addon?.description,
                        // Use addon's delivery info if purchase doesn't have it
                        delivery_url: purchase.delivery_url || addon?.delivery_url,
                        delivery_instructions: purchase.delivery_instructions || addon?.delivery_instructions
                    };
                }
                return { ...purchase, icon: 'gift' };
            })
        );

        return NextResponse.json({
            purchases: enrichedPurchases,
            count: enrichedPurchases.length
        });

    } catch (error: any) {
        console.error('[Purchases API] Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

/**
 * Mark a purchase as accessed (for tracking)
 * POST /api/user/purchases
 */
export async function POST(req: NextRequest) {
    try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { purchaseId } = await req.json();

        if (!purchaseId) {
            return NextResponse.json({ error: 'Purchase ID required' }, { status: 400 });
        }

        // Update accessed_at timestamp
        const { error } = await supabaseAdmin
            .from('user_addons')
            .update({ accessed_at: new Date().toISOString() })
            .eq('id', purchaseId)
            .eq('user_id', user.id);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[Purchases API] POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
