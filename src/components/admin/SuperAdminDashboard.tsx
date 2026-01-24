import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, Search, Eye, Edit, Trash2, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import CreateClubModal from './CreateClubModal';

interface CoordinatorDashboardProps {
    onLogout: () => void;
}

type TabType = 'dashboard' | 'clubs' | 'requests' | 'events' | 'analytics' | 'settings';

interface Stats {
    totalClubs: number;
    activeClubs: number;
    pendingRequests: number;
    totalEvents: number;
    upcomingEvents: number;
    totalRegistrations: number;
}

interface EventRequest {
    id: string;
    event_name: string;
    event_date: string;
    budget: number;
    expected_attendance: number;
    requested_by: string;
    created_at: string;
    club_name?: string;
    club_logo?: string;
}

interface Club {
    id: string;
    club_id: string;
    club_name: string;
    club_logo?: string;
    category: string;
    president_name: string;
    president_email: string;
    status: 'active' | 'inactive';
    event_count?: number;
    active_event_count?: number;
}

const CoordinatorDashboard: React.FC<CoordinatorDashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [stats, setStats] = useState<Stats>({
        totalClubs: 0,
        activeClubs: 0,
        pendingRequests: 0,
        totalEvents: 0,
        upcomingEvents: 0,
        totalRegistrations: 0
    });
    const [pendingRequests, setPendingRequests] = useState<EventRequest[]>([]);
    const [clubs, setClubs] = useState<Club[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreateClubModalOpen, setIsCreateClubModalOpen] = useState(false);
    const clubsPerPage = 5;

    useEffect(() => {
        checkAuthAndFetchData();
    }, []);

    const checkAuthAndFetchData = async () => {
        try {
            // Check authentication
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                onLogout();
                return;
            }

            // Check if user is coordinator
            const { data: coordinator } = await supabase
                .from('coordinators')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (!coordinator) {
                onLogout();
                return;
            }

            // Fetch all data
            await Promise.all([
                fetchStats(),
                fetchPendingRequests(),
                fetchClubs()
            ]);

            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
            setIsLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const [clubsRes, requestsRes, eventsRes, regsRes] = await Promise.all([
                supabase.from('clubs').select('*', { count: 'exact', head: true }),
                supabase.from('event_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                supabase.from('events').select('*', { count: 'exact', head: true }),
                supabase.from('registrations').select('*', { count: 'exact', head: true })
            ]);

            const { count: activeClubs } = await supabase
                .from('clubs')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'active');

            setStats({
                totalClubs: clubsRes.count || 0,
                activeClubs: activeClubs || 0,
                pendingRequests: requestsRes.count || 0,
                totalEvents: eventsRes.count || 0,
                upcomingEvents: Math.floor((eventsRes.count || 0) / 2),
                totalRegistrations: regsRes.count || 0
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchPendingRequests = async () => {
        try {
            const { data } = await supabase
                .from('event_requests')
                .select('*, clubs(club_name, club_logo)')
                .eq('status', 'pending')
                .order('created_at', { ascending: false })
                .limit(3);

            setPendingRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    const fetchClubs = async () => {
        try {
            const { data } = await supabase
                .from('clubs')
                .select('*')
                .order('created_at', { ascending: false });

            setClubs(data || []);
        } catch (error) {
            console.error('Error fetching clubs:', error);
        }
    };

    const filteredClubs = clubs.filter(club =>
        club.club_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedClubs = filteredClubs.slice(
        (currentPage - 1) * clubsPerPage,
        currentPage * clubsPerPage
    );

    const totalPages = Math.ceil(filteredClubs.length / clubsPerPage);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 font-['Inter']">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-['Inter']">

            {/* LEFT SIDEBAR */}
            <div className="fixed left-0 top-0 h-screen w-[260px] bg-[#FAFAFA] border-r border-gray-200 p-6 flex flex-col">

                {/* Logo */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">🎓</span>
                        <span className="text-lg font-bold font-['Space_Mono']">SANKALAN</span>
                    </div>
                    <p className="text-[11px] uppercase text-gray-500 tracking-widest font-['Space_Mono']">
                        COORDINATOR PANEL
                    </p>
                </div>

                <div className="h-px bg-gray-200 mb-5"></div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1.5">
                    {[
                        { id: 'dashboard', icon: '📊', label: 'Dashboard' },
                        { id: 'clubs', icon: '🏢', label: 'Manage Clubs' },
                        { id: 'requests', icon: '📋', label: 'Event Requests', badge: stats.pendingRequests },
                        { id: 'events', icon: '📅', label: 'All Events' },
                        { id: 'analytics', icon: '📊', label: 'Analytics' },
                        { id: 'settings', icon: '⚙️', label: 'Settings' }
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as TabType)}
                            className={`w-full h-11 px-4 rounded-lg flex items-center gap-3 text-[15px] font-medium transition-all ${activeTab === item.id
                                ? 'bg-blue-50 text-blue-600 border-l-3 border-blue-600'
                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && item.badge > 0 && (
                                <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-bold rounded-full">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </nav>

                {/* Profile Card */}
                <div className="mt-auto pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white font-bold">
                            MC
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">Main Coordinator</p>
                            <p className="text-xs text-gray-500 truncate">coordinator@...</p>
                        </div>
                    </div>
                    <div className="mb-2">
                        <span className="inline-block px-2 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase">
                            Super Admin
                        </span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="text-sm text-gray-600 hover:text-red-600 transition flex items-center gap-2"
                    >
                        <LogOut size={14} /> Logout
                    </button>
                </div>
            </div>

            {/* TOP BAR */}
            <div className="fixed top-0 left-[260px] right-0 h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between z-10">
                <div className="text-sm text-gray-500">
                    Home / <span className="text-gray-900 font-medium">Dashboard</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative p-2 text-gray-600 hover:text-gray-900 transition">
                        <Bell size={20} />
                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="ml-[260px] mt-16 p-8">

                {activeTab === 'dashboard' && (
                    <>
                        {/* OVERVIEW STATS */}
                        <div className="grid grid-cols-4 gap-6 mb-8">
                            {[
                                {
                                    icon: '🏢',
                                    value: stats.totalClubs,
                                    label: 'Total Clubs',
                                    subtext: `${stats.activeClubs} active, ${stats.totalClubs - stats.activeClubs} inactive`,
                                    trend: '↑ 2 new this month',
                                    trendColor: 'text-green-600'
                                },
                                {
                                    icon: '⏳',
                                    value: stats.pendingRequests,
                                    label: 'Pending Requests',
                                    subtext: 'Awaiting your review',
                                    trend: '↑ 3 today',
                                    trendColor: 'text-orange-600'
                                },
                                {
                                    icon: '📅',
                                    value: stats.totalEvents,
                                    label: 'Total Events',
                                    subtext: `${stats.upcomingEvents} upcoming, ${stats.totalEvents - stats.upcomingEvents} past`,
                                    trend: '↑ 5 this week',
                                    trendColor: 'text-green-600'
                                },
                                {
                                    icon: '👥',
                                    value: stats.totalRegistrations,
                                    label: 'Total Registrations',
                                    subtext: 'Across all events',
                                    trend: '↑ 45 today',
                                    trendColor: 'text-green-600'
                                }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white border-[3px] border-black p-6 h-[140px] flex flex-col justify-between"
                                >
                                    <span className="text-3xl">{stat.icon}</span>
                                    <div>
                                        <div className="text-5xl font-bold font-['Space_Mono'] text-black mb-1">
                                            {stat.value}
                                        </div>
                                        <div className="text-sm text-gray-600 mb-1">{stat.label}</div>
                                        <div className="text-xs text-gray-500">{stat.subtext}</div>
                                    </div>
                                    <div className={`text-[11px] font-medium ${stat.trendColor}`}>
                                        {stat.trend}
                                    </div>
                                </motion.div>
                            ))}
                        </div>

                        {/* PENDING REQUESTS */}
                        <div className="bg-white border-[4px] border-black p-8 mb-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold font-['Space_Mono'] uppercase">
                                    ⏳ PENDING EVENT REQUESTS
                                </h2>
                                <span className="px-3 py-1 bg-orange-500 text-white text-lg font-bold rounded">
                                    ({stats.pendingRequests})
                                </span>
                            </div>

                            {pendingRequests.length === 0 ? (
                                <div className="h-[200px] bg-gray-50 flex items-center justify-center text-gray-500">
                                    <div className="text-center">
                                        <p className="text-lg mb-2">📭</p>
                                        <p>No pending requests</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingRequests.map((request) => (
                                        <div
                                            key={request.id}
                                            className="bg-gray-50 border-2 border-gray-200 rounded-lg p-5 hover:border-blue-500 transition cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="text-base font-bold text-black mb-2">
                                                        🔥 {request.event_name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                                                            💻 {request.club_name || 'Unknown Club'}
                                                        </span>
                                                    </div>
                                                    <p className="text-[13px] text-gray-600 mb-1">
                                                        Date: {new Date(request.event_date).toLocaleDateString()} | Budget: ₹{request.budget.toLocaleString()} | {request.expected_attendance} expected
                                                    </p>
                                                    <p className="text-xs text-gray-500 italic">
                                                        Requested by {request.requested_by} on {new Date(request.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <button className="px-4 h-9 border-2 border-black bg-white text-black text-xs font-bold uppercase hover:bg-gray-50 transition">
                                                        View Details
                                                    </button>
                                                    <button className="px-4 h-9 bg-green-600 text-white text-xs font-bold uppercase hover:bg-green-700 transition">
                                                        Approve
                                                    </button>
                                                    <button className="px-4 h-9 bg-red-600 text-white text-xs font-bold uppercase hover:bg-red-700 transition">
                                                        Reject
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* QUICK ACTIONS */}
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div className="bg-white border-[3px] border-black p-8 h-[180px] flex flex-col justify-between">
                                <span className="text-5xl">🏢</span>
                                <div>
                                    <h3 className="text-xl font-bold font-['Space_Mono'] uppercase mb-2">
                                        CREATE NEW CLUB
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        Add a new club and assign president
                                    </p>
                                </div>
                                <button
                                    onClick={() => setIsCreateClubModalOpen(true)}
                                    className="w-full h-12 bg-black text-white font-bold uppercase hover:bg-white hover:text-black border-2 border-black transition"
                                >
                                    ADD CLUB
                                </button>
                            </div>

                            <div className="bg-white border-[3px] border-black p-8 h-[180px] flex flex-col justify-between">
                                <span className="text-5xl">📅</span>
                                <div>
                                    <h3 className="text-xl font-bold font-['Space_Mono'] uppercase mb-2">
                                        VIEW ALL EVENTS
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-4">
                                        See all events across all clubs
                                    </p>
                                </div>
                                <button className="w-full h-12 bg-black text-white font-bold uppercase hover:bg-white hover:text-black border-2 border-black transition">
                                    VIEW EVENTS
                                </button>
                            </div>
                        </div>

                        {/* MANAGE CLUBS TABLE */}
                        <div className="bg-white border-[4px] border-black p-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold font-['Space_Mono'] uppercase">
                                    🏢 MANAGE CLUBS
                                </h2>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Search clubs..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-[300px] h-10 pl-10 pr-4 border-2 border-gray-300 focus:border-black focus:outline-none text-sm"
                                    />
                                </div>
                            </div>

                            <table className="w-full">
                                <thead>
                                    <tr className="bg-gray-50 border-b-2 border-gray-200">
                                        <th className="text-left py-3 px-4 text-[13px] font-bold uppercase text-gray-700">Club</th>
                                        <th className="text-left py-3 px-4 text-[13px] font-bold uppercase text-gray-700">President</th>
                                        <th className="text-left py-3 px-4 text-[13px] font-bold uppercase text-gray-700">Events</th>
                                        <th className="text-left py-3 px-4 text-[13px] font-bold uppercase text-gray-700">Status</th>
                                        <th className="text-left py-3 px-4 text-[13px] font-bold uppercase text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedClubs.map((club) => (
                                        <tr key={club.id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">{club.club_logo || '🏢'}</span>
                                                    <div>
                                                        <div className="font-bold text-[15px] text-black">{club.club_name}</div>
                                                        <span className="inline-block px-2 py-0.5 bg-gray-200 text-gray-700 text-[11px] rounded-full">
                                                            {club.category}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-sm text-gray-900">{club.president_name}</div>
                                                <div className="text-[13px] text-gray-600">{club.president_email}</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="font-bold text-sm">{club.event_count || 0} events</div>
                                                <div className="text-xs text-green-600">{club.active_event_count || 0} active</div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${club.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-gray-200 text-gray-700'
                                                    }`}>
                                                    {club.status === 'active' ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="w-8 h-8 border-2 border-gray-400 text-gray-600 hover:border-gray-600 hover:scale-105 transition flex items-center justify-center">
                                                        <Eye size={16} />
                                                    </button>
                                                    <button className="w-8 h-8 border-2 border-blue-400 text-blue-600 hover:border-blue-600 hover:scale-105 transition flex items-center justify-center">
                                                        <Edit size={16} />
                                                    </button>
                                                    <button className="w-8 h-8 border-2 border-red-400 text-red-600 hover:border-red-600 hover:scale-105 transition flex items-center justify-center">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            <div className="mt-6 flex items-center justify-center gap-4">
                                <p className="text-sm text-gray-600">
                                    Showing {paginatedClubs.length} of {filteredClubs.length} clubs
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border-2 border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-sm font-medium">
                                        {currentPage} / {totalPages}
                                    </span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border-2 border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:border-black transition"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {activeTab !== 'dashboard' && (
                    <div className="bg-white border-4 border-black p-16 text-center">
                        <p className="text-2xl font-bold font-['Space_Mono'] uppercase mb-4">
                            {activeTab.toUpperCase()} SECTION
                        </p>
                        <p className="text-gray-600">This section is under construction</p>
                    </div>
                )}
            </div>

            {/* Create Club Modal */}
            <CreateClubModal
                isOpen={isCreateClubModalOpen}
                onClose={() => setIsCreateClubModalOpen(false)}
                onSuccess={() => {
                    fetchClubs();
                    fetchStats();
                }}
            />
        </div>
    );
};

export default CoordinatorDashboard;
