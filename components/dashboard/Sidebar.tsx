"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Users,
    MessageSquare,
    Settings,
    BarChart3,
    LogOut,
    Zap,
    CreditCard,
    Radio,
    Menu,
    X,
    School,
    Crown,
    Gift,
    GraduationCap,
    Cpu,
    Flame,
    Send,
    Award,
    ShieldCheck
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Plan display config
const PLAN_DISPLAY: Record<string, { name: string; icon: any; color: string }> = {
    'curioso': { name: 'Piano Gratuito', icon: Gift, color: 'text-emerald-500' },
    'esploratore': { name: 'Esploratore', icon: Zap, color: 'text-gold' },
    'pioniere': { name: 'Pioniere', icon: Zap, color: 'text-gold' },
    'conquistatore': { name: 'Conquistatore', icon: Zap, color: 'text-gold' },
    'imperatore': { name: 'Imperatore', icon: Crown, color: 'text-gold' },
};

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Users, label: 'Leads', href: '/dashboard/leads' },
    { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/chat' },
    { icon: Radio, label: 'Canali', href: '/dashboard/channels' },
    { icon: School, label: 'Founder Academy', href: '/dashboard/academy' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
    { icon: Settings, label: 'Impostazioni', href: '/dashboard/settings' },
];

interface UserPlanInfo {
    tier: string;
    isFounder: boolean;
    messagesUsed: number;
    messagesLimit: number;
}

import { useSovereign } from '@/components/providers/SovereignProvider';

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const { user } = useSovereign();

    const userPlan = {
        tier: user?.plan_tier || 'curioso',
        isFounder: user?.is_founder || false,
        messagesUsed: user?.messages_used_this_month || 0,
        messagesLimit: user?.messages_limit || 100,
        xp: user?.xp || 0,
        level: user?.level || 1
    };

    // Detect screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth >= 1024) {
                setIsOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Close sidebar when route changes on mobile
    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        }
    }, [pathname, isMobile]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    const SidebarContent = () => (
        <>
            <div className="p-6 lg:p-10 mb-6 lg:mb-12">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 lg:gap-4">
                        <div className="w-10 h-10 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold text-xl shadow-luxury">V</div>
                        <div className="flex flex-col">
                            <span className="font-serif text-lg lg:text-xl tracking-wider text-charcoal">VirtualTwin</span>
                            <span className="text-[7px] uppercase tracking-[0.3em] lg:tracking-[0.4em] text-gold font-black">Sovereign Edition</span>
                        </div>
                    </div>
                    {/* Close button for mobile */}
                    {isMobile && (
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-2 rounded-full hover:bg-charcoal/5 transition-colors lg:hidden"
                        >
                            <X className="w-5 h-5 text-charcoal/40" />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-4 lg:px-6 space-y-1 lg:space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => isMobile && setIsOpen(false)}
                            className={cn(
                                "flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-300 group",
                                isActive
                                    ? "bg-gold/10 text-gold"
                                    : "text-charcoal/50 hover:text-charcoal hover:bg-white/50"
                            )}
                        >
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-300 group-hover:scale-110 flex-shrink-0",
                                isActive ? "text-gold" : "text-charcoal/30 group-hover:text-gold/50"
                            )} />
                            <span className="text-[11px] lg:text-[10px] uppercase tracking-[0.15em] lg:tracking-[0.2em] font-bold">{item.label}</span>
                            {isActive && (
                                <div className="ml-auto w-2 h-2 rounded-full bg-gold shadow-[0_0_10px_#D4AF37]" />
                            )}
                        </Link>
                    );
                })}

                {user?.role === 'admin' && (
                    <Link
                        href="/admin"
                        onClick={() => isMobile && setIsOpen(false)}
                        className="flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 rounded-xl lg:rounded-2xl text-gold/60 hover:text-gold hover:bg-gold/10 transition-all group mt-4 border border-gold/10"
                    >
                        <ShieldCheck className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        <span className="text-[10px] uppercase tracking-[0.2em] font-black">Admin Cockpit</span>
                    </Link>
                )}
            </nav>

            <div className="p-4 lg:p-6 mt-auto">
                <div className="bg-white/60 backdrop-blur-sm p-5 lg:p-6 rounded-2xl lg:rounded-3xl border border-gold/10 mb-4 lg:mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 blur-xl" />

                    {/* Sovereign Status Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                                <Crown className="w-4 h-4 text-gold" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[8px] uppercase tracking-widest text-gold font-black">Sovereign Rank</span>
                                <span className="text-[10px] font-bold text-charcoal">Livello {userPlan.level}</span>
                            </div>
                        </div>
                        <div className="text-[10px] font-mono text-gold/60">{userPlan.xp} XP</div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="h-1.5 bg-charcoal/5 rounded-full overflow-hidden mb-5">
                        <div
                            className="h-full gold-gradient transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                            style={{ width: `${(userPlan.xp % 1000) / 10}%` }} // Simplified XP/Level logic
                        />
                    </div>

                    {/* Badge Wall */}
                    {user?.badges && user.badges.length > 0 && (
                        <div className="mb-6">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-[8px] uppercase tracking-widest text-charcoal/30 font-black">Achievements</span>
                                <span className="text-[9px] font-bold text-gold">{user.badges.length}</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {user.badges.map((badgeId: string) => {
                                    const iconMap: any = {
                                        'pioniere_fondatore': Crown,
                                        'apprendista_sovrano': GraduationCap,
                                        'architetto_ai': Cpu,
                                        'sovereign_streak': Flame,
                                        'maestro_outreach': Send
                                    };
                                    const Icon = iconMap[badgeId] || Award;
                                    return (
                                        <div
                                            key={badgeId}
                                            className="w-7 h-7 rounded-lg bg-gold/5 border border-gold/10 flex items-center justify-center group relative cursor-help"
                                            title={badgeId.replace('_', ' ')}
                                        >
                                            <Icon className="w-3.5 h-3.5 text-gold/60 group-hover:text-gold transition-colors" />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Plan Header */}
                    <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4 relative pt-4 border-t border-charcoal/5">
                        {(() => {
                            const planConfig = PLAN_DISPLAY[userPlan.tier] || PLAN_DISPLAY['curioso'];
                            const PlanIcon = planConfig.icon;
                            return (
                                <>
                                    <PlanIcon className={`w-4 h-4 ${planConfig.color}`} />
                                    <span className={`text-[9px] lg:text-[9px] uppercase tracking-widest font-black ${planConfig.color}`}>
                                        {userPlan.isFounder ? 'Genesis Founder' : planConfig.name}
                                    </span>
                                </>
                            );
                        })()}
                    </div>

                    {/* Usage Info */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase tracking-wider font-bold text-charcoal/40">
                            <span>Messaggi AI</span>
                            <span>{userPlan.messagesUsed} / {userPlan.messagesLimit}</span>
                        </div>
                        <div className="h-1 bg-charcoal/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gold transition-all duration-300"
                                style={{ width: `${Math.min((userPlan.messagesUsed / userPlan.messagesLimit) * 100, 100)}%` }}
                            />
                        </div>
                    </div>
                </div>

                <button
                    onClick={async () => {
                        console.log('Logout initiative...');
                        await supabase.auth.signOut();
                        console.log('SignOut complete, redirecting...');
                        window.location.href = '/auth/login';
                    }}
                    className="flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 w-full text-charcoal/30 hover:text-red-400 transition-colors duration-300 text-[10px] uppercase tracking-[0.15em] lg:tracking-[0.2em] font-bold rounded-xl hover:bg-red-50"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0" />
                    <span>Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-4 left-4 z-[60] lg:hidden p-3 gold-gradient rounded-xl shadow-lg text-white"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Overlay */}
            {isOpen && isMobile && (
                <div
                    className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-[55] lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar - Desktop (fixed) / Mobile (slide-in) */}
            <aside
                className={cn(
                    "h-screen bg-champagne border-r border-charcoal/5 flex flex-col z-[60] transition-all duration-300",
                    // Desktop: fixed sidebar
                    "lg:fixed lg:left-0 lg:top-0 lg:w-72 xl:w-80",
                    // Mobile: slide-in drawer
                    "fixed top-0 w-72",
                    isMobile
                        ? (isOpen ? "left-0" : "-left-80")
                        : "left-0"
                )}
            >
                <SidebarContent />
            </aside>
        </>
    );
}
