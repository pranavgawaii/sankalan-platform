import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Calendar } from 'lucide-react';

interface AdminPortalProps {
    onBack: () => void;
    onSelectAcademics: () => void;
    onSelectEvents: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ onBack, onSelectAcademics, onSelectEvents }) => {
    return (
        <div
            className="min-h-screen bg-[#FAFAFA] font-['Space_Mono'] relative overflow-hidden"
            style={{
                backgroundImage: 'radial-gradient(#000 2px, transparent 2px)',
                backgroundSize: '32px 32px'
            }}
        >
            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-8 left-8 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gray-600 hover:text-black transition z-50"
            >
                <ArrowLeft size={16} /> BACK
            </button>

            {/* Main Content */}
            <div className="min-h-screen flex flex-col items-center justify-center p-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl font-black uppercase tracking-tighter mb-4">
                        ADMIN PORTAL
                    </h1>
                    <p className="text-xl text-gray-600 uppercase tracking-widest">
                        Select Your Access Level
                    </p>
                </motion.div>

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

                    {/* Academics Admin Card */}
                    <motion.button
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSelectAcademics}
                        className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all group"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-black flex items-center justify-center group-hover:bg-gray-800 transition">
                                <GraduationCap size={40} className="text-white" strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">
                                ACADEMICS ADMIN
                            </h2>
                            <p className="text-sm text-gray-600 uppercase tracking-widest">
                                Manage PYQs, Study Materials & Resources
                            </p>
                            <div className="pt-4 border-t-2 border-black w-full">
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    System Administrator →
                                </span>
                            </div>
                        </div>
                    </motion.button>

                    {/* Events Admin Card */}
                    <motion.button
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onSelectEvents}
                        className="bg-white border-[6px] border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] transition-all group"
                    >
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-20 h-20 bg-black flex items-center justify-center group-hover:bg-gray-800 transition">
                                <Calendar size={40} className="text-white" strokeWidth={3} />
                            </div>
                            <h2 className="text-3xl font-black uppercase tracking-tighter">
                                EVENTS ADMIN
                            </h2>
                            <p className="text-sm text-gray-600 uppercase tracking-widest">
                                Manage Campus Events & Club Activities
                            </p>
                            <div className="pt-4 border-t-2 border-black w-full">
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    Coordinator / Club Login →
                                </span>
                            </div>
                        </div>
                    </motion.button>

                </div>

                {/* Footer Note */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <p className="text-xs text-gray-400 uppercase tracking-widest">
                        Authorized Personnel Only
                    </p>
                </motion.div>

            </div>
        </div>
    );
};

export default AdminPortal;
