import React, { useState, useMemo } from 'react';
import {
    Users,
    FileText,
    BarChart3,
    Settings,
    LogOut,
    Upload,
    RefreshCw,
    Search,
    Eye,
    Edit,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    X,
    Download,
    Filter,
    MoreVertical,
    ChevronDown,
    MessageSquare,
    ExternalLink,
    Zap,
    Flag,
    ThumbsUp,
    LayoutDashboard,
    Menu,
    ChevronRight,
    Shield
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

// --- Types ---

type AdminView = 'dashboard' | 'pyqs' | 'users' | 'analytics' | 'features';

interface PYQ {
    id: string;
    subject: string;
    semester: string;
    type: 'Midsem' | 'Endsem';
    year: number;
    status: 'Published' | 'Draft';
    downloads: number;
    views: number;
}

interface User {
    id: string;
    name: string;
    email: string;
    role: 'Student' | 'Faculty' | 'Admin';
    branch: string;
    status: 'Active' | 'Inactive';
}

interface FeatureRequest {
    id: string;
    title: string;
    description: string;
    priority: 'Low' | 'Medium' | 'High';
    status: 'Pending' | 'In Progress' | 'Shipped';
    votes: number;
    author: string;
}

// --- Mock Data ---

const MOCK_PYQS: PYQ[] = [
    { id: '1', subject: 'DBMS', semester: '5', type: 'Endsem', year: 2024, status: 'Published', downloads: 120, views: 450 },
    { id: '2', subject: 'CN', semester: '5', type: 'Midsem', year: 2024, status: 'Published', downloads: 85, views: 320 },
    { id: '3', subject: 'OS', semester: '5', type: 'Endsem', year: 2023, status: 'Published', downloads: 200, views: 600 },
    { id: '4', subject: 'ML', semester: '6', type: 'Midsem', year: 2024, status: 'Draft', downloads: 0, views: 10 },
    { id: '5', subject: 'CD', semester: '6', type: 'Endsem', year: 2023, status: 'Published', downloads: 95, views: 280 },
];

const MOCK_USERS: User[] = [
    { id: '1', name: 'Pranav', email: 'pranav@mitadt.ac.in', role: 'Student', branch: 'CSE', status: 'Active' },
    { id: '2', name: 'John Doe', email: 'john@mitadt.ac.in', role: 'Student', branch: 'ECE', status: 'Active' },
    { id: '3', name: 'Dr. Smith', email: 'smith@mitadt.ac.in', role: 'Faculty', branch: 'CSE', status: 'Active' },
    { id: '4', name: 'Admin', email: 'admin@mitadt.ac.in', role: 'Admin', branch: '-', status: 'Active' },
    { id: '5', name: 'Jane Access', email: 'jane@mitadt.ac.in', role: 'Student', branch: 'IT', status: 'Inactive' },
];

const MOCK_FEATURE_REQUESTS: FeatureRequest[] = [
    { id: '1', title: 'Dark Mode for Readers', description: 'Reading PDF at night is hard. Need dark mode.', priority: 'Medium', status: 'In Progress', votes: 45, author: 'Pranav' },
    { id: '2', title: 'Syllabus Tracker', description: 'Checklist to track completion of units.', priority: 'High', status: 'Pending', votes: 120, author: 'Student A' },
    { id: '3', title: 'Professor Ratings', description: 'Rate profs anonymously.', priority: 'Low', status: 'Pending', votes: 12, author: 'Anonymous' },
];

const ACTIVITY_LOG = [
    { id: 1, time: '01:20 AM', user: 'Pranav', action: 'viewed DBMS_2024.pdf' },
    { id: 2, time: '01:15 AM', user: 'System', action: 'Drive sync: 5 new files added' },
    { id: 3, time: '01:10 AM', user: 'John', action: 'uploaded ML_Unit3_notes.pdf' },
    { id: 4, time: 'Dr. Smith', action: 'approved CN_Midsem_2024.pdf' },
];

const ANALYTICS_DATA = [
    { name: 'Mon', users: 150 },
    { name: 'Tue', users: 180 },
    { name: 'Wed', users: 200 },
    { name: 'Thu', users: 250 },
    { name: 'Fri', users: 300 },
    { name: 'Sat', users: 120 },
    { name: 'Sun', users: 90 },
];

const SUBJECT_PERFORMANCE = [
    { name: 'DBMS', views: 1245 },
    { name: 'CN', views: 980 },
    { name: 'OS', views: 850 },
    { name: 'ML', views: 600 },
];

// --- Reusable Components (Monochrome Professional) ---

const AdminButton: React.FC<{
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}> = ({ children, onClick, className = '', variant = 'primary' }) => {
    const baseStyles = "px-5 py-2.5 font-bold uppercase text-xs border-2 transition-all active:translate-y-[2px] active:shadow-none flex items-center justify-center gap-2 tracking-wide";

    const variants = {
        primary: "bg-black text-white border-black hover:bg-gray-800 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]",
        secondary: "bg-white text-black border-black hover:bg-gray-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]",
        danger: "bg-white text-red-600 border-red-600 hover:bg-red-50 shadow-[4px_4px_0px_0px_rgba(220,38,38,0.1)]",
        ghost: "bg-transparent border-transparent hover:bg-gray-100 shadow-none px-3",
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${className}`} onClick={onClick}>
            {children}
        </button>
    );
};

const StatCard: React.FC<{ value: string | number; label: string; sublabel: string }> = ({ value, label, sublabel }) => (
    <div className="p-6 border-2 border-black bg-white shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-4xl font-black tracking-tighter text-black">{value}</h3>
            <div className="p-1.5 bg-gray-100 rounded-sm">
                <BarChart3 size={16} className="text-gray-600" />
            </div>
        </div>
        <div className="space-y-1">
            <p className="text-xs font-black uppercase tracking-wider text-black">{label}</p>
            <p className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">{sublabel}</p>
        </div>
    </div>
);

// --- Sub-Components (Views) ---

const DashboardHome: React.FC<{ setView: (v: AdminView) => void }> = ({ setView }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">Overview</h2>
                <p className="text-sm text-gray-500 font-medium">System status and quick actions</p>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard value="524" label="Total PYQs" sublabel="Database Entries" />
                <StatCard value="156" label="Study Notes" sublabel="Course Materials" />
                <StatCard value="1.2k" label="Active Users" sublabel="Student Accounts" />
                <StatCard value="12" label="Pending Req." sublabel="Feature Ideas" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-gray-400">
                        <Zap size={16} /> Fast Access
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => setView('pyqs')} className="bg-white border-2 border-gray-200 p-6 text-left hover:border-black hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Upload size={64} />
                            </div>
                            <Upload size={24} className="mb-4 text-gray-700 group-hover:text-black transition-colors" />
                            <h4 className="text-sm font-black uppercase mb-1">Upload Paper</h4>
                            <p className="text-xs text-gray-500">Add PYQ to database</p>
                            <ChevronRight size={16} className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                        <button onClick={() => alert('Syncing...')} className="bg-white border-2 border-gray-200 p-6 text-left hover:border-black hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <RefreshCw size={64} />
                            </div>
                            <RefreshCw size={24} className="mb-4 text-gray-700 group-hover:text-black transition-colors" />
                            <h4 className="text-sm font-black uppercase mb-1">Sync Drive</h4>
                            <p className="text-xs text-gray-500">Refresh content list</p>
                            <ChevronRight size={16} className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                        <button onClick={() => setView('features')} className="bg-white border-2 border-gray-200 p-6 text-left hover:border-black hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <MessageSquare size={64} />
                            </div>
                            <MessageSquare size={24} className="mb-4 text-gray-700 group-hover:text-black transition-colors" />
                            <h4 className="text-sm font-black uppercase mb-1">Feature Requests</h4>
                            <p className="text-xs text-gray-500">Manage feedback</p>
                            <ChevronRight size={16} className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                        <button onClick={() => setView('users')} className="bg-white border-2 border-gray-200 p-6 text-left hover:border-black hover:shadow-md transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Users size={64} />
                            </div>
                            <Users size={24} className="mb-4 text-gray-700 group-hover:text-black transition-colors" />
                            <h4 className="text-sm font-black uppercase mb-1">User Control</h4>
                            <p className="text-xs text-gray-500">Moderate accounts</p>
                            <ChevronRight size={16} className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 text-gray-400">
                        <Eye size={16} /> Audit Log
                    </h3>
                    <div className="bg-white border-2 border-black p-0">
                        {ACTIVITY_LOG.map((log, i) => (
                            <div key={log.id} className="p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors flex gap-3 items-start">
                                <div className="mt-1 w-2 h-2 rounded-full bg-black shrink-0"></div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase text-gray-400 mb-0.5">{log.time} • {log.user}</p>
                                    <p className="text-xs font-bold leading-tight">{log.action}</p>
                                </div>
                            </div>
                        ))}
                        <button className="w-full p-3 text-[10px] font-black uppercase hover:bg-gray-50 border-t border-gray-100 text-center">View Full Log</button>
                    </div>

                    {/* Pending Approvals Mini-Widget */}
                    <div className="bg-gray-50 border-2 border-dashed border-gray-300 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-xs font-black uppercase text-gray-600">Pending Actions</h4>
                            <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm">2</span>
                        </div>
                        <div className="space-y-2">
                            <div className="bg-white border border-gray-200 p-2 flex justify-between items-center">
                                <span className="text-[10px] font-bold uppercase truncate w-32">ML_2024_Q10_Sol</span>
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-black hover:text-white border border-gray-200 transition-colors"><CheckCircle2 size={10} /></button>
                                    <button className="p-1 hover:bg-red-600 hover:text-white border border-gray-200 transition-colors"><X size={10} /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const FeatureRequestsView: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b-2 border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Feature Control</h2>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">Manage and prioritize user feedback</p>
                </div>
                <div className="flex gap-4">
                    <AdminButton onClick={() => alert('Manually add feature logic')}><Zap size={14} /> Log Request</AdminButton>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_FEATURE_REQUESTS.map((req) => (
                    <div key={req.id} className="bg-white border-2 border-gray-200 hover:border-black p-6 flex flex-col justify-between transition-all group hover:shadow-lg">
                        <div>
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border border-gray-200 ${req.priority === 'High' ? 'bg-black text-white border-black' :
                                        'bg-white text-gray-600'
                                    }`}>{req.priority}</span>
                                <span className="text-[10px] font-bold uppercase text-gray-400">{req.status}</span>
                            </div>
                            <h3 className="text-lg font-black uppercase leading-tight mb-2 group-hover:underline decoration-2 underline-offset-4">{req.title}</h3>
                            <p className="text-xs text-gray-500 mb-6 leading-relaxed font-medium">{req.description}</p>
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center"><Users size={10} /></div>
                                    <span className="text-[10px] font-bold uppercase text-gray-500">{req.author}</span>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><ThumbsUp size={10} /> {req.votes}</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-black text-white text-[10px] font-bold uppercase hover:bg-gray-800 transition-colors">Approve</button>
                                <button className="flex-1 py-2 bg-white border border-gray-200 text-black text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors">Dismiss</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ManagePYQs: React.FC = () => {
    const [showUpload, setShowUpload] = useState(false);
    const [filter, setFilter] = useState('');
    const [selectedItems, setSelectedItems] = useState<string[]>([]);

    const filteredPYQs = MOCK_PYQS.filter(p =>
        p.subject.toLowerCase().includes(filter.toLowerCase()) ||
        p.type.toLowerCase().includes(filter.toLowerCase())
    );

    const toggleSelection = (id: string) => {
        setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b-2 border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Database</h2>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">Manage Previous Year Questions</p>
                </div>
                <div className="flex gap-3">
                    <AdminButton variant="secondary" onClick={() => alert('Drive Sync Initiated')}><RefreshCw size={14} /> Sync</AdminButton>
                    <AdminButton onClick={() => setShowUpload(true)}><Upload size={14} /> Upload</AdminButton>
                </div>
            </div>

            <div className="bg-white border-2 border-black p-4 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-sm">
                    <Filter size={14} className="text-gray-500" />
                    <span className="text-[10px] font-black uppercase text-gray-500">FILTER BY:</span>
                </div>
                {['BRANCH', 'SEM', 'SUBJECT', 'YEAR'].map(f => (
                    <div key={f} className="relative group">
                        <button className="text-xs font-bold uppercase flex items-center gap-1 hover:text-gray-600 transition-colors">
                            {f} <ChevronDown size={12} />
                        </button>
                    </div>
                ))}
                <div className="flex-1"></div>
                <div className="relative w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="SEARCH PAPERS..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 border border-gray-300 text-xs font-bold uppercase focus:outline-none focus:border-black transition-colors"
                    />
                </div>
            </div>

            {selectedItems.length > 0 && (
                <div className="bg-gray-900 text-white p-3 mb-4 flex justify-between items-center animate-in slide-in-from-top-2 rounded-sm">
                    <span className="text-xs font-bold uppercase tracking-wide px-2">{selectedItems.length} selected</span>
                    <div className="flex gap-4">
                        <button className="text-[10px] font-bold uppercase hover:text-red-300 flex items-center gap-1 transition-colors"><Trash2 size={12} /> DELETE</button>
                        <button className="text-[10px] font-bold uppercase hover:text-green-300 flex items-center gap-1 transition-colors"><CheckCircle2 size={12} /> PUBLISH</button>
                    </div>
                </div>
            )}

            <div className="border border-gray-200 bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                            <th className="p-4 w-10">
                                <input
                                    type="checkbox"
                                    className="accent-black h-3.5 w-3.5 cursor-pointer"
                                    onChange={(e) => setSelectedItems(e.target.checked ? filteredPYQs.map(p => p.id) : [])}
                                    checked={selectedItems.length === filteredPYQs.length && filteredPYQs.length > 0}
                                />
                            </th>
                            <th className="p-4">Subject</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold text-gray-800">
                        {filteredPYQs.map((pyq) => (
                            <tr key={pyq.id} className={`border-b border-gray-100 last:border-b-0 transition-colors ${selectedItems.includes(pyq.id) ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
                                <td className="p-4">
                                    <input
                                        type="checkbox"
                                        className="accent-black h-3.5 w-3.5 cursor-pointer"
                                        checked={selectedItems.includes(pyq.id)}
                                        onChange={() => toggleSelection(pyq.id)}
                                    />
                                </td>
                                <td className="p-4 font-black">{pyq.subject}</td>
                                <td className="p-4 text-gray-500">Sem {pyq.semester} • {pyq.year}</td>
                                <td className="p-4">
                                    <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px] border border-gray-200">{pyq.type}</span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wide border ${pyq.status === 'Published'
                                            ? 'bg-white border-green-600 text-green-700'
                                            : 'bg-white border-yellow-500 text-yellow-700'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${pyq.status === 'Published' ? 'bg-green-600' : 'bg-yellow-500'}`}></div>
                                        {pyq.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 text-gray-400">
                                        <button className="hover:text-black transition-colors"><Edit size={14} /></button>
                                        <button className="hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                        <button className="hover:text-black transition-colors"><Download size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Upload Modal (Existing code reused) */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border-2 border-black w-full max-w-lg p-8 shadow-xl">
                        <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                            Upload Paper
                        </h3>
                        <div className="border-2 border-dashed border-gray-300 hover:border-black p-12 mb-6 text-center cursor-pointer transition-colors group bg-gray-50 rounded-sm">
                            <FileText size={32} className="mx-auto mb-4 text-gray-400 group-hover:text-black transition-colors" />
                            <p className="font-bold uppercase text-xs text-gray-600 mb-1">Drag PDF Here</p>
                        </div>
                        <div className="flex gap-4">
                            <AdminButton variant="ghost" className="flex-1" onClick={() => setShowUpload(false)}>Cancel</AdminButton>
                            <AdminButton className="flex-1" onClick={() => { alert('Upload simulated'); setShowUpload(false); }}>Confirm Upload</AdminButton>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ManageUsers: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 border-b-2 border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Users</h2>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">directory & access management</p>
                </div>
                <div className="flex gap-3">
                    <AdminButton variant="secondary" onClick={() => alert('Exporting...')}><Download size={14} /> Export</AdminButton>
                    <AdminButton onClick={() => alert('New User')}><Users size={14} /> Add User</AdminButton>
                </div>
            </div>

            <div className="bg-white border-2 border-black p-4 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 rounded-sm">
                    <Filter size={14} className="text-gray-500" />
                    <span className="text-[10px] font-black uppercase text-gray-500">FILTER BY:</span>
                </div>
                <div className="relative group"><button className="text-xs font-bold uppercase flex items-center gap-1 hover:text-gray-600 transition-colors">ROLE <ChevronDown size={12} /></button></div>
                <div className="flex-1"></div>
                <div className="relative w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="SEARCH USERS..." className="w-full pl-9 pr-2 py-2 border border-gray-300 text-xs font-bold uppercase focus:outline-none focus:border-black transition-colors" />
                </div>
            </div>

            <div className="border border-gray-200 bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 uppercase text-[10px] font-black tracking-wider border-b border-gray-200">
                            <th className="p-4">User Details</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Branch</th>
                            <th className="p-4">Status</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="text-xs font-bold text-gray-800">
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors group">
                                <td className="p-4">
                                    <div className="font-black text-sm">{user.name}</div>
                                    <div className="normal-case text-gray-500 font-medium">{user.email}</div>
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-0.5 border text-[10px] font-bold uppercase inline-flex items-center gap-1 rounded-full ${user.role === 'Admin' ? 'bg-black text-white border-black' :
                                            user.role === 'Faculty' ? 'bg-gray-100 text-black border-gray-300' : 'bg-white text-gray-500 border-gray-200'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600">{user.branch}</td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] uppercase tracking-wide border rounded-full ${user.status === 'Active'
                                            ? 'bg-white border-gray-200 text-green-700'
                                            : 'bg-white border-gray-200 text-red-700'
                                        }`}>
                                        <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1 hover:bg-black hover:text-white rounded-sm transition-colors"><Edit size={14} /></button>
                                        <button className="p-1 hover:bg-red-600 hover:text-white rounded-sm transition-colors"><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AnalyticsView: React.FC = () => {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b-2 border-gray-200 pb-6">
                <div>
                    <h2 className="text-3xl font-black uppercase tracking-tight mb-1">Metrics</h2>
                    <p className="text-sm text-gray-500 font-medium tracking-wide">System performance & usage</p>
                </div>
                <div className="flex items-center gap-4">
                    <a
                        href="https://vercel.com/dashboard"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 bg-black text-white px-4 py-2 border border-black hover:bg-gray-800 transition-colors font-bold uppercase text-xs"
                    >
                        <ExternalLink size={14} /> Open Vercel
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Active Users Chart */}
                <div className="bg-white border-2 border-black p-6">
                    <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2 text-gray-500">
                        <Users size={16} /> Daily Active Users
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ANALYTICS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#999" />
                                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#999" />
                                <Tooltip
                                    contentStyle={{ border: '2px solid black', borderRadius: '0', boxShadow: 'none' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: 'black' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#000" strokeWidth={2} dot={{ r: 3, fill: 'black' }} activeDot={{ r: 5, strokeWidth: 0 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Subjects Bar Chart */}
                <div className="bg-white border-2 border-black p-6">
                    <h3 className="text-sm font-black uppercase mb-6 flex items-center gap-2 text-gray-500">
                        <BarChart3 size={16} /> Top Subjects
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SUBJECT_PERFORMANCE}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#999" />
                                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} stroke="#999" />
                                <Tooltip cursor={{ fill: '#f9f9f9' }} contentStyle={{ border: '2px solid black', borderRadius: '0' }} />
                                <Bar dataKey="views" fill="#000" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main Admin Dashboard Controller (Sidebar Layout) ---

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [view, setView] = useState<AdminView>('dashboard');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const NAV_ITEMS = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'pyqs', label: 'PYQ Database', icon: FileText },
        { id: 'users', label: 'User Directory', icon: Users },
        { id: 'features', label: 'Feature Request', icon: MessageSquare },
        { id: 'analytics', label: 'System Stats', icon: BarChart3 }
    ];

    return (
        <div className="min-h-screen bg-[#FAFAFA] font-sans flex text-black selection:bg-black selection:text-white">
            {/* Sidebar Navigation (Desktop) */}
            <aside className="hidden md:flex w-64 flex-col border-r-2 border-black bg-white fixed h-full z-20">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-black uppercase tracking-tighter leading-none">Sankalan</h1>
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest">ADMIN CONSOLE</span>
                    </div>
                    <Shield size={20} className="text-black" />
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setView(item.id as AdminView)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 font-bold text-xs uppercase transition-all rounded-sm ${view === item.id
                                    ? 'bg-black text-white hover:bg-gray-800'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-black'
                                }`}
                        >
                            <item.icon size={16} />
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-black">
                            <span className="font-black text-xs">AD</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black uppercase truncate">Administrator</p>
                            <p className="text-[10px] font-medium text-gray-400 truncate">Super User Access</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 border border-gray-200 text-black p-2 font-bold uppercase text-xs hover:bg-gray-50 transition-colors"
                    >
                        <LogOut size={14} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full bg-white border-b border-gray-200 z-30 p-4 flex justify-between items-center shadow-sm">
                <span className="font-black uppercase tracking-tighter text-lg">Sankalan Admin</span>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 bg-white z-20 pt-20 px-4 pb-4 md:hidden flex flex-col gap-2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => { setView(item.id as AdminView); setIsMobileMenuOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-4 font-black uppercase text-sm border-b border-gray-100 ${view === item.id ? 'text-black' : 'text-gray-400'
                                }`}
                        >
                            <item.icon size={20} />
                            {item.label}
                        </button>
                    ))}
                    <button onClick={onLogout} className="mt-auto w-full bg-black text-white p-4 font-black uppercase text-sm">
                        SIGN OUT
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 p-4 md:p-10 pt-24 md:pt-10 min-h-screen overflow-x-hidden bg-[#FAFAFA]">
                <div className="max-w-6xl mx-auto">
                    {view === 'dashboard' && <DashboardHome setView={setView} />}
                    {view === 'pyqs' && <ManagePYQs />}
                    {view === 'users' && <ManageUsers />}
                    {view === 'features' && <FeatureRequestsView />}
                    {view === 'analytics' && <AnalyticsView />}
                </div>

                <footer className="text-center py-8 text-[10px] font-bold uppercase text-gray-300 mt-12">
                    System v2.1 • Authorized Access Only
                </footer>
            </main>
        </div>
    );
};

export default AdminDashboard;
