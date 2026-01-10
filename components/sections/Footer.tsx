"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Instagram, Linkedin, X, Shield, FileText, Cookie } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [activeModal, setActiveModal] = useState<string | null>(null);

    const modalContent: Record<string, { title: string; icon: React.ReactNode; content: React.ReactNode }> = {
        privacy: {
            title: "Privacy Policy",
            icon: <Shield className="w-6 h-6 text-gold" />,
            content: (
                <div className="space-y-6 text-charcoal/70 text-sm leading-relaxed">
                    <p><strong className="text-charcoal">Titolare:</strong> Insolito Experiences di Michael Jara, Italia.</p>
                    <p><strong className="text-charcoal">Dati raccolti:</strong> Nome, email, informazioni aziendali, dati di navigazione.</p>
                    <p><strong className="text-charcoal">Finalità:</strong> Erogazione servizio, comunicazioni account, miglioramento prodotto.</p>
                    <p><strong className="text-charcoal">Base giuridica:</strong> Contratto, legittimo interesse, consenso.</p>
                    <p><strong className="text-charcoal">Diritti:</strong> Accesso, rettifica, cancellazione, portabilità. Contatta privacy@virtualtwin.ai</p>
                    <p><strong className="text-charcoal">Sicurezza:</strong> Crittografia end-to-end, server EU, GDPR compliant.</p>
                </div>
            )
        },
        terms: {
            title: "Termini di Servizio",
            icon: <FileText className="w-6 h-6 text-gold" />,
            content: (
                <div className="space-y-6 text-charcoal/70 text-sm leading-relaxed">
                    <p><strong className="text-charcoal">Servizio:</strong> Automazione conversazionale AI per WhatsApp, Instagram, Messenger.</p>
                    <p><strong className="text-charcoal">Account:</strong> Sei responsabile della sicurezza delle tue credenziali.</p>
                    <p><strong className="text-charcoal">Pagamenti:</strong> Addebito mensile. Cancella quando vuoi, accesso fino a fine periodo.</p>
                    <p><strong className="text-charcoal">Uso consentito:</strong> No spam, no attività illegali, rispetto termini piattaforme.</p>
                    <p><strong className="text-charcoal">Responsabilità:</strong> Non siamo responsabili per danni indiretti.</p>
                </div>
            )
        },
        cookies: {
            title: "Cookie Policy",
            icon: <Cookie className="w-6 h-6 text-gold" />,
            content: (
                <div className="space-y-6 text-charcoal/70 text-sm leading-relaxed">
                    <p><strong className="text-charcoal">Cookie tecnici:</strong> Essenziali per autenticazione e preferenze sessione.</p>
                    <p><strong className="text-charcoal">Cookie analitici:</strong> Per comprendere l'uso del sito e migliorare l'esperienza.</p>
                    <p><strong className="text-charcoal">Gestione:</strong> Modifica preferenze dal browser o dal banner di consenso.</p>
                    <p><strong className="text-charcoal">Terze parti:</strong> Stripe (pagamenti), Supabase (auth).</p>
                </div>
            )
        }
    };

    return (
        <>
            {/* MODAL POPUP */}
            {activeModal && modalContent[activeModal] && (
                <div
                    className="fixed inset-0 z-[200] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4"
                    onClick={() => setActiveModal(null)}
                >
                    <div
                        className="relative bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setActiveModal(null)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-charcoal/5 flex items-center justify-center text-charcoal/40 hover:bg-charcoal hover:text-white transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                    {modalContent[activeModal].icon}
                                </div>
                                <h3 className="font-serif text-xl text-charcoal italic">{modalContent[activeModal].title}</h3>
                            </div>
                            {modalContent[activeModal].content}
                            <p className="mt-6 text-charcoal/30 text-xs">Ultimo aggiornamento: Dicembre 2025</p>
                        </div>
                    </div>
                </div>
            )}

            {/* SMART MINIMAL FOOTER */}
            <footer className="bg-charcoal px-6 lg:px-24 py-8 border-t border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Left: Minimal Logo & Copyright */}
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold text-sm shadow-lg">V</div>
                                <span className="font-serif text-lg text-white italic tracking-tight">Virtual<span className="text-gold">twin</span></span>
                            </Link>
                            <span className="hidden md:block w-px h-4 bg-white/10"></span>
                            <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-medium">
                                © {currentYear} · Insolito Experiences
                            </p>
                        </div>

                        {/* Center: Essential Links */}
                        <nav className="flex items-center gap-6 text-[10px] uppercase tracking-widest text-white/40 font-bold">
                            <a href="#solution" className="hover:text-gold transition-colors">Vision</a>
                            <a href="#pricing" className="hover:text-gold transition-colors">Piani</a>
                            <Link href="/contact" className="hover:text-gold transition-colors">Supporto</Link>
                        </nav>

                        {/* Right: Social & Trust */}
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-gold transition-colors">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-white/20 hover:text-gold transition-colors">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                            <div className="flex items-center gap-4 text-[10px] text-white/20 font-bold uppercase tracking-tighter">
                                <button onClick={() => setActiveModal('privacy')} className="hover:text-white transition-colors">Privacy</button>
                                <button onClick={() => setActiveModal('terms')} className="hover:text-white transition-colors">Terms</button>
                            </div>
                        </div>
                    </div>

                    {/* Meta Info Small */}
                    <div className="mt-6 pt-6 border-t border-white/5 text-center">
                        <p className="text-[9px] text-white/10 uppercase tracking-[0.4em]">
                            P.IVA: In fase di costituzione · Pre-Lancio Q1 2026 · Made in Italy 🇮🇹
                        </p>
                    </div>
                </div>
            </footer>

        </>
    );
};

export default Footer;
