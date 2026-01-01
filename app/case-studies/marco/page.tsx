import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle, TrendingUp, Clock, Users, DollarSign, MessageCircle, Star } from 'lucide-react';

export default function CaseStudyMarco() {
    return (
        <div className="min-h-screen bg-champagne">
            {/* Header */}
            <header className="bg-charcoal text-white py-20 px-6 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Torna alla Home</span>
                    </Link>

                    <div className="flex items-center gap-3 mb-6">
                        <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-bold uppercase tracking-wider">Case Study</span>
                        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-bold uppercase tracking-wider">+250% Revenue</span>
                    </div>

                    <h1 className="font-serif text-4xl lg:text-6xl font-medium leading-tight mb-6">
                        Come Marco Ha <span className="italic text-gold">5X</span> Il Suo Business Con VirtualTwin
                    </h1>

                    <p className="text-white/60 text-lg max-w-2xl">
                        Da €8K a €28K/mese in 90 giorni. Da 25 ore/settimana su WhatsApp a 3 ore. Questa è la storia di Marco TechStart.
                    </p>
                </div>
            </header>

            {/* Quick Stats */}
            <section className="py-16 px-6 lg:px-24 border-b border-charcoal/5">
                <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { icon: DollarSign, label: "Revenue Increase", value: "+250%", color: "text-green-600" },
                        { icon: TrendingUp, label: "Conversion Rate", value: "41%", color: "text-blue-600" },
                        { icon: Clock, label: "Time Saved", value: "22h/w", color: "text-purple-600" },
                        { icon: MessageCircle, label: "Response Time", value: "<2s", color: "text-gold" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-charcoal/5 text-center">
                            <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                            <p className={`text-3xl font-serif font-bold ${stat.color}`}>{stat.value}</p>
                            <p className="text-charcoal/50 text-xs uppercase tracking-wider mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Before/After */}
            <section className="py-20 px-6 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-serif text-3xl lg:text-4xl text-charcoal text-center mb-16">
                        La <span className="italic text-gold">Trasformazione</span>
                    </h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Before */}
                        <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
                            <span className="px-4 py-1 bg-red-500 text-white rounded-full text-xs font-bold uppercase">Prima</span>
                            <ul className="mt-8 space-y-4">
                                {[
                                    "Revenue: €8K/mese",
                                    "Tempo risposta: 3-5 ore",
                                    "Conversion rate: 12%",
                                    "Ore su WhatsApp: 25h/settimana",
                                    "Lead persi la notte: ~40%",
                                    "Stress level: Alto"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-charcoal/70">
                                        <span className="text-red-500 mt-0.5">✗</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* After */}
                        <div className="bg-green-50 rounded-3xl p-8 border border-green-100">
                            <span className="px-4 py-1 bg-green-500 text-white rounded-full text-xs font-bold uppercase">Dopo 90 Giorni</span>
                            <ul className="mt-8 space-y-4">
                                {[
                                    "Revenue: €28K/mese (+250%)",
                                    "Tempo risposta: <2 secondi (24/7)",
                                    "Conversion rate: 41% (+242%)",
                                    "Ore su WhatsApp: 3h/settimana (-88%)",
                                    "Lead persi: 0% (clone risponde sempre)",
                                    "Stress level: Minimo"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-charcoal/70">
                                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Implementation Timeline */}
            <section className="py-20 px-6 lg:px-24 bg-white">
                <div className="max-w-4xl mx-auto">
                    <h2 className="font-serif text-3xl lg:text-4xl text-charcoal text-center mb-16">
                        L'Implementazione <span className="italic text-gold">Passo Passo</span>
                    </h2>

                    <div className="space-y-8">
                        {[
                            {
                                day: "Giorno 1",
                                title: "Setup del Clone",
                                description: "Marco ha configurato il suo clone in 4 minuti. Ha risposto a 5 domande sul suo business, tono di voce e offerte principali.",
                                result: "Clone live e funzionante"
                            },
                            {
                                day: "Settimana 1",
                                title: "A/B Test Clone vs Manuale",
                                description: "Ha testato il clone su 50% dei lead. Risultato: il clone ha convertito 23% più del manuale grazie alla velocità di risposta.",
                                result: "+23% conversion sui lead notturni"
                            },
                            {
                                day: "Settimana 2",
                                title: "Auto-Qualificazione Attivata",
                                description: "Ha attivato le domande di qualificazione automatiche. Il clone ora identifica budget, timeline e decision maker prima di passare il lead.",
                                result: "-60% tempo speso su lead non qualificati"
                            },
                            {
                                day: "Settimana 4",
                                title: "Payment Links Integrati",
                                description: "Ha aggiunto i link Stripe per il checkout diretto in chat. I clienti possono pagare senza uscire da WhatsApp.",
                                result: "+35% close rate, pagamenti 24/7"
                            }
                        ].map((step, i) => (
                            <div key={i} className="flex gap-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-white font-bold">
                                        {i + 1}
                                    </div>
                                    {i < 3 && <div className="w-0.5 h-full bg-gold/20 mt-2" />}
                                </div>
                                <div className="flex-1 pb-8">
                                    <span className="text-gold text-xs font-bold uppercase tracking-wider">{step.day}</span>
                                    <h3 className="font-serif text-xl text-charcoal mt-1 mb-2">{step.title}</h3>
                                    <p className="text-charcoal/60 mb-4">{step.description}</p>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm">
                                        <CheckCircle className="w-4 h-4" />
                                        {step.result}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ROI Calculation */}
            <section className="py-20 px-6 lg:px-24">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-charcoal rounded-3xl p-8 lg:p-12 text-white text-center">
                        <h2 className="font-serif text-3xl lg:text-4xl mb-6">
                            Il <span className="italic text-gold">ROI</span> di Marco
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 mb-8">
                            <div>
                                <p className="text-white/50 text-sm mb-2">Costo VirtualTwin</p>
                                <p className="text-3xl font-serif">€97<span className="text-lg">/mese</span></p>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm mb-2">Revenue Gain</p>
                                <p className="text-3xl font-serif text-gold">+€20K<span className="text-lg">/mese</span></p>
                            </div>
                            <div>
                                <p className="text-white/50 text-sm mb-2">ROI</p>
                                <p className="text-3xl font-serif text-green-400">20,620%</p>
                            </div>
                        </div>
                        <p className="text-white/60 text-sm max-w-xl mx-auto">
                            Per ogni €1 investito in VirtualTwin, Marco genera €206 di revenue aggiuntivo.
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="py-20 px-6 lg:px-24 bg-gradient-to-b from-white to-champagne">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="flex justify-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-6 h-6 text-gold fill-gold" />
                        ))}
                    </div>
                    <blockquote className="font-serif text-2xl lg:text-3xl text-charcoal italic leading-relaxed mb-8">
                        "Prima passavo le serate a rispondere ai messaggi. Ora il mio clone lo fa meglio di me.
                        La cosa assurda? I clienti non si accorgono della differenza.
                        Anzi, apprezzano la velocità."
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-14 h-14 gold-gradient rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">
                            M
                        </div>
                        <div className="text-left">
                            <p className="font-bold text-charcoal">Marco R.</p>
                            <p className="text-charcoal/50 text-sm">Founder, TechStart Consulting</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 lg:px-24 bg-charcoal">
                <div className="max-w-2xl mx-auto text-center">
                    <h2 className="font-serif text-3xl lg:text-4xl text-white mb-6">
                        Vuoi risultati <span className="italic text-gold">simili</span>?
                    </h2>
                    <p className="text-white/60 mb-10">
                        Inizia gratis oggi. Nessuna carta richiesta. Setup in 5 minuti.
                    </p>
                    <Link
                        href="/auth/register"
                        className="group inline-flex items-center gap-4 gold-gradient px-12 py-6 rounded-full text-white font-bold uppercase tracking-wider hover:scale-105 transition-all shadow-xl"
                    >
                        Inizia il Tuo Viaggio
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Footer Link */}
            <footer className="py-8 px-6 text-center bg-champagne">
                <Link href="/#pricing" className="text-charcoal/50 hover:text-gold text-sm transition-colors">
                    ← Vedi tutti i piani
                </Link>
            </footer>
        </div>
    );
}
