import React from 'react';
import { motion } from 'framer-motion';
import { Category, Roadmap } from './types';
import { ChevronRight, ArrowLeft, Clock, BarChart, BookOpen, Lock, Play } from 'lucide-react';
import FeaturedSheetsSection from './FeaturedSheetsSection';
import BasicsSection from './BasicsSection';

interface CategoryPageProps {
    category: Category;
    onBack: () => void;
    onSelectRoadmap: (roadmap: Roadmap) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onBack, onSelectRoadmap }) => {
    const isDSA = category.id === 'dsa';
    const basicsRoadmaps = isDSA ? category.roadmaps.filter(r => r.difficulty === 'Beginner' && r.title.includes('Basics')) : [];
    const mainRoadmaps = isDSA ? category.roadmaps.filter(r => !r.title.includes('Basics')) : category.roadmaps;

    return (
        <div className="min-h-screen bg-[#F5F5F5] pb-20">

            {/* Header */}
            <div
                className="text-white py-16 px-6 md:px-12 relative"
                style={{ background: `linear-gradient(135deg, ${category.colorFrom} 0%, ${category.colorTo} 100%)` }}
            >
                <div className="max-w-7xl mx-auto z-10 relative">
                    {/* Breadcrumb */}
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-white/70 hover:text-white mb-6 text-xs font-black uppercase tracking-widest transition-colors"
                    >
                        <ArrowLeft size={14} /> Back to Pathways
                    </button>

                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-6">
                            <div className="text-6xl bg-white/20 p-4 rounded-2xl shadow-inner backdrop-blur-sm">
                                {category.icon}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight leading-none mb-2">
                                    {category.title}
                                </h1>
                                <p className="text-lg text-white/80 font-medium max-w-xl">
                                    {category.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* DSA Specialized Sections */}
            {isDSA && category.featuredSheets && (
                <FeaturedSheetsSection sheets={category.featuredSheets} />
            )}

            {isDSA && basicsRoadmaps.length > 0 && (
                <BasicsSection roadmaps={basicsRoadmaps} onSelectRoadmap={onSelectRoadmap} />
            )}

            {/* Roadmaps Grid */}
            <div className={`max-w-7xl mx-auto px-6 md:px-12 relative z-20 ${isDSA ? 'mt-12' : '-mt-10'}`}>
                {isDSA && (
                    <div className="flex items-end justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-black uppercase tracking-tight text-gray-900">Complete Roadmaps</h2>
                            <p className="text-gray-500 font-medium">End-to-end paths to mastery.</p>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mainRoadmaps.map((roadmap, index) => (
                        <motion.div
                            key={roadmap.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onSelectRoadmap(roadmap)}
                            className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl cursor-pointer transition-all duration-300 group border border-gray-100 hover:-translate-y-1 relative overflow-hidden"
                        >
                            {/* Progress Bar (Mock) */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100">
                                <div className="h-full bg-green-500 w-[0%]" /> {/* Dynamic width later */}
                            </div>

                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:bg-black group-hover:text-white transition-colors duration-300">
                                    {roadmap.icon}
                                </div>
                                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded bg-gray-100 text-gray-600`}>
                                    {roadmap.difficulty}
                                </span>
                            </div>

                            <h3 className="text-xl font-black uppercase tracking-tight text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
                                {roadmap.title}
                            </h3>

                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 mb-6 uppercase tracking-wider">
                                <span className="flex items-center gap-1"><Clock size={12} /> {roadmap.duration}</span>
                                <span className="flex items-center gap-1"><BookOpen size={12} /> {roadmap.topicCount || 0} Topics</span>
                            </div>

                            <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-2">
                                {roadmap.description}
                            </p>

                            <button className="w-full py-3 bg-gray-50 text-gray-900 font-black uppercase tracking-widest text-xs rounded-lg group-hover:bg-black group-hover:text-white transition-all flex items-center justify-center gap-2">
                                Start Path <ChevronRight size={14} />
                            </button>

                        </motion.div>
                    ))}

                    {/* Coming Soon Card */}
                    {!isDSA && (
                        <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-60">
                            <Lock size={32} className="text-gray-300 mb-4" />
                            <h3 className="text-lg font-black uppercase tracking-tight text-gray-400">More Coming Soon</h3>
                            <p className="text-xs font-medium text-gray-400 mt-2">New roadmaps added monthly</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

export default CategoryPage;
