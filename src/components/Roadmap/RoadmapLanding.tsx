import React from 'react';
import { motion } from 'framer-motion';
import { Category } from './types';
import CategoryCard from './CategoryCard';
import { Sparkles, Map } from 'lucide-react';

interface RoadmapLandingProps {
    categories: Category[];
    onSelectCategory: (category: Category) => void;
}

const RoadmapLanding: React.FC<RoadmapLandingProps> = ({ categories, onSelectCategory }) => {
    return (
        <div className="min-h-screen bg-[#F5F5F5] font-sans text-gray-900 pb-20">

            {/* Hero Section */}
            <div className="bg-black text-white py-24 px-6 md:px-12 relative overflow-hidden">
                {/* Abstract Grid Background */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-1.5 rounded-full backdrop-blur-md mb-6"
                    >
                        <Sparkles size={14} className="text-yellow-400" />
                        <span className="text-xs font-black uppercase tracking-widest">Sankalan Pathways</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none mb-6 max-w-4xl"
                    >
                        Your Personalized <br /> Learning <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Journey.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-400 font-medium max-w-2xl leading-relaxed"
                    >
                        Choose a domain to master. We've curated the best resources, structured learning paths, and practice problems to take you from novice to expert.
                    </motion.p>
                </div>
            </div>

            {/* Categories Grid */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 -mt-16 relative z-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                        >
                            <CategoryCard category={category} onClick={onSelectCategory} />
                        </motion.div>
                    ))}
                </div>

                {/* Footer / Trust Indicators */}
                <div className="mt-20 text-center">
                    <p className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-8">Trusted by students from</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Placeholders for logos if needed, for now just text or icons */}
                        <div className="flex items-center gap-2 font-black text-xl"><Map size={24} /> 14+ Roadmaps</div>
                        <div className="flex items-center gap-2 font-black text-xl"><Sparkles size={24} /> 300+ Topics</div>
                        <div className="flex items-center gap-2 font-black text-xl">🚀 Placement Ready</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default RoadmapLanding;
