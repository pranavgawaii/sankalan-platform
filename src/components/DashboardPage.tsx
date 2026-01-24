import React from 'react';
import {
    BookOpen,
    Code2,
    Map,
    Users,
    ArrowRight,
    Terminal,
    Zap,
    TrendingUp,
    Award,
    Calendar
} from 'lucide-react';
import ActivityHeatmap from './ActivityHeatmap';

interface DashboardPageProps {
    userName?: string;
    onNavigate: (view: string) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ userName = 'Scholar', onNavigate }) => {
    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    const [selectedYear, setSelectedYear] = React.useState(2026);
    const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>([]);

    React.useEffect(() => {
        // Simple fetch of events
        import('../lib/firestoreService').then(({ fetchEvents }) => {
            fetchEvents().then(data => {
                // Filter for upcoming
                const now = new Date();
                const future = data
                    .filter(e => new Date(e.date) >= now)
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(0, 3);
                setUpcomingEvents(future);
            });
        });
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 pt-20 px-6 pb-12 font-['Inter']">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* HEADER SECTION */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-gray-400 font-mono text-xs uppercase tracking-widest mb-2">
                            <span>{currentDate}</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span className="text-green-600">v2.4.0 Online</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-black tracking-tight font-['Space_Mono'] uppercase">
                            Dashboard
                        </h1>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-bold uppercase hover:border-black transition-colors shadow-sm">
                            Feedback
                        </button>
                        <button className="px-4 py-2 bg-black text-white border border-black text-sm font-bold uppercase hover:bg-gray-800 transition-colors shadow-sm flex items-center gap-2">
                            <Zap size={14} /> Upgrade Plan
                        </button>
                    </div>
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* COLUMN 1 & 2: Main Content (2/3 width) */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* STATS ROW */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <StatBox label="Study Streak" value="12 Days" icon={<FlameIcon />} />
                            <StatBox label="Problems Solved" value="45" icon={<CodeIcon />} />
                            <StatBox label="Rank" value="#42" icon={<TrophyIcon />} />
                            <StatBox label="Focus Time" value="34h" icon={<ClockIcon />} />
                        </div>

                        {/* ACTIVITY HEATMAP (SaaS/Leetcode Style) */}
                        <div className="bg-white border border-gray-200 p-6 rounded-none shadow-sm h-auto">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-['Space_Mono'] font-bold text-lg uppercase flex items-center gap-2">
                                    <TrendingUp size={18} /> Activity Log
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Year:</span>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                                        className="text-xs font-bold bg-gray-50 border border-gray-200 px-2 py-1 rounded-sm uppercase outline-none focus:border-black transition-colors cursor-pointer"
                                    >
                                        <option value={2026}>2026</option>
                                        <option value={2025}>2025</option>
                                    </select>
                                </div>
                            </div>
                            <ActivityHeatmap year={selectedYear} />
                            <div className="mt-4 flex gap-6 text-xs text-gray-500 font-medium border-t border-gray-100 pt-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    <span>1,240 Contributions</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-black"></span>
                                    <span>Longest Streak: 18 Days</span>
                                </div>
                            </div>
                        </div>

                        {/* QUICK NAVIGATION (Bento Grid) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                            {/* Academics Hub Card */}
                            <NavCard
                                title="Academics"
                                desc="PYQs, Materials, Notes"
                                icon={<BookOpen size={24} />}
                                onClick={() => onNavigate('academics')}
                                color="bg-white"
                                accent="border-l-4 border-l-blue-500"
                            />

                            {/* Code Arena Hub Card */}
                            <NavCard
                                title="Code Arena"
                                desc="Practice, Sheets, Contests"
                                icon={<Code2 size={24} />}
                                onClick={() => onNavigate('code-arena')}
                                color="bg-white"
                                accent="border-l-4 border-l-green-500"
                            />

                            {/* Career Hub Card */}
                            <NavCard
                                title="Career Paths"
                                desc="Roadmaps, AI Tools"
                                icon={<Map size={24} />}
                                onClick={() => onNavigate('career')}
                                color="bg-white"
                                accent="border-l-4 border-l-purple-500"
                            />

                            {/* Community Hub Card */}
                            <NavCard
                                title="Community Hub"
                                desc="Events, Clubs, Study Rooms"
                                icon={<Users size={24} />}
                                onClick={() => onNavigate('community')}
                                color="bg-white"
                                accent="border-l-4 border-l-orange-500"
                            />
                        </div>

                    </div>

                    {/* COLUMN 3: Sidebar (1/3 width) */}
                    <div className="space-y-6">

                        {/* Profile / Status Card */}
                        <div className="bg-black text-white p-8 flex flex-col items-center text-center">
                            <div className="w-20 h-20 bg-gray-800 rounded-full mb-4 flex items-center justify-center border-2 border-white">
                                <span className="text-2xl font-bold">{userName.charAt(0)}</span>
                            </div>
                            <h3 className="text-xl font-bold font-['Space_Mono'] uppercase mb-1">{userName}</h3>
                            <p className="text-gray-400 text-xs uppercase tracking-widest mb-6">Pro Member</p>
                            <div className="w-full bg-gray-800 h-2 rounded-full mb-2 overflow-hidden">
                                <div className="bg-white h-full w-[70%]"></div>
                            </div>
                            <p className="text-[10px] uppercase text-gray-400 w-full flex justify-between">
                                <span>Level 5</span>
                                <span>1200 / 2000 XP</span>
                            </p>
                        </div>

                        {/* Upcoming / Notifications */}
                        <div className="bg-white border border-gray-200 p-6">
                            <h3 className="font-['Space_Mono'] font-bold text-sm uppercase mb-6 flex items-center gap-2">
                                <Calendar size={16} /> Upcoming Events
                            </h3>
                            <div className="space-y-4">
                                {upcomingEvents.length > 0 ? upcomingEvents.map((ev, i) => (
                                    <EventItem
                                        key={i}
                                        title={ev.title}
                                        date={new Date(ev.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        tag={ev.type}
                                        color={ev.type === 'exam' ? 'bg-red-100 text-red-700' : ev.type === 'contest' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-black'}
                                    />
                                )) : (
                                    <div className="text-xs text-gray-400 italic p-2 text-center">No upcoming events scheduled.</div>
                                )}
                            </div>
                            <button
                                onClick={() => onNavigate('calendar')}
                                className="w-full mt-6 py-3 border border-black text-xs font-bold uppercase hover:bg-black hover:text-white transition-colors"
                            >
                                View Calendar
                            </button>
                        </div>

                        {/* Daily Quote / Motivation */}
                        <div className="bg-yellow-50 border border-yellow-200 p-6 relative overflow-hidden">
                            <div className="absolute top-[-10px] right-[-10px] text-yellow-200">
                                <Award size={80} />
                            </div>
                            <h4 className="font-bold uppercase text-xs text-yellow-700 mb-2">Daily Insight</h4>
                            <p className="font-serif italic text-lg leading-relaxed text-yellow-900">
                                "Code is like humor. When you have to explain it, it’s bad."
                            </p>
                            <p className="text-xs font-bold mt-4 text-yellow-700">— Cory House</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Sub-Components ---

const StatBox = ({ label, value, icon }: any) => (
    <div className="bg-white p-4 border border-gray-200 flex flex-col items-start justify-between h-24 hover:border-black transition-colors group">
        <div className="text-gray-400 group-hover:text-black transition-colors mb-auto">{icon}</div>
        <div>
            <div className="text-2xl font-bold font-['Space_Mono'] leading-none mb-1">{value}</div>
            <div className="text-[10px] font-bold uppercase text-gray-500">{label}</div>
        </div>
    </div>
);

const NavCard = ({ title, desc, icon, onClick, color, accent }: any) => (
    <div
        onClick={onClick}
        className={`${color} ${accent} p-6 border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between h-40`}
    >
        <div className="flex justify-between items-start">
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-black group-hover:text-white transition-colors">
                {icon}
            </div>
            <ArrowRight size={20} className="text-gray-300 group-hover:text-black transition-colors -rotate-45 group-hover:rotate-0" />
        </div>
        <div>
            <h3 className="text-xl font-bold font-['Space_Mono'] uppercase mb-1">{title}</h3>
            <p className="text-xs text-gray-500 font-medium">{desc}</p>
        </div>
    </div>
);

const EventItem = ({ title, date, tag, color }: any) => (
    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
        <div className={`flex flex-col items-center justify-center w-10 h-10 ${color} rounded-lg shrink-0`}>
            <span className="text-[10px] font-bold uppercase">{tag.substring(0, 3)}</span>
        </div>
        <div className="flex-1">
            <h5 className="text-sm font-bold leading-tight">{title}</h5>
            <p className="text-xs text-gray-500">{date}</p>
        </div>
    </div>
);

// Icons
const FlameIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.246-2.056-2.246-2.056 .94-2.857 2.056-5.43 2.056-5.43s1.956 2.056 2.056 4.945c 0 0 1.944-.483 1.944-2.433 0 0 2.456 2.944 1.556 6.944 0 0 .5-1.5 2.944-2.444 0 0-.462 7.42-7.11 7.42 -4.316 0-7.38-4.14-5.32-8.312" /></svg>;
const CodeIcon = () => <Code2 size={20} />;
const TrophyIcon = () => <Award size={20} />;
const ClockIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;

export default DashboardPage;
