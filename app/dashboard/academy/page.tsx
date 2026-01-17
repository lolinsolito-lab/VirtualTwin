'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    School, Copy, Check, Send, MessageCircle, Target, Sparkles,
    PlayCircle, Lock, Trophy, Award, TrendingUp, Crown, X,
    FileText, Headphones, Volume2, Pause, Play, SkipForward,
    SkipBack, Download, Maximize2, Minimize2, BookOpen, Video,
    ChevronRight, ChevronDown
} from 'lucide-react';
import { useSovereign } from '@/components/providers/SovereignProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { PlanTier } from '@/lib/pricing';

// Tier hierarchy for access control
const TIER_ORDER: PlanTier[] = ['curioso', 'solopreneur', 'entrepreneur', 'conquistatore', 'imperatore'];

function canAccess(userTier: PlanTier, requiredTier: PlanTier): boolean {
    return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(requiredTier);
}

// ==================== CINEMA MODE VIDEO PLAYER ====================
function CinemaPlayer({
    video,
    onClose,
    onComplete
}: {
    video: any;
    onClose: () => void;
    onComplete: (videoId: string, xp: number) => void;
}) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Simulate video progress
    useEffect(() => {
        if (!isPlaying) return;
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 100);
        return () => clearInterval(interval);
    }, [isPlaying]);

    useEffect(() => {
        if (progress >= 100) {
            onComplete(video.id, video.xp);
        }
    }, [progress, video.id, video.xp, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl flex items-center justify-center"
        >
            {/* Ambient glow */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 blur-[150px] rounded-full" />
            </div>

            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
                <X className="w-5 h-5" />
            </button>

            {/* Video container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`relative ${isFullscreen ? 'w-full h-full' : 'w-full max-w-5xl mx-6'}`}
            >
                {/* Video area */}
                <div className={`relative bg-black rounded-2xl overflow-hidden ${isFullscreen ? 'h-full' : 'aspect-video'}`}>
                    {/* Placeholder for actual video */}
                    <div className="absolute inset-0 flex items-center justify-center bg-charcoal/50">
                        <div className="text-center">
                            <PlayCircle className="w-20 h-20 text-gold/30 mx-auto mb-4" />
                            <p className="text-white/30 text-sm">Video Player - Demo Mode</p>
                        </div>
                    </div>

                    {/* Controls overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 to-transparent">
                        {/* Progress bar */}
                        <div className="mb-4">
                            <div className="h-1 bg-white/20 rounded-full overflow-hidden cursor-pointer">
                                <motion.div
                                    className="h-full bg-gold"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-1 text-[10px] text-white/40">
                                <span>{Math.floor(progress / 100 * 12)}:00</span>
                                <span>{video.duration}</span>
                            </div>
                        </div>

                        {/* Control buttons */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsPlaying(!isPlaying)}
                                    className="w-12 h-12 bg-gold rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                                >
                                    {isPlaying ? <Pause className="w-5 h-5 text-charcoal" /> : <Play className="w-5 h-5 text-charcoal ml-0.5" />}
                                </button>
                                <button className="p-2 text-white/50 hover:text-white transition-colors">
                                    <SkipBack className="w-5 h-5" />
                                </button>
                                <button className="p-2 text-white/50 hover:text-white transition-colors">
                                    <SkipForward className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-2 ml-2">
                                    <Volume2 className="w-4 h-4 text-white/50" />
                                    <div className="w-20 h-1 bg-white/20 rounded-full">
                                        <div className="w-3/4 h-full bg-white/50 rounded-full" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="px-3 py-1 bg-gold/20 rounded-lg text-gold text-[10px] font-bold uppercase tracking-wider">
                                    +{video.xp} XP
                                </div>
                                <button
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    className="p-2 text-white/50 hover:text-white transition-colors"
                                >
                                    {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Video info below */}
                {!isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 flex items-center justify-between"
                    >
                        <div>
                            <h2 className="text-2xl font-serif italic text-white">{video.title}</h2>
                            <p className="text-white/40 text-sm mt-1">{video.duration} • Academy Élite</p>
                        </div>
                        <button
                            onClick={() => onComplete(video.id, video.xp)}
                            className="px-6 py-3 bg-gold text-charcoal rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-white transition-colors"
                        >
                            Segna Completato
                        </button>
                    </motion.div>
                )}
            </motion.div>
        </motion.div>
    );
}

// ==================== PDF READER MODAL ====================
function PDFReader({
    resource,
    onClose
}: {
    resource: { title: string; url?: string };
    onClose: () => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-charcoal/95 backdrop-blur-xl flex items-center justify-center p-6"
        >
            {/* Warm reading ambient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-gold/10 blur-[120px] rounded-full" />
            </div>

            {/* Header */}
            <div className="absolute top-0 inset-x-0 p-6 flex items-center justify-between bg-gradient-to-b from-charcoal to-transparent z-10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-white font-serif italic">{resource.title}</h2>
                        <p className="text-white/40 text-[10px] uppercase tracking-widest">PDF Document</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 transition-colors">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                    <button
                        onClick={onClose}
                        className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* PDF Viewer */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-4xl h-[80vh] bg-white rounded-2xl overflow-hidden shadow-2xl mt-16"
            >
                <div className="h-full flex items-center justify-center bg-gray-100">
                    <div className="text-center p-12">
                        <FileText className="w-16 h-16 text-charcoal/20 mx-auto mb-4" />
                        <p className="text-charcoal/40 text-sm mb-2">PDF Viewer</p>
                        <p className="text-charcoal/30 text-xs">Il documento verrà caricato qui</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==================== AUDIO PLAYER MODAL ====================
function AudioPlayer({
    resource,
    onClose
}: {
    resource: { title: string; duration?: string };
    onClose: () => void;
}) {
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(30);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-purple-900/95 via-charcoal/95 to-indigo-900/95 backdrop-blur-xl flex items-center justify-center"
        >
            {/* Ambient waves */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:1s]" />
            </div>

            <button
                onClick={onClose}
                className="absolute top-6 right-6 z-10 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
            >
                <X className="w-5 h-5" />
            </button>

            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-center max-w-md mx-6"
            >
                {/* Album art placeholder */}
                <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-48 h-48 mx-auto mb-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-2xl"
                >
                    <div className="w-12 h-12 bg-charcoal rounded-full flex items-center justify-center">
                        <Headphones className="w-6 h-6 text-white" />
                    </div>
                </motion.div>

                <h2 className="text-2xl font-serif italic text-white mb-2">{resource.title}</h2>
                <p className="text-white/40 text-sm mb-8">Academy Élite • Audio Guide</p>

                {/* Waveform visualization */}
                <div className="flex items-end justify-center gap-1 h-12 mb-6">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: isPlaying ? [10, Math.random() * 40 + 10, 10] : 10 }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                            className="w-1 bg-gradient-to-t from-purple-500 to-indigo-400 rounded-full"
                        />
                    ))}
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="flex justify-between mt-2 text-[10px] text-white/40">
                        <span>3:42</span>
                        <span>{resource.duration || '12:00'}</span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6">
                    <button className="p-3 text-white/50 hover:text-white transition-colors">
                        <SkipBack className="w-6 h-6" />
                    </button>
                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                    >
                        {isPlaying ? <Pause className="w-7 h-7 text-charcoal" /> : <Play className="w-7 h-7 text-charcoal ml-1" />}
                    </button>
                    <button className="p-3 text-white/50 hover:text-white transition-colors">
                        <SkipForward className="w-6 h-6" />
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ==================== CONTENT CARD ====================
function ContentCard({
    item,
    type,
    isLocked,
    onOpen
}: {
    item: any;
    type: 'video' | 'pdf' | 'audio';
    isLocked: boolean;
    onOpen: () => void;
}) {
    const icons = { video: Video, pdf: FileText, audio: Headphones };
    const colors = {
        video: 'from-gold/20 to-amber-500/10 border-gold/20',
        pdf: 'from-amber-500/20 to-orange-500/10 border-amber-500/20',
        audio: 'from-purple-500/20 to-indigo-500/10 border-purple-500/20'
    };
    const Icon = icons[type];

    return (
        <motion.button
            whileHover={{ scale: isLocked ? 1 : 1.02, y: isLocked ? 0 : -2 }}
            whileTap={{ scale: isLocked ? 1 : 0.98 }}
            onClick={isLocked ? undefined : onOpen}
            disabled={isLocked}
            className={`relative w-full p-4 rounded-2xl border bg-gradient-to-br ${colors[type]} 
                        text-left transition-all group overflow-hidden
                        ${isLocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:shadow-lg'}`}
        >
            {/* Locked overlay */}
            {isLocked && (
                <div className="absolute inset-0 bg-charcoal/30 backdrop-blur-sm flex items-center justify-center z-10 rounded-2xl">
                    <div className="text-center">
                        <Lock className="w-5 h-5 text-white/50 mx-auto mb-1" />
                        <span className="text-[8px] text-white/40 uppercase tracking-wider">Upgrade</span>
                    </div>
                </div>
            )}

            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                                 ${type === 'video' ? 'bg-gold/20 text-gold' :
                        type === 'pdf' ? 'bg-amber-500/20 text-amber-500' :
                            'bg-purple-500/20 text-purple-500'}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-charcoal text-sm truncate group-hover:text-gold transition-colors">
                        {item.title}
                    </h4>
                    <p className="text-charcoal/40 text-[10px] mt-0.5">
                        {item.duration || '10 min'}
                    </p>
                </div>
                {item.xp && (
                    <span className="px-2 py-1 bg-gold/10 text-gold text-[9px] font-bold rounded-lg">
                        +{item.xp} XP
                    </span>
                )}
            </div>
        </motion.button>
    );
}

// ==================== COURSE MODULE ====================
function CourseModule({
    module,
    userTier,
    completedIds,
    onOpenVideo,
    onOpenPDF,
    onOpenAudio
}: {
    module: any;
    userTier: PlanTier;
    completedIds: string[];
    onOpenVideo: (video: any) => void;
    onOpenPDF: (resource: any) => void;
    onOpenAudio: (resource: any) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const isLocked = !canAccess(userTier, module.tier);
    const completedCount = module.videos?.filter((v: any) => completedIds.includes(v.id)).length || 0;
    const totalCount = module.videos?.length || 0;

    const tierLabels: Record<PlanTier, string> = {
        curioso: 'Trial',
        solopreneur: 'Solopreneur',
        entrepreneur: 'Entrepreneur',
        conquistatore: 'Conquistatore',
        imperatore: 'Imperatore'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-3xl overflow-hidden border transition-all
                        ${isLocked ? 'bg-charcoal/5 border-charcoal/10 opacity-70' : 'bg-white border-charcoal/10 shadow-sm'}`}
        >
            {/* Module Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-5 flex items-center justify-between text-left hover:bg-charcoal/[0.02] transition-colors"
            >
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center
                                     ${isLocked ? 'bg-charcoal/10' : 'bg-gold/10'}`}>
                        {isLocked ? (
                            <Lock className="w-5 h-5 text-charcoal/30" />
                        ) : completedCount === totalCount && totalCount > 0 ? (
                            <Trophy className="w-5 h-5 text-gold" />
                        ) : (
                            <PlayCircle className="w-5 h-5 text-gold" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-serif italic text-charcoal text-lg">{module.name}</h3>
                        <div className="flex items-center gap-3 mt-1">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded
                                              ${isLocked ? 'bg-charcoal/10 text-charcoal/40' : 'bg-gold/10 text-gold'}`}>
                                {tierLabels[module.tier as PlanTier]}
                            </span>
                            {totalCount > 0 && (
                                <span className="text-[10px] text-charcoal/40">
                                    {completedCount}/{totalCount} completati
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <ChevronDown className={`w-5 h-5 text-charcoal/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Module Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {module.videos?.map((video: any) => (
                                <ContentCard
                                    key={video.id}
                                    item={video}
                                    type="video"
                                    isLocked={isLocked || video.isLocked}
                                    onOpen={() => onOpenVideo(video)}
                                />
                            ))}
                            {/* Demo PDF/Audio items */}
                            {module.tier === 'entrepreneur' && (
                                <>
                                    <ContentCard
                                        item={{ title: 'Playbook Vendite Elite', duration: 'PDF • 24 pages' }}
                                        type="pdf"
                                        isLocked={isLocked}
                                        onOpen={() => onOpenPDF({ title: 'Playbook Vendite Elite' })}
                                    />
                                    <ContentCard
                                        item={{ title: 'Meditazione del Sovrano', duration: '15:30' }}
                                        type="audio"
                                        isLocked={isLocked}
                                        onOpen={() => onOpenAudio({ title: 'Meditazione del Sovrano', duration: '15:30' })}
                                    />
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ==================== MAIN PAGE ====================
export default function AcademyPage() {
    const { user, loading, refreshProfile } = useSovereign();
    const router = useRouter();

    const [selectedVideo, setSelectedVideo] = useState<any>(null);
    const [selectedPDF, setSelectedPDF] = useState<any>(null);
    const [selectedAudio, setSelectedAudio] = useState<any>(null);
    const [isCompleting, setIsCompleting] = useState(false);

    const [dbCourses, setDbCourses] = useState<any[]>([]);
    const [loadingCourses, setLoadingCourses] = useState(true);

    // Fetch courses
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const tier = user?.plan_tier || 'curioso';
                const res = await fetch(`/api/academy/courses?tier=${tier}`);
                const data = await res.json();
                if (data.courses) setDbCourses(data.courses);
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoadingCourses(false);
            }
        };
        if (!loading) fetchCourses();
    }, [user?.plan_tier, loading]);

    // Convert to modules format
    const modules = dbCourses.length > 0 ? dbCourses.map(course => ({
        name: course.title,
        tier: course.min_tier as PlanTier,
        description: course.description || '',
        isLocked: course.isLocked,
        videos: (course.modules || []).map((m: any) => ({
            id: m.id,
            title: m.title,
            duration: m.duration_minutes ? `${m.duration_minutes}:00` : '10:00',
            xp: m.duration_minutes ? m.duration_minutes * 5 : 50,
            content_url: m.content_url,
            isLocked: m.isLocked
        })),
    })) : [
        // Fallback
        {
            name: "Fondamenta dell'Impero",
            tier: "curioso" as PlanTier,
            description: "I primi passi per l'automazione",
            videos: [
                { id: "v1", title: 'La Genesi del Clone AI', duration: '12:45', xp: 25 },
                { id: "v2", title: 'Mentalità Sovereign', duration: '08:20', xp: 25 },
            ],
        },
        {
            name: "Esecuzione Strategica",
            tier: "solopreneur" as PlanTier,
            description: "Trasforma conversazioni in conversioni",
            videos: [
                { id: "v3", title: 'Architettura delle Vendite', duration: '15:20', xp: 50 },
                { id: "v4", title: 'Gestione Obiezioni', duration: '14:30', xp: 50 },
            ],
        },
        {
            name: "Dominio del Mercato",
            tier: "entrepreneur" as PlanTier,
            description: "Outreach e scaling avanzato",
            videos: [
                { id: "v5", title: 'Outreach Magnetico', duration: '18:10', xp: 100 },
                { id: "v6", title: 'Scaling da 1 a 100', duration: '20:00', xp: 100 },
            ],
        },
    ];

    const handleVideoComplete = async (videoId: string, xp: number) => {
        if (isCompleting || !user) return;
        setIsCompleting(true);

        try {
            await fetch('/api/academy/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ videoId, xpEarned: xp, userId: user.id })
            });
            await refreshProfile();
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setIsCompleting(false);
            setSelectedVideo(null);
        }
    };

    if (loading || loadingCourses) {
        return (
            <div className="h-[calc(100vh-60px)] flex items-center justify-center bg-champagne">
                <div className="text-center">
                    <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <School className="w-8 h-8 text-gold" />
                    </div>
                    <p className="text-gold text-[10px] uppercase tracking-widest font-bold">Caricamento Academy...</p>
                </div>
            </div>
        );
    }

    const userTier = (user?.plan_tier || 'curioso') as PlanTier;
    const completedIds = user?.completed_video_ids || [];
    const userXP = user?.xp_total || 0;
    const userLevel = user?.level || 1;

    return (
        <div className="h-[calc(100vh-60px)] flex flex-col bg-champagne overflow-hidden">
            {/* Compact Header */}
            <header className="flex-shrink-0 px-4 lg:px-8 py-4 bg-white/50 backdrop-blur-sm border-b border-charcoal/5">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-charcoal rounded-xl flex items-center justify-center">
                            <School className="w-5 h-5 text-gold" />
                        </div>
                        <div>
                            <h1 className="font-serif italic text-xl lg:text-2xl text-charcoal">Academy Élite</h1>
                            <p className="text-charcoal/40 text-[10px] uppercase tracking-widest">Private Knowledge Base</p>
                        </div>
                    </div>

                    {/* XP & Level */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-charcoal rounded-xl">
                            <Trophy className="w-4 h-4 text-gold" />
                            <div className="text-right">
                                <p className="text-gold text-sm font-bold">{userXP} XP</p>
                                <p className="text-white/40 text-[9px] uppercase tracking-wider">Level {userLevel}</p>
                            </div>
                        </div>
                        <div className="px-3 py-2 bg-gold/10 rounded-xl">
                            <span className="text-gold text-[10px] font-bold uppercase tracking-wider">
                                {userTier}
                            </span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content - Scrollable */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-4">
                    {/* Courses Grid */}
                    {modules.map((module, idx) => (
                        <CourseModule
                            key={idx}
                            module={module}
                            userTier={userTier}
                            completedIds={completedIds}
                            onOpenVideo={setSelectedVideo}
                            onOpenPDF={setSelectedPDF}
                            onOpenAudio={setSelectedAudio}
                        />
                    ))}

                    {/* Bottom CTA */}
                    <div className="mt-8 p-6 lg:p-10 bg-charcoal rounded-3xl text-white">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            <div>
                                <h2 className="text-2xl lg:text-3xl font-serif italic mb-2">
                                    Sblocca tutto il <span className="text-gold">Potenziale</span>
                                </h2>
                                <p className="text-white/50 text-sm">
                                    Upgrade per accedere a tutti i corsi, PDF e audio guide.
                                </p>
                            </div>
                            <button
                                onClick={() => router.push('/pricing')}
                                className="px-8 py-4 bg-gold text-charcoal rounded-xl text-[11px] font-bold uppercase tracking-wider hover:bg-white transition-colors flex items-center gap-2"
                            >
                                <Crown className="w-4 h-4" />
                                Upgrade Piano
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ========== IMMERSIVE MODALS ========== */}
            <AnimatePresence>
                {selectedVideo && (
                    <CinemaPlayer
                        video={selectedVideo}
                        onClose={() => setSelectedVideo(null)}
                        onComplete={handleVideoComplete}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedPDF && (
                    <PDFReader
                        resource={selectedPDF}
                        onClose={() => setSelectedPDF(null)}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {selectedAudio && (
                    <AudioPlayer
                        resource={selectedAudio}
                        onClose={() => setSelectedAudio(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
