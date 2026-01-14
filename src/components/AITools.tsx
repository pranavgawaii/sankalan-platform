

import React from 'react';
import {
    Cpu,
    FileText,
    Bot,
    Sparkles,
    BrainCircuit,
    Search,
    ArrowRight,
    Zap,
    X
} from 'lucide-react';
import useSound from '../hooks/useSound';
import MockTesterView from './tool-views/MockTesterView';
import ResumeBuilderView from './tool-views/ResumeBuilderView';
import NoteSummarizerView from './tool-views/NoteSummarizerView';
import GeminiKeyModal from './ai/GeminiKeyModal';

interface Tool {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    status: 'active' | 'coming_soon';
}

const TOOLS: Tool[] = [
    {
        id: 'mock-tests',
        title: 'AI Mock Tester',
        description: 'Generate instant quizzes from any PDF or text. Test your knowledge before the real exam.',
        icon: BrainCircuit,
        status: 'active'
    },
    {
        id: 'resume',
        title: 'Resume Builder',
        description: 'ATS-friendly brutalist resume templates tailored for tech placements.',
        icon: FileText,
        status: 'active'
    },
    {
        id: 'summary',
        title: 'Note Summarizer',
        description: 'Upload 50-page PDFs and get a 1-page summary of key concepts and definitions.',
        icon: Sparkles,
        status: 'active'
    },
    {
        id: 'chatbot',
        title: 'Sankalan GPT',
        description: 'Ask questions about your syllabus, PYQs, or university regulations.',
        icon: Bot,
        status: 'coming_soon'
    },
    {
        id: 'code',
        title: 'Code Explainer',
        description: 'Paste complex algorithms and get plain English explanations.',
        icon: Cpu,
        status: 'coming_soon'
    },
    {
        id: 'search',
        title: 'Smart Search',
        description: 'Semantic search across all 4 years of engineering study materials.',
        icon: Search,
        status: 'coming_soon'
    }
];

const FeatureRequestModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
    const playClick = useSound();
    const [idea, setIdea] = React.useState({ title: '', description: '', priority: 'Medium' });

    if (!isOpen) return null;

    const handleSubmit = () => {
        playClick();
        const subject = encodeURIComponent(`Feature Request: ${idea.title} [${idea.priority}]`);
        const body = encodeURIComponent(`Priority: ${idea.priority}\n\nDescription:\n${idea.description}\n\n---\nSent from Sankalan AI Tools`);
        window.open(`mailto:features@sankalan.app?subject=${subject}&body=${body}`, "_blank");
        onClose();
        alert("Redirecting to your email client to finalize the request! 🚀");
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black w-full max-w-lg shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2"><Sparkles size={24} /> New Feature Protocol</h3>
                    <button onClick={() => { playClick(); onClose(); }}><X size={24} /></button>
                </div>
                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Feature Title</label>
                        <input
                            type="text"
                            placeholder="e.g. AI Syllabus Tracker"
                            className="w-full border-2 border-black p-3 font-bold uppercase focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            value={idea.title}
                            onChange={(e) => setIdea({ ...idea, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Priority Level</label>
                        <div className="flex gap-2">
                            {['Low', 'Medium', 'High'].map(p => (
                                <button
                                    key={p}
                                    onClick={() => { playClick(); setIdea({ ...idea, priority: p }); }}
                                    className={`flex-1 py-2 border-2 border-black font-bold uppercase text-xs transition-all ${idea.priority === p ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Description / Use Case</label>
                        <textarea
                            placeholder="Describe what you want to build..."
                            className="w-full border-2 border-black p-3 font-bold uppercase h-32 resize-none focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                            value={idea.description}
                            onChange={(e) => setIdea({ ...idea, description: e.target.value })}
                        />
                    </div>
                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-black text-white border-4 border-black font-black uppercase text-xl hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none flex items-center justify-center gap-2"
                    >
                        Initialize Request <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const AITools: React.FC = () => {
    const playClick = useSound();
    const [showKeyModal, setShowKeyModal] = React.useState(false);
    const [showFeatureModal, setShowFeatureModal] = React.useState(false);
    const [activeTool, setActiveTool] = React.useState<string | null>(null);
    const [pendingToolId, setPendingToolId] = React.useState<string | null>(null);
    const [apiKey, setApiKey] = React.useState(localStorage.getItem('GEMINI_API_KEY') || '');

    const handleToolLaunch = (toolId: string) => {
        playClick();

        if (toolId === 'resume') {
            setActiveTool(toolId);
            return;
        }

        // Always show key modal first as requested by user
        setPendingToolId(toolId);
        setShowKeyModal(true);
    };

    const handleKeySave = () => {
        // Refresh key from storage
        const newKey = localStorage.getItem('GEMINI_API_KEY') || '';
        setApiKey(newKey);

        if (pendingToolId) {
            setShowKeyModal(false);
            setActiveTool(pendingToolId);
            setPendingToolId(null);
        } else {
            setShowKeyModal(false);
        }
    };

    const renderActiveTool = () => {
        if (activeTool === 'mock-tests') return <MockTesterView onBack={() => setActiveTool(null)} apiKey={apiKey} onUpdateKey={() => setShowKeyModal(true)} />;
        if (activeTool === 'resume') return <ResumeBuilderView onBack={() => setActiveTool(null)} />;
        if (activeTool === 'summary') return <NoteSummarizerView onBack={() => setActiveTool(null)} apiKey={apiKey} onUpdateKey={() => setShowKeyModal(true)} />;
        return null;
    };

    if (activeTool) {
        return (
            <>
                {renderActiveTool()}
                <GeminiKeyModal
                    isOpen={showKeyModal}
                    onClose={() => setShowKeyModal(false)}
                    onSave={handleKeySave}
                />
            </>
        );
    }

    return (
        <div className="container mx-auto max-w-6xl">
            <div className="mb-12 text-center">
                <div className="inline-block bg-black text-white px-4 py-1 mb-4 border-2 border-black transform -rotate-2">
                    <span className="font-black uppercase tracking-widest text-xs flex items-center gap-2">
                        <Zap size={12} /> Powered by Gemini
                    </span>
                </div>
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-6">
                    AI Power Tools
                </h1>
                <p className="text-xl font-bold uppercase opacity-60 max-w-2xl mx-auto">
                    Experimental features to 10x your productivity. Use wisely.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {TOOLS.map((tool) => (
                    <div
                        key={tool.id}
                        className={`bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between group transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none ${tool.status === 'coming_soon' ? 'opacity-70' : 'hover:bg-yellow-50'}`}
                    >
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-black text-white border-2 border-black">
                                    <tool.icon size={32} strokeWidth={1.5} />
                                </div>
                                {tool.status === 'coming_soon' && (
                                    <span className="bg-gray-200 text-[10px] font-black uppercase px-2 py-1 border-2 border-black">
                                        Coming Soon
                                    </span>
                                )}
                                {tool.status === 'active' && (
                                    <span className="bg-green-400 text-[10px] font-black uppercase px-2 py-1 border-2 border-black animate-pulse">
                                        Live
                                    </span>
                                )}
                            </div>

                            <h3 className="text-2xl font-black uppercase tracking-tight mb-3 group-hover:underline decoration-4">
                                {tool.title}
                            </h3>
                            <p className="text-sm font-bold uppercase text-gray-500 mb-8 leading-relaxed">
                                {tool.description}
                            </p>
                        </div>

                        <button
                            onClick={() => handleToolLaunch(tool.id)}
                            disabled={tool.status === 'coming_soon'}
                            className="w-full py-3 border-4 border-black font-black uppercase text-sm flex items-center justify-center gap-2 group-hover:bg-black group-hover:text-white transition-colors disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-black"
                        >
                            {tool.status === 'active' ? 'Launch Tool' : 'Notify Me'}
                            {tool.status === 'active' && <ArrowRight size={16} />}
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-20 border-t-4 border-black pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-center md:text-left">
                    <h4 className="text-2xl font-black uppercase mb-2">Have a crazy idea?</h4>
                    <p className="font-bold uppercase opacity-60">We build what you need. Submit a feature request.</p>
                </div>
                <button
                    onClick={() => { playClick(); setShowFeatureModal(true); }}
                    className="retro-btn bg-white text-black px-8 py-4 text-lg font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:scale-105 hover:shadow-[12px_12px_0px_0px_rgba(255,230,0,1)] active:scale-95 transition-all flex items-center gap-2"
                >
                    <Sparkles size={20} /> Request Feature
                </button>
            </div>

            <GeminiKeyModal
                isOpen={showKeyModal}
                onClose={() => setShowKeyModal(false)}
                onSave={handleKeySave}
            />

            <FeatureRequestModal
                isOpen={showFeatureModal}
                onClose={() => setShowFeatureModal(false)}
            />
        </div>
    );
};

export default AITools;
