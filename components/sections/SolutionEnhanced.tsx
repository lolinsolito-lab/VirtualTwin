"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Send, Bot, User } from 'lucide-react';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

const demoResponses: Record<string, string> = {
    "default": "Ciao! 👋 Sono Sarah, il clone demo. Chiedimi dei prezzi o come funziona!",
    "prezzo": "Abbiamo piani da €39/mese! 💫 Vuoi i dettagli?",
    "funziona": "Semplice! 5 domande → AI impara → QR WhatsApp → Live! 🚀",
    "whatsapp": "Sì! WhatsApp + Instagram + Messenger. Un clone, ovunque. 📱",
    "prova": "14 giorni gratis, no carta! Clicca 'Inizia Gratis' sopra 🎉",
    "ciao": "Ciao! 👋 Come posso aiutarti?",
};

const findResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('prezz') || lower.includes('cost') || lower.includes('quanto')) return demoResponses.prezzo;
    if (lower.includes('funzion') || lower.includes('come')) return demoResponses.funziona;
    if (lower.includes('whatsapp') || lower.includes('canali')) return demoResponses.whatsapp;
    if (lower.includes('prova') || lower.includes('gratis')) return demoResponses.prova;
    if (lower.includes('ciao') || lower.includes('salve')) return demoResponses.ciao;
    return "Interessante! 🤔 Prova la versione completa per risposte dettagliate.";
};

const SolutionEnhanced = () => {
    const [mounted, setMounted] = useState(false);
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Interactive Chat State
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: demoResponses.default }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        // Only scroll within the chat container, not the page
        if (messagesEndRef.current && messages.length > 1) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        setMessages(prev => [...prev, { role: 'user', content: input }]);
        setInput('');
        setIsTyping(true);

        await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 600));

        setIsTyping(false);
        setMessages(prev => [...prev, { role: 'bot', content: findResponse(input) }]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = ["Quanto costa?", "Come funziona?", "Prova gratis?"];

    return (
        <section ref={sectionRef} id="solution" className="py-20 lg:py-28 px-6 lg:px-12 bg-gradient-to-b from-white via-champagne to-champagne relative overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-[10%] w-[300px] h-[300px] bg-gold/5 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-[10%] w-[400px] h-[400px] bg-gold/3 rounded-full blur-[120px]"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* LEFT: STORYTELLING TEXT */}
                    <div className={`order-2 lg:order-1 transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
                        {/* Badge */}
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-gold/50"></div>
                            <span className="text-gold text-[9px] uppercase tracking-[0.4em] font-black bg-gold/5 px-4 py-2 rounded-full">
                                Ecco Come Funziona
                            </span>
                        </div>

                        {/* Headline */}
                        <h2 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-medium leading-[0.9] tracking-[-0.03em] text-charcoal mb-10">
                            Un Te <br />
                            <span className="italic bg-gradient-to-r from-gold via-[#E8D5A3] to-gold bg-clip-text text-transparent">
                                Che Non Dorme Mai.
                            </span>
                        </h2>

                        {/* Subtitle */}
                        <p className="text-charcoal/50 text-lg lg:text-xl font-serif italic leading-relaxed mb-12 max-w-lg">
                            Pensa al tuo miglior venditore. <span className="text-charcoal not-italic font-medium">Ora moltiplicalo per infinito</span>.
                            Un clone che conosce ogni risposta, ogni obiezione, ogni chiusura.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {[
                                { emoji: "⚡", title: "Risponde prima che finiscano di digitare", desc: "Meno di 2 secondi, sempre" },
                                { emoji: "🎯", title: "Capisce chi vale il tuo tempo", desc: "Qualifica automaticamente ogni lead" },
                                { emoji: "🎭", title: "Usa le tue parole, il tuo stile", desc: "Nessuno saprà la differenza" },
                                { emoji: "🌙", title: "Lavora mentre sogni", desc: "24 ore, 7 giorni, 365 giorni" }
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 group cursor-default p-3 -mx-3 rounded-xl hover:bg-white/60 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                                        <span className="text-lg">{feature.emoji}</span>
                                    </div>
                                    <div>
                                        <p className="text-charcoal font-medium text-sm">{feature.title}</p>
                                        <p className="text-charcoal/50 text-xs">{feature.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: INTERACTIVE SARAH CHAT */}
                    <div className={`order-1 lg:order-2 relative transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-gold/5 blur-[60px] scale-110"></div>

                        <div className="relative bg-white rounded-[2rem] shadow-2xl border border-charcoal/5 overflow-hidden">
                            {/* Chat Header */}
                            <div className="bg-gradient-to-r from-gold/10 to-gold/5 px-5 py-4 border-b border-charcoal/5 flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-11 h-11 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold shadow-lg">
                                        S
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-charcoal text-sm">Sarah • Clone Demo</p>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Online ora
                                    </p>
                                </div>
                                <span className="px-2.5 py-1 bg-gold/10 text-gold text-[8px] uppercase tracking-wider font-bold rounded-full">
                                    Prova
                                </span>
                            </div>

                            {/* Messages */}
                            <div className="h-[280px] overflow-y-auto p-4 space-y-3">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-charcoal text-white' : 'gold-gradient text-white'}`}>
                                            {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.role === 'user' ? 'bg-charcoal text-white rounded-tr-sm' : 'bg-champagne text-charcoal rounded-tl-sm'}`}>
                                            <p className="text-sm">{msg.content}</p>
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex gap-2">
                                        <div className="w-7 h-7 gold-gradient rounded-full flex items-center justify-center">
                                            <Bot className="w-3.5 h-3.5 text-white" />
                                        </div>
                                        <div className="bg-champagne rounded-2xl rounded-tl-sm px-4 py-2.5">
                                            <div className="flex gap-1">
                                                <span className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-1.5 h-1.5 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Quick Questions */}
                            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                                {quickQuestions.map((q, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setInput(q);
                                            setTimeout(() => handleSend(), 50);
                                        }}
                                        className="px-3 py-1.5 rounded-full border border-gold/20 text-gold text-[10px] font-medium hover:bg-gold hover:text-white transition-all"
                                    >
                                        {q}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <div className="p-3 border-t border-charcoal/5">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Scrivi un messaggio..."
                                        className="flex-1 px-4 py-3 rounded-full border border-charcoal/10 focus:outline-none focus:border-gold transition-colors text-sm"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!input.trim()}
                                        className="p-3 gold-gradient rounded-full text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Floating Stats */}
                        <div className="absolute -bottom-3 -left-3 lg:-left-6 bg-white rounded-xl shadow-xl p-3 border border-charcoal/5">
                            <p className="text-[8px] text-charcoal/50 uppercase tracking-wider font-bold">Risposta in</p>
                            <p className="text-2xl font-serif text-charcoal">&lt;2<span className="text-gold text-sm">s</span></p>
                        </div>

                        <div className="absolute -top-3 -right-3 lg:-right-6 bg-white rounded-xl shadow-xl p-3 border border-charcoal/5">
                            <p className="text-[8px] text-charcoal/50 uppercase tracking-wider font-bold">Mentre dormivi</p>
                            <p className="text-2xl font-serif text-gold">+3<span className="text-charcoal/40 text-sm"> lead</span></p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SolutionEnhanced;
