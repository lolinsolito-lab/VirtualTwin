"use client";

import React from 'react';
import { GraduationCap, Lock, Sparkles, Video, FileText, Users } from 'lucide-react';

/**
 * Academy Admin - Manage tier-based content
 * 
 * Future Features:
 * - Manage courses per tier
 * - Upload video content
 * - Track completion rates
 * - Tier-based access control
 */

export default function AdminAcademy() {
    return (
        <div className="p-8 lg:p-12">
            {/* Header */}
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-4">
                    <span className="h-[1px] w-12 bg-gold/50"></span>
                    <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Knowledge Arsenal</span>
                </div>
                <h1 className="font-serif text-5xl lg:text-7xl italic text-white leading-tight">
                    Academy <span className="gold-text-gradient">Manager.</span>
                </h1>
                <p className="text-white/40 mt-4 text-sm">
                    Gestisci contenuti formativi per ogni tier. Prossimamente disponibile.
                </p>
            </header>

            {/* Coming Soon Card */}
            <div className="bg-gradient-to-br from-purple-500/10 via-transparent to-transparent border border-purple-500/20 rounded-[2rem] p-12 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <GraduationCap className="w-10 h-10 text-purple-400" />
                </div>
                <h2 className="font-serif text-3xl text-white mb-4">Academy Manager Coming Soon</h2>
                <p className="text-white/40 max-w-lg mx-auto mb-8">
                    Qui potrai creare e gestire corsi, video e contenuti formativi esclusivi per ogni tier di abbonamento.
                </p>

                {/* Preview of features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                    <div className="bg-white/5 p-6 rounded-2xl text-left">
                        <Video className="w-6 h-6 text-gold mb-3" />
                        <h3 className="text-white font-bold mb-1">Video Courses</h3>
                        <p className="text-white/40 text-xs">Upload e organizza video formativi</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl text-left">
                        <Lock className="w-6 h-6 text-purple-400 mb-3" />
                        <h3 className="text-white font-bold mb-1">Tier Access</h3>
                        <p className="text-white/40 text-xs">Contenuti esclusivi per tier</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl text-left">
                        <Users className="w-6 h-6 text-blue-400 mb-3" />
                        <h3 className="text-white font-bold mb-1">Progress Tracking</h3>
                        <p className="text-white/40 text-xs">Monitora completamento corsi</p>
                    </div>
                </div>

                {/* Tier Preview */}
                <div className="mt-12">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-4">Contenuti per Tier</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {['Solopreneur', 'Entrepreneur', 'Conquistatore', 'Imperatore'].map((tier, i) => (
                            <div
                                key={tier}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white/60"
                            >
                                {tier}: <span className="text-gold">{(i + 1) * 2} moduli</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
