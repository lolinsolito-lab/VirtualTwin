"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, MessageCircle, User, Bot, Sparkles } from 'lucide-react';

interface Message {
    role: 'user' | 'bot';
    content: string;
    timestamp: string;
}

const demoResponses: Record<string, string> = {
    "default": "Ciao! 👋 Sono Sarah, il clone demo di VirtualTwin. Chiedimi qualsiasi cosa sul prodotto, sui prezzi, o su come funziona!",
    "prezzo": "Abbiamo piani per tutti! 💫\n\n• **Curioso** (€0) - 14gg trial\n• **Esploratore** (€39/m) - 1K msg\n• **Pioniere** (€97/m) - 5K msg\n• **Conquistatore** (€197/m) - 20K msg\n• **Imperatore** (€595/m) - 50K msg\n\nTutti includono 14 giorni di prova gratuita! Quale ti interessa?",
    "funziona": "È semplicissimo! 🚀\n\n1. **2 min** - Rispondi a 5 domande sul tuo business\n2. **30 sec** - L'AI impara il tuo stile\n3. **2 min** - Collega WhatsApp con QR code\n\n**Totale: 5 minuti** e sei live! Vuoi provare adesso?",
    "whatsapp": "Sì! Mi integro perfettamente con WhatsApp Business API tramite 360dialog. 📱\n\nMa non solo! Funziono anche su:\n• Instagram DM\n• Facebook Messenger\n\nUn unico clone, tutti i canali. Vuoi vedere una demo?",
    "prova": "Perfetto! 🎉 Puoi iniziare la prova gratuita di 14 giorni cliccando il pulsante 'Inizia Gratis' in alto.\n\nNessuna carta richiesta. Nessun impegno. Se non ti piace, non paghi nulla.\n\nTi aspetto dall'altra parte! 🚀",
    "clone": "Un 'clone' è un'AI che parla **esattamente come te**. 🧠\n\nImpara:\n• Il tuo tono di voce\n• Le tue risposte tipiche\n• Il tuo modo di vendere\n\nI tuoi clienti pensano di parlare con te, ma sei libero di vivere la tua vita! Figo, no?",
    "ciao": "Ciao! 👋 Come posso aiutarti oggi? Chiedimi dei prezzi, come funziona, o qualsiasi altra cosa!",
    "grazie": "Di nulla! 🙏 Se hai altre domande, sono qui. Buona fortuna con il tuo business! 🚀"
};

const findResponse = (input: string): string => {
    const lower = input.toLowerCase();
    if (lower.includes('prezz') || lower.includes('cost') || lower.includes('quanto')) return demoResponses.prezzo;
    if (lower.includes('funzion') || lower.includes('come') || lower.includes('setup')) return demoResponses.funziona;
    if (lower.includes('whatsapp') || lower.includes('instagram') || lower.includes('canali')) return demoResponses.whatsapp;
    if (lower.includes('prova') || lower.includes('gratis') || lower.includes('trial')) return demoResponses.prova;
    if (lower.includes('clone') || lower.includes('cos\'è') || lower.includes('cosa')) return demoResponses.clone;
    if (lower.includes('ciao') || lower.includes('salve') || lower.includes('buon')) return demoResponses.ciao;
    if (lower.includes('grazie') || lower.includes('thanks')) return demoResponses.grazie;
    return "Interessante domanda! 🤔 Per una risposta dettagliata, ti consiglio di provare la versione completa. Clicca 'Inizia Gratis' per i tuoi 14 giorni di prova!";
};

export default function DemoChat() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', content: demoResponses.default, timestamp: 'Ora' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: 'Ora'
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        // Simulate typing delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

        const botResponse: Message = {
            role: 'bot',
            content: findResponse(input),
            timestamp: 'Ora'
        };

        setIsTyping(false);
        setMessages(prev => [...prev, botResponse]);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = [
        "Quanto costa?",
        "Come funziona?",
        "Prova gratuita?"
    ];

    return (
        <section className="py-24 lg:py-32 px-6 lg:px-12 bg-gradient-to-b from-white to-champagne">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 text-gold text-[9px] uppercase tracking-[0.5em] font-black bg-gold/5 px-5 py-2 rounded-full mb-6">
                        <MessageCircle className="w-3 h-3" />
                        Prova Tu Stesso
                    </span>
                    <h2 className="font-serif text-[2rem] md:text-[3rem] lg:text-[4rem] font-medium leading-[0.95] tracking-[-0.02em] text-charcoal mb-4">
                        Chatta con <span className="italic gold-text-gradient">Sarah</span>
                    </h2>
                    <p className="text-charcoal/50 text-lg max-w-xl mx-auto">
                        Il nostro clone demo. Fai qualsiasi domanda e vedi l'AI in azione.
                    </p>
                </div>

                {/* Chat Container */}
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white rounded-[2rem] shadow-2xl border border-charcoal/5 overflow-hidden">
                        {/* Chat Header */}
                        <div className="bg-gradient-to-r from-gold/10 to-gold/5 px-6 py-4 border-b border-charcoal/5 flex items-center gap-4">
                            <div className="relative">
                                <div className="w-12 h-12 gold-gradient rounded-full flex items-center justify-center text-white font-serif font-bold shadow-lg">
                                    S
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                            </div>
                            <div>
                                <p className="font-medium text-charcoal">Sarah • Clone Demo</p>
                                <p className="text-xs text-green-600 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                                    Online ora
                                </p>
                            </div>
                            <div className="ml-auto">
                                <span className="px-3 py-1 bg-gold/10 text-gold text-[9px] uppercase tracking-wider font-bold rounded-full">
                                    Demo
                                </span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="h-[400px] overflow-y-auto p-6 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-charcoal text-white' : 'gold-gradient text-white'}`}>
                                        {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                                    </div>
                                    <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-charcoal text-white rounded-tr-sm' : 'bg-champagne text-charcoal rounded-tl-sm'}`}>
                                        <p className="text-sm whitespace-pre-line">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 gold-gradient rounded-full flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-champagne rounded-2xl rounded-tl-sm px-4 py-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-gold/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Questions */}
                        <div className="px-6 pb-3 flex flex-wrap gap-2">
                            {quickQuestions.map((q, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setInput(q);
                                        setTimeout(() => handleSend(), 100);
                                    }}
                                    className="px-4 py-2 rounded-full border border-gold/20 text-gold text-xs font-medium hover:bg-gold hover:text-white transition-all"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-charcoal/5">
                            <div className="flex gap-3">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Scrivi un messaggio..."
                                    className="flex-1 px-5 py-4 rounded-full border border-charcoal/10 focus:outline-none focus:border-gold transition-colors text-sm"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim()}
                                    className="p-4 gold-gradient rounded-full text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Send className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Note */}
                    <p className="text-center text-charcoal/40 text-xs mt-6 flex items-center justify-center gap-2">
                        <Sparkles className="w-3 h-3" />
                        Questo è un demo con risposte pre-programmate. Il clone reale usa Gemini AI.
                    </p>
                </div>
            </div>
        </section>
    );
}
