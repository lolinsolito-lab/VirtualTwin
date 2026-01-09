'use client';

import Link from 'next/link';
import { Mail, Shield, Check, Crown, ArrowRight, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function CheckEmailPage() {
    const [resending, setResending] = useState(false);
    const [sent, setSent] = useState(false);

    const handleResend = async () => {
        setResending(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
            await supabase.auth.resend({
                type: 'signup',
                email: user.email,
            });
            setSent(true);
        }
        setResending(false);
    };

    return (
        <div className="min-h-screen bg-champagne flex items-center justify-center p-6 overflow-hidden relative">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[150px]" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />

            <div className="max-w-xl w-full bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-12 shadow-2xl border border-white relative z-10 text-center">

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-8">
                    <Shield className="w-4 h-4 text-gold" />
                    <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em]">Protezione Bot Attiva</span>
                </div>

                {/* Main Icon */}
                <div className="w-24 h-24 mx-auto mb-8 bg-gold-gradient rounded-full flex items-center justify-center shadow-xl">
                    <Mail className="w-12 h-12 text-white animate-bounce" />
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-serif italic text-charcoal mb-6">
                    Il Tuo Clone è <span className="gold-text-gradient">Pronto!</span>
                </h1>

                {/* Subtitle */}
                <p className="text-charcoal/60 text-lg mb-10">
                    Ottimo lavoro, l'onboarding è completo. Abbiamo inviato un link di attivazione sulla tua email per proteggere il tuo account dai bot e garantirti l'accesso esclusivo.
                </p>

                {/* Instructions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 text-left">
                    <div className="p-5 bg-white rounded-2xl border border-charcoal/5">
                        <div className="flex items-center gap-3 mb-2">
                            <Check className="w-5 h-5 text-green-500" />
                            <span className="font-bold text-sm text-charcoal">Controlla la Inbox</span>
                        </div>
                        <p className="text-xs text-charcoal/40">Cerca l'email da VirtualTwin con il link di conferma.</p>
                    </div>
                    <div className="p-5 bg-white rounded-2xl border border-charcoal/5">
                        <div className="flex items-center gap-3 mb-2">
                            <Crown className="w-5 h-5 text-gold" />
                            <span className="font-bold text-sm text-charcoal">Attiva il Potere</span>
                        </div>
                        <p className="text-xs text-charcoal/40">Appena confermato, la Dashboard si sbloccherà per te.</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                    <button
                        onClick={handleResend}
                        disabled={resending || sent}
                        className="w-full py-4 rounded-xl border-2 border-charcoal/10 text-charcoal font-bold hover:bg-charcoal/5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {resending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
                        {sent ? 'Email Inviata ✅' : 'Non hai ricevuto nulla? Reinvia'}
                    </button>

                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-2 text-gold font-bold hover:underline py-2"
                    >
                        Torna al Login <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                <p className="mt-12 text-[10px] text-charcoal/30 uppercase tracking-widest font-black">
                    VirtualTwin Protection System v2.0
                </p>
            </div>
        </div>
    );
}
