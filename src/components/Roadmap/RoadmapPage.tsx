import React, { useState, useRef, useEffect } from 'react';
import html2pdf from 'html2pdf.js';
import { ArrowLeft, Download, ChevronLeft } from 'lucide-react';

import RoadmapLanding from './RoadmapLanding';
import CategoryPage from './CategoryPage';
import RoadmapPanel from './RoadmapPanel';
import DetailsPanel from './DetailsPanel';

import roadmapData from '../../data/roadmaps.json';
import { Roadmap, Topic, Category } from './types';
import './RoadmapPage.css';

// Type assertion for the imported JSON data
const typedData = roadmapData as { categories: Category[] };

const RoadmapPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
    const [currentView, setCurrentView] = useState<'landing' | 'category' | 'visualization'>('landing');
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
    const roadmapRef = useRef<HTMLDivElement>(null);

    // --- Handlers ---

    const handleSelectCategory = (category: Category) => {
        setSelectedCategory(category);
        setCurrentView('category');
        window.scrollTo(0, 0);
    };

    const handleSelectRoadmap = (roadmap: Roadmap) => {
        setSelectedRoadmap(roadmap);
        setCurrentView('visualization');
        window.scrollTo(0, 0);
    };

    const handleBackToLanding = () => {
        setSelectedCategory(null);
        setCurrentView('landing');
    };

    const handleBackToCategory = () => {
        setSelectedRoadmap(null);
        setCurrentView('category');
    };

    const handleDownloadPDF = () => {
        if (!selectedRoadmap || !roadmapRef.current) return;

        const element = roadmapRef.current;
        const opt = {
            margin: 10,
            filename: `Sankalan_${selectedRoadmap.id}.pdf`,
            image: { type: 'jpeg' as const, quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
        };

        html2pdf().set(opt).from(element).save();
    };

    // --- Views ---

    if (currentView === 'landing') {
        return (
            <div className="relative">
                {/* Optional: Add a back button to Dashboard here if needed, or rely on AppNav */}
                <RoadmapLanding
                    categories={typedData.categories}
                    onSelectCategory={handleSelectCategory}
                />
            </div>
        );
    }

    if (currentView === 'category' && selectedCategory) {
        return (
            <CategoryPage
                category={selectedCategory}
                onBack={handleBackToLanding}
                onSelectRoadmap={handleSelectRoadmap}
            />
        );
    }

    if (currentView === 'visualization' && selectedRoadmap) {
        return (
            <div className="roadmap-container bg-white flex flex-col h-screen overflow-hidden">
                {/* Top Bar */}
                <div className="bg-white border-b border-gray-200 h-16 md:h-20 px-4 md:px-6 flex items-center justify-between shadow-sm z-30 shrink-0">
                    <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
                        <button
                            onClick={handleBackToCategory}
                            className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2 text-[10px] md:text-sm font-bold uppercase text-gray-600 whitespace-nowrap"
                        >
                            <ChevronLeft size={16} /> <span className="hidden md:inline">Back</span>
                        </button>
                        <div className="h-6 w-px bg-gray-200 mx-1 md:mx-2 shrink-0"></div>
                        <div className="min-w-0">
                            <h2 className="text-base md:text-xl font-black uppercase tracking-tight text-gray-900 leading-none truncate">
                                {selectedRoadmap.title}
                            </h2>
                            <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 truncate">
                                {selectedRoadmap.phases.length} Phases • {selectedRoadmap.difficulty}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleDownloadPDF}
                        className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-gray-900 text-white rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors whitespace-nowrap"
                    >
                        <Download size={14} /> <span className="hidden md:inline">Download</span>
                    </button>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex overflow-hidden relative" ref={roadmapRef}>
                    <RoadmapPanel
                        roadmap={selectedRoadmap}
                        selectedTopic={selectedTopic}
                        onSelectTopic={setSelectedTopic}
                    />

                    <DetailsPanel
                        topic={selectedTopic}
                        onClose={() => setSelectedTopic(null)}
                    />
                </div>
            </div>
        );
    }

    return null; // Fallback
};

export default RoadmapPage;
