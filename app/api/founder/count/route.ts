/**
 * Founder Count API Route
 * 
 * Returns the current number of founders (is_founder = true)
 */

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Count profiles where is_founder = true
        const { count, error } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('is_founder', true);

        if (error) {
            console.error('[Founder Count] Error:', error);
            return NextResponse.json({ count: 0 }, { status: 200 });
        }

        return NextResponse.json({
            count: count || 0,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('[Founder Count] Error:', error);
        return NextResponse.json({ count: 0 }, { status: 200 });
    }
}
