'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Crown, Check, Mail, Clock, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';

function WelcomeContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const [verifying, setVerifying] = useState(true);
    const [session, setSession] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!sessionId) {
            setError('Nessuna sessione di pagamento trovata');
            setVerifying(false);
            return;
        }

        // Verify payment session
        fetch(`/api/stripe/verify-session?session_id=${sessionId}`)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setSession(data);
                }
            })
            .catch(() => {
                setError('Errore nella verifica del pagamento');
            })
            .finally(() => {
                setVerifying(false);
            });
    }, [sessionId]);

    if (verifying) {
        return (
            <div className="min-h-screen bg-champagne flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 gold-gradient rounded-full flex items-center justify-center animate-pulse">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-serif italic text-charcoal mb-2">Verificando il pagamento...</h1>
                    <p className="text-charcoal/50">Un momento, stiamo confermando tutto</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-champagne flex items-center justify-center p-6">
                <div className="text-center max-w-md">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-4xl">❌</span>
                    </div>
                    <h1 className="text-2xl font-bold text-charcoal mb-4">Oops! Qualcosa è andato storto</h1>
                    <p className="text-charcoal/60 mb-8">{error}</p>
                    <Link
                        href="/founder"
                        className="inline-flex items-center gap-2 gold-gradient text-white px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform"
                    >
                        ← Torna ai Piani
                    </Link>
                </div>
            </div>
        );
    }

    const planNames: Record<string, string> = {
        esploratore: 'Esploratore',
        pioniere: 'Pioniere',
        conquistatore: 'Conquistatore',
        imperatore: 'Imperatore',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-champagne via-white to-gold/5">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[200px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
                {/* Success Header */}
                <div className="text-center mb-12">
                    <div className="w-24 h-24 mx-auto mb-6 gold-gradient rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                        <Check className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif italic text-charcoal mb-4">
                        Benvenuto nella <span className="gold-text-gradient">Famiglia!</span>
                    </h1>

                    <p className="text-xl text-charcoal/60">
                        Il tuo pagamento è stato confermato con successo 🎉
                    </p>
                </div>

                {/* Founder Badge */}
                {session?.isFounder && (
                    <div className="bg-gradient-to-r from-gold/20 to-gold/10 border-2 border-gold/30 rounded-2xl p-6 mb-8 text-center">
                        <div className="inline-flex items-center gap-2 text-gold font-black text-sm uppercase tracking-wider">
                            <Crown className="w-5 h-5" />
                            Founder Status Attivato
                        </div>
                        <p className="text-charcoal/60 mt-2 text-sm">
                            Hai bloccato il prezzo {planNames[session?.plan] || 'Pioniere'} per sempre. Anche quando aumenterà, tu pagherai sempre lo stesso.
                        </p>
                    </div>
                )}

                {/* Email Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-charcoal/5 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Mail className="w-7 h-7 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-charcoal mb-2">Controlla la Tua Email</h2>
                            <p className="text-charcoal/60 mb-4">
                                Abbiamo inviato un'email a <strong className="text-charcoal">{session?.customer_email}</strong> con un link per impostare la tua password.
                            </p>
                            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                                💡 <strong>Tip:</strong> Non trovi l'email? Controlla anche spam e promozioni!
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trial Card */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-charcoal/5 mb-6">
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <Clock className="w-7 h-7 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-charcoal mb-2">14 Giorni Gratis</h2>
                            <p className="text-charcoal/60">
                                Hai <strong className="text-green-600">14 giorni di trial gratuito</strong> per testare VirtualTwin.
                                Non ti verrà addebitato nulla fino al termine del trial.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-2xl p-8 shadow-xl border border-charcoal/5 mb-8">
                    <h2 className="text-xl font-bold text-charcoal mb-6 text-center">I Tuoi Prossimi Passi</h2>

                    <div className="space-y-4">
                        {[
                            { num: 1, icon: Mail, title: 'Imposta la Password', desc: 'Clicca sul link nell\'email per creare la tua password' },
                            { num: 2, icon: Zap, title: 'Accedi alla Dashboard', desc: 'Entra nel tuo impero VirtualTwin' },
                            { num: 3, icon: Sparkles, title: 'Configura il Clone', desc: 'Segui la procedura guidata per il primo Clone AI' },
                            { num: 4, icon: Shield, title: 'Connetti i Canali', desc: 'Collega WhatsApp, Instagram o Messenger' },
                        ].map((step) => (
                            <div key={step.num} className="flex gap-4 items-start p-4 rounded-xl hover:bg-champagne/30 transition-colors">
                                <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold">
                                    {step.num}
                                </div>
                                <div>
                                    <h3 className="font-bold text-charcoal">{step.title}</h3>
                                    <p className="text-sm text-charcoal/60">{step.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link
                        href="/auth/login"
                        className="inline-flex items-center gap-3 gold-gradient text-white px-12 py-5 rounded-full text-lg font-bold hover:scale-105 transition-transform shadow-xl"
                    >
                        VAI AL LOGIN
                        <ArrowRight className="w-5 h-5" />
                    </Link>

                    <p className="mt-6 text-charcoal/40 text-sm">
                        Hai domande? <a href="mailto:support@virtualtwin.app" className="text-gold hover:underline">Contattaci</a>
                    </p>
                </div>

                {/* Founder Note */}
                {session?.isFounder && (
                    <div className="mt-12 text-center text-sm text-charcoal/40 border-t border-charcoal/10 pt-8">
                        <Crown className="w-5 h-5 mx-auto mb-2 text-gold" />
                        <p>
                            🎁 Come Founder, hai bloccato il prezzo per sempre.<br />
                            Anche quando nel 2030 costerà il doppio, tu pagherai sempre lo stesso.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function WelcomePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-champagne flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-6 gold-gradient rounded-full flex items-center justify-center animate-pulse">
                        <Crown className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-charcoal/50">Caricamento...</p>
                </div>
            </div>
        }>
            <WelcomeContent />
        </Suspense>
    );
}
