import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';

export interface SectionCardData {
    id: string;
    icon: React.ReactNode | string;
    title: string;
    description: string;
    meta: string;
    buttonText: string;
    route?: string;
    isComingSoon?: boolean;
}

export interface SectionHubProps {
    sectionIcon?: React.ReactNode | string;
    sectionTitle: string;
    sectionSubtitle: string;
    stats?: Array<{
        value: string;
        label: string;
    }>;
    cards: SectionCardData[];
    onNavigate: (view: string) => void;
}

const SectionHub: React.FC<SectionHubProps> = ({
    sectionIcon,
    sectionTitle,
    sectionSubtitle,
    stats,
    cards,
    onNavigate,
}) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-6 pb-12 pt-0 font-['Inter']">

            {/* SECTION 1: HERO HEADER (Compact SaaS Style) */}
            <div className="bg-white border border-gray-200 p-6 md:p-8 mb-6 shadow-sm rounded-none relative overflow-hidden">
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none grayscale">
                    <div className="text-8xl transform rotate-12">{sectionIcon}</div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 shadow-sm text-xl">
                            {sectionIcon}
                        </div>
                        <div className="h-px flex-1 bg-gray-100"></div>
                    </div>

                    <h1 className="font-['Space_Mono'] text-3xl md:text-4xl font-bold uppercase tracking-tight text-black mb-3">
                        {sectionTitle}
                    </h1>

                    <p className="font-['Inter'] text-base text-gray-500 max-w-2xl leading-relaxed mb-6">
                        {sectionSubtitle}
                    </p>

                    {stats && stats.length > 0 && (
                        <div className="flex flex-wrap gap-6 md:gap-12 border-t border-gray-100 pt-6">
                            {stats.map((stat, index) => (
                                <div key={index} className="flex flex-col">
                                    <span className="text-2xl font-bold text-black font-['Space_Mono']">{stat.value}</span>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* SECTION 2: NAVIGATION CARDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.id}
                        onClick={() => {
                            if (!card.isComingSoon && card.route) {
                                onNavigate(card.route);
                            }
                        }}
                        className={`
              relative flex flex-col justify-between
              bg-white border border-gray-200 p-6 h-full min-h-[220px]
              transition-all duration-200 group
              ${card.isComingSoon
                                ? 'opacity-60 cursor-not-allowed bg-gray-50'
                                : 'cursor-pointer hover:shadow-md hover:border-gray-300 hover:-translate-y-1'
                            }
            `}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`text-3xl p-1.5 rounded-lg ${card.isComingSoon ? 'grayscale' : 'bg-gray-50 group-hover:bg-black group-hover:text-white transition-colors'}`}>
                                    {card.icon}
                                </div>
                                {card.isComingSoon && (
                                    <span className="text-[9px] font-bold uppercase bg-gray-200 px-1.5 py-0.5 text-gray-500">Coming Soon</span>
                                )}
                                {card.meta && !card.isComingSoon && (
                                    <span className="text-[9px] font-bold uppercase bg-green-50 text-green-700 px-1.5 py-0.5 border border-green-100">{card.meta}</span>
                                )}
                            </div>

                            <h3 className="font-['Space_Mono'] text-lg font-bold uppercase text-black mb-1 leading-tight group-hover:underline decoration-2 underline-offset-4">
                                {card.title}
                            </h3>

                            <p className="font-['Inter'] text-xs text-gray-500 leading-relaxed mb-4">
                                {card.description}
                            </p>
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between">
                            <span className={`text-[10px] font-bold uppercase ${card.isComingSoon ? 'text-gray-400' : 'text-black group-hover:text-blue-600 transition-colors'}`}>
                                {card.buttonText}
                            </span>
                            {!card.isComingSoon && (
                                <ArrowRight size={14} className="text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionHub;
