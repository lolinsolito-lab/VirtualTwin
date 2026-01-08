"use client";

import React, { useEffect, useCallback } from 'react';
import { X, Check, Crown, Zap, Sparkles, Users, Target, Award, ArrowRight, Lock, TrendingUp } from 'lucide-react';

// Full tier data for modals
export const TIER_FULL_DATA = {
    curioso: {
        name: "Curioso",
        subtitle: "Explorer",
        price: "€0",
        period: "14 giorni prova gratuita",
        perChiSei: [
            "Hai un'idea ma non sai se l'AI funziona per il tuo business",
            "Vuoi testare senza rischiare 1 euro",
            "Sei in fase \"studio di fattibilità\""
        ],
        cosaOttieni: [
            "1 Clone AI (modalità demo)",
            "100 conversazioni TOTALI (limite lifetime trial)",
            "PDF gratuito: \"I 7 Errori nell'AI Sales Automation\"",
            "Community (accesso sola lettura)",
            "Template base (3 industrie predefinite)"
        ],
        risultato: "Capisci se l'automazione AI può generare clienti per il tuo business specifico. Zero rischio, zero carta di credito.",
        limitiTecnici: [
            "1 Clone attivo",
            "100 conversazioni totali (non si resettano)",
            "0 Canali esterni (solo test interno dashboard)",
            "Support: Community + FAQ"
        ],
        casoReale: null
    },
    aspirante: {
        name: "Aspirante",
        subtitle: "Solopreneur",
        price: "€49",
        period: "/mese (Genesis Wave)",
        perChiSei: [
            "Freelancer, consulente, coach, terapisti, operatori olistici",
            "Gestisci tutto da solo (no dipendenti)",
            "Fatturi €0-30.000/anno e vuoi crescere"
        ],
        cosaOttieni: [
            "1 Clone AI professionale (addestrato sul tuo tone of voice)",
            "1.000 conversazioni/mese",
            "1 Canale a scelta (WhatsApp Business o Instagram DM)",
            "15 Template settoriali italiani",
            "Knowledge Base: 10 documenti tuoi (PDF, Word)",
            "Analytics base (conversioni, tempi risposta)",
            "Support email <48h"
        ],
        risultato: "5-10 lead qualificati al mese • 10 ore/settimana risparmiate • Primo cliente via AI in 45 giorni",
        limitiTecnici: [
            "1 Clone attivo",
            "1.000 conversazioni/mese (reset automatico)",
            "1 Canale simultaneo",
            "Support: Email <48h"
        ],
        casoReale: "Sara, coach nutrizionale a Milano, ha chiuso 3 clienti da €500 ciascuno in 45 giorni usando solo WhatsApp automation. Investimento: €49/mese × 2 mesi."
    },
    pioniere: {
        name: "Pioniere",
        subtitle: "Founder • ⭐ PIÙ SCELTO (68%)",
        price: "€147",
        period: "/mese (Genesis Wave)",
        perChiSei: [
            "Startup con 2-5 persone nel team",
            "Fatturi €30k-100k/anno",
            "Hai prodotto validato, serve più volume di lead"
        ],
        cosaOttieni: [
            "3 Cloni AI specializzati (Lead Qualifier + Sales Assistant + Onboarding Bot)",
            "5.000 conversazioni/mese",
            "3 Canali simultanei (Email + Social + Web Chat)",
            "A/B Testing automatico (2 varianti di script)",
            "Analytics avanzate + export CSV",
            "Knowledge Base: 50 documenti",
            "Academy Modulo 1-2 incluso (valore €224)",
            "Priority Support <24h",
            "1 War Room mensile (30 min strategia)"
        ],
        risultato: "30-50 lead qualificati/mese • +20% conversione • 25 ore/settimana risparmiate",
        metriche: {
            roi: "4.2:1",
            payback: "34 giorni",
            costoLead: "€4.90 vs €45 advertising"
        },
        confronto: "SDR part-time: €1.800/mese vs VirtualTwin Pioniere: €147/mese = 92% risparmio",
        limitiTecnici: [
            "3 Cloni attivi",
            "5.000 conversazioni/mese",
            "3 Canali (Email, WhatsApp, Instagram, Web, Telegram)",
            "Support: Priority <24h + 1 call/mese"
        ],
        casoReale: null
    },
    conquistatore: {
        name: "Conquistatore",
        subtitle: "Scale-Up",
        price: "€347",
        period: "/mese (Genesis Wave)",
        perChiSei: [
            "PMI o agenzia con team 5-20 persone",
            "Fatturi €100k-500k/anno",
            "Collo di bottiglia nei processi operativi"
        ],
        cosaOttieni: [
            "5 Cloni AI customizzabili per ruolo aziendale",
            "20.000 conversazioni/mese",
            "Tutti i canali + integrazioni CRM/ERP (Zapier/Make)",
            "Knowledge Base privata illimitata",
            "API Access per workflow custom",
            "Analytics + BI reports trimestrali",
            "Academy completa (valore €997) + Certificazione",
            "2 War Room/mese (60 min ciascuna)",
            "Dedicated Success Manager"
        ],
        risultato: "Riduzione costi operativi: 40% annuo • Scalabilità senza nuove assunzioni",
        includeAnche: [
            "Onboarding dedicato: 4 ore con specialist",
            "Custom playbook per la tua industry",
            "Formazione team completa (2 sessioni da 2h)",
            "Accesso beta a nuove feature",
            "Slack channel dedicato (<4h)"
        ],
        limitiTecnici: [
            "5 Cloni attivi",
            "20.000 conversazioni/mese",
            "Canali illimitati",
            "Support: Dedicated CSM + Slack <4h"
        ],
        casoReale: "Agenzia automotive Bologna: -€23.000/anno in costi customer service, +58% satisfaction score"
    },
    imperatore: {
        name: "Imperatore",
        subtitle: "Enterprise",
        price: "€697",
        period: "/mese (Genesis Wave)",
        perChiSei: [
            "Azienda established con 20+ dipendenti",
            "Fatturi €500k+/anno",
            "Serve white-label, on-premise o compliance-critical"
        ],
        cosaOttieni: [
            "15 Cloni AI (+ overage €50/5 cloni extra)",
            "100.000 conversazioni/mese (+ overage disponibile)",
            "Deployment: Cloud EU / On-premise / White-label completo",
            "API completa + SDK JS/Python + GraphQL",
            "Team dedicato: AI Engineer + Customer Success Manager",
            "SLA 99.9% uptime con compensazione automatica",
            "Formazione avanzata team personalizzata",
            "4 War Room/mese + Slack diretto",
            "Contratto annuale (sconto 15%)"
        ],
        risultato: "Sistema rivendibile (white-label) • Revenue share 30% • Total ownership dati",
        requisiti: [
            "Revenue verificato >€500k/anno oppure",
            "Funding dimostrato >€250k",
            "Colloquio strategico obbligatorio",
            "NDA firmato prima di demo"
        ],
        disponibilita: "12 slot totali: Genesis 4 (2 occupati) • Pioneer 4 (1 occupato) • Elite 4",
        limitiTecnici: [
            "15 Cloni (+ overage)",
            "100.000 conversazioni/mese",
            "Canali illimitati",
            "Support: Dedicato 24/5 + Slack real-time"
        ],
        casoReale: null
    },
    sovereignty: {
        name: "Sovereignty",
        subtitle: "Partnership Strategica",
        price: "CUSTOM",
        period: "Non è un piano, è un accordo",
        perChiSei: [
            "Hai usato tier Imperatore per almeno 6 mesi",
            "VirtualTwin è business-critical per te",
            "Vuoi co-ownership, licensing perpetuo, o partnership equity"
        ],
        cosaOttieni: null,
        risultato: null,
        accessoTramite: [
            "Invito diretto da Insolito Experiences",
            "Application motivata (revisione 7 giorni)"
        ],
        opzioni: [
            { nome: "Licensing Perpetuo", desc: "€50.000 one-time + €997/mese manutenzione • Codice sorgente completo" },
            { nome: "Equity Partnership", desc: "Min €100k investimento • Lifetime access + Board seat + Revenue share" },
            { nome: "Profit Share", desc: "Zero costi software • Split 70/30 sui clienti acquisiti via AI" },
            { nome: "Strategic Alliance", desc: "Co-sviluppo feature custom • Esclusiva 24 mesi" }
        ],
        requisiti: [
            "Track record 6 mesi su Imperatore",
            "NPS score >8/10",
            "Colloquio con Michael Jara (founder)",
            "Business case scritto dettagliato"
        ],
        benefici: [
            "Influenzi roadmap prodotto",
            "Accesso pre-release a nuovi prodotti",
            "Co-marketing opportunities",
            "Network access ad altri partner Sovereignty"
        ],
        limitiTecnici: null,
        casoReale: null
    }

};

interface PlanDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    planId: string;
    planStyle: {
        bg: string;
        border: string;
        accent: string;
        isDark?: boolean;
        isGold?: boolean;
    };
}

export default function PlanDetailModal({ isOpen, onClose, planId, planStyle }: PlanDetailModalProps) {
    const plan = TIER_FULL_DATA[planId as keyof typeof TIER_FULL_DATA];

    // Close on ESC
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, handleKeyDown]);

    if (!isOpen || !plan) return null;

    const textColor = planStyle.isDark || planStyle.isGold ? 'text-white' : 'text-charcoal';
    const subtextColor = planStyle.isDark || planStyle.isGold ? 'text-white/70' : 'text-charcoal/60';
    const borderColor = planStyle.isDark ? 'border-white/10' : planStyle.isGold ? 'border-white/20' : 'border-charcoal/10';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`
                relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
                rounded-[2rem] p-6 md:p-10 shadow-2xl
                ${planStyle.bg} ${planStyle.border} border
                animate-in zoom-in-95 fade-in duration-300
            `}>
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-6 right-6 p-2 rounded-full transition-all hover:scale-110 ${planStyle.isDark || planStyle.isGold ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'}`}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-8">
                    <p className={`text-[10px] uppercase tracking-[0.4em] font-black mb-2 ${planStyle.accent}`}>
                        {plan.subtitle}
                    </p>
                    <h2 className={`font-serif text-4xl md:text-5xl italic ${textColor}`}>
                        {plan.name}
                    </h2>
                    <div className="flex items-baseline gap-2 mt-4">
                        <span className={`text-3xl font-bold ${textColor}`}>{plan.price}</span>
                        <span className={subtextColor}>{plan.period}</span>
                    </div>
                </div>

                {/* Per Chi Sei */}
                {plan.perChiSei && (
                    <div className={`mb-8 p-6 rounded-2xl ${planStyle.isDark ? 'bg-white/5' : planStyle.isGold ? 'bg-white/10' : 'bg-charcoal/5'}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${planStyle.accent}`}>
                            <Users className="w-4 h-4" /> Per Chi Sei
                        </h3>
                        <ul className="space-y-2">
                            {plan.perChiSei.map((item, i) => (
                                <li key={i} className={`flex items-start gap-3 ${subtextColor}`}>
                                    <span className="text-gold mt-1">•</span>
                                    <span className="text-sm">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Cosa Ottieni */}
                {plan.cosaOttieni && (
                    <div className="mb-8">
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${planStyle.accent}`}>
                            <Sparkles className="w-4 h-4" /> Cosa Ottieni
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {plan.cosaOttieni.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${planStyle.isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span className={`text-sm ${subtextColor}`}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Sovereignty Opzioni */}
                {(plan as any).opzioni && (
                    <div className="mb-8">
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${planStyle.accent}`}>
                            <Crown className="w-4 h-4" /> Opzioni Disponibili
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {(plan as any).opzioni.map((opt: any, i: number) => (
                                <div key={i} className={`p-4 rounded-xl ${planStyle.isDark ? 'bg-white/5' : 'bg-charcoal/5'}`}>
                                    <p className={`font-bold mb-1 ${textColor}`}>{opt.nome}</p>
                                    <p className={`text-xs ${subtextColor}`}>{opt.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Risultato */}
                {plan.risultato && (
                    <div className={`mb-8 p-6 rounded-2xl ${planStyle.isGold ? 'bg-white/20' : planStyle.isDark ? 'bg-gold/10' : 'bg-gold/5'} border ${planStyle.isGold ? 'border-white/20' : 'border-gold/20'}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-3 flex items-center gap-2 ${planStyle.isGold ? 'text-white' : 'text-gold'}`}>
                            <Target className="w-4 h-4" /> Risultato Concreto
                        </h3>
                        <p className={planStyle.isGold ? 'text-white' : textColor}>{plan.risultato}</p>
                    </div>
                )}

                {/* Metriche (Pioniere) */}
                {(plan as any).metriche && (
                    <div className="mb-8 grid grid-cols-3 gap-4">
                        <div className={`text-center p-4 rounded-xl ${planStyle.isDark ? 'bg-white/5' : 'bg-charcoal/5'}`}>
                            <p className={`text-2xl font-bold ${planStyle.accent}`}>{(plan as any).metriche.roi}</p>
                            <p className={`text-xs ${subtextColor}`}>ROI</p>
                        </div>
                        <div className={`text-center p-4 rounded-xl ${planStyle.isDark ? 'bg-white/5' : 'bg-charcoal/5'}`}>
                            <p className={`text-2xl font-bold ${planStyle.accent}`}>{(plan as any).metriche.payback}</p>
                            <p className={`text-xs ${subtextColor}`}>Payback</p>
                        </div>
                        <div className={`text-center p-4 rounded-xl ${planStyle.isDark ? 'bg-white/5' : 'bg-charcoal/5'}`}>
                            <p className={`text-2xl font-bold ${planStyle.accent}`}>{(plan as any).metriche.costoLead.split(' ')[0]}</p>
                            <p className={`text-xs ${subtextColor}`}>Costo/Lead</p>
                        </div>
                    </div>
                )}

                {/* Caso Reale */}
                {plan.casoReale && (
                    <div className={`mb-8 p-6 rounded-2xl border-l-4 ${planStyle.isDark ? 'bg-white/5 border-gold' : 'bg-amber-50 border-amber-400'}`}>
                        <p className={`text-xs uppercase tracking-widest font-black mb-2 ${planStyle.isDark ? 'text-gold' : 'text-amber-600'}`}>💬 Caso Reale</p>
                        <p className={`text-sm italic ${subtextColor}`}>"{plan.casoReale}"</p>
                    </div>
                )}

                {/* Limiti Tecnici */}
                {plan.limitiTecnici && (
                    <div className={`p-6 rounded-2xl ${planStyle.isDark ? 'bg-white/5' : planStyle.isGold ? 'bg-white/10' : 'bg-charcoal/5'}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${subtextColor}`}>
                            <Lock className="w-4 h-4" /> Limiti Tecnici
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2">
                            {plan.limitiTecnici.map((item, i) => (
                                <p key={i} className={`text-sm ${subtextColor}`}>• {item}</p>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
