import React from 'react';
import { motion } from 'framer-motion';
import { Roadmap, Topic } from './types';
import { ChevronRight, ArrowDown } from 'lucide-react';

interface RoadmapPanelProps {
    roadmap: Roadmap;
    selectedTopic: Topic | null;
    onSelectTopic: (topic: Topic) => void;
}

const RoadmapPanel: React.FC<RoadmapPanelProps> = ({ roadmap, selectedTopic, onSelectTopic }) => {
    return (
        <div className="roadmap-left-panel relative custom-scrollbar">
            {/* Roadmap Content */}
            <div className="max-w-3xl mx-auto py-12 relative">

                {/* Central Vertical Line (Timeline style) */}
                <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 hidden md:block" />

                {/* Striver's Banner for DSA Roadmaps */}
                {roadmap.title.includes('DSA') && (
                    <div className="mb-12 relative z-20 mx-auto max-w-2xl text-center">
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 shadow-sm inline-block">
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <span className="text-2xl">💡</span>
                                <div className="text-left">
                                    <h4 className="font-bold text-gray-900">Pro Tip</h4>
                                    <p className="text-sm text-gray-600">Practice problems from <span className="font-bold text-blue-600">Striver's A2Z Sheet</span> alongside this roadmap for best results!</p>
                                </div>
                                <a
                                    href="https://takeuforward.org/strivers-a2z-dsa-course-sheet-2"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-colors whitespace-nowrap"
                                >
                                    View Sheet
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-16 relative z-10">
                    {roadmap.phases.map((phase, phaseIndex) => (
                        <div key={phase.phaseId} className="relative">

                            {/* Phase Marker */}
                            <div className="flex flex-col items-center mb-8 sticky top-0 z-20 md:bg-[#F9FAFB] py-4">
                                <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest shadow-lg border-4 border-[#F9FAFB]">
                                    PHASE {phaseIndex + 1}: {phase.phaseName}
                                </div>
                            </div>

                            {/* Topics Grid */}
                            <div className="space-y-6">
                                {phase.topics.map((topic, topicIndex) => {
                                    const isSelected = selectedTopic?.topicId === topic.topicId;
                                    // Alternate left/right alignment for desktop
                                    const isLeft = topicIndex % 2 === 0;

                                    return (
                                        <motion.div
                                            key={topic.topicId}
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: topicIndex * 0.1 }}
                                            className={`md:flex items-center justify-between w-full group ${!isLeft ? 'md:flex-row-reverse' : ''}`}
                                        >
                                            {/* Desktop Spacer (Half Width) */}
                                            <div className="hidden md:block w-5/12" />

                                            {/* Connector Dot (Desktop) */}
                                            <div className="hidden md:flex items-center justify-center w-2/12 absolute left-1/2 -translate-x-1/2">
                                                <div className={`w-4 h-4 rounded-full border-4 border-[#F9FAFB] transition-colors ${isSelected ? 'bg-black scale-125' : 'bg-gray-300 group-hover:bg-gray-400'}`} />
                                            </div>

                                            {/* Card Content - Occupies 5/12 width on desktop */}
                                            <div className="md:w-5/12 w-full pl-12 md:pl-0">
                                                {/* Mobile Connector Line */}
                                                <div className="absolute left-8 top-0 bottom-0 w-1 bg-gray-200 -translate-x-1/2 md:hidden" />
                                                <div className={`absolute left-8 w-4 h-4 rounded-full border-4 border-[#F9FAFB] -translate-x-1/2 mt-6 md:hidden ${isSelected ? 'bg-black' : 'bg-gray-300'}`} />

                                                <motion.div
                                                    onClick={() => onSelectTopic(topic)}
                                                    whileHover={{ scale: 1.02 }}
                                                    className={`bg-white p-5 rounded-lg border-b-4 cursor-pointer transition-all shadow-sm hover:shadow-md relative
                               ${isSelected
                                                            ? 'border-black ring-2 ring-black ring-offset-2'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }
                             `}
                                                >
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span
                                                            className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded"
                                                            style={{ backgroundColor: `${topic.color}20`, color: topic.color }}
                                                        >
                                                            {topic.difficulty}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase">{topic.estimatedHours}h</span>
                                                    </div>
                                                    <h4 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-1">
                                                        {topic.title}
                                                    </h4>
                                                    <p className="text-xs font-medium text-gray-500 line-clamp-2">
                                                        {topic.description}
                                                    </p>
                                                </motion.div>
                                            </div>

                                        </motion.div>
                                    );
                                })}
                            </div>

                        </div>
                    ))}
                </div>

                {/* End Marker */}
                <div className="flex justify-center mt-12 relative z-10">
                    <div className="bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg border-4 border-[#F9FAFB]">
                        <FlagIcon size={20} />
                    </div>
                </div>

            </div>
        </div>
    );
};

const FlagIcon = ({ size }: { size: number }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
        <line x1="4" y1="22" x2="4" y2="15" />
    </svg>
);

export default RoadmapPanel;
