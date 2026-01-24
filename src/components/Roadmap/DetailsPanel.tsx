import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Topic } from './types';
import {
    Clock,
    BookOpen,
    FileText,
    PlayCircle,
    ExternalLink,
    X,
    Target,
    AlertCircle
} from 'lucide-react';

interface DetailsPanelProps {
    topic: Topic | null;
    onClose: () => void;
}

const DetailsPanel: React.FC<DetailsPanelProps> = ({ topic, onClose }) => {
    return (
        <AnimatePresence>
            {topic && (
                <motion.div
                    initial={{ x: 400, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 400, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="roadmap-right-panel h-full flex flex-col"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-start sticky top-0 bg-white z-10">
                        <div>
                            <div
                                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-3"
                                style={{
                                    backgroundColor: `${topic.color || '#3B82F6'}15`,
                                    color: topic.color || '#3B82F6'
                                }}
                            >
                                <div className="w-1.5 h-1.5 rounded-full bg-current" />
                                {topic.difficulty}
                            </div>
                            <h2 className="text-2xl font-black uppercase tracking-tight leading-none text-gray-900">
                                {topic.title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    {/* Scrollable Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-8">

                        {/* Meta Info */}
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <Clock size={16} />
                                <span className="font-bold">{topic.estimatedHours} Hours</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <AlertCircle size={16} />
                                <span className="font-bold">{topic.keyPoints.length} Key Concepts</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Overview</h3>
                            <p className="text-gray-700 leading-relaxed font-medium">
                                {topic.description}
                            </p>
                        </div>

                        {/* Key Points */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                <Target size={14} /> Key Concepts
                            </h3>
                            <ul className="space-y-2">
                                {topic.keyPoints.map((point, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm font-medium text-gray-700">
                                        <span className="w-1.5 h-1.5 rounded-full bg-black mt-2 flex-shrink-0" />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Resources Section - Split into Tabs visually */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">

                            {/* Notes */}
                            {topic.relatedNotes && topic.relatedNotes.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                        <BookOpen size={14} /> Study Notes
                                    </h3>
                                    <div className="grid gap-2">
                                        {topic.relatedNotes.map((note, idx) => (
                                            <button key={idx} className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors text-left group">
                                                <FileText size={16} className="text-gray-400 group-hover:text-black transition-colors" />
                                                <span className="text-sm font-bold text-gray-700 group-hover:text-black">{note}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* PYQs */}
                            {topic.relatedPYQs && topic.relatedPYQs.length > 0 && (
                                <div className="mt-6">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                        <FileText size={14} /> Practice Questions
                                    </h3>
                                    <div className="grid gap-2">
                                        {topic.relatedPYQs.map((pyq, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                                                <span className="text-sm font-bold text-gray-700">{pyq}</span>
                                                <span className="text-[10px] font-black bg-black text-white px-2 py-0.5 uppercase tracking-widest">Solve</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* External Resources */}
                        {topic.resources && topic.resources.length > 0 && (
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3 flex items-center gap-2">
                                    <ExternalLink size={14} /> Recommended
                                </h3>
                                <div className="space-y-3">
                                    {topic.resources.map((res, idx) => (
                                        <a
                                            key={idx}
                                            href={res.url || '#'}
                                            className="flex items-center gap-3 group hover:opacity-70 transition-opacity"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 group-hover:bg-black group-hover:text-white transition-colors">
                                                {res.type === 'video' ? <PlayCircle size={16} /> : <ExternalLink size={16} />}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-gray-900 group-hover:underline">{res.title}</p>
                                                <p className="text-[10px] uppercase font-bold text-gray-400">{res.type} • {res.duration}</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default DetailsPanel;
