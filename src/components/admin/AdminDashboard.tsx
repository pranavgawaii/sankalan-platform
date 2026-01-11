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
    ChevronDown
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

type AdminView = 'dashboard' | 'pyqs' | 'users' | 'analytics';

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

const ACTIVITY_LOG = [
    { id: 1, time: '01:20 AM', user: 'Pranav', action: 'viewed DBMS_2024.pdf' },
    { id: 2, time: '01:15 AM', user: 'System', action: 'Drive sync: 5 new files added' },
    { id: 3, time: '01:10 AM', user: 'John', action: 'uploaded ML_Unit3_notes.pdf' },
    { id: 4, time: '12:45 AM', user: 'Dr. Smith', action: 'approved CN_Midsem_2024.pdf' },
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

// --- Reusable Components ---

const AdminButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'danger' }> = ({
    children, className = '', variant = 'primary', ...props
}) => {
    const baseStyle = "font-black uppercase tracking-widest border-2 border-black px-4 py-2 transition-all active:translate-y-1 active:translate-x-1 active:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-xs flex items-center gap-2 justify-center";
    const variants = {
        primary: "bg-black text-white hover:bg-gray-800",
        secondary: "bg-white text-black hover:bg-gray-50",
        danger: "bg-red-600 text-white border-red-800 hover:bg-red-700"
    };

    return (
        <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
            {children}
        </button>
    );
};

const StatCard: React.FC<{ label: string; value: string | number; sublabel: string }> = ({ label, value, sublabel }) => (
    <div className="bg-white border-4 border-black p-6 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors">
        <span className="text-4xl font-black tracking-tighter mb-2">{value}</span>
        <span className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1">{label}</span>
        <span className="text-[10px] font-bold uppercase tracking-wide opacity-60">{sublabel}</span>
    </div>
);

// --- Sub-Pages ---

const DashboardHome: React.FC<{ setView: (v: AdminView) => void }> = ({ setView }) => {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Overview Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard value={524} label="PYQS" sublabel="TOTAL PAPERS" />
                <StatCard value={156} label="MTLS" sublabel="STUDY NOTES" />
                <StatCard value="1,245" label="USERS" sublabel="ACTIVE STUDENTS" />
                <StatCard value="95%" label="SUCCESS" sublabel="PASS RATE" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                        <Settings size={20} /> Quick Actions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button onClick={() => setView('pyqs')} className="bg-white border-4 border-black p-6 text-left hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group">
                            <Upload size={32} className="mb-4 group-hover:-translate-y-1 transition-transform" />
                            <h4 className="text-lg font-black uppercase mb-1">UPLOAD PYQ</h4>
                            <p className="text-xs text-gray-500 font-bold uppercase">Add new paper manually or from drive</p>
                        </button>
                        <button onClick={() => alert('Syncing with Google Drive... (Mock)')} className="bg-white border-4 border-black p-6 text-left hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group">
                            <RefreshCw size={32} className="mb-4 group-hover:rotate-180 transition-transform duration-500" />
                            <h4 className="text-lg font-black uppercase mb-1">SYNC DRIVE</h4>
                            <p className="text-xs text-gray-500 font-bold uppercase">Refresh database from Google Drive</p>
                        </button>
                        <button onClick={() => alert('Opening Material Uploader...')} className="bg-white border-4 border-black p-6 text-left hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group">
                            <FileText size={32} className="mb-4 group-hover:scale-110 transition-transform" />
                            <h4 className="text-lg font-black uppercase mb-1">ADD MATERIALS</h4>
                            <p className="text-xs text-gray-500 font-bold uppercase">Upload notes & subject content</p>
                        </button>
                        <button onClick={() => setView('users')} className="bg-white border-4 border-black p-6 text-left hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all group">
                            <Users size={32} className="mb-4 group-hover:translate-x-1 transition-transform" />
                            <h4 className="text-lg font-black uppercase mb-1">MANAGE USERS</h4>
                            <p className="text-xs text-gray-500 font-bold uppercase">View and moderate user accounts</p>
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-6">
                    <h3 className="text-xl font-black uppercase tracking-widest flex items-center gap-2">
                        <Eye size={20} /> Recent Activity
                    </h3>
                    <div className="bg-white border-4 border-black p-0">
                        {ACTIVITY_LOG.map((log, i) => (
                            <div key={log.id} className="p-4 border-b-2 border-black last:border-b-0 hover:bg-gray-50">
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-black bg-black text-white px-1">{log.time}</span>
                                    <span className="text-[10px] font-bold uppercase text-gray-500">{log.user}</span>
                                </div>
                                <p className="text-xs font-bold uppercase leading-tight">{log.action}</p>
                            </div>
                        ))}
                        <button className="w-full p-3 text-xs font-black uppercase hover:bg-gray-100 flex items-center justify-center gap-2">
                            View Full Log <Users size={12} />
                        </button>
                    </div>

                    {/* Pending Approvals Mini-Widget */}
                    <div className="bg-yellow-50 border-4 border-black p-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black px-2 py-1">2 PENDING</div>
                        <h4 className="text-sm font-black uppercase mb-4 mt-2">Pending Approvals</h4>
                        <div className="space-y-3">
                            <div className="bg-white border-2 border-black p-2 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase truncate w-32">ML_2024_Q10_Sol</p>
                                    <p className="text-[8px] font-bold uppercase text-gray-500">Student Upload</p>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-green-100 border border-black"><CheckCircle2 size={12} className="text-green-600" /></button>
                                    <button className="p-1 hover:bg-red-100 border border-black"><X size={12} className="text-red-600" /></button>
                                </div>
                            </div>
                            <div className="bg-white border-2 border-black p-2 flex justify-between items-center">
                                <div>
                                    <p className="text-[10px] font-black uppercase truncate w-32">DBMS_Unit3_Notes</p>
                                    <p className="text-[8px] font-bold uppercase text-gray-500">Faculty Upload</p>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-1 hover:bg-green-100 border border-black"><CheckCircle2 size={12} className="text-green-600" /></button>
                                    <button className="p-1 hover:bg-red-100 border border-black"><X size={12} className="text-red-600" /></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ManagePYQs: React.FC = () => {
    const [showUpload, setShowUpload] = useState(false);
    const [filter, setFilter] = useState('');

    const filteredPYQs = MOCK_PYQS.filter(p =>
        p.subject.toLowerCase().includes(filter.toLowerCase()) ||
        p.type.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Manage PYQs</h2>
                    <p className="text-sm font-bold uppercase text-gray-500 tracking-widest">Database Content Control</p>
                </div>
                <div className="flex gap-4">
                    <AdminButton onClick={() => setShowUpload(true)}><Upload size={16} /> Upload New PYQ</AdminButton>
                    <AdminButton variant="secondary" onClick={() => alert('Drive Sync Initiated')}><RefreshCw size={16} /> Sync Drive</AdminButton>
                </div>
            </div>

            <div className="bg-white border-4 border-black p-4 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 border-2 border-black px-2 py-1 bg-gray-50">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase">FILTERS:</span>
                </div>
                {['BRANCH', 'SEM', 'SUBJECT', 'YEAR'].map(f => (
                    <div key={f} className="relative group">
                        <button className="text-xs font-bold uppercase flex items-center gap-1 hover:underline">
                            {f} <ChevronDown size={12} />
                        </button>
                    </div>
                ))}
                <div className="flex-1"></div>
                <div className="relative w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                    <input
                        type="text"
                        placeholder="SEARCH..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="w-full pl-9 pr-2 py-2 border-2 border-black text-xs font-bold uppercase focus:outline-none focus:bg-gray-50"
                    />
                </div>
            </div>

            <div className="overflow-x-auto border-4 border-black">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white uppercase text-xs font-black tracking-wider">
                            <th className="p-4 border-b-4 border-black w-10">✓</th>
                            <th className="p-4 border-b-4 border-black">Subject</th>
                            <th className="p-4 border-b-4 border-black">Sem</th>
                            <th className="p-4 border-b-4 border-black">Type</th>
                            <th className="p-4 border-b-4 border-black">Year</th>
                            <th className="p-4 border-b-4 border-black">Status</th>
                            <th className="p-4 border-b-4 border-black text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs font-bold uppercase">
                        {filteredPYQs.map((pyq) => (
                            <tr key={pyq.id} className="hover:bg-gray-50 border-b-2 border-gray-100 last:border-b-0">
                                <td className="p-4 border-r-2 border-black"><input type="checkbox" className="accent-black" /></td>
                                <td className="p-4">{pyq.subject}</td>
                                <td className="p-4">{pyq.semester}</td>
                                <td className="p-4">{pyq.type}</td>
                                <td className="p-4">{pyq.year}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 border border-black text-[10px] ${pyq.status === 'Published' ? 'bg-green-100' : 'bg-yellow-100'}`}>
                                        {pyq.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-1 hover:bg-blue-100 border border-black transition-colors"><Edit size={14} /></button>
                                        <button className="p-1 hover:bg-red-100 border border-black transition-colors"><Trash2 size={14} /></button>
                                        <button className="p-1 hover:bg-gray-100 border border-black transition-colors"><Eye size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 flex justify-between items-center text-xs font-black uppercase text-gray-500">
                <div className="flex gap-2">
                    <button onClick={() => alert('Delete function disabled in demo')} className="text-red-600 hover:underline flex items-center gap-1"><Trash2 size={12} /> Bulk Delete</button>
                    <button onClick={() => alert('Downloading CSV...')} className="hover:underline flex items-center gap-1"><Download size={12} /> Export CSV</button>
                </div>
                <span>Showing {filteredPYQs.length} of {MOCK_PYQS.length}</span>
            </div>

            {/* Upload Modal */}
            {showUpload && (
                <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white border-8 border-black w-full max-w-lg p-8 shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)]">
                        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-2">
                            <Upload size={24} /> Upload New PYQ
                        </h3>

                        <div className="border-4 border-dashed border-gray-300 hover:border-black p-12 mb-6 text-center cursor-pointer transition-colors group bg-gray-50">
                            <FileText size={48} className="mx-auto mb-4 text-gray-400 group-hover:text-black transition-colors" />
                            <p className="font-black uppercase text-sm mb-1">Drag PDF Here</p>
                            <p className="text-[10px] font-bold uppercase text-gray-500">or click to browse</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            <div className="p-3 bg-blue-50 border-2 border-black flex items-start gap-3">
                                <div className="bg-black text-white p-1 rounded-sm text-[10px]">AUTO</div>
                                <div>
                                    <p className="text-[10px] font-black uppercase text-blue-800">Detected from filename:</p>
                                    <p className="text-xs font-bold font-mono">CSE_SEM5_DBMS_Endsem_2024.pdf</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase">Subject</label>
                                    <input type="text" value="DBMS" className="w-full border-2 border-black p-2 text-xs font-bold uppercase" readOnly />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black uppercase">Year</label>
                                    <input type="text" value="2024" className="w-full border-2 border-black p-2 text-xs font-bold uppercase" readOnly />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <AdminButton variant="secondary" className="flex-1" onClick={() => setShowUpload(false)}>Cancel</AdminButton>
                            <AdminButton className="flex-1" onClick={() => { alert('Upload simulated'); setShowUpload(false); }}>Upload PYQ →</AdminButton>
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
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Manage Users</h2>
                    <p className="text-sm font-bold uppercase text-gray-500 tracking-widest">Role & Access Control</p>
                </div>
                <div className="flex gap-4">
                    <AdminButton onClick={() => alert('Opens User Creation Modal')}><Users size={16} /> Add User</AdminButton>
                    <AdminButton variant="secondary" onClick={() => alert('Exporting User List...')}><Download size={16} /> Export List</AdminButton>
                </div>
            </div>

            <div className="bg-white border-4 border-black p-4 mb-6 flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 border-2 border-black px-2 py-1 bg-gray-50">
                    <Filter size={14} />
                    <span className="text-[10px] font-black uppercase">FILTERS:</span>
                </div>
                <div className="relative group"><button className="text-xs font-bold uppercase flex items-center gap-1 hover:underline">ROLE <ChevronDown size={12} /></button></div>
                <div className="relative group"><button className="text-xs font-bold uppercase flex items-center gap-1 hover:underline">BRANCH <ChevronDown size={12} /></button></div>
                <div className="relative group"><button className="text-xs font-bold uppercase flex items-center gap-1 hover:underline">STATUS <ChevronDown size={12} /></button></div>
                <div className="flex-1"></div>
                <div className="relative w-full md:w-64">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
                    <input type="text" placeholder="SEARCH NAME..." className="w-full pl-9 pr-2 py-2 border-2 border-black text-xs font-bold uppercase focus:outline-none focus:bg-gray-50" />
                </div>
            </div>

            <div className="overflow-x-auto border-4 border-black bg-white">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-black text-white uppercase text-xs font-black tracking-wider">
                            <th className="p-4 border-b-4 border-black">Name</th>
                            <th className="p-4 border-b-4 border-black">Email</th>
                            <th className="p-4 border-b-4 border-black">Role</th>
                            <th className="p-4 border-b-4 border-black">Branch</th>
                            <th className="p-4 border-b-4 border-black">Status</th>
                            <th className="p-4 border-b-4 border-black text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-xs font-bold uppercase">
                        {MOCK_USERS.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 border-b-2 border-gray-100 last:border-b-0">
                                <td className="p-4 font-black">{user.name}</td>
                                <td className="p-4 normal-case text-gray-600">{user.email}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 border border-black text-[10px] ${user.role === 'Admin' ? 'bg-purple-100' : user.role === 'Faculty' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4">{user.branch}</td>
                                <td className="p-4">
                                    <span className={`flex items-center gap-1 ${user.status === 'Active' ? 'text-green-600' : 'text-red-600'}`}>
                                        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-600' : 'bg-red-600'}`}></div>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-1 hover:bg-black hover:text-white border border-black transition-all"><Edit size={14} /></button>
                                        {user.role !== 'Admin' && <button className="p-1 hover:bg-red-600 hover:text-white border border-black transition-all"><Trash2 size={14} /></button>}
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
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">System Analytics</h2>
                    <p className="text-sm font-bold uppercase text-gray-500 tracking-widest">Performance & Usage Metrics</p>
                </div>
                <div className="flex items-center gap-2 border-2 border-black px-3 py-2 bg-white">
                    <span className="text-[10px] font-black uppercase">LAST 7 DAYS</span>
                    <ChevronDown size={14} />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Daily Active Users Chart */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Users size={20} /> Daily Active Users
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={ANALYTICS_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <Tooltip
                                    contentStyle={{ border: '2px solid black', borderRadius: '0', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }}
                                    itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                                />
                                <Line type="monotone" dataKey="users" stroke="#000" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top Subjects Bar Chart */}
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <BarChart3 size={20} /> Top Performing Subjects
                    </h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={SUBJECT_PERFORMANCE}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                                <XAxis dataKey="name" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <YAxis tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ border: '2px solid black', borderRadius: '0', boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)' }} />
                                <Bar dataKey="views" fill="#000" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black text-white p-6 border-4 border-black">
                    <h4 className="text-sm font-black uppercase opacity-60 mb-2">AI Mock Tests Generated</h4>
                    <p className="text-5xl font-black tracking-tighter">1,240</p>
                    <p className="text-xs font-bold mt-4 uppercase">↑ 12% from last week</p>
                </div>
                <div className="bg-white text-black p-6 border-4 border-black">
                    <h4 className="text-sm font-black uppercase opacity-60 mb-2">Avg. Completion Rate</h4>
                    <p className="text-5xl font-black tracking-tighter">85%</p>
                    <p className="text-xs font-bold mt-4 uppercase text-green-600">Excellent Engagement</p>
                </div>
                <div className="bg-white text-black p-6 border-4 border-black">
                    <h4 className="text-sm font-black uppercase opacity-60 mb-2">Total Questions Solved</h4>
                    <p className="text-5xl font-black tracking-tighter">24.8k</p>
                    <p className="text-xs font-bold mt-4 uppercase">Across all branches</p>
                </div>
            </div>
        </div>
    );
};

// --- Main Admin Dashboard Controller ---

const AdminDashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
    const [view, setView] = useState<AdminView>('dashboard');

    return (
        <div className="min-h-screen bg-[#F0F0F0] font-mono">
            {/* Admin Navbar */}
            <nav className="sticky top-0 z-50 bg-black text-white border-b-4 border-white">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dashboard')}>
                            <div className="bg-white text-black p-1"><Settings size={20} /></div>
                            <span className="text-xl font-black uppercase tracking-tighter">SANKALAN <span className="opacity-50">ADMIN</span></span>
                        </div>

                        <div className="hidden md:flex items-center gap-1">
                            {[
                                { id: 'dashboard', label: 'DASHBOARD' },
                                { id: 'pyqs', label: 'PYQS' },
                                { id: 'users', label: 'USERS' },
                                { id: 'analytics', label: 'STATS' }
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setView(item.id as AdminView)}
                                    className={`px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${view === item.id ? 'bg-white text-black' : 'hover:bg-gray-800'}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-bold uppercase hidden sm:block opacity-60">admin@mitadt.ac.in</span>
                            <button
                                onClick={onLogout}
                                className="bg-red-600 text-white p-2 border-2 border-white hover:bg-red-700 transition-colors"
                                title="Logout"
                            >
                                <LogOut size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Dynamic Content */}
                {view === 'dashboard' && <DashboardHome setView={setView} />}
                {view === 'pyqs' && <ManagePYQs />}
                {view === 'users' && <ManageUsers />}
                {view === 'analytics' && <AnalyticsView />}
            </main>

            <footer className="text-center py-8 text-[10px] font-bold uppercase text-gray-400">
                Admin Console v1.0 • Restricted Access • Authorized Personnel Only
            </footer>
        </div>
    );
};

export default AdminDashboard;
