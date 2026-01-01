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

        // Mock conversion rate for now or calculate based on 'Closed' stage
        const closedLeads = leads.filter(l => l.pipeline_stages?.name?.toLowerCase().includes('closed')).length;
        const conversionRate = leadCount > 0 ? (closedLeads / leadCount) * 100 : 0;

        // Stage Distribution
        const stageDistribution = stages.map(stage => {
            const stageLeads = leads.filter(l => l.stage_id === stage.id);
            return {
                name: stage.name,
                count: stageLeads.length,
                value: stageLeads.reduce((acc, l) => acc + (l.estimated_value || 0), 0)
            };
        });

        // Recent Activity (Mocking some for now, ideally from a logs table)
        const recentActivity = leads.slice(0, 5).map(l => ({
            id: l.id,
            name: l.full_name,
            action: "Nuovo Lead acquisito",
            time: "Oggi",
            value: l.estimated_value
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
