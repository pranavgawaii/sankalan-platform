import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Target, Zap, Brain, Sparkles, Cpu } from 'lucide-react';

const DashboardLoader: React.FC = () => {
    const [iconIndex, setIconIndex] = useState(0);
    const icons = [
        { Icon: BookOpen, label: "FETCHING RESOURCES" },
        { Icon: Target, label: "CALCULATING METRICS" },
        { Icon: Zap, label: "OPTIMIZING SPEED" },
        { Icon: Brain, label: "SYNCING AI MODEL" },
        { Icon: Sparkles, label: "FINALIZING UI" }
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setIconIndex((prev) => (prev + 1) % icons.length);
        }, 180); // Fast cycle for "busy" feel

        return () => clearInterval(interval);
    }, []);

    const CurrentIcon = icons[iconIndex].Icon;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center bg-white/60 backdrop-blur-sm"
        >
            {/* Main Window Container */}
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white border-4 border-black p-6 w-80 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-6 relative overflow-hidden"
            >
                {/* Decorative retro stripes background */}
                <div className="absolute top-0 left-0 w-full h-2 bg-black/10" />

                {/* Dynamic Icon Cycle */}
                <div className="relative h-20 w-20 flex items-center justify-center border-4 border-black bg-yellow-400">
                    <AnimatePresence mode="popLayout">
                        <motion.div
                            key={iconIndex}
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.5, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <CurrentIcon size={40} className="text-black" strokeWidth={3} />
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Text & Status */}
                <div className="text-center w-full">
                    <h3 className="font-black text-2xl uppercase tracking-tighter">
                        SYSTEM PROCESSING
                    </h3>
                    <p className="font-mono font-bold text-xs uppercase text-gray-500 mt-1 h-4">
                        {icons[iconIndex].label}
                    </p>
                </div>

                {/* Barber Pole Progress Bar */}
                <div className="w-full h-6 border-4 border-black relative overflow-hidden">
                    <motion.div
                        className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#000,#000_10px,#FFF_10px,#FFF_20px)]"
                        animate={{ x: [-20, 0] }}
                        transition={{ duration: 0.4, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DashboardLoader;
