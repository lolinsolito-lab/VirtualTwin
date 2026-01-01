import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
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
                            <FileText className="w-7 h-7 text-gold" />
                        </div>
                        <div>
                            <h1 className="font-serif text-4xl text-charcoal italic">Termini di Servizio</h1>
                            <p className="text-charcoal/40 text-sm">Ultimo aggiornamento: Dicembre 2025</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-charcoal/5 space-y-8">
                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">1. Accettazione</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Utilizzando VirtualTwin, accetti questi termini di servizio. Se non sei d'accordo, ti preghiamo di non utilizzare il servizio.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">2. Descrizione del Servizio</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                VirtualTwin fornisce un servizio di automazione conversazionale basato su AI per WhatsApp, Instagram e Messenger.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">3. Account</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Sei responsabile della sicurezza del tuo account e di tutte le attività che avvengono sotto le tue credenziali.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">4. Pagamenti</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                I piani a pagamento vengono addebitati mensilmente. Puoi cancellare in qualsiasi momento, l'accesso rimarrà attivo fino alla fine del periodo pagato.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">5. Uso Consentito</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                Non puoi utilizzare il servizio per spam, attività illegali, o violazione dei termini delle piattaforme di messaggistica.
                            </p>
                        </section>

                        <section>
                            <h2 className="font-serif text-2xl text-charcoal mb-4">6. Limitazione Responsabilità</h2>
                            <p className="text-charcoal/60 leading-relaxed">
                                VirtualTwin non è responsabile per danni indiretti derivanti dall'uso del servizio, nei limiti consentiti dalla legge.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
