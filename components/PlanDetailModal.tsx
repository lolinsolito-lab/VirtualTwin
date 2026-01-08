"use client";

import React, { useEffect, useCallback } from 'react';
import { X, Check, Crown, Zap, Sparkles, Users, Target, Award, ArrowRight, Lock, TrendingUp, BarChart3, Shield, Handshake } from 'lucide-react';

// Full tier data for modals
export const TIER_FULL_DATA = {
    curioso: {
        name: "Curioso",
        subtitle: "14 Giorni Prova Gratuita",
        price: "€0",
        period: "14 giorni",
        idealePer: [
            "Hai un'idea ma non sai se l'AI funziona per il tuo business",
            "Vuoi testare senza rischiare 1 euro",
            "Sei in fase \"studio di fattibilità\""
        ],
        cosaOttieni: [
            "1 Clone AI (modalità demo)",
            "100 conversazioni TOTALI (non mensili, limite lifetime trial)",
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
    solopreneur: {
        name: "Solopreneur",
        subtitle: "Per Chi Lavora in Autonomia",
        price: "€49",
        period: "/mese (Genesis Wave)",
        idealePer: [
            "Freelancer, consulente, coach in Partita IVA",
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
            "1.000 conversazioni/mese (reset automatico ogni 1° del mese)",
            "1 Canale simultaneo",
            "Support: Email, risposta entro 48h lavorative"
        ],
        casoReale: "Sara, coach nutrizionale a Milano, ha chiuso 3 clienti da €500 ciascuno in 45 giorni usando solo WhatsApp automation. Investimento totale: €49/mese × 2 mesi."
    },
    entrepreneur: {
        name: "Entrepreneur",
        subtitle: "⭐ PIÙ SCELTO (68% dei clienti)",
        price: "€147",
        period: "/mese (Genesis Wave)",
        idealePer: [
            "Startup con 2-5 persone nel team",
            "Fatturi €30k-100k/anno",
            "Hai prodotto/servizio validato, serve più volume di lead"
        ],
        cosaOttieni: [
            "3 Cloni AI specializzati per ruolo:",
            "→ Lead Qualifier (filtra e qualifica prospect)",
            "→ Sales Assistant (prenota demo, risponde obiezioni)",
            "→ Onboarding Bot (riduce abbandono primi 30gg)",
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
            costoLead: "€4.90 vs €45"
        },
        confronto: "SDR part-time: €1.800/mese vs VirtualTwin: €147/mese = 92% risparmio",
        limitiTecnici: [
            "3 Cloni attivi simultaneamente",
            "5.000 conversazioni/mese",
            "3 Canali (Email, WhatsApp, Instagram, Web, Telegram)",
            "Support: Priority <24h + 1 call strategica/mese"
        ],
        casoReale: null
    },
    conquistatore: {
        name: "Conquistatore",
        subtitle: "Scale-Up",
        price: "€347",
        period: "/mese (Genesis Wave)",
        idealePer: [
            "PMI o agenzia con team 5-20 persone",
            "Fatturi €100k-500k/anno",
            "Il collo di bottiglia è nei processi operativi"
        ],
        cosaOttieni: [
            "5 Cloni AI customizzabili per ruolo aziendale:",
            "• Lead Qualifier • Sales Closer • Customer Support L1",
            "• Onboarding Specialist • Custom (definisci tu)",
            "20.000 conversazioni/mese",
            "10 Canali simultanei inclusi:",
            "• Email, WhatsApp, Instagram, Telegram, Web Chat, LinkedIn, SMS",
            "• +5 canali extra: €20/mese (max 30 canali totali)",
            "Integrazioni CRM/ERP: Zapier, Make, Webhook",
            "• Zapier/Make native • Webhook custom",
            "Knowledge Base privata illimitata",
            "API Access per workflow custom",
            "Analytics + BI reports trimestrali",
            "Academy completa (valore €997) + Certificazione",
            "2 War Room/mese (60 min ciascuna)",
            "Dedicated Success Manager"
        ],
        risultato: "Riduzione costi operativi: 40% annuo • Scalabilità senza nuove assunzioni",
        includeAnche: [
            "Onboarding dedicato: 4 ore con specialist tecnico",
            "Custom playbook per la tua industry",
            "Formazione team completa (2 sessioni da 2h)",
            "Accesso beta a nuove feature",
            "Slack channel dedicato (risposta <4h)"
        ],
        limitiTecnici: [
            "5 Cloni attivi",
            "20.000 conversazioni/mese",
            "10 Canali inclusi (max 30 con overage)",
            "+5 canali extra: €20/mese",
            "Support: Dedicated CSM + Slack <4h"
        ],
        casoReale: "Agenzia automotive a Bologna: -€23.000/anno in costi customer service, +58% customer satisfaction score, team ridotto da 7 a 4 persone mantenendo stesso output."
    },
    imperatore: {
        name: "Imperatore",
        subtitle: "Enterprise",
        price: "€697",
        period: "/mese (Genesis Wave)",
        idealePer: [
            "Azienda established con 20+ dipendenti",
            "Fatturi €500k+/anno",
            "Serve white-label, on-premise o compliance-critical"
        ],
        cosaOttieni: [
            "15 Cloni AI (limite hard per sostenibilità)",
            "• Overage: +€50 per ogni 5 cloni extra",
            "100.000 conversazioni/mese (limite hard)",
            "• Overage: +€30 per ogni 50k conversazioni",
            "Deployment options:",
            "→ Cloud privato EU (Francoforte) con IP dedicato",
            "→ On-premise (banche, sanità, enti regolati)",
            "→ White-label completo (tuo brand, dominio)",
            "API completa + SDK JS/Python + GraphQL",
            "Team dedicato: AI Engineer + CSM",
            "SLA 99.9% uptime (credit 10% se non rispettato)",
            "Formazione avanzata team personalizzata",
            "4 War Room/mese + Slack diretto",
            "Contratto annuale (sconto 15%)"
        ],
        risultato: "Sistema rivendibile (white-label) • Revenue share 30% • Total ownership dati",
        requisiti: [
            "Revenue verificato >€500k/anno (richiesto bilancio) oppure",
            "Funding dimostrato >€250k (pitch deck + termsheet)",
            "Colloquio strategico obbligatorio (30-45 min)",
            "NDA firmato prima di accesso demo"
        ],
        disponibilita: "12 slot totali: Genesis 4 (2 occupati) • Pioneer 4 (1 occupato) • Elite 4",
        limitiTecnici: [
            "15 Cloni (max 25 con overage: +€50 per 5 cloni)",
            "100.000 conversazioni/mese (overage disponibile)",
            "25 Canali inclusi (max 50: +€50 per 10 canali)",
            "Support: Dedicato 24/5 + Slack real-time"
        ],
        casoReale: null
    },
    sovereignty: {
        name: "Sovereignty",
        subtitle: "Partnership Strategica",
        price: "CUSTOM",
        period: "Non è un piano, è un accordo",
        idealePer: [
            "Hai usato tier Imperatore per almeno 6 mesi consecutivi",
            "VirtualTwin è diventato business-critical per la tua operatività",
            "Vuoi co-ownership, licensing perpetuo, o partnership equity"
        ],
        cosaOttieni: null,
        risultato: null,
        nonDisponibile: "Questo tier NON è disponibile al pubblico",
        accessoTramite: [
            "Invito diretto da parte di Insolito Experiences",
            "Application motivata (form dedicato, revisione entro 7 giorni)"
        ],
        opzioni: [
            {
                nome: "OPZIONE A: Licensing Perpetuo",
                desc: "€50.000 one-time + €997/mese manutenzione",
                dettagli: "Possiedi il codice sorgente completo. Puoi modificarlo, espanderlo, rivenderlo. Licenza MIT-style."
            },
            {
                nome: "OPZIONE B: Equity Partnership",
                desc: "Investimento min €100k",
                dettagli: "Lifetime access + Board seat + Revenue share su nuovi prodotti + Exit priority"
            },
            {
                nome: "OPZIONE C: Profit Share Model",
                desc: "Zero costi software",
                dettagli: "Noi scaliamo il TUO business. Split 70% te, 30% noi sui clienti acquisiti via AI. Min 12 mesi."
            },
            {
                nome: "OPZIONE D: Strategic Alliance",
                desc: "Co-sviluppo feature custom",
                dettagli: "Tu finanzi, noi eseguiamo. Esclusiva 24 mesi sulla feature, poi diventa standard."
            }
        ],
        requisiti: [
            "Track record minimo 6 mesi su tier Imperatore",
            "NPS score >8/10 (feedback verificato)",
            "Colloquio esteso con Michael Jara (founder)",
            "Business case scritto dettagliato"
        ],
        benefici: [
            "Influenzi roadmap prodotto (priority su feature requests)",
            "Accesso pre-release a tutti i nuovi prodotti",
            "Co-marketing opportunities (case study, webinar, eventi)",
            "Network access ad altri partner Sovereignty"
        ],
        comeAccedere: [
            "Compila application: virtualtwin.it/sovereignty-application",
            "Revisione team (7 giorni lavorativi)",
            "Se approvato: colloquio con founder",
            "Negoziazione termini personalizzati",
            "Contratto custom redatto da legale"
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
    const cardBg = planStyle.isDark ? 'bg-white/5' : planStyle.isGold ? 'bg-white/10' : 'bg-charcoal/5';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
                onClick={onClose}
            />

            {/* Modal Container */}
            <div className={`
                relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
                rounded-[2.5rem] p-8 md:p-12 shadow-2xl
                ${planStyle.bg} border-2 ${planStyle.border}
                animate-in zoom-in-95 fade-in duration-300
            `}>
                {/* Decorative glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-transparent to-gold/20 rounded-[2.5rem] blur-xl opacity-50 pointer-events-none" />

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className={`absolute top-6 right-6 p-3 rounded-full transition-all hover:scale-110 z-10 ${planStyle.isDark || planStyle.isGold ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-charcoal/5 text-charcoal hover:bg-charcoal/10'}`}
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-10 relative">
                    <p className={`text-[11px] uppercase tracking-[0.4em] font-black mb-3 ${planStyle.accent}`}>
                        {plan.subtitle}
                    </p>
                    <h2 className={`font-serif text-4xl md:text-5xl lg:text-6xl italic tracking-tight ${textColor}`}>
                        {plan.name}
                    </h2>
                    <div className="flex items-baseline gap-3 mt-5">
                        <span className={`text-4xl md:text-5xl font-bold ${textColor}`}>{plan.price}</span>
                        <span className={`text-lg ${subtextColor}`}>{plan.period}</span>
                    </div>
                </div>

                {/* Non Disponibile Warning (Sovereignty) */}
                {(plan as any).nonDisponibile && (
                    <div className="mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30">
                        <p className="text-red-400 font-bold text-sm flex items-center gap-2">
                            <Shield className="w-5 h-5" />
                            {(plan as any).nonDisponibile}
                        </p>
                    </div>
                )}

                {/* Ideale Per */}
                {plan.idealePer && (
                    <div className={`mb-8 p-6 rounded-2xl ${cardBg} border ${planStyle.isDark ? 'border-white/10' : 'border-charcoal/10'}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-5 flex items-center gap-2 ${planStyle.accent}`}>
                            <Users className="w-4 h-4" /> Ideale per
                        </h3>
                        <ul className="space-y-3">
                            {plan.idealePer.map((item, i) => (
                                <li key={i} className={`flex items-start gap-3 ${subtextColor}`}>
                                    <span className="text-gold mt-0.5 text-lg">•</span>
                                    <span className="text-[15px] leading-relaxed">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Accesso Tramite (Sovereignty) */}
                {(plan as any).accessoTramite && (
                    <div className={`mb-8 p-6 rounded-2xl ${cardBg}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${planStyle.accent}`}>
                            <Lock className="w-4 h-4" /> Accesso Tramite
                        </h3>
                        <ul className="space-y-2">
                            {(plan as any).accessoTramite.map((item: string, i: number) => (
                                <li key={i} className={`text-sm ${subtextColor}`}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Cosa Ottieni */}
                {plan.cosaOttieni && (
                    <div className="mb-8">
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-5 flex items-center gap-2 ${planStyle.accent}`}>
                            <Sparkles className="w-4 h-4" /> Cosa Ottieni
                        </h3>
                        <div className="grid md:grid-cols-2 gap-3">
                            {plan.cosaOttieni.map((item, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${planStyle.isDark ? 'bg-green-500/20' : 'bg-green-100'}`}>
                                        <Check className="w-3 h-3 text-green-500" />
                                    </div>
                                    <span className={`text-sm leading-relaxed ${subtextColor}`}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Opzioni (Sovereignty) */}
                {(plan as any).opzioni && (
                    <div className="mb-8">
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-5 flex items-center gap-2 ${planStyle.accent}`}>
                            <Handshake className="w-4 h-4" /> Opzioni Disponibili
                        </h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {(plan as any).opzioni.map((opt: any, i: number) => (
                                <div key={i} className={`p-5 rounded-xl ${cardBg} border ${planStyle.isDark ? 'border-gold/20' : 'border-charcoal/10'} hover:border-gold/40 transition-colors`}>
                                    <p className={`font-bold text-sm mb-2 ${textColor}`}>{opt.nome}</p>
                                    <p className={`text-gold font-medium text-sm mb-2`}>{opt.desc}</p>
                                    <p className={`text-xs leading-relaxed ${subtextColor}`}>{opt.dettagli}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Risultato */}
                {plan.risultato && (
                    <div className={`mb-8 p-6 rounded-2xl ${planStyle.isGold ? 'bg-white/20' : planStyle.isDark ? 'bg-gold/10' : 'bg-gold/5'} border ${planStyle.isGold ? 'border-white/20' : 'border-gold/30'}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${planStyle.isGold ? 'text-white' : 'text-gold'}`}>
                            <Target className="w-4 h-4" /> Risultato Concreto
                        </h3>
                        <p className={`text-[15px] leading-relaxed ${planStyle.isGold ? 'text-white' : textColor}`}>{plan.risultato}</p>
                    </div>
                )}

                {/* Metriche (Entrepreneur) */}
                {(plan as any).metriche && (
                    <div className="mb-8 grid grid-cols-3 gap-4">
                        <div className={`text-center p-5 rounded-xl ${cardBg}`}>
                            <p className={`text-3xl font-bold ${planStyle.accent}`}>{(plan as any).metriche.roi}</p>
                            <p className={`text-xs mt-1 ${subtextColor}`}>ROI</p>
                        </div>
                        <div className={`text-center p-5 rounded-xl ${cardBg}`}>
                            <p className={`text-3xl font-bold ${planStyle.accent}`}>{(plan as any).metriche.payback}</p>
                            <p className={`text-xs mt-1 ${subtextColor}`}>Payback</p>
                        </div>
                        <div className={`text-center p-5 rounded-xl ${cardBg}`}>
                            <p className={`text-3xl font-bold ${planStyle.accent}`}>{(plan as any).metriche.costoLead.split(' ')[0]}</p>
                            <p className={`text-xs mt-1 ${subtextColor}`}>Costo/Lead</p>
                        </div>
                    </div>
                )}

                {/* Include Anche (Conquistatore) */}
                {(plan as any).includeAnche && (
                    <div className={`mb-8 p-6 rounded-2xl ${cardBg}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${planStyle.accent}`}>
                            <Award className="w-4 h-4" /> Include Anche
                        </h3>
                        <div className="grid md:grid-cols-2 gap-2">
                            {(plan as any).includeAnche.map((item: string, i: number) => (
                                <p key={i} className={`text-sm ${subtextColor}`}>• {item}</p>
                            ))}
                        </div>
                    </div>
                )}

                {/* Requisiti (Imperatore / Sovereignty) */}
                {(plan as any).requisiti && (
                    <div className={`mb-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 text-amber-500`}>
                            <Shield className="w-4 h-4" /> Requisiti per Accesso
                        </h3>
                        <ul className="space-y-2">
                            {(plan as any).requisiti.map((item: string, i: number) => (
                                <li key={i} className={`text-sm ${subtextColor}`}>• {item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Benefici (Sovereignty) */}
                {(plan as any).benefici && (
                    <div className={`mb-8 p-6 rounded-2xl ${cardBg}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${planStyle.accent}`}>
                            <TrendingUp className="w-4 h-4" /> Benefici Esclusivi
                        </h3>
                        <ul className="space-y-2">
                            {(plan as any).benefici.map((item: string, i: number) => (
                                <li key={i} className={`text-sm ${subtextColor}`}>✓ {item}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Come Accedere (Sovereignty) */}
                {(plan as any).comeAccedere && (
                    <div className={`mb-8 p-6 rounded-2xl border-2 border-gold/30 bg-gold/5`}>
                        <h3 className="text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 text-gold">
                            📞 Come Accedere
                        </h3>
                        <p className={`text-sm italic mb-4 ${subtextColor}`}>Non si "compra" Sovereignty. Si guadagna o si negozia.</p>
                        <ol className="space-y-2">
                            {(plan as any).comeAccedere.map((item: string, i: number) => (
                                <li key={i} className={`text-sm ${subtextColor}`}>{i + 1}. {item}</li>
                            ))}
                        </ol>
                    </div>
                )}

                {/* Disponibilità (Imperatore) */}
                {(plan as any).disponibilita && (
                    <div className={`mb-8 p-5 rounded-2xl bg-red-500/10 border border-red-500/30`}>
                        <p className="text-red-400 font-bold text-sm flex items-center gap-2">
                            🔒 DISPONIBILITÀ LIMITATA
                        </p>
                        <p className={`text-sm mt-2 ${subtextColor}`}>{(plan as any).disponibilita}</p>
                    </div>
                )}

                {/* Caso Reale */}
                {plan.casoReale && (
                    <div className={`mb-8 p-6 rounded-2xl border-l-4 ${planStyle.isDark ? 'bg-white/5 border-gold' : 'bg-amber-50 border-amber-400'}`}>
                        <p className={`text-xs uppercase tracking-widest font-black mb-3 ${planStyle.isDark ? 'text-gold' : 'text-amber-600'}`}>💬 Caso Reale</p>
                        <p className={`text-sm italic leading-relaxed ${subtextColor}`}>"{plan.casoReale}"</p>
                    </div>
                )}

                {/* Limiti Tecnici */}
                {plan.limitiTecnici && (
                    <div className={`p-6 rounded-2xl ${cardBg}`}>
                        <h3 className={`text-xs uppercase tracking-[0.3em] font-black mb-4 flex items-center gap-2 ${subtextColor}`}>
                            <BarChart3 className="w-4 h-4" /> Limiti Tecnici
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
