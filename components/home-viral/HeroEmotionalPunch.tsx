"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, MapPin, Sparkles, Zap } from 'lucide-react';

/**
 * Hero Emotional Punch Component
 * 
 * STORYTELLING: 3AM vendita scenario - warm & outcome-focused
 * 
 * Usage: Homepage hero - emotional hook for cold audience
 */
export default function HeroEmotionalPunch() {
    const chapters = [
        {
            title: "Milano · Visione",
            location: "Porta Nuova Skyline",
            desc: "Addestramento neurale e scalabilità.",
            position: "object-top",
            mobilePosition: "left", // Show the person on the left
            icon: Zap
        },
        {
            title: "Roma · Storytelling",
            location: "Terrazza Colosseo",
            desc: "Empatia e vendita strategica.",
            position: "object-center",
            mobilePosition: "center", // Center the interaction
            icon: Sparkles
        },
        {
            title: "Firenze · Unicità",
            location: "Studio Artistico",
            desc: "Identità e voce inconfondibile.",
            position: "object-bottom",
            mobilePosition: "50%", // Center it horizontally to catch both figures
            icon: MapPin
        }
    ];
    return (
        <section className="relative z-10 py-20 md:py-32 bg-gradient-to-b from-champagne/30 via-white to-champagne/20">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto">
                    {/* The Jobs Timeline: Pure Silence & Magic */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5 }}
                        className="flex items-center justify-between max-w-2xl mx-auto mb-20 relative"
                    >
                        <div className="absolute inset-0 flex items-center px-8">
                            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
                        </div>

                        <div className="relative z-10 flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full border border-charcoal/10 bg-white flex items-center justify-center text-charcoal/40 group-hover:text-gold group-hover:border-gold transition-all duration-700">
                                <Moon className="w-5 h-5" />
                            </div>
                            <span className="mt-4 text-[9px] uppercase tracking-[0.4em] text-charcoal/30">Mondo</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center">
                            <div className="w-16 h-16 rounded-full bg-charcoal flex items-center justify-center shadow-2xl relative">
                                <div className="absolute inset-0 bg-gold/20 rounded-full animate-ping opacity-20" />
                                <Sparkles className="w-6 h-6 text-gold" />
                            </div>
                            <span className="mt-4 text-[10px] uppercase tracking-[0.5em] text-gold font-black">Genio</span>
                        </div>

                        <div className="relative z-10 flex flex-col items-center group">
                            <div className="w-12 h-12 rounded-full border border-charcoal/10 bg-white flex items-center justify-center text-charcoal/40 group-hover:text-gold group-hover:border-gold transition-all duration-700">
                                <Sun className="w-5 h-5" />
                            </div>
                            <span className="mt-4 text-[9px] uppercase tracking-[0.4em] text-charcoal/30">Casa</span>
                        </div>
                    </motion.div>

                    {/* Main Story */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center space-y-8"
                    >
                        {/* The Existential Shift */}
                        <div className="relative py-12 px-6">
                            <h1 className="font-serif text-5xl md:text-[8.5rem] text-charcoal mb-12 leading-[0.85] tracking-tighter">
                                Sii Ovunque. <br />
                                <span className="text-gold italic">Sii Libero.</span>
                            </h1>

                            <p className="text-xl md:text-3xl text-charcoal/40 max-w-4xl mx-auto leading-relaxed font-light italic mb-16 px-4">
                                "La tecnologia è la <span className="text-gold font-medium">magia invisibile</span> che hai sempre desiderato: <br />
                                <span className="text-charcoal/60">scala il mondo per te, mentre tu finalmente ti riprendi la tua vita."</span>
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 mt-20">
                            <div className="p-10 rounded-[3rem] bg-white border border-charcoal/5 shadow-2xl hover:border-gold/20 transition-all duration-1000 group">
                                <p className="text-[10px] uppercase tracking-[0.5em] text-charcoal/30 mb-6 group-hover:text-gold transition-colors">La Tecnica</p>
                                <p className="text-2xl font-serif text-charcoal leading-tight italic">
                                    "Il tuo Gemello Neurale non dorme. <br />
                                    Vende, educa, converte."
                                </p>
                            </div>
                            <div className="p-10 rounded-[3rem] bg-charcoal text-white shadow-2xl group overflow-hidden relative">
                                <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                                <p className="text-[10px] uppercase tracking-[0.5em] text-white/30 mb-6 group-hover:text-gold transition-colors">Il Risultato</p>
                                <p className="text-2xl font-serif text-white leading-tight italic relative z-10">
                                    "Tu resti in silenzio. <br />
                                    Il tuo business ruggisce."
                                </p>
                            </div>
                        </div>

                        {/* DIGITAL TWIN VISUAL - Responsive Strategy */}
                        <div className="mt-16 mb-20">
                            {/* PC VIEW: The Original Single Storyboard Strip */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="hidden md:block relative group rounded-[3rem] overflow-hidden border border-gold/30 shadow-luxury-gold"
                            >
                                <img
                                    src="/hero_storyboard.jpg"
                                    alt="VirtualTwin Cinematic Storyboard"
                                    className="w-full h-auto object-cover grayscale-[10%] group-hover:grayscale-0 transition-all duration-1000"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />

                                <div className="absolute bottom-8 left-0 right-0 px-8 text-center">
                                    <div className="inline-flex items-center gap-2 px-6 py-2.5 bg-charcoal/80 backdrop-blur-md rounded-full border border-gold/20 mb-4">
                                        <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                                        <span className="text-[10px] uppercase tracking-[0.4em] text-white/90 font-black px-2">
                                            Milano · Roma · Firenze
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* MOBILE/TABLET VIEW: The 3 Chapters Grid for Clarity */}
                            <div className="md:hidden grid grid-cols-1 gap-6">
                                {chapters.map((chapter, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="relative group rounded-[2.5rem] overflow-hidden border border-gold/20 shadow-xl bg-charcoal"
                                    >
                                        <div className="aspect-[16/10] relative">
                                            <img
                                                src="/hero_storyboard.jpg"
                                                alt={chapter.title}
                                                className={`absolute inset-0 w-full h-[300%] max-w-none ${chapter.position === 'object-top' ? 'top-0' : chapter.position === 'object-center' ? '-top-[100%]' : '-top-[200%]'} object-cover`}
                                                style={{ objectPosition: (chapter as any).mobilePosition }}
                                            />
                                            {/* Overlays */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-80" />

                                            {/* Info */}
                                            <div className="absolute bottom-6 left-6 right-6 text-left">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div className="p-1.5 rounded-lg bg-gold/20 backdrop-blur-md border border-gold/30">
                                                        <chapter.icon className="w-3.5 h-3.5 text-gold" />
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-[0.2em] font-black text-white/90">
                                                        {chapter.title}
                                                    </span>
                                                </div>
                                                <h4 className="text-white font-serif italic text-lg mb-1">{chapter.location}</h4>
                                                <p className="text-white/50 text-[10px] uppercase tracking-wider">{chapter.desc}</p>
                                            </div>

                                            {/* Badge - SPOSTATO A SINISTRA per non coprire i visi */}
                                            <div className="absolute top-4 left-4 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
                                                <span className="text-[8px] text-white/60 font-black uppercase tracking-widest italic font-sans">Chapter 0{index + 1}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Visual Narrative Footer Badge */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                className="mt-8 flex items-center justify-center gap-4"
                            >
                                <div className="h-px hidden md:block w-12 bg-gold/20" />
                                <p className="text-[10px] uppercase tracking-[0.4em] text-gold font-black">
                                    Presenza Sovrana · Ovunque. Sempre.
                                </p>
                                <div className="h-px hidden md:block w-12 bg-gold/20" />
                            </motion.div>
                        </div>

                        {/* The Silence - Punch Line removed for pure elegance */}
                        <div className="pt-24 flex flex-col items-center gap-8">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative group cursor-pointer"
                                onClick={() => {
                                    const pricing = document.getElementById('pricing');
                                    pricing?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            >
                                <div className="absolute -inset-1 bg-gold/20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity duration-1000" />
                                <div className="relative bg-charcoal text-white px-16 py-8 rounded-full border border-gold/20 hover:border-gold/50 transition-all duration-700">
                                    <span className="text-xs uppercase tracking-[0.6em] font-black text-gold mb-2 block">Inizia la Metamorfosi</span>
                                    <h4 className="text-2xl font-serif italic">Entra nel Futuro.</h4>
                                </div>
                            </motion.div>

                            <p className="text-[10px] uppercase tracking-[0.4em] text-charcoal/20">
                                Edizione Limitata · Wave Genesis
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div >
        </section >
    );
}
