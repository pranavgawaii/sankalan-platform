import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [phase, setPhase] = useState<'falling' | 'content' | 'complete'>('falling');
    const [progress, setProgress] = useState(0);

    const letters = "SANKALAN".split("");

    // Animation timeline
    useEffect(() => {
        // Phase 1: Falling Blocks -> Content Reveal (1.2s)
        const timer1 = setTimeout(() => setPhase('content'), 1200);

        return () => clearTimeout(timer1);
    }, []);

    // Progress Bar Logic
    useEffect(() => {
        if (phase === 'content') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setTimeout(() => setPhase('complete'), 500);
                        return 100;
                    }
                    return prev + 2;
                });
            }, 30);
            return () => clearInterval(interval);
        }
    }, [phase]);

    // Exit Logic
    useEffect(() => {
        if (phase === 'complete') {
            const timer = setTimeout(() => {
                onComplete();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white"
        >
            {/* Grid Pattern Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}
            />

            {/* Content Container */}
            <div className="relative flex flex-col items-center z-10 w-full max-w-4xl px-4">

                {/* Falling Blocks */}
                <div className="flex gap-2 md:gap-4 mb-12 overflow-hidden h-24 items-end">
                    {letters.map((char, i) => (
                        <motion.div
                            key={i}
                            initial={{ y: -400, opacity: 0 }}
                            animate={phase !== 'complete' ? { y: 0, opacity: 1 } : { y: 100, opacity: 0 }}
                            transition={phase !== 'complete'
                                ? {
                                    type: "spring",
                                    damping: 15,
                                    stiffness: 200,
                                    delay: i * 0.1 // Staggered fall
                                }
                                : { duration: 0.3, delay: i * 0.05 } // Staggered exit
                            }
                            whileHover={{ scale: 1.1, rotate: 5, backgroundColor: "#000", color: "#FFF", y: -5 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 md:w-16 md:h-16 lg:w-20 lg:h-20 flex items-center justify-center font-black text-xl md:text-3xl lg:text-4xl font-mono border-4 border-black bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer select-none"
                        >
                            {char}
                        </motion.div>
                    ))}
                </div>

                {/* Tagline & Progress (Reveals after blocks land) */}
                <AnimatePresence>
                    {(phase === 'content' || phase === 'complete') && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={phase === 'content' ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-col items-center w-full"
                        >
                            {/* Tagline */}
                            <div className="text-center mb-12 h-8">
                                <h2 className="text-lg md:text-2xl font-black font-mono tracking-[0.2em] uppercase text-black">
                                    <ScrambleText text="EXAM PREP • REIMAGINED" />
                                </h2>
                            </div>

                            {/* Progress Bar */}
                            <div className="flex gap-2 mb-16">
                                {[...Array(12)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{
                                            scale: 1,
                                            opacity: 1,
                                            backgroundColor: progress > (i * (100 / 12)) ? '#000000' : '#FFFFFF'
                                        }}
                                        transition={{ delay: i * 0.05 }}
                                        className="w-6 h-6 md:w-10 md:h-10 border-4 border-black box-border"
                                    />
                                ))}
                            </div>

                            {/* Credits */}
                            <div className="text-center space-y-2">
                                <p className="text-sm font-mono text-gray-500 font-bold uppercase tracking-widest">Built by Pranav Gawai</p>
                                <p className="text-xs font-mono text-gray-400 font-bold uppercase tracking-widest">MIT-ADT CSE</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

// Scramble Text Component
const ScrambleText: React.FC<{ text: string, delay?: number }> = ({ text, delay = 40 }) => {
    const [displayedText, setDisplayedText] = useState("");
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

    useEffect(() => {
        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayedText(prev =>
                text
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, delay / 2);

        return () => clearInterval(interval);
    }, [text, delay]);

    return <span>{displayedText}</span>;
};

export default Loader;
