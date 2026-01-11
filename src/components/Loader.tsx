import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const [isReady, setIsReady] = useState(false);

    const loadingTexts = [
        "LOADING YOUR CHAOS",
        "ORGANIZING PYQs",
        "POWERING AI TOOLS",
        "PREPPING MOCK TESTS",
        "BUILDING STUDY ROOMS",
        "ALMOST THERE"
    ];

    const letters = "SANKALAN".split("");

    useEffect(() => {
        // Text rotation logic
        const textInterval = setInterval(() => {
            setTextIndex(prev => (prev + 1) % loadingTexts.length);
        }, 800);

        // Progress bar logic
        const duration = 2500; // 2.5 seconds minimum load
        const interval = 20;
        const steps = duration / interval;
        const increment = 100 / steps;

        const progressTimer = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressTimer);
                    setIsReady(true);
                    return 100;
                }
                return Math.min(prev + increment, 100);
            });
        }, interval);

        return () => {
            clearInterval(textInterval);
            clearInterval(progressTimer);
        };
    }, []);

    useEffect(() => {
        if (isReady) {
            const timer = setTimeout(() => {
                onComplete();
            }, 1000); // Wait 1s after ready before unmounting/exiting
            return () => clearTimeout(timer);
        }
    }, [isReady, onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden pointer-events-none"
        >
            {/* Split Screen Backgrounds */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1/2 bg-white border-b-2 border-black z-0"
                initial={{ y: 0 }}
                animate={isReady ? { y: "-100%" } : { y: 0 }}
                transition={{ duration: 0.8, ease: [0.6, 0.0, 0.2, 1], delay: 0.2 }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1/2 bg-white border-t-2 border-black z-0"
                initial={{ y: 0 }}
                animate={isReady ? { y: "100%" } : { y: 0 }}
                transition={{ duration: 0.8, ease: [0.6, 0.0, 0.2, 1], delay: 0.2 }}
            />

            {/* Floating Shapes - Inside Backgrounds? No, keep separate or duplicate?
          To keep it simple, let's put them inside the background divs or just fade them out
      */}

            <motion.div
                className="relative z-10 flex flex-col items-center w-full max-w-lg px-4"
                animate={isReady ? { opacity: 0, scale: 0.9 } : { opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
            >
                {/* Stacking Blocks Logo Animation */}
                <div className="flex gap-1 md:gap-2 mb-12 h-20 items-end justify-center">
                    {letters.map((char, i) => (
                        <motion.div
                            key={i}
                            custom={i}
                            initial={{ y: -400, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{
                                type: "spring",
                                damping: 12,
                                stiffness: 200,
                                delay: i * 0.1
                            }}
                            className="w-8 md:w-12 aspect-square bg-black flex items-center justify-center"
                        >
                            <span className="text-white font-black text-xl md:text-3xl font-mono">{char}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Brand Name Box */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="border-4 border-black px-8 py-4 bg-white mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight font-mono">SANKALAN</h1>
                </motion.div>

                {/* Rotating Status Text */}
                <div className="h-8 mb-8 overflow-hidden relative w-full text-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={textIndex}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-sm md:text-base font-bold font-mono uppercase tracking-widest absolute w-full left-0 font-mono"
                        >
                            {isReady ? "READY!" : loadingTexts[textIndex]}
                        </motion.p>
                    </AnimatePresence>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-12 border-4 border-black p-1 relative bg-white">
                    <motion.div
                        className="h-full bg-black"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear", duration: 0.1 }}
                    />
                </div>
                <div className="w-full text-right mt-2 font-mono font-bold text-lg">
                    {Math.round(progress)}%
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Loader;
