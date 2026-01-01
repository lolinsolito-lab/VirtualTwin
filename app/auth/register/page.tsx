"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Sparkles, User, Mail, Lock, Check } from 'lucide-react';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // 1. Signup the user in Supabase Auth
            // The trigger will auto-create the profile
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        company_name: companyName,
                    }
                }
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
                return;
            }

            if (authData.user) {
                // 2. Create the first default clone for the user
                // We do this here as a simple way to ensure every user has a clone 
                // for the sandbox chat to work immediately.
                await supabase.from('clones').insert({
                    user_id: authData.user.id,
                    name: 'Clone Principale',
                    business_name: companyName,
                    business_description: 'Azienda d\'Elite',
                    product_service: 'Servizi di Lusso',
                    is_active: true
                });

                // Profile is auto-created by trigger
                // Redirect to dashboard
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError("Errore durante la registrazione: " + err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-champagne flex items-center justify-center px-6 py-12 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className={`absolute top-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[150px] transition-all duration-[2000ms] ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>
                <div className={`absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] transition-all duration-[2500ms] delay-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}></div>

                {/* Floating Particles */}
                {[
                    { left: 10, top: 20, delay: 0 },
                    { left: 85, top: 30, delay: 1 },
                    { left: 20, top: 70, delay: 2 },
                    { left: 90, top: 80, delay: 0.5 },
                ].map((p, i) => (
                    <div
                        key={i}
                        className="absolute w-2 h-2 bg-gold/20 rounded-full animate-float"
                        style={{ left: `${p.left}%`, top: `${p.top}%`, animationDelay: `${p.delay}s` }}
                    />
                ))}
            </div>

            {/* Content */}
            <div className={`w-full max-w-md relative z-10 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <div className="w-16 h-16 gold-gradient rounded-full mx-auto flex items-center justify-center text-white font-serif text-3xl shadow-xl group-hover:scale-110 transition-transform">V</div>
                    </Link>
                </div>

                {/* Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-10 shadow-2xl border border-white/80">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-green-500" />
                            <span className="text-green-600 text-[9px] uppercase tracking-[0.4em] font-black">14 Giorni Gratis</span>
                        </div>
                        <h1 className="font-serif text-4xl text-charcoal mb-3 italic">Crea il Tuo <span className="gold-text-gradient">Clone.</span></h1>
                        <p className="text-charcoal/40 text-sm">Nessuna carta di credito richiesta</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-4 rounded-xl mb-8 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-5">
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Il Tuo Nome</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                                <input
                                    type="text"
                                    placeholder="Mario Rossi"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Nome Azienda</label>
                            <div className="relative">
                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                                <input
                                    type="text"
                                    placeholder="La Tua Azienda SRL"
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    required
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                />
                            </div>
                        </div>
                        <div>
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
                        <div>
                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/30" />
                                <input
                                    type="password"
                                    placeholder="Minimo 8 caratteri"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={8}
                                    className="w-full pl-12 pr-6 py-4 bg-white border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/10 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-5 gold-gradient text-white font-black uppercase tracking-[0.4em] rounded-xl hover:scale-[1.02] transition-all shadow-xl text-[11px] disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? 'Creazione in corso...' : (
                                <>
                                    Inizia Gratis
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Benefits */}
                    <div className="mt-8 space-y-3">
                        {[
                            "Setup in 5 minuti",
                            "Supporto italiano",
                            "Cancella quando vuoi"
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 text-charcoal/40 text-sm">
                                <Check className="w-4 h-4 text-green-500" />
                                {benefit}
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-charcoal/30 text-sm">
                            Hai già un account?{' '}
                            <Link href="/auth/login" className="text-gold font-bold hover:underline">
                                Accedi
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="mt-8 flex items-center justify-center gap-6 text-charcoal/30 text-[10px] uppercase tracking-wider">
                    <span>🔒 Dati protetti</span>
                    <span>✓ GDPR</span>
                    <span>🇮🇹 Made in Italy</span>
                </div>
            </div>
        </div>
    );
}
