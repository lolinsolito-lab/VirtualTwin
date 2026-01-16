"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Users,
    MessageSquare,
    Zap,
    ArrowRight,
    Sparkles,
    Radio,
    School,
    Settings,
    CheckCircle2,
    Circle,
    Play,
    Package,
    TrendingUp,
    Clock,
    Target,
    Crown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useSovereign } from '@/components/providers/SovereignProvider';
import MyPurchases from '@/components/dashboard/MyPurchases';
import { motion } from 'framer-motion';

// Onboarding Steps
const ONBOARDING_STEPS = [
    { id: 'profile', label: 'Completa il tuo profilo', href: '/dashboard/settings', icon: Settings },
    { id: 'academy', label: 'Inizia la Founder Academy', href: '/dashboard/academy', icon: School },
    { id: 'channels', label: 'Connetti un canale', href: '/dashboard/channels', icon: Radio },
    { id: 'chat', label: 'Prova il tuo AI Clone', href: '/dashboard/chat', icon: MessageSquare },
];

// Quick Actions
const QUICK_ACTIONS = [
    {
        label: 'Founder Academy',
        description: 'Impara le strategie per dominare',
        href: '/dashboard/academy',
        icon: School,
        color: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
        iconBg: 'bg-purple-500/20'
    },
    {
        label: 'Prova AI Chat',
        description: 'Testa il tuo clone AI',
        href: '/dashboard/chat',
        icon: MessageSquare,
        color: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        iconBg: 'bg-blue-500/20'
    },
    {
        label: 'Connetti Canali',
        description: 'WhatsApp, Instagram, Messenger',
        href: '/dashboard/channels',
        icon: Radio,
        color: 'bg-green-500/10 text-green-600 border-green-500/20',
        iconBg: 'bg-green-500/20'
    },
    {
        label: 'Impostazioni',
        description: 'Configura il tuo profilo',
        href: '/dashboard/settings',
        icon: Settings,
        color: 'bg-charcoal/5 text-charcoal/60 border-charcoal/10',
        iconBg: 'bg-charcoal/10'
    },
];

export default function DashboardPage() {
    const { user, loading: userLoading } = useSovereign();
    const [stats, setStats] = useState({
        totalLeads: 0,
        conversations: 0,
        completedVideos: 0,
        totalVideos: 14, // Total in Academy
    });

    useEffect(() => {
        if (!userLoading && user?.id) {
            fetchDashboardData();
        }
    }, [user?.id, userLoading]);

    const fetchDashboardData = async () => {
        if (!user?.id) return;

        try {
            const { count: leadCount } = await supabase
                .from('conversations')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const { count: messageCount } = await supabase
                .from('messages')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            setStats({
                totalLeads: leadCount || 0,
                conversations: messageCount || 0,
                completedVideos: user?.completed_video_ids?.length || 0,
                totalVideos: 14,
            });
        } catch (error) {
            console.error('Dashboard data error:', error);
        }
    };

    // Calculate onboarding progress
    const getOnboardingProgress = () => {
        let completed = 0;
        if (user?.full_name) completed++;
        if (user?.completed_video_ids?.length > 0) completed++;
        if (stats.conversations > 0) completed++;
        // channels not tracked yet
        return { completed, total: ONBOARDING_STEPS.length };
    };

    const onboarding = getOnboardingProgress();
    const academyProgress = Math.round((stats.completedVideos / stats.totalVideos) * 100);

    return (
        <div className="p-4 md:p-8 lg:p-10 bg-champagne min-h-screen">
            {/* Compact Header */}
            <header className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="h-[1px] w-8 bg-gold/30"></span>
                            <span className="text-gold text-[9px] uppercase tracking-[0.5em] font-black">Dashboard</span>
                        </div>
                        <h1 className="font-serif text-2xl md:text-4xl italic text-charcoal">
                            Bentornato, <span className="gold-text-gradient">{user?.full_name?.split(' ')[0] || 'Sovrano'}</span>
                        </h1>
                    </div>

                    {/* Plan Badge */}
                    <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 border border-charcoal/5 shadow-sm">
                        <Crown className="w-5 h-5 text-gold" />
                        <div>
                            <p className="text-[10px] uppercase tracking-widest text-charcoal/40 font-bold">Piano Attivo</p>
                            <p className="text-charcoal font-bold capitalize">{user?.plan_tier || 'Curioso'}</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Grid - Everything visible without scrolling */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN - 2/3 width */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Quick Actions Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {QUICK_ACTIONS.map((action, i) => (
                            <motion.div
                                key={action.label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Link
                                    href={action.href}
                                    className={`block p-5 rounded-2xl border ${action.color} hover:scale-[1.02] transition-all group`}
                                >
                                    <div className={`w-10 h-10 rounded-xl ${action.iconBg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                                        <action.icon className="w-5 h-5" />
                                    </div>
                                    <p className="font-bold text-sm text-charcoal mb-1">{action.label}</p>
                                    <p className="text-[10px] text-charcoal/40">{action.description}</p>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Academy Progress Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-3xl border border-charcoal/5 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                                    <School className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl italic text-charcoal">Founder Academy</h3>
                                    <p className="text-charcoal/40 text-sm">{stats.completedVideos} di {stats.totalVideos} lezioni completate</p>
                                </div>
                            </div>
                            <Link
                                href="/dashboard/academy"
                                className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-600 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-purple-500/20 transition-colors"
                            >
                                <Play className="w-4 h-4" />
                                Continua
                            </Link>
                        </div>

                        {/* Progress Bar */}
                        <div className="bg-charcoal/5 rounded-full h-3 overflow-hidden">
                            <motion.div
                                className="h-full bg-purple-500 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${academyProgress}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-[10px] text-charcoal/40 uppercase tracking-wider font-bold">Progresso</span>
                            <span className="text-[10px] text-purple-600 font-bold">{academyProgress}%</span>
                        </div>
                    </motion.div>

                    {/* My Purchases */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <MyPurchases />
                    </motion.div>

                    {/* Stats Row - Compact */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="grid grid-cols-3 gap-4"
                    >
                        {[
                            { label: 'Lead Totali', value: stats.totalLeads, icon: Users, color: 'text-blue-600' },
                            { label: 'Messaggi AI', value: stats.conversations, icon: MessageSquare, color: 'text-purple-600' },
                            { label: 'XP Guadagnati', value: user?.xp || 0, icon: Zap, color: 'text-gold' },
                        ].map((stat, i) => (
                            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-charcoal/5 shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                                    <span className="text-[9px] uppercase tracking-wider text-charcoal/40 font-bold">{stat.label}</span>
                                </div>
                                <p className="text-2xl font-serif text-charcoal">{stat.value.toLocaleString()}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* RIGHT COLUMN - 1/3 width */}
                <div className="space-y-6">

                    {/* Onboarding Checklist */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                        className="bg-white rounded-3xl border border-charcoal/5 p-6 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="font-serif text-lg italic text-charcoal">Setup Iniziale</h3>
                            <span className="text-gold text-sm font-bold">{onboarding.completed}/{onboarding.total}</span>
                        </div>

                        <div className="space-y-3">
                            {ONBOARDING_STEPS.map((step, i) => {
                                const isCompleted = i < onboarding.completed;
                                return (
                                    <Link
                                        key={step.id}
                                        href={step.href}
                                        className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isCompleted
                                                ? 'bg-green-500/5 text-green-600'
                                                : 'bg-charcoal/[0.02] text-charcoal/60 hover:bg-charcoal/[0.05]'
                                            }`}
                                    >
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-charcoal/20" />
                                        )}
                                        <span className={`text-sm font-medium ${isCompleted ? 'line-through' : ''}`}>
                                            {step.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-5 pt-4 border-t border-charcoal/5">
                            <div className="bg-charcoal/5 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gold transition-all duration-500"
                                    style={{ width: `${(onboarding.completed / onboarding.total) * 100}%` }}
                                />
                            </div>
                        </div>
                    </motion.div>

                    {/* Quick Tip / CTA Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 }}
                        className="bg-gradient-to-br from-gold/10 to-gold/5 rounded-3xl border border-gold/20 p-6"
                    >
                        <div className="w-12 h-12 gold-gradient rounded-2xl flex items-center justify-center mb-4 shadow-luxury">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-serif text-lg italic text-charcoal mb-2">Consiglio del Giorno</h3>
                        <p className="text-charcoal/60 text-sm mb-4 leading-relaxed">
                            Completa almeno 2 lezioni dell'Academy oggi per sbloccare il badge "Apprendista Sovrano"!
                        </p>
                        <Link
                            href="/dashboard/academy"
                            className="flex items-center gap-2 text-gold text-xs font-bold uppercase tracking-wider hover:gap-3 transition-all"
                        >
                            Vai all'Academy <ArrowRight className="w-4 h-4" />
                        </Link>
                    </motion.div>

                    {/* Upgrade CTA for free users */}
                    {user?.plan_tier === 'curioso' && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35 }}
                            className="bg-charcoal rounded-3xl p-6 text-center"
                        >
                            <Target className="w-10 h-10 text-gold mx-auto mb-4" />
                            <h3 className="font-serif text-xl italic text-white mb-2">Sblocca il Pieno Potenziale</h3>
                            <p className="text-white/40 text-sm mb-5">
                                Passa a un piano Pro per messaggi illimitati e canali multipli
                            </p>
                            <Link
                                href="/dashboard/billing"
                                className="block w-full py-3 gold-gradient rounded-xl text-white font-bold text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform shadow-luxury"
                            >
                                Vedi Piani →
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
