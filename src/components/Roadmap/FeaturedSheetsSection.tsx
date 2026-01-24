import React from 'react';
import { FeaturedSheet } from './types';
import FeaturedSheetCard from './FeaturedSheetCard';
import { Flame } from 'lucide-react';

interface FeaturedSheetsSectionProps {
    sheets: FeaturedSheet[];
}

const FeaturedSheetsSection: React.FC<FeaturedSheetsSectionProps> = ({ sheets }) => {
    if (!sheets || sheets.length === 0) return null;

    return (
        <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-orange-50 to-amber-50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-orange-300 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-300 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-1.5 rounded-full text-orange-600 border border-orange-200 mb-6">
                        <Flame size={16} fill="currentColor" />
                        <span className="text-xs font-black uppercase tracking-widest">Recommended by Experts</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-gray-900 mb-4">
                        Placement <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Powerhouses</span>
                    </h2>

                    <p className="text-lg md:text-xl font-medium text-gray-500 max-w-2xl mx-auto">
                        The most trusted resources for cracking top product companies.
                        Curated by Striver (Raj Vikramaditya).
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {sheets.map((sheet) => (
                        <FeaturedSheetCard key={sheet.id} sheet={sheet} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturedSheetsSection;
