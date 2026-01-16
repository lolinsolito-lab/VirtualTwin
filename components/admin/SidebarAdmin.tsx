"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    TrendingUp,
    Zap,
    Users,
    Activity,
    FileText,
    LogOut,
    Menu,
    X,
    ShieldCheck,
    PieChart,
    Gift,
    GraduationCap
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase } from '@/lib/supabase';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const adminNavItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: TrendingUp, label: 'Revenue', href: '/admin/revenue' },
    { icon: PieChart, label: 'Costs', href: '/admin/costs' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: Gift, label: 'Add-ons', href: '/admin/addons' },
    { icon: GraduationCap, label: 'Academy', href: '/admin/academy' },
    { icon: Activity, label: 'Health', href: '/admin/health' },
    { icon: FileText, label: 'Logs', href: '/admin/logs' },
];

export function SidebarAdmin() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    useEffect(() => {
        if (isMobile) {
            setIsOpen(false);
        }
    }, [pathname, isMobile]);

    const SidebarContent = () => (
        <>
            <div className="p-8 lg:p-12 mb-6 lg:mb-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-gradient-to-br from-white via-gold to-white flex items-center justify-center text-black font-serif font-black text-2xl shadow-[0_0_40px_rgba(212,175,55,0.4)] rounded-2xl rotate-3 hover:rotate-0 transition-transform duration-700">G</div>
                        <div className="flex flex-col">
                            <span className="font-serif text-2xl italic tracking-tight text-white drop-shadow-luxury leading-none">Cockpit</span>
                            <span className="text-[8px] uppercase tracking-[0.6em] text-gold font-black mt-1">Sovereign Mode</span>
                        </div>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white lg:hidden">
                            <X className="w-6 h-6" />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-6 lg:px-8 space-y-4">
                {adminNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                                isActive
                                    ? "bg-gold/10 text-gold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)] border border-gold/20"
                                    : "text-white/30 hover:text-white hover:bg-white/5 border border-transparent"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold shadow-[0_0_15px_#D4AF37]" />
                            )}
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                                isActive ? "text-gold" : "text-white/20 group-hover:text-gold"
                            )} />
                            <span className="text-[10px] uppercase tracking-[0.3em] font-black">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-8 mt-auto">
                <div className="bg-gradient-to-br from-gold/10 via-transparent to-transparent border border-gold/10 p-6 rounded-[2.5rem] mb-10 relative group cursor-pointer hover:bg-gold/15 transition-all">
                    <div className="flex items-center gap-3 mb-3">
                        <ShieldCheck className="w-4 h-4 text-gold animate-pulse" />
                        <span className="text-[9px] uppercase tracking-[0.4em] text-gold font-black">Security: Root</span>
                    </div>
                    <p className="text-[9px] text-white/40 leading-relaxed uppercase tracking-widest italic">All systems aligned with the Sovereign DNA.</p>
                </div>

                <Link
                    href="/dashboard"
                    className="flex items-center gap-4 px-6 py-4 w-full text-white/40 hover:text-white transition-all duration-500 text-[10px] uppercase tracking-[0.3em] font-black rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10"
                >
                    <Zap className="w-5 h-5 text-gold/40" />
                    <span>User Realm</span>
                </Link>

                <button
                    onClick={async () => {
                        console.log('SidebarAdmin: Exit Cockpit initiate...');
                        await supabase.auth.signOut();
                        console.log('SidebarAdmin: Logged out, redirecting...');
                        window.location.href = '/auth/login';
                    }}
                    className="flex items-center gap-4 px-6 py-4 w-full text-white/20 hover:text-red-400 transition-all duration-500 text-[10px] uppercase tracking-[0.3em] font-black mt-2"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Exit Cockpit</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed top-6 left-6 z-[60] lg:hidden p-4 bg-gold text-black rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)]"
            >
                <Menu className="w-6 h-6" />
            </button>

            {isOpen && isMobile && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[55] lg:hidden" onClick={() => setIsOpen(false)} />
            )}

            <aside className={cn(
                "h-screen bg-[#020202] border-r border-white/5 flex flex-col z-[60] transition-all duration-700",
                "lg:fixed lg:left-0 lg:top-0 lg:w-72 xl:w-80",
                "fixed top-0 w-80",
                isMobile ? (isOpen ? "left-0 shadow-[0_0_100px_rgba(0,0,0,1)]" : "-left-80") : "left-0"
            )}>
                <SidebarContent />
            </aside>
        </>
    );
}
