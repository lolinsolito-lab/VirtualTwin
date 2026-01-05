"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Crown, Sparkles, Building2, GraduationCap, MapPin, Layout, Mic2, Star, Zap } from 'lucide-react';
import Navbar from '@/components/sections/Navbar';
import Footer from '@/components/sections/Footer';

const BRAND_ECOSYSTEM = [
    {
        name: "Virtualtwin",
        tagline: "L'Elite dell'AI Conversazionale",
        description: "Cloni digitali ad alte prestazioni per coach e agenzie che non accettano compromessi.",
        icon: Crown,
        status: "Live",
        color: "text-gold"
    },
    {
        name: "LuminelCoach",
        tagline: "Transformational AI Coach",
        description: "L'intelligenza artificiale al servizio dell'evoluzione personale e del coaching trasformativo.",
        icon: Sparkles,
        status: "Coming Soon",
        color: "text-purple-400"
    },
    {
        name: "Lumina Manager",
        tagline: "The Elite Operating System",
        description: "Un gestionale di nuova generazione. Il cervello operativo d'élite per la tua impresa.",
        icon: Layout,
        status: "In Development",
        color: "text-blue-400"
    },
    {
        name: "Insolita Academy",
        tagline: "Formazione Personalizzata d'Elite",
        description: "Oltre l'e-learning: percorsi formativi su misura per aspiranti leader ed executive.",
        icon: GraduationCap,
        status: "Active",
        color: "text-emerald-400"
    },
    {
        name: "VirtualBNB",
        tagline: "Luxury Property Management",
        description: "Operazioni immobiliari di prestigio a Milano e oltre, con standard di servizio imperiali.",
        icon: Building2,
        status: "Active",
        color: "text-amber-600"
    },
    {
        name: "MichaelLuminels",
        tagline: "Virtual Coach Image",
        description: "La fusione tra immagine, stile e coaching virtuale per un brand personale d'impatto.",
        icon: Star,
        status: "Research",
        color: "text-pink-400"
    }
];

export default function VisionPage() {
    return (
        <div className="min-h-screen bg-champagne selection:bg-gold selection:text-black">
            <Navbar />

            <main className="pt-32 pb-24 px-6 lg:px-24">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-24">
                        <span className="inline-flex items-center gap-2 px-4 py-2 bg-charcoal/5 rounded-full mb-8">
                            <Star className="w-3 h-3 text-gold animate-pulse" />
                            <span className="text-charcoal text-[10px] uppercase tracking-[0.5em] font-black">La Visione Imperiale</span>
                        </span>
                        <h1 className="font-serif text-[4rem] lg:text-[7rem] text-charcoal leading-[0.85] tracking-tighter mb-8">
                            Un Ecosistema di <br />
                            <span className="italic gold-text-gradient">Eccellenza Assoluta.</span>
                        </h1>
                        <p className="text-charcoal/60 text-xl max-w-2xl mx-auto font-light leading-relaxed">
                            Dietro Virtualtwin c'è un'unica firma: <span className="text-charcoal font-bold">Insolito Experiences di Michael Jara</span>.
                            Una galassia di brand nati per trasformare il modo in cui vivi, lavori e comunichi.
                        </p>
                    </div>

                    {/* The Founder Section */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-32 bg-white/50 rounded-[3rem] p-12 lg:p-20 border border-charcoal/5">
                        <div>
                            <h2 className="font-serif text-4xl lg:text-5xl text-charcoal italic mb-8">L'Uomo dietro il Codice.</h2>
                            <div className="space-y-6 text-charcoal/70 leading-relaxed text-lg">
                                <p>
                                    Michael Jara non costruisce semplici software. Costruisce ponti tra l'ambizione umana e la potenza tecnologica.
                                    Attraverso <strong>Insolito Experiences</strong>, la missione è chiara: eliminare la mediocrità dal panorama digitale italiano.
                                </p>
                                <p>
                                    Ogni progetto, da Virtualtwin a Lumina Manager, è guidato da un principio non negoziabile:
                                    <span className="text-gold font-bold italic ml-1">"Se non è d'élite, non esiste."</span>
                                </p>
                            </div>
                            <div className="mt-10 flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-charcoal/40">Legal Entity</span>
                                    <span className="text-charcoal font-bold">Insolito Experiences</span>
                                </div>
                                <div className="w-px h-10 bg-charcoal/10"></div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase tracking-[0.3em] font-black text-charcoal/40">Founder</span>
                                    <span className="text-charcoal font-bold">Michael Jara</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-gradient-to-br from-gold/20 via-champagne to-charcoal/5 rounded-[2rem] flex items-center justify-center p-12">
                                <Crown className="w-32 h-32 text-gold/30" />
                            </div>
                            {/* Decorative badges */}
                            <div className="absolute -top-6 -right-6 bg-white shadow-xl p-6 rounded-2xl border border-charcoal/5 animate-bounce">
                                <Zap className="w-6 h-6 text-gold" />
                            </div>
                        </div>
                    </div>

                    {/* The Ecosystem Grid */}
                    <div className="mb-32">
                        <div className="flex items-end justify-between mb-16">
                            <div>
                                <h3 className="font-serif text-4xl text-charcoal italic">L'Ecosistema</h3>
                                <p className="text-charcoal/40 tracking-widest text-[10px] uppercase font-black mt-2">Dalla visione alla realtà</p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {BRAND_ECOSYSTEM.map((brand, i) => (
                                <div key={i} className="group bg-white p-10 rounded-[2.5rem] border border-charcoal/5 hover:border-gold/30 hover:shadow-2xl transition-all duration-500">
                                    <div className={`w-14 h-14 rounded-2xl bg-charcoal/5 flex items-center justify-center mb-8 group-hover:bg-gold/10 transition-colors`}>
                                        <brand.icon className={`w-7 h-7 ${brand.color} group-hover:scale-110 transition-transform`} />
                                    </div>
                                    <div className="flex items-center gap-3 mb-3">
                                        <h4 className="text-2xl font-serif text-charcoal">{brand.name}</h4>
                                        <span className="px-2 py-0.5 bg-charcoal/5 text-[8px] uppercase font-black tracking-widest text-charcoal/40 rounded-full">
                                            {brand.status}
                                        </span>
                                    </div>
                                    <p className="text-[10px] uppercase tracking-[0.2em] font-black text-gold mb-6">{brand.tagline}</p>
                                    <p className="text-charcoal/50 text-sm leading-relaxed mb-8">
                                        {brand.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-charcoal font-bold text-xs group-hover:text-gold transition-colors">
                                        <span>Scopri di più</span>
                                        <ArrowLeft className="w-3 h-3 rotate-180" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="text-center bg-charcoal rounded-[4rem] py-20 px-10 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-[80px]"></div>

                        <h2 className="font-serif text-[2.5rem] lg:text-[4rem] mb-6">Pronto a far parte <br /> dell'<span className="italic text-gold">Impero?</span></h2>
                        <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
                            Non stiamo solo costruendo software. Stiamo ridefinendo i confini del possibile.
                            Inizia oggi il tuo viaggio con Virtualtwin.
                        </p>
                        <Link href="/auth/register" className="inline-flex gold-gradient px-12 py-5 rounded-full text-white font-black text-[12px] uppercase tracking-[0.5em] shadow-2xl hover:scale-105 transition-all">
                            Inizia Ora →
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
