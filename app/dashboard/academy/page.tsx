'use client';

import React, { useState, useRef } from 'react';
import {
    School,
    Copy,
    Check,
    Send,
    MessageCircle,
    Target,
    Sparkles,
    ArrowRight,
    PlayCircle,
    ChevronLeft,
    ChevronRight,
    Lock,
    Trophy,
    Award,
    TrendingUp
} from 'lucide-react';
import { useSovereign } from '@/components/providers/SovereignProvider';
import { ImperialGate } from '@/components/dashboard/ImperialGate';
import { AcademyQuiz } from '@/components/dashboard/AcademyQuiz';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PlanTier } from '@/lib/pricing';

/**
 * Founder Academy Page
 * Private section for premium users to access growth templates
 * Upgraded with Wave 2: The Academy Gate gating & progress tracking
 */
export default function AcademyPage() {
    const { user, loading, refreshProfile } = useSovereign();
    const router = useRouter();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [activeQuiz, setActiveQuiz] = useState<any>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [activeSector, setActiveSector] = useState('Generale');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const sectors = [
        'Generale', 'Real Estate', 'E-commerce', 'Coach/Consulenti',
        'Agenzie Marketing', 'SaaS', 'Fitness/Salute', 'HR/Recruiting',
        'Assicurazioni', 'Automotive', 'Beauty/Fashion', 'Food & Beverage',
        'Tech/Sviluppo', 'Arte/Design', 'Viaggi/Luxury'
    ];

    const copyToClipboard = (id: string, text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const { scrollLeft } = scrollContainerRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - 200 : scrollLeft + 200;
            scrollContainerRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    const videoModules: { name: string; tier: PlanTier; description: string; videos: any[]; quizQuestions?: any[] }[] = [
        {
            name: "Fondamenta dell'Impero",
            tier: "curioso",
            description: "I primi passi per comprendere la potenza dei datori di lavoro digitali.",
            videos: [
                { id: "v1", title: 'La Genesi del Clone AI', duration: '12:45', thumbnail: 'bg-gold/10', xp: 25 },
                { id: "v2", title: 'Mentalità Sovereign', duration: '08:20', thumbnail: 'bg-charcoal/5', xp: 25 },
            ]
        },
        {
            name: "Esecuzione Strategica",
            tier: "aspirante",
            description: "Trasforma le conversazioni in conversioni automatiche.",
            videos: [
                { id: "v3", title: 'Architettura delle Vendite', duration: '15:20', thumbnail: 'bg-charcoal/5', xp: 50 },
                { id: "v4", title: 'Gestione Obiezioni via Chat', duration: '14:30', thumbnail: 'bg-charcoal/5', xp: 50 },
            ]
        },
        {
            name: "Ottimizzazione Imperiale",
            tier: "esploratore",
            description: "Affina i tuoi sistemi AI per velocità e precisione chirugica.",
            videos: [
                { id: "v10", title: 'Fine-Tuning delle FAQ d\'Elite', duration: '11:15', thumbnail: 'bg-gold/5', xp: 75 },
                { id: "v11", title: 'Analisi dei Pattern di Conversione', duration: '13:40', thumbnail: 'bg-gold/5', xp: 75 },
            ],
            quizQuestions: [
                {
                    id: 1, text: "Qual è l'obiettivo del Fine-Tuning nelle FAQ?",
                    options: ["Dare risposte lunghe", "Eliminare ambiguità e frizioni", "Avere più FAQ degli altri", "Confondere il competitor"],
                    correctIndex: 1,
                    explanation: "La precisione è potere. FAQ affilate eliminano i dubbi del prospect prima ancora che diventino obiezioni."
                }
            ] as any
        },
        {
            name: "Dominio del Mercato",
            tier: "pioniere",
            description: "Tecniche avanzate di outreach e posizionamento elite.",
            videos: [
                { id: "v5", title: 'Outreach Magnetico su LinkedIn', duration: '18:10', thumbnail: 'bg-gold/10', xp: 100 },
                { id: "v6", title: 'Scaling: Da 1 a 100 Cloni', duration: '20:00', thumbnail: 'bg-gold/10', xp: 100 },
            ]
        },
        {
            name: "Espansione Dominante",
            tier: "conquistatore",
            description: "Gestisci team, deleghe e API per una scalata senza limiti.",
            videos: [
                { id: "v12", title: 'Delega Strategica alle Macchine', duration: '19:20', thumbnail: 'bg-charcoal/5', xp: 150 },
                { id: "v13", title: 'Integrazioni API: Il Cervello Centralizzato', duration: '22:15', thumbnail: 'bg-charcoal/5', xp: 150 },
            ],
            quizQuestions: [
                {
                    id: 1, text: "Come si scala un impero digitale senza perdere qualità?",
                    options: ["Assumendo più persone", "Integrazione API e Sistemi Autonomi", "Lavorando di domenica", "Abbassando i prezzi"],
                    correctIndex: 1,
                    explanation: "La scalabilità atomica si ottiene attraverso sistemi che non dormono e non sbagliano: le API sono i tuoi generali digitali."
                }
            ] as any
        },
        {
            name: "Maestria Assoluta",
            tier: "imperatore",
            description: "Il protocollo finale per il dominio totale del tuo settore.",
            videos: [
                { id: "v7", title: 'Protocollo Sovrano: Mastery', duration: '25:00', thumbnail: 'bg-charcoal/5', xp: 250 },
            ],
            quizQuestions: [
                {
                    id: 1, text: "Qual è il pilastro fondamentale della mentalità Sovereign?",
                    options: ["Risparmio massimo", "Automazione & Autorità", "Lavorare più ore", "Delegare tutto ad umani"],
                    correctIndex: 1,
                    explanation: "Un Sovrano non scambia tempo per denaro; costruisce asset automatici che proiettano la sua autorità 24/7."
                },
                {
                    id: 2, text: "Cosa definisce un 'Clone AI' efficace?",
                    options: ["Usa parole tecniche", "Parla come te e converte", "Risponde solo con FAQ", "Sostituisce il customer care"],
                    correctIndex: 1,
                    explanation: "L'efficacia si misura nella perfetta aderenza al tuo tono di voce unito alla capacità di chiudere vendite."
                }
            ] as any
        }
    ];

    const submitQuizResults = async (score: number, total: number) => {
        if (!activeQuiz) return;
        try {
            const response = await fetch('/api/academy/submit-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleId: activeQuiz.moduleId, score, totalQuestions: total })
            });
            if (response.ok) {
                await refreshProfile();
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const handleVideoComplete = async (videoId: string, xp: number) => {
        setIsCompleting(true);
        try {
            const response = await fetch('/api/academy/complete-video', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId, xpAwarded: xp })
            });
            if (response.ok) {
                await refreshProfile();
                setSelectedVideo(null);
            }
        } catch (error) {
            console.error('Error completing video:', error);
        } finally {
            setIsCompleting(false);
        }
    };

    const templates = [
        {
            id: 'conn-caldo',
            sector: 'Generale',
            title: 'Richiesta Connessione (Calda)',
            target: 'Chi ti segue o interagisce',
            icon: Target,
            text: `Ciao [Nome]! 👋\n\nHo notato il tuo lavoro su [TOPIC/POST]. Impressionante.\n\nSto lanciando qualcosa che potrebbe interessarti... Te ne parlo se accetti?\n\nMichael`
        },
        {
            id: 'real-estate-script',
            sector: 'Real Estate',
            title: 'Qualifica Immobiliare',
            target: 'Proprietari di immobili',
            icon: Target,
            text: `Buongiorno [Nome], \n\nHo visto il suo annuncio per l'immobile in [Zona]. \n\nVirtualTwin sta aiutando le agenzie in zona a qualificare i lead automaticamente in 2 minuti. Le interesserebbe vedere come funziona?`
        },
        {
            id: 'coach-cold',
            sector: 'Coach/Consulenti',
            title: 'Scalabilità per Coach',
            target: 'Coach con molto traffico',
            icon: Send,
            text: `Ciao [Nome], \n\nAmiamo i tuoi contenuti! Gestire tutti i DM deve essere un incubo però... 😅\n\nHo creato un Clone AI che parla esattamente come te e chiude vendite mentre dormi. Lo testeresti gratuitamente?`
        },
    ];

    const filteredTemplates = templates.filter(t => t.sector === activeSector || activeSector === 'Generale');

    return (
        <div className="p-4 lg:p-12 max-w-7xl mx-auto">
            {/* Imperial Header */}
            <header className="mb-20 relative">
                {/* Decorative Ambient Light */}
                <div className="absolute -top-40 -left-20 w-96 h-96 bg-gold/10 blur-[150px] rounded-full pointer-events-none" />

                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-8"
                    >
                        <div className="w-12 h-12 bg-charcoal rounded-[1.2rem] flex items-center justify-center shadow-luxury-sm">
                            <School className="w-6 h-6 text-gold" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">Private Knowledge Base</span>
                            <span className="text-[7px] uppercase tracking-[0.5em] text-charcoal/30 font-bold">Imperial Protocol v2.1</span>
                        </div>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl lg:text-7xl font-serif text-charcoal mb-8 italic leading-[1.1] tracking-tight"
                    >
                        Il Tuo Arsenale di <br />
                        <span className="gold-text-gradient">Crescita Sovrana</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-charcoal/40 max-w-2xl text-lg font-serif italic leading-relaxed"
                    >
                        "Le armi segrete non si condividono, si dominano. Benvenuto nell'Elite dei Founder, dove l'ambizione incontra l'automazione assoluta."
                    </motion.p>
                </div>
            </header>

            {/* Steps Guide (Luxe Redesign) */}
            <div className="relative mb-24">
                {/* Background Decor */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[120%] bg-gold/5 blur-[120px] rounded-full pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    {[
                        { step: '01', title: 'Outreach LinkedIn', desc: 'Sfrutta algoritmi e script proprietari per connetterti con lead pronti all\'acquisto.', icon: Target },
                        { step: '02', title: 'Demo Call d\'Elite', desc: 'Protocolli di conversione per trasformare lo scetticismo in autorità assoluta.', icon: MessageCircle },
                        { step: '03', title: 'Beta Test Expansion', desc: 'Scala l\'impero raccogliendo prove sociali e dominando la tua nicchia.', icon: Sparkles }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-md rounded-[3rem] border border-white/60 shadow-luxury-sm group-hover:shadow-luxury transition-all duration-700" />
                            <div className="absolute inset-x-0 bottom-0 h-1 gold-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-b-[3rem]" />

                            <div className="relative p-10 h-full flex flex-col">
                                <span className="absolute top-8 right-10 text-6xl font-serif italic text-gold/10 group-hover:text-gold/20 transition-colors duration-700 select-none">
                                    {item.step}
                                </span>

                                <div className="w-14 h-14 bg-charcoal text-white rounded-2xl flex items-center justify-center mb-10 shadow-xl group-hover:scale-110 transition-transform duration-700">
                                    <item.icon className="w-6 h-6 text-gold" />
                                </div>

                                <h3 className="text-xl font-serif italic text-charcoal mb-4 group-hover:text-gold transition-colors duration-500">{item.title}</h3>
                                <p className="text-xs text-charcoal/40 leading-relaxed font-sans font-medium">
                                    {item.desc}
                                </p>

                                <div className="mt-auto pt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-gold opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-left">
                                    Mastery Protocol <ArrowRight className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Sovereign Progress Stats (Unified Luxe) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    className="bg-charcoal p-10 rounded-[3rem] border border-gold/30 shadow-luxury relative overflow-hidden group"
                >
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 blur-[60px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-colors duration-700" />
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
                            <Trophy className="w-6 h-6 text-gold" />
                        </div>
                        <h4 className="text-[10px] text-white/30 uppercase tracking-[0.4em] font-black mb-2">Sovereign Rank</h4>
                        <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-serif italic text-gold leading-none">{user?.level || 1}</span>
                            <span className="text-white/20 text-[8px] font-bold uppercase tracking-[0.3em]">Empire Level</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-2 bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/60 shadow-luxury-sm flex flex-col justify-between"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gold/5 rounded-xl flex items-center justify-center">
                                <TrendingUp className="w-5 h-5 text-gold" />
                            </div>
                            <div>
                                <h4 className="text-[10px] text-charcoal/40 uppercase tracking-[0.4em] font-black">Esperienza Totale (XP)</h4>
                                <p className="text-[9px] text-charcoal/20 font-bold uppercase tracking-widest mt-0.5">Potenziale Evolutivo</p>
                            </div>
                        </div>
                        <span className="text-sm font-serif italic text-charcoal">{user?.xp || 0} <span className="text-charcoal/20">/ {Math.pow((user?.level || 1), 2) * 100} XP</span></span>
                    </div>

                    <div className="relative pt-4">
                        <div className="h-4 bg-charcoal/5 rounded-full overflow-hidden p-0.5 border border-charcoal/[0.03]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, ((user?.xp || 0) / (Math.pow((user?.level || 1), 2) * 100)) * 100)}%` }}
                                className="h-full gold-gradient rounded-full shadow-[0_0_15px_rgba(212,175,55,0.3)] relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 w-full animate-shimmer" />
                            </motion.div>
                        </div>
                        <div className="flex justify-between mt-3 text-[8px] text-charcoal/30 font-black uppercase tracking-widest">
                            <span>RANK {(user?.level || 1)}</span>
                            <span>PROSSIMO {(user?.level || 1) + 1}</span>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border border-white/60 shadow-luxury-sm group"
                >
                    <div className="w-12 h-12 bg-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold/10 transition-colors">
                        <Award className="w-6 h-6 text-gold" />
                    </div>
                    <h4 className="text-[10px] text-charcoal/40 uppercase tracking-[0.4em] font-black mb-2">Mastery Progress</h4>
                    <div className="flex items-baseline gap-2">
                        <span className="text-5xl font-serif italic text-charcoal leading-none group-hover:text-gold transition-colors">{user?.completed_video_ids?.length || 0}</span>
                        <span className="text-charcoal/20 text-[8px] font-bold uppercase tracking-[0.3em]">/ 21 Lezioni</span>
                    </div>
                    <div className="mt-4 flex gap-1">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`h-1 flex-1 rounded-full ${i <= (user?.completed_video_ids?.length || 0) / 4 ? 'bg-gold' : 'bg-charcoal/5'}`} />
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Video Masterclass Sections (Tiered) */}
            <div className="space-y-20 mb-24">
                {videoModules.map((module, mIndex) => (
                    <div key={mIndex}>
                        <div className="flex items-center gap-6 mb-10">
                            <div className="flex-shrink-0">
                                <h2 className="text-2xl font-serif text-charcoal italic leading-none">{module.name}</h2>
                                <p className="text-xs text-charcoal/40 mt-2">{module.description}</p>
                            </div>
                            <div className="flex-1 h-[1px] bg-charcoal/5" />
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${module.tier === 'curioso' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                module.tier === 'aspirante' ? 'bg-green-50 text-green-600 border-green-100' :
                                    'bg-gold/5 text-gold border-gold/20'
                                }`}>
                                Tier: {module.tier}
                            </div>
                        </div>

                        <ImperialGate tier={module.tier} featureName={module.name} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {module.videos.map((lesson) => {
                                    const isCompleted = user?.completed_video_ids?.includes(lesson.id);
                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`bg-white rounded-[2rem] border border-charcoal/5 overflow-hidden group hover:shadow-2xl transition-all duration-700 ${isCompleted ? 'ring-1 ring-green-100' : ''}`}
                                        >
                                            <div className={`aspect-video ${lesson.thumbnail} flex items-center justify-center relative overflow-hidden`}>
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-700" />

                                                {isCompleted ? (
                                                    <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center text-white shadow-xl z-20">
                                                        <Check className="w-8 h-8" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setSelectedVideo(lesson)}
                                                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-gold shadow-xl group-hover:scale-110 transition-transform duration-700 z-10"
                                                    >
                                                        <PlayCircle className="w-8 h-8 fill-gold/10" />
                                                    </button>
                                                )}

                                                <div className="absolute bottom-4 right-4 px-4 py-2 bg-black/60 backdrop-blur-md rounded-xl text-white text-[10px] font-black tracking-widest shadow-lg">
                                                    {lesson.duration}
                                                </div>

                                                {isCompleted && (
                                                    <div className="absolute top-4 left-4 px-3 py-1 bg-green-500/90 backdrop-blur-md rounded-lg text-white text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                                                        Completato +{lesson.xp} XP
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-8">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                                                    <span className="text-[10px] text-charcoal/30 font-black uppercase tracking-[0.3em]">{lesson.xp} XP AWARD</span>
                                                </div>
                                                <h4 className="text-charcoal font-serif italic text-xl leading-tight group-hover:text-gold transition-colors">{lesson.title}</h4>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Module Progress Footer / Quiz Trigger */}
                            <div className="flex items-center justify-between p-8 bg-charcoal/[0.02] border border-charcoal/5 rounded-[2rem]">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold shadow-luxury-sm">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] text-charcoal/40 font-black uppercase tracking-widest">Validazione Competenze</h4>
                                        <p className="text-sm font-serif italic text-charcoal">Completa il quiz per sbloccare il badge del modulo.</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setActiveQuiz({ moduleId: module.tier, moduleName: module.name, questions: (module as any).quizQuestions || [] })}
                                    className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${user?.quizzes_passed?.[module.tier]
                                        ? 'bg-green-50 text-green-600 border border-green-100 cursor-default'
                                        : 'bg-white text-charcoal shadow-luxury-sm hover:bg-charcoal hover:text-white'
                                        }`}
                                >
                                    {user?.quizzes_passed?.[module.tier] ? 'Modulo Convalidato ✓' : 'Inizia Quiz Modulo'}
                                </button>
                            </div>
                        </ImperialGate>
                    </div>
                ))}
            </div>

            {/* Template Section with Gating */}
            <div className="flex flex-col gap-8 mb-16">
                <div className="flex items-end justify-between">
                    <h2 className="text-3xl font-serif text-charcoal italic tracking-tight">Script di Vendita & <span className="gold-text-gradient">Outreach</span></h2>
                    <div className="hidden lg:flex items-center gap-2 mb-2">
                        <button onClick={() => scroll('left')} className="p-2 rounded-full hover:bg-gold/10 text-charcoal/30 hover:text-gold transition-all">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={() => scroll('right')} className="p-2 rounded-full hover:bg-gold/10 text-charcoal/30 hover:text-gold transition-all">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Elite Sector Selector */}
                <div className="relative group/tabs">
                    {/* Horizontal Fade Masks */}
                    <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-champagne via-champagne/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-champagne via-champagne/80 to-transparent z-10 pointer-events-none" />

                    <div
                        ref={scrollContainerRef}
                        className="flex items-center gap-3 overflow-x-auto py-4 px-12 scroll-smooth no-scrollbar"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <style jsx>{`
                            .no-scrollbar::-webkit-scrollbar {
                                display: none;
                            }
                        `}</style>
                        {sectors.map(s => (
                            <button
                                key={s}
                                onClick={() => setActiveSector(s)}
                                className={`whitespace-nowrap px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-700 relative shadow-sm border ${activeSector === s
                                    ? 'text-white border-transparent scale-105 shadow-luxury-sm'
                                    : 'bg-white/60 text-charcoal/30 hover:bg-gold/5 hover:text-gold border-white/40'
                                    }`}
                            >
                                {activeSector === s && (
                                    <div className="absolute inset-0 gold-gradient rounded-full" />
                                )}
                                <span className="relative z-10">{s}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <ImperialGate tier="aspirante" featureName="Asset di Outreach" description="Sblocca l'accesso a oltre 50 template di outreach e script di vendita pronti all'uso con il piano Aspirante." className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
                    {filteredTemplates.map((tpl) => (
                        <div key={tpl.id} className="bg-white rounded-[2.5rem] overflow-hidden border border-charcoal/5 shadow-luxury-sm hover:shadow-luxury transition-all duration-700 group">
                            <div className="p-10">
                                <div className="flex items-start justify-between mb-8">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 bg-charcoal/5 rounded-[1.2rem] flex items-center justify-center group-hover:bg-gold/10 transition-colors duration-500">
                                            <tpl.icon className="w-6 h-6 text-charcoal/30 group-hover:text-gold transition-all duration-500" />
                                        </div>
                                        <div>
                                            <h4 className="text-[10px] uppercase tracking-[0.3em] text-gold font-black mb-1">{tpl.target}</h4>
                                            <h3 className="text-xl font-serif italic text-charcoal leading-tight">{tpl.title}</h3>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(tpl.id, tpl.text)}
                                        className={`p-4 rounded-2xl transition-all duration-500 ${copiedId === tpl.id
                                            ? 'bg-green-500 text-white scale-110 shadow-lg'
                                            : 'bg-charcoal/5 text-charcoal/20 hover:bg-gold hover:text-white hover:shadow-luxury-sm'
                                            }`}
                                    >
                                        {copiedId === tpl.id ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>

                                <div className="bg-charcoal/[0.02] rounded-[1.5rem] p-8 font-mono text-[11px] text-charcoal/60 leading-relaxed whitespace-pre-wrap min-h-[180px] border border-charcoal/[0.03]">
                                    {tpl.text}
                                </div>

                                <div className="mt-8 flex items-center justify-between border-t border-charcoal/5 pt-6">
                                    <div className="flex items-center gap-3 text-[9px] text-charcoal/20 font-black uppercase tracking-[0.3em] font-sans">
                                        <Sparkles className="w-4 h-4 text-gold/40" />
                                        Sovereign Assets
                                    </div>
                                    <span className="text-[10px] text-charcoal/10 font-bold">
                                        BYTES: {tpl.text.length}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </ImperialGate>
            </div>

            {/* Video Player Modal/Overlay (Simulated for Demo) */}
            <AnimatePresence>
                {selectedVideo && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-charcoal/95 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[2.5rem] overflow-hidden max-w-4xl w-full shadow-2xl relative"
                        >
                            <div className="aspect-video bg-black flex items-center justify-center relative">
                                <PlayCircle className="w-20 h-20 text-white/20" />
                                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col gap-4">
                                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 5, ease: "linear" }}
                                            onAnimationComplete={() => handleVideoComplete(selectedVideo.id, selectedVideo.xp)}
                                            className="h-full gold-gradient"
                                        />
                                    </div>
                                    <p className="text-white/50 text-[10px] uppercase tracking-widest font-black flex items-center justify-between">
                                        <span>Simulazione Video Player...</span>
                                        <span>XP Awarded at 100% completion</span>
                                    </p>
                                </div>
                            </div>
                            <div className="p-10 flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-serif italic text-charcoal">{selectedVideo.title}</h3>
                                    <p className="text-charcoal/40 text-xs mt-2">Durerà approssimativamente {selectedVideo.duration} minuti.</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => handleVideoComplete(selectedVideo.id, selectedVideo.xp)}
                                        disabled={isCompleting}
                                        className="px-8 py-3 gold-gradient text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                                    >
                                        {isCompleting ? 'Salvataggio...' : 'Segna come completato'}
                                    </button>
                                    <button
                                        onClick={() => setSelectedVideo(null)}
                                        className="px-8 py-3 bg-charcoal/5 hover:bg-charcoal text-charcoal hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Chiudi
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {/* Quiz Overlay */}
                {activeQuiz && (
                    <AcademyQuiz
                        moduleId={activeQuiz.moduleId}
                        moduleName={activeQuiz.moduleName}
                        questions={activeQuiz.questions}
                        onComplete={submitQuizResults}
                        onClose={() => setActiveQuiz(null)}
                    />
                )}
            </AnimatePresence>

            {/* Footer Tip (High Contrast Upgrade) */}
            <div className="mt-16 bg-charcoal p-12 lg:p-20 rounded-[4rem] text-white overflow-hidden relative shadow-luxury group">
                {/* Decorative Ambient Light */}
                <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-gold/10 blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:bg-gold/20 transition-all duration-1000" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 blur-[100px] translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-16">
                    <div className="max-w-2xl text-center lg:text-left">
                        <h2 className="text-4xl lg:text-6xl font-serif italic mb-8 leading-[1.1] tracking-tight">
                            La Genesi del Successo è nella <br />
                            <span className="gold-text-gradient">Personalizzazione.</span>
                        </h2>
                        <p className="text-white/60 text-lg font-serif italic leading-relaxed mb-12 max-w-xl">
                            "Non limitarti a incollare. Cita un risultato specifico del tuo prospect o un loro post recente. Le persone comprano da persone, non da spettatori passivi."
                        </p>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6">
                            <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-gold hover:text-white transition-all shadow-xl group/btn">
                                <MessageCircle className="w-5 h-5 text-gold group-hover/btn:text-white transition-colors" />
                                Private Access (TG)
                            </button>
                            <button className="px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-gold hover:text-white transition-all shadow-xl group/btn">
                                <Sparkles className="w-5 h-5 text-gold group-hover/btn:text-white transition-colors" />
                                Discord Sovereignty
                            </button>
                        </div>
                    </div>

                    <button className="px-14 py-8 bg-white text-charcoal rounded-full font-black text-[12px] uppercase tracking-[0.4em] shadow-2xl hover:scale-105 hover:bg-gold hover:text-white transition-all duration-700 shrink-0 border border-white/20">
                        Strategic Session 1:1
                    </button>
                </div>
            </div>
        </div>
    );
}
