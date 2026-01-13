"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Download, Linkedin, Instagram, Copy, Check, TrendingUp, Clock, Smile, Frown } from 'lucide-react';

interface ShareYourTwinProps {
    stats?: {
        messagesBefore: number;
        messagesAfter: number;
        hoursBefore: number;
        hoursAfter: number;
        stressBefore: 'high' | 'medium' | 'low';
        stressAfter: 'high' | 'medium' | 'low';
    };
}

/**
 * ShareYourTwin Component
 * 
 * Generates a shareable Before/After infographic for social media.
 * Uses html2canvas for image generation.
 */
export default function ShareYourTwin({ stats }: ShareYourTwinProps) {
    const [copied, setCopied] = useState(false);
    const [generating, setGenerating] = useState(false);

    // Default stats if not provided
    const data = stats || {
        messagesBefore: 300,
        messagesAfter: 50,
        hoursBefore: 60,
        hoursAfter: 25,
        stressBefore: 'high' as const,
        stressAfter: 'low' as const
    };

    const stressEmoji = (level: string) => {
        if (level === 'high') return '😫';
        if (level === 'medium') return '😐';
        return '😎';
    };

    const handleDownload = async () => {
        setGenerating(true);
        try {
            // Dynamic import of html2canvas to avoid SSR issues
            const html2canvas = (await import('html2canvas')).default;
            const element = document.getElementById('share-card');
            if (!element) return;

            const canvas = await html2canvas(element, {
                scale: 2,
                backgroundColor: '#1a1a1a',
                logging: false
            });

            const link = document.createElement('a');
            link.download = 'virtualtwin-results.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Failed to generate image:', error);
        } finally {
            setGenerating(false);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText('https://virtualtwin.vercel.app');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareLinkedIn = () => {
        const text = encodeURIComponent(`I risultati parlano da soli 📊\n\nPRIMA di VirtualTwin:\n• ${data.hoursBefore}h/settimana su messaggi\n• Stress: ${stressEmoji(data.stressBefore)}\n\nDOPO VirtualTwin:\n• ${data.hoursAfter}h/settimana\n• Stress: ${stressEmoji(data.stressAfter)}\n\nIl mio Clone AI gestisce i clienti 24/7.\n\n➡️ Prova gratis: virtualtwin.vercel.app`);
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=https://virtualtwin.vercel.app&title=I%20miei%20risultati%20con%20VirtualTwin&summary=${text}`, '_blank');
    };

    return (
        <div className="bg-white rounded-[2rem] p-8 border border-charcoal/10 shadow-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-serif text-charcoal italic">Condividi i Tuoi Risultati</h3>
                    <p className="text-charcoal/50 text-sm mt-1">Mostra al mondo la tua trasformazione</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <Share2 className="w-6 h-6 text-gold" />
                </div>
            </div>

            {/* The Shareable Card */}
            <div
                id="share-card"
                className="bg-charcoal rounded-2xl p-8 text-white mb-8"
            >
                <div className="grid grid-cols-2 gap-8">
                    {/* BEFORE */}
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-widest text-white/40 font-black">Prima di VirtualTwin</p>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-red-400" />
                            <span className="text-2xl font-serif">{data.hoursBefore}h<span className="text-sm text-white/40">/sett</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-red-400" />
                            <span className="text-lg">{data.messagesBefore} msg gestiti</span>
                        </div>
                        <div className="text-4xl">{stressEmoji(data.stressBefore)}</div>
                    </div>

                    {/* AFTER */}
                    <div className="space-y-4">
                        <p className="text-[10px] uppercase tracking-widest text-gold font-black">Dopo VirtualTwin</p>
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-green-400" />
                            <span className="text-2xl font-serif text-gold">{data.hoursAfter}h<span className="text-sm text-white/40">/sett</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            <span className="text-lg">{data.messagesAfter} msg gestiti</span>
                        </div>
                        <div className="text-4xl">{stressEmoji(data.stressAfter)}</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-charcoal font-black text-sm">VT</div>
                        <span className="font-serif italic text-white/60">VirtualTwin</span>
                    </div>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest">virtualtwin.vercel.app</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    onClick={handleDownload}
                    disabled={generating}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-charcoal text-white rounded-xl font-bold text-sm hover:bg-charcoal/90 transition disabled:opacity-50"
                >
                    <Download className="w-4 h-4" />
                    {generating ? 'Generando...' : 'Download'}
                </button>
                <button
                    onClick={handleShareLinkedIn}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#0077B5] text-white rounded-xl font-bold text-sm hover:bg-[#0077B5]/90 transition"
                >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                </button>
                <button
                    onClick={handleCopyLink}
                    className="flex items-center justify-center gap-2 py-3 px-4 bg-gold/10 text-gold rounded-xl font-bold text-sm hover:bg-gold/20 transition"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiato!' : 'Link'}
                </button>
            </div>
        </div>
    );
}
