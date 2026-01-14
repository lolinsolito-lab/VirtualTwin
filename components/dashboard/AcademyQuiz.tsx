'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Award, Sparkles, Trophy, ArrowRight } from 'lucide-react';

interface Question {
    id: number;
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface AcademyQuizProps {
    moduleId: string;
    moduleName: string;
    questions: Question[];
    onComplete: (score: number, total: number) => Promise<void>;
    onClose: () => void;
}

export function AcademyQuiz({ moduleId, moduleName, questions, onComplete, onClose }: AcademyQuizProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [quizState, setQuizState] = useState<'intro' | 'active' | 'results'>('intro');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submissionResult, setSubmissionResult] = useState<any>(null);

    const currentQuestion = questions[currentStep];

    const handleAnswer = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === currentQuestion.correctIndex) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = () => {
        if (currentStep < questions.length - 1) {
            setCurrentStep(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            handleFinish();
        }
    };

    const handleFinish = async () => {
        setQuizState('results');
        setIsSubmitting(true);
        try {
            const result = await onComplete(score, questions.length);
            setSubmissionResult(result);
        } catch (error) {
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
        exit: { opacity: 0, scale: 0.95 }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-charcoal/90 backdrop-blur-2xl">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white rounded-[3rem] overflow-hidden max-w-2xl w-full shadow-2xl border border-charcoal/5 flex flex-col min-h-[500px]"
            >
                {/* Header */}
                <div className="p-10 border-b border-charcoal/5 flex items-center justify-between">
                    <div>
                        <h3 className="text-2xl font-serif italic text-charcoal">{moduleName}</h3>
                        <p className="text-[10px] text-charcoal/40 font-black uppercase tracking-widest mt-1">Quiz di Validazione Sovereignty</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-charcoal/5 rounded-full transition-colors">
                        <XCircle className="w-6 h-6 text-charcoal/20" />
                    </button>
                </div>

                <div className="flex-1 p-10 flex flex-col justify-center">
                    <AnimatePresence mode="wait">
                        {quizState === 'intro' && (
                            <motion.div
                                key="intro"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="text-center"
                            >
                                <div className="w-24 h-24 bg-gold/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8">
                                    <Award className="w-12 h-12 text-gold" />
                                </div>
                                <h1 className="text-3xl font-serif italic text-charcoal mb-4">Pronto alla Prova?</h1>
                                <p className="text-charcoal/50 leading-relaxed mb-10 max-w-sm mx-auto">
                                    Completa questo quiz con il punteggio massimo per convalidare il modulo e ottenere **200 XP** e il tuo prossimo **Badge**.
                                </p>
                                <button
                                    onClick={() => setQuizState('active')}
                                    className="px-12 py-5 gold-gradient text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] shadow-luxury-sm hover:scale-105 transition-all"
                                >
                                    Inizia il Quiz
                                </button>
                            </motion.div>
                        )}

                        {quizState === 'active' && (
                            <motion.div
                                key="question"
                                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] text-gold font-black uppercase tracking-[0.3em]">Domanda {currentStep + 1} / {questions.length}</span>
                                    <div className="flex gap-1">
                                        {questions.map((_, i) => (
                                            <div key={i} className={`h-1 w-8 rounded-full ${i <= currentStep ? 'bg-gold' : 'bg-charcoal/5'}`} />
                                        ))}
                                    </div>
                                </div>

                                <h2 className="text-2xl font-serif italic text-charcoal leading-tight">{currentQuestion.text}</h2>

                                <div className="grid grid-cols-1 gap-4">
                                    {currentQuestion.options.map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            disabled={isAnswered}
                                            className={`p-6 rounded-2xl text-left border-2 transition-all duration-300 relative overflow-hidden ${!isAnswered
                                                ? 'bg-charcoal/5 border-transparent hover:border-gold/30 hover:bg-white'
                                                : idx === currentQuestion.correctIndex
                                                    ? 'bg-green-50 border-green-500 text-green-900'
                                                    : selectedOption === idx
                                                        ? 'bg-red-50 border-red-500 text-red-900'
                                                        : 'bg-charcoal/5 border-transparent opacity-50'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between relative z-10">
                                                <span className="text-sm font-medium">{opt}</span>
                                                {isAnswered && idx === currentQuestion.correctIndex && <CheckCircle2 className="w-5 h-5" />}
                                                {isAnswered && selectedOption === idx && idx !== currentQuestion.correctIndex && <XCircle className="w-5 h-5" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {isAnswered && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="bg-charcoal/5 p-6 rounded-2xl"
                                    >
                                        <p className="text-[11px] text-charcoal/60 leading-relaxed font-mono">
                                            <span className="font-bold uppercase tracking-widest text-gold block mb-1">Elite Insight:</span>
                                            {currentQuestion.explanation}
                                        </p>
                                    </motion.div>
                                )}

                                <div className="flex justify-end pt-4">
                                    <button
                                        onClick={handleNext}
                                        disabled={!isAnswered}
                                        className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isAnswered ? 'bg-charcoal text-white shadow-xl hover:translate-x-1' : 'bg-charcoal/10 text-charcoal/20 cursor-not-allowed'
                                            }`}
                                    >
                                        {currentStep === questions.length - 1 ? 'Vedi Risultati' : 'Prossima Domanda'}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {quizState === 'results' && (
                            <motion.div
                                key="results"
                                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <div className="relative inline-block mb-8">
                                    <div className="w-32 h-32 bg-gold/10 rounded-full flex items-center justify-center">
                                        <Trophy className={`w-16 h-16 ${score === questions.length ? 'text-gold' : 'text-charcoal/20'}`} />
                                    </div>
                                    {score === questions.length && (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-2 -right-2 bg-white text-gold p-2 rounded-full shadow-lg"
                                        >
                                            <Sparkles className="w-6 h-6" />
                                        </motion.div>
                                    )}
                                </div>

                                <h2 className="text-4xl font-serif italic text-charcoal mb-2">
                                    {score === questions.length ? 'Maestria Totale!' : 'C\'è ancora da imparare...'}
                                </h2>
                                <p className="text-charcoal/40 text-[10px] uppercase font-black tracking-[0.3em] mb-8">PUNTEGGIO: {score} / {questions.length}</p>

                                {score === questions.length ? (
                                    <div className="bg-green-50 p-8 rounded-[2rem] border border-green-100 mb-10 max-w-sm mx-auto">
                                        <p className="text-green-800 text-sm leading-relaxed mb-4">
                                            Hai dimostrato di avere la mentalità corretta. {submissionResult?.xpEarned > 0
                                                ? `Ti sono stati assegnati **${submissionResult.xpEarned} XP** e sei ora **Livello ${submissionResult.newLevel || 2}**!`
                                                : isSubmitting
                                                    ? 'Salvataggio in corso...'
                                                    : 'Competenza convalidata! (XP già riscattati precedentemente).'}
                                        </p>
                                        {submissionResult?.newBadges?.length > 0 && (
                                            <p className="text-gold text-[10px] font-black uppercase tracking-widest mt-4">
                                                Nuovi Achievement: {submissionResult.newBadges.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-charcoal/50 text-sm leading-relaxed mb-10 max-w-sm mx-auto">
                                        Per sbloccare XP e Badge, devi rispondere correttamente a tutte le domande. Rivedi le lezioni e riprova quando vuoi.
                                    </p>
                                )}

                                <div className="flex gap-4 justify-center">
                                    {score < questions.length && (
                                        <button
                                            onClick={() => {
                                                setCurrentStep(0);
                                                setScore(0);
                                                setQuizState('active');
                                                setIsAnswered(false);
                                                setSelectedOption(null);
                                            }}
                                            className="px-10 py-5 bg-charcoal/5 text-charcoal rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-charcoal/10 transition-all"
                                        >
                                            Riprova
                                        </button>
                                    )}
                                    <button
                                        onClick={onClose}
                                        className="px-10 py-5 gold-gradient text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-luxury-sm hover:scale-105 transition-all"
                                    >
                                        Chiudi
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

