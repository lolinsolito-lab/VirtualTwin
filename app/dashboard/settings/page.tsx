"use client";

import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, Zap, Check, Building2, FileText, CreditCard, Users, Languages, Loader2, Database, Key } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useEffect } from 'react';
import { checkCloneLimit } from '@/lib/limits/cloneLimitChecker';

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [role, setRole] = useState('user');

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
        websiteUrl: '',
        knowledgeBase: [] as { id: string; name: string; type: string; size: string }[],
        faqs: [] as { id: number | string; question: string; answer: string }[],

        // Internal State
        planTier: 'curioso',
        apiKey: '',
        whiteLabelActive: false,

        // Platform Admin Settings (Only for God Mode)
        platformIban: '',
        platformVat: '',
        platformOwner: '',
        platformBank: '',
        platformSwift: ''
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
                    setRole(profile.role || 'user');

                    // If Admin, load Platform Settings
                    if (profile.role === 'admin') {
                        const { data: systemData } = await supabase
                            .from('system_settings')
                            .select('data')
                            .eq('id', 'platform_billing')
                            .single();

                        if (systemData?.data) {
                            setSettings(prev => ({
                                ...prev,
                                platformIban: systemData.data.iban || '',
                                platformVat: systemData.data.vat_number || '',
                                platformOwner: systemData.data.owner_name || '',
                                platformBank: systemData.data.bank_name || '',
                                platformSwift: systemData.data.swift_bic || ''
                            }));
                        }
                    }

                    setSettings(prev => ({
                        ...prev,
                        // Profile basic fields
                        businessName: profile.full_name || '',
                        email: user.email || '',
                        phone: profile.phone || '',
                        // Company data from metadata
                        companyLegalName: profile.metadata?.companyLegalName || '',
                        vatNumber: profile.metadata?.vatNumber || '',
                        fiscalCode: profile.metadata?.fiscalCode || '',
                        sdiCode: profile.metadata?.sdiCode || '',
                        pecEmail: profile.metadata?.pecEmail || '',
                        // Billing address from metadata
                        billingAddress: profile.metadata?.billingAddress || '',
                        billingCity: profile.metadata?.billingCity || '',
                        billingZip: profile.metadata?.billingZip || '',
                        billingProvince: profile.metadata?.billingProvince || '',
                        billingCountry: profile.metadata?.billingCountry || 'Italia',
                        // Localization from metadata
                        language: profile.metadata?.language || 'it',
                        timezone: profile.metadata?.timezone || 'Europe/Rome',
                        currency: profile.metadata?.currency || 'EUR',
                        // Preferences from metadata
                        notifications: profile.metadata?.notifications ?? true,
                        darkMode: profile.metadata?.darkMode ?? false,
                        // Plan
                        planTier: profile.plan_tier || 'curioso'
                    }));
                }

                if (clone) {
                    setSettings(prev => ({
                        ...prev,
                        aiTone: clone.personality || 'professionale',
                        customPersonality: clone.metadata?.customPersonality || '',
                        websiteUrl: clone.metadata?.websiteUrl || '',
                        knowledgeBase: clone.metadata?.knowledgeBase || [],
                        faqs: (clone.metadata?.faqs && clone.metadata.faqs.length > 0) ? clone.metadata.faqs : [
                            { id: 1, question: '', answer: '' },
                            { id: 2, question: '', answer: '' },
                            { id: 3, question: '', answer: '' },
                        ],
                        apiKey: clone.api_key || '',
                        whiteLabelActive: clone.white_label_active || false
                    }));
                } else {
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
            // 1. Update Profile with all settings (including phone, language, notifications)
            await supabase.from('profiles').update({
                full_name: settings.businessName,
                phone: settings.phone,
                metadata: {
                    // Company Data
                    companyLegalName: settings.companyLegalName,
                    vatNumber: settings.vatNumber,
                    fiscalCode: settings.fiscalCode,
                    sdiCode: settings.sdiCode,
                    pecEmail: settings.pecEmail,
                    // Billing Address
                    billingAddress: settings.billingAddress,
                    billingCity: settings.billingCity,
                    billingZip: settings.billingZip,
                    billingProvince: settings.billingProvince,
                    billingCountry: settings.billingCountry,
                    // Localization & Preferences
                    language: settings.language,
                    timezone: settings.timezone,
                    currency: settings.currency,
                    notifications: settings.notifications,
                    darkMode: settings.darkMode,
                }
            }).eq('id', user.id);

            // 2. Update Clone
            const { data: existingClone } = await supabase.from('clones').select('id').eq('user_id', user.id).limit(1).single();

            const cloneData = {
                user_id: user.id,
                personality: settings.aiTone,
                metadata: {
                    customPersonality: settings.customPersonality,
                    websiteUrl: settings.websiteUrl,
                    knowledgeBase: settings.knowledgeBase,
                    faqs: settings.faqs
                }
            };

            if (existingClone) {
                await supabase.from('clones').update(cloneData).eq('id', existingClone.id);
            } else {
                // Check clone limit before creating new one
                const limitCheck = await checkCloneLimit(user.id);
                if (!limitCheck.canCreate) {
                    alert(`Limite cloni raggiunto (${limitCheck.currentCount}/${limitCheck.limit}). Upgrade per creare più cloni.`);
                    setSaving(false);
                    return;
                }
                await supabase.from('clones').insert(cloneData);
            }

            // 3. Update Platform Settings (Only if Admin)
            if (role === 'admin') {
                await supabase.from('system_settings').upsert({
                    id: 'platform_billing',
                    data: {
                        iban: settings.platformIban,
                        vat_number: settings.platformVat,
                        owner_name: settings.platformOwner,
                        bank_name: settings.platformBank,
                        swift_bic: settings.platformSwift
                    },
                    updated_at: new Date().toISOString(),
                    updated_by: user.id
                });
            }

            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }
        setSaving(false);
    };

    const applyCoachTemplate = () => {
        setSettings(prev => ({
            ...prev,
            aiTone: 'commerciale',
            customPersonality: "Sono un Transformational Coach d'élite. Il mio obiettivo è guidare il cliente attraverso un percorso di consapevolezza e crescita, usando un tono motivante, autorevole e focalizzato sul risultato. Sfido il cliente a superare i propri limiti e propongo soluzioni di automazione come strumenti di libertà assoluta.",
            faqs: [
                { id: 1, question: 'Qual è il segreto del successo?', answer: 'Il successo non è un segreto, è un sistema. L\'automazione è il tuo esercito digitale che ti libera dal tempo per lasciarti creare valore.' },
                { id: 2, question: 'Come funziona il percorso?', answer: 'Partiamo da un audit del tuo tempo. Identifichiamo i colli di bottiglia e cloniamo la tua autorità per delegare l\'ordinario all\'AI.' },
                { id: 3, question: 'È adatto a me?', answer: 'Se hai un business che scala e non hai tempo di respirare, è l\'unica soluzione per non implodere.' }
            ]
        }));
    };

    const tabs = [
        { id: 'profile', label: 'Profilo', icon: User },
        { id: 'company', label: 'Dati Aziendali', icon: Building2 },
        { id: 'billing', label: 'Fatturazione', icon: FileText },
        { id: 'ai', label: 'Addestramento Clone', icon: Zap },
        { id: 'localization', label: 'Lingua & Regione', icon: Globe },
        { id: 'notifications', label: 'Notifiche', icon: Bell },
        ...(role === 'admin' ? [{ id: 'platform', label: 'Admin Piattaforma', icon: Database }] : []),
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
                <p className="text-gold text-[10px] uppercase tracking-[1em] font-black animate-pulse">Caricamento...</p>
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
                    Impostazioni <span className="gold-text-gradient">Clone.</span>
                </h1>
                <div className="mt-4 flex items-center gap-3">
                    <p className="text-charcoal/40 font-medium text-sm tracking-wide">
                        Personalizza il comportamento del tuo VirtualTwin e gestisci i dati aziendali.
                    </p>
                    <span className="px-3 py-1 bg-charcoal text-white rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-gold rounded-full animate-pulse" />
                        Piano {settings.planTier === 'curioso' ? 'Trial' : settings.planTier}
                    </span>
                </div>
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
                            {/* Header Section */}
                            <div className="silk-card p-10 rounded-[2rem] border border-white/60 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 blur-[80px] -translate-y-1/2 translate-x-1/2" />

                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-10 relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-2xl bg-charcoal flex items-center justify-center shadow-luxury">
                                            <Zap className="w-7 h-7 text-gold" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-serif italic text-charcoal">Addestramento Clone</h2>
                                            <p className="text-charcoal/40 text-sm">Configura la personalità e la base di conoscenza del tuo clone</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={applyCoachTemplate}
                                        className="px-6 py-3 bg-gold/10 text-gold rounded-xl font-black text-[10px] uppercase tracking-widest border border-gold/20 hover:bg-gold hover:text-white transition-all shadow-luxury-sm"
                                    >
                                        ⚡ Applica Protocollo Coach
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                    {/* Tone Preset */}
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Tono Comunicativo</label>
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

                                        {/* Website Field */}
                                        <div>
                                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Sito Web Aziendale (Knowledge Source)</label>
                                            <div className="relative">
                                                <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold/50" />
                                                <input
                                                    type="url"
                                                    value={settings.websiteUrl}
                                                    onChange={(e) => setSettings({ ...settings, websiteUrl: e.target.value })}
                                                    placeholder="https://tuaazienda.com"
                                                    className="w-full pl-12 pr-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                                />
                                            </div>
                                            <p className="text-charcoal/30 text-[10px] mt-2 italic">Il clone analizzerà il contenuto per allinearsi al tuo brand.</p>
                                        </div>
                                    </div>

                                    {/* Custom Personality */}
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">
                                            Personalità del Clone
                                        </label>
                                        <textarea
                                            value={settings.customPersonality}
                                            onChange={(e) => setSettings({ ...settings, customPersonality: e.target.value })}
                                            placeholder="Descrivi chi è il tuo clone. Es: 'Sono un esperto di vendite motivante...'"
                                            rows={6}
                                            className="w-full px-5 py-4 bg-white/50 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors resize-none text-sm leading-relaxed"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Elite Control Mode (Only for Conquistatore/Imperatore) */}
                            {['conquistatore', 'imperatore'].includes(settings.planTier) && (
                                <div className="silk-card p-10 rounded-[2rem] border border-gold/40 bg-gold/5 relative overflow-hidden">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-gold flex items-center justify-center shadow-luxury">
                                            <Shield className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif italic text-charcoal">Controllo Elite & API</h3>
                                            <p className="text-gold text-[10px] uppercase tracking-widest font-black">Funzionalità Enterprise Attive</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {/* API Key Section */}
                                        <div className="space-y-4">
                                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Chiave API Privata</label>
                                            <div className="relative group">
                                                <Key className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gold" />
                                                <input
                                                    type="password"
                                                    value={settings.apiKey}
                                                    readOnly
                                                    className="w-full pl-12 pr-12 py-4 bg-white/80 border border-gold/20 rounded-xl text-charcoal font-mono text-xs focus:outline-none"
                                                />
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(settings.apiKey);
                                                        setSaved(true);
                                                        setTimeout(() => setSaved(false), 2000);
                                                    }}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-gold uppercase tracking-widest hover:text-charcoal transition-colors"
                                                >
                                                    Copia
                                                </button>
                                            </div>
                                            <p className="text-charcoal/40 text-[10px] italic">Usa questa chiave per integrare il clone in software esterni (Zapier, Make, CRM).</p>
                                        </div>

                                        {/* White Label Status */}
                                        <div className="space-y-4">
                                            <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Stato White-Label</label>
                                            <div className={`p-4 rounded-xl border flex items-center gap-4 ${settings.whiteLabelActive ? 'bg-green-50 border-green-200' : 'bg-charcoal/5 border-charcoal/10'}`}>
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${settings.whiteLabelActive ? 'bg-green-500 text-white' : 'bg-charcoal/20 text-charcoal/40'}`}>
                                                    <Shield className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-charcoal">{settings.whiteLabelActive ? 'ATTIVO' : 'NON ATTIVO'}</p>
                                                    <p className="text-[10px] text-charcoal/40 uppercase tracking-widest font-black">Rimosso Watermark "Powered by VirtualTwin"</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Knowledge Base & FAQ Grid */}
                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                {/* Knowledge Base Section */}
                                <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                            <Database className="w-6 h-6 text-gold" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-serif italic text-charcoal">Knowledge Base (PDF)</h3>
                                            <p className="text-charcoal/40 text-[10px] uppercase tracking-widest font-black">Documentazione Professionale</p>
                                        </div>
                                    </div>

                                    <div className="border-2 border-dashed border-charcoal/10 rounded-[2rem] p-10 text-center group-hover:border-gold/30 transition-colors">
                                        <div className="w-16 h-16 bg-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <FileText className="w-8 h-8 text-gold/30" />
                                        </div>
                                        <p className="text-charcoal font-serif italic mb-2">Trascina qui i tuoi manuali</p>
                                        <p className="text-charcoal/30 text-[10px] uppercase tracking-widest font-black mb-8">Supporto PDF, DOCX (Max 10MB)</p>

                                        <button className="px-6 py-3 bg-charcoal text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-gold transition-all">
                                            Seleziona File
                                        </button>
                                    </div>

                                    <div className="mt-8 p-5 bg-gold/5 border border-gold/10 rounded-2xl">
                                        <p className="text-charcoal/60 text-xs leading-relaxed">
                                            💡 <strong>Suggerimento:</strong> Carica il tuo manuale operativo o le slide dei tuoi servizi. Il clone userà questi dati come fonte di verità.
                                        </p>
                                    </div>
                                </div>

                                {/* Deep Knowledge FAQ Section */}
                                <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                                <Users className="w-6 h-6 text-gold" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-serif italic text-charcoal">Deep Knowledge (Q&A)</h3>
                                                <p className="text-charcoal/40 text-[10px] uppercase tracking-widest font-black">Addestramento Diretto</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => setSettings({
                                                ...settings,
                                                faqs: [...settings.faqs, { id: Date.now(), question: '', answer: '' }]
                                            })}
                                            className="w-10 h-10 bg-gold/10 text-gold rounded-full flex items-center justify-center hover:bg-gold hover:text-white transition-all shadow-luxury-sm"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {settings.faqs.map((faq, index) => (
                                            <div key={faq.id} className="p-6 bg-white/40 rounded-2xl border border-charcoal/5 group/faq transition-all hover:border-gold/20">
                                                <div className="flex items-center justify-between mb-4">
                                                    <span className="text-[9px] font-black text-gold uppercase tracking-[0.3em]">
                                                        Domanda #{index + 1}
                                                    </span>
                                                    {settings.faqs.length > 1 && (
                                                        <button
                                                            onClick={() => setSettings({
                                                                ...settings,
                                                                faqs: settings.faqs.filter(f => f.id !== faq.id)
                                                            })}
                                                            className="text-red-400 opacity-0 group-hover/faq:opacity-100 transition-opacity text-[9px] font-black uppercase tracking-widest"
                                                        >
                                                            Rimuovi
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
                                                    placeholder="Domanda del cliente..."
                                                    className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-charcoal text-sm focus:border-gold focus:outline-none mb-3 font-medium"
                                                />
                                                <textarea
                                                    value={faq.answer}
                                                    onChange={(e) => setSettings({
                                                        ...settings,
                                                        faqs: settings.faqs.map(f =>
                                                            f.id === faq.id ? { ...f, answer: e.target.value } : f
                                                        )
                                                    })}
                                                    placeholder="La tua risposta d'autorità..."
                                                    rows={2}
                                                    className="w-full px-4 py-3 bg-white border border-charcoal/10 rounded-xl text-charcoal text-xs focus:border-gold focus:outline-none resize-none leading-relaxed"
                                                />
                                            </div>
                                        ))}
                                    </div>
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

                    {activeTab === 'platform' && role === 'admin' && (
                        <div className="silk-card p-10 rounded-[2rem] border border-gold/40 bg-gold/5 relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-charcoal flex items-center justify-center shadow-luxury">
                                    <Database className="w-7 h-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif italic text-charcoal">Amministrazione Piattaforma</h2>
                                    <p className="text-gold text-[10px] uppercase tracking-widest font-black">Global Control Center</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Nome Titolare Piattaforma (Legal Entity)</label>
                                    <input
                                        type="text"
                                        value={settings.platformOwner}
                                        onChange={(e) => setSettings({ ...settings, platformOwner: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                    <p className="text-charcoal/40 text-[10px] mt-2 italic">Questo nome apparirà nei footer e nelle email di fatturazione.</p>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Partita IVA Piattaforma</label>
                                    <input
                                        type="text"
                                        value={settings.platformVat}
                                        onChange={(e) => setSettings({ ...settings, platformVat: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Nome Banca</label>
                                    <input
                                        type="text"
                                        value={settings.platformBank}
                                        onChange={(e) => setSettings({ ...settings, platformBank: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">IBAN Piattaforma (per Bonifici)</label>
                                    <input
                                        type="text"
                                        value={settings.platformIban}
                                        onChange={(e) => setSettings({ ...settings, platformIban: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal font-mono focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Codice SWIFT / BIC</label>
                                    <input
                                        type="text"
                                        value={settings.platformSwift}
                                        onChange={(e) => setSettings({ ...settings, platformSwift: e.target.value })}
                                        className="w-full px-5 py-4 bg-white/80 border border-charcoal/10 rounded-xl text-charcoal font-mono focus:border-gold focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>

                            <div className="mt-8 p-5 rounded-2xl bg-gold/10 border border-gold/20">
                                <p className="text-[10px] text-gold font-bold uppercase tracking-widest mb-2">Nota di Sicurezza</p>
                                <p className="text-charcoal/60 text-xs italic">Questi dati sono sensibili. Solo gli account con ruolo 'admin' possono visualizzare e modificare queste impostazioni. Verranno utilizzati per le istruzioni di pagamento fornite agli utenti.</p>
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
