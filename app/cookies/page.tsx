import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cookie } from 'lucide-react';

export default function CookiePage() {
    return (
        <div className="min-h-screen bg-champagne">
            <header className="px-6 lg:px-24 py-8">
                <Link href="/" className="inline-flex items-center gap-3 text-charcoal/60 hover:text-gold transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm font-medium">Torna alla Home</span>
                </Link>
            </header>

            <div className="px-6 lg:px-24 pb-24">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                            <Cookie className="w-7 h-7 text-gold" />
                        </div>
                        <div>
                            <h1 className="font-serif text-4xl text-charcoal italic">Cookie Policy</h1>
                            <p className="text-charcoal/40 text-sm">Ultimo aggiornamento: Dicembre 2025</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-charcoal/5 space-y-8">
                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">1. Cosa Sono i Cookie</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                I cookie sono piccoli file di testo che vengono memorizzati sul tuo dispositivo quando visiti un sito web.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">2. Cookie Tecnici</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Utilizziamo cookie tecnici essenziali per il funzionamento del sito, come quelli per l'autenticazione e le preferenze di sessione.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">3. Cookie Analitici</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Utilizziamo cookie analitici per comprendere come gli utenti interagiscono con il nostro sito e migliorare l'esperienza.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">4. Gestione dei Cookie</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Puoi gestire le tue preferenze sui cookie attraverso le impostazioni del tuo browser o tramite il nostro banner di consenso.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">5. Cookie di Terze Parti</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Alcuni cookie possono essere impostati da servizi di terze parti come Stripe per i pagamenti e Supabase per l'autenticazione.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
