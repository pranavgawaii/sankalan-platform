import React, { useState, useEffect, useMemo } from 'react';
import { SignIn, SignUp, useUser, useClerk } from '@clerk/clerk-react';
import { AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import {
  BookOpen,
  ChevronRight,
  Menu,
  X,
  Target,
  ArrowRight,
  Sparkles,
  Zap,
  BarChart3,
  Trophy,
  Cpu,
  Users,
  CheckCircle2,
  GraduationCap,
  Frown,
  Smile,
  AlertTriangle,
  HelpCircle,
  Lightbulb,
  Monitor,
  Play,
  Lock,
  ArrowLeft,
  Mail,
  UserCheck,
  Bell,
  User,
  LogOut,
  Calendar,
  Clock,
  Download,
  FileText,
  Search,
  Eye,
  ExternalLink,
  Filter,
  Volume2,
  VolumeX,
  Headphones,

  Edit2,
  Upload,
  CloudUpload,
  Shield
} from 'lucide-react';
import { useSoundContext } from './src/context/SoundContext';

// Force refresh
import AdminDashboard from './src/components/admin/AdminDashboard';
import StudyMaterials from './src/components/StudyMaterials';
import AITools from './src/components/AITools';
import About from './src/components/About';
import Profile from './src/components/Profile';
import Settings from './src/components/Settings';
import StudyRooms from './src/components/StudyRooms';
import LiveRoom from './src/components/LiveRoom';
import RoadmapPage from './src/components/Roadmap/RoadmapPage';
import useSound from './src/hooks/useSound';
import { useIntersectionObserver, useCountUp } from './src/hooks/useLandingAnimations';
import Loader from './src/components/Loader';
import DashboardLoader from './src/components/DashboardLoader';
import { useStudyMaterials } from './src/hooks/useStudyMaterials';
import { trackDownload, trackView } from './src/lib/firestoreService';
import DashboardPage from './src/components/DashboardPage';
import AcademicsLanding from './src/components/AcademicsLanding';
import CodeArenaLanding from './src/components/CodeArenaLanding';
import CareerLanding from './src/components/CareerLanding';
import CommunityLanding from './src/components/CommunityLanding';
import CalendarPage from './src/components/CalendarPage';
import CampusEvents from './src/components/CampusEvents';
import ClubLogin from './src/components/club/ClubLogin';
import ClubDashboard from './src/components/club/ClubDashboard';
import CoordinatorDashboard from './src/components/admin/SuperAdminDashboard';
import AdminPortal from './src/components/admin/AdminPortal';
import EventsAdminLogin from './src/components/admin/EventsAdminLogin';

// --- Types ---
type View = 'landing' | 'auth' | 'onboarding' | 'dashboard' | 'pyqs' | 'materials' | 'tools' | 'pathways' | 'about' | 'profile' | 'settings' | 'study-rooms' | 'live-room' | 'admin-dashboard' | 'academics' | 'code-arena' | 'career' | 'community' | 'calendar' | 'campus-events' | 'club-login' | 'club-dashboard' | 'coordinator-dashboard' | 'admin-portal' | 'events-admin-login';
type AuthMode = 'signin' | 'signup' | 'admin-login';

interface UserProfile {
  name: string;
  branch: string;
  year: string;
  semester: string;
  role: 'student' | 'admin';
}

interface PYQPaper {
  id: string;
  subject: string;
  type: 'TA1' | 'TA2' | 'EndSem' | 'SummerTerm';
  year: number;
  pages: number;
  views: number;
  downloads: number;
  fileUrl?: string; // Real PDF URL from Firebase
  examYear?: number;
}

// --- Mock Data ---

const MOCK_PAPERS: PYQPaper[] = [
  { id: '1', subject: 'DBMS', type: 'EndSem', year: 2024, pages: 25, views: 250, downloads: 180 },
  { id: '2', subject: 'CN', type: 'TA1', year: 2024, pages: 18, views: 180, downloads: 120 },
  { id: '3', subject: 'OS', type: 'EndSem', year: 2023, pages: 22, views: 190, downloads: 140 },
  { id: '4', subject: 'ML', type: 'EndSem', year: 2024, pages: 30, views: 310, downloads: 210 },
  { id: '5', subject: 'CD', type: 'TA2', year: 2024, pages: 15, views: 120, downloads: 90 },
  { id: '6', subject: 'TOC', type: 'EndSem', year: 2023, pages: 20, views: 155, downloads: 110 },
  { id: '7', subject: 'DBMS', type: 'TA1', year: 2023, pages: 12, views: 98, downloads: 65 },
  { id: '8', subject: 'CN', type: 'EndSem', year: 2022, pages: 24, views: 205, downloads: 150 },
  { id: '9', subject: 'OS', type: 'TA2', year: 2024, pages: 16, views: 140, downloads: 100 },
  { id: '10', subject: 'DSA', type: 'SummerTerm', year: 2023, pages: 45, views: 50, downloads: 20 },
];

const SUBJECT_SHORTS = [
  { code: 'ALL', name: 'ALL' },
  { code: 'MFC-1', name: 'MATHEMATICAL FOUNDATIONS FOR COMPUTING - I' },
  { code: 'MCD', name: 'MATERIALS FOR COMPUTING DEVICES' },
  { code: 'EP', name: 'ENGINEERING PHYSICS' },
  { code: 'EEE', name: 'ELECTRICAL AND ELECTRONICS ENGINEERING' },
  { code: 'DELD', name: 'DIGITAL ELECTRONICS AND LOGIC DESIGN' },
  { code: 'MFC-2', name: 'MATHEMATICAL FOUNDATIONS FOR COMPUTING - II' }
];
const YEARS = ['ALL', '1', '2', '3', '4'];
const TYPES = ['ALL', 'TA1', 'TA2', 'EndSem', 'SummerTerm'];
const BRANCHES = ['ALL', 'CSE', 'ECE', 'ME', 'CE', 'IT'];

// --- Reusable Components ---

const RetroDivider = () => <div className="border-b-4 border-black w-full" />;

const WindowBox: React.FC<{ title?: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "" }) => (
  <div className={`border-4 border-black bg-white overflow-hidden ${className}`}>
    {title && (
      <div className="window-header border-b-4 border-black">
        <span className="text-xl font-bold tracking-widest px-2 uppercase">{title}</span>
        <div className="flex gap-1 pr-1">
          <div className="w-4 h-4 border-2 border-white"></div>
          <div className="w-4 h-4 border-2 border-white flex items-center justify-center text-[10px] font-black">X</div>
        </div>
      </div>
    )}
    <div className="p-6">
      {children}
    </div>
  </div>
);

import ModernNavbar from './src/components/ModernNavbar';

// --- Sub-Components for Dashboard/PYQ Shared Navigation ---

const AppNav: React.FC<{
  profile: UserProfile;
  onLogout: () => void;
  currentView: View;
  setView: (v: View) => void;
  notifOpen: boolean;
  setNotifOpen: (v: boolean) => void;
  profileOpen: boolean;
  setProfileOpen: (v: boolean) => void;
}> = ({ profile, onLogout, currentView, setView, notifOpen, setNotifOpen }) => {
  const initials = profile.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  return (
    <ModernNavbar
      onNavigate={(viewId) => setView(viewId as View)}
      currentPath={currentView}
      userName={profile.name}
      userInitials={initials}
      hasNotifications={true}
      onNotificationClick={() => setNotifOpen(!notifOpen)}
      onLogout={onLogout}
    />
  );
};

// --- PYQ Browse View ---

const PYQBrowseView: React.FC<{
  profile: UserProfile;
  onLogout: () => void;
  setView: (v: View) => void;
}> = ({ profile, onLogout, setView }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [contributeOpen, setContributeOpen] = useState(false); // New State
  const playClick = useSound();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  // Use Global Profile State for Filters
  const selectedBranch = profile.branch || 'CSE';
  // Correctly parse year from profile (stored as '1', '2' etc string)
  const selectedYear = profile.year || '1';
  const [selectedType, setSelectedType] = useState('ALL');
  const [selectedPaper, setSelectedPaper] = useState<PYQPaper | null>(null);

  // Helper for Year Format
  const formatYear = (y: string | number) => {
    const map: Record<string, string> = { '1': '1ST YEAR', '2': '2ND YEAR', '3': '3RD YEAR', '4': '4TH YEAR' };
    return map[String(y)] || `${y}TH YEAR`;
  };

  // --- Firebase Integration ---
  // FETCH ALL PAPERS for valid Client-Side Filtering (Fuzzy Match)
  // We pass 'undefined' as subject so Firestore returns everything for this Branch/Year
  const { materials, loading, error } = useStudyMaterials(
    undefined,
    {
      branch: selectedBranch,
      year: selectedYear
    }
  );

  const realPapers: PYQPaper[] = useMemo(() => {
    // Note: useStudyMaterials might return mixed case subjects.
    // We rely on exact matches or need to normalize.
    return materials.map(m => ({
      id: m.id,
      subject: m.subject, // Ensure this matches dropdown values if strictly filtering
      type: (m.title.toLowerCase().includes('mid') || m.title.toLowerCase().includes('unit')) ? 'TA1' : 'EndSem',
      year: m.year ? Number(m.year) : 1,
      examYear: m.examYear || 2024,
      pages: 12,
      views: m.views || 0,
      downloads: 0,
      fileUrl: m.fileUrl
    }));
  }, [materials]);

  const filteredPapers = useMemo(() => {
    // Filter mainly by Search and Type locally.
    // Branch/Year filtering is done by fetch/profile context.
    // Subject filtering is done by fetch, but we double check if needed or for mocks.
    // MOCK_PAPERS need to be filtered by selectedBranch too if they have it
    const relevantMocks = MOCK_PAPERS.filter(p => true); // Mocks are generic for now

    const allPapers = [...realPapers]; // Add mocks if needed, but for "Real" flow just use realPapers

    return allPapers.filter(p => {
      const matchesSearch = searchQuery === '' || p.subject.toLowerCase().includes(searchQuery.toLowerCase());

      // Robust Subject Matching (Handle Roman/Arabic numerals and spacing)
      // Aggressive Normalization: Strip non-alphanumeric, handle Roman Numerals
      const normalize = (s: string) => {
        let clean = s.toUpperCase();
        // Handle Roman Numerals at end of string or before typical separators
        clean = clean.replace(/(\s|-)+I$/, '1');   // Ends in I -> 1
        clean = clean.replace(/(\s|-)+II$/, '2');  // Ends in II -> 2
        clean = clean.replace(/(\s|-)+I(\s|$)/, '1$2'); // I in middle
        clean = clean.replace(/(\s|-)+II(\s|$)/, '2$2'); // II in middle

        // Remove ALL non-alphanumeric characters for fuzzy matching
        return clean.replace(/[^A-Z0-9]/g, '');
      };

      const pSubject = normalize(p.subject);
      const sSubject = normalize(selectedSubject);

      const matchesSubject = selectedSubject === 'ALL' ||
        pSubject.includes(sSubject) ||
        sSubject.includes(pSubject);

      const matchesType = selectedType === 'ALL' || p.type === selectedType;

      return matchesSearch && matchesSubject && matchesType;
    });
  }, [searchQuery, selectedSubject, selectedType, realPapers]);

  // ... handlePaperView ...
  const handlePaperView = (paper: PYQPaper) => {
    if (paper.fileUrl) {
      trackView(paper.id);
    }
    setSelectedPaper(paper);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-20">
      <AppNav
        profile={profile}
        onLogout={onLogout}
        currentView="pyqs"
        setView={setView}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* Page Header with Context - REDESIGNED */}
        <div className="bg-black text-white p-8 md:p-10 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row justify-between items-start md:items-end gap-8 relative overflow-hidden">
          {/* Background Decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gray-900 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

          <div className="relative z-10 max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4 flex items-center gap-4">
              📚 BROWSE PYQS
            </h2>
            <div className="h-2 bg-white w-32 mb-6"></div>
            <p className="text-xl font-bold uppercase tracking-widest opacity-90 mb-2">
              Showing Papers for <span className="bg-white text-black px-2 py-0.5">{selectedBranch}</span> • <span className="bg-white text-black px-2 py-0.5">{formatYear(selectedYear)}</span>
            </p>
            <p className="text-sm font-bold uppercase opacity-50">
              Select a subject below to filter the archive.
            </p>
          </div>

          {/* Contribute CTA */}
          <div className="relative z-10 flex flex-col items-start md:items-end gap-3 text-right">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FFC900] animate-pulse">Missing something?</span>
              <span className="text-sm font-bold uppercase opacity-60 max-w-xs leading-tight">Help your juniors by uploading missing papers.</span>
            </div>
            <button
              onClick={() => setContributeOpen(true)}
              className="bg-white text-black px-6 py-3 font-black uppercase tracking-widest hover:bg-[#FFC900] hover:scale-105 transition-all shadow-[4px_4px_0px_0px_rgba(50,50,50,0.5)] flex items-center gap-2"
            >
              <Upload size={18} strokeWidth={2.5} /> CONTRIBUTE PAPER
            </button>
          </div>
        </div>

        {/* Filters Bar - Simplified (Only Search) */}
        <div className="sticky top-[72px] z-40 bg-white border-4 border-black p-4 flex flex-col md:flex-row items-center gap-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 opacity-40" size={18} />
            <input
              type="text"
              placeholder="SEARCH TOPICS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border-2 border-black font-bold focus:outline-none focus:bg-gray-50 uppercase text-xs"
            />
          </div>

          <div className="hidden md:block border-l-2 border-black h-8 mx-2"></div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-50 whitespace-nowrap">
            {filteredPapers.length} PAPERS FOUND
          </p>
        </div>

        {/* Horizontal Subject Scroll List */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {SUBJECT_SHORTS.map((subject) => (
            <button
              key={subject.code}
              onClick={() => {
                playClick();
                setSelectedSubject(subject.name); // Set full name for filtering
              }}
              className={`flex-shrink-0 px-6 py-3 border-4 border-black text-sm font-black uppercase tracking-widest transition-all ${selectedSubject === subject.name ? 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(100,100,100,0.5)] transform -translate-y-1' : 'bg-white text-black hover:bg-gray-100'}`}
            >
              {subject.code}
            </button>
          ))}
        </div>

        {/* Subject Tabs */}
        {/* Subject Tabs - REMOVED (Empty/Confusing for now) */}
        {/* <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">...</div> */}

        {/* PYQ Cards Grid */}
        {filteredPapers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPapers.map((paper) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group bg-white border-4 border-black hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[300px]"
                onClick={() => handlePaperView(paper)}
              >
                {/* Minimalist Watermark */}
                <div className="absolute -right-8 -top-8 text-[120px] font-black text-gray-50 opacity-10 select-none z-0 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                  {paper.subject.charAt(0)}
                </div>

                <div className="p-8 relative z-10 flex flex-col h-full">
                  {/* Top Meta Row */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black ${paper.type === 'EndSem' ? 'bg-black text-white' : 'bg-white text-black'}`}>
                        {paper.type}
                      </span>
                      <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest border-2 border-black bg-white text-black">
                        {paper.examYear}
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                      {formatYear(paper.year)}
                    </span>
                  </div>

                  {/* Hero Title */}
                  <h3 className="text-2xl font-black uppercase tracking-tighter leading-none mb-4 line-clamp-3 group-hover:underline decoration-4 underline-offset-4 decoration-black">
                    {paper.subject}
                  </h3>

                  {/* Spacer to push footer down */}
                  <div className="flex-1"></div>

                  {/* Action Footer */}
                  <div className="pt-6 mt-6 border-t-2 border-gray-100 group-hover:border-black transition-colors flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-black transition-colors flex items-center gap-2">
                      <FileText size={14} strokeWidth={2.5} />
                      VIEW PAPER
                    </span>
                    <div className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-black flex items-center justify-center transition-all group-hover:bg-black group-hover:text-white">
                      <ArrowRight size={16} strokeWidth={3} className="transform -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center space-y-6">
            <Frown size={80} className="opacity-20" />
            <div>
              <h3 className="text-3xl font-black uppercase tracking-tighter">NO PYQS FOUND</h3>
              <p className="text-sm font-bold uppercase opacity-50">Try adjusting your filters or search for a different subject.</p>
            </div>
            <button
              onClick={() => { setSelectedSubject('ALL'); setSelectedType('ALL'); setSearchQuery(''); }}
              className="retro-btn bg-black text-white px-8 py-3 font-black uppercase tracking-widest"
            >
              CLEAR FILTERS
            </button>
          </div>
        )
        }

        {/* Pagination */}
        <div className="flex justify-center items-center gap-4 py-12">
          <button className="px-6 py-2 border-4 border-black font-black uppercase text-xs opacity-30 cursor-not-allowed">[← PREV]</button>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button key={n} className={`w-10 h-10 border-4 border-black flex items-center justify-center font-black ${n === 1 ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>{n}</button>
            ))}
          </div>
          <button className="px-6 py-2 border-4 border-black font-black uppercase text-xs hover:bg-gray-100 transition-colors">[NEXT →]</button>
        </div>
      </main >

      {/* PDF Viewer Modal Overlay - Professional Redesign */}
      {
        selectedPaper && (
          <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-6xl h-[90vh] flex flex-col relative shadow-2xl rounded-sm overflow-hidden">
              {/* Modal Header */}
              <div className="bg-[#1a1a1a] text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">
                <div className="">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="bg-white text-black px-2 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-sm">
                      {selectedPaper.type}
                    </span>
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                      {formatYear(selectedPaper.year)} • {selectedPaper.examYear}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white leading-none">
                    {selectedPaper.subject}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPaper(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
                >
                  <X size={24} strokeWidth={2} />
                </button>
              </div>

              {/* Modal Body - PDF Viewer */}
              <div className="flex-1 overflow-hidden flex bg-gray-50">
                {selectedPaper.fileUrl ? (
                  <div className="flex-1 bg-[#1a1a1a] flex flex-col items-center justify-center p-4">
                    {/* PDF Frame wrapper */}
                    <div className="w-full h-full bg-white shadow-xl">
                      <iframe src={selectedPaper.fileUrl} className="w-full h-full border-none" title="PDF Viewer" />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 bg-gray-100 overflow-y-auto p-12 flex flex-col items-center justify-center space-y-6">
                    <div className="text-center opacity-40">
                      <FileText size={64} className="mx-auto mb-4" />
                      <p className="font-bold uppercase tracking-widest">Preview Not Available</p>
                    </div>
                  </div>
                )}

                {/* Sidebar controls */}
                <div className="w-72 bg-white border-l border-gray-200 p-6 flex flex-col gap-8 shadow-[-4px_0px_20px_rgba(0,0,0,0.05)] z-10">

                  {/* Tools Section */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">ACTIONS</p>
                    <button
                      onClick={async () => {
                        if (selectedPaper?.fileUrl) {
                          trackDownload(selectedPaper.id);
                          const filename = `${selectedPaper.subject}_${selectedPaper.type}_${selectedPaper.year}.pdf`;
                          try {
                            const response = await fetch(selectedPaper.fileUrl);
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
                            const link = document.createElement('a');
                            link.href = selectedPaper.fileUrl;
                            link.setAttribute('download', filename);
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          }
                        } else {
                          alert('Download not available for this paper yet.');
                        }
                      }}
                      className="w-full bg-black text-white hover:bg-gray-900 px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-sm shadow-sm"
                    >
                      <Download size={14} strokeWidth={2.5} /> DOWNLOAD
                    </button>
                    <button
                      onClick={() => {
                        if (selectedPaper?.fileUrl) {
                          window.open(selectedPaper.fileUrl, '_blank');
                        }
                      }}
                      className="w-full bg-white text-black border border-gray-300 hover:border-black hover:bg-gray-50 px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all rounded-sm"
                    >
                      <ExternalLink size={14} strokeWidth={2.5} /> FULLSCREEN
                    </button>
                  </div>

                  <div className="h-px bg-gray-100 w-full"></div>

                  {/* AI Features (Coming Soon) */}
                  <div className="space-y-3 opacity-60">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">INTELLIGENCE</p>
                    <button disabled className="w-full bg-gray-50 text-gray-400 px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between gap-2 rounded-sm cursor-not-allowed">
                      <div className="flex items-center gap-2"><Sparkles size={14} /> EXPLAINER</div>
                      <span className="text-[9px] font-black bg-gray-200 px-1.5 py-0.5 rounded text-gray-500">SOON</span>
                    </button>
                    <button disabled className="w-full bg-gray-50 text-gray-400 px-4 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between gap-2 rounded-sm cursor-not-allowed">
                      <div className="flex items-center gap-2"><Target size={14} /> TOPICS</div>
                      <span className="text-[9px] font-black bg-gray-200 px-1.5 py-0.5 rounded text-gray-500">SOON</span>
                    </button>
                  </div>

                  <div className="flex-1"></div>

                  {/* Related Papers (Simplified) */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">RELATED</p>
                    {MOCK_PAPERS.slice(0, 3).map(p => (
                      <div key={p.id} className="group flex items-center gap-3 p-2 hover:bg-gray-50 rounded-sm cursor-pointer transition-colors">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-500 group-hover:bg-black group-hover:text-white transition-colors rounded-full">
                          <FileText size={14} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase truncate group-hover:underline decoration-1 underline-offset-2">{p.subject}</p>
                          <p className="text-[9px] text-gray-400 uppercase">{p.type} • {p.year}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          </div>
        )
      }

      {/* Contribute Modal */}
      {contributeOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-lg relative shadow-2xl rounded-sm overflow-hidden border-4 border-black">
            <div className="bg-black text-white px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <Upload size={20} /> Contribute Paper
              </h3>
              <button onClick={() => setContributeOpen(false)} className="text-white hover:opacity-50 transition-opacity">
                <X size={24} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">Subject Name</label>
                <input type="text" placeholder="E.g. Engineering Physics" className="w-full p-3 border-2 border-black font-bold uppercase text-sm focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">Branch</label>
                  <select className="w-full p-3 border-2 border-black font-bold uppercase text-sm focus:outline-none">
                    <option>CSE</option>
                    <option>ECE</option>
                    <option>ME</option>
                    <option>CE</option>
                    <option>IT</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">Year</label>
                  <select className="w-full p-3 border-2 border-black font-bold uppercase text-sm focus:outline-none">
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-widest mb-2">Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {['End Sem', 'TA1', 'TA2'].map(t => (
                    <label key={t} className="border-2 border-black p-2 flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-colors font-bold uppercase text-xs">
                      <input type="radio" name="paperType" className="hidden" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-2 border-dashed border-gray-300 p-8 text-center hover:border-black hover:bg-gray-50 transition-colors cursor-pointer group">
                <CloudUpload size={40} className="mx-auto mb-2 text-gray-300 group-hover:text-black transition-colors" />
                <p className="text-xs font-bold uppercase text-gray-400 group-hover:text-black">Drag PDF here or click to browse</p>
              </div>

              <button className="w-full bg-black text-white py-4 font-black uppercase tracking-widest hover:bg-gray-900 transition-colors flex items-center justify-center gap-2" onClick={() => { alert('Thank you! Your contribution has been submitted for review.'); setContributeOpen(false); }}>
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      )}
    </div >
  );
};

// --- Dashboard View Component ---

const DashboardView: React.FC<{
  profile: UserProfile;
  onLogout: () => void;
  setView: (v: View) => void;
  onProfileUpdate: (profile: UserProfile) => void;
}> = ({ profile, onLogout, setView, onProfileUpdate }) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // Global Profile State



  // --- Sound Effects ---
  const playClick = useSound();

  // Local state for profile selection
  // Ensure temp values are initialized from profile or defaults
  const [tempBranch, setTempBranch] = useState(profile.branch || 'CSE');
  const [tempYear, setTempYear] = useState(profile.year === '1' ? '1ST YEAR' : profile.year === '2' ? '2ND YEAR' : profile.year === '3' ? '3RD YEAR' : profile.year === '4' ? '4TH YEAR' : '1ST YEAR');

  const handleGlobalFilterChange = (newBranch: string, newYear: string) => {
    // Convert readable year back to number string for profile/logic
    const yearNum = newYear === '1ST YEAR' ? '1' : newYear === '2ND YEAR' ? '2' : newYear === '3RD YEAR' ? '3' : '4';

    onProfileUpdate({
      ...profile,
      branch: newBranch,
      year: yearNum
    });
  };

  const branches = ['CSE', 'ECE', 'ME', 'CE', 'IT'];
  const years = ['1ST YEAR', '2ND YEAR', '3RD YEAR', '4TH YEAR'];

  // Effect to sync local state if profile changes externally
  useEffect(() => {
    setTempBranch(profile.branch || 'CSE');
    setTempYear(profile.year === '1' ? '1ST YEAR' : profile.year === '2' ? '2ND YEAR' : profile.year === '3' ? '3RD YEAR' : profile.year === '4' ? '4TH YEAR' : '1ST YEAR');
  }, [profile]);



  return (
    <div className="min-h-screen bg-gray-50/50 pt-20">
      <AppNav
        profile={profile}
        onLogout={onLogout}
        currentView="dashboard"
        setView={setView}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        profileOpen={profileOpen}
        setProfileOpen={setProfileOpen}
      />

      <main className="container mx-auto px-4 py-8 max-w-6xl space-y-8">
        {/* 1. Neo-Brutalist Command Bar */}
        <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sticky top-24 z-30 flex flex-col md:flex-row items-center justify-between gap-4 transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] duration-200">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="w-14 h-14 bg-black text-white flex items-center justify-center font-black text-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              {profile.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-black leading-none flex items-center gap-2">
                {profile.name} <span className="text-[10px] bg-yellow-400 text-black px-1 border border-black transform -rotate-6">PRO</span>
              </h2>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-2">
                <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 border border-black text-green-800">
                  <div className="w-2 h-2 bg-green-600 animate-pulse"></div>
                  ONLINE
                </div>
                <span>ID: {Math.floor(Math.random() * 10000)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="bg-white text-black px-4 py-2 border-2 border-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">BRANCH:</span>
              <select
                value={tempBranch}
                onChange={(e) => setTempBranch(e.target.value)}
                className="font-bold text-sm uppercase bg-transparent outline-none cursor-pointer"
              >
                {branches.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="bg-white text-black px-4 py-2 border-2 border-black flex items-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all">
              <span className="text-[10px] font-black uppercase tracking-widest">YEAR:</span>
              <select
                value={tempYear}
                onChange={(e) => setTempYear(e.target.value)}
                className="font-bold text-sm uppercase bg-transparent outline-none cursor-pointer"
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <button
              onClick={() => {
                playClick();
                handleGlobalFilterChange(tempBranch, tempYear);
              }}
              className="bg-black text-white px-6 py-2 border-2 border-black font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              GO
            </button>
          </div>
        </div>

        {/* 2. Tactile Neo-Brutalist Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-[260px]">

          {/* Card 1: PYQ Archive */}
          <div
            onClick={() => setView('pyqs')}
            className="group bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-8"
          >
            {/* Badge */}
            <div className="w-fit">
              <div className="bg-black text-white border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest group-hover:bg-white group-hover:text-black transition-colors">
                CORE ARCHIVE
              </div>
            </div>

            {/* Content */}
            <div className="mt-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 group-hover:underline decoration-4 underline-offset-4">
                BROWSE PYQS
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide leading-relaxed">
                Access the complete archive of previous year question papers.
              </p>
            </div>

            {/* Action */}
            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mt-4">
              ACCESS LIBRARY <ArrowRight size={16} strokeWidth={3} />
            </div>

            {/* Icon Decoration */}
            <div className="absolute top-8 right-8 text-gray-100 -z-10">
              <BookOpen size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Card 2: Study Materials */}
          <div
            onClick={() => setView('materials')}
            className="group bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-8"
          >
            <div className="w-fit">
              <div className="bg-[#4D96FF] text-white border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest">
                RESOURCES
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 group-hover:underline decoration-4 underline-offset-4">
                LECTURE NOTES
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide leading-relaxed">
                Official slides, handouts, and class summaries.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mt-4">
              OPEN FOLDER <ArrowRight size={16} strokeWidth={3} />
            </div>

            <div className="absolute top-8 right-8 text-gray-100 -z-10">
              <FileText size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Card 3: AI Tools */}
          <div
            onClick={() => setView('tools')}
            className="group bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-8"
          >
            <div className="w-fit">
              <div className="bg-[#A06CD5] text-white border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest">
                BETA TOOLS
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 group-hover:underline decoration-4 underline-offset-4">
                AI LAB
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide leading-relaxed">
                Mock tests generator and resume builder tools.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mt-4">
              LAUNCH TOOLS <ArrowRight size={16} strokeWidth={3} />
            </div>

            <div className="absolute top-8 right-8 text-gray-100 -z-10">
              <Cpu size={120} strokeWidth={1} />
            </div>
          </div>

          {/* Card 4: Study Rooms */}
          <div
            onClick={() => setView('study-rooms')}
            className="group bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col justify-between p-8"
          >
            <div className="w-fit">
              <div className="bg-[#6BCB77] text-black border-2 border-black px-3 py-1 text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <div className="w-2 h-2 bg-black rounded-full animate-pulse"></div> LIVE
              </div>
            </div>

            <div className="mt-4">
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-2 group-hover:underline decoration-4 underline-offset-4">
                STUDY ROOMS
              </h3>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-wide leading-relaxed">
                Join 12+ students focusing right now.
              </p>
            </div>

            <div className="flex items-center gap-2 text-sm font-black uppercase tracking-widest mt-4">
              JOIN SESSION <ArrowRight size={16} strokeWidth={3} />
            </div>

            <div className="absolute top-8 right-8 text-gray-100 -z-10">
              <Headphones size={120} strokeWidth={1} />
            </div>
          </div>

        </div>

        {/* 3. Minimal Footer */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-medium text-gray-400">
          <p>© 2026 Sankalan Platform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Status: Operational</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-gray-900 cursor-pointer transition-colors">Terms</span>
          </div>
        </div>

      </main>
    </div>
  );
};
// --- Onboarding Component ---

const OnboardingPage: React.FC<{ onComplete: (profile: Partial<UserProfile>) => void }> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({
    branch: '',
    year: '',
    semester: ''
  });
  const [error, setError] = useState('');

  const branches = [
    { id: 'CSE', name: 'Computer Science Engineering (CSE)' },
    { id: 'ECE', name: 'Electronics & Communication (ECE)' },
    { id: 'ME', name: 'Mechanical Engineering (ME)' },
    { id: 'CE', name: 'Civil Engineering (CE)' }
  ];

  const years = ['1ST YEAR', '2ND YEAR', '3RD YEAR', '4TH YEAR'];

  const getSemestersForYear = (year: string) => {
    switch (year) {
      case '1ST YEAR': return ['S1', 'S2'];
      case '2ND YEAR': return ['S3', 'S4'];
      case '3RD YEAR': return ['S5', 'S6'];
      case '4TH YEAR': return ['S7', 'S8'];
      default: return [];
    }
  };

  const semesters = getSemestersForYear(profile.year);

  const handleNext = () => {
    if (step === 1 && !profile.branch) return setError('PLEASE SELECT YOUR BRANCH');
    if (step === 2 && !profile.year) return setError('PLEASE SELECT YOUR YEAR');
    if (step === 3 && !profile.semester) return setError('PLEASE SELECT YOUR SEMESTER');

    setError('');
    if (step < 3) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      setError('');
    }
  };

  const progressText = () => {
    const filled = '■'.repeat(step + 1);
    const empty = '□'.repeat(5 - (step + 1));
    return `Step ${step} of 3 ${filled}${empty}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6 pt-24">
      <div className="w-full max-w-xl">
        <div className="bg-white border-4 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative">

          <div className="absolute top-8 right-12 text-[10px] font-black uppercase tracking-widest text-gray-400">
            {progressText()}
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-1">
              {step === 1 && 'SELECT YOUR BRANCH'}
              {step === 2 && 'SELECT YOUR YEAR'}
              {step === 3 && 'SELECT YOUR SEMESTER'}
            </h2>
            <div className="h-1 bg-black w-32"></div>
            <div className="mt-2 text-[10px] font-bold text-gray-400 tracking-[0.2em]">══════════════════════════════</div>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              {branches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => { setProfile({ ...profile, branch: b.id }); setError(''); }}
                  className={`w-full p-6 border-4 text-left font-bold uppercase transition-all flex justify-between items-center ${profile.branch === b.id ? 'bg-black text-white border-black' : 'bg-white border-black hover:bg-gray-50'}`}
                >
                  {b.name}
                  {profile.branch === b.id && <CheckCircle2 size={20} />}
                </button>
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {years.map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setProfile({ ...profile, year: y, semester: '' }); // Clear semester when year changes
                    setError('');
                  }}
                  className={`p-10 border-4 font-bold uppercase text-center transition-all ${profile.year === y ? 'bg-black text-white border-black' : 'bg-white border-black hover:bg-gray-50'}`}
                >
                  {y}
                </button>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
              {semesters.map((s) => (
                <button
                  key={s}
                  onClick={() => { setProfile({ ...profile, semester: s }); setError(''); }}
                  className={`p-10 border-4 font-bold uppercase text-center transition-all ${profile.semester === s ? 'bg-black text-white border-black' : 'bg-white border-black hover:bg-gray-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-6 text-[10px] text-red-600 font-black uppercase tracking-widest flex items-center gap-2">
              <AlertTriangle size={14} /> {error}
            </p>
          )}

          <div className="mt-12 flex justify-between gap-4">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className={`px-8 py-3 border-4 border-black font-black uppercase tracking-widest transition-all ${step === 1 ? 'opacity-20 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
            >
              [← BACK]
            </button>
            <button
              onClick={handleNext}
              className="flex-1 bg-black text-white px-8 py-3 border-4 border-black font-black uppercase tracking-widest transition-all hover:bg-gray-900 flex items-center justify-center gap-2"
            >
              {step === 3 ? 'START USING SANKALAN' : 'NEXT'} {step < 3 ? '→' : <Sparkles size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Auth Component ---

const AuthPage: React.FC<{ mode: AuthMode; setMode: (mode: AuthMode) => void; onSuccess: () => void; onAdminAuth: () => void; onClubAuth: () => void; onAdminPortal: () => void }> = ({ mode, setMode, onSuccess, onAdminAuth, onClubAuth, onAdminPortal }) => {
  const [email, setEmail] = useState(''); // Kept for consistency if needed later, though Clerk handles student auth
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock Admin Credentials
    setTimeout(() => {
      if (username === 'admin' && password === 'admin123') {
        onAdminAuth();
      } else {
        setError('INVALID CREDENTIALS');
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row pt-16">
      {/* Left Panel: Branding */}
      <div className="md:w-1/2 bg-dots border-r-4 border-black flex flex-col items-center justify-center p-12 text-center md:text-left">
        <div className="max-w-md">
          <GraduationCap size={80} className="mb-6 mx-auto md:mx-0" />
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">SANKALAN</h1>
          <p className="text-2xl font-bold uppercase tracking-widest mb-10 leading-tight">
            YOUR EXAM SUCCESS,<br />COMPILED INTELLIGENTLY
          </p>
          <div className="space-y-4 font-black uppercase tracking-wider">
            <div className="flex items-center gap-3"><CheckCircle2 size={20} /> 500+ PYQs Organized</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={20} /> AI-Powered Mock Tests</div>
            <div className="flex items-center gap-3"><CheckCircle2 size={20} /> Smart Study Plans</div>
          </div>
        </div>
      </div>

      {/* Right Panel: Content */}
      <div className="md:w-1/2 bg-white flex flex-col items-center justify-center p-6 md:p-12 relative text-left">

        {mode === 'admin-login' ? (
          // --- ADMIN LOGIN FORM ---
          <div className="w-full max-w-md animate-in fade-in slide-in-from-right duration-300">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
              <div className="absolute -top-6 left-0 bg-black text-white px-2 py-1 text-xs font-black uppercase tracking-widest">
                Restricted Area
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
                <Lock size={28} /> Admin Access
              </h2>

              <form onSubmit={handleAdminSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">User ID</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border-2 border-black font-bold uppercase focus:outline-none focus:bg-gray-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="ADMIN"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest mb-2">Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border-2 border-black font-bold focus:outline-none focus:bg-gray-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    placeholder="••••••••"
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border-2 border-red-600 p-2 flex items-center gap-2">
                    <AlertTriangle size={16} className="text-red-600" />
                    <span className="text-red-800 font-bold uppercase text-xs">{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-4 font-black uppercase tracking-[0.2em] border-2 border-black hover:bg-gray-900 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? <span className="animate-pulse">VERIFYING...</span> : 'ACCESS DASHBOARD'}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t-2 border-black text-center">
                <button onClick={() => setMode('signin')} className="text-xs font-bold uppercase hover:underline text-gray-500 flex items-center justify-center gap-2 mx-auto">
                  <ArrowLeft size={12} /> Back to Student Login
                </button>
              </div>
            </div>
          </div>
        ) : (
          // --- STUDENT CLERK LOGIN ---
          <div className="w-full max-w-md flex flex-col items-center gap-6 animate-in fade-in slide-in-from-left duration-300">
            {mode === 'signin' ? (
              <>
                <SignIn
                  appearance={{
                    variables: {
                      colorPrimary: '#000000',
                      colorText: '#000000',
                      colorBackground: '#ffffff',
                      colorInputBackground: '#ffffff',
                      colorInputText: '#000000',
                      fontFamily: 'inherit',
                      borderRadius: '0px',
                    },
                    elements: {
                      card: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rounded-none bg-white",
                      headerTitle: "font-black uppercase tracking-tighter text-2xl",
                      headerSubtitle: "font-bold uppercase tracking-widest opacity-60 text-xs",
                      socialButtonsBlockButton: "border-2 border-black font-bold uppercase hover:bg-gray-50 rounded-none text-xs",
                      formButtonPrimary: "bg-black hover:bg-gray-900 text-white font-black uppercase tracking-widest border-4 border-black rounded-none shadow-none text-xs py-3",
                      footerActionLink: "text-black font-bold hover:underline",
                      footer: "hidden",
                      formFieldInput: "border-2 border-black rounded-none font-bold shadow-none",
                      formFieldLabel: "uppercase font-bold tracking-widest text-[10px]",
                      dividerLine: "bg-black h-[1px]",
                      dividerText: "font-bold uppercase text-[10px] tracking-widest bg-white px-2 text-black",
                      identityPreviewEditButton: "text-black font-bold hover:underline",
                      formFieldWarningText: "text-xs font-bold text-red-600 uppercase",
                      formFieldErrorText: "text-xs font-bold text-red-600 uppercase"
                    }
                  }}
                  signUpUrl="#"
                  forceRedirectUrl="/"
                />
                <div className="w-full mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <div className="flex gap-2">
                    <span>New user?</span>
                    <button onClick={() => setMode('signup')} className="font-black hover:underline">Create Account</button>
                  </div>
                  <button onClick={onAdminPortal} className="flex items-center gap-1 text-gray-400 hover:text-black transition-colors">
                    <Lock size={10} /> Admin Portal
                  </button>
                </div>
              </>
            ) : (
              <>
                <SignUp
                  appearance={{
                    variables: {
                      colorPrimary: '#000000',
                      colorText: '#000000',
                      colorBackground: '#ffffff',
                      colorInputBackground: '#ffffff',
                      colorInputText: '#000000',
                      fontFamily: 'inherit',
                      borderRadius: '0px',
                    },
                    elements: {
                      card: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-black rounded-none bg-white",
                      headerTitle: "font-black uppercase tracking-tighter text-2xl",
                      headerSubtitle: "font-bold uppercase tracking-widest opacity-60 text-xs",
                      socialButtonsBlockButton: "border-2 border-black font-bold uppercase hover:bg-gray-50 rounded-none text-xs",
                      formButtonPrimary: "bg-black hover:bg-gray-900 text-white font-black uppercase tracking-widest border-4 border-black rounded-none shadow-none text-xs py-3",
                      footerActionLink: "hidden",
                      footer: "hidden",
                      formFieldInput: "border-2 border-black rounded-none font-bold shadow-none",
                      formFieldLabel: "uppercase font-bold tracking-widest text-[10px]",
                      dividerLine: "bg-black h-[1px]",
                      dividerText: "font-bold uppercase text-[10px] tracking-widest bg-white px-2 text-black",
                      identityPreviewEditButton: "text-black font-bold hover:underline",
                      alertText: "text-red-600 font-bold",
                      formFieldWarningText: "text-xs font-bold text-red-600 uppercase",
                      formFieldErrorText: "text-xs font-bold text-red-600 uppercase"
                    }
                  }}
                  signInUrl="#"
                  forceRedirectUrl="/"
                />
                <div className="w-full mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest px-1">
                  <div className="flex gap-2">
                    <span>Has account?</span>
                    <button onClick={() => setMode('signin')} className="font-black hover:underline">Sign In</button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Landing Page Sections ---

const Navbar: React.FC<{ onAuth: (mode: AuthMode) => void; isAuthPage?: boolean; isOnboarding?: boolean; onBack: () => void; onAdminClick: () => void }> = ({ onAuth, isAuthPage, isOnboarding, onBack, onAdminClick }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b-4 border-black py-2">
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <GraduationCap className="w-8 h-8" strokeWidth={3} />
          <span className="text-3xl font-black uppercase tracking-tighter">Sankalan</span>
        </div>
        {!isAuthPage && !isOnboarding && (
          <div className="hidden md:flex items-center gap-6">
            {['Browse PYQs', 'Study Materials', 'AI Tools', 'About'].map((item) => (
              <button key={item} onClick={() => onAuth('signin')} className="text-sm font-bold uppercase hover:bg-black hover:text-white px-2 py-1 transition-colors">
                {item}
              </button>
            ))}
            <button onClick={onAdminClick} className="text-sm font-bold uppercase hover:bg-black hover:text-white px-2 py-1 transition-colors text-gray-500">
              Admin
            </button>
          </div>
        )}
        <div className="flex items-center gap-3">
          {isOnboarding ? (
            <span className="text-xs font-black uppercase tracking-widest">Setup in progress...</span>
          ) : isAuthPage ? (
            <button onClick={onBack} className="flex items-center gap-2 text-sm font-bold uppercase px-3 hover:bg-black hover:text-white transition-colors py-1">
              <ArrowLeft size={16} /> Back
            </button>
          ) : (
            <>
              <button onClick={() => onAuth('signin')} className="text-sm font-bold uppercase px-3">Login</button>
              <button onClick={() => onAuth('signup')} className="retro-btn bg-black text-white px-4 py-1 text-sm font-bold uppercase">Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

import { motion } from 'framer-motion';

const HeroSection: React.FC<{ onAuth: (mode: AuthMode) => void; onDemo: () => void }> = ({ onAuth, onDemo }) => {
  return (
    <section className="bg-dots pt-16 pb-20 px-4 min-h-screen flex relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">

          {/* Left Column: Content */}
          <div className="text-left space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform -rotate-1 inline-block">
                <p className="text-xl md:text-2xl font-black uppercase leading-tight">
                  <span className="bg-gray-200 px-1">WE USE</span> TOO MANY DAMN<br />
                  <span className="bg-gray-200 px-1">BOOKS.</span> LET'S JUST NOT.
                </p>
              </div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter uppercase"
            >
              ACE YOUR EXAMS WITH<br />
              <span className="text-stroke-2 text-transparent bg-clip-text bg-black">AI-POWERED</span><br />
              PREPARATION
            </motion.h1>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <div className="h-2 w-12 bg-black"></div>
              <span className="text-xl font-bold uppercase tracking-widest bg-black text-white px-4 py-1">FOR MIT-ADT STUDENTS</span>
            </motion.div>

            <motion.div
              className="flex flex-wrap gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {['500+ PYQS ORGANIZED', 'AI MOCK TESTS', 'STUDY PLANS'].map((tag, i) => (
                <motion.span
                  key={i}
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                  className="border-2 border-black px-4 py-2 font-black uppercase rounded-full hover:bg-black hover:text-white transition-colors cursor-pointer text-sm"
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 -mt-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAuth('signup')}
                className="bg-black text-white py-4 px-8 text-xl font-black border-4 border-black hover:bg-white hover:text-black transition-all flex items-center justify-center gap-3 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]"
              >
                ORGANIZE MY CHAOS <ArrowRight strokeWidth={3} />
              </motion.button>

              <div className="relative group">
                <button onClick={() => onAuth('signup')} className="bg-white text-black py-4 px-8 text-xl font-black border-4 border-black hover:bg-gray-50 transition-colors bg-stripes flex items-center gap-2 group-hover:translate-x-1 group-hover:translate-y-1 transition-transform">
                  TRY DEMO NOW
                </button>
                <div className="absolute top-full left-0 w-full text-center mt-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold uppercase text-gray-500">No Sign-up Required</div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Stats & Visuals */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative hidden lg:block"
          >
            {/* Brutalist Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-32 h-32 border-4 border-black bg-yellow-300 z-0"></div>
            <div className="absolute top-1/2 -left-12 w-24 h-24 bg-gray-200 rounded-full border-4 border-black z-0"></div>

            <div className="bg-white border-4 border-black p-8 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10 w-full max-w-md mx-auto">
              <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-6">
                <span className="font-black uppercase text-xl">LIVE STATS</span>
                <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-gray-500 font-bold uppercase text-xs mb-1">Total Resources</div>
                    <div className="text-5xl font-black tracking-tighter">2.5K+</div>
                  </div>
                  <BookOpen size={32} strokeWidth={2.5} />
                </div>

                <div className="w-full bg-gray-200 h-4 border-2 border-black rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-black"
                  ></motion.div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t-4 border-black">
                  <div>
                    <div className="text-gray-500 font-bold uppercase text-xs">Active Students</div>
                    <div className="text-3xl font-black">1.2K</div>
                  </div>
                  <div>
                    <div className="text-gray-500 font-bold uppercase text-xs">Lecture Notes</div>
                    <div className="text-3xl font-black">300+</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Paper Card Decoration */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-4 bg-white border-4 border-black p-4 w-40 shadow-lg rotate-6 z-20"
            >
              <div className="w-8 h-8 bg-black mb-2 flex items-center justify-center text-white font-bold">A+</div>
              <div className="h-2 w-full bg-gray-200 mb-1"></div>
              <div className="h-2 w-2/3 bg-gray-200"></div>
            </motion.div>
          </motion.div>

        </div>
      </div>

      {/* Admin Portal Quick Link */}
      <a
        onClick={(e) => { e.preventDefault(); onAuth('admin-login'); }}
        href="/admin-portal"
        className="absolute bottom-4 right-4 text-sm text-gray-400 hover:text-black transition flex items-center gap-2 font-bold uppercase tracking-widest z-50 cursor-pointer"
      >
        👨‍💼 Admin Portal →
      </a>
    </section >
  );
};

const ProblemSection: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
      className="py-24 bg-white"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ y: 50 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="border-4 border-black p-8 md:p-12 relative bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex items-center gap-3 mb-8">
            <span className="text-3xl">⚠</span>
            <span className="text-lg font-bold uppercase tracking-[0.3em] bg-black text-white px-2">THE BAD NEWS</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mb-8 leading-tight">
            EXAMS ARE THE CRUTCH OF THE INARTICULATE STUDENT.
          </h2>

          <p className="text-xl font-bold mb-8 uppercase text-gray-700">
            WHILE THERE ARE GENUINE USES FOR STUDYING, MANY RESOURCES ARE...
          </p>

          <div className="bg-gray-50 border-4 border-black p-8 mb-10">
            <ul className="space-y-4">
              {[
                "PYQs scattered across 10+ WhatsApp groups",
                "No organized study materials by subject",
                "Unsure which topics appear most in exams",
                "Wasting hours organizing instead of studying",
                "No way to test if you're exam-ready"
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-4 text-lg font-bold uppercase"
                >
                  <div className="w-3 h-3 bg-black mt-2 flex-shrink-0"></div>
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="text-center">
            <motion.span
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-4xl block mb-2"
            >
              ↓
            </motion.span>
            <p className="text-2xl font-black uppercase bg-black text-white inline-block px-4 py-2 transform -rotate-1">
              EASILY REPLACED WITH SANKALAN
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

const SolutionSection: React.FC = () => {
  const features = [
    { icon: "📚", title: "500+ PYQS", desc: "Organized by Branch & Sem" },
    { icon: "🤖", title: "AI MOCK TESTS", desc: "Real exam patterns generated" },
    { icon: "📊", title: "STUDY PLANS", desc: "Custom schedules for you" },
    { icon: "👥", title: "STUDY ROOMS", desc: "Collaborate with peers" },
    { icon: "🔥", title: "15-DAY STREAK", desc: "Track consistency daily" },
    { icon: "⚡", title: "REAL-TIME SEARCH", desc: "Find any topic instantly" }
  ];

  return (
    <section className="py-24 bg-white relative">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <Lightbulb size={32} />
          <span className="text-sm font-bold uppercase tracking-[0.3em]">THE ARSENAL</span>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.1 }
            }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {features.map((item, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 50 },
                visible: { opacity: 1, y: 0 }
              }}
              whileHover={{ y: -8, boxShadow: "12px 12px 0px 0px rgba(0,0,0,1)" }}
              className="group bg-white border-4 border-black p-8 flex flex-col items-center text-center gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 hover:bg-black hover:text-white cursor-pointer"
            >
              <div className="text-6xl mb-2 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
              <h3 className="text-2xl font-black uppercase tracking-tighter leading-none">{item.title}</h3>
              <div className="h-1 w-12 bg-black group-hover:bg-white transition-colors"></div>
              <p className="text-sm font-bold uppercase leading-relaxed opacity-70 group-hover:opacity-100">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};


const HowItWorks: React.FC = () => {
  return (
    <section className="py-24 bg-dots px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-black uppercase tracking-tighter flex items-center gap-4 justify-center md:justify-start"
          >
            <span className="text-4xl">⚡</span> HOW SANKALAN WORKS
          </motion.h2>
          <div className="h-1 bg-black w-full max-w-xs mt-2 mx-auto md:mx-0"></div>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8"
        >
          {[
            { num: '1', title: 'SIGN UP', sub: 'Google Auth in 30 sec' },
            { num: '2', title: 'SELECT', sub: 'Branch & Sem (CSE,S5)' },
            { num: '3', title: 'ACCESS', sub: '500+ PYQs organized' }
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
              className="bg-white border-4 border-black p-8 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-default"
            >
              <span className="text-4xl font-black mb-2">{step.num}</span>
              <h3 className="text-xl font-black uppercase mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 font-bold uppercase">{step.sub}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } }
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            { num: '4', title: 'PRACTICE', sub: 'AI calculates tests' },
            { num: '5', title: 'IMPROVE', sub: 'Track weak topics' },
            { num: '6', title: 'ACE EXAMS', sub: '95% success rate' }
          ].map((step, i) => (
            <motion.div
              key={i}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -5 }}
              className="bg-white border-4 border-black p-8 flex flex-col items-center text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] cursor-default"
            >
              <span className="text-4xl font-black mb-2">{step.num}</span>
              <h3 className="text-xl font-black uppercase mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600 font-bold uppercase">{step.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesGrid: React.FC = () => (
  <section className="py-24 bg-white">
    <div className="container mx-auto px-4 max-w-5xl">
      <div className="flex items-center gap-3 mb-6">
        <Target size={32} />
        <span className="text-sm font-bold uppercase tracking-[0.3em]">Getting Results</span>
      </div>
      <div className="bg-black text-white p-4 inline-block mb-12">
        <h2 className="text-4xl font-black uppercase tracking-tighter">Academic Preparation Done Right</h2>
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        {[
          { icon: <Target />, title: "DO: Easy Filter", desc: "Find any paper in 2 clicks. Filter by year, sem, or difficulty." },
          { icon: <Zap />, title: "DO: Single Purpose", desc: "No fluff. Just the resources you need to pass the exam." },
          { icon: <BarChart3 />, title: "DO: Keep it Short", desc: "AI summaries provide context without wasting time." },
          { icon: <Trophy />, title: "DO: Mobile First", desc: "Optimized for study sessions during your commute." },
          { icon: <Cpu />, title: "DO: AI Prediction", desc: "Leverage patterns to see what's coming next." },
          { icon: <Users />, title: "DO: Verified", desc: "Crowd-sourced solutions verified by top students." }
        ].map((item, i) => (
          <motion.div
            key={i}
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="p-8 border-b-4 border-black last:border-b-0 md:even:border-l-4 lg:even:border-l-0 lg:[&:nth-child(3n+2)]:border-l-4 lg:[&:nth-child(3n)]:border-l-4 group hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 border-2 border-black group-hover:rotate-12 transition-transform">
                {item.icon}
              </div>
              <h4 className="text-xl font-black uppercase tracking-tighter">{item.title}</h4>
            </div>
            <p className="text-xs font-bold uppercase leading-relaxed opacity-70">{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

const ResultsSection: React.FC<{ onAuth: (mode: AuthMode) => void }> = ({ onAuth }) => {
  const [ref, isVisible] = useIntersectionObserver();
  const studentsCount = useCountUp(500, 2000, isVisible);
  const pyqsCount = useCountUp(2000, 2000, isVisible);
  const successRate = useCountUp(95, 2000, isVisible);

  return (
    <section ref={ref as any} className={`bg-stripes-inverted py-32 px-4 border-b-4 border-black relative overflow-hidden animate-reveal ${isVisible ? 'visible' : ''}`}>
      {/* Diagonal Overlay */}
      <div className="absolute inset-0 bg-white/90 transform -skew-y-3 scale-110 z-0 border-y-4 border-black"></div>

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        <div className="flex justify-center mb-6">
          <span className="text-6xl animate-pulse">🎯</span>
        </div>

        <p className="text-xl md:text-2xl font-black uppercase mb-6 tracking-widest text-gray-800">
          CHAOS SOLVED. CONQUERED. STUDENTS EMPOWERED.
        </p>

        <div className="bg-black text-white p-8 inline-block mb-12 transform rotate-1 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] border-4 border-white">
          <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none">
            "WHY DOES THIS HAVE TO BE<br />A MANUAL EFFORT?"
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-4 border-black p-8 flex flex-col items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[150px]">
            <span className="text-5xl font-black tracking-tighter mb-2">{studentsCount}+</span>
            <div className="h-1 w-16 bg-black mb-2"></div>
            <span className="text-sm font-black uppercase">STUDENTS JOINED</span>
          </div>

          <div className="bg-white border-4 border-black p-8 flex flex-col items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[150px]">
            <span className="text-5xl font-black tracking-tighter mb-2">{pyqsCount.toLocaleString()}+</span>
            <div className="h-1 w-16 bg-black mb-2"></div>
            <span className="text-sm font-black uppercase">PYQS ACCESSED WEEKLY</span>
          </div>

          <div className="bg-white border-4 border-black p-8 flex flex-col items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[150px]">
            <span className="text-5xl font-black tracking-tighter mb-2">{successRate}%</span>
            <div className="h-1 w-16 bg-black mb-2"></div>
            <span className="text-sm font-black uppercase">SUCCESS RATE</span>
          </div>
        </div>

        <button onClick={() => onAuth('signup')} className="retro-btn bg-black text-white text-3xl font-black py-6 px-16 uppercase glitch-hover mb-8">
          JOIN SANKALAN NOW →
        </button>

        <p className="text-red-600 font-bold uppercase tracking-widest text-sm animate-pulse">
          ⏰ NEXT EXAMS IN 15 DAYS - START PREPARING TODAY
        </p>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-black text-white py-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold uppercase tracking-[0.4em]">
      <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
        <span className="hover:text-gray-400 cursor-pointer">Pixels by Sankalan</span>
        <span>•</span>
        <span className="hover:text-gray-400 cursor-pointer">Download Archive</span>
        <span>•</span>
        <span className="hover:text-gray-400 cursor-pointer">Study Fonts</span>
        <span>•</span>
        <span className="hover:text-gray-400 cursor-pointer">Totally Tracker Free</span>
      </div>
      <div>
        Made with <span className="text-red-500 animate-pulse inline-block">♥</span> for MIT-ADT Students
      </div>
    </div>
  </footer>
);

export default function App() {
  // Club Portal State
  const [clubId, setClubId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Custom loader active for initial load
  const [isNavigating, setIsNavigating] = useState(false); // Quick loader for dashboard navigation
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user_profile');
    return saved ? JSON.parse(saved) : {
      name: 'Guest',
      branch: '',
      year: '',
      semester: '',
      role: 'student'
    };
  });

  const [globalProfileOpen, setGlobalProfileOpen] = useState(false);
  const [globalNotifOpen, setGlobalNotifOpen] = useState(false);

  // Handle Browser Back Button & Initial Load
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        setView(event.state.view);
      }
    };
    window.addEventListener('popstate', handlePopState);

    // Initial URL Routing
    const path = window.location.pathname;
    if (path === '/admin-portal') setView('admin-portal');
    else if (path === '/dashboard') setView('dashboard');
    else if (path === '/academics') setView('academics');
    else if (path === '/club-login') setView('club-login');
    else if (path === '/events-admin-login') setView('events-admin-login');

    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Study Rooms State
  const [activeRoom, setActiveRoom] = useState<any>(null);
  const [rooms, setRooms] = useState([
    {
      id: '1',
      title: 'DBMS Marathon - Endsem Prep',
      subject: 'DBMS',
      topic: 'Normalization & Transactions',
      members: 4,
      maxMembers: 8,
      activeTime: '1h 23m',
      type: 'Collaborative' as const,
      isPomodoro: false
    },
    {
      id: '2',
      title: 'CN Silent Study - Pomodoro',
      subject: 'CN',
      topic: 'Network Layer',
      members: 2,
      maxMembers: 6,
      activeTime: '45m',
      type: 'Focus' as const,
      isPomodoro: true
    },
    {
      id: '3',
      title: 'OS Deadlock & Scheduling',
      subject: 'OS',
      topic: 'Solving PYQs from 2023',
      members: 5,
      maxMembers: 10,
      activeTime: '2h 10m',
      type: 'Doubt' as const,
      isPomodoro: false
    }
  ]);

  const handleCreateRoom = (newRoom: any) => {
    const room = { ...newRoom, id: Date.now().toString(), members: 1, activeTime: '1m' };
    setRooms([room, ...rooms]);
    setActiveRoom(room);
    setView('live-room');
  };

  const handleJoinRoom = (roomId: string) => {
    const room = rooms.find((r: any) => r.id === roomId);
    if (room) {
      setActiveRoom(room);
      setView('live-room');
    }
  };

  const handleDeleteRoom = (roomId: string) => {
    setRooms(rooms.filter((r: any) => r.id !== roomId));
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setView('study-rooms');
  };


  // Redirect to dashboard ONLY if we are in a "public" view (landing/auth)
  // This prevents the loop if we are intentionally logging out (though signOut clears isSignedIn)
  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // If user is signed in but on landing/auth/onboarding pages, redirect them appropriately
      // We check for 'landing' or 'auth' specifically to auto-redirect.
      if (view === 'landing' || view === 'auth') {
        const isProfileComplete = Boolean(profile.branch && profile.year && profile.semester);

        // Update profile name from Clerk if needed
        if (user.fullName && profile.name !== user.fullName) {
          setProfile(prev => ({ ...prev, name: user.fullName || prev.name }));
        }

        // Critical Redirect Logic
        if (isProfileComplete) {
          setView('dashboard');
        } else {
          setView('onboarding');
        }

        // Ensure loader is dismissed
        setIsLoading(false);
      }
    }
  }, [isLoaded, isSignedIn, user, view, profile.branch, profile.year, profile.semester]);

  // Handle Loader completion
  const handleLoaderComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <Loader onComplete={handleLoaderComplete} />;
  }

  // Show normal app content only after loader
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  const navigateToAuth = (mode: AuthMode) => {
    setAuthMode(mode);
    setView('auth');
    window.scrollTo(0, 0);
  };

  const navigateToLanding = () => {
    setView('landing');
    window.scrollTo(0, 0);
  };

  const handleAuthSuccess = () => {
    setProfile(prev => ({ ...prev, role: 'student' })); // Ensure role is student
    setView('onboarding');
    window.scrollTo(0, 0);
  };

  const handleAdminAuth = () => {
    setProfile({
      name: 'System Admin',
      branch: 'ADMINISTRATION',
      year: 'N/A',
      semester: 'N/A',
      role: 'admin'
    });
    setView('admin-dashboard');
    window.scrollTo(0, 0);
  }

  const handleOnboardingComplete = (updatedProfile: Partial<UserProfile>) => {
    setProfile(prev => {
      const newProfile = { ...prev, ...updatedProfile as UserProfile };
      localStorage.setItem('user_profile', JSON.stringify(newProfile));
      return newProfile;
    });
    setView('dashboard');
    window.scrollTo(0, 0);
  };

  const handleDemoSignIn = () => {
    setProfile({
      name: 'Pranav',
      branch: 'Computer Science (CSE)',
      year: '3rd Year',
      semester: 'Semester 5',
      role: 'student'
    });
    setView('onboarding');
    window.scrollTo(0, 0);
  };



  const handleSetView = (v: View) => {
    // Only trigger loader for major view changes (e.g. going to dashboard, pyqs, materials)
    // and only if we are already in a "logged in" context (dashboard-like views)
    const dashboardViews = ['dashboard', 'pyqs', 'materials', 'tools', 'about', 'profile', 'settings', 'study-rooms'];
    const isInternalNav = dashboardViews.includes(view) && dashboardViews.includes(v);

    // Update History State (so back button works)
    if (v !== view || window.location.pathname !== `/${v}`) {
      const path = v === 'landing' ? '/' : `/${v}`;
      window.history.pushState({ view: v }, '', path);
    }

    if (isInternalNav && v !== view) {
      setIsNavigating(true);
      // Short delay to show loader
      setTimeout(() => {
        setView(v);
        window.scrollTo(0, 0);
        // Small buffer to let the new view render before removing loader
        setTimeout(() => setIsNavigating(false), 500);
      }, 400);
    } else {
      setView(v);
      window.scrollTo(0, 0);
    }
  };

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('user_profile', JSON.stringify(updatedProfile));
  };




  // ... (navigateToLanding, handleAuthSuccess) ...

  const handleLogout = async () => {
    await signOut();
    setView('landing');
    setProfile(prev => ({ ...prev, name: 'Guest' })); // Reset profile
    window.scrollTo(0, 0);
  };


  return (
    <div className="min-h-screen font-mono">
      <Analytics />
      <AnimatePresence>
        {isNavigating && <DashboardLoader />}
      </AnimatePresence>

      {(view === 'landing' || view === 'auth' || view === 'onboarding') && (
        <Navbar
          onAuth={navigateToAuth}
          isAuthPage={view === 'auth'}
          isOnboarding={view === 'onboarding'}

          onBack={navigateToLanding}
          onAdminClick={() => setView('admin-portal')}
        />
      )}

      {view === 'landing' && (
        <>
          <div className="pt-20 bg-black text-white overflow-hidden py-1 border-b-4 border-black">
            <div className="animate-marquee-infinite flex hover:pause whitespace-nowrap items-center">
              {Array(10).fill("").map((_, i) => (
                <span key={i} className="mx-4 font-bold text-xs md:text-sm uppercase tracking-[0.1em] flex items-center gap-4">
                  <span>🎓 500+ PYQS ORGANIZED</span>
                  <span>●</span>
                  <span>🤖 AI-POWERED MOCK TESTS</span>
                  <span>●</span>
                  <span>📊 SMART ANALYTICS</span>
                  <span>●</span>
                  <span>✨ BUILT FOR MIT-ADT STUDENTS</span>
                  <span>●</span>
                  <span>🚀 FREE FOREVER</span>
                  <span>●</span>
                </span>
              ))}
            </div>
          </div>
          <HeroSection onAuth={navigateToAuth} onDemo={handleDemoSignIn} />
          <RetroDivider />
          <ProblemSection />
          <RetroDivider />
          <SolutionSection />
          <RetroDivider />
          <HowItWorks />
          <RetroDivider />
          <FeaturesGrid />
          <RetroDivider />
          <ResultsSection onAuth={navigateToAuth} />
          <Footer />
        </>
      )}

      {view === 'auth' && (
        <>
          <AuthPage
            mode={authMode}
            setMode={setAuthMode}
            onSuccess={handleAuthSuccess}
            onAdminAuth={handleAdminAuth}
            onClubAuth={() => {
              setClubId(null);
              setView('club-login');
            }}
            onAdminPortal={() => setView('admin-portal')}
          />
          <Footer />
        </>
      )}

      {view === 'onboarding' && (
        <>
          <OnboardingPage onComplete={handleOnboardingComplete} />
          <Footer />
        </>
      )}



      {view === 'dashboard' && (
        <div className="min-h-screen bg-[#F5F5F5]">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="dashboard"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <DashboardPage userName={profile.name} onNavigate={handleSetView} />
        </div>
      )}

      {view === 'academics' && (
        <div className="min-h-screen bg-white pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="academics"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <AcademicsLanding onNavigate={handleSetView} />
        </div>
      )}

      {view === 'code-arena' && (
        <div className="min-h-screen bg-white pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="code-arena"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <CodeArenaLanding onNavigate={handleSetView} />
        </div>
      )}

      {view === 'career' && (
        <div className="min-h-screen bg-white pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="career"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <CareerLanding onNavigate={handleSetView} />
        </div>
      )}

      {view === 'community' && (
        <div className="min-h-screen bg-white pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="community"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <CommunityLanding onNavigate={handleSetView} />
        </div>
      )}

      {view === 'pyqs' && (
        <PYQBrowseView profile={profile} onLogout={handleLogout} setView={handleSetView} onBack={() => handleSetView('academics')} />
      )}


      {view === 'materials' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="materials"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          {/* Main content wrapper */}
          <div className="p-4">
            <StudyMaterials profile={profile} onProfileUpdate={handleProfileUpdate} onBack={() => handleSetView('academics')} />
          </div>
        </div>
      )}

      {view === 'tools' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="tools"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <div className="py-12 px-4">
            <AITools onBack={() => handleSetView('career')} />
          </div>
        </div>
      )}

      {view === 'pathways' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="pathways"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <div className="h-[calc(100vh-80px)]">
            <RoadmapPage onBack={() => handleSetView('career')} />
          </div>
        </div>
      )}

      {view === 'about' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="about"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <div className="py-12 px-4">
            <About />
          </div>
        </div>
      )}

      {view === 'profile' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="profile"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <div className="py-12 px-4">
            <Profile profile={profile} onBack={() => handleSetView('dashboard')} onUpdate={handleProfileUpdate} />
          </div>
        </div>
      )}

      {view === 'settings' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="settings"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <div className="py-12 px-4">
            <Settings onLogout={handleLogout} onBack={() => handleSetView('dashboard')} />
          </div>
        </div>
      )}

      {view === 'study-rooms' && (
        <div className="min-h-screen bg-[#F5F5F5]">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="study-rooms"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <StudyRooms rooms={rooms} onCreateRoom={handleCreateRoom} onJoinRoom={handleJoinRoom} onDeleteRoom={handleDeleteRoom} onBack={() => handleSetView('community')} />
        </div>
      )}

      {view === 'live-room' && activeRoom && (
        <LiveRoom roomData={activeRoom} onLeave={handleLeaveRoom} />
      )}

      {view === 'calendar' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="calendar"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <CalendarPage />
        </div>
      )}

      {view === 'campus-events' && (
        <div className="min-h-screen bg-[#F5F5F5] pt-20">
          <AppNav
            profile={profile}
            onLogout={handleLogout}
            currentView="dashboard"
            setView={handleSetView}
            notifOpen={globalNotifOpen}
            setNotifOpen={setGlobalNotifOpen}
            profileOpen={globalProfileOpen}
            setProfileOpen={setGlobalProfileOpen}
          />
          <CampusEvents onBack={() => handleSetView('dashboard')} />
        </div>
      )}

      {view === 'club-login' && (
        <ClubLogin onLogin={(id) => {
          if (id === 'COORDINATOR_ACCESS') {
            setView('coordinator-dashboard');
          } else {
            setClubId(id);
            setView('club-dashboard');
          }
        }} />
      )}

      {view === 'coordinator-dashboard' && (
        <CoordinatorDashboard onLogout={() => setView('landing')} />
      )}

      {view === 'club-dashboard' && clubId && (
        <ClubDashboard
          clubId={clubId}
          onLogout={() => {
            setClubId(null);
            setView('landing');
          }}
        />
      )}

      {view === 'admin-dashboard' && (
        <AdminDashboard onLogout={handleLogout} />
      )}

      {view === 'admin-portal' && (
        <AdminPortal
          onBack={() => setView('landing')}
          onSelectAcademics={() => {
            setAuthMode('admin-login');
            setView('auth');
          }}
          onSelectEvents={() => setView('events-admin-login')}
        />
      )}

      {view === 'events-admin-login' && (
        <EventsAdminLogin
          onBack={() => setView('admin-portal')}
          onCoordinatorLogin={() => setView('coordinator-dashboard')}
          onClubLogin={(clubId) => {
            setClubId(clubId);
            setView('club-dashboard');
          }}
        />
      )}
      <Analytics />
    </div>
  );
}
