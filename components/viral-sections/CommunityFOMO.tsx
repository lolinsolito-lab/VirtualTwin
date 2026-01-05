"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, TrendingUp, Lock, ArrowRight } from 'lucide-react';

/**
 * Community FOMO Component
 * 
 * VIRAL-READY: Exclusivity messaging for "not just tool, but club" angle
 * 
 * Usage: FOMO ads, community-building content, exclusivity messaging
 */
export default function CommunityFOMO() {
    const communityPerks = [
        {
            icon: Users,
            title: "200+ Clone Founders",
            description: "Network esclusivo di imprenditori che vendono con AI",
            color: "from-purple-500 to-violet-500"
        },
        {
            icon: Zap,
            title: "Live Optimization Mensile",
            description: "Ogni mese scegliamo un Founder e ottimizziamo il suo Clone live davanti alla community",
            color: "from-blue-500 to-indigo-500"
        },
        {
            icon: TrendingUp,
            title: "Prompt Library Esclusiva",
            description: "Accesso ai prompt più performanti condivisi dai top performer",
            color: "from-green-500 to-emerald-500"
        }
    ];

    return (
        <section className="relative z-10 py-20 bg-gradient-to-b from-charcoal via-gray-900 to-charcoal overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gold rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="max-w-5xl mx-auto">
                    {/* Section Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 border border-gold/40 rounded-full mb-6">
                            <Lock className="w-4 h-4 text-gold" />
                            <span className="text-gold text-sm font-black uppercase tracking-wider">
                                Solo 500 posti disponibili
                            </span>
                        </div>

                        <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">
                            Non Compri Solo un Tool.
                            <br />
                            <span className="text-gold italic">Entri in un Club.</span>
                        </h2>

                        <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
                            VirtualTwin non è solo software. È la community di founder che hanno scelto di vendere con l'AI invece che passare la vita in chat.
                        </p>
                    </motion.div>

                    {/* Community Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid md:grid-cols-3 gap-6 mb-16"
                    >
                        {communityPerks.map((perk, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.15 }}
                                className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                            >
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${perk.color} flex items-center justify-center mb-4 shadow-xl`}>
                                    <perk.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-serif text-white font-bold mb-2">
                                    {perk.title}
                                </h3>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    {perk.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Community Screenshot Mockup */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-white/10 to-white/5 border-2 border-white/20 rounded-3xl p-8 mb-12 backdrop-blur-lg"
                    >
                        <div className="aspect-video bg-charcoal/50 rounded-2xl border border-white/10 flex items-center justify-center">
                            <div className="text-center">
                                <Users className="w-16 h-16 text-gold/50 mx-auto mb-4" />
                                <p className="text-white/40 text-sm italic">
                                    [Screenshot community Telegram/Discord]
                                </p>
                                <p className="text-white/30 text-xs mt-2">
                                    Conversazioni reali, strategie condivise, supporto 24/7
                                </p>
                            </div>
                        </div>
                    </motion.div>

                    {/* FOMO CTA */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="inline-flex flex-col items-center gap-6 bg-gradient-to-br from-gold/20 to-amber-500/20 border-2 border-gold/40 rounded-3xl p-10">
                            <div>
                                <p className="text-gold font-black text-sm uppercase tracking-wider mb-2">
                                    🔥 Posti Limitati
                                </p>
                                <p className="text-white text-3xl md:text-4xl font-serif mb-2">
                                    <strong className="text-gold">347</strong> / 500 Founder già dentro
                                </p>
                                <p className="text-white/60 text-sm">
                                    Rimangono <strong className="text-white">153 posti</strong> prima di chiudere l'accesso
                                </p>
                            </div>

                            <a
                                href="#pricing"
                                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-charcoal rounded-xl font-black text-lg uppercase tracking-wider hover:bg-amber-400 transition-all shadow-2xl hover:shadow-gold/50 hover:scale-105"
                            >
                                Entra nella Community
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </a>

                            <p className="text-white/40 text-xs italic">
                                Accesso a vita | Zero costi nascosti | Cancelli quando vuoi
                            </p>
                        </div>
                    </motion.div>

                    {/* Ad Angle Note */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.8 }}
                        className="mt-16 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-lg"
                    >
                        <h3 className="text-white font-black text-sm uppercase tracking-wider mb-3">
                            🎬 Ad Angle - "Club Esclusivo"
                        </h3>
                        <p className="text-white/70 text-sm leading-relaxed">
                            <strong className="text-gold">Hook:</strong> "Non vendere più solo software, vendi appartenenza."<br />
                            <strong className="text-gold">Body:</strong> Mostra screenshot community, testimonianze, live session.<br />
                            <strong className="text-gold">CTA:</strong> "Solo 153 posti disponibili. Entra ora o rimani fuori."
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
