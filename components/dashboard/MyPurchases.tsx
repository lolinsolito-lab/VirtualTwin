'use client';

import React, { useState, useEffect } from 'react';
import {
    Package,
    Download,
    Calendar,
    FileText,
    Video,
    Headphones,
    BookOpen,
    Gift,
    Sparkles,
    Loader2,
    CheckCircle2,
    Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSovereign } from '@/components/providers/SovereignProvider';

interface Purchase {
    id: string;
    addon_id: string;
    addon_name: string;
    addon_type: string;
    price_paid: number;
    delivery_url: string | null;
    delivery_instructions: string | null;
    purchased_at: string;
    status: string;
    accessed_at: string | null;
    icon?: string;
    description?: string;
}

const TYPE_ICONS: Record<string, any> = {
    service: Calendar,
    pdf: FileText,
    ebook: BookOpen,
    video: Video,
    audio: Headphones,
    webinar: Video,
    course: BookOpen,
    template: FileText,
    default: Gift
};

const TYPE_LABELS: Record<string, string> = {
    service: 'Servizio',
    pdf: 'PDF',
    ebook: 'eBook',
    video: 'Video',
    audio: 'Audio',
    webinar: 'Webinar',
    course: 'Corso',
    template: 'Template'
};

const TYPE_COLORS: Record<string, string> = {
    service: 'bg-blue-500/20 text-blue-600 border-blue-500/30',
    pdf: 'bg-red-500/20 text-red-600 border-red-500/30',
    ebook: 'bg-purple-500/20 text-purple-600 border-purple-500/30',
    video: 'bg-pink-500/20 text-pink-600 border-pink-500/30',
    audio: 'bg-orange-500/20 text-orange-600 border-orange-500/30',
    webinar: 'bg-indigo-500/20 text-indigo-600 border-indigo-500/30',
    course: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30',
    template: 'bg-cyan-500/20 text-cyan-600 border-cyan-500/30',
    default: 'bg-gold/20 text-gold border-gold/30'
};

export default function MyPurchases() {
    const { user, loading: userLoading } = useSovereign();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessingId, setAccessingId] = useState<string | null>(null);

    useEffect(() => {
        if (!userLoading && user?.id) {
            fetchPurchases();
        } else if (!userLoading) {
            setLoading(false);
        }
    }, [user?.id, userLoading]);

    const fetchPurchases = async () => {
        if (!user?.id) return;

        try {
            const res = await fetch(`/api/user/purchases?userId=${user.id}`);
            const data = await res.json();
            setPurchases(data.purchases || []);
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccess = async (purchase: Purchase) => {
        if (!purchase.delivery_url || !user?.id) return;

        setAccessingId(purchase.id);

        // Mark as accessed
        try {
            await fetch('/api/user/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchaseId: purchase.id, userId: user.id })
            });
        } catch (error) {
            console.error('Failed to mark as accessed:', error);
        }

        // Open the content
        window.open(purchase.delivery_url, '_blank');

        setTimeout(() => {
            setAccessingId(null);
            fetchPurchases();
        }, 1000);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('it-IT', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatPrice = (cents: number) => {
        return `€${(cents / 100).toFixed(2)}`;
    };

    // Loading state
    if (loading || userLoading) {
        return (
            <div className="bg-white/60 border border-charcoal/10 rounded-3xl p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 text-gold animate-spin" />
            </div>
        );
    }

    // Empty state - Better contrast for champagne background
    if (purchases.length === 0) {
        return (
            <div className="bg-white/60 border border-charcoal/10 rounded-3xl p-8 text-center backdrop-blur-sm">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-charcoal/5 flex items-center justify-center">
                    <Package className="w-7 h-7 text-charcoal/20" />
                </div>
                <h3 className="text-lg font-serif italic text-charcoal/60 mb-2">Nessun acquisto</h3>
                <p className="text-charcoal/40 text-sm">
                    I tuoi add-on acquistati appariranno qui
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/20">
                        <Package className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif italic text-charcoal">I Miei Acquisti</h2>
                        <p className="text-charcoal/40 text-sm">{purchases.length} prodotti acquistati</p>
                    </div>
                </div>
            </div>

            {/* Purchases Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence>
                    {purchases.map((purchase, index) => {
                        const TypeIcon = TYPE_ICONS[purchase.addon_type] || TYPE_ICONS.default;
                        const typeColor = TYPE_COLORS[purchase.addon_type] || TYPE_COLORS.default;
                        const typeLabel = TYPE_LABELS[purchase.addon_type] || purchase.addon_type;

                        return (
                            <motion.div
                                key={purchase.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl border border-charcoal/10 overflow-hidden hover:border-gold/30 hover:shadow-luxury transition-all group"
                            >
                                {/* Card Header */}
                                <div className="p-6 pb-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeColor}`}>
                                                <TypeIcon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <span className={`text-[8px] px-2 py-0.5 rounded border uppercase font-black ${typeColor}`}>
                                                    {typeLabel}
                                                </span>
                                            </div>
                                        </div>
                                        {purchase.accessed_at && (
                                            <div className="flex items-center gap-1 text-green-600">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase">Acceduto</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-serif text-charcoal mb-2 group-hover:text-gold transition-colors">
                                        {purchase.addon_name}
                                    </h3>

                                    {purchase.description && (
                                        <p className="text-charcoal/50 text-sm line-clamp-2 mb-4">
                                            {purchase.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-[10px] text-charcoal/40 uppercase tracking-widest">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {formatDate(purchase.purchased_at)}
                                        </span>
                                        <span className="text-gold font-bold">
                                            {formatPrice(purchase.price_paid)}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Footer - Action */}
                                <div className="border-t border-charcoal/5 p-4 bg-charcoal/[0.02]">
                                    {purchase.delivery_url ? (
                                        <button
                                            onClick={() => handleAccess(purchase)}
                                            disabled={accessingId === purchase.id}
                                            className="w-full py-3 px-4 gold-gradient hover:scale-[1.02] rounded-xl text-white font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-luxury disabled:opacity-50"
                                        >
                                            {accessingId === purchase.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : purchase.addon_type === 'service' ? (
                                                <>
                                                    <Calendar className="w-4 h-4" />
                                                    Prenota Ora
                                                </>
                                            ) : (
                                                <>
                                                    <Download className="w-4 h-4" />
                                                    Accedi / Scarica
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <div className="w-full py-3 px-4 bg-charcoal/5 border border-charcoal/10 rounded-xl text-charcoal/40 text-xs uppercase tracking-widest text-center">
                                            <Sparkles className="w-4 h-4 inline mr-2" />
                                            In Elaborazione
                                        </div>
                                    )}

                                    {/* Delivery Instructions */}
                                    {purchase.delivery_instructions && (
                                        <p className="mt-3 text-[11px] text-charcoal/40 text-center italic">
                                            {purchase.delivery_instructions}
                                        </p>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>
        </div>
    );
}
