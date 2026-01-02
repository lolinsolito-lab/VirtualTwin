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
    AlertTriangle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-charcoal/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 ${config.color} rounded-xl flex items-center justify-center text-white`}>
                            <config.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif italic text-charcoal">Connetti {config.name}</h2>
                            <p className="text-charcoal/50 text-sm">Provider: {config.provider}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-charcoal/30 hover:text-charcoal transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Progress */}
                <div className="p-6 border-b border-charcoal/5">
                    <div className="flex items-center gap-2">
                        {config.steps.map((_, i) => (
                            <div key={i} className="flex items-center gap-2 flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${i < currentStep
                                    ? 'bg-green-500 text-white'
                                    : i === currentStep
                                        ? 'bg-gold text-white'
                                        : 'bg-charcoal/10 text-charcoal/40'
                                    }`}>
                                    {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                                </div>
                                {i < config.steps.length - 1 && (
                                    <div className={`h-1 flex-1 rounded-full ${i < currentStep ? 'bg-green-500' : 'bg-charcoal/10'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <div className="p-8">
                    <h3 className="text-lg font-bold text-charcoal mb-2">
                        Step {currentStep + 1}: {step.title}
                    </h3>
                    <p className="text-charcoal/60 mb-6">{step.description}</p>

                    {/* External Link */}
                    {step.link && (
                        <a
                            href={step.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-charcoal text-white rounded-xl font-bold text-sm hover:bg-gold transition-colors mb-6"
                        >
                            <ExternalLink className="w-4 h-4" />
                            {step.linkText}
                        </a>
                    )}

                    {/* Tip */}
                    {step.tip && (
                        <div className="p-4 bg-gold/10 border border-gold/20 rounded-xl mb-6">
                            <div className="flex items-start gap-3">
                                <HelpCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                <p className="text-charcoal/70 text-sm">{step.tip}</p>
                            </div>
                        </div>
                    )}

                    {/* Webhook URL */}
                    {step.webhookUrl && (
                        <div className="mb-6">
                            <label className="block text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">
                                Webhook URL
                            </label>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 px-4 py-3 bg-charcoal/5 rounded-lg text-sm font-mono text-charcoal overflow-x-auto">
                                    {webhookUrl}
                                </code>
                                <button
                                    onClick={() => copyToClipboard(webhookUrl)}
                                    className="px-4 py-3 bg-gold/10 text-gold rounded-lg hover:bg-gold hover:text-white transition-all"
                                >
                                    {copied ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                </button>
                            </div>
                            <p className="text-charcoal/40 text-xs mt-2">
                                Verification Token: <code className="text-gold">virtualtwin_sovereign</code>
                            </p>
                        </div>
                    )}

                    {/* Input Form */}
                    {step.isInput && (
                        <div className="space-y-4">
                            {/* API Key */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">
                                    API Key *
                                </label>
                                <div className="relative">
                                    <input
                                        type={showApiKey ? 'text' : 'password'}
                                        value={formData.apiKey}
                                        onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                                        placeholder="Incolla la tua API key di 360Dialog"
                                        className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl focus:border-gold outline-none pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal/30 hover:text-charcoal"
                                    >
                                        {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* WABA ID */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">
                                    WABA ID *
                                </label>
                                <input
                                    type="text"
                                    value={formData.wabaId}
                                    onChange={(e) => setFormData({ ...formData, wabaId: e.target.value })}
                                    placeholder="Es: 123456789012345"
                                    className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl focus:border-gold outline-none"
                                />
                            </div>

                            {/* Phone Number ID */}
                            <div>
                                <label className="block text-xs uppercase tracking-widest text-charcoal/40 font-bold mb-2">
                                    Phone Number ID *
                                </label>
                                <input
                                    type="text"
                                    value={formData.phoneNumberId}
                                    onChange={(e) => setFormData({ ...formData, phoneNumberId: e.target.value })}
                                    placeholder="Es: 123456789012345"
                                    className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl focus:border-gold outline-none"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                                    <div className="flex items-center gap-3 text-red-600">
                                        <AlertTriangle className="w-5 h-5" />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-charcoal/10 flex items-center justify-between">
                    <button
                        onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : onClose()}
                        className="text-charcoal/50 hover:text-charcoal transition-colors font-medium"
                    >
                        ← {currentStep > 0 ? 'Indietro' : 'Annulla'}
                    </button>

                    {isLastStep ? (
                        <button
                            onClick={handleConnect}
                            disabled={connecting}
                            className="gold-gradient px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-70"
                        >
                            {connecting ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Connessione...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Attiva Canale
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            onClick={() => setCurrentStep(currentStep + 1)}
                            className="gold-gradient px-8 py-3 rounded-xl text-white font-bold flex items-center gap-2 hover:scale-105 transition-all"
                        >
                            Continua
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
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);
    const [connectingChannel, setConnectingChannel] = useState<keyof typeof channelConfig | null>(null);

    const loadChannels = async () => {
        const { data: { user } } = await supabase.auth.getUser();
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
            <header className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                    <span className="h-[1px] w-12 bg-gold/30"></span>
                    <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Neural Network</span>
                </div>
                <h1 className="font-serif text-5xl lg:text-6xl italic text-charcoal leading-[1.1] tracking-tight">
                    Canali <span className="gold-text-gradient">Connessi.</span>
                </h1>
                <p className="mt-4 text-charcoal/40 font-medium text-sm tracking-wide max-w-xl">
                    Gestisci i tuoi canali di comunicazione. L'AI risponde automaticamente su ogni piattaforma.
                </p>
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
                                className={`silk-card p-8 rounded-3xl border transition-all duration-300 relative ${isActive
                                    ? 'border-green-500/30 bg-gradient-to-br from-green-50 to-white'
                                    : isComingSoon
                                        ? 'border-charcoal/10 opacity-60'
                                        : 'border-white/60 hover:border-gold/30 hover:shadow-lg'
                                    }`}
                            >
                                {/* Status Badge */}
                                <div className={`absolute top-6 right-6 flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${isActive
                                    ? 'bg-green-100 text-green-600'
                                    : isComingSoon
                                        ? 'bg-gold/10 text-gold'
                                        : 'bg-charcoal/5 text-charcoal/40'
                                    }`}>
                                    {isActive ? (
                                        <>
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            Attivo
                                        </>
                                    ) : isComingSoon ? (
                                        'Coming Soon'
                                    ) : (
                                        <>
                                            <X className="w-3 h-3" />
                                            Non Connesso
                                        </>
                                    )}
                                </div>

                                {/* Icon */}
                                <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                                    <Icon className="w-8 h-8" />
                                </div>

                                {/* Info */}
                                <h3 className="text-xl font-serif italic text-charcoal mb-2">{config.name}</h3>
                                <p className="text-charcoal/50 text-sm mb-6">{config.description}</p>

                                {/* Actions */}
                                {isActive ? (
                                    <div className="flex gap-3">
                                        <button className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-charcoal/5 rounded-xl text-charcoal text-sm font-medium hover:bg-charcoal hover:text-white transition-all">
                                            <Settings className="w-4 h-4" />
                                            Configura
                                        </button>
                                        <button
                                            onClick={() => handleDisconnect(type)}
                                            className="px-4 py-3 bg-red-50 text-red-500 rounded-xl text-sm font-medium hover:bg-red-500 hover:text-white transition-all"
                                        >
                                            Disconnetti
                                        </button>
                                    </div>
                                ) : isComingSoon ? (
                                    <button
                                        disabled
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-charcoal/10 rounded-xl text-charcoal/40 text-sm font-medium cursor-not-allowed"
                                    >
                                        🚀 In arrivo
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setConnectingChannel(type as keyof typeof channelConfig)}
                                        className="w-full gold-gradient px-4 py-3 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all shadow-lg"
                                    >
                                        <Zap className="w-4 h-4" />
                                        Connetti
                                    </button>
                                )}

                                {/* Webhook Info */}
                                {isActive && (
                                    <div className="mt-6 p-4 bg-charcoal/5 rounded-xl">
                                        <p className="text-[10px] uppercase tracking-wider text-charcoal/40 mb-1 font-bold">Webhook</p>
                                        <code className="text-xs text-charcoal/60 font-mono">{config.webhookPath}</code>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Quick Setup Guide */}
            <div className="mt-16 silk-card p-8 rounded-3xl border border-white/60">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-gold" />
                    </div>
                    <div>
                        <h3 className="text-xl font-serif italic text-charcoal">Guida Rapida</h3>
                        <p className="text-charcoal/50 text-sm">Come connettere i canali in 2 minuti</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    <div className="p-4 bg-green-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-green-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">1</div>
                            <h4 className="font-medium text-charcoal">WhatsApp</h4>
                        </div>
                        <p className="text-charcoal/60 text-sm">
                            Registrati su 360Dialog (gratis), ottieni le API keys e inseriscile nel wizard.
                        </p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl opacity-60">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center font-bold text-sm">2</div>
                            <h4 className="font-medium text-charcoal">Instagram</h4>
                        </div>
                        <p className="text-charcoal/60 text-sm">
                            Coming soon! Collega il tuo account business Instagram per rispondere ai DM.
                        </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl opacity-60">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">3</div>
                            <h4 className="font-medium text-charcoal">Messenger</h4>
                        </div>
                        <p className="text-charcoal/60 text-sm">
                            Coming soon! Automatizza le risposte sulla tua pagina Facebook.
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
