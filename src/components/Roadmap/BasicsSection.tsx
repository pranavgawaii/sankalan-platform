import React from 'react';
import { Roadmap } from './types';
import { motion } from 'framer-motion';
import { ChevronRight, Zap } from 'lucide-react';

interface BasicsSectionProps {
    roadmaps: Roadmap[];
    onSelectRoadmap: (roadmap: Roadmap) => void;
}

const BasicsSection: React.FC<BasicsSectionProps> = ({ roadmaps, onSelectRoadmap }) => {
    if (!roadmaps || roadmaps.length === 0) return null;

    return (
        <section className="py-20 px-6 md:px-12 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900 mb-2">
                            Start with Basics
                        </h2>
                        <p className="text-gray-500 font-medium text-lg">
                            Master the syntax before diving into Algorithms.
                        </p>
                    </div>
                    <div className="hidden md:block h-px flex-1 bg-gray-100 mx-8 mb-4"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {roadmaps.map((roadmap, index) => (
                        <motion.div
                            key={roadmap.id}
                            whileHover={{ y: -5 }}
                            onClick={() => onSelectRoadmap(roadmap)}
                            className="bg-gray-50 rounded-2xl p-6 cursor-pointer group hover:bg-gray-900 hover:text-white transition-colors duration-300 border border-gray-100 hover:border-gray-900"
                        >
                            <div className="flex justify-between items-start mb-8">
                                <div className="text-4xl grayscale group-hover:grayscale-0 transition-all">{roadmap.icon}</div>
                                <ChevronRight className="text-gray-300 group-hover:text-white transition-colors" />
                            </div>

                            <h3 className="text-xl font-black uppercase tracking-tight mb-2 group-hover:text-white">
                                {roadmap.title}
                            </h3>

                            <p className="text-sm font-medium text-gray-500 group-hover:text-gray-400 mb-6">
                                {roadmap.duration} • {roadmap.difficulty}
                            </p>

                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 group-hover:text-blue-300">
                                <Zap size={14} fill="currentColor" /> Start Learning
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BasicsSection;
