import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { authenticateRequest } from '@/lib/apiAuth';

/**
 * API: Get user's purchased add-ons
 * GET /api/user/purchases?userId=xxx
 * 
 * Note: userId is passed from client via SovereignProvider context
 * This avoids server-side auth issues while maintaining security
 */
export async function GET(req: NextRequest) {
    try {
        // 🔐 Require authenticated session
        const auth = await authenticateRequest(req);
        if (auth.error) {
            return NextResponse.json({ purchases: [], count: 0 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            // Return empty array instead of error - component handles this gracefully
            return NextResponse.json({ purchases: [], count: 0 });
        }

        // 🔐 Users can only fetch their own purchases (IDOR prevention)
        if (auth.user.id !== userId) {
            return NextResponse.json({ purchases: [], count: 0 });
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
            .eq('user_id', userId)
            .eq('status', 'active')
            .order('purchased_at', { ascending: false });

        if (error) {
            console.error('[Purchases API] Error:', error);
            // Return empty on error - don't break the page
            return NextResponse.json({ purchases: [], count: 0 });
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
        return NextResponse.json({ purchases: [], count: 0 });
    }
}

/**
 * Mark a purchase as accessed (for tracking)
 * POST /api/user/purchases
 */
export async function POST(req: NextRequest) {
    try {
        const { purchaseId, userId } = await req.json();

        if (!purchaseId || !userId) {
            return NextResponse.json({ error: 'Purchase ID and User ID required' }, { status: 400 });
        }

        // Update accessed_at timestamp
        const { error } = await supabaseAdmin
            .from('user_addons')
            .update({ accessed_at: new Date().toISOString() })
            .eq('id', purchaseId)
            .eq('user_id', userId);

        if (error) throw error;

        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[Purchases API] POST Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
