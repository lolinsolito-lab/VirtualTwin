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
    PieChart
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const adminNavItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/admin' },
    { icon: TrendingUp, label: 'Revenue', href: '/admin/revenue' },
    { icon: PieChart, label: 'Costs', href: '/admin/costs' },
    { icon: Users, label: 'Users', href: '/admin/users' },
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
            <div className="p-6 lg:p-10 mb-6 lg:mb-10">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-white to-gold flex items-center justify-center text-black font-serif font-bold text-xl shadow-[0_0_20px_rgba(212,175,55,0.3)] rounded-full">G</div>
                        <div className="flex flex-col">
                            <span className="font-serif text-lg tracking-wider text-white">God Mode</span>
                            <span className="text-[7px] uppercase tracking-[0.4em] text-gold font-black">Admin Cockpit</span>
                        </div>
                    </div>
                    {isMobile && (
                        <button onClick={() => setIsOpen(false)} className="p-2 text-white/40 hover:text-white lg:hidden">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            <nav className="flex-1 px-4 lg:px-6 space-y-2">
                {adminNavItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                                isActive
                                    ? "bg-gold/10 text-gold shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]"
                                    : "text-white/40 hover:text-white hover:bg-white/5"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold shadow-[0_0_15px_#D4AF37]" />
                            )}
                            <item.icon className={cn(
                                "w-5 h-5 transition-transform duration-500 group-hover:scale-110",
                                isActive ? "text-gold" : "text-white/20 group-hover:text-gold"
                            )} />
                            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 mt-auto">
                <div className="bg-gold/5 border border-gold/10 p-6 rounded-[2rem] mb-8 relative group cursor-pointer hover:bg-gold/10 transition-colors">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="w-4 h-4 text-gold" />
                        <span className="text-[9px] uppercase tracking-widest text-gold font-black">Security: Active</span>
                    </div>
                    <p className="text-[10px] text-white/40 leading-relaxed uppercase tracking-tighter">Everything is under control, Sovereign.</p>
                </div>

                <Link
                    href="/dashboard"
                    className="flex items-center gap-4 px-6 py-4 w-full text-white/30 hover:text-white transition-all duration-300 text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl hover:bg-white/5"
                >
                    <Zap className="w-5 h-5 text-gold/40" />
                    <span>User Sidebar</span>
                </Link>

                <button className="flex items-center gap-4 px-6 py-4 w-full text-white/20 hover:text-red-400 transition-all duration-300 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
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
                className="fixed top-4 left-4 z-[60] lg:hidden p-3 bg-gold text-black rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
                <Menu className="w-5 h-5" />
            </button>

            {isOpen && isMobile && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[55] lg:hidden" onClick={() => setIsOpen(false)} />
            )}

            <aside className={cn(
                "h-screen bg-[#050505] border-r border-white/5 flex flex-col z-[60] transition-all duration-500",
                "lg:fixed lg:left-0 lg:top-0 lg:w-72 xl:w-80",
                "fixed top-0 w-72",
                isMobile ? (isOpen ? "left-0 shadow-[0_0_50px_rgba(0,0,0,1)]" : "-left-80") : "left-0"
            )}>
                <SidebarContent />
            </aside>
        </>
    );
}
