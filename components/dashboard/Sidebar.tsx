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
    X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Users, label: 'Leads', href: '/dashboard/leads' },
    { icon: MessageSquare, label: 'AI Chat', href: '/dashboard/chat' },
    { icon: Radio, label: 'Canali', href: '/dashboard/channels' },
    { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
    { icon: CreditCard, label: 'Billing', href: '/dashboard/billing' },
    { icon: Settings, label: 'Impostazioni', href: '/dashboard/settings' },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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
            </nav>

            <div className="p-4 lg:p-6 mt-auto">
                <div className="bg-white/60 backdrop-blur-sm p-5 lg:p-6 rounded-2xl lg:rounded-3xl border border-gold/10 mb-4 lg:mb-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-gold/5 blur-xl" />
                    <div className="flex items-center gap-2 lg:gap-3 mb-3 lg:mb-4 relative">
                        <Zap className="w-4 h-4 text-gold" />
                        <span className="text-[9px] lg:text-[9px] uppercase tracking-widest text-gold font-black">Agency Plan</span>
                    </div>
                    <p className="text-[10px] lg:text-[10px] text-charcoal/50 leading-relaxed font-medium relative">943 messaggi elaborati questo mese.</p>
                </div>

                <button className="flex items-center gap-3 lg:gap-4 px-4 lg:px-6 py-3 lg:py-4 w-full text-charcoal/30 hover:text-red-400 transition-colors duration-300 text-[10px] uppercase tracking-[0.15em] lg:tracking-[0.2em] font-bold rounded-xl hover:bg-red-50">
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
