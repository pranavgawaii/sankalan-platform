import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { fetchEvents, CalendarEvent } from '../lib/firestoreService';

const CalendarPage: React.FC = () => {
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            const data = await fetchEvents();
            setEvents(data);
            setLoading(false);
        };
        load();
    }, []);

    // Calendar Helper
    const daysInMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1).getDay();

    const changeMonth = (offset: number) => {
        setDate(new Date(date.getFullYear(), date.getMonth() + offset, 1));
    };

    const getEventsForDay = (d: number) => {
        const checkDate = new Date(date.getFullYear(), date.getMonth(), d);
        return events.filter(e => {
            const eDate = new Date(e.date);
            return eDate.getDate() === d &&
                eDate.getMonth() === checkDate.getMonth() &&
                eDate.getFullYear() === checkDate.getFullYear();
        });
    };

    const renderCalendarGrid = () => {
        const days = daysInMonth(date);
        const startDay = firstDayOfMonth(date);
        const slots = [];

        // Empty slots
        for (let i = 0; i < startDay; i++) {
            slots.push(<div key={`empty-${i}`} className="h-24 bg-gray-50/50 border-r border-b border-gray-100"></div>);
        }

        // Day slots
        for (let d = 1; d <= days; d++) {
            const isToday = new Date().getDate() === d && new Date().getMonth() === date.getMonth();
            const isSelected = selectedDate.getDate() === d && selectedDate.getMonth() === date.getMonth();
            const dayEvents = getEventsForDay(d);

            slots.push(
                <div
                    key={d}
                    onClick={() => setSelectedDate(new Date(date.getFullYear(), date.getMonth(), d))}
                    className={`h-24 p-2 border-r border-b border-gray-100 cursor-pointer transition-colors relative group
                        ${isSelected ? 'bg-black text-white' : 'hover:bg-gray-50 bg-white'}
                    `}
                >
                    <span className={`text-sm font-bold ${isToday && !isSelected ? 'text-blue-600' : ''}`}>{d}</span>

                    {/* Event indicators */}
                    <div className="flex flex-wrap gap-1 mt-2">
                        {dayEvents.map((ev, i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-black'}`}
                                title={ev.title}
                            />
                        ))}
                    </div>
                </div>
            );
        }

        return slots;
    };

    const selectedEvents = events.filter(e => {
        const eDate = new Date(e.date);
        return eDate.getDate() === selectedDate.getDate() &&
            eDate.getMonth() === selectedDate.getMonth() &&
            eDate.getFullYear() === selectedDate.getFullYear();
    });

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-8 pt-24 font-['Inter']">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b-2 border-gray-200 pb-6">
                <div>
                    <h1 className="text-4xl font-black font-['Space_Mono'] uppercase tracking-tighter mb-2">Event Schedule</h1>
                    <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Follow Exams, Contests & Deadlines</p>
                </div>
                <div className="flex items-center gap-4 bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100"><ChevronLeft size={20} /></button>
                    <span className="w-40 text-center font-black uppercase text-lg">
                        {date.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Calendar Grid */}
                <div className="lg:col-span-2 bg-white border-2 border-black shadow-lg">
                    <div className="grid grid-cols-7 border-b-2 border-black bg-gray-50">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="py-3 text-center text-xs font-black uppercase text-gray-500 tracking-wider">
                                {d}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 bg-white">
                        {renderCalendarGrid()}
                    </div>
                </div>

                {/* Sidebar Details */}
                <div className="bg-black text-white p-8 h-fit shadow-[8px_8px_0px_0px_rgba(200,200,200,1)]">
                    <h3 className="text-2xl font-black uppercase font-['Space_Mono'] mb-6 flex items-center gap-2">
                        <CalendarIcon size={24} />
                        {selectedDate.toLocaleDateString('default', { month: 'short', day: 'numeric' })}
                    </h3>

                    {loading ? (
                        <div className="text-gray-500 font-mono text-xs animate-pulse">Loading events...</div>
                    ) : selectedEvents.length > 0 ? (
                        <div className="space-y-6">
                            {selectedEvents.map((ev, i) => (
                                <div key={i} className="border-l-4 border-white pl-4 py-1 group">
                                    <span className="inline-block px-2 py-0.5 bg-white/20 text-[10px] font-bold uppercase rounded-sm mb-2">
                                        {ev.type}
                                    </span>
                                    <h4 className="text-lg font-bold leading-tight mb-1">{ev.title}</h4>
                                    <p className="text-xs text-gray-400 font-mono">All Day Event</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 opacity-50">
                            <Clock size={48} className="mx-auto mb-4" />
                            <p className="text-sm font-bold uppercase">No events scheduled</p>
                        </div>
                    )}

                    <div className="mt-12 pt-6 border-t border-gray-800">
                        <h4 className="text-[10px] font-bold uppercase text-gray-500 mb-4">Upcoming Next</h4>
                        <div className="text-xs font-mono text-gray-400">
                            Check regular updates for exam schedules.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarPage;
