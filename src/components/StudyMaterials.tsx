import React, { useState, useEffect } from 'react';
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
    Search,
    Loader2,
    RefreshCw,
    Edit2,
    ArrowRight,
    ArrowLeft,
    ExternalLink
} from 'lucide-react';
import useSound from '../hooks/useSound';
import { useStudyMaterials, StudyMaterial } from '../hooks/useStudyMaterials';
import { trackDownload, trackView } from '../lib/firestoreService';

// --- Types ---
// Updated to match hook/service
type MaterialType = 'pdf' | 'pptx' | 'video' | 'doc' | 'pyq' | 'note';

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

const SUBJECTS = ['DBMS', 'CN', 'OS', 'ML', 'CD', 'TOC'];

// --- Sub-Components ---
const MaterialIcon: React.FC<{ type: MaterialType | string }> = ({ type }) => {
    // Normalize type string just in case
    const t = type.toLowerCase();
    switch (t) {
        case 'pdf': return <FileText size={20} className="text-red-600" />;
        case 'pptx':
        case 'ppt': return <File size={20} className="text-orange-600" />;
        case 'video':
        case 'mp4': return <Video size={20} className="text-blue-600" />;
        case 'doc':
        case 'docx': return <FileText size={20} className="text-blue-800" />;
        case 'pyq': return <BookOpen size={20} className="text-purple-600" />;
        default: return <File size={20} />;
    }
};

// --- Helpers ---
const directDownload = async (url: string, filename: string) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
        console.error("Direct download failed, trying fallback:", error);
        // Fallback: stay on same page by using target="_self" if possible, 
        // but browsers often force new tabs for PDFs if they can't be fetched via JS
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        // We don't set target="_blank" here to try and keep it on the same page
        document.body.appendChild(link);
        link.click();
        link.remove();
    }
};

const MaterialCard: React.FC<{ material: StudyMaterial; onSummarize: (m: StudyMaterial) => void; onView: (m: StudyMaterial) => void }> = ({ material, onSummarize, onView }) => {
    const playClick = useSound();

    const handleDownload = async () => {
        playClick();
        if (material.fileUrl && material.fileUrl !== '#') {
            trackDownload(material.id);
            await directDownload(material.fileUrl, material.title || 'material');
        } else {
            alert("File URL not available.");
        }
    };

    const handleView = async () => {
        playClick();
        if (material.fileUrl && material.fileUrl !== '#') {
            trackView(material.id);
            onView(material);  // Open in modal viewer
        }
    }

    return (
        <div className="border-4 border-black bg-white p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center hover:bg-gray-50 transition-colors">
            <div className="flex gap-4 items-start">
                <div className="p-3 border-2 border-black bg-gray-50">
                    <MaterialIcon type={material.type} />
                </div>
                <div>
                    <h4 className="text-lg font-black uppercase leading-tight mb-1">{material.title}</h4>
                    <p className="text-xs font-bold uppercase text-gray-500">
                        {material.type.toUpperCase()} • {material.size} • {material.views} views • {material.downloads || 0} DLs • By {material.author}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto">
                <button
                    onClick={handleView}
                    className="flex-1 sm:flex-none px-3 py-2 border-2 border-black text-xs font-black uppercase hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1">
                    <Eye size={14} /> View
                </button>
                <button
                    onClick={handleDownload}
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
const StudyMaterials: React.FC<{ profile?: UserProfile; onProfileUpdate?: (profile: UserProfile) => void; onBack?: () => void }> = ({ profile, onProfileUpdate, onBack }) => {
    const [selectedSubject, setSelectedSubject] = useState('ML');
    const [selectedYear, setSelectedYear] = useState(profile?.year || '3RD YEAR');
    const [selectedSemester, setSelectedSemester] = useState(profile?.semester || 'S5');
    const [selectedBranch, setSelectedBranch] = useState(profile?.branch || 'CSE');
    const [searchQuery, setSearchQuery] = useState('');

    // Temp state for profile selection
    const [tempBranch, setTempBranch] = useState(profile?.branch || 'CSE');
    const [tempYear, setTempYear] = useState(profile?.year || '3RD YEAR');
    const [tempSemester, setTempSemester] = useState(profile?.semester || 'S5');

    const [expandedUnit, setExpandedUnit] = useState<number | null>(1); // Default unit 1 expanded
    const [showUpload, setShowUpload] = useState(false);
    const [summaryMaterial, setSummaryMaterial] = useState<StudyMaterial | null>(null);
    const [viewerMaterial, setViewerMaterial] = useState<StudyMaterial | null>(null);  // For PDF viewer
    const playClick = useSound();

    const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT'];
    const years = ['1ST YEAR', '2ND YEAR', '3RD YEAR', '4TH YEAR'];

    // Helper function to get semesters based on year
    const getSemestersForYear = (year: string) => {
        switch (year) {
            case '1ST YEAR': return ['S1', 'S2'];
            case '2ND YEAR': return ['S3', 'S4'];
            case '3RD YEAR': return ['S5', 'S6'];
            case '4TH YEAR': return ['S7', 'S8'];
            default: return ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];
        }
    };

    const availableSemesters = getSemestersForYear(tempYear);

    // Auto-adjust semester when year changes
    useEffect(() => {
        const validSemesters = getSemestersForYear(tempYear);
        if (!validSemesters.includes(tempSemester)) {
            setTempSemester(validSemesters[0]);
        }
    }, [tempYear]);

    const units = [1, 2, 3, 4, 5];

    const handleApplyProfile = () => {
        playClick();
        setSelectedBranch(tempBranch);
        setSelectedYear(tempYear);
        setSelectedSemester(tempSemester);

        if (onProfileUpdate && profile) {
            onProfileUpdate({
                ...profile,
                branch: tempBranch,
                year: tempYear,
                semester: tempSemester
            });
        }
    };

    // --- Firebase Integration ---
    // Filter to show only NOTES (not PYQs) in Study Materials
    const { materials: fetchedMaterials, loading, error } = useStudyMaterials(selectedSubject, {
        type: 'note',  // Only show notes, not PYQs
        // year: selectedYear,
        // semester: selectedSemester,
        // branch: selectedBranch,
        searchQuery: searchQuery
    });

    // Debug logging
    useEffect(() => {
        console.log('🔍 [StudyMaterials] Current filters:', {
            subject: selectedSubject,
            year: selectedYear,
            semester: selectedSemester,
            branch: selectedBranch,
            searchQuery: searchQuery
        });
        console.log('📦 [StudyMaterials] Fetched materials:', fetchedMaterials);
    }, [selectedSubject, selectedYear, selectedSemester, selectedBranch, searchQuery, fetchedMaterials]);

    const displayMaterials = fetchedMaterials;

    const getMaterialsForUnit = (unit: number) => {
        return displayMaterials.filter(m => m.unit === unit);
    };

    return (
        <div className="min-h-screen bg-dots pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-5xl">

                {/* Back Button */}
                <button
                    onClick={() => { playClick(); onBack?.(); }}
                    className="flex items-center gap-2 mb-6 text-gray-500 hover:text-black font-bold uppercase text-xs transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Academics
                </button>

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

                        {/* Search Filter Only */}
                        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <div className="flex flex-col w-full max-w-md">
                                <label className="text-[10px] font-black uppercase mb-1">Search Topics</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search topics..."
                                        className="w-full border-2 border-black p-2 pl-8 font-bold uppercase text-xs focus:outline-none"
                                    />
                                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Selection Widget */}
                    {onProfileUpdate && (
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mb-6">
                            <div className="flex items-center gap-2 mb-3">
                                <Edit2 size={18} />
                                <h3 className="text-lg font-black uppercase">Update Your Profile</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-600 block mb-1">Branch</label>
                                    <select
                                        value={tempBranch}
                                        onChange={(e) => setTempBranch(e.target.value)}
                                        className="w-full p-2 border-2 border-black font-bold uppercase text-xs focus:outline-none focus:border-orange-600"
                                    >
                                        {branches.map(b => <option key={b} value={b}>{b}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-600 block mb-1">Year</label>
                                    <select
                                        value={tempYear}
                                        onChange={(e) => setTempYear(e.target.value)}
                                        className="w-full p-2 border-2 border-black font-bold uppercase text-xs focus:outline-none focus:border-orange-600"
                                    >
                                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-600 block mb-1">Semester</label>
                                    <select
                                        value={tempSemester}
                                        onChange={(e) => setTempSemester(e.target.value)}
                                        className="w-full p-2 border-2 border-black font-bold uppercase text-xs focus:outline-none focus:border-orange-600"
                                    >
                                        {availableSemesters.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <button
                                        onClick={handleApplyProfile}
                                        className="w-full bg-black text-white px-4 py-2 font-black uppercase border-4 border-black hover:bg-gray-800 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center justify-center gap-2 text-xs"
                                    >
                                        <ArrowRight size={14} /> GO
                                    </button>
                                </div>
                            </div>
                            <p className="text-[10px] font-bold uppercase text-gray-500 mt-2">
                                💡 Click GO to apply changes and see relevant materials
                            </p>
                        </div>
                    )}
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
                        {loading ? (
                            <div className="flex items-center gap-2 text-sm font-bold uppercase text-gray-500">
                                <Loader2 className="animate-spin" size={16} /> Fetching Materials...
                            </div>
                        ) : (
                            <p className="text-sm font-bold uppercase text-gray-500">
                                5 Units • {displayMaterials.length} Materials
                            </p>
                        )}
                    </div>
                    <div className="hidden md:block">
                        <div className="text-4xl font-black opacity-10">{selectedSubject}</div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4 opacity-50">
                    <Loader2 size={48} className="animate-spin" />
                    <p className="font-black uppercase tracking-widest">Accessing Sankalan Database...</p>
                </div>
            ) : error ? (
                <div className="text-center py-20 bg-red-50 border-4 border-red-500 p-8">
                    <p className="font-black uppercase text-red-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-red-600 text-white font-black uppercase border-2 border-black hover:bg-red-700 flex items-center gap-2 mx-auto"
                    >
                        <RefreshCw size={16} /> Retry
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {units.map((unit) => {
                        const materials = getMaterialsForUnit(unit);
                        const isExpanded = expandedUnit === unit;

                        // Skip rendering empty units if we are searching (improves UX)
                        if (searchQuery && materials.length === 0) return null;

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
                                        <h3 className="text-xl font-black uppercase">Unit {unit}</h3>
                                    </div>
                                    <span className="text-xs font-bold uppercase bg-white text-black px-2 py-1">
                                        {materials.length} Materials
                                    </span>
                                </button>

                                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                                    {materials.length > 0 ? (
                                        <div className="p-6 space-y-4 bg-gray-50">
                                            {materials.map(m => (
                                                <MaterialCard key={m.id} material={m} onSummarize={setSummaryMaterial} onView={setViewerMaterial} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-gray-500 font-bold uppercase">
                                            No materials found for this unit.
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}

                    {displayMaterials.length === 0 && searchQuery && (
                        <div className="text-center py-12">
                            <p className="font-black uppercase text-gray-400">No results found for "{searchQuery}"</p>
                        </div>
                    )}
                </div>
            )}

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

            {/* PDF Viewer Modal */}
            {viewerMaterial && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setViewerMaterial(null)}>
                    <div className="bg-white border-4 border-black w-full max-w-6xl h-[90vh] flex flex-col shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]" onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div className="bg-yellow-300 border-b-4 border-black p-4 flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-black uppercase">{viewerMaterial.title}</h3>
                                <p className="text-xs font-bold uppercase text-gray-700">
                                    {viewerMaterial.type} • {viewerMaterial.subject} • Unit {viewerMaterial.unit}
                                </p>
                            </div>
                            <button
                                onClick={() => setViewerMaterial(null)}
                                className="p-2 hover:bg-black hover:text-white border-2 border-black transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* PDF Viewer */}
                        <div className="flex-1 bg-gray-100 overflow-hidden">
                            {viewerMaterial.fileUrl && viewerMaterial.fileUrl !== '#' ? (
                                <iframe
                                    src={viewerMaterial.fileUrl}
                                    className="w-full h-full border-none"
                                    title={viewerMaterial.title}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <p className="font-black uppercase text-gray-500">File not available</p>
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="bg-gray-50 border-t-4 border-black p-4 flex gap-3">
                            <button
                                onClick={async () => {
                                    if (viewerMaterial.fileUrl && viewerMaterial.fileUrl !== '#') {
                                        trackDownload(viewerMaterial.id);
                                        await directDownload(viewerMaterial.fileUrl, viewerMaterial.title || 'download');
                                    }
                                }}
                                className="flex-1 bg-black text-white px-4 py-3 font-black uppercase border-4 border-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                <Download size={18} /> Download
                            </button>
                            <button
                                onClick={() => {
                                    if (viewerMaterial.fileUrl && viewerMaterial.fileUrl !== '#') {
                                        window.open(viewerMaterial.fileUrl, '_blank');
                                    }
                                }}
                                className="flex-1 bg-blue-500 text-white px-4 py-3 font-black uppercase border-4 border-black hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <ExternalLink size={18} /> Fullscreen
                            </button>
                            <button
                                onClick={() => {
                                    setViewerMaterial(null);
                                    setSummaryMaterial(viewerMaterial);
                                }}
                                className="flex-1 bg-purple-500 text-white px-4 py-3 font-black uppercase border-4 border-black hover:bg-purple-600 transition-colors flex items-center justify-center gap-2"
                            >
                                <Sparkles size={18} /> AI Summarize
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyMaterials;
