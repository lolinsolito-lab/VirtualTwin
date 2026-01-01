"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close menu on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    // Prevent scroll when menu is open
    useEffect(() => {
        if (menuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [menuOpen]);

    const navLinks = [
        { id: 'problem', label: 'La Tua Sfida' },
        { id: 'solution', label: 'Zero Stress' },
        { id: 'pricing', label: 'Inizia Gratis' },
    ];

    const scrollToSection = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            const offset = 80; // Offset for navbar height
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <>
            <nav className={`fixed top-8 w-full z-[90] px-4 sm:px-6 lg:px-24 py-4 lg:py-5 flex justify-between items-center transition-all duration-500 ${scrolled ? 'bg-champagne/95 backdrop-blur-xl border-b border-charcoal/5 shadow-sm' : 'bg-transparent'}`}>
                {/* Logo */}
                <Link href="/" className="flex items-center gap-3 lg:gap-4 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold text-base sm:text-lg lg:text-xl shadow-luxury border border-white/40 group-hover:scale-110 transition-transform duration-500">V</div>
                    <div className="flex flex-col">
                        <span className="font-serif text-xl sm:text-2xl lg:text-3xl tracking-tight font-medium text-charcoal leading-none italic transition-all group-hover:tracking-tighter">Virtual<span className="gold-text-gradient">twin</span></span>
                        <span className="text-[6px] sm:text-[7px] lg:text-[8px] uppercase tracking-[0.4em] sm:tracking-[0.5em] lg:tracking-[0.6em] text-gold mt-1 font-black opacity-60">Sovereign Edition</span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex gap-12 xl:gap-16 text-[10px] uppercase tracking-[0.4em] font-black text-charcoal/40">
                    {navLinks.map((link) => (
                        <button
                            key={link.id}
                            onClick={(e) => scrollToSection(e, link.id)}
                            className="hover:text-gold transition-all duration-300 relative group cursor-pointer"
                        >
                            {link.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gold group-hover:w-full transition-all duration-300"></span>
                        </button>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden sm:flex items-center gap-4">
                    <Link
                        href="/auth/login"
                        className="px-6 py-3 text-charcoal/60 text-[10px] uppercase tracking-[0.3em] font-black hover:text-gold transition-colors"
                    >
                        Accedi
                    </Link>
                    <Link
                        href="/auth/register"
                        className="px-8 lg:px-12 py-3 lg:py-4 rounded-full gold-gradient text-white text-[9px] lg:text-[10px] uppercase tracking-[0.3em] lg:tracking-[0.4em] font-black hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                        7 Giorni Gratis
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="sm:hidden p-2 rounded-xl bg-gold/10 text-gold"
                >
                    {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className="fixed inset-0 z-[90] bg-champagne sm:hidden">
                    <div className="flex flex-col items-center justify-center min-h-screen px-8 py-24">
                        {/* Mobile Nav Links */}
                        <nav className="flex flex-col items-center gap-8 mb-12">
                            {navLinks.map((link) => (
                                <button
                                    key={link.id}
                                    onClick={(e) => {
                                        scrollToSection(e, link.id);
                                        setMenuOpen(false);
                                    }}
                                    className="font-serif text-3xl italic text-charcoal hover:text-gold transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                        </nav>

                        {/* Mobile CTA */}
                        <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                            <Link
                                href="/auth/register"
                                onClick={() => setMenuOpen(false)}
                                className="w-full py-5 rounded-full gold-gradient text-white text-center text-[11px] uppercase tracking-[0.3em] font-black shadow-lg"
                            >
                                7 Giorni Gratis
                            </Link>
                            <Link
                                href="/auth/login"
                                onClick={() => setMenuOpen(false)}
                                className="w-full py-5 rounded-full border border-charcoal/10 text-charcoal text-center text-[11px] uppercase tracking-[0.3em] font-black"
                            >
                                Accedi
                            </Link>
                        </div>

                        {/* Mobile Footer */}
                        <p className="mt-12 text-charcoal/30 text-[10px] uppercase tracking-widest">
                            ✨ Per chi sogna in grande
                        </p>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
