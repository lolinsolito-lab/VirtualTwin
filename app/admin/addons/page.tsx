"use client";

import React, { useState, useEffect } from 'react';
import {
    Gift,
    Plus,
    Edit3,
    Trash2,
    Check,
    X,
    Loader2,
    RefreshCw,
    Eye,
    EyeOff,
    ChevronDown,
    ChevronUp,
    Sparkles,
    DollarSign,
    Save,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Addon {
    id: string;
    name: string;
    description: string;
    icon: string;
    promo_price: number;
    regular_price: number;
    stripe_product_id: string;
    stripe_promo_price_id: string;
    stripe_regular_price_id: string;
    features: string[];
    available_for_tiers: string[];
    pre_selected_for: string[];
    is_active: boolean;
    is_recommended: boolean;
    display_order: number;
    created_at: string;
}

const TIERS = ['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'];
const ICONS = ['gift', 'sparkles', 'zap', 'crown', 'star', 'heart', 'rocket', 'award'];

const formatCurrency = (cents: number) => `€${(cents / 100).toFixed(0)}`;

export default function AdminAddons() {
    const [addons, setAddons] = useState<Addon[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    // Form state
    const [form, setForm] = useState({
        name: '',
        description: '',
        icon: 'gift',
        promo_price: 9900,
        regular_price: 29700,
        features: [''],
        available_for_tiers: ['solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'],
        pre_selected_for: ['entrepreneur', 'conquistatore', 'imperatore'],
        is_recommended: true,
        display_order: 0
    });

    useEffect(() => {
        fetchAddons();
    }, []);

    const fetchAddons = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/addons');
            const data = await res.json();
            setAddons(data.addons || []);
        } catch (error) {
            console.error('Failed to fetch addons:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setForm({
            name: '',
            description: '',
            icon: 'gift',
            promo_price: 9900,
            regular_price: 29700,
            features: [''],
            available_for_tiers: TIERS,
            pre_selected_for: ['entrepreneur', 'conquistatore', 'imperatore'],
            is_recommended: true,
            display_order: addons.length + 1
        });
        setEditingId(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = '/api/admin/addons';
            const method = editingId ? 'PUT' : 'POST';
            const body = editingId
                ? { id: editingId, ...form, features: form.features.filter(f => f.trim()) }
                : { ...form, features: form.features.filter(f => f.trim()) };

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to save addon');
            }

            await fetchAddons();
            setShowForm(false);
            resetForm();

        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (addon: Addon) => {
        setForm({
            name: addon.name,
            description: addon.description || '',
            icon: addon.icon,
            promo_price: addon.promo_price,
            regular_price: addon.regular_price,
            features: addon.features.length > 0 ? addon.features : [''],
            available_for_tiers: addon.available_for_tiers,
            pre_selected_for: addon.pre_selected_for,
            is_recommended: addon.is_recommended,
            display_order: addon.display_order
        });
        setEditingId(addon.id);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Vuoi disattivare questo add-on? (Sarà nascosto dal checkout)')) return;

        try {
            await fetch(`/api/admin/addons?id=${id}`, { method: 'DELETE' });
            await fetchAddons();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const addFeature = () => {
        setForm(prev => ({ ...prev, features: [...prev.features, ''] }));
    };

    const updateFeature = (index: number, value: string) => {
        setForm(prev => ({
            ...prev,
            features: prev.features.map((f, i) => i === index ? value : f)
        }));
    };

    const removeFeature = (index: number) => {
        setForm(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const toggleTier = (tier: string, field: 'available_for_tiers' | 'pre_selected_for') => {
        setForm(prev => ({
            ...prev,
            [field]: prev[field].includes(tier)
                ? prev[field].filter(t => t !== tier)
                : [...prev[field], tier]
        }));
    };

    return (
        <div className="p-8 lg:p-12">
            {/* Header */}
            <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="h-[1px] w-12 bg-gold/50"></span>
                        <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Product Arsenal</span>
                    </div>
                    <h1 className="font-serif text-5xl lg:text-7xl italic text-white leading-tight">
                        Add-ons <span className="gold-text-gradient">Manager.</span>
                    </h1>
                    <p className="text-white/40 mt-4 text-sm">
                        Crea, modifica e gestisci gli upsell. Tutto sincronizzato automaticamente con Stripe.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchAddons}
                        className={`p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-5 h-5 text-white/60" />
                    </button>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="px-6 py-4 gold-gradient text-charcoal rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-luxury"
                    >
                        <Plus className="w-4 h-4" />
                        Nuovo Add-on
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Add-ons Attivi</p>
                    <p className="text-4xl font-serif text-white">{addons.filter(a => a.is_active).length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Revenue Potenziale</p>
                    <p className="text-4xl font-serif text-gold">
                        {formatCurrency(addons.filter(a => a.is_active).reduce((sum, a) => sum + a.promo_price, 0))}
                    </p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Risparmio Totale Offerto</p>
                    <p className="text-4xl font-serif text-green-400">
                        {formatCurrency(addons.filter(a => a.is_active).reduce((sum, a) => sum + (a.regular_price - a.promo_price), 0))}
                    </p>
                </div>
            </div>

            {/* Add-ons List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                ) : addons.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <Gift className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Nessun add-on creato. Clicca "Nuovo Add-on" per iniziare.</p>
                    </div>
                ) : (
                    addons.map((addon) => (
                        <motion.div
                            key={addon.id}
                            layout
                            className={`bg-white/5 border ${addon.is_active ? 'border-white/10' : 'border-red-500/20 opacity-50'} rounded-2xl overflow-hidden`}
                        >
                            {/* Main Row */}
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
                                onClick={() => setExpandedId(expandedId === addon.id ? null : addon.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                        <Gift className="w-6 h-6 text-gold" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-serif text-white">{addon.name}</h3>
                                            {addon.is_recommended && (
                                                <span className="text-[8px] bg-gold/20 text-gold px-2 py-0.5 rounded font-black uppercase">Consigliato</span>
                                            )}
                                            {!addon.is_active && (
                                                <span className="text-[8px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded font-black uppercase">Disattivo</span>
                                            )}
                                        </div>
                                        <p className="text-white/40 text-sm">{addon.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-white/30 text-xs line-through">{formatCurrency(addon.regular_price)}</p>
                                        <p className="text-2xl font-serif text-gold">{formatCurrency(addon.promo_price)}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(addon); }}
                                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                        >
                                            <Edit3 className="w-4 h-4 text-white/40" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(addon.id); }}
                                            className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-400/60" />
                                        </button>
                                        {expandedId === addon.id ? (
                                            <ChevronUp className="w-5 h-5 text-white/20" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-white/20" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedId === addon.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 px-6 py-4 bg-black/20"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Features</p>
                                                <ul className="space-y-1">
                                                    {addon.features.map((f, i) => (
                                                        <li key={i} className="text-xs text-white/60 flex items-center gap-2">
                                                            <Check className="w-3 h-3 text-gold" />
                                                            {f}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Disponibile per</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {addon.available_for_tiers.map(tier => (
                                                        <span key={tier} className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded capitalize">{tier}</span>
                                                    ))}
                                                </div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mt-4 mb-2">Pre-selezionato per</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {addon.pre_selected_for.map(tier => (
                                                        <span key={tier} className="text-xs bg-gold/10 text-gold px-2 py-1 rounded capitalize">{tier}</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">Stripe IDs</p>
                                                <div className="space-y-1 text-[10px] text-white/40 font-mono">
                                                    <p>Product: {addon.stripe_product_id}</p>
                                                    <p>Promo: {addon.stripe_promo_price_id}</p>
                                                    <p>Regular: {addon.stripe_regular_price_id}</p>
                                                </div>
                                                <a
                                                    href={`https://dashboard.stripe.com/products/${addon.stripe_product_id}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 mt-3 text-xs text-gold hover:underline"
                                                >
                                                    Vedi su Stripe <ExternalLink className="w-3 h-3" />
                                                </a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-charcoal border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-serif text-white">
                                        {editingId ? 'Modifica Add-on' : 'Nuovo Add-on'}
                                    </h2>
                                    <button onClick={() => setShowForm(false)} className="text-white/40 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Name & Description */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Nome *</label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none"
                                                placeholder="es. Setup Premium"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Icona</label>
                                            <select
                                                value={form.icon}
                                                onChange={e => setForm(prev => ({ ...prev, icon: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
                                            >
                                                {ICONS.map(icon => (
                                                    <option key={icon} value={icon}>{icon}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Descrizione</label>
                                        <input
                                            type="text"
                                            value={form.description}
                                            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none"
                                            placeholder="Breve descrizione per il checkout"
                                        />
                                    </div>

                                    {/* Pricing */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Prezzo Promo (€) *</label>
                                            <input
                                                type="number"
                                                value={form.promo_price / 100}
                                                onChange={e => setForm(prev => ({ ...prev, promo_price: Math.round(parseFloat(e.target.value) * 100) }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-gold text-2xl font-serif focus:border-gold/50 focus:outline-none"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Prezzo Regolare (€) *</label>
                                            <input
                                                type="number"
                                                value={form.regular_price / 100}
                                                onChange={e => setForm(prev => ({ ...prev, regular_price: Math.round(parseFloat(e.target.value) * 100) }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/40 text-2xl font-serif focus:border-gold/50 focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Features (bullet points)</label>
                                        <div className="space-y-2">
                                            {form.features.map((feature, index) => (
                                                <div key={index} className="flex items-center gap-2">
                                                    <input
                                                        type="text"
                                                        value={feature}
                                                        onChange={e => updateFeature(index, e.target.value)}
                                                        className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-gold/50 focus:outline-none"
                                                        placeholder="es. Configurazione completa in 48h"
                                                    />
                                                    {form.features.length > 1 && (
                                                        <button type="button" onClick={() => removeFeature(index)} className="text-red-400/60 hover:text-red-400">
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={addFeature}
                                                className="text-xs text-gold hover:underline flex items-center gap-1"
                                            >
                                                <Plus className="w-3 h-3" /> Aggiungi feature
                                            </button>
                                        </div>
                                    </div>

                                    {/* Tiers */}
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Disponibile per</label>
                                            <div className="flex flex-wrap gap-2">
                                                {TIERS.map(tier => (
                                                    <button
                                                        key={tier}
                                                        type="button"
                                                        onClick={() => toggleTier(tier, 'available_for_tiers')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${form.available_for_tiers.includes(tier)
                                                                ? 'bg-white/10 text-white border border-white/20'
                                                                : 'bg-white/5 text-white/30 border border-transparent'
                                                            }`}
                                                    >
                                                        {tier}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Pre-selezionato per</label>
                                            <div className="flex flex-wrap gap-2">
                                                {TIERS.map(tier => (
                                                    <button
                                                        key={tier}
                                                        type="button"
                                                        onClick={() => toggleTier(tier, 'pre_selected_for')}
                                                        className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-all ${form.pre_selected_for.includes(tier)
                                                                ? 'bg-gold/20 text-gold border border-gold/30'
                                                                : 'bg-white/5 text-white/30 border border-transparent'
                                                            }`}
                                                    >
                                                        {tier}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Options */}
                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={form.is_recommended}
                                                onChange={e => setForm(prev => ({ ...prev, is_recommended: e.target.checked }))}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50"
                                            />
                                            <span className="text-sm text-white/60">Mostra badge "Consigliato"</span>
                                        </label>
                                    </div>

                                    {/* Submit */}
                                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setShowForm(false)}
                                            className="px-6 py-3 text-white/40 hover:text-white transition-all"
                                        >
                                            Annulla
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 gold-gradient text-charcoal rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {saving ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Sincronizzando Stripe...
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    {editingId ? 'Aggiorna' : 'Crea & Sincronizza'}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
