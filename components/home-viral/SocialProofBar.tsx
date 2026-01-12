"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Users, TrendingUp, MessageSquare, ShieldCheck, Cpu } from 'lucide-react';

import { getFoundersSold } from '@/lib/waves';

export default function SocialProofBar() {
    const [foundersCount, setFoundersCount] = React.useState(0);

    React.useEffect(() => {
        const fetchFounders = async () => {
            const sold = await getFoundersSold();
            setFoundersCount(sold);
        };
        fetchFounders();

        // Simula la crescita "Live" ogni tanto
        const interval = setInterval(() => {
            setFoundersCount(prev => prev + (Math.random() > 0.9 ? 1 : 0));
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const stats = [
        {
            value: foundersCount.toString(),
            label: "Founder Wave Genesis",
            icon: Users
        },
        {
            value: "1.2M+",
            label: "Messaggi per Addestramento",
            icon: MessageSquare
        },
        {
            value: "24/7",
            label: "Operatività Neurale",
            icon: TrendingUp
        }
    ];

    return (
        <section className="relative z-20 py-16 bg-gradient-to-b from-charcoal to-charcoal/95 border-b border-white/5">
            <div className="container mx-auto px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-gold text-[10px] uppercase tracking-[0.4em] font-black mb-4">
                            Dall'Idea alla Realtà Digitale
                        </p>
                        <h2 className="font-serif text-2xl md:text-3xl text-white italic">
                            Sviluppato con <span className="text-gold">Tecnologia AI d'Avanguardia</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="flex flex-col items-center md:items-start text-center md:text-left"
                            >
                                <div className="flex items-center gap-4 mb-2">
                                    <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center border border-gold/20">
                                        <stat.icon className="w-5 h-5 text-gold" />
                                    </div>
                                    <span className="text-4xl md:text-5xl font-black text-white font-serif italic tracking-tight">
                                        {stat.value}
                                    </span>
                                </div>
                                <p className="text-gold/60 text-[10px] uppercase font-black tracking-[0.4em] ml-14">
                                    {stat.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 pt-10 border-t border-white/10 flex flex-col md:flex-row items-center justify-center gap-8 opacity-40 grayscale contrast-125">
                        <span className="text-[10px] uppercase tracking-[0.6em] text-white/40 font-black mb-4 md:mb-0">Powered by Elite Ecosystem:</span>
                        <div className="flex flex-wrap items-center justify-center gap-12">
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-white" />
                                <span className="text-white font-serif text-xl italic opacity-80 uppercase tracking-widest">Meta</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Cpu className="w-4 h-4 text-white" />
                                <span className="text-white font-serif text-xl italic opacity-80 uppercase tracking-widest">OpenAI</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-serif text-xl italic opacity-80 uppercase tracking-widest">Stripe</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-white font-serif text-xl italic opacity-80 uppercase tracking-widest">WhatsApp</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Elegant Background Accents */}
            <div className="absolute top-0 right-0 w-64 h-full bg-gold/5 blur-[80px] -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-full bg-white/5 blur-[60px] -z-10" />
        </section>
    );
}
