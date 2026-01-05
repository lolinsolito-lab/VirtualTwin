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
    Activity
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSovereign } from '@/components/providers/SovereignProvider';
import { PLAN_LIMITS } from '@/lib/pricing';

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
                            <h2 className="text-2xl font-serif italic text-charcoal tracking-tight">Connetti {config.name}</h2>
                            <p className="text-charcoal/30 text-[9px] uppercase tracking-[0.3em] font-black mt-1">Provider: {config.provider}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-12 h-12 bg-charcoal/5 hover:bg-charcoal text-charcoal/30 hover:text-white rounded-full flex items-center justify-center transition-all">
                        <X className="w-6 h-6" />
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
                <div className="p-12">
                    <div className="mb-10">
                        <p className="text-gold text-[9px] uppercase tracking-[0.4em] font-black mb-4">Step {currentStep + 1} di {config.steps.length}</p>
                        <h3 className="text-3xl font-serif italic text-charcoal mb-4 tracking-tight">
                            {step.title}
                        </h3>
                        <p className="text-charcoal/50 text-base leading-relaxed whitespace-pre-line">{step.description}</p>
                    </div>

                    {/* External Link */}
                    {step.link && (
                        <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 px-8 py-4 bg-charcoal text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-gold transition-all shadow-luxury mb-10"
                        >
                            <ExternalLink className="w-4 h-4" />
                            {step.linkText}
                        </a>
                    )}

                    {/* Tip */}
                    {step.tip && (
                        <div className="p-6 bg-gold/[0.03] border border-gold/20 rounded-[2rem] mb-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-12 h-12 bg-gold/5 blur-xl group-hover:bg-gold/10 transition-colors" />
                            <div className="flex items-start gap-4">
                                <HelpCircle className="w-6 h-6 text-gold flex-shrink-0 mt-0.5" />
                                <p className="text-charcoal/60 text-sm italic leading-relaxed">{step.tip}</p>
                            </div>
                        </div>
                    )}

                    {/* Webhook URL */}
                    {step.webhookUrl && (
                        <div className="mb-10">
                            <label className="block text-[9px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3 italic">
                                Webhook Neural URL
                            </label>
                            <div className="flex items-center gap-3">
                                <code className="flex-1 px-6 py-4 bg-white border border-charcoal/5 rounded-2xl text-[11px] font-mono text-charcoal overflow-x-auto shadow-sm">
                                    {webhookUrl}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(webhookUrl)}
                                    className="p-4 bg-gold/10 text-gold rounded-2xl hover:bg-gold hover:text-white transition-all border border-gold/10 shadow-sm"
                                >
                                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-charcoal/30 text-[8px] mt-3 font-bold uppercase tracking-[0.2em]">
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
                                    API Key Imperiale *
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
                <div className="p-10 border-t border-charcoal/5 flex items-center justify-between relative z-10">
                    <button
                        onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onClose()}
                        className="text-charcoal/30 hover:text-charcoal transition-colors font-black text-[10px] uppercase tracking-[0.2em] italic"
                    >
                        {currentStep > 0 ? '← Passaggio Precedente' : 'Annulla Genesi'}
                    </button>

                    {isLastStep ? (
                        <button
                            onClick={handleConnect}
                            disabled={connecting}
                            className="gold-gradient px-12 py-5 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 hover:scale-105 transition-all disabled:opacity-70 shadow-luxury"
                        >
                            {connecting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sincronizzazione...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Attiva Frequenza
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="gold-gradient px-12 py-5 rounded-2xl text-white font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 hover:scale-105 transition-all shadow-luxury"
                        >
                            Procedi
                            <ArrowRight className="w-5 h-5" />
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
        <div className="p-8 lg:p-16 min-h-screen bg-champagne">
            <header className="mb-16 relative">
                {/* Ambient Glow */}
                <div className="absolute -top-20 -left-10 w-64 h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-12 relative z-10">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="h-[1px] w-12 bg-gold/30"></span>
                            <span className="text-gold text-[9px] uppercase tracking-[0.8em] font-black">Neural Network</span>
                        </div>
                        <h1 className="font-serif text-5xl lg:text-7xl italic text-charcoal leading-[1.1] tracking-tight">
                            Canali <span className="gold-text-gradient">Connessi.</span>
                        </h1>
                        <p className="mt-6 text-charcoal/40 font-serif italic text-lg tracking-wide max-w-xl border-l border-gold/20 pl-6">
                            &ldquo;La tua voce imperiale, riverberata attraverso ogni frequenza digitale.&rdquo;
                        </p>
                    </div>

                    {/* Quota Meter - Imperial Visual */}
                    {user && (
                        <div className="bg-white/40 backdrop-blur-md p-8 rounded-[2.5rem] border border-white/60 shadow-luxury-sm min-w-[280px]">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[9px] uppercase tracking-widest text-charcoal/40 font-black">Neural Capacity</span>
                                <span className={`text-[10px] font-black ${isLimitReached ? 'text-red-500' : 'text-gold'}`}>
                                    {activeChannels.length} / {channelLimit === -1 ? '∞' : channelLimit}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-charcoal/5 rounded-full overflow-hidden mb-4">
                                <div
                                    className={`h-full bg-gold-gradient transition-all duration-1000 ${isLimitReached ? 'from-red-500 to-red-400' : ''}`}
                                    style={{ width: `${channelLimit === -1 ? 100 : (activeChannels.length / channelLimit) * 100}%` }}
                                />
                            </div>
                            <p className="text-[8px] text-charcoal/30 uppercase tracking-[0.2em] font-bold italic">
                                {isLimitReached ? '⚠️ Quota raggiunta. Potenzia il tuo Impero.' : 'Connessione stabile attraverso la rete.'}
                            </p>
                        </div>
                    )}
                </div>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-12 h-12 text-gold animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {Object.entries(channelConfig).map(([type, config]) => {
                        const isActive = getChannelStatus(type);
                        const Icon = config.icon;
                        const isComingSoon = config.comingSoon;

                        return (
                            <div
                                key={type}
                                className={`bg-white/40 backdrop-blur-md p-10 rounded-[3rem] border transition-all duration-700 relative group overflow-hidden ${isActive
                                    ? 'border-green-500/20 shadow-luxury-sm'
                                    : isComingSoon || (isLimitReached && !isActive)
                                        ? 'border-charcoal/5 opacity-60 grayscale'
                                        : 'border-white/60 hover:border-gold/30 hover:shadow-luxury'
                                    }`}
                            >
                                {/* Glow Effect on Hover */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/[0.02] group-hover:bg-gold/[0.08] blur-2xl transition-colors pointer-events-none" />

                                {/* Status Badge */}
                                <div className={`absolute top-8 right-8 flex items-center gap-2 px-4 py-2 rounded-full text-[9px] uppercase tracking-[0.2em] font-black border ${isActive
                                    ? 'bg-green-50 text-green-600 border-green-200'
                                    : isComingSoon
                                        ? 'bg-gold/10 text-gold border-gold/20'
                                        : 'bg-charcoal/5 text-charcoal/40 border-charcoal/5'
                                    }`}>
                                    {isActive ? (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-sm" />
                                            Live Neural Link
                                        </>
                                    ) : isComingSoon ? (
                                        'Coming Soon'
                                    ) : (
                                        <>
                                            <Activity className="w-3 h-3" />
                                            Inattivo
                                        </>
                                    )}
                                </div>

                                {/* Icon */}
                                <div className={`w-20 h-20 ${config.color} rounded-3xl flex items-center justify-center text-white mb-8 shadow-luxury group-hover:scale-110 transition-transform duration-700`}>
                                    <Icon className="w-10 h-10" />
                                </div>

                                {/* Info */}
                                <h3 className="text-2xl font-serif italic text-charcoal mb-3 tracking-tight">{config.name}</h3>
                                <p className="text-charcoal/40 text-[10px] font-black uppercase tracking-widest mb-4 italic">{config.provider}</p>
                                <p className="text-charcoal/50 text-sm mb-10 leading-relaxed">{config.description}</p>

                                {/* Actions */}
                                {isActive ? (
                                    <div className="flex gap-4">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-charcoal text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-all shadow-luxury">
                                            <Settings className="w-4 h-4" />
                                            Configura
                                        </button>
                                        <button
                                            onClick={() => handleDisconnect(type)}
                                            className="px-5 py-4 bg-red-50 text-red-500 rounded-2xl border border-red-100 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : isComingSoon ? (
                                    <button
                                        disabled
                                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-charcoal/5 border border-charcoal/5 rounded-2xl text-charcoal/30 text-[10px] font-black uppercase tracking-widest cursor-not-allowed"
                                    >
                                        🚀 Orbita Futura
                                    </button>
                                ) : isLimitReached ? (
                                    <button
                                        disabled
                                        className="w-full bg-red-50 border border-red-100 px-6 py-4 rounded-2xl text-red-400 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 cursor-not-allowed"
                                    >
                                        <Shield className="w-4 h-4" />
                                        Quota Esaurita
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setConnectingChannel(type as keyof typeof channelConfig)}
                                        className="w-full gold-gradient px-6 py-4 rounded-2xl text-white text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-105 transition-all shadow-luxury"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Connetti Frequenza
                                    </button>
                                )}

                                {/* Webhook Info */}
                                {isActive && (
                                    <div className="mt-8 p-5 bg-charcoal/[0.02] rounded-2xl border border-charcoal/5 group-hover:border-gold/20 transition-colors">
                                        <p className="text-[9px] uppercase tracking-[0.3em] text-charcoal/40 mb-2 font-black italic">Neural Webhook Path</p>
                                        <code className="text-[10px] text-gold font-mono font-black">{config.webhookPath}</code>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quick Setup Guide - Sovereign Visual */}
            <div className="mt-20 bg-white/40 backdrop-blur-md p-12 rounded-[4rem] border border-white/60 shadow-luxury-sm">
                <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center border border-gold/20 shadow-sm">
                        <HelpCircle className="w-8 h-8 text-gold" />
                    </div>
                    <div>
                        <h3 className="text-3xl font-serif italic text-charcoal tracking-tight">Guida Strategica.</h3>
                        <p className="text-charcoal/40 text-[10px] uppercase tracking-[0.4em] font-black italic mt-1">Connessione rapida in 120 secondi</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-10">
                    <div className="p-8 bg-white/40 rounded-[2.5rem] border border-white/60 relative group overflow-hidden">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-green-500/[0.02] group-hover:bg-green-500/[0.05] transition-colors blur-xl" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-green-500 text-white rounded-xl flex items-center justify-center font-serif italic text-lg shadow-lg">1</div>
                            <h4 className="font-serif italic text-xl text-charcoal">Frequenza WhatsApp</h4>
                        </div>
                        <p className="text-charcoal/50 text-sm leading-relaxed">
                            Registrati su 360Dialog, ottieni le chiavi neurali (API) e sincronizzale nel wizard d'accesso.
                        </p>
                    </div>
                    <div className="p-8 bg-white/40 rounded-[2.5rem] border border-white/60 relative group overflow-hidden opacity-60">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/[0.02] group-hover:bg-purple-500/[0.05] transition-colors blur-xl" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-purple-500 text-white rounded-xl flex items-center justify-center font-serif italic text-lg shadow-lg">2</div>
                            <h4 className="font-serif italic text-xl text-charcoal">Risonanza Instagram</h4>
                        </div>
                        <p className="text-charcoal/50 text-sm leading-relaxed italic">
                            In arrivo: Collega il tuo avatar business di Instagram per automatizzare ogni interazione diretta.
                        </p>
                    </div>
                    <div className="p-8 bg-white/40 rounded-[2.5rem] border border-white/60 relative group overflow-hidden opacity-60">
                        <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/[0.02] group-hover:bg-blue-500/[0.05] transition-colors blur-xl" />
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center font-serif italic text-lg shadow-lg">3</div>
                            <h4 className="font-serif italic text-xl text-charcoal">Network Messenger</h4>
                        </div>
                        <p className="text-charcoal/50 text-sm leading-relaxed italic">
                            In arrivo: Estendi la tua presenza automatizzata su Facebook Messenger per una copertura globale.
                        </p>
                    </div>
                </div>
            </div>

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
