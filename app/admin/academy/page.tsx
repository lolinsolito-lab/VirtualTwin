"use client";

import React, { useState, useEffect } from 'react';
import {
    GraduationCap,
    Plus,
    Edit3,
    Trash2,
    Check,
    X,
    Loader2,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Video,
    FileText,
    Headphones,
    BookOpen,
    Eye,
    EyeOff,
    Star,
    ExternalLink,
    Play,
    Clock,
    Lock,
    Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';

interface Course {
    id: string;
    title: string;
    description: string;
    thumbnail_url: string;
    min_tier: string;
    is_published: boolean;
    is_featured: boolean;
    display_order: number;
    module_count: number;
    created_at: string;
}

interface Module {
    id: string;
    course_id: string;
    title: string;
    description: string;
    content_type: string;
    content_url: string;
    thumbnail_url: string;
    duration_minutes: number;
    min_tier: string;
    is_published: boolean;
    is_preview: boolean;
    display_order: number;
}

const TIERS = ['curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'];
const TIER_COLORS: Record<string, string> = {
    curioso: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    solopreneur: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    entrepreneur: 'bg-green-500/20 text-green-400 border-green-500/30',
    conquistatore: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    imperatore: 'bg-gold/20 text-gold border-gold/30'
};

const CONTENT_TYPES = [
    { value: 'video', label: '🎬 Video', Icon: Video },
    { value: 'pdf', label: '📄 PDF', Icon: FileText },
    { value: 'audio', label: '🎧 Audio', Icon: Headphones },
    { value: 'text', label: '📝 Testo', Icon: BookOpen },
];

export default function AdminAcademy() {
    const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;
        const headers = new Headers(options.headers);
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        }
        return fetch(url, { ...options, headers });
    };

    const [courses, setCourses] = useState<Course[]>([]);
    const [modules, setModules] = useState<Record<string, Module[]>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedCourseId, setExpandedCourseId] = useState<string | null>(null);

    // Course Form
    const [showCourseForm, setShowCourseForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [courseForm, setCourseForm] = useState({
        title: '',
        description: '',
        thumbnail_url: '',
        min_tier: 'solopreneur',
        is_published: false,
        is_featured: false,
        display_order: 0
    });

    // Module Form
    const [showModuleForm, setShowModuleForm] = useState(false);
    const [editingModule, setEditingModule] = useState<Module | null>(null);
    const [selectedCourseForModule, setSelectedCourseForModule] = useState<string | null>(null);
    const [moduleForm, setModuleForm] = useState({
        title: '',
        description: '',
        content_type: 'video',
        content_url: '',
        thumbnail_url: '',
        duration_minutes: 0,
        min_tier: '',
        is_published: false,
        is_preview: false,
        display_order: 0
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        setLoading(true);
        try {
            const res = await fetchWithAuth('/api/admin/academy/courses');
            const data = await res.json();
            setCourses(data.courses || []);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchModules = async (courseId: string) => {
        try {
            const res = await fetchWithAuth(`/api/admin/academy/modules?course_id=${courseId}`);
            const data = await res.json();
            setModules(prev => ({ ...prev, [courseId]: data.modules || [] }));
        } catch (error) {
            console.error('Failed to fetch modules:', error);
        }
    };

    const toggleCourse = async (courseId: string) => {
        if (expandedCourseId === courseId) {
            setExpandedCourseId(null);
        } else {
            setExpandedCourseId(courseId);
            if (!modules[courseId]) {
                await fetchModules(courseId);
            }
        }
    };

    // Course CRUD
    const resetCourseForm = () => {
        setCourseForm({
            title: '',
            description: '',
            thumbnail_url: '',
            min_tier: 'solopreneur',
            is_published: false,
            is_featured: false,
            display_order: courses.length + 1
        });
        setEditingCourse(null);
    };

    const openCourseForm = (course?: Course) => {
        if (course) {
            setCourseForm({
                title: course.title,
                description: course.description || '',
                thumbnail_url: course.thumbnail_url || '',
                min_tier: course.min_tier,
                is_published: course.is_published,
                is_featured: course.is_featured,
                display_order: course.display_order
            });
            setEditingCourse(course);
        } else {
            resetCourseForm();
        }
        setShowCourseForm(true);
    };

    const saveCourse = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = editingCourse ? 'PUT' : 'POST';
            const body = editingCourse
                ? { id: editingCourse.id, ...courseForm }
                : courseForm;

            const res = await fetchWithAuth('/api/admin/academy/courses', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }

            await fetchCourses();
            setShowCourseForm(false);
            resetCourseForm();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteCourse = async (id: string) => {
        if (!confirm('Eliminare questo corso e tutti i suoi moduli?')) return;
        try {
            await fetchWithAuth(`/api/admin/academy/courses?id=${id}`, { method: 'DELETE' });
            await fetchCourses();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    // Module CRUD
    const resetModuleForm = () => {
        setModuleForm({
            title: '',
            description: '',
            content_type: 'video',
            content_url: '',
            thumbnail_url: '',
            duration_minutes: 0,
            min_tier: '',
            is_published: false,
            is_preview: false,
            display_order: 0
        });
        setEditingModule(null);
    };

    const openModuleForm = (courseId: string, module?: Module) => {
        setSelectedCourseForModule(courseId);
        if (module) {
            setModuleForm({
                title: module.title,
                description: module.description || '',
                content_type: module.content_type,
                content_url: module.content_url || '',
                thumbnail_url: module.thumbnail_url || '',
                duration_minutes: module.duration_minutes || 0,
                min_tier: module.min_tier || '',
                is_published: module.is_published,
                is_preview: module.is_preview,
                display_order: module.display_order
            });
            setEditingModule(module);
        } else {
            resetModuleForm();
            setModuleForm(prev => ({
                ...prev,
                display_order: (modules[courseId]?.length || 0) + 1
            }));
        }
        setShowModuleForm(true);
    };

    const saveModule = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const method = editingModule ? 'PUT' : 'POST';
            const body = editingModule
                ? { id: editingModule.id, ...moduleForm }
                : { course_id: selectedCourseForModule, ...moduleForm };

            const res = await fetchWithAuth('/api/admin/academy/modules', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error);
            }

            if (selectedCourseForModule) {
                await fetchModules(selectedCourseForModule);
            }
            await fetchCourses();
            setShowModuleForm(false);
            resetModuleForm();
        } catch (error: any) {
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const deleteModule = async (id: string, courseId: string) => {
        if (!confirm('Eliminare questo modulo?')) return;
        try {
            await fetchWithAuth(`/api/admin/academy/modules?id=${id}`, { method: 'DELETE' });
            await fetchModules(courseId);
            await fetchCourses();
        } catch (error) {
            console.error('Delete failed:', error);
        }
    };

    const togglePublish = async (course: Course) => {
        try {
            await fetchWithAuth('/api/admin/academy/courses', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: course.id, is_published: !course.is_published })
            });
            await fetchCourses();
        } catch (error) {
            console.error('Toggle failed:', error);
        }
    };

    return (
        <div className="p-8 lg:p-12">
            {/* Header */}
            <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="h-[1px] w-12 bg-gold/50"></span>
                        <span className="text-gold text-[10px] uppercase tracking-[0.8em] font-black">Knowledge Arsenal</span>
                    </div>
                    <h1 className="font-serif text-5xl lg:text-7xl italic text-white leading-tight">
                        Academy <span className="gold-text-gradient">Manager.</span>
                    </h1>
                    <p className="text-white/40 mt-4 text-sm">
                        Crea e gestisci corsi, video e contenuti formativi esclusivi per ogni tier.
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={fetchCourses}
                        className={`p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all ${loading ? 'animate-spin' : ''}`}
                    >
                        <RefreshCw className="w-5 h-5 text-white/60" />
                    </button>
                    <button
                        onClick={() => openCourseForm()}
                        className="px-6 py-4 gold-gradient text-charcoal rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all shadow-luxury"
                    >
                        <Plus className="w-4 h-4" />
                        Nuovo Corso
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Corsi Totali</p>
                    <p className="text-4xl font-serif text-white">{courses.length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Pubblicati</p>
                    <p className="text-4xl font-serif text-green-400">{courses.filter(c => c.is_published).length}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Moduli Totali</p>
                    <p className="text-4xl font-serif text-gold">{courses.reduce((sum, c) => sum + (c.module_count || 0), 0)}</p>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-2">In Bozza</p>
                    <p className="text-4xl font-serif text-orange-400">{courses.filter(c => !c.is_published).length}</p>
                </div>
            </div>

            {/* Courses List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-gold animate-spin" />
                    </div>
                ) : courses.length === 0 ? (
                    <div className="text-center py-20 text-white/30">
                        <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <p>Nessun corso creato. Clicca "Nuovo Corso" per iniziare.</p>
                    </div>
                ) : (
                    courses.map((course) => (
                        <motion.div
                            key={course.id}
                            layout
                            className={`bg-white/5 border ${course.is_published ? 'border-white/10' : 'border-orange-500/20'} rounded-2xl overflow-hidden`}
                        >
                            {/* Course Header */}
                            <div
                                className="p-6 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-all"
                                onClick={() => toggleCourse(course.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                        <GraduationCap className="w-6 h-6 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-serif text-white">{course.title}</h3>
                                            <span className={`text-[8px] px-2 py-0.5 rounded border uppercase font-black ${TIER_COLORS[course.min_tier]}`}>
                                                {course.min_tier}
                                            </span>
                                            {course.is_featured && (
                                                <Star className="w-4 h-4 text-gold fill-gold" />
                                            )}
                                            {!course.is_published && (
                                                <span className="text-[8px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-black uppercase">Bozza</span>
                                            )}
                                        </div>
                                        <p className="text-white/40 text-sm">{course.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="text-right mr-4">
                                        <p className="text-2xl font-serif text-gold">{course.module_count}</p>
                                        <p className="text-[10px] text-white/30 uppercase">moduli</p>
                                    </div>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); togglePublish(course); }}
                                        className={`p-2 rounded-lg transition-all ${course.is_published ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/30'}`}
                                        title={course.is_published ? 'Nascondi' : 'Pubblica'}
                                    >
                                        {course.is_published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openCourseForm(course); }}
                                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                    >
                                        <Edit3 className="w-4 h-4 text-white/40" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); deleteCourse(course.id); }}
                                        className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-400/60" />
                                    </button>
                                    {expandedCourseId === course.id ? (
                                        <ChevronUp className="w-5 h-5 text-white/20" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-white/20" />
                                    )}
                                </div>
                            </div>

                            {/* Modules List (Expanded) */}
                            <AnimatePresence>
                                {expandedCourseId === course.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-white/5 bg-black/20"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <h4 className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Moduli del Corso</h4>
                                                <button
                                                    onClick={() => openModuleForm(course.id)}
                                                    className="px-4 py-2 bg-purple-500/20 text-purple-300 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-purple-500/30 transition-all"
                                                >
                                                    <Plus className="w-3 h-3" /> Aggiungi Modulo
                                                </button>
                                            </div>

                                            {!modules[course.id] ? (
                                                <div className="flex items-center justify-center py-8">
                                                    <Loader2 className="w-5 h-5 text-white/20 animate-spin" />
                                                </div>
                                            ) : modules[course.id].length === 0 ? (
                                                <p className="text-white/20 text-center py-8 text-sm">Nessun modulo. Aggiungi il primo!</p>
                                            ) : (
                                                <div className="space-y-2">
                                                    {modules[course.id].map((module, index) => {
                                                        const ContentIcon = CONTENT_TYPES.find(t => t.value === module.content_type)?.Icon || Video;
                                                        return (
                                                            <div
                                                                key={module.id}
                                                                className={`flex items-center justify-between p-4 rounded-xl bg-white/5 border ${module.is_published ? 'border-white/10' : 'border-orange-500/20'}`}
                                                            >
                                                                <div className="flex items-center gap-4">
                                                                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white/40">
                                                                        {index + 1}
                                                                    </div>
                                                                    <ContentIcon className="w-5 h-5 text-purple-400" />
                                                                    <div>
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-white font-medium">{module.title}</span>
                                                                            {module.is_preview && (
                                                                                <span className="text-[8px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-black uppercase">Preview</span>
                                                                            )}
                                                                            {!module.is_published && (
                                                                                <span className="text-[8px] bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded font-black uppercase">Bozza</span>
                                                                            )}
                                                                        </div>
                                                                        {module.duration_minutes > 0 && (
                                                                            <span className="text-[10px] text-white/30 flex items-center gap-1">
                                                                                <Clock className="w-3 h-3" /> {module.duration_minutes} min
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    {module.content_url && (
                                                                        <a
                                                                            href={module.content_url}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                                                            onClick={e => e.stopPropagation()}
                                                                        >
                                                                            <ExternalLink className="w-4 h-4 text-white/40" />
                                                                        </a>
                                                                    )}
                                                                    <button
                                                                        onClick={() => openModuleForm(course.id, module)}
                                                                        className="p-2 hover:bg-white/10 rounded-lg transition-all"
                                                                    >
                                                                        <Edit3 className="w-4 h-4 text-white/40" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => deleteModule(module.id, course.id)}
                                                                        className="p-2 hover:bg-red-500/10 rounded-lg transition-all"
                                                                    >
                                                                        <Trash2 className="w-4 h-4 text-red-400/60" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Course Form Modal */}
            <AnimatePresence>
                {showCourseForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowCourseForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-charcoal border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-serif text-white">
                                        {editingCourse ? 'Modifica Corso' : 'Nuovo Corso'}
                                    </h2>
                                    <button onClick={() => setShowCourseForm(false)} className="text-white/40 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={saveCourse} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Titolo *</label>
                                        <input
                                            type="text"
                                            value={courseForm.title}
                                            onChange={e => setCourseForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none"
                                            placeholder="es. Fondamenti VirtualTwin"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Descrizione</label>
                                        <textarea
                                            value={courseForm.description}
                                            onChange={e => setCourseForm(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none resize-none"
                                            placeholder="Descrizione del corso..."
                                            rows={3}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Thumbnail URL</label>
                                        <input
                                            type="url"
                                            value={courseForm.thumbnail_url}
                                            onChange={e => setCourseForm(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none"
                                            placeholder="https://..."
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-3">Tier Minimo</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {TIERS.map(tier => (
                                                <button
                                                    key={tier}
                                                    type="button"
                                                    onClick={() => setCourseForm(prev => ({ ...prev, min_tier: tier }))}
                                                    className={`p-3 rounded-xl text-center transition-all capitalize text-xs font-bold ${courseForm.min_tier === tier
                                                        ? TIER_COLORS[tier]
                                                        : 'bg-white/5 text-white/30 border border-white/10 hover:bg-white/10'
                                                        }`}
                                                >
                                                    {tier}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={courseForm.is_published}
                                                onChange={e => setCourseForm(prev => ({ ...prev, is_published: e.target.checked }))}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50"
                                            />
                                            <span className="text-sm text-white/60">Pubblica subito</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={courseForm.is_featured}
                                                onChange={e => setCourseForm(prev => ({ ...prev, is_featured: e.target.checked }))}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50"
                                            />
                                            <span className="text-sm text-white/60">In evidenza ⭐</span>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setShowCourseForm(false)}
                                            className="px-6 py-3 text-white/40 hover:text-white transition-all"
                                        >
                                            Annulla
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 gold-gradient text-charcoal rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {editingCourse ? 'Aggiorna' : 'Crea Corso'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Module Form Modal */}
            <AnimatePresence>
                {showModuleForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModuleForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-charcoal border border-white/10 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-serif text-white">
                                        {editingModule ? 'Modifica Modulo' : 'Nuovo Modulo'}
                                    </h2>
                                    <button onClick={() => setShowModuleForm(false)} className="text-white/40 hover:text-white">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <form onSubmit={saveModule} className="space-y-6">
                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Titolo *</label>
                                        <input
                                            type="text"
                                            value={moduleForm.title}
                                            onChange={e => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none"
                                            placeholder="es. Introduzione al Clone"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Descrizione</label>
                                        <textarea
                                            value={moduleForm.description}
                                            onChange={e => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none resize-none"
                                            placeholder="Cosa imparerai in questo modulo..."
                                            rows={2}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-3">Tipo Contenuto</label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {CONTENT_TYPES.map(ct => (
                                                <button
                                                    key={ct.value}
                                                    type="button"
                                                    onClick={() => setModuleForm(prev => ({ ...prev, content_type: ct.value }))}
                                                    className={`p-3 rounded-xl flex flex-col items-center gap-1 transition-all ${moduleForm.content_type === ct.value
                                                        ? 'bg-purple-500/20 border-2 border-purple-500 text-purple-300'
                                                        : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10'
                                                        }`}
                                                >
                                                    <ct.Icon className="w-5 h-5" />
                                                    <span className="text-[9px] uppercase">{ct.value}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">URL Contenuto</label>
                                        <input
                                            type="url"
                                            value={moduleForm.content_url}
                                            onChange={e => setModuleForm(prev => ({ ...prev, content_url: e.target.value }))}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:border-gold/50 focus:outline-none"
                                            placeholder="https://youtube.com/... o link diretto"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Durata (minuti)</label>
                                            <input
                                                type="number"
                                                value={moduleForm.duration_minutes || ''}
                                                onChange={e => setModuleForm(prev => ({ ...prev, duration_minutes: parseInt(e.target.value) || 0 }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
                                                placeholder="0"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-widest block mb-2">Ordine</label>
                                            <input
                                                type="number"
                                                value={moduleForm.display_order}
                                                onChange={e => setModuleForm(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-gold/50 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={moduleForm.is_published}
                                                onChange={e => setModuleForm(prev => ({ ...prev, is_published: e.target.checked }))}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50"
                                            />
                                            <span className="text-sm text-white/60">Pubblica</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={moduleForm.is_preview}
                                                onChange={e => setModuleForm(prev => ({ ...prev, is_preview: e.target.checked }))}
                                                className="w-4 h-4 rounded border-white/20 bg-white/5 text-gold focus:ring-gold/50"
                                            />
                                            <span className="text-sm text-white/60">Preview gratuita</span>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/10">
                                        <button
                                            type="button"
                                            onClick={() => setShowModuleForm(false)}
                                            className="px-6 py-3 text-white/40 hover:text-white transition-all"
                                        >
                                            Annulla
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-3 bg-purple-500 text-white rounded-xl font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {editingModule ? 'Aggiorna' : 'Crea Modulo'}
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
