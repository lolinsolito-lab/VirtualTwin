'use client';

import React, { useState, useEffect } from 'react';
import {
    Package,
    Download,
    ExternalLink,
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
    service: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    pdf: 'bg-red-500/20 text-red-400 border-red-500/30',
    ebook: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    video: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
    audio: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    webinar: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    course: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    template: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    default: 'bg-gold/20 text-gold border-gold/30'
};

export default function MyPurchases() {
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessingId, setAccessingId] = useState<string | null>(null);

    useEffect(() => {
        fetchPurchases();
    }, []);

    const fetchPurchases = async () => {
        try {
            const res = await fetch('/api/user/purchases');
            const data = await res.json();
            setPurchases(data.purchases || []);
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAccess = async (purchase: Purchase) => {
        if (!purchase.delivery_url) return;

        setAccessingId(purchase.id);

        // Mark as accessed
        try {
            await fetch('/api/user/purchases', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ purchaseId: purchase.id })
            });
        } catch (error) {
            console.error('Failed to mark as accessed:', error);
        }

        // Open the content
        window.open(purchase.delivery_url, '_blank');

        setTimeout(() => {
            setAccessingId(null);
            fetchPurchases(); // Refresh to show updated accessed_at
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

    if (loading) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-gold animate-spin" />
            </div>
        );
    }

    if (purchases.length === 0) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
                <Package className="w-16 h-16 mx-auto mb-4 text-white/10" />
                <h3 className="text-xl font-serif text-white/40 mb-2">Nessun acquisto</h3>
                <p className="text-white/20 text-sm">
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
                    <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-serif text-white">I Miei Acquisti</h2>
                        <p className="text-white/40 text-sm">{purchases.length} prodotti acquistati</p>
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
                                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-gold/30 transition-all group"
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
                                            <div className="flex items-center gap-1 text-green-400">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span className="text-[10px] font-bold uppercase">Acceduto</span>
                                            </div>
                                        )}
                                    </div>

                                    <h3 className="text-lg font-serif text-white mb-2 group-hover:text-gold transition-colors">
                                        {purchase.addon_name}
                                    </h3>

                                    {purchase.description && (
                                        <p className="text-white/40 text-sm line-clamp-2 mb-4">
                                            {purchase.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-4 text-[10px] text-white/30 uppercase tracking-widest">
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
                                <div className="border-t border-white/5 p-4 bg-black/20">
                                    {purchase.delivery_url ? (
                                        <button
                                            onClick={() => handleAccess(purchase)}
                                            disabled={accessingId === purchase.id}
                                            className="w-full py-3 px-4 bg-gold/10 hover:bg-gold/20 border border-gold/30 rounded-xl text-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
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
                                        <div className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-xl text-white/30 text-xs uppercase tracking-widest text-center">
                                            <Sparkles className="w-4 h-4 inline mr-2" />
                                            In Elaborazione
                                        </div>
                                    )}

                                    {/* Delivery Instructions */}
                                    {purchase.delivery_instructions && (
                                        <p className="mt-3 text-[11px] text-white/40 text-center italic">
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
