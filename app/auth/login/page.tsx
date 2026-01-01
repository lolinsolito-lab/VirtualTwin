"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    return (
        <div className="min-h-screen bg-champagne flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px] transition-all duration-[2000ms] ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}></div>
                <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] transition-all duration-[2500ms] delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}></div>

                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.02]" style={{
                    backgroundImage: `
                        linear-gradient(rgba(212, 175, 55, 0.5) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(212, 175, 55, 0.5) 1px, transparent 1px)
                    `,
                    backgroundSize: '60px 60px'
                }}></div>
            </div>

            {/* Content */}
            <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Logo */}
                <div className="text-center mb-10">
                    <Link href="/" className="inline-block group">
                        <div className="w-16 h-16 gold-gradient rounded-full mx-auto flex items-center justify-center text-white font-serif text-3xl shadow-xl group-hover:scale-110 transition-transform">V</div>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/80">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-gold" />
                            <span className="text-gold text-[9px] uppercase tracking-[0.4em] font-black">Bentornato</span>
                        </div>
                        <h1 className="font-serif text-4xl text-charcoal mb-3 italic">Accedi al Tuo <span className="gold-text-gradient">Impero.</span></h1>
                        <p className="text-charcoal/40 text-sm">Riprendi il controllo delle tue vendite automatiche</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl mb-8 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="relative">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                                <input
                                    type="email"
                                    placeholder="email@azienda.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-charcoal/40 text-xs hover:text-gold transition-colors">
                                Password dimenticata?
                            </a>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 gold-gradient text-white font-black uppercase tracking-[0.4em] rounded-xl hover:scale-[1.02] transition-all shadow-xl text-[11px] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? 'Verifica in corso...' : (
                                <>
                                    Accedi
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-charcoal/30 text-sm">
                            Non hai ancora un account?{' '}
                            <Link href="/auth/register" className="text-gold font-bold hover:underline">
                                Inizia Gratis
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Bottom Link */}
                <div className="mt-8 text-center">
                    <Link href="/" className="text-charcoal/30 text-xs hover:text-gold transition-colors flex items-center justify-center gap-2">
                        ← Torna alla Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
