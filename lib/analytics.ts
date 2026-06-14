import { supabase } from './supabase';

export interface AnalyticsMetrics {
    totalValue: number;
    leadCount: number;
    avgValue: number;
    conversionRate: number;
    stageDistribution: { name: string; count: number; value: number }[];
    recentActivity: { id: string; name: string; action: string; time: string; value?: number }[];
}

/**
 * Calcola le analytics reali dell'utente dalla tabella conversations
 * (Non usa più 'leads' o 'pipeline_stages' che non esistono nello schema)
 */
export async function getImperialAnalytics(userId: string): Promise<AnalyticsMetrics> {
    try {
        // 1. Fetch tutte le conversazioni dell'utente (= lead pipeline)
        const { data: conversations, error: convError } = await supabase
            .from('conversations')
            .select('id, contact_name, status, last_message_at, conversion_value, created_at')
            .eq('user_id', userId)
            .order('last_message_at', { ascending: false });

        if (convError) throw convError;

        const convs = conversations || [];

        // 2. Calcoli principali
        const totalValue = convs.reduce((acc, c) => acc + (c.conversion_value || 0), 0);
        const leadCount = convs.length;
        const avgValue = leadCount > 0 ? totalValue / leadCount : 0;

        // Conversion rate = conversazioni "closed" o "converted" sul totale
        const closedCount = convs.filter(c =>
            c.status === 'closed' || c.status === 'converted'
        ).length;
        const conversionRate = leadCount > 0 ? (closedCount / leadCount) * 100 : 0;

        // 3. Distribuzione per stage (mappa status → nome leggibile)
        const stageMap: Record<string, { name: string; display: string }> = {
            'active':    { name: 'active',    display: 'Inquiry' },
            'qualified': { name: 'qualified', display: 'Qualifica' },
            'converted': { name: 'converted', display: 'Negoziazione' },
            'closed':    { name: 'closed',    display: 'Chiuso' },
            'archived':  { name: 'archived',  display: 'Archiviato' },
        };

        const stageDistribution = Object.entries(stageMap).map(([status, info]) => {
            const stageConvs = convs.filter(c => c.status === status);
            return {
                name: info.display,
                count: stageConvs.length,
                value: stageConvs.reduce((acc, c) => acc + (c.conversion_value || 0), 0),
            };
        }).filter(s => s.count > 0); // Mostra solo stage con lead

        // 4. Attività recente (ultime 6 conversazioni)
        const recentActivity = convs.slice(0, 6).map(c => ({
            id: c.id,
            name: c.contact_name || 'Prospect Anonimo',
            action: c.status === 'active'    ? 'Interazione in corso' :
                    c.status === 'qualified' ? 'Lead Qualificato' :
                    c.status === 'converted' ? 'Trattativa Avanzata' :
                    c.status === 'closed'    ? 'Conversione Chiusa' : 'Archiviato',
            time: c.last_message_at
                ? new Date(c.last_message_at).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                : '--:--',
            value: c.conversion_value || undefined,
        }));

        // 5. Calcola trend rispetto ai 30 giorni precedenti
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const sixtyDaysAgo = new Date();
        sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

        const recentLeads = convs.filter(c => new Date(c.created_at) > thirtyDaysAgo).length;
        const prevLeads = convs.filter(c => {
            const d = new Date(c.created_at);
            return d > sixtyDaysAgo && d <= thirtyDaysAgo;
        }).length;

        const leadGrowthPct = prevLeads > 0
            ? Math.round(((recentLeads - prevLeads) / prevLeads) * 100)
            : recentLeads > 0 ? 100 : 0;

        return {
            totalValue,
            leadCount,
            avgValue,
            conversionRate,
            stageDistribution,
            recentActivity,
            // Extra per future use
            // @ts-ignore — estensione opzionale
            leadGrowthPct,
            recentLeads,
        };

    } catch (error) {
        console.error('[Analytics] Errore calcolo metriche:', error);
        // Ritorna zeri invece di crashare
        return {
            totalValue: 0,
            leadCount: 0,
            avgValue: 0,
            conversionRate: 0,
            stageDistribution: [],
            recentActivity: [],
        };
    }
}
