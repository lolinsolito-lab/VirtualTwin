"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Send, Bot, User, Brain, Target, Shield, Zap } from 'lucide-react';

interface Message {
    role: 'user' | 'bot';
    content: string;
}

const demoResponses: Record<string, string> = {
    "default": "Buongiorno. 👋 Sono il Clone AI di Sarah. Chiedimi come posso gestire i tuoi lead, automatizzare le vendite o liberarmi il tempo.",
    "prezzo": "L'accesso alla Genesis Wave parte da €147/m (bloccato a vita). Un investimento che si ripaga con la prima vendita automatizzata. 📈",
    "funziona": "10 min di setup: Rispondi a 15 domande → Il sistema assorbe il tuo stile → Sei online su WhatsApp. Semplice. Invisibile. ♾️",
    "whatsapp": "Sempre attivo su WhatsApp e IG. Risponde, educa e vende col tuo tono di voce, 24/7. 📱",
    "prova": "14 giorni di test reale. Nessun rischio, solo la prova concreta che puoi scalare senza lavorare di più. 🌱",
    "ciao": "Buongiorno. 👋 Come posso aiutarti a scalare il tuo business oggi?",
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
                                Provalo Subito →
                            </span>
                        </div>

                        {/* Headline */}
                        <h2 className="font-serif text-[2.5rem] md:text-[4rem] lg:text-[5rem] font-medium leading-[0.9] tracking-[-0.03em] text-charcoal mb-10">
                            L'Infinità <br />
                            <span className="italic bg-gradient-to-r from-gold via-[#E8D5A3] to-gold bg-clip-text text-transparent">
                                di Te.
                            </span>
                        </h2>

                        {/* Subtitle */}
                        <p className="text-charcoal/50 text-lg lg:text-xl font-serif italic leading-relaxed mb-12 max-w-lg">
                            La tua visione non ha orari. <span className="text-charcoal not-italic font-medium">Il tuo Gemello non ha limiti biologici</span>.
                            Un'essenza che custodisce ogni tua parola, ogni tua intuizione, ogni tua chiusura.
                        </p>

                        {/* Features */}
                        <div className="space-y-4">
                            {[
                                { icon: Brain, title: "Intuizione Neurale d'Élite", desc: "Meno di 2 secondi per risposte indistinguibili dalla tua mente." },
                                { icon: Target, title: "Setaccio dei Desideri", desc: "Separa istantaneamente i curiosi dai buyer reali con eleganza." },
                                { icon: Shield, title: "Inviolabilità del Brand", desc: "Custodisce il tuo stile e la tua etica in ogni singola sillaba." },
                                { icon: Zap, title: "Ubiquità Permanente", desc: "L'Impero cresce nel silenzio, mentre tu riprendi il tuo tempo." }
                            ].map((feature, i) => (
                                <div
                                    key={i}
                                    className="flex items-start gap-4 group cursor-default p-3 -mx-3 rounded-xl hover:bg-white/60 transition-all duration-300"
                                >
                                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:scale-110 transition-all duration-300 flex-shrink-0">
                                        <feature.icon className="w-5 h-5 text-gold group-hover:text-white transition-colors" />
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
                                    <p className="font-medium text-charcoal text-sm">Identità Neurale</p>
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                        Sincronizzazione Attiva
                                    </p>
                                </div>
                                <span className="px-2.5 py-1 bg-green-100 text-green-700 text-[8px] uppercase tracking-wider font-bold rounded-full">
                                    Demo Live
                                </span>
                            </div>

                            {/* Messages */}
                            <div className="h-[280px] overflow-y-auto p-4 space-y-3">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-charcoal text-white' : 'gold-gradient text-white'}`}>
                                            {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-charcoal text-white rounded-tr-none' : 'bg-white border border-charcoal/5 rounded-tl-none shadow-sm'}`}>
                                            <p className="text-sm md:text-base">{msg.content}</p>

                                            {/* VIRAL TRIGGER #1 & #2: AI Signature & Powered By */}
                                            {msg.role === 'assistant' && (
                                                <div className="mt-4 pt-3 border-t border-charcoal/5 flex flex-col gap-2">
                                                    <p className="text-[10px] text-charcoal/30 flex items-center gap-1">
                                                        <span className="inline-block w-1 h-1 bg-green-500 rounded-full animate-pulse"></span>
                                                        Risposta via VirtualTwin AI · Sarah ha risparmiato 15h questa settimana
                                                    </p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-gold opacity-50">Powered by VirtualTwin</span>
                                                        <button className="text-[9px] font-bold text-blue-600 hover:underline">Voglio il mio Clone AI →</button>
                                                    </div>
                                                </div>
                                            )}
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

                        {/* Explainer Note */}
                        <div className="mt-6 bg-gradient-to-r from-gold/5 to-champagne/20 rounded-2xl p-5 border border-gold/20">
                            <p className="text-charcoal/80 text-sm leading-relaxed">
                                <strong className="text-gold">👆 Questa è pura magia tecnologica.</strong><br />
                                Sarah ha creato la sua <strong className="text-charcoal">Identità Neurale</strong> che governa il mercato per lei 24/7.<br />
                                <span className="text-charcoal/60 text-xs">Mettila alla prova. È esattamente l'effetto che farà il TUO Gemello.</span>
                            </p>
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
        </section >
    );
};

export default SolutionEnhanced;
