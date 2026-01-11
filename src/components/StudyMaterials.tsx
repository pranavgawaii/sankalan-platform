
import React, { useState } from 'react';
import {
    FileText,
    Video,
    File,
    Download,
    Eye,
    Sparkles,
    ChevronDown,
    Upload,
    X,
    Plus,
    BookOpen,
    Search
} from 'lucide-react';
import useSound from '../hooks/useSound';

// --- Types ---
type MaterialType = 'pdf' | 'pptx' | 'video' | 'doc';

interface StudyMaterial {
    id: string;
    title: string;
    type: MaterialType;
    size: string;
    views: number;
    url: string;
    unit: number;
    author: string;
}

interface AISummaryResult {
    keyTopics: string[];
}

interface UserProfile {
    name: string;
    email?: string;
    branch: string;
    year: string;
    semester: string;
    role: 'student' | 'admin';
}

// --- Mock Data ---
const SUBJECTS = ['DBMS', 'CN', 'OS', 'ML', 'CD', 'TOC'];

const MOCK_MATERIALS: StudyMaterial[] = [
    { id: '1', title: 'Unit 1 Notes by Dr. Sharma', type: 'pdf', size: '2.5 MB', views: 250, url: '#', unit: 1, author: 'Dr. Sharma' },
    { id: '2', title: 'Unit 1 PPT Slides', type: 'pptx', size: '5.8 MB', views: 180, url: '#', unit: 1, author: 'Prof. Anjali' },
    { id: '3', title: 'Video Lecture - DBMS Basics', type: 'video', size: '45 min', views: 120, url: '#', unit: 1, author: 'Sankalan Team' },
    { id: '4', title: 'ER Model Deep Dive', type: 'pdf', size: '3.1 MB', views: 150, url: '#', unit: 2, author: 'Dr. Sharma' },
    { id: '5', title: 'Relational Model Concepts', type: 'pptx', size: '4.2 MB', views: 130, url: '#', unit: 2, author: 'Prof. Anjali' },
    { id: '6', title: 'Normalization Forms (1NF-3NF)', type: 'pdf', size: '1.8 MB', views: 300, url: '#', unit: 3, author: 'Sankalan Team' },
    { id: '7', title: 'BCNF & 4NF Explained', type: 'video', size: '25 min', views: 90, url: '#', unit: 3, author: 'Sankalan Team' },
    { id: '8', title: 'SQL Queries - JOINs', type: 'pdf', size: '1.5 MB', views: 210, url: '#', unit: 4, author: 'Dr. Sharma' },
    { id: '9', title: 'Transaction Management', type: 'pptx', size: '6.0 MB', views: 110, url: '#', unit: 4, author: 'Prof. Anjali' },
    { id: '10', title: 'B+ Trees and Indexing', type: 'pdf', size: '3.5 MB', views: 195, url: '#', unit: 5, author: 'Sankalan Team' },
];

// --- Sub-Components ---
const MaterialIcon: React.FC<{ type: MaterialType }> = ({ type }) => {
    switch (type) {
        case 'pdf': return <FileText size={20} className="text-red-600" />;
        case 'pptx': return <File size={20} className="text-orange-600" />;
        case 'video': return <Video size={20} className="text-blue-600" />;
        case 'doc': return <FileText size={20} className="text-blue-800" />;
        default: return <File size={20} />;
    }
};

const MaterialCard: React.FC<{ material: StudyMaterial; onSummarize: (m: StudyMaterial) => void }> = ({ material, onSummarize }) => {
    const playClick = useSound();
    return (
        <div className="border-4 border-black bg-white p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
            <div className="flex gap-4 items-start">
                <div className="p-3 border-2 border-black bg-gray-50">
                    <MaterialIcon type={material.type} />
                </div>
                <div>
                    <h4 className="text-lg font-black uppercase leading-tight mb-1">{material.title}</h4>
                    <p className="text-xs font-bold uppercase text-gray-500">
                        {material.type.toUpperCase()} • {material.size} • {material.views} views • By {material.author}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
                <button
                    onClick={playClick}
                    className="flex-1 sm:flex-none px-3 py-2 border-2 border-black text-xs font-black uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1">
                    <Eye size={14} /> View
                </button>
                <button
                    onClick={playClick}
                    className="flex-1 sm:flex-none px-3 py-2 border-2 border-black text-xs font-black uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1">
                    <Download size={14} /> DL
                </button>
                <button
                    onClick={() => { playClick(); onSummarize(material); }}
                    className="flex-1 sm:flex-none px-3 py-2 border-2 border-black bg-purple-50 text-xs font-black uppercase hover:bg-purple-100 transition-colors flex items-center justify-center gap-1 text-purple-900 border-purple-900"
                >
                    <Sparkles size={14} /> AI Summarize
                </button>
            </div>
        </div>
    );
};

const UploadModal: React.FC<{ isOpen: boolean; onClose: () => void; subject: string }> = ({ isOpen, onClose, subject }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black w-full max-w-lg shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2"><Upload size={20} /> Upload Material</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase mb-1 block">Subject</label>
                            <div className="border-2 border-black p-2 font-bold bg-gray-100">{subject}</div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase mb-1 block">Unit</label>
                            <select className="w-full border-2 border-black p-2 font-bold uppercase cursor-pointer">
                                {[1, 2, 3, 4, 5].map(u => <option key={u} value={u}>Unit {u}</option>)}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Type</label>
                        <div className="flex gap-2">
                            {['Notes', 'Slides', 'Video'].map(t => (
                                <label key={t} className="flex-1 border-2 border-black p-2 flex items-center justify-center gap-2 cursor-pointer has-[:checked]:bg-black has-[:checked]:text-white transition-colors">
                                    <input type="radio" name="type" className="hidden" />
                                    <span className="text-xs font-black uppercase">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="border-4 border-dashed border-gray-300 hover:border-black p-8 text-center cursor-pointer transition-colors group bg-gray-50">
                        <Upload size={32} className="mx-auto mb-2 text-gray-400 group-hover:text-black transition-colors" />
                        <p className="font-black uppercase text-xs">Drag PDF/PPT Here</p>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Title</label>
                        <input type="text" placeholder="e.g., Unit 1 Deep Dive" className="w-full border-2 border-black p-2 font-bold uppercase" />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button onClick={onClose} className="flex-1 py-3 border-2 border-black font-black uppercase hover:bg-gray-100">Cancel</button>
                        <button className="flex-1 py-3 bg-black text-white border-2 border-black font-black uppercase hover:bg-gray-800">Upload →</button>
                    </div>

                    <p className="text-[10px] text-center font-bold uppercase text-gray-500">Admin will review before publishing</p>
                </div>
            </div>
        </div>
    );
};

const AISummaryModal: React.FC<{ material: StudyMaterial | null; onClose: () => void }> = ({ material, onClose }) => {
    if (!material) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black w-full max-w-2xl shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)] max-h-[90vh] flex flex-col">
                <div className="bg-purple-900 text-white p-4 flex justify-between items-center border-b-4 border-black shrink-0">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2"><Sparkles size={20} /> AI Summary</h3>
                    <button onClick={onClose}><X size={24} /></button>
                </div>

                <div className="p-8 overflow-y-auto">
                    <div className="mb-6">
                        <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-1">SOURCE</span>
                        <h2 className="text-2xl font-black uppercase mt-2">{material.title}</h2>
                    </div>

                    <div className="prose prose-sm max-w-none font-mono">
                        <p className="mb-6 font-bold leading-relaxed">
                            This unit covers the fundamental concepts of {material.title.split(' ')[0]}. It introduces the architecture, data models, and the importance of data independence. Key emphasis is placed on the Entity-Relationship (ER) model and its conversion to relational schemas.
                        </p>

                        <div className="bg-gray-50 border-l-4 border-black p-4 mb-6">
                            <h4 className="font-black uppercase mb-3 flex items-center gap-2"><BookOpen size={16} /> Key Topics Extracted</h4>
                            <ul className="list-disc pl-4 space-y-2 uppercase text-xs font-bold">
                                <li>Database System Architecture (3-Tier)</li>
                                <li>Data Independence (Logical vs Physical)</li>
                                <li>ER Diagram Components (Entity, Attribute, Relationship)</li>
                                <li>Relational Algebra Operations</li>
                            </ul>
                        </div>

                        <p className="text-xs uppercase text-gray-500 font-bold border-t-2 border-gray-200 pt-4">
                            Generated by Sankalan AI • Accuracy 98%
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t-4 border-black bg-gray-50 shrink-0 flex gap-4">
                    <button className="flex-1 py-3 border-2 border-black font-black uppercase hover:bg-white flex items-center justify-center gap-2">
                        <Download size={16} /> Download PDF
                    </button>
                    <button className="flex-1 py-3 bg-black text-white border-2 border-black font-black uppercase hover:bg-gray-800 flex items-center justify-center gap-2">
                        <Sparkles size={16} /> Flashcards
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Component ---
const StudyMaterials: React.FC<{ profile?: UserProfile }> = ({ profile }) => {
    const [selectedSubject, setSelectedSubject] = useState('DBMS');
    const [selectedYear, setSelectedYear] = useState(profile?.year || '3RD YEAR');
    const [selectedSemester, setSelectedSemester] = useState(profile?.semester || 'S5');
    const [selectedBranch, setSelectedBranch] = useState(profile?.branch || 'CSE');

    const [expandedUnit, setExpandedUnit] = useState<number | null>(1); // Default unit 1 expanded
    const [showUpload, setShowUpload] = useState(false);
    const [summaryMaterial, setSummaryMaterial] = useState<StudyMaterial | null>(null);
    const playClick = useSound();

    const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT'];
    const years = ['1ST YEAR', '2ND YEAR', '3RD YEAR', '4TH YEAR'];
    const semesters = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

    const units = [1, 2, 3, 4, 5];

    const getMaterialsForUnit = (unit: number) => {
        return MOCK_MATERIALS.filter(m => m.unit === unit);
    };

    return (
        <div className="min-h-screen bg-dots pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Page Header */}
                <div className="mb-10">
                    <div className="flex items-center gap-2 mb-2">
                        <BookOpen size={24} />
                        <span className="font-black uppercase tracking-widest text-sm">RESOURCES</span>
                    </div>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] inline-block">
                                📝 Study Materials
                            </h1>
                            <p className="text-xl font-bold uppercase opacity-70 ml-2">Verified notes & resources</p>
                        </div>

                        {/* Flexible Filters */}
                        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-4 flex-wrap">
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase mb-1">Branch</label>
                                <select
                                    value={selectedBranch}
                                    onChange={(e) => setSelectedBranch(e.target.value)}
                                    className="border-2 border-black p-1 font-bold uppercase text-xs focus:outline-none cursor-pointer hover:bg-gray-50"
                                >
                                    {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase mb-1">Year</label>
                                <select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                    className="border-2 border-black p-1 font-bold uppercase text-xs focus:outline-none cursor-pointer hover:bg-gray-50"
                                >
                                    {years.map(y => <option key={y} value={y}>{y}</option>)}
                                </select>
                            </div>
                            <div className="flex flex-col">
                                <label className="text-[10px] font-black uppercase mb-1">Semester</label>
                                <select
                                    value={selectedSemester}
                                    onChange={(e) => setSelectedSemester(e.target.value)}
                                    className="border-2 border-black p-1 font-bold uppercase text-xs focus:outline-none cursor-pointer hover:bg-gray-50"
                                >
                                    {/* Smart filter: show relevant sems or all */}
                                    {semesters.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Subject Tabs */}
                <div className="flex overflow-x-auto gap-2 pb-4 scrollbar-hide">
                    {SUBJECTS.map((sub) => (
                        <button
                            key={sub}
                            onClick={() => { playClick(); setSelectedSubject(sub); }}
                            className={`px-4 py-2 border-2 border-black font-black uppercase text-sm whitespace-nowrap transition-all ${selectedSubject === sub ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]' : 'bg-white hover:bg-gray-100'}`}
                        >
                            {sub}
                        </button>
                    ))}
                </div>
            </div>

            {/* Selected Subject Info */}
            <div className="bg-white border-4 border-black p-6 mb-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-3xl font-black uppercase mb-2">{selectedSubject}</h2>
                        <p className="text-sm font-bold uppercase text-gray-500">5 Units • {MOCK_MATERIALS.length} Materials • Last updated 2 days ago</p>
                    </div>
                    <div className="hidden md:block">
                        <div className="text-4xl font-black opacity-10">{selectedSubject}</div>
                    </div>
                </div>
            </div>

            {/* Unit Accordion */}
            <div className="space-y-6">
                {units.map((unit) => {
                    const materials = getMaterialsForUnit(unit);
                    const isExpanded = expandedUnit === unit;

                    return (
                        <div key={unit} className="border-4 border-black bg-white mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <button
                                onClick={() => { playClick(); setExpandedUnit(isExpanded ? null : unit); }}
                                className="w-full flex justify-between items-center p-4 bg-yellow-300 border-b-4 border-black hover:bg-yellow-400 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                                        <ChevronDown size={24} />
                                    </div>
                                    <h3 className="text-xl font-black uppercase">Unit {unit}: {unit === 1 ? 'Introduction' : unit === 2 ? 'ER & Relational Model' : unit === 3 ? 'Normalization' : unit === 4 ? 'SQL & Transactions' : 'Indexing'}</h3>
                                </div>
                                <span className="text-xs font-bold uppercase bg-white text-black px-2 py-1">
                                    {materials.length} Materials
                                </span>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                {materials.length > 0 ? (
                                    <div className="p-6 space-y-4 bg-gray-50">
                                        {materials.map(m => (
                                            <MaterialCard key={m.id} material={m} onSummarize={setSummaryMaterial} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="p-8 text-center text-gray-500 font-bold uppercase">
                                        No materials uploaded yet for this unit.
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Upload CTA */}
            <div className="mt-16 bg-stripes-inverted p-8 border-4 border-black text-center">
                <div className="bg-white border-4 border-black p-8 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-2xl font-black uppercase mb-4">📤 Contribute to Sankalan</h3>
                    <p className="font-bold uppercase mb-6 text-gray-600">Have good notes? Help your classmates by sharing resources.</p>
                    <button
                        onClick={() => { playClick(); setShowUpload(true); }}
                        className="w-full sm:w-auto bg-black text-white px-6 py-3 font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2"
                    >
                        <Upload size={18} /> Upload Material
                    </button>
                </div>
            </div>

            {/* Modals */}
            <UploadModal isOpen={showUpload} onClose={() => setShowUpload(false)} subject={selectedSubject} />
            <AISummaryModal material={summaryMaterial} onClose={() => setSummaryMaterial(null)} />
        </div>
    );
};

export default StudyMaterials;
