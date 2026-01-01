"use client";

import React, { useState, useEffect } from 'react';
import { MessageCircle, Instagram, Facebook, Check, X, ExternalLink, Settings, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Channel {
    id: string;
    channel_type: 'whatsapp' | 'instagram' | 'messenger';
    is_active: boolean;
    page_id?: string;
}

const channelConfig = {
    whatsapp: {
        name: 'WhatsApp Business',
        icon: MessageCircle,
        color: 'bg-green-500',
        description: 'Collegato via 360dialog API',
        setupUrl: 'https://www.360dialog.com/'
    },
    instagram: {
        name: 'Instagram Direct',
        icon: Instagram,
        color: 'bg-gradient-to-br from-purple-500 to-pink-500',
        description: 'Rispondi ai DM automaticamente',
        setupUrl: 'https://developers.facebook.com/apps/'
    },
    messenger: {
        name: 'Facebook Messenger',
        icon: Facebook,
        color: 'bg-blue-600',
        description: 'Automatizza le chat Facebook',
        setupUrl: 'https://developers.facebook.com/apps/'
    }
};

export default function ChannelsPage() {
    const [channels, setChannels] = useState<Channel[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadChannels() {
            const { data } = await supabase
                .from('channels')
                .select('*')
                .order('channel_type');

            setChannels(data || []);
            setLoading(false);
        }
        loadChannels();
    }, []);

    const getChannelStatus = (type: string) => {
        const channel = channels.find(c => c.channel_type === type);
        return channel?.is_active || false;
    };

    return (
        <div className="p-12 lg:p-24 min-h-screen bg-champagne animate-soft-focus">
            <header className="mb-32">
                <div className="flex items-center gap-6 mb-8">
                    <span className="h-[1px] w-16 bg-gold/30"></span>
                    <span className="text-gold text-[10px] uppercase tracking-[1.2em] font-black">Neural Network</span>
                </div>
                <h1 className="font-serif text-7xl italic text-charcoal leading-[1.1] tracking-tight">
                    Canali <span className="gold-text-gradient">Connessi.</span>
                </h1>
                <p className="mt-8 text-charcoal/40 font-medium text-sm tracking-wide max-w-xl">
                    Gestisci tutti i tuoi canali di comunicazione da un unico centro di comando. L'AI risponde ovunque.
                </p>
            </header>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="w-16 h-16 gold-gradient rounded-full animate-pulse" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {Object.entries(channelConfig).map(([type, config]) => {
                        const isActive = getChannelStatus(type);
                        const Icon = config.icon;

                        return (
                            <div
                                key={type}
                                className={`silk-card p-16 rounded-[4rem] border transition-all duration-700 group relative overflow-hidden ${isActive
                                        ? 'border-gold/30 shadow-luxury'
                                        : 'border-white/60 hover:border-gold/20'
                                    }`}
                            >
                                {/* Status Badge */}
                                <div className={`absolute top-10 right-10 flex items-center gap-2 px-4 py-2 rounded-full ${isActive ? 'bg-green-500/10 text-green-600' : 'bg-charcoal/5 text-charcoal/30'
                                    }`}>
                                    {isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                                    <span className="text-[8px] uppercase tracking-widest font-black">
                                        {isActive ? 'Attivo' : 'Non Connesso'}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className={`w-20 h-20 ${config.color} rounded-3xl flex items-center justify-center text-white mb-12 shadow-xl group-hover:scale-110 transition-transform duration-700`}>
                                    <Icon className="w-10 h-10" />
                                </div>

                                {/* Info */}
                                <h3 className="text-2xl font-serif italic text-charcoal mb-4 tracking-tight">{config.name}</h3>
                                <p className="text-charcoal/40 text-sm mb-12">{config.description}</p>

                                {/* Actions */}
                                <div className="flex gap-4">
                                    {isActive ? (
                                        <button className="flex-1 flex items-center justify-center gap-3 px-8 py-5 bg-charcoal/5 rounded-full text-charcoal text-[10px] uppercase tracking-widest font-black hover:bg-charcoal hover:text-white transition-all duration-500">
                                            <Settings className="w-4 h-4" />
                                            Configura
                                        </button>
                                    ) : (
                                        <a
                                            href={config.setupUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex-1 flex items-center justify-center gap-3 px-8 py-5 gold-gradient rounded-full text-white text-[10px] uppercase tracking-widest font-black shadow-luxury hover:scale-105 transition-all duration-500"
                                        >
                                            <Zap className="w-4 h-4" />
                                            Connetti
                                        </a>
                                    )}
                                </div>

                                {/* Webhook Info */}
                                {isActive && (
                                    <div className="mt-12 p-6 bg-charcoal/[0.02] rounded-2xl border border-charcoal/5">
                                        <p className="text-[9px] uppercase tracking-widest text-charcoal/30 mb-2 font-black">Webhook Endpoint</p>
                                        <code className="text-[10px] text-charcoal/60 font-mono">
                                            /api/{type}/webhook
                                        </code>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Setup Guide */}
            <div className="mt-40 silk-card p-20 rounded-[5rem] border border-white/60">
                <div className="flex items-center gap-8 mb-16">
                    <div className="w-16 h-16 gold-gradient rounded-2xl flex items-center justify-center text-white">
                        <ExternalLink className="w-8 h-8" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-serif italic text-charcoal tracking-tight">Guida alla Configurazione</h3>
                        <p className="text-charcoal/40 text-sm">Come connettere i tuoi canali</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-600 font-black">1</div>
                        <h4 className="text-charcoal font-medium">WhatsApp</h4>
                        <p className="text-charcoal/40 text-sm">
                            Registrati su 360dialog, ottieni le credenziali API e configura il webhook su <code className="text-gold">/api/whatsapp/webhook</code>
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 font-black">2</div>
                        <h4 className="text-charcoal font-medium">Instagram</h4>
                        <p className="text-charcoal/40 text-sm">
                            Crea un'app Meta, abilita Instagram Graph API e punta il webhook a <code className="text-gold">/api/instagram/webhook</code>
                        </p>
                    </div>
                    <div className="space-y-4">
                        <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 font-black">3</div>
                        <h4 className="text-charcoal font-medium">Messenger</h4>
                        <p className="text-charcoal/40 text-sm">
                            Usa la stessa app Meta, abilita Messenger API e configura <code className="text-gold">/api/messenger/webhook</code>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
