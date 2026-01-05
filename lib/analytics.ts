import { supabase } from './supabase';

export interface AnalyticsMetrics {
    totalValue: number;
    leadCount: number;
    avgValue: number;
    conversionRate: number;
    stageDistribution: { name: string; count: number; value: number }[];
    recentActivity: { id: string; name: string; action: string; time: string; value?: number }[];
}

export async function getImperialAnalytics(tenantId: string): Promise<AnalyticsMetrics> {
    try {
        // 1. Fetch all leads for the tenant
        const { data: leads, error: leadsError } = await supabase
            .from('leads')
            .select('*, pipeline_stages(name)')
            .eq('tenant_id', tenantId);

        if (leadsError) throw leadsError;

        // 2. Fetch stages configuration
        const { data: stages, error: stagesError } = await supabase
            .from('pipeline_stages')
            .select('*')
            .eq('tenant_id', tenantId)
            .order('order_index', { ascending: true });

        if (stagesError) throw stagesError;

        // 3. Calculation Logic
        const totalValue = leads.reduce((acc, lead) => acc + (lead.estimated_value || 0), 0);
        const leadCount = leads.length;
        const avgValue = leadCount > 0 ? totalValue / leadCount : 0;

        // Calculate conversion rate based on real 'closed' status
        const closedLeads = leads.filter(l => l.pipeline_stages?.name?.toLowerCase().includes('closed') || l.status === 'closed').length;
        const conversionRate = leadCount > 0 ? (closedLeads / leadCount) * 100 : 0;

        // Stage Distribution (Real mapping)
        const stageDistribution = stages.map(stage => {
            const stageLeads = leads.filter(l => l.stage_id === stage.id);
            return {
                name: stage.name,
                count: stageLeads.length,
                value: stageLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0)
            };
        });

        // 4. Fetch Authentic Recent Activity from conversations
        const { data: recentConv, error: convError } = await supabase
            .from('conversations')
            .select('id, contact_name, status, last_message_at, conversion_value')
            .eq('user_id', tenantId) // Assuming tenantId maps to user_id in conversations
            .order('last_message_at', { ascending: false })
            .limit(6);

        if (convError) throw convError;

        const recentActivity = (recentConv || []).map(c => ({
            id: c.id,
            name: c.contact_name || 'Prospect Anonimo',
            action: c.status === 'active' ? 'Interazione in corso' :
                c.status === 'qualified' ? 'Lead Qualificato' :
                    c.status === 'converted' ? 'Trattativa Avanzata' : 'Conversione Chiusa',
            time: new Date(c.last_message_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
            value: c.conversion_value
        }));

        return {
            totalValue,
            leadCount,
            avgValue,
            conversionRate,
            stageDistribution,
            recentActivity
        };

    } catch (error) {
        console.error("Analytics Calculation Error:", error);
        return {
            totalValue: 0,
            leadCount: 0,
            avgValue: 0,
            conversionRate: 0,
            stageDistribution: [],
            recentActivity: []
        };
    }
}
