import React from 'react';
import { motion } from 'framer-motion';

const DashboardLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col items-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full"
                />
                <p className="mt-4 text-[10px] font-['Space_Mono'] uppercase tracking-widest text-gray-500">
                    Loading...
                </p>
            </div>
        </div>
    );
};

export default DashboardLoader;
