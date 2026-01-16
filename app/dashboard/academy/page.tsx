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
    TrendingUp,
    ShoppingBag,
    Briefcase,
    Cpu,
    HeartPulse,
    Users,
    Shield,
    Car,
    Utensils,
    Code,
    Palette,
    Globe,
    Crown
} from 'lucide-react';
import { useSovereign } from '@/components/providers/SovereignProvider';
import { ImperialGate } from '@/components/dashboard/ImperialGate';
import { AcademyQuiz } from '@/components/dashboard/AcademyQuiz';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PlanTier } from '@/lib/pricing';

/**
 * Academy Élite Page
 * Private section for premium users to access growth templates
 * Upgraded with Wave 2: The Academy Gate gating & progress tracking
 * NOW CONNECTED TO DATABASE
 */
export default function AcademyPage() {
    const { user, loading, refreshProfile } = useSovereign();
    const router = useRouter();
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [activeQuiz, setActiveQuiz] = useState<any>(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [activeSector, setActiveSector] = useState('Generale');
    const [templateSearch, setTemplateSearch] = useState('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // NEW: Courses from database
    const [dbCourses, setDbCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    // Fetch courses from database
    React.useEffect(() => {
        const fetchCourses = async () => {
            try {
                const tier = user?.plan_tier || 'curioso';
                const res = await fetch(`/api/academy/courses?tier=${tier}`);
                const data = await res.json();
                if (data.courses) {
                    setDbCourses(data.courses);
                }
            } catch (error) {
                console.error('Failed to fetch courses:', error);
            } finally {
                setLoadingCourses(false);
            }
        };

        if (!loading) {
            fetchCourses();
        }
    }, [user?.plan_tier, loading]);

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

    // Transform DB courses to videoModules format for compatibility
    const videoModules = dbCourses.length > 0 ? dbCourses.map(course => ({
        name: course.title,
        tier: course.min_tier as PlanTier,
        waveId: undefined as string | undefined,
        description: course.description || '',
        isLocked: course.isLocked,
        videos: (course.modules || []).map((m: any) => ({
            id: m.id,
            title: m.title,
            duration: m.duration_minutes ? `${m.duration_minutes}:00` : '10:00',
            thumbnail: 'bg-gold/10',
            xp: m.duration_minutes ? m.duration_minutes * 5 : 50,
            content_url: m.content_url,
            isLocked: m.isLocked
        })),
        quizQuestions: [] as any[]
    })) : [
        // Fallback mock if DB is empty (shouldn't happen after seed)
        {
            name: "Fondamenta dell'Impero",
            tier: "curioso",
            description: "I primi passi per comprendere la potenza dei datori di lavoro digitali.",
            videos: [
                { id: "v1", title: 'La Genesi del Clone AI', duration: '12:45', thumbnail: 'bg-gold/10', xp: 25 },
                { id: "v2", title: 'Mentalità Sovereign', duration: '08:20', thumbnail: 'bg-charcoal/5', xp: 25 },
            ],
            quizQuestions: [
                {
                    id: 1, text: "Cosa distingue un Datore di Lavoro Digitale da un semplice Bot?",
                    options: ["La velocità di risposta", "La capacità di proiettare la tua autorità e chiudere vendite", "Il costo mensile", "Il numero di lingue parlate"],
                    correctIndex: 1,
                    explanation: "Un Sovrano non usa bot; addestra cloni che portano la sua visione e chiudono accordi 24/7."
                }
            ] as any
        },
        {
            name: "Esecuzione Strategica",
            tier: "solopreneur",
            description: "Trasforma le conversazioni in conversioni automatiche.",
            videos: [
                { id: "v3", title: 'Architettura delle Vendite', duration: '15:20', thumbnail: 'bg-charcoal/5', xp: 50 },
                { id: "v4", title: 'Gestione Obiezioni via Chat', duration: '14:30', thumbnail: 'bg-charcoal/5', xp: 50 },
            ],
            quizQuestions: [
                {
                    id: 1, text: "Qual è la chiave per superare le obiezioni in chat?",
                    options: ["Rispondere immediatamente", "Anticipare il dubbio prima ancora che venga espresso", "Chiedere di chiamare", "Inviare un PDF lungo"],
                    correctIndex: 1,
                    explanation: "La maestria nella vendita via chat risiede nell'eliminazione sequenziale del rischio percepito dal prospect."
                }
            ] as any
        },
        {
            name: "Ottimizzazione Imperiale",
            tier: "solopreneur",
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
            tier: "entrepreneur",
            description: "Tecniche avanzate di outreach e posizionamento elite.",
            videos: [
                { id: "v5", title: 'Outreach Magnetico su LinkedIn', duration: '18:10', thumbnail: 'bg-gold/10', xp: 100 },
                { id: "v6", title: 'Scaling: Da 1 a 100 Cloni', duration: '20:00', thumbnail: 'bg-gold/10', xp: 100 },
            ],
            quizQuestions: [
                {
                    id: 1, text: "Perché l'Outreach LinkedIn fallisce per la maggior parte dei Founder?",
                    options: ["Mancanza di automazione", "Messaggi generici e poco autoritari", "Account troppo recenti", "LinkedIn è saturo"],
                    correctIndex: 1,
                    explanation: "Il dominio del mercato si ottiene con la personalizzazione chirurgica unita a un posizionamento di autorità assoluta."
                }
            ] as any
        },
        {
            name: "Protocollo Genesis (Esclusivo)",
            tier: "entrepreneur",
            waveId: "genesis",
            description: "Segreti riservati ai primi 20 fondatori che hanno dato vita all'impero.",
            videos: [
                { id: "v15", title: 'Il Vantaggio del Primo Sovrano', duration: '22:15', thumbnail: 'bg-gold/20', xp: 200 },
                { id: "v16", title: 'Architettura Founder Genesis', duration: '18:50', thumbnail: 'bg-gold/20', xp: 200 },
            ],
        },
        {
            name: "Protocollo Pioneer (Scale-Up)",
            tier: "entrepreneur",
            waveId: "pioneer",
            description: "Strategie di espansione per chi ha cavalcato la seconda ondata.",
            videos: [
                { id: "v17", title: 'Scaling Pioneer: Da 10k a 50k', duration: '25:00', thumbnail: 'bg-gold/10', xp: 150 },
            ],
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
        if (!activeQuiz) return null;
        try {
            const response = await fetch('/api/academy/submit-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ moduleId: activeQuiz.moduleId, score, totalQuestions: total })
            });
            const data = await response.json();
            if (response.ok) {
                await refreshProfile();
            }
            return data;
        } catch (error) {
            console.error('Error submitting quiz:', error);
            return null;
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
            id: 't1',
            title: 'Richiesta Connessione (Calda)',
            target: 'Chi ti segue o interagisce',
            text: 'Ciao [Nome]! 👋\n\nHo notato il tuo lavoro su [TOPIC/POST]. Impressionante.\n\nSto lanciando qualcosa che potrebbe interessarti... Te ne parlo se accetti?\n\nMichael',
            icon: Target,
            sector: 'Generale'
        },
        {
            id: 't2',
            title: 'Qualifica Immobiliare',
            target: 'Proprietari di Immobili',
            text: 'Buongiorno [Nome],\n\nHo visto il suo annuncio per l\'immobile in [Zona].\n\nVirtualTwin sta aiutando le agenzie in zona a qualificare i lead automaticamente in 2 minuti. Le interesserebbe vedere come funziona?',
            icon: Target,
            sector: 'Real Estate'
        },
        {
            id: 't3',
            title: 'Scalabilità per Coach',
            target: 'Coach con molto traffico',
            text: 'Ciao [Nome],\n\nAmiamo i tuoi contenuti! Gestire tutti i DM deve essere un incubo per la scalabilità.\n\nVirtualTwin clona la tua voce e gestisce i prospect 24/7 per te. Ti mando un demo?',
            icon: Send,
            sector: 'Coach/Consulenti'
        },
        {
            id: 't4',
            title: 'Recupero Carrello VIP',
            target: 'Clienti E-commerce',
            text: 'Ciao [Nome], ho visto che avevi occhio su [Prodotto]! 💎\n\nSolo per oggi ti ho riservato un accesso prioritario. Vuoi che ti mandi il link riservato?\n\nIl tuo Digital Twin',
            icon: ShoppingBag,
            sector: 'E-commerce'
        },
        {
            id: 't5',
            title: 'Performance Outreach',
            target: 'Direttori Marketing',
            text: 'Ciao [Nome], ho visto la vostra campagna su [Canale]. Ottima, ma sento che potreste convertire il 30% in più senza aumentare il budget.\n\nHo un sistema che automatizza la chiusura dei lead in chat. Ti mostro i dati?\n\nMichael',
            icon: Briefcase,
            sector: 'Agenzie Marketing'
        },
        {
            id: 't6',
            title: 'Trial-to-Paid Blitz',
            target: 'Utenti in Trial SaaS',
            text: 'Ciao [Nome], spero che [App] ti stia aiutando con [Obiettivo]!\n\nHo notato che non hai ancora attivato [Feature X]. È quella che garantisce il ROI massimo. Vuoi una breve guida?\n\nDigital Assistant',
            icon: Cpu,
            sector: 'SaaS'
        },
        {
            id: 't7',
            title: 'Inquiry per Health',
            target: 'Pazienti/Clienti Fitness',
            text: 'Ciao [Nome], grazie per aver scaricato la guida! 💪\n\nPer darti il consiglio migliore: qual è il tuo obiettivo principale per i prossimi 90 giorni? Rispondi qui e ti dico il percorso migliore.\n\nIl tuo AI Coach',
            icon: HeartPulse,
            sector: 'Fitness/Salute'
        },
        {
            id: 't8',
            title: 'Headhunting Chirurgico',
            target: 'C-Level / Top Talent',
            text: 'Buongiorno [Nome], non sono un recruiter generico.\n\nSto curando una posizione imperiale in [Settore] e il suo profilo rispecchia la nostra visione. Un caffè virtuale di 10 minuti per i dettagli?\n\nSovereign Recruiting',
            icon: Users,
            sector: 'HR/Recruiting'
        },
        {
            id: 't9',
            title: 'Fiducia Assicurativa',
            target: 'Liberi Professionisti',
            text: 'Buongiorno [Nome], la maggior parte dei consulenti vende paura. Io proteggo la libertà.\n\nHo un report su come i cambiamenti di questo mese impattano [Settore]. Glielo invio senza impegni?',
            icon: Shield,
            sector: 'Assicurazioni'
        },
        {
            id: 't10',
            title: 'Test-Drive Experience',
            target: 'Lead Automobilistici',
            text: 'Ciao [Nome]! La nuova [Modello] è arrivata in showroom. 🏎️\n\nHo uno slot libero domani alle 15:00 per un\'esperienza di guida dedicata. Lo blocco a tuo nome?\n\nConcierge Digitale',
            icon: Car,
            sector: 'Automotive'
        },
        {
            id: 't11',
            title: 'Influencer Collab',
            target: 'Content Creators',
            text: 'Ciao [Nome], il tuo stile su [Post] è esattamente quello che cerchiamo per la nostra nuova capsule.\n\nNon il solito scambio merce. Ti mando la proposta commerciale?\n\nBrand Manager AI',
            icon: Sparkles,
            sector: 'Beauty/Fashion'
        },
        {
            id: 't12',
            title: 'Corporate Catering',
            target: 'Responsabili Eventi',
            text: 'Buongiorno [Nome], state pianificando l\'evento di [Mese]? 🍷\n\nAbbiamo un nuovo menu pensato per massimizzare il networking dei vostri ospiti. Vi mando il menu in anteprima?\n\nMaître Digitale',
            icon: Utensils,
            sector: 'Food & Beverage'
        },
        {
            id: 't13',
            title: 'Technical Scoping',
            target: 'CTO / Product Owners',
            text: 'Ciao [Nome], ho visto la vostra architettura su [GitHub/Tech Blog]. Interessante come gestite [Tecnologia].\n\nStiamo risolvendo [Problema] con un approccio nuovo. Vi interesserebbe un confronto tecnico?\n\nTech Lead AI',
            icon: Code,
            sector: 'Tech/Sviluppo'
        },
        {
            id: 't14',
            title: 'Commission Inquiry',
            target: 'Collezionisti d\'Arte',
            text: 'Buongiorno [Nome], ho visto che segue le opere di [Artista].\n\nAbbiamo una nuova selezione "Sovereign" in arrivo che non sarà pubblica. Vuole essere inserito nella lista privata?\n\nCuratore Virtuale',
            icon: Palette,
            sector: 'Arte/Design'
        },
        {
            id: 't15',
            title: 'Exclusive Travel VIP',
            target: 'High Net Worth Clients',
            text: 'Buongiorno [Nome], abbiamo sbloccato l\'accesso a una villa privata in [Destinazione] non presente sui cataloghi.\n\nSarebbe la soluzione ideale per il suo periodo di [Data]. Le mando il video tour riservato?\n\nElite Concierge',
            icon: Globe,
            sector: 'Viaggi/Luxury'
        }
    ];

    const filteredTemplates = templates.filter(t =>
        (t.sector === activeSector || activeSector === 'Generale') &&
        (t.title.toLowerCase().includes(templateSearch.toLowerCase()) ||
            t.text.toLowerCase().includes(templateSearch.toLowerCase()))
    );

    const roadmap = [
        {
            step: '01',
            title: 'Outreach LinkedIn',
            desc: 'Sfrutta algoritmi e script proprietari per connetterti con lead pronti all\'acquisto.',
            icon: Target,
            details: ['Targeting Chirurgico', 'Script ad Alta Conversione', 'Automazione Etica']
        },
        {
            step: '02',
            title: 'Demo Call d\'Elite',
            desc: 'Protocolli di conversione per trasformare lo scetticismo in autorità assoluta.',
            icon: MessageCircle,
            details: ['Script di Chiusura', 'Gestione Obiezioni', 'Ancoraggio del Valore']
        },
        {
            step: '03',
            title: 'Beta Test Expansion',
            desc: 'Scala l\'impero raccogliendo prove sociali e dominando la tua nicchia.',
            icon: Sparkles,
            details: ['Case Studies Asset', 'Referral Loop', 'Scalabilità Atomica']
        }
    ];

    const badges = [
        { id: 'b1', name: 'Genesis Pioniere', icon: Award, unlocked: (user?.level || 0) >= 1 },
        { id: 'b2', name: 'Master Prospector', icon: Target, unlocked: (user?.completed_video_ids?.length || 0) >= 3 },
        { id: 'b3', name: 'Sovereign Speaker', icon: MessageCircle, unlocked: (user?.level || 0) >= 5 },
        { id: 'b4', name: 'Empire Architect', icon: Cpu, unlocked: (user?.level || 0) >= 10 },
        { id: 'b5', name: 'Genesis Founder', icon: Crown, unlocked: user?.wave_id === 'genesis' },
        { id: 'b6', name: 'World Dominator', icon: Globe, unlocked: user?.plan_tier === 'imperatore' },
    ];

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
                        "Le armi segrete non si condividono, si dominano. Benvenuto nella tua Academy Élite, dove l'ambizione incontra l'automazione assoluta."
                    </motion.p>
                </div>
            </header>

            {/* Strategic Roadmap (Monumental Fusion) */}
            <div className="relative mb-32">
                <div className="text-center mb-16">
                    <span className="text-[10px] uppercase tracking-[0.5em] text-gold font-black mb-4 block">Strategic Roadmap</span>
                    <h2 className="text-4xl lg:text-5xl font-serif italic text-charcoal">Il Percorso verso la <span className="gold-text-gradient">Maestria</span></h2>
                </div>

                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-gold/10 hidden md:block -translate-y-1/2 z-0" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    {roadmap.map((item, i) => (
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

                            <div className="relative p-10 flex flex-col items-center text-center">
                                <span className="text-5xl font-serif italic text-gold/10 group-hover:text-gold/20 transition-colors duration-700 mb-6">
                                    {item.step}
                                </span>

                                <div className="w-20 h-20 bg-charcoal text-white rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border border-gold/20">
                                    <item.icon className="w-10 h-10 text-gold" />
                                </div>

                                <h3 className="text-2xl font-serif italic text-charcoal mb-4 group-hover:text-gold transition-colors duration-500">{item.title}</h3>
                                <p className="text-xs text-charcoal/50 leading-relaxed font-sans mb-8">
                                    {item.desc}
                                </p>

                                <div className="space-y-2 w-full">
                                    {item.details.map((detail, dIdx) => (
                                        <div key={dIdx} className="flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-widest text-charcoal/30">
                                            <div className="w-1 h-1 rounded-full bg-gold/40" />
                                            {detail}
                                        </div>
                                    ))}
                                </div>

                                <motion.div
                                    whileHover={{ x: 5 }}
                                    className="mt-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-gold cursor-pointer"
                                >
                                    Esplora Protocollo <ArrowRight className="w-3 h-3" />
                                </motion.div>
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
                                module.tier === 'solopreneur' ? 'bg-green-50 text-green-600 border-green-100' :
                                    'bg-gold/5 text-gold border-gold/20'
                                }`}>
                                Tier: {module.tier}
                            </div>
                        </div>

                        <ImperialGate
                            tier={module.tier as PlanTier}
                            waveId={module.waveId}
                            featureName={module.name}
                            className="space-y-8"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {module.videos.map((lesson) => {
                                    const isCompleted = user?.completed_video_ids?.includes(lesson.id);
                                    return (
                                        <div
                                            key={lesson.id}
                                            className={`bg-white rounded-[2.5rem] border border-charcoal/5 overflow-hidden group hover:shadow-2xl transition-all duration-700 ${isCompleted ? 'ring-1 ring-green-100' : ''}`}
                                        >
                                            <div className={`aspect-video ${lesson.thumbnail} flex items-center justify-center relative overflow-hidden shadow-inner`}>
                                                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/40 transition-colors duration-700" />

                                                {/* Founder Exclusive Badge */}
                                                {(mIndex >= 3) && (
                                                    <div className="absolute top-4 right-4 z-20 bg-gold/20 backdrop-blur-md border border-gold/30 px-3 py-1 rounded-full flex items-center gap-2">
                                                        <Sparkles className="w-3 h-3 text-gold" />
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-gold">Founder Exclusive</span>
                                                    </div>
                                                )}

                                                {isCompleted ? (
                                                    <div className="bg-green-500 rounded-full w-16 h-16 flex items-center justify-center text-white shadow-xl z-20">
                                                        <Check className="w-8 h-8" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setSelectedVideo(lesson)}
                                                        className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gold shadow-2xl group-hover:scale-110 group-hover:bg-white transition-all duration-700 z-10"
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
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                                                        <span className="text-[10px] text-charcoal/30 font-black uppercase tracking-[0.3em] font-sans">{lesson.xp} XP AWARD</span>
                                                    </div>
                                                </div>
                                                <h4 className="text-charcoal font-serif italic text-xl leading-tight group-hover:text-gold transition-colors">{lesson.title}</h4>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Imperial Badges Showcase (New) */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-4">
                                {badges.map((badge) => (
                                    <div
                                        key={badge.id}
                                        className={`p-6 rounded-[2rem] border flex flex-col items-center text-center transition-all duration-700 ${badge.unlocked
                                            ? 'bg-white border-gold/20 shadow-luxury-sm'
                                            : 'bg-charcoal/5 border-transparent opacity-40 filter grayscale'}`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 ${badge.unlocked ? 'bg-gold/10 text-gold' : 'bg-charcoal/10 text-charcoal/20'}`}>
                                            <badge.icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${badge.unlocked ? 'text-gold' : 'text-charcoal/20'}`}>
                                            {badge.name}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Module Progress Footer / Quiz Trigger */}
                            <div className="flex items-center justify-between p-8 bg-charcoal/[0.02] border border-charcoal/5 rounded-[2rem] shadow-inner">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gold shadow-luxury-sm">
                                        <Award className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] text-charcoal/40 font-black uppercase tracking-widest">Validazione Competenze</h4>
                                        <p className="text-sm font-serif italic text-charcoal">Completa il quiz per sbloccare il badge del modulo.</p>
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setActiveQuiz({ moduleId: module.tier, moduleName: module.name, questions: (module as any).quizQuestions || [] })}
                                    className={`px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${user?.quizzes_passed?.[module.tier]
                                        ? 'bg-green-50 text-green-600 border border-green-100 cursor-default'
                                        : 'bg-white text-charcoal shadow-luxury-sm hover:bg-charcoal hover:text-white border border-charcoal/5'
                                        }`}
                                >
                                    {user?.quizzes_passed?.[module.tier] ? 'Modulo Convalidato ✓' : 'Inizia Quiz Modulo'}
                                </motion.button>
                            </div>
                        </ImperialGate>
                    </div>
                ))}
            </div>

            {/* Template Section with Gating */}
            <div className="flex flex-col gap-8 mb-16">
                <div className="flex flex-col lg:flex-row items-end justify-between gap-6">
                    <div className="max-w-xl">
                        <h2 className="text-3xl lg:text-4xl font-serif text-charcoal italic tracking-tight mb-4">Script di Vendita & <span className="gold-text-gradient">Outreach</span></h2>
                        <div className="relative group">
                            <Send className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/20 group-hover:text-gold transition-colors" />
                            <input
                                type="text"
                                placeholder="Cerca negli script imperiali..."
                                value={templateSearch}
                                onChange={(e) => setTemplateSearch(e.target.value)}
                                className="w-full pl-16 pr-8 py-4 bg-white/60 backdrop-blur-md border border-charcoal/5 rounded-[1.5rem] text-[10px] font-bold tracking-widest uppercase focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all shadow-luxury-sm"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
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

                <ImperialGate tier="solopreneur" featureName="Asset di Outreach" description="Sblocca l'accesso a oltre 50 template di outreach e script di vendita pronti all'uso con il piano Solopreneur." className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
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
