'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Crown, Users, ArrowRight, Check, Star, Lock } from 'lucide-react';
import { getCurrentWave, getCurrentWaveSpotsRemaining, getTotalFounderSpots, Wave, WAVES, isPreLaunch } from '@/lib/waves';
import FounderHeroEmotional from '@/components/founder-viral/FounderHeroEmotional';
import ScarcityTimeline from '@/components/founder-viral/ScarcityTimeline';
import FounderTestimonials from '@/components/founder-viral/FounderTestimonials';
import FounderFAQ from '@/components/founder-viral/FounderFAQ';
import PhilosophyAdvantage from '@/components/founder-viral/PhilosophyAdvantage';
import PricingUltimate from '@/components/sections/PricingUltimate';

export default function FounderPage() {
    const [spotsLeft, setSpotsLeft] = useState(20);
    const [totalSpots, setTotalSpots] = useState(60);
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [currentWave, setCurrentWave] = useState<Wave | null>(null);
    const [isSoldOut, setIsSoldOut] = useState(false);
    const [isFounderOpen, setIsFounderOpen] = useState(false);
    const [isBeforeLaunch, setIsBeforeLaunch] = useState(true);

    useEffect(() => {
        async function fetchData() {
            const [wave, remaining, total] = await Promise.all([
                getCurrentWave(),
                getCurrentWaveSpotsRemaining(),
                getTotalFounderSpots()
            ]);

            const beforeLaunch = isPreLaunch();
            setCurrentWave(wave);
            setSpotsLeft(remaining);
            setTotalSpots(total);
            setIsBeforeLaunch(beforeLaunch);

            // Founder is open if wave exists AND is founder tier
            const founderOpen = wave !== null && wave.tier === 'founder';
            setIsFounderOpen(founderOpen);

            // SOLD OUT only if NOT pre-launch AND remaining = 0
            setIsSoldOut(!beforeLaunch && remaining === 0);

            // Countdown to Genesis deadline
            const deadline = new Date('2026-03-31T23:59:59');
            const now = new Date();
            const diff = deadline.getTime() - now.getTime();
            if (diff > 0) {
                setTimeLeft({
                    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / (1000 * 60)) % 60),
                    seconds: Math.floor((diff / 1000) % 60),
                });
            }
        }
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFCFB]">
            {/* Top Banner */}
            <div className="bg-charcoal text-white text-center py-3 text-sm font-medium">
                {!isSoldOut ? (
                    <>
                        <span className="animate-pulse">🔥</span> {currentWave?.nameFull} · Solo {spotsLeft} Posti Rimasti · Chiusura: 31 Marzo 2026 · Prezzo Bloccato LIFETIME
                    </>
                ) : (
                    <>
                        <Lock className="w-4 h-4 inline-block mr-2" />
                        Programma Founder Chiuso · I Prezzi Pubblici Sono Ora Attivi
                    </>
                )}
            </div>

            {/* Main Container */}
            <div className="">
                {/* HERO EMOTIONAL */}
                <FounderHeroEmotional
                    spotsLeft={spotsLeft}
                    totalSpots={totalSpots}
                    isBeforeLaunch={isBeforeLaunch}
                />

                {/* Countdown Section - Only show if Founder open */}
                {isFounderOpen && (
                    <div className="max-w-4xl mx-auto px-6 -mt-10 relative z-20">
                        <div className="bg-charcoal border border-white/5 rounded-[2.5rem] p-8 md:p-12 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.3)]">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-8">
                                {[
                                    { value: timeLeft.days, label: 'Giorni' },
                                    { value: timeLeft.hours, label: 'Ore' },
                                    { value: timeLeft.minutes, label: 'Minuti' },
                                    { value: timeLeft.seconds, label: 'Secondi' },
                                ].map((item, i) => (
                                    <div key={i} className="relative group">
                                        <div className="text-4xl md:text-5xl lg:text-6xl font-serif text-white group-hover:text-gold transition-colors">
                                            {String(item.value).padStart(2, '0')}
                                        </div>
                                        <div className="text-[10px] uppercase tracking-[0.2em] font-black text-white/30 mt-2">{item.label}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row justify-center items-center gap-12 pt-8 border-t border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Users className="w-5 h-5 text-gold" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">{spotsLeft}</div>
                                        <div className="text-[10px] uppercase font-black text-white/30 tracking-widest">posti rimasti</div>
                                    </div>
                                </div>
                                <div className="hidden md:block w-px h-12 bg-white/10" />
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Star className="w-5 h-5 text-gold" />
                                    </div>
                                    <div className="text-left">
                                        <div className="text-2xl font-bold text-white">€78,000</div>
                                        <div className="text-[10px] uppercase font-black text-white/30 tracking-widest">risparmio 5 anni</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PHILOSOPHY SECTION */}
                <PhilosophyAdvantage />

                {/* ============================================= */}
                {/* PRICING - Uses PricingUltimate Component */}
                {/* pricingMode='founder' ensures founder prices */}
                {/* ============================================= */}
                <PricingUltimate pricingMode="founder" />

                {/* SCARCITY TIMELINE - Show price escalation */}
                <ScarcityTimeline />

                {/* FOUNDER TESTIMONIALS - Social proof */}
                <FounderTestimonials />

                {/* FAQ - Handle objections */}
                <FounderFAQ />

                {/* FINAL CTA */}
                <div className="max-w-4xl mx-auto px-6 py-20 pb-20">
                    <div className="relative group overflow-hidden bg-charcoal text-white rounded-[3rem] p-12 md:p-16 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] text-center">
                        {/* Interactive Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent opacity-50 group-hover:scale-110 transition-transform duration-1000" />

                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif italic mb-8 leading-tight">
                                {isFounderOpen ? (
                                    <>
                                        Entra nel cerchio ristretto <br />
                                        che <span className="text-gold">possiede</span> il Futuro.
                                    </>
                                ) : (
                                    <>
                                        Inizia Oggi con <br />
                                        14 Giorni di Prova
                                    </>
                                )}
                            </h2>

                            <p className="text-xl mb-12 text-white/50 max-w-2xl mx-auto leading-relaxed">
                                {isFounderOpen
                                    ? `Solo ${totalSpots} posti disponibili. Una volta chiusa la Genesis Wave, non ci sarà modo di rientrare a queste condizioni.`
                                    : 'Prova l\'esperienza VirtualTwin completa per 14 giorni. Nessun impegno, solo risultati.'}
                            </p>

                            <div className="flex flex-col items-center gap-6">
                                <a
                                    href="#pricing"
                                    className="group/btn inline-flex items-center gap-4 gold-gradient text-white px-12 py-6 rounded-2xl text-xl font-black uppercase tracking-[0.1em] hover:scale-105 transition-all shadow-[0_20px_40px_-10px_rgba(212,175,55,0.4)]"
                                >
                                    {isFounderOpen ? 'BLOCCA ORA IL TUO POSTO' : 'INIZIA ORA'}
                                    <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                                </a>

                                <div className="flex items-center gap-8 text-white/30 text-xs font-black uppercase tracking-[0.2em]">
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Nessuna Carta Richiesta</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> 14 Giorni Trial</span>
                                    <span className="flex items-center gap-2"><Check className="w-3 h-3 text-gold" /> Cancella Ora</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Links */}
                    <div className="text-center mt-12 mb-20">
                        <Link href="/" className="inline-flex items-center gap-3 text-charcoal/40 hover:text-gold transition-colors font-black tracking-widest uppercase text-[10px]">
                            <ArrowRight className="w-3 h-3 rotate-180" />
                            Torna alla Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
