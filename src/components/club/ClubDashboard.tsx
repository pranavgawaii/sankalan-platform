import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Calendar, Users, LogOut, Plus, Trash2, Shield, MapPin, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchEvents, addEvent, deleteEvent, fetchRegistrations, CalendarEvent, Registration, fetchClubs, Club } from '../../lib/firestoreService';

interface ClubDashboardProps {
    clubId: string;
    onLogout: () => void;
}

const ClubDashboard: React.FC<ClubDashboardProps> = ({ clubId, onLogout }) => {
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [clubInfo, setClubInfo] = useState<Club | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'registrations'>('overview');

    // New Event Form State
    const [showEventModal, setShowEventModal] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
        title: '',
        date: '',
        type: 'club_event',
        description: '',
        capacity: 100,
        whatsappLink: '',
        image: ''
    });

    useEffect(() => {
        loadData();
    }, [clubId]);

    const loadData = async () => {
        // MOCK DATA FALLBACK
        if (clubId === 'demo_club_id_123') {
            setClubInfo({ id: 'demo_club_id_123', name: 'Coding Club (Demo)', username: 'coding_club' });
            // Load real events or mock ones if needed, for now let's just show empty or real events that match
            const allEvents = await fetchEvents();
            // Filter by mock ID
            setEvents(allEvents.filter(e => e.clubId === clubId));
            return;
        }

        const allClubs = await fetchClubs();
        const myClub = allClubs.find(c => c.id === clubId);
        if (myClub) setClubInfo(myClub);

        const allEvents = await fetchEvents();
        const myEvents = allEvents.filter(e => e.clubId === clubId);
        setEvents(myEvents);
    };

    const handleCreateEvent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newEvent.title || !newEvent.date) return;

        await addEvent({
            ...newEvent as CalendarEvent,
            clubId: clubId, // Enforce ownership
            registeredCount: 0
        });

        setShowEventModal(false);
        setNewEvent({ title: '', date: '', type: 'club_event', capacity: 100, whatsappLink: '', image: '' });
        loadData();
    };

    const handleDeleteEvent = async (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            await deleteEvent(id);
            loadData();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] flex text-black">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-20 flex flex-col">
                <div className="p-6 border-b border-gray-100 mb-4">
                    <div className="flex items-center gap-2 text-black mb-1">
                        <Shield size={20} className="fill-black" />
                        <span className="font-black tracking-tight text-lg">CLUB PORTAL</span>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-7">{clubInfo?.name || 'Loading...'}</p>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-md transition-all ${activeTab === 'overview' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <LayoutDashboard size={16} /> Overview
                    </button>
                    <button onClick={() => setActiveTab('events')} className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-md transition-all ${activeTab === 'events' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Calendar size={16} /> My Events
                    </button>
                    <button onClick={() => setActiveTab('registrations')} className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase rounded-md transition-all ${activeTab === 'registrations' ? 'bg-black text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                        <Users size={16} /> Registrations
                    </button>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button onClick={onLogout} className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase text-red-600 hover:bg-red-50 rounded-md transition-colors">
                        <LogOut size={16} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="ml-64 flex-1 p-10">
                <header className="flex justify-between items-end mb-12 border-b border-gray-200 pb-6">
                    <div>
                        <h1 className="text-4xl font-black font-['Space_Mono'] uppercase tracking-tight mb-2">
                            {activeTab}
                        </h1>
                        <p className="text-sm text-gray-500 font-medium tracking-wide">
                            {activeTab === 'overview' ? 'Performance Summary' : activeTab === 'events' ? 'Manage Your Schedule' : 'Track Attendee List'}
                        </p>
                    </div>
                    {activeTab === 'events' && (
                        <button onClick={() => setShowEventModal(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white border border-black text-xs font-bold uppercase hover:bg-gray-800 shadow-sm">
                            <Plus size={14} /> New Event
                        </button>
                    )}
                </header>

                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-3 gap-6">
                            <div className="bg-white p-6 border border-gray-200">
                                <h3 className="text-3xl font-bold font-['Space_Mono'] mb-1">{events.length}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Events</p>
                            </div>
                            <div className="bg-white p-6 border border-gray-200">
                                <h3 className="text-3xl font-bold font-['Space_Mono'] mb-1">{events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0)}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Registrations</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'events' && (
                        <div className="grid grid-cols-1 gap-4">
                            {events.map(event => (
                                <div key={event.id} className="bg-white border border-gray-200 p-6 flex justify-between items-center group hover:border-black transition-colors">
                                    <div className="flex gap-6 items-center">
                                        <div className="w-16 h-16 flex flex-col items-center justify-center bg-gray-50 border border-gray-200 font-bold">
                                            <span className="text-xs uppercase text-gray-500">{new Date(event.date).toLocaleString('default', { month: 'short' })}</span>
                                            <span className="text-2xl">{new Date(event.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg uppercase">{event.title}</h3>
                                            <div className="flex gap-4 text-xs text-gray-500 font-medium mt-1">
                                                <span className="flex items-center gap-1"><Users size={12} /> {event.registeredCount || 0} / {event.capacity || 'Inf'} Registered</span>
                                                {event.whatsappLink && <span className="text-green-600 flex items-center gap-1">WhatsApp Active</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={() => event.id && handleDeleteEvent(event.id)} className="p-3 hover:bg-red-50 text-red-600 rounded-md transition-colors opacity-100">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                            {events.length === 0 && <p className="text-center text-gray-400 py-10 uppercase text-xs font-bold">No events created yet.</p>}
                        </div>
                    )}

                    {activeTab === 'registrations' && (
                        <div className="bg-white border border-gray-200 p-8 text-center text-gray-400">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="uppercase text-xs font-bold">Select an event to view registrations (Feature Coming Soon)</p>
                        </div>
                    )}
                </motion.div>
            </main>

            {/* CREATE EVENT MODAL */}
            {showEventModal && (
                <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-lg p-8 shadow-2xl relative border-t-4 border-black">
                        <h2 className="text-2xl font-black font-['Space_Mono'] uppercase mb-6">Create New Event</h2>
                        <form onSubmit={handleCreateEvent} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Event Title</label>
                                <input required value={newEvent.title} onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none" placeholder="Workshop Name" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Date</label>
                                    <input required type="date" value={newEvent.date} onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none" />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Capacity</label>
                                    <input type="number" value={newEvent.capacity} onChange={e => setNewEvent({ ...newEvent, capacity: parseInt(e.target.value) })} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Post Image URL</label>
                                <input value={newEvent.image} onChange={e => setNewEvent({ ...newEvent, image: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none" placeholder="https://..." />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">WhatsApp Group Link</label>
                                <input value={newEvent.whatsappLink} onChange={e => setNewEvent({ ...newEvent, whatsappLink: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 text-sm font-bold focus:border-black outline-none" placeholder="https://chat.whatsapp.com/..." />
                            </div>
                            <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
                                <button type="button" onClick={() => setShowEventModal(false)} className="flex-1 py-3 bg-white border border-gray-200 text-xs font-bold uppercase hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="flex-1 py-3 bg-black text-white text-xs font-bold uppercase hover:bg-gray-800">Publish Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClubDashboard;
