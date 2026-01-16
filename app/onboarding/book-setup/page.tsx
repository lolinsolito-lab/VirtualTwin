'use client';

import React, { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Check, Sparkles, Clock, Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';

/**
 * Setup Premium Booking Page
 * 
 * After purchasing Setup Premium, customers are redirected here
 * to book their 1:1 onboarding call via Calendly embed.
 * 
 * URL: /onboarding/book-setup?session_id=xxx&setup_success=true
 */

const CALENDLY_URL = 'https://calendly.com/lordinsolito/virtualtwin-setup-premium-call';

function BookingContent() {
    const searchParams = useSearchParams();
    const setupSuccess = searchParams.get('setup_success') === 'true';
    const sessionId = searchParams.get('session_id');

    // Load Calendly widget script
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://assets.calendly.com/assets/external/widget.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            // Cleanup
            const existingScript = document.querySelector('script[src*="calendly"]');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-b from-charcoal via-charcoal to-black">
            {/* Success Header */}
            {setupSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-green-500/20 via-green-500/10 to-transparent border-b border-green-500/20"
                >
                    <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <p className="text-green-400 font-bold">Acquisto Completato!</p>
                            <p className="text-white/60 text-sm">Setup Premium attivato con successo</p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-6 py-12">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <Sparkles className="w-6 h-6 text-gold" />
                        <span className="text-gold text-[10px] uppercase tracking-[0.5em] font-black">Setup Premium</span>
                    </div>
                    <h1 className="font-serif text-4xl md:text-6xl italic text-white mb-4">
                        Prenota la Tua <span className="gold-text-gradient">Call Strategica</span>
                    </h1>
                    <p className="text-white/60 max-w-xl mx-auto">
                        Scegli il giorno e l'ora che preferisci per la tua sessione di setup 1:1.
                        Configureremo insieme il tuo VirtualTwin in meno di 48h.
                    </p>
                </motion.div>

                {/* What's Included */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
                >
                    {[
                        { icon: Video, title: 'Call 1:1 Strategica', desc: '45 min di consulenza personalizzata' },
                        { icon: Clock, title: 'Setup in 48h', desc: 'Configurazione completa garantita' },
                        { icon: Calendar, title: 'Follow-up', desc: 'Supporto post-configurazione' }
                    ].map((item, i) => (
                        <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
                            <item.icon className="w-8 h-8 text-gold mx-auto mb-3" />
                            <h3 className="text-white font-bold mb-1">{item.title}</h3>
                            <p className="text-white/40 text-sm">{item.desc}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Calendly Embed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-2xl"
                >
                    <div
                        className="calendly-inline-widget"
                        data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=1a1a1a&text_color=ffffff&primary_color=d4af37`}
                        style={{ minWidth: '320px', height: '700px' }}
                    />
                </motion.div>

                {/* Skip Option */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-8"
                >
                    <p className="text-white/30 text-sm mb-4">
                        Preferisci prenotare dopo? Puoi sempre farlo dalla dashboard.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-gold hover:underline text-sm"
                    >
                        Vai alla Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}

// Loading fallback
function BookingLoading() {
    return (
        <div className="min-h-screen bg-charcoal flex items-center justify-center">
            <div className="text-center">
                <Calendar className="w-12 h-12 text-gold mx-auto mb-4 animate-pulse" />
                <p className="text-white/60">Caricamento calendario...</p>
            </div>
        </div>
    );
}

export default function BookSetupPage() {
    return (
        <Suspense fallback={<BookingLoading />}>
            <BookingContent />
        </Suspense>
    );
}
