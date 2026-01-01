import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
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
                            <Shield className="w-7 h-7 text-gold" />
                        </div>
                        <div>
                            <h1 className="font-serif text-4xl text-charcoal italic">Privacy Policy</h1>
                            <p className="text-charcoal/40 text-sm">Ultimo aggiornamento: Dicembre 2025</p>
                        </div>
                    </div>

                    <div className="prose prose-lg max-w-none">
                        <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-charcoal/5 space-y-8">
                            <section>
                                <h2 className="font-serif text-2xl text-charcoal mb-4">1. Titolare del Trattamento</h2>
                                <p className="text-charcoal/60 leading-relaxed">
                                    VirtualTwin S.r.l., con sede legale in Italia, è il titolare del trattamento dei dati personali raccolti attraverso questo sito.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-serif text-2xl text-charcoal mb-4">2. Dati Raccolti</h2>
                                <p className="text-charcoal/60 leading-relaxed">
                                    Raccogliamo i seguenti dati: nome, email, informazioni aziendali, dati di navigazione e preferenze di utilizzo del servizio.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-serif text-2xl text-charcoal mb-4">3. Finalità del Trattamento</h2>
                                <p className="text-charcoal/60 leading-relaxed">
                                    I dati sono trattati per: erogazione del servizio, comunicazioni relative all'account, miglioramento del prodotto e, previo consenso, marketing.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-serif text-2xl text-charcoal mb-4">4. Base Giuridica</h2>
                                <p className="text-charcoal/60 leading-relaxed">
                                    Il trattamento si basa sul contratto di servizio, sul legittimo interesse e, dove applicabile, sul consenso esplicito dell'utente.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-serif text-2xl text-charcoal mb-4">5. Diritti dell'Interessato</h2>
                                <p className="text-charcoal/60 leading-relaxed">
                                    Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione al trattamento. Contattaci a privacy@virtualtwin.ai.
                                </p>
                            </section>

                            <section>
                                <h2 className="font-serif text-2xl text-charcoal mb-4">6. Sicurezza</h2>
                                <p className="text-charcoal/60 leading-relaxed">
                                    Adottiamo misure tecniche e organizzative per proteggere i tuoi dati, inclusa crittografia end-to-end e server ubicati nell'Unione Europea.
                                </p>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
