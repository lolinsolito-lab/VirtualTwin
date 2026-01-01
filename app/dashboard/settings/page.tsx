"use client";

import React, { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, Save, Zap, Check, Building2, FileText, CreditCard, Users, Languages } from 'lucide-react';

export default function SettingsPage() {
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');

    const [settings, setSettings] = useState({
        // Profile
        businessName: 'VirtualTwin Demo',
        email: 'demo@virtualtwin.ai',
        phone: '+39 02 1234567',

        // Company B2B Data
        companyLegalName: 'VirtualTwin S.r.l.',
        vatNumber: 'IT12345678901',
        fiscalCode: '12345678901',
        sdiCode: 'ABCDEFG',
        pecEmail: 'virtualtwin@pec.it',

        // Billing Address
        billingAddress: 'Via Roma 123',
        billingCity: 'Milano',
        billingZip: '20121',
        billingProvince: 'MI',
        billingCountry: 'Italia',

        // Preferences
        language: 'it',
        timezone: 'Europe/Rome',
        currency: 'EUR',
        aiTone: 'professionale',
        notifications: true,
        darkMode: false,
    });

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
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
                        <div className="silk-card p-10 rounded-[2rem] border border-white/60">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                                    <Zap className="w-7 h-7 text-gold" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-serif italic text-charcoal">Personalità AI</h2>
                                    <p className="text-charcoal/40 text-sm">Configura il tono del tuo VirtualTwin</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.3em] text-charcoal/40 font-black mb-3">Tono di Comunicazione</label>
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
                            className="gold-gradient px-10 py-5 rounded-xl text-white font-black text-[11px] uppercase tracking-[0.4em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl"
                        >
                            <Save className="w-5 h-5" />
                            Salva Modifiche
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
