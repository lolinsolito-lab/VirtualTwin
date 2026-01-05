"use client";

import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, Zap, Check, Building2, FileText, CreditCard, Users, Languages, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [settings, setSettings] = useState({
        // Profile
        businessName: '',
        email: '',
        phone: '',

        // Company B2B Data
        companyLegalName: '',
        vatNumber: '',
        fiscalCode: '',
        sdiCode: '',
        pecEmail: '',

        // Billing Address
        billingAddress: '',
        billingCity: '',
        billingZip: '',
        billingProvince: '',
        billingCountry: 'Italia',

        // Preferences
        language: 'it',
        timezone: 'Europe/Rome',
        currency: 'EUR',
        aiTone: 'professionale',
        notifications: true,
        darkMode: false,

        // AI Personality
        customPersonality: '',
        faqs: [] as { id: number | string; question: string; answer: string }[],
    });

    useEffect(() => {
        async function loadSettings() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                // 1. Load Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                // 2. Load Clone Settings
                const { data: clone } = await supabase
                    .from('clones')
                    .select('*')
                    .eq('user_id', user.id)
                    .limit(1)
                    .single();

                if (profile) {
                    setSettings(prev => ({
                        ...prev,
                        businessName: profile.full_name || '',
                        email: user.email || '',
                        // Mapping metadata or other fields if available
                        companyLegalName: profile.metadata?.companyLegalName || '',
                        vatNumber: profile.metadata?.vatNumber || '',
                        fiscalCode: profile.metadata?.fiscalCode || '',
                        sdiCode: profile.metadata?.sdiCode || '',
                        pecEmail: profile.metadata?.pecEmail || '',
                        billingAddress: profile.metadata?.billingAddress || '',
                        billingCity: profile.metadata?.billingCity || '',
                        billingZip: profile.metadata?.billingZip || '',
                        billingProvince: profile.metadata?.billingProvince || '',
                        billingCountry: profile.metadata?.billingCountry || 'Italia',
                    }));
                }

                if (clone) {
                    setSettings(prev => ({
                        ...prev,
                        aiTone: clone.personality || 'professionale',
                        customPersonality: clone.metadata?.customPersonality || '',
                        faqs: clone.metadata?.faqs || [
                            { id: 1, question: '', answer: '' },
                            { id: 2, question: '', answer: '' },
                            { id: 3, question: '', answer: '' },
                        ]
                    }));
                } else if (!clone && !profile) {
                    // Fallback to defaults if new user
                    setSettings(prev => ({
                        ...prev,
                        faqs: [
                            { id: 1, question: '', answer: '' },
                            { id: 2, question: '', answer: '' },
                            { id: 3, question: '', answer: '' },
                        ]
                    }));
                }
            }
            setLoading(false);
        }
        loadSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // 1. Update Profile Metadata
            await supabase.from('profiles').update({
                full_name: settings.businessName,
                metadata: {
                    companyLegalName: settings.companyLegalName,
                    vatNumber: settings.vatNumber,
                    fiscalCode: settings.fiscalCode,
                    sdiCode: settings.sdiCode,
                    pecEmail: settings.pecEmail,
                    billingAddress: settings.billingAddress,
                    billingCity: settings.billingCity,
                    billingZip: settings.billingZip,
                    billingProvince: settings.billingProvince,
                    billingCountry: settings.billingCountry,
                }
            }).eq('id', user.id);

            // 2. Update Clone
            const { data: existingClone } = await supabase.from('clones').select('id').eq('user_id', user.id).limit(1).single();

            const cloneData = {
                user_id: user.id,
                personality: settings.aiTone,
                metadata: {
                    customPersonality: settings.customPersonality,
                    faqs: settings.faqs
                }
            };

            if (existingClone) {
                await supabase.from('clones').update(cloneData).eq('id', existingClone.id);
            } else {
                await supabase.from('clones').insert(cloneData);
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    const tabs = [
        { id: 'profile', label: 'Profilo', icon: User },
        { id: 'company', label: 'Dati Aziendali', icon: Building2 },
        { id: 'billing', label: 'Fatturazione', icon: FileText },
        { id: 'ai', label: 'Personalità AI', icon: Zap },
        { id: 'localization', label: 'Lingua & Regione', icon: Globe },
        { id: 'notifications', label: 'Notifiche', icon: Bell },
    ];

    const languages = [
        { code: 'it', name: 'Italiano', flag: '🇮🇹' },
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ];

    if (loading) {
        return (
            <div className="p-12 lg:p-24 min-h-screen bg-champagne flex flex-col items-center justify-center gap-8">
                <div className="w-20 h-20 gold-gradient rounded-full animate-pulse shadow-luxury" />
                <p className="text-gold text-[10px] uppercase tracking-[1em] font-black animate-pulse">Neural Matrix Loading...</p>
            </div>
        );
    }

    return (
        <div className="p-8 lg:p-16 min-h-screen bg-champagne">
            <header className="mb-12">
                <div className="flex items-center gap-4 mb-6">
                    <span className="h-[1px] w-12 bg-gold/30"></span>
                    <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Configurazione</span>
                </div>
                <h1 className="font-serif text-5xl lg:text-6xl italic text-charcoal leading-[1.1] tracking-tight">
                    Impostazioni <span className="gold-text-gradient">Imperiali.</span>
                </h1>
                <p className="mt-4 text-charcoal/40 font-medium text-sm tracking-wide max-w-xl">
                    Personalizza il comportamento del tuo VirtualTwin e gestisci i dati aziendali.
                </p>
            </header>

            {/* Save Success Toast */}
            {saved && (
                <div className="fixed top-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-green-500 text-white rounded-2xl shadow-xl animate-in slide-in-from-right">
                    <Check className="w-5 h-5" />
                    <span className="text-sm font-bold">Impostazioni salvate con successo!</span>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-10">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 space-y-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl transition-all text-left ${activeTab === tab.id
                                ? 'bg-gold text-white shadow-lg'
                                : 'bg-white/50 text-charcoal/60 hover:bg-white hover:text-charcoal'
                                }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            <span className="font-medium text-sm">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <div className="flex-1">
                    {/* Profile Tab */}
                    {activeTab === 'profile' && (
                        <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                    <User className="w-7 h-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif italic text-charcoal">Profilo Account</h2>
                                    <p className="text-charcoal/40 text-sm">Informazioni di base del tuo account</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Nome Azienda</label>
                                    <input
                                        type="text"
                                        value={settings.businessName}
                                        onChange={(e) => setSettings({ ...settings, businessName: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Email</label>
                                    <input
                                        type="email"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Telefono</label>
                                    <input
                                        type="tel"
                                        value={settings.phone}
                                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Company B2B Data Tab */}
                    {activeTab === 'company' && (
                        <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                    <Building2 className="w-7 h-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif italic text-charcoal">Dati Aziendali</h2>
                                    <p className="text-charcoal/40 text-sm">Informazioni legali per fatturazione e documenti fiscali</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Ragione Sociale</label>
                                    <input
                                        type="text"
                                        value={settings.companyLegalName}
                                        onChange={(e) => setSettings({ ...settings, companyLegalName: e.target.value })}
                                        placeholder="Es: La Mia Azienda S.r.l."
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Partita IVA</label>
                                    <input
                                        type="text"
                                        value={settings.vatNumber}
                                        onChange={(e) => setSettings({ ...settings, vatNumber: e.target.value })}
                                        placeholder="IT12345678901"
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Codice Fiscale</label>
                                    <input
                                        type="text"
                                        value={settings.fiscalCode}
                                        onChange={(e) => setSettings({ ...settings, fiscalCode: e.target.value })}
                                        placeholder="12345678901"
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Codice SDI (Fattura Elettronica)</label>
                                    <input
                                        type="text"
                                        value={settings.sdiCode}
                                        onChange={(e) => setSettings({ ...settings, sdiCode: e.target.value })}
                                        placeholder="ABCDEFG"
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">PEC</label>
                                    <input
                                        type="email"
                                        value={settings.pecEmail}
                                        onChange={(e) => setSettings({ ...settings, pecEmail: e.target.value })}
                                        placeholder="azienda@pec.it"
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 p-5 bg-gold/5 border border-gold/10 rounded-xl">
                                <p className="text-charcoal/60 text-sm flex items-start gap-3">
                                    <FileText className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                    <span>Questi dati verranno utilizzati per generare le fatture e i documenti fiscali in formato PDF.</span>
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Billing Address Tab */}
                    {activeTab === 'billing' && (
                        <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                    <CreditCard className="w-7 h-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif italic text-charcoal">Indirizzo Fatturazione</h2>
                                    <p className="text-charcoal/40 text-sm">Sede legale per fatture e ricevute</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Indirizzo</label>
                                    <input
                                        type="text"
                                        value={settings.billingAddress}
                                        onChange={(e) => setSettings({ ...settings, billingAddress: e.target.value })}
                                        placeholder="Via Roma 123"
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Città</label>
                                    <input
                                        type="text"
                                        value={settings.billingCity}
                                        onChange={(e) => setSettings({ ...settings, billingCity: e.target.value })}
                                        placeholder="Milano"
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">CAP</label>
                                        <input
                                            type="text"
                                            value={settings.billingZip}
                                            onChange={(e) => setSettings({ ...settings, billingZip: e.target.value })}
                                            placeholder="20121"
                                            className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Provincia</label>
                                        <input
                                            type="text"
                                            value={settings.billingProvince}
                                            onChange={(e) => setSettings({ ...settings, billingProvince: e.target.value })}
                                            placeholder="MI"
                                            className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Paese</label>
                                    <select
                                        value={settings.billingCountry}
                                        onChange={(e) => setSettings({ ...settings, billingCountry: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="Italia">🇮🇹 Italia</option>
                                        <option value="Spain">🇪🇸 España</option>
                                        <option value="Mexico">🇲🇽 México</option>
                                        <option value="Argentina">🇦🇷 Argentina</option>
                                        <option value="Colombia">🇨🇴 Colombia</option>
                                        <option value="United Kingdom">🇬🇧 United Kingdom</option>
                                        <option value="United States">🇺🇸 United States</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Settings Tab */}
                    {activeTab === 'ai' && (
                        <div className="space-y-8">
                            {/* Tone Section */}
                            <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                        <Zap className="w-7 h-7 text-gold" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-serif italic text-charcoal">Personalità AI</h2>
                                        <p className="text-charcoal/40 text-sm">Configura come il tuo clone comunica con i clienti</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    {/* Tone Preset */}
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Tono Base</label>
                                        <select
                                            value={settings.aiTone}
                                            onChange={(e) => setSettings({ ...settings, aiTone: e.target.value })}
                                            className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="professionale">Professionale & Autorevole</option>
                                            <option value="amichevole">Amichevole & Caloroso</option>
                                            <option value="formale">Formale & Istituzionale</option>
                                            <option value="creativo">Creativo & Dinamico</option>
                                            <option value="commerciale">Commerciale & Persuasivo</option>
                                        </select>
                                    </div>

                                    {/* Custom Personality */}
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">
                                            Personalità Personalizzata <span className="text-gold">(Opzionale)</span>
                                        </label>
                                        <textarea
                                            value={settings.customPersonality}
                                            onChange={(e) => setSettings({ ...settings, customPersonality: e.target.value })}
                                            placeholder="Descrivi la personalità unica del tuo clone. Es: 'Sono un coach energico che motiva i clienti con entusiasmo. Uso spesso metafore sportive e parlo come un mentore che ha vissuto le stesse sfide. Evito il linguaggio corporate e preferisco un tono diretto ma empatico.'"
                                            rows={5}
                                            className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors resize-none"
                                        />
                                        <p className="text-charcoal/40 text-xs mt-2">
                                            💡 Più dettagli inserisci, più il clone sarà fedele al tuo stile comunicativo.
                                        </p>
                                    </div>

                                    {/* Response Preview */}
                                    <div className="p-5 bg-champagne rounded-xl">
                                        <p className="text-charcoal font-medium mb-2">Esempio di risposta:</p>
                                        <p className="text-charcoal/60 text-sm italic">
                                            {settings.aiTone === 'professionale' && '"Buongiorno, sarò lieto di assisterla nella scelta del piano più adatto alle sue esigenze professionali."'}
                                            {settings.aiTone === 'amichevole' && '"Ciao! 👋 Sono qui per aiutarti a trovare la soluzione perfetta per te. Cosa stai cercando?"'}
                                            {settings.aiTone === 'formale' && '"Gentile Cliente, La ringraziamo per averci contattato. Restiamo a Sua completa disposizione."'}
                                            {settings.aiTone === 'creativo' && '"Hey! 🚀 Pronto a rivoluzionare il tuo business? Ho delle idee fantastiche per te!"'}
                                            {settings.aiTone === 'commerciale' && '"Ottima scelta! Questo piano ti permetterà di triplicare le tue conversioni. Posso mostrarti come?"'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* FAQ Section */}
                            <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                            <Users className="w-7 h-7 text-gold" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif italic text-charcoal">FAQ del Clone</h2>
                                            <p className="text-charcoal/40 text-sm">Domande e risposte che il clone conosce</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSettings({
                                            ...settings,
                                            faqs: [...settings.faqs, { id: Date.now(), question: '', answer: '' }]
                                        })}
                                        className="px-4 py-2 bg-gold/10 text-gold rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-gold hover:text-white transition-all"
                                    >
                                        + Aggiungi FAQ
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {settings.faqs.map((faq, index) => (
                                        <div key={faq.id} className="p-5 bg-white/50 rounded-xl border border-charcoal/5">
                                            <div className="flex items-center justify-between mb-3">
                                                <span className="text-xs font-bold text-charcoal/40 uppercase tracking-wider">
                                                    FAQ #{index + 1}
                                                </span>
                                                {settings.faqs.length > 1 && (
                                                    <button
                                                        onClick={() => setSettings({
                                                            ...settings,
                                                            faqs: settings.faqs.filter(f => f.id !== faq.id)
                                                        })}
                                                        className="text-red-400 hover:text-red-600 text-xs font-bold"
                                                    >
                                                        Elimina
                                                    </button>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={faq.question}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    faqs: settings.faqs.map(f =>
                                                        f.id === faq.id ? { ...f, question: e.target.value } : f
                                                    )
                                                })}
                                                placeholder="Es. Quanto costa il servizio?"
                                                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg text-charcoal text-sm focus:border-gold focus:outline-none mb-3"
                                            />
                                            <textarea
                                                value={faq.answer}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    faqs: settings.faqs.map(f =>
                                                        f.id === faq.id ? { ...f, answer: e.target.value } : f
                                                    )
                                                })}
                                                placeholder="La tua risposta tipica..."
                                                rows={2}
                                                className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-lg text-charcoal text-sm focus:border-gold focus:outline-none resize-none"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 p-4 bg-gold/5 border border-gold/10 rounded-xl">
                                    <p className="text-charcoal/60 text-sm">
                                        💡 <strong>Tip:</strong> Aggiungi le domande più frequenti dei tuoi clienti. Il clone userà queste risposte per rispondere in modo coerente con il tuo stile.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Localization Tab */}
                    {activeTab === 'localization' && (
                        <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                    <Languages className="w-7 h-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif italic text-charcoal">Lingua & Regione</h2>
                                    <p className="text-charcoal/40 text-sm">Localizzazione per mercati internazionali</p>
                                </div>
                            </div>

                            <div className="space-y-8">
                                {/* Language Selection */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-4">Lingua Principale</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {languages.map((lang) => (
                                            <button
                                                key={lang.code}
                                                onClick={() => setSettings({ ...settings, language: lang.code })}
                                                className={`flex items-center gap-4 p-5 rounded-xl border-2 transition-all ${settings.language === lang.code
                                                    ? 'border-gold bg-gold/10 shadow-lg'
                                                    : 'border-charcoal/10 bg-white/50 hover:border-charcoal/20'
                                                    }`}
                                            >
                                                <span className="text-3xl">{lang.flag}</span>
                                                <div className="text-left">
                                                    <p className="text-charcoal font-bold">{lang.name}</p>
                                                    <p className="text-charcoal/40 text-xs uppercase">{lang.code.toUpperCase()}</p>
                                                </div>
                                                {settings.language === lang.code && (
                                                    <Check className="w-5 h-5 text-gold ml-auto" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Timezone */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Fuso Orario</label>
                                    <select
                                        value={settings.timezone}
                                        onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="Europe/Rome">🇮🇹 Europe/Rome (CET)</option>
                                        <option value="Europe/Madrid">🇪🇸 Europe/Madrid (CET)</option>
                                        <option value="Europe/London">🇬🇧 Europe/London (GMT)</option>
                                        <option value="America/New_York">🇺🇸 America/New York (EST)</option>
                                        <option value="America/Mexico_City">🇲🇽 America/Mexico City (CST)</option>
                                        <option value="America/Buenos_Aires">🇦🇷 America/Buenos Aires (ART)</option>
                                        <option value="America/Bogota">🇨🇴 America/Bogota (COT)</option>
                                    </select>
                                </div>

                                {/* Currency */}
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Valuta</label>
                                    <select
                                        value={settings.currency}
                                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors appearance-none cursor-pointer"
                                    >
                                        <option value="EUR">€ Euro (EUR)</option>
                                        <option value="USD">$ US Dollar (USD)</option>
                                        <option value="GBP">£ British Pound (GBP)</option>
                                        <option value="MXN">$ Mexican Peso (MXN)</option>
                                        <option value="ARS">$ Argentine Peso (ARS)</option>
                                        <option value="COP">$ Colombian Peso (COP)</option>
                                    </select>
                                </div>

                                <div className="p-5 bg-gold/5 border border-gold/10 rounded-xl">
                                    <p className="text-charcoal/60 text-sm flex items-start gap-3">
                                        <Globe className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                                        <span>Il tuo VirtualTwin risponderà automaticamente nella lingua selezionata e utilizzerà il formato di data e valuta appropriato per la tua regione.</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                    <Bell className="w-7 h-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif italic text-charcoal">Notifiche</h2>
                                    <p className="text-charcoal/40 text-sm">Gestisci le tue preferenze di notifica</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-5 bg-white/50 rounded-xl border border-charcoal/5">
                                    <div className="flex items-center gap-4">
                                        <Bell className="w-5 h-5 text-gold" />
                                        <div>
                                            <span className="text-charcoal font-medium">Notifiche Email</span>
                                            <p className="text-charcoal/40 text-xs">Ricevi aggiornamenti su nuovi lead e conversazioni</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, notifications: !settings.notifications })}
                                        className={`w-14 h-8 rounded-full transition-colors relative ${settings.notifications ? 'bg-gold' : 'bg-charcoal/20'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${settings.notifications ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-5 bg-white/50 rounded-xl border border-charcoal/5">
                                    <div className="flex items-center gap-4">
                                        <Palette className="w-5 h-5 text-gold" />
                                        <div>
                                            <span className="text-charcoal font-medium">Dark Mode</span>
                                            <p className="text-charcoal/40 text-xs">Modalità scura per un'esperienza più rilassante</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                                        className={`w-14 h-8 rounded-full transition-colors relative ${settings.darkMode ? 'bg-gold' : 'bg-charcoal/20'}`}
                                    >
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${settings.darkMode ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="mt-10 p-6 rounded-xl border border-red-200 bg-red-50/50">
                                <h3 className="text-lg font-serif italic text-red-600 mb-3">Zona Pericolosa</h3>
                                <p className="text-charcoal/50 text-sm mb-4">
                                    Azioni irreversibili. Procedi con cautela.
                                </p>
                                <button className="px-6 py-3 rounded-xl border border-red-300 text-red-500 font-bold text-xs uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all">
                                    Elimina Account
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-8 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="gold-gradient px-12 py-5 rounded-xl text-white font-black text-[11px] uppercase tracking-[0.4em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl disabled:opacity-50"
                        >
                            {saving ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Salvataggio...
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Sincronizza Impostazioni
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
