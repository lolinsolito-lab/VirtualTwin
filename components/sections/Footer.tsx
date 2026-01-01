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
                    <p><strong className="text-charcoal">Titolare:</strong> VirtualTwin S.r.l., Italia.</p>
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

            {/* ELEGANT SLIM FOOTER */}
            <footer className="bg-charcoal px-6 lg:px-24 py-10">
                <div className="max-w-7xl mx-auto">
                    {/* Main Row - Compact */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 pb-8 border-b border-white/10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold text-lg shadow-lg">V</div>
                            <div>
                                <span className="font-serif text-xl text-white italic">Virtual<span className="text-gold">twin</span></span>
                            </div>
                        </Link>

                        {/* Nav Links - Horizontal */}
                        <nav className="flex flex-wrap items-center justify-center gap-6 lg:gap-10 text-white/40 text-sm">
                            <a href="#solution" className="hover:text-gold transition-colors">Come Funziona</a>
                            <a href="#pricing" className="hover:text-gold transition-colors">Prezzi</a>
                            <Link href="/auth/register" className="hover:text-gold transition-colors">Prova Gratis</Link>
                            <Link href="/contact" className="hover:text-gold transition-colors">Contatti</Link>
                        </nav>

                        {/* Social */}
                        <div className="flex items-center gap-3">
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-white transition-all">
                                <Instagram className="w-4 h-4" />
                            </a>
                            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-gold hover:text-white transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Bottom Row - Legal Links as Popups */}
                    <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/30 text-xs">
                            © {currentYear} <span className="text-gold">VirtualTwin</span> · Made with ♥ in 🇮🇹 Italy
                        </p>
                        <div className="flex items-center gap-6 text-white/30 text-xs">
                            <button onClick={() => setActiveModal('privacy')} className="hover:text-gold transition-colors">Privacy</button>
                            <span className="w-px h-3 bg-white/10"></span>
                            <button onClick={() => setActiveModal('terms')} className="hover:text-gold transition-colors">Termini</button>
                            <span className="w-px h-3 bg-white/10"></span>
                            <button onClick={() => setActiveModal('cookies')} className="hover:text-gold transition-colors">Cookie</button>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    );
};

export default Footer;
