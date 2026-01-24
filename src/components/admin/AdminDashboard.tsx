import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Calendar,
    FileText,
    Users,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    Plus,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Trash2,
    Edit2,
    Download,
    UploadCloud,
    MonitorPlay,
    Activity,
    ChevronDown,
    Zap,
    Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import { addEvent, fetchEvents, deleteEvent, CalendarEvent } from '../../lib/firestoreService';

// --- TYPES ---
type AdminView = 'dashboard' | 'events' | 'resources' | 'users' | 'activity' | 'settings';

interface StatCardProps {
    label: string;
    value: string | number;
    trend?: string;
    trendUp?: boolean;
    icon: React.ReactNode;
}

// --- MOCK DATA ---
const ANALYTICS_DATA = [
    { name: 'Mon', users: 120, views: 450 },
    { name: 'Tue', users: 145, views: 520 },
    { name: 'Wed', users: 190, views: 650 },
    { name: 'Thu', users: 160, views: 500 },
    { name: 'Fri', users: 210, views: 720 },
    { name: 'Sat', users: 110, views: 400 },
    { name: 'Sun', users: 95, views: 350 },
];

// --- COMPONENTS ---

const StatCard: React.FC<StatCardProps> = ({ label, value, trend, trendUp, icon }) => (
    <motion.div
        whileHover={{ y: -4 }}
        className="bg-white p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
    >
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-gray-50 rounded-lg text-black">{icon}</div>
            {trend && (
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${trendUp ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {trend}
                </span>
            )}
        </div>
        <h3 className="text-3xl font-bold font-['Space_Mono'] tracking-tight mb-1">{value}</h3>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </motion.div>
);

const DashboardOverview: React.FC = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Users" value="2,543" trend="+12%" trendUp={true} icon={<Users size={20} />} />
                <StatCard label="Active Now" value="142" trend="+5%" trendUp={true} icon={<Activity size={20} />} />
                <StatCard label="Resources" value="856" trend="+24" trendUp={true} icon={<FileText size={20} />} />
                <StatCard label="Issues" value="12" trend="-4%" trendUp={true} icon={<Zap size={20} />} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white border border-gray-200 p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h3 className="font-bold text-lg font-['Space_Mono'] uppercase">Traffic Overview</h3>
                            <p className="text-xs text-gray-500 font-medium">Platform usage statistics</p>
                        </div>
                        <select className="text-xs font-bold bg-gray-50 border border-gray-200 p-2 outline-none">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>
                    <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={ANALYTICS_DATA}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#000000" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#000000" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#999" />
                                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#999" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #eee', borderRadius: '4px' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Area type="monotone" dataKey="views" stroke="#000" fillOpacity={1} fill="url(#colorUsers)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 shadow-sm flex flex-col">
                    <h3 className="font-bold text-lg font-['Space_Mono'] uppercase mb-6">Live Activity</h3>
                    <div className="flex-1 space-y-6">
                        {[
                            { user: 'Pranav G.', action: 'Uploaded "DBMS Unit 4"', time: '2m ago' },
                            { user: 'System', action: 'Automated Backup', time: '15m ago' },
                            { user: 'Sarah M.', action: 'Reported Issue #402', time: '1h ago' },
                            { user: 'Alex K.', action: 'Joined "Code Arena"', time: '2h ago' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 p-2 transition-colors rounded-sm cursor-default">
                                <div className="w-2 h-2 mt-1.5 rounded-full bg-green-500 shrink-0 animate-pulse"></div>
                                <div>
                                    <p className="text-xs font-bold uppercase text-gray-900">{item.user}</p>
                                    <p className="text-xs text-gray-500">{item.action}</p>
                                </div>
                                <span className="ml-auto text-[10px] font-mono text-gray-400">{item.time}</span>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 border border-gray-200 text-[10px] font-black uppercase hover:bg-black hover:text-white transition-all">
                        View Full Log
                    </button>
                </div>
            </div>
        </div>
    );
}

const EventManager: React.FC = () => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [newItem, setNewItem] = useState({ title: '', date: '', type: 'exam' as any });

    useEffect(() => { loadEvents(); }, []);
    const loadEvents = async () => { setEvents(await fetchEvents()); };

    const handleAdd = async () => {
        if (!newItem.title || !newItem.date) return;
        await addEvent(newItem);
        setNewItem({ title: '', date: '', type: 'exam' });
        loadEvents();
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete event?')) { await deleteEvent(id); loadEvents(); }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-200 p-8 h-fit">
                <h3 className="font-black font-['Space_Mono'] text-xl uppercase mb-6">Create Event</h3>
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Event Title</label>
                        <input
                            value={newItem.title}
                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                            type="text"
                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors"
                            placeholder="e.g. End Semester Exam"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Date</label>
                        <input
                            value={newItem.date}
                            onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                            type="date"
                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 mb-1 block">Type</label>
                        <select
                            value={newItem.type}
                            onChange={e => setNewItem({ ...newItem, type: e.target.value as any })}
                            className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors"
                        >
                            <option value="exam">Exam</option>
                            <option value="contest">Contest</option>
                            <option value="career">Career</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full bg-black text-white py-4 font-black uppercase text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} /> Publish Event
                    </button>
                </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
                {events.map(ev => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={ev.id}
                        className="bg-white border border-gray-200 p-4 flex justify-between items-center group hover:border-black transition-colors"
                    >
                        <div className="flex gap-4 items-center">
                            <div className={`w-12 h-12 flex flex-col items-center justify-center border font-bold ${ev.type === 'exam' ? 'bg-red-50 border-red-100 text-red-600' :
                                ev.type === 'contest' ? 'bg-green-50 border-green-100 text-green-600' :
                                    'bg-gray-50 border-gray-200 text-gray-600'
                                }`}>
                                <span className="text-[10px] uppercase leading-none">{new Date(ev.date).toLocaleString('default', { month: 'short' })}</span>
                                <span className="text-xl leading-none">{new Date(ev.date).getDate()}</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm uppercase">{ev.title}</h4>
                                <p className="text-xs text-gray-500 font-medium capitalize">{ev.type} Event</p>
                            </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-gray-100 text-gray-600"><Edit2 size={16} /></button>
                            <button onClick={() => ev.id && handleDelete(ev.id)} className="p-2 hover:bg-red-50 text-red-600"><Trash2 size={16} /></button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};



const ResourceManager: React.FC = () => (
    <div className="bg-white border border-gray-200 min-h-[400px] flex items-center justify-center flex-col text-gray-400">
        <UploadCloud size={48} className="mb-4 opacity-50" />
        <h3 className="font-black uppercase text-sm mb-2">Resource Management</h3>
        <p className="text-xs max-w-xs text-center mb-6">Manage PYQs, Notes, and Roadmaps. Integration pending with storage bucket.</p>
        <button className="px-6 py-2 bg-black text-white text-xs font-bold uppercase hover:bg-gray-800">Initialize Storage</button>
    </div>
);

// --- MAIN LAYOUT ---

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [activeView, setActiveView] = useState<AdminView>('dashboard');

    const NAV_ITEMS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'events', label: 'Events & Cal', icon: Calendar },
        { id: 'resources', label: 'Resources', icon: FileText },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'activity', label: 'Live Comms', icon: MonitorPlay },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex text-black">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-black mb-1">
                        <Shield size={20} className="fill-black" />
                        <span className="font-black tracking-tight text-lg">SANKALAN</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] pl-7">Admin Console</p>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id as AdminView)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-md transition-all ${activeView === item.id
                                ? 'bg-black text-white shadow-md'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                }`}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="ml-64 flex-1 p-10">
                {/* HEADER */}
                <header className="flex justify-between items-end mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-black font-['Space_Mono'] uppercase tracking-tight mb-2">
                            {activeView.replace('-', ' ')}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium tracking-wide">
                            {activeView === 'dashboard' && 'System Overview & Analytics'}
                            {activeView === 'events' && 'Manage Schedule & Exams'}
                            {activeView === 'resources' && 'Content Database Control'}
                            {activeView === 'users' && 'Student & Faculty Directory'}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-xs font-bold uppercase hover:bg-gray-50 shadow-sm">
                            <Download size={14} /> Export Data
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-black text-xs font-bold uppercase hover:bg-gray-800 shadow-sm">
                            <Plus size={14} /> New Record
                        </button>
                    </div>
                </header>

                {/* CONTENT AREA */}
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeView === 'dashboard' && <DashboardOverview />}
                    {activeView === 'events' && <EventManager />}
                    {activeView === 'resources' && <ResourceManager />}
                    {activeView === 'users' && (
                        <div className="bg-white border border-gray-200 p-8 text-center">
                            <Users size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-bold uppercase text-sm">User Directory</h3>
                            <p className="text-xs text-gray-400">Search and manage 2,500+ student records.</p>
                        </div>
                    )}
                    {activeView === 'activity' && (
                        <div className="bg-white border border-gray-200 p-8 text-center">
                            <MonitorPlay size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="font-bold uppercase text-sm">Live Operations</h3>
                            <p className="text-xs text-gray-400">Monitor active study rooms and server health.</p>
                        </div>
                    )}

                </motion.div>
            </main>
        </div>
    );
};

export default AdminDashboard;
