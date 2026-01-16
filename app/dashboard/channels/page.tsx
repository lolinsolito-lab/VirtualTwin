"use client";

import React, { useState, useEffect } from 'react';
import {
    MessageCircle,
    Instagram,
    Facebook,
    Check,
    X,
    ExternalLink,
    Settings,
    Zap,
    Loader2,
    Copy,
    CheckCircle,
    ArrowRight,
    HelpCircle,
    Eye,
    EyeOff,
    AlertTriangle,
    Shield,
    Activity,
    Send,
    Globe,
    Linkedin,
    Music
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSovereign } from '@/components/providers/SovereignProvider';
import { PLAN_LIMITS } from '@/lib/pricing';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Channel {
    id: string;
    user_id: string;
    channel_type: 'whatsapp' | 'instagram' | 'messenger';
    is_active: boolean;
    api_key?: string;
    phone_number?: string;
    page_id?: string;
}

// =============================================
// CHANNEL CONFIGURATION
// =============================================
const channelConfig = {
    whatsapp: {
        name: 'WhatsApp Business',
        icon: MessageCircle,
        color: 'bg-green-500',
        description: 'Rispondi automaticamente ai messaggi WhatsApp',
        provider: '360Dialog',
        webhookPath: '/api/whatsapp/webhook',
        comingSoon: false,
        steps: [
            {
                title: 'Crea account 360Dialog',
                description: '1. Vai su 360dialog.com/pricing\n2. Clicca "Get Started" (piano gratuito disponibile)\n3. Completa la registrazione con email e telefono\n4. Connetti il tuo WhatsApp Business',
                link: 'https://www.360dialog.com/pricing',
                linkText: 'Vai a 360Dialog →'
            },
            {
                title: 'Ottieni le credenziali API',
                description: 'Nel pannello 360Dialog:\n1. Vai su "WABA" nella sidebar\n2. Clicca "API Keys"\n3. Genera una nuova API key\n4. Copia anche il WABA ID e Phone Number ID dalla stessa pagina',
                tip: 'Salva queste 3 credenziali in un posto sicuro: API Key, WABA ID, Phone Number ID'
            },
            {
                title: 'Configura il Webhook',
                description: 'Nel pannello 360Dialog:\n1. Vai su "WABA" → "Webhooks"\n2. Clicca "Add Webhook"\n3. Incolla l\'URL qui sotto\n4. Imposta Verify Token: virtualtwin_sovereign\n5. Clicca "Save"',
                webhookUrl: true
            },
            {
                title: 'Inserisci le credenziali',
                description: 'Incolla le 3 credenziali che hai copiato dallo Step 2. Clicca "Attiva Canale" per completare.',
                isInput: true
            }
        ]
    },
    instagram: {
        name: 'Instagram Direct',
        icon: Instagram,
        color: 'bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400',
        description: 'Gestisci i DM Instagram con l\'AI',
        provider: 'Meta Graph API',
        webhookPath: '/api/instagram/webhook',
        comingSoon: true,
        steps: []
    },
    messenger: {
        name: 'Facebook Messenger',
        icon: Facebook,
        color: 'bg-blue-600',
        description: 'Automatizza le conversazioni Messenger',
        provider: 'Meta Graph API',
        webhookPath: '/api/messenger/webhook',
        comingSoon: true,
        steps: []
    },
    telegram: {
        name: 'Telegram Bot',
        icon: Send,
        color: 'bg-sky-500',
        description: 'Connetti il tuo bot Telegram per assistenze rapide',
        provider: 'Telegram Bot API',
        webhookPath: '/api/telegram/webhook',
        comingSoon: true,
        imperialOnly: true,
        steps: []
    },
    webchat: {
        name: 'Webchat Integrata',
        icon: Globe,
        color: 'bg-gold',
        description: 'Widget AI avanzato da integrare nel tuo sito',
        provider: 'VirtualTwin Native',
        webhookPath: '/api/webchat/webhook',
        comingSoon: true,
        imperialOnly: true,
        steps: []
    },
    linkedin: {
        name: 'LinkedIn Direct',
        icon: Linkedin,
        color: 'bg-[#0077b5]',
        description: 'Espandi il tuo network con messaggi AI su LinkedIn',
        provider: 'LinkedIn API',
        webhookPath: '/api/linkedin/webhook',
        comingSoon: true,
        imperialOnly: true,
        steps: []
    },
    tiktok: {
        name: 'TikTok Messages',
        icon: Music,
        color: 'bg-black',
        description: 'Interagisci con la tua audience su TikTok',
        provider: 'TikTok Shop API',
        webhookPath: '/api/tiktok/webhook',
        comingSoon: true,
        imperialOnly: true,
        steps: []
    }
};

// =============================================
// CONNECTION MODAL COMPONENT
// =============================================
interface ConnectionModalProps {
    channel: keyof typeof channelConfig;
    onClose: () => void;
    onSuccess: () => void;
}

function ConnectionModal({ channel, onClose, onSuccess }: ConnectionModalProps) {
    const config = channelConfig[channel];
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        apiKey: '',
        wabaId: '',
        phoneNumberId: '',
        webhookSecret: 'virtualtwin_sovereign'
    });
    const [showApiKey, setShowApiKey] = useState(false);
    const [connecting, setConnecting] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const webhookUrl = typeof window !== 'undefined'
        ? `${window.location.origin}${config.webhookPath}`
        : `https://virtualtwin.vercel.app${config.webhookPath}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConnect = async () => {
        setError('');
        setConnecting(true);

        try {
            // Validate inputs
            if (!formData.apiKey || !formData.wabaId || !formData.phoneNumberId) {
                throw new Error('Compila tutti i campi richiesti');
            }

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Non autenticato');

            // Get or create user's clone (needed for channel FK)
            let cloneId: string | null = null;
            const { data: clones } = await supabase
                .from('clones')
                .select('id')
                .eq('user_id', user.id)
                .limit(1);

            if (clones && clones.length > 0) {
                cloneId = clones[0].id;
            } else {
                // Create default clone
                const { data: newClone } = await supabase
                    .from('clones')
                    .insert({
                        user_id: user.id,
                        name: 'Clone Principale',
                        personality: 'professionale'
                    })
                    .select('id')
                    .single();

                if (newClone) cloneId = newClone.id;
            }

            // Check if channel already exists
            const { data: existing } = await supabase
                .from('channels')
                .select('id')
                .eq('user_id', user.id)
                .eq('channel_type', channel)
                .single();

            if (existing) {
                // Update existing
                await supabase
                    .from('channels')
                    .update({
                        is_active: true,
                        api_key: formData.apiKey,
                        phone_number: formData.phoneNumberId,
                        page_id: formData.wabaId,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', existing.id);
            } else {
                // Insert new
                await supabase
                    .from('channels')
                    .insert({
                        user_id: user.id,
                        clone_id: cloneId,
                        channel_type: channel,
                        is_active: true,
                        api_key: formData.apiKey,
                        phone_number: formData.phoneNumberId,
                        page_id: formData.wabaId
                    });
            }

            // Success!
            onSuccess();

        } catch (err: any) {
            setError(err.message || 'Errore durante la connessione');
        } finally {
            setConnecting(false);
        }
    };

    const step = config.steps[currentStep];
    const isLastStep = currentStep === config.steps.length - 1;

    return (
        <div className="fixed inset-0 bg-charcoal/40 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-luxury border border-white/60 relative">
                {/* Decorative background element */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-gold/5 blur-[100px] rounded-full pointer-events-none" />

                {/* Header */}
                <div className="p-10 border-b border-charcoal/5 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-6">
                        <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center text-white shadow-luxury`}>
                            <config.icon className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl md:text-2xl font-serif italic text-charcoal tracking-tight">Connetti {config.name}</h2>
                            <p className="text-charcoal/30 text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] font-black mt-1">Provider: {config.provider}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 bg-charcoal/5 hover:bg-charcoal text-charcoal/30 hover:text-white rounded-full flex items-center justify-center transition-all">
                        <X className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </div>

                {/* Progress - Sovereign Visual */}
                <div className="px-10 py-8 border-b border-charcoal/5 bg-charcoal/[0.02]">
                    <div className="flex items-center gap-4">
                        {config.steps.map((_, i) => (
                            <div key={i} className="flex items-center gap-4 flex-1">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-700 ${i < currentStep
                                    ? 'bg-green-500 text-white shadow-luxury'
                                    : i === currentStep
                                        ? 'bg-gold text-white shadow-luxury-sm scale-110'
                                        : 'bg-white border border-charcoal/10 text-charcoal/30'
                                    }`}>
                                    {i < currentStep ? <Check className="w-5 h-5" /> : i + 1}
                                </div>
                                {i < config.steps.length - 1 && (
                                    <div className={`h-[1px] flex-1 rounded-full transition-all duration-1000 ${i < currentStep ? 'bg-green-500' : 'bg-charcoal/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="p-6 md:p-12">
                    <div className="mb-6 md:mb-10">
                        <p className="text-gold text-[8px] md:text-[9px] uppercase tracking-[0.3em] md:tracking-[0.4em] font-black mb-3 md:mb-4">Step {currentStep + 1} di {config.steps.length}</p>
                        <h3 className="text-2xl md:text-3xl font-serif italic text-charcoal mb-3 md:mb-4 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-charcoal/50 text-sm md:text-base leading-relaxed whitespace-pre-line">{step.description}</p>
                    </div>

                    {/* External Link */}
                    {step.link && (
                        <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 bg-charcoal text-white rounded-xl md:rounded-2xl font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] hover:bg-gold transition-all shadow-luxury mb-8 md:mb-10"
                        >
                            <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            {step.linkText}
                        </a>
                    )}

                    {/* Tip */}
                    {step.tip && (
                        <div className="p-5 md:p-6 bg-gold/[0.03] border border-gold/20 rounded-[1.5rem] md:rounded-[2rem] mb-8 md:mb-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 blur-xl group-hover:bg-gold/10 transition-colors" />
                            <div className="flex items-start gap-3 md:gap-4">
                                <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-gold flex-shrink-0 mt-0.5" />
                                <p className="text-charcoal/60 text-xs md:text-sm italic leading-relaxed">{step.tip}</p>
                            </div>
                        </div>
                    )}

                    {/* Webhook URL */}
                    {step.webhookUrl && (
                        <div className="mb-8 md:mb-10">
                            <label className="block text-[8px] md:text-[9px] uppercase tracking-[0.2em] md:tracking-[0.3em] text-charcoal/40 font-black mb-2 md:mb-3 italic">
                                Webhook URL
                            </label>
                            <div className="flex items-center gap-2 md:gap-3">
                                <code className="flex-1 px-4 md:px-6 py-3 md:py-4 bg-white border border-charcoal/5 rounded-xl md:rounded-2xl text-[9px] md:text-[11px] font-mono text-charcoal overflow-x-auto shadow-sm">
                                    {webhookUrl}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(webhookUrl)}
                                    className="p-3 md:p-4 bg-gold/10 text-gold rounded-xl md:rounded-2xl hover:bg-gold hover:text-white transition-all border border-gold/10 shadow-sm"
                                >
                                    {copied ? <CheckCircle className="w-4 h-4 md:w-5 md:h-5" /> : <Copy className="w-4 h-4 md:w-5 md:h-5" />}
                                </button>
                            </div>
                            <p className="text-charcoal/30 text-[7px] md:text-[8px] mt-3 font-bold uppercase tracking-[0.2em]">
                                Verification Token: <span className="text-gold">virtualtwin_sovereign</span>
                            </p>
                        </div>
                    )}

                    {/* Input Form */}
                    {step.isInput && (
                        <div className="space-y-6">
                            {/* API Key */}
                            <div>
                                <label className="block text-[9px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">
                                    API Key *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? 'text' : 'password'}
                                        value={formData.apiKey}
                                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                        placeholder="Incolla la tua API key di 360Dialog"
                                        className="w-full px-6 py-4 bg-white border border-charcoal/10 rounded-2xl focus:border-gold outline-none pr-14 text-sm font-medium shadow-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal/20 hover:text-gold transition-colors"
                                    >
                                        {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {/* WABA ID */}
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">
                                        WABA ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.wabaId}
                                        onChange={(e) => setFormData({ ...formData, wabaId: e.target.value })}
                                        placeholder="ID Account"
                                        className="w-full px-6 py-4 bg-white border border-charcoal/10 rounded-2xl focus:border-gold outline-none text-sm font-medium shadow-sm"
                                    />
                                </div>

                                {/* Phone Number ID */}
                                <div>
                                    <label className="block text-[9px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">
                                        Phone ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.phoneNumberId}
                                        onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                                        placeholder="ID Telefono"
                                        className="w-full px-6 py-4 bg-white border border-charcoal/10 rounded-2xl focus:border-gold outline-none text-sm font-medium shadow-sm"
                                    />
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-6 bg-red-50 border border-red-200 rounded-[2rem] animate-shake">
                                    <div className="flex items-center gap-4 text-red-600">
                                        <AlertTriangle className="w-6 h-6" />
                                        <span className="text-sm font-black uppercase tracking-widest">{error}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 md:p-10 border-t border-charcoal/5 flex flex-col sm:flex-row sm:items-center justify-between relative z-10 gap-6">
                    <button
                        onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onClose()}
                        className="text-charcoal/30 hover:text-charcoal transition-colors font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] italic self-start sm:self-auto"
                    >
                        {currentStep > 0 ? '← Passaggio Precedente' : 'Annulla Genesi'}
                    </button>

                    {isLastStep ? (
                        <button
                            onClick={handleConnect}
                            disabled={connecting}
                            className="gold-gradient px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-3 md:gap-4 hover:scale-105 transition-all disabled:opacity-70 shadow-luxury w-full sm:w-auto"
                        >
                            {connecting ? (
                                <>
                                    <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                                    Sincronizzazione...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-4 h-4 md:w-5 md:h-5" />
                                    Attiva Frequenza
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="gold-gradient px-8 md:px-12 py-4 md:py-5 rounded-xl md:rounded-2xl text-white font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] flex items-center justify-center gap-3 md:gap-4 hover:scale-105 transition-all shadow-luxury w-full sm:w-auto"
                        >
                            Procedi
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

// =============================================
// MAIN CHANNELS PAGE
// =============================================
export default function ChannelsPage() {
    const { user, isFeatureAccessible } = useSovereign();
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingChannel, setConnectingChannel] = useState<keyof typeof channelConfig | null>(null);

    const activeChannels = channels.filter(c => c.is_active);
    const channelLimit = user ? PLAN_LIMITS[user.plan_tier].channels : 1;
    const isLimitReached = channelLimit !== -1 && activeChannels.length >= channelLimit;

    const loadChannels = async () => {
        if (user) {
            const { data } = await supabase
                .from('channels')
                .select('*')
                .eq('user_id', user.id)
                .order('channel_type');

            setChannels(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        loadChannels();
    }, []);

    const getChannelStatus = (type: string) => {
        const channel = channels.find(c => c.channel_type === type);
        return channel?.is_active || false;
    };

    const handleDisconnect = async (type: string) => {
        const channel = channels.find(c => c.channel_type === type);
        if (channel) {
            await supabase
                .from('channels')
                .update({ is_active: false })
                .eq('id', channel.id);
            loadChannels();
        }
    };

    return (
        <div className="h-[calc(100vh-60px)] flex flex-col bg-champagne overflow-hidden">
            {/* Compact Header */}
            <header className="flex-shrink-0 px-4 lg:px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-charcoal/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="h-[1px] w-8 bg-gold/30"></span>
                            <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black">Canali</span>
                        </div>
                        <h1 className="font-serif text-2xl lg:text-3xl italic text-charcoal">
                            Connessioni <span className="gold-text-gradient">Attive</span>
                        </h1>
                    </div>

                    {/* Compact Quota */}
                    {user && (
                        <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-2 border border-charcoal/5">
                            <div className="flex items-center gap-2">
                                <Zap className="w-4 h-4 text-gold" />
                                <span className="text-[10px] text-charcoal/50 uppercase tracking-wider font-bold">Canali</span>
                            </div>
                            <div className={`text-sm font-bold ${isLimitReached ? 'text-red-500' : 'text-charcoal'}`}>
                                {activeChannels.length} / {channelLimit === -1 ? '∞' : channelLimit}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-gold animate-spin" />
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4 lg:p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {Object.entries(channelConfig).map(([type, config]) => {
                            const isActive = getChannelStatus(type);
                            const Icon = config.icon;
                            const isComingSoon = config.comingSoon;

                            return (
                                <div
                                    key={type}
                                    className={`bg-white/60 backdrop-blur-sm p-5 rounded-2xl border transition-all relative group ${isActive
                                        ? 'border-green-500/30'
                                        : isComingSoon || (isLimitReached && !isActive)
                                            ? 'border-charcoal/5 opacity-50'
                                            : 'border-charcoal/5 hover:border-gold/30'
                                        }`}
                                >
                                    {/* Status Badge */}
                                    <div className={`absolute top-4 right-4 flex items-center gap-1 px-2 py-1 rounded-lg text-[8px] uppercase tracking-wider font-bold ${isActive
                                        ? 'bg-green-50 text-green-600'
                                        : isComingSoon
                                            ? 'bg-gold/10 text-gold'
                                            : 'bg-charcoal/5 text-charcoal/40'
                                        }`}>
                                        {isActive ? (
                                            <><div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> On</>
                                        ) : isComingSoon ? (
                                            (config as any).imperialOnly ? 'VIP' : 'Soon'
                                        ) : 'Off'}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center text-white mb-3`}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Info */}
                                    <h3 className="font-serif text-lg italic text-charcoal mb-1">{config.name}</h3>
                                    <p className="text-[9px] text-charcoal/40 uppercase tracking-wider font-bold mb-2">{config.provider}</p>
                                    <p className="text-charcoal/50 text-xs mb-4 line-clamp-2">{config.description}</p>

                                    {/* Actions - Compact */}
                                    {isActive ? (
                                        <div className="flex gap-2">
                                            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-charcoal text-white rounded-xl text-[9px] font-bold uppercase tracking-wider hover:bg-gold transition-all">
                                                <Settings className="w-3.5 h-3.5" />
                                                Configura
                                            </button>
                                            <button
                                                onClick={() => handleDisconnect(type)}
                                                className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : isComingSoon ? (
                                        <button
                                            disabled
                                            className={cn(
                                                "w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-wider cursor-not-allowed",
                                                (config as any).imperialOnly
                                                    ? "bg-gold/10 text-gold"
                                                    : "bg-charcoal/5 text-charcoal/30"
                                            )}
                                        >
                                            {(config as any).imperialOnly ? <>VIP Only</> : '🚀 Soon'}
                                        </button>
                                    ) : isLimitReached ? (
                                        <button
                                            disabled
                                            className="w-full bg-red-50 py-2.5 rounded-xl text-red-400 text-[9px] font-bold uppercase tracking-wider cursor-not-allowed"
                                        >
                                            Quota Esaurita
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setConnectingChannel(type as keyof typeof channelConfig)}
                                            className="w-full gold-gradient py-2.5 rounded-xl text-white text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                                        >
                                            <Zap className="w-3.5 h-3.5" />
                                            Connetti
                                        </button>
                                    )}

                                    {/* Webhook Info - Compact */}
                                    {isActive && (
                                        <div className="mt-3 p-3 bg-charcoal/[0.02] rounded-lg">
                                            <code className="text-[9px] text-gold font-mono">{config.webhookPath}</code>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Connection Modal */}
            {connectingChannel && (
                <ConnectionModal
                    channel={connectingChannel}
                    onClose={() => setConnectingChannel(null)}
                    onSuccess={() => {
                        setConnectingChannel(null);
                        loadChannels();
                    }}
                />
            )}
        </div>
    );
}
