import React from 'react';
import { motion } from 'framer-motion';
import { FeaturedSheet } from './types';
import { ExternalLink, Play, Award, CheckCircle, Users, BarChart } from 'lucide-react';

interface FeaturedSheetCardProps {
    sheet: FeaturedSheet;
}

const FeaturedSheetCard: React.FC<FeaturedSheetCardProps> = ({ sheet }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8, boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)' }}
            className="relative bg-white rounded-2xl md:rounded-3xl border-2 border-transparent p-6 md:p-8 flex flex-col h-full overflow-hidden group transition-all duration-300"
            style={{
                backgroundOrigin: 'border-box',
                backgroundClip: 'padding-box, border-box',
                backgroundImage: `linear-gradient(#fff, #fff), linear-gradient(135deg, ${sheet.highlightColor}, #a855f7)`
            }}
        >
            {/* Top Badge */}
            <div
                className="absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[10px] md:text-xs font-black uppercase tracking-widest text-white shadow-md"
                style={{ background: sheet.highlightColor }}
            >
                {sheet.badge}
            </div>

            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center gap-3 md:gap-4 mb-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner bg-gray-50">
                        {sheet.icon}
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">{sheet.tags[0]}</p>
                        <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight text-gray-900 leading-none">
                            {sheet.title}
                        </h3>
                    </div>
                </div>
                <p className="text-sm md:text-base font-medium text-gray-600 leading-relaxed">
                    {sheet.description}
                </p>
            </div>

            {/* Features List */}
            <ul className="space-y-3 mb-8 flex-1">
                {sheet.features.slice(0, 4).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                        <CheckCircle size={18} className="text-green-500 shrink-0 mt-0.5" />
                        {feature}
                    </li>
                ))}
            </ul>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 mb-8">
                <div className="text-center">
                    <p className="text-2xl font-black text-gray-900">{sheet.stats.problemCount}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Problems</p>
                </div>
                <div className="text-center border-l border-gray-200">
                    <p className="text-2xl font-black text-gray-900">{sheet.stats.placementRate || sheet.stats.companies}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{sheet.stats.placementRate ? 'Success Rate' : 'Companies'}</p>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
                <a
                    href={sheet.introVideoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 md:py-4 rounded-xl border-2 border-gray-100 font-bold uppercase tracking-widest text-[10px] md:text-xs hover:border-black transition-colors"
                >
                    <Play size={16} /> Intro
                </a>
                <a
                    href={sheet.externalLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-3 md:py-4 rounded-xl text-white font-black uppercase tracking-widest text-[10px] md:text-xs hover:opacity-90 transition-opacity shadow-lg"
                    style={{ background: sheet.highlightColor }}
                >
                    Access Sheet <ExternalLink size={16} />
                </a>
            </div>

        </motion.div>
    );
};

export default FeaturedSheetCard;
