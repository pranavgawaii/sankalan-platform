import React, { useState } from 'react';
import {
    Calendar,
    MapPin,
    Users,
    ArrowRight,
    CheckCircle2,
    MessageCircle,
    X,
    Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Event {
    id: string;
    title: string;
    club: string;
    category: 'Tech' | 'Cultural' | 'Workshop' | 'Sports';
    date: string;
    time: string;
    location: string;
    description: string;
    image: string;
    whatsappLink: string;
    registered: boolean;
    spotsLeft: number;
}

const MOCK_EVENTS: Event[] = [
    {
        id: '1',
        title: 'HackMIT 2026',
        club: 'Google Developer Student Club',
        category: 'Tech',
        date: 'Oct 15, 2026',
        time: '9:00 AM - 9:00 PM',
        location: 'Innovation Center',
        description: 'The biggest hackathon of the semester. Build standard-setting projects in 24 hours.',
        image: 'https://images.unsplash.com/photo-1504384308090-c54be3852f33?auto=format&fit=crop&q=80&w=800',
        whatsappLink: 'https://chat.whatsapp.com/mock-link-1',
        registered: false,
        spotsLeft: 45
    },
    {
        id: '2',
        title: 'Persona: The Cultural Fest',
        club: 'Sankalan Arts',
        category: 'Cultural',
        date: 'Nov 02, 2026',
        time: '5:00 PM Onwards',
        location: 'Main Auditorium',
        description: 'A night of music, dance, and drama. Showcasing the best talent of MIT-ADT.',
        image: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&q=80&w=800',
        whatsappLink: 'https://chat.whatsapp.com/mock-link-2',
        registered: false,
        spotsLeft: 120
    },
    {
        id: '3',
        title: 'Intro to GenAI',
        club: 'AI/ML Club',
        category: 'Workshop',
        date: 'Oct 20, 2026',
        time: '2:00 PM - 4:00 PM',
        location: 'Lab 404',
        description: 'Hands-on session on building LLM apps using Gemini and OpenAI APIs.',
        image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
        whatsappLink: 'https://chat.whatsapp.com/mock-link-3',
        registered: true,
        spotsLeft: 12
    }
];

const CampusEvents: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [events, setEvents] = useState(MOCK_EVENTS);
    const [filter, setFilter] = useState('All');
    const [registeringEvent, setRegisteringEvent] = useState<Event | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        prn: '',
        branch: 'CSE',
        year: 'TY',
        phone: ''
    });

    const handleConfirmRegistration = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API delay
        setTimeout(() => {
            setEvents(prev => prev.map(ev =>
                ev.id === registeringEvent?.id ? { ...ev, registered: true, spotsLeft: ev.spotsLeft - 1 } : ev
            ));
            setIsSubmitting(false);
            setRegisteringEvent(null);
            setFormData({ name: '', email: '', prn: '', branch: 'CSE', year: 'TY', phone: '' }); // Reset form
            alert('Registration Successful! Join the group to stay updated.');
        }, 1500);
    };

    const filteredEvents = filter === 'All' ? events : events.filter(e => e.category === filter);

    return (
        <div className="min-h-screen bg-[#FAFAFA] pt-24 px-6 pb-12 font-['Inter'] relative">
            <div className="max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-gray-200 pb-8 gap-6">
                    <div>
                        <button onClick={onBack} className="text-xs font-bold uppercase text-gray-400 hover:text-black mb-2 transition-colors">← Back to Dashboard</button>
                        <h1 className="text-4xl md:text-5xl font-black font-['Space_Mono'] uppercase tracking-tight mb-2">Campus Events</h1>
                        <p className="text-gray-500 font-medium tracking-wide">Discover workshops, fests, and club activities happening at MIT-ADT.</p>
                    </div>

                    <div className="flex gap-2 bg-white p-1 border border-gray-200 rounded-lg">
                        {['All', 'Tech', 'Cultural', 'Workshop'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 text-xs font-bold uppercase rounded-md transition-all ${filter === cat
                                        ? 'bg-black text-white shadow-sm'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* EVENTS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredEvents.map((event) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="bg-white border text-black overflow-hidden flex flex-col h-full shadow-sm hover:shadow-xl transition-all group"
                        >
                            {/* Image Header */}
                            <div className="h-48 overflow-hidden relative">
                                <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0" />
                                <div className="absolute top-4 left-4">
                                    <span className="bg-black text-white text-[10px] font-black uppercase px-2 py-1 tracking-wider">
                                        {event.category}
                                    </span>
                                </div>
                                <div className="absolute top-4 right-4">
                                    <span className="bg-white/90 backdrop-blur-sm text-black text-[10px] font-bold uppercase px-2 py-1 tracking-wider border border-black/10">
                                        {event.spotsLeft} Spots Left
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{event.club}</p>
                                        <h3 className="text-xl font-black uppercase leading-tight">{event.title}</h3>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <Calendar size={16} className="text-black" />
                                        <span>{event.date} • {event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                        <MapPin size={16} className="text-black" />
                                        <span>{event.location}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 leading-relaxed mt-4 border-t border-gray-100 pt-4">
                                        {event.description}
                                    </p>
                                </div>

                                {/* Action Buttons */}
                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    {event.registered ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-2 text-green-600 text-xs font-bold uppercase justify-center bg-green-50 py-2 rounded-sm border border-green-100">
                                                <CheckCircle2 size={16} /> Registered
                                            </div>
                                            <a
                                                href={event.whatsappLink}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center justify-center gap-2 w-full py-3 bg-[#25D366] text-white text-xs font-black uppercase hover:bg-[#128C7E] transition-colors shadow-sm"
                                            >
                                                <MessageCircle size={16} /> Join WhatsApp Group
                                            </a>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setRegisteringEvent(event)}
                                            className="flex items-center justify-center gap-2 w-full py-3 bg-black text-white text-xs font-black uppercase hover:bg-gray-800 transition-all hover:gap-3 group-hover:shadow-lg"
                                        >
                                            Register for Event <ArrowRight size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* REGISTRATION MODAL */}
            <AnimatePresence>
                {registeringEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white w-full max-w-lg shadow-2xl relative border-t-4 border-black"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-100 flex justify-between items-start">
                                <div>
                                    <h3 className="text-xl font-black uppercase font-['Space_Mono']">Event Registration</h3>
                                    <p className="text-xs text-gray-500 font-bold uppercase mt-1">Registering for: <span className="text-black">{registeringEvent.title}</span></p>
                                </div>
                                <button onClick={() => setRegisteringEvent(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Registration Form */}
                            <form onSubmit={handleConfirmRegistration} className="p-8 space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Full Name</label>
                                    <input
                                        required
                                        type="text"
                                        className="w-full border-2 border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Email Address</label>
                                        <input
                                            required
                                            type="email"
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors"
                                            placeholder="student@mitadt.ac.in"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Phone Number</label>
                                        <input
                                            required
                                            type="tel"
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors"
                                            placeholder="+91 98765 43210"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-4">
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">PRN / ID</label>
                                        <input
                                            required
                                            type="text"
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors"
                                            placeholder="12345678"
                                            value={formData.prn}
                                            onChange={e => setFormData({ ...formData, prn: e.target.value })}
                                        />
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Branch</label>
                                        <select
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors bg-white"
                                            value={formData.branch}
                                            onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                        >
                                            <option>CSE</option>
                                            <option>IT</option>
                                            <option>ECE</option>
                                            <option>MECH</option>
                                        </select>
                                    </div>
                                    <div className="col-span-1">
                                        <label className="block text-[10px] font-black uppercase text-gray-400 mb-1">Year</label>
                                        <select
                                            className="w-full border-2 border-gray-200 p-3 text-sm font-bold focus:border-black outline-none transition-colors bg-white"
                                            value={formData.year}
                                            onChange={e => setFormData({ ...formData, year: e.target.value })}
                                        >
                                            <option>FY</option>
                                            <option>SY</option>
                                            <option>TY</option>
                                            <option>Final</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        disabled={isSubmitting}
                                        type="submit"
                                        className="w-full bg-black text-white py-4 font-black uppercase text-sm tracking-wide hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Confirm Registration'}
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-gray-400 font-medium">By registering, you agree to share your details with the {registeringEvent.club}.</p>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CampusEvents;
