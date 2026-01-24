import React from 'react';
import { motion } from 'framer-motion';
import { Category } from './types';
import { ChevronRight } from 'lucide-react';

interface CategoryCardProps {
    category: Category;
    onClick: (category: Category) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
    return (
        <motion.div
            onClick={() => onClick(category)}
            whileHover={{ y: -8, scale: 1.02 }}
            className="relative overflow-hidden rounded-3xl p-8 cursor-pointer group shadow-xl h-full flex flex-col justify-between"
            style={{
                background: `linear-gradient(135deg, ${category.colorFrom} 0%, ${category.colorTo} 100%)`
            }}
        >
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full blur-3xl -mr-16 -mt-16 transform transition-transform group-hover:scale-150 duration-700 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-black opacity-10 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-white">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-4xl mb-6 shadow-inner border border-white/20">
                    {category.icon}
                </div>

                <h3 className="text-3xl font-black uppercase tracking-tight mb-3">
                    {category.title}
                </h3>

                <p className="text-white/80 font-medium text-lg leading-relaxed mb-8">
                    {category.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs font-bold uppercase tracking-widest bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-sm">
                        {category.roadmaps.length} Pathways
                    </span>

                    <div className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center transform transition-transform group-hover:translate-x-2 shadow-lg">
                        <ChevronRight size={20} strokeWidth={3} />
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryCard;
