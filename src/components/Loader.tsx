import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress === 100) {
                    clearInterval(timer);
                    setTimeout(onComplete, 800); // Wait a bit before unmounting
                    return 100;
                }
                const diff = Math.random() * 10;
                return Math.min(oldProgress + diff, 100);
            });
        }, 150);

        return () => {
            clearInterval(timer);
        };
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white"
        >
            <div className="flex flex-col items-center w-full max-w-sm px-8">
                {/* Logo Mark */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8 relative"
                >
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 17L12 22L22 17" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M2 12L12 17L22 12" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </motion.div>

                {/* Text Branding */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold font-['Space_Mono'] tracking-tighter text-black mb-2">
                        SANKALAN
                    </h1>
                    <p className="text-xs font-['Inter'] text-gray-400 uppercase tracking-[0.2em] font-medium">
                        Initializing Workspace
                    </p>
                </div>

                {/* Minimal Progress Bar */}
                <div className="w-full h-[2px] bg-gray-100 rounded-full overflow-hidden mb-4 relative">
                    <motion.div
                        className="h-full bg-black"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ ease: "linear" }}
                    />
                </div>

                {/* Percentage */}
                <div className="w-full flex justify-between text-[10px] font-['Space_Mono'] text-gray-400">
                    <span>v2.5.0</span>
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>

            {/* Footer Credit */}
            <div className="absolute bottom-10 text-[10px] text-gray-300 font-['Inter'] font-medium uppercase tracking-widest">
                Built by Pranav Gawai
            </div>
        </motion.div>
    );
};

export default Loader;
