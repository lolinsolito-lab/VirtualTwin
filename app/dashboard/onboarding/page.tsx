'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import {
    Sparkles, Building2, Brain, MessageSquare, Trophy,
    ArrowRight, ArrowLeft, Check, Loader2, Crown,
    Gift, Lock, Phone, Instagram, MessageCircle
} from 'lucide-react';

// =============================================
// ONBOARDING WIZARD - 5 STEP FLOW
// =============================================

const STEPS = [
    { id: 1, title: 'Benvenuto', icon: Sparkles },
    { id: 2, title: 'Profilo', icon: Building2 },
    { id: 3, title: 'Addestra AI', icon: Brain },
    { id: 4, title: 'Canali', icon: MessageSquare },
    { id: 5, title: 'Completo!', icon: Trophy },
];

// =============================================
// STEP 1: WELCOME (DYNAMIC BASED ON TIER)
// =============================================
interface UserTierInfo {
    tier: string;
    isFounder: boolean;
    price: string;
    badge: string;
    badgeColor: string;
    subtitle: string;
    benefits: { icon: any; text: string }[];
}

const getTierInfo = (tier: string, isFounder: boolean): UserTierInfo => {
    // Founder users (any tier with is_founder = true)
    if (isFounder) {
        return {
            tier,
            isFounder: true,
            price: '€147/mese',
            badge: 'GENESIS FOUNDER',
            badgeColor: 'bg-gold/10 text-gold',
            subtitle: 'Hai bloccato il prezzo Founder per sempre. Configuriamo il tuo clone AI in 5 minuti.',
            benefits: [
                { icon: Lock, text: '€147/mese bloccato LIFETIME' },
                { icon: Sparkles, text: 'Clone AI personalizzato' },
                { icon: Gift, text: 'Accesso Genesis esclusivo' },
            ]
        };
    }

    // Free tier (curioso)
    if (tier === 'curioso' || !tier) {
        return {
            tier: 'curioso',
            isFounder: false,
            price: 'Gratis',
            badge: 'PROVA GRATUITA',
            badgeColor: 'bg-emerald-100 text-emerald-600',
            subtitle: 'Inizia la tua prova gratuita di 14 giorni. Configuriamo il tuo clone AI!',
            benefits: [
                { icon: Gift, text: '14 giorni di prova gratuita' },
                { icon: Sparkles, text: 'Clone AI personalizzato' },
                { icon: MessageSquare, text: '100 messaggi/mese' },
            ]
        };
    }

    // Public paid tiers
    const tierNames: Record<string, string> = {
        'esploratore': 'Esploratore',
        'pioniere': 'Pioniere',
        'conquistatore': 'Conquistatore',
        'imperatore': 'Imperatore'
    };

    return {
        tier,
        isFounder: false,
        price: '',
        badge: tierNames[tier] || tier.toUpperCase(),
        badgeColor: 'bg-charcoal/10 text-charcoal',
        subtitle: 'Benvenuto! Configuriamo il tuo clone AI in 5 minuti.',
        benefits: [
            { icon: Sparkles, text: 'Clone AI personalizzato' },
            { icon: MessageSquare, text: 'Risposte automatiche 24/7' },
            { icon: Gift, text: 'Supporto prioritario' },
        ]
    };
};

function StepWelcome({ onNext, tierInfo }: { onNext: (data: any) => void; tierInfo: UserTierInfo }) {
    return (
        <div className="text-center">
            {/* Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 ${tierInfo.badgeColor}`}>
                <Crown className="w-4 h-4" />
                <span className="font-bold text-sm">{tierInfo.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif italic text-charcoal mb-6">
                Benvenuto nel <span className="gold-text-gradient">Futuro</span>
            </h1>

            {/* Subtitle */}
            <p className="text-charcoal/60 text-lg mb-10 max-w-md mx-auto">
                {tierInfo.subtitle}
            </p>

            {/* Benefits */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                {tierInfo.benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white rounded-xl border border-charcoal/5">
                        <benefit.icon className="w-5 h-5 text-gold" />
                        <span className="text-sm text-charcoal">{benefit.text}</span>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <button
                onClick={() => onNext({})}
                className="gold-gradient px-10 py-4 rounded-full text-white font-bold flex items-center gap-3 mx-auto hover:scale-105 transition-all shadow-lg"
            >
                Iniziamo
                <ArrowRight className="w-5 h-5" />
            </button>
        </div>
    );
}

// =============================================
// STEP 2: BUSINESS PROFILE
// =============================================
function StepBusinessProfile({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
    const [formData, setFormData] = useState({
        businessName: '',
        sector: '',
        targetClient: '',
        tone: 'professionale'
    });

    const sectors = [
        'Coach / Consulente',
        'Agenzia Marketing',
        'E-commerce',
        'Immobiliare',
        'Fitness / Wellness',
        'Formazione',
        'Altro'
    ];

    const tones = [
        { id: 'professionale', label: 'Professionale', emoji: '👔' },
        { id: 'amichevole', label: 'Amichevole', emoji: '😊' },
        { id: 'diretto', label: 'Diretto', emoji: '⚡' },
        { id: 'luxury', label: 'Luxury', emoji: '✨' },
    ];

    const isValid = formData.businessName && formData.sector;

    return (
        <div>
            <h2 className="text-3xl font-serif italic text-charcoal mb-4 text-center">
                Il Tuo <span className="gold-text-gradient">Business</span>
            </h2>

            <p className="text-charcoal/60 text-center mb-8">
                Aiutaci a personalizzare il tuo clone AI.
            </p>

            <div className="space-y-6 max-w-md mx-auto">
                {/* Business Name */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                        Nome Business / Brand
                    </label>
                    <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
                        placeholder="Es. Studio Marco Rossi"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/10 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    />
                </div>

                {/* Sector */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                        Settore
                    </label>
                    <select
                        value={formData.sector}
                        onChange={(e) => setFormData(prev => ({ ...prev, sector: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/10 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    >
                        <option value="">Seleziona settore...</option>
                        {sectors.map(s => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                {/* Target Client */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                        Cliente Ideale (opzionale)
                    </label>
                    <input
                        type="text"
                        value={formData.targetClient}
                        onChange={(e) => setFormData(prev => ({ ...prev, targetClient: e.target.value }))}
                        placeholder="Es. Imprenditori 35-55 anni"
                        className="w-full px-4 py-3 rounded-xl border border-charcoal/10 focus:border-gold focus:ring-2 focus:ring-gold/20 outline-none transition-all"
                    />
                </div>

                {/* Tone */}
                <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                        Tono del Clone
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {tones.map(t => (
                            <button
                                key={t.id}
                                onClick={() => setFormData(prev => ({ ...prev, tone: t.id }))}
                                className={`p-3 rounded-xl border text-left transition-all ${formData.tone === t.id
                                    ? 'border-gold bg-gold/5'
                                    : 'border-charcoal/10 hover:border-gold/50'
                                    }`}
                            >
                                <span className="text-lg mr-2">{t.emoji}</span>
                                <span className="text-sm font-medium">{t.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10 max-w-md mx-auto">
                <button onClick={onBack} className="text-charcoal/50 hover:text-charcoal transition-colors">
                    ← Indietro
                </button>
                <button
                    onClick={() => onNext(formData)}
                    disabled={!isValid}
                    className="gold-gradient px-8 py-3 rounded-full text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
                >
                    Continua →
                </button>
            </div>
        </div>
    );
}

// =============================================
// STEP 3: TRAIN AI (WITH SMART PRE-FILL)
// =============================================

// Sector-specific FAQ templates
const SECTOR_FAQS: Record<string, { question: string; answer: string }[]> = {
    'Coach / Consulente': [
        { question: 'Quanto costa una sessione di coaching?', answer: 'Il mio percorso di coaching parte da €X per sessione singola, oppure €Y per un pacchetto di 4 sessioni.' },
        { question: 'Come posso prenotare una call conoscitiva?', answer: 'Puoi prenotare una call gratuita di 15 minuti direttamente dal mio calendario online: [link]' },
        { question: 'Che risultati posso aspettarmi?', answer: 'I miei clienti in media ottengono [risultato specifico] entro le prime 4-6 settimane di percorso.' },
    ],
    'Agenzia Marketing': [
        { question: 'Quali servizi offrite?', answer: 'Offriamo servizi di social media management, paid advertising, SEO, content marketing e brand strategy.' },
        { question: 'Quanto costa una campagna pubblicitaria?', answer: 'Il budget minimo che consigliamo per campagne efficaci parte da €X/mese, più il nostro fee di gestione.' },
        { question: 'Quanto tempo ci vuole per vedere risultati?', answer: 'I primi risultati sono visibili entro 30-60 giorni, con ottimizzazione continua per massimizzare il ROI.' },
    ],
    'E-commerce': [
        { question: 'Quali sono i tempi di spedizione?', answer: 'Spediamo in 24-48h lavorative. La consegna avviene in 3-5 giorni lavorativi in Italia.' },
        { question: 'Posso fare un reso?', answer: 'Sì, hai 14 giorni dalla ricezione per richiedere un reso gratuito. Il prodotto deve essere integro e non usato.' },
        { question: 'Accettate pagamenti rateali?', answer: 'Sì, offriamo pagamenti in 3 rate senza interessi con Klarna/Scalapay per ordini sopra €X.' },
    ],
    'Immobiliare': [
        { question: 'Come posso vedere un immobile?', answer: 'Puoi prenotare una visita gratuita contattandomi. Sono disponibile anche in orari serali e weekend.' },
        { question: 'Offrite servizi di valutazione gratuita?', answer: 'Sì, offro valutazioni immobiliari gratuite e senza impegno. Contattami per fissare un appuntamento.' },
        { question: 'Quali zone coprite?', answer: 'Operiamo principalmente nella zona di [città/provincia], ma possiamo valutare immobili anche in aree limitrofe.' },
    ],
    'Fitness / Wellness': [
        { question: 'Offrite sessioni di prova?', answer: 'Sì, la prima sessione è gratuita per farti conoscere il mio metodo di allenamento.' },
        { question: 'Fate anche programmi online?', answer: 'Sì, offro programmi di allenamento personalizzati 100% online con video-call settimanali di follow-up.' },
        { question: 'Quanto dura un percorso tipico?', answer: 'I percorsi vanno da 4 a 12 settimane, in base ai tuoi obiettivi specifici.' },
    ],
    'Formazione': [
        { question: 'Rilasciate certificazioni?', answer: 'Sì, al termine del corso riceverai un certificato di completamento riconosciuto.' },
        { question: 'I corsi sono accessibili per sempre?', answer: 'Sì, una volta acquistato il corso hai accesso illimitato a tutti i materiali e aggiornamenti futuri.' },
        { question: 'Offrite supporto durante il corso?', answer: 'Sì, hai accesso al gruppo privato e alle sessioni Q&A settimanali con me.' },
    ],
    'Altro': [
        { question: '', answer: '' },
        { question: '', answer: '' },
        { question: '', answer: '' },
    ],
};

function StepTrainAI({ onNext, onBack, sector }: { onNext: (data: any) => void; onBack: () => void; sector?: string }) {
    // Pre-fill FAQs based on sector
    const sectorFaqs = SECTOR_FAQS[sector || 'Altro'] || SECTOR_FAQS['Altro'];

    const [faqs, setFaqs] = useState(sectorFaqs);

    // Update FAQs when sector changes (if user goes back and changes)
    useEffect(() => {
        const newFaqs = SECTOR_FAQS[sector || 'Altro'] || SECTOR_FAQS['Altro'];
        // Only update if FAQs haven't been modified by user
        setFaqs(prev => {
            const isEmpty = prev.every(f => !f.question && !f.answer);
            return isEmpty ? newFaqs : prev;
        });
    }, [sector]);

    const updateFaq = (index: number, field: 'question' | 'answer', value: string) => {
        setFaqs(prev => prev.map((faq, i) =>
            i === index ? { ...faq, [field]: value } : faq
        ));
    };

    return (
        <div>
            <h2 className="text-3xl font-serif italic text-charcoal mb-4 text-center">
                Addestra il Tuo <span className="gold-text-gradient">Clone</span>
            </h2>

            <p className="text-charcoal/60 text-center mb-2">
                Inserisci le domande più frequenti che ricevi. Il clone risponderà come te.
            </p>

            {sector && sector !== 'Altro' && (
                <p className="text-center text-gold text-sm mb-6">
                    ✨ Abbiamo pre-compilato esempi per <strong>{sector}</strong> - personalizzali!
                </p>
            )}

            <div className="space-y-6 max-w-lg mx-auto">
                {faqs.map((faq, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-charcoal/10">
                        <div className="mb-3">
                            <label className="block text-xs font-medium text-charcoal/50 mb-1">
                                Domanda #{i + 1}
                            </label>
                            <input
                                type="text"
                                value={faq.question}
                                onChange={(e) => updateFaq(i, 'question', e.target.value)}
                                placeholder="Es. Quanto costa il tuo servizio?"
                                className="w-full px-3 py-2 rounded-lg border border-charcoal/10 text-sm focus:border-gold outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-charcoal/50 mb-1">
                                La tua risposta tipica
                            </label>
                            <textarea
                                value={faq.answer}
                                onChange={(e) => updateFaq(i, 'answer', e.target.value)}
                                placeholder="Come rispondi di solito a questa domanda..."
                                rows={2}
                                className="w-full px-3 py-2 rounded-lg border border-charcoal/10 text-sm focus:border-gold outline-none resize-none"
                            />
                        </div>
                    </div>
                ))}

                <p className="text-center text-charcoal/40 text-sm">
                    💡 Potrai aggiungerne altre in seguito dalle Impostazioni
                </p>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-10 max-w-lg mx-auto">
                <button onClick={onBack} className="text-charcoal/50 hover:text-charcoal transition-colors">
                    ← Indietro
                </button>
                <button
                    onClick={() => onNext({ faqs: faqs.filter(f => f.question && f.answer) })}
                    className="gold-gradient px-8 py-3 rounded-full text-white font-bold hover:scale-105 transition-all"
                >
                    Continua →
                </button>
            </div>
        </div>
    );
}

// =============================================
// STEP 4: CONNECT CHANNELS
// =============================================
function StepConnectChannels({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
    const [connecting, setConnecting] = useState<string | null>(null);
    const [connected, setConnected] = useState<string[]>([]);

    const channels = [
        { id: 'whatsapp', name: 'WhatsApp Business', icon: Phone, color: 'bg-green-500', available: true },
        { id: 'instagram', name: 'Instagram DM', icon: Instagram, color: 'bg-pink-500', available: false },
        { id: 'messenger', name: 'Messenger', icon: MessageCircle, color: 'bg-blue-500', available: false },
    ];

    const handleConnect = async (channelId: string) => {
        if (channelId !== 'whatsapp') {
            alert('Instagram e Messenger saranno disponibili nella prossima settimana!');
            return;
        }

        setConnecting(channelId);

        // TODO: Implementare flow reale di connessione WhatsApp
        // Per ora simuliamo
        await new Promise(r => setTimeout(r, 2000));

        setConnected(prev => [...prev, channelId]);
        setConnecting(null);
    };

    return (
        <div>
            <h2 className="text-3xl font-serif italic text-charcoal mb-4 text-center">
                Connetti i <span className="gold-text-gradient">Canali</span>
            </h2>

            <p className="text-charcoal/60 text-center mb-8">
                Il tuo clone risponderà automaticamente su questi canali.
            </p>

            <div className="space-y-4 max-w-md mx-auto mb-8">
                {channels.map((channel) => (
                    <div
                        key={channel.id}
                        className={`flex items-center justify-between p-4 bg-white rounded-2xl border transition-all ${connected.includes(channel.id)
                            ? 'border-green-400'
                            : 'border-charcoal/10'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${channel.color}`}>
                                <channel.icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-charcoal">{channel.name}</h3>
                                <p className="text-sm text-charcoal/50">
                                    {connected.includes(channel.id)
                                        ? '✅ Connesso'
                                        : channel.available
                                            ? 'Non connesso'
                                            : '🔜 Prossimamente'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => handleConnect(channel.id)}
                            disabled={connecting === channel.id || connected.includes(channel.id) || !channel.available}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${connected.includes(channel.id)
                                ? 'bg-green-100 text-green-600'
                                : channel.available
                                    ? 'bg-charcoal text-white hover:bg-gold'
                                    : 'bg-charcoal/10 text-charcoal/40 cursor-not-allowed'
                                }`}
                        >
                            {connecting === channel.id ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : connected.includes(channel.id) ? (
                                <Check className="w-4 h-4" />
                            ) : channel.available ? (
                                'Connetti'
                            ) : (
                                'Soon'
                            )}
                        </button>
                    </div>
                ))}
            </div>

            <p className="text-center text-charcoal/40 text-sm mb-8">
                💡 Puoi sempre aggiungere altri canali dalle Impostazioni
            </p>

            {/* Navigation */}
            <div className="flex justify-between max-w-md mx-auto">
                <button onClick={onBack} className="text-charcoal/50 hover:text-charcoal transition-colors">
                    ← Indietro
                </button>
                <button
                    onClick={() => onNext({ channels: connected })}
                    className="gold-gradient px-8 py-3 rounded-full text-white font-bold hover:scale-105 transition-all"
                >
                    {connected.length > 0 ? 'Continua →' : 'Salta per ora →'}
                </button>
            </div>
        </div>
    );
}

// =============================================
// STEP 5: COMPLETION
// =============================================
function StepComplete({ onFinish, loading }: { onFinish: () => void; loading: boolean }) {
    return (
        <div className="text-center">
            {/* Badge */}
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-gold to-yellow-500 flex items-center justify-center shadow-xl">
                <Trophy className="w-12 h-12 text-white" />
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif italic text-charcoal mb-6">
                <span className="gold-text-gradient">Perfetto!</span>
            </h1>

            {/* Subtitle */}
            <p className="text-charcoal/60 text-lg mb-10 max-w-md mx-auto">
                Il tuo clone AI è pronto. Inizia a ricevere i tuoi primi lead automatici!
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
                {[
                    { value: '24/7', label: 'Disponibilità' },
                    { value: '<2s', label: 'Tempo risposta' },
                    { value: '∞', label: 'Lead gestibili' },
                ].map((stat, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl border border-charcoal/5">
                        <div className="text-2xl font-bold gold-text-gradient">{stat.value}</div>
                        <div className="text-xs text-charcoal/50">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <button
                onClick={onFinish}
                disabled={loading}
                className="gold-gradient px-10 py-4 rounded-full text-white font-bold flex items-center gap-3 mx-auto hover:scale-105 transition-all shadow-lg disabled:opacity-70"
            >
                {loading ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Salvataggio...
                    </>
                ) : (
                    <>
                        Vai alla Dashboard
                        <ArrowRight className="w-5 h-5" />
                    </>
                )}
            </button>
        </div>
    );
}

// =============================================
// MAIN ONBOARDING PAGE
// =============================================
export default function OnboardingPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(false);
    const [tierInfo, setTierInfo] = useState<UserTierInfo>(getTierInfo('curioso', false));
    const [loadingTier, setLoadingTier] = useState(true);
    const router = useRouter();

    // Fetch user tier on mount
    useEffect(() => {
        async function fetchUserTier() {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (user) {
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('subscription_tier, is_founder')
                        .eq('id', user.id)
                        .single();

                    if (profile) {
                        setTierInfo(getTierInfo(
                            profile.subscription_tier || 'curioso',
                            profile.is_founder || false
                        ));
                    }
                }
            } catch (error) {
                console.error('Error fetching user tier:', error);
            } finally {
                setLoadingTier(false);
            }
        }

        fetchUserTier();
    }, []);

    const handleNext = (stepData: any) => {
        setFormData((prev: any) => ({ ...prev, ...stepData }));
        setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleFinish = async () => {
        setLoading(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();

            if (user) {
                // Save onboarding data to profile
                await supabase
                    .from('profiles')
                    .update({
                        business_name: formData.businessName,
                        business_sector: formData.sector,
                        target_client: formData.targetClient,
                        ai_tone: formData.tone,
                        onboarding_completed: true,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);

                // Save FAQs if any
                if (formData.faqs?.length > 0) {
                    const faqInserts = formData.faqs.map((faq: any) => ({
                        user_id: user.id,
                        question: faq.question,
                        answer: faq.answer
                    }));

                    await supabase
                        .from('clone_faqs')
                        .insert(faqInserts);
                }
            }

            // Redirect to dashboard
            router.push('/dashboard?onboarding=complete');

        } catch (error) {
            console.error('Onboarding save error:', error);
            alert('Errore nel salvataggio. Riprova.');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        // Show loading while fetching tier
        if (loadingTier && currentStep === 1) {
            return (
                <div className="text-center">
                    <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto mb-4" />
                    <p className="text-charcoal/60">Caricamento...</p>
                </div>
            );
        }

        switch (currentStep) {
            case 1:
                return <StepWelcome onNext={handleNext} tierInfo={tierInfo} />;
            case 2:
                return <StepBusinessProfile onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <StepTrainAI onNext={handleNext} onBack={handleBack} sector={formData.sector} />;
            case 4:
                return <StepConnectChannels onNext={handleNext} onBack={handleBack} />;
            case 5:
                return <StepComplete onFinish={handleFinish} loading={loading} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-champagne flex flex-col">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-charcoal/10 z-50">
                <div
                    className="h-full bg-gold transition-all duration-500"
                    style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                />
            </div>

            {/* Step Indicators */}
            <div className="flex justify-center gap-6 py-8 px-4">
                {STEPS.map((step) => (
                    <div
                        key={step.id}
                        className={`flex items-center gap-2 transition-all ${currentStep >= step.id ? 'text-gold' : 'text-charcoal/30'
                            }`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${currentStep > step.id
                            ? 'bg-gold text-white'
                            : currentStep === step.id
                                ? 'bg-gold/20 text-gold'
                                : 'bg-charcoal/5'
                            }`}>
                            {currentStep > step.id ? (
                                <Check className="w-4 h-4" />
                            ) : (
                                <step.icon className="w-4 h-4" />
                            )}
                        </div>
                        <span className="hidden md:inline text-sm font-medium">
                            {step.title}
                        </span>
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div className="flex-1 flex items-center justify-center px-6 pb-20">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full max-w-2xl"
                    >
                        {renderStep()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
