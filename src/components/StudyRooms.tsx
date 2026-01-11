
import React, { useState } from 'react';
import { Users, Clock, Plus, ArrowRight, Play, BookOpen, Mic, MicOff, Video, VideoOff, MessageSquare, X, Monitor, Smile, MoreVertical, Layout, Settings } from 'lucide-react';
import useSound from '../hooks/useSound';

// --- Types ---
interface Room {
    id: string;
    title: string;
    subject: string;
    topic: string;
    members: number;
    maxMembers: number;
    activeTime: string; // e.g., "1h 23m"
    type: 'Focus' | 'Collaborative' | 'Doubt';
    isPomodoro: boolean;
}

// --- Mock Data ---
const ACTIVE_ROOMS: Room[] = [
    {
        id: '1',
        title: 'DBMS Marathon - Endsem Prep',
        subject: 'DBMS',
        topic: 'Normalization & Transactions',
        members: 4,
        maxMembers: 8,
        activeTime: '1h 23m',
        type: 'Collaborative',
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
        type: 'Focus',
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
        type: 'Doubt',
        isPomodoro: false
    }
];

// --- Components ---

const CreateRoomModal: React.FC<{ isOpen: boolean; onClose: () => void; onJoin: (roomId: string) => void }> = ({ isOpen, onClose, onJoin }) => {
    const playClick = useSound();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black w-full max-w-lg shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)]">
                <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2"><Plus size={24} /> Create Study Room</h3>
                    <button onClick={() => { playClick(); onClose(); }}><X size={24} /></button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Room Name</label>
                        <input type="text" placeholder="e.g., DBMS Marathon - Endsem Prep" className="w-full border-2 border-black p-3 font-bold uppercase focus:outline-none focus:bg-yellow-50" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase mb-1 block">Subject</label>
                            <select className="w-full border-2 border-black p-3 font-bold uppercase cursor-pointer">
                                <option>DBMS</option>
                                <option>CN</option>
                                <option>OS</option>
                                <option>ML</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase mb-1 block">Max Members</label>
                            <div className="flex justify-between border-2 border-black p-2 bg-gray-50">
                                {[2, 4, 6, 8, 12].map(n => (
                                    <button key={n} onClick={playClick} className="w-8 h-8 flex items-center justify-center font-bold hover:bg-black hover:text-white rounded-full transition-colors text-xs">{n}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase mb-1 block">Room Type</label>
                        <div className="space-y-2">
                            {['Focus Mode (Silent, timer only)', 'Collaborative (Chat, Screen Share)', 'Doubt Solving (Q&A)'].map((t, i) => (
                                <label key={i} className="flex items-center gap-3 p-3 border-2 border-black cursor-pointer hover:bg-gray-50">
                                    <input type="radio" name="roomType" className="w-4 h-4 text-black border-2 border-black focus:ring-0" defaultChecked={i === 1} />
                                    <span className="font-bold uppercase text-xs">{t}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={() => { playClick(); onJoin('new-room'); }}
                        className="w-full py-4 bg-black text-white border-2 border-black font-black uppercase text-lg hover:bg-gray-800 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] transition-all active:translate-y-1 active:shadow-none"
                    >
                        Create Room & Join →
                    </button>
                </div>
            </div>
        </div>
    );
};

const StudyRooms: React.FC<{ onJoinRoom: (roomId: string) => void }> = ({ onJoinRoom }) => {
    const playClick = useSound();
    const [showCreateModal, setShowCreateModal] = useState(false);

    return (
        <div className="min-h-screen bg-dots pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="font-black uppercase tracking-widest text-sm text-green-600">Live Now</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter bg-white border-4 border-black p-4 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                            🎧 Live Study Rooms
                        </h1>
                        <p className="text-xl font-bold uppercase opacity-70 mt-4 md:ml-2">Study together, ace exams together.</p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => { playClick(); setShowCreateModal(true); }}
                            className="bg-black text-white px-6 py-4 font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(100,100,100,0.5)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-2"
                        >
                            <Plus size={20} /> Create Room
                        </button>
                    </div>
                </div>

                {/* Active Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {ACTIVE_ROOMS.map(room => (
                        <div key={room.id} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all group flex flex-col justify-between h-full">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black ${room.type === 'Focus' ? 'bg-purple-200' : 'bg-yellow-200'}`}>
                                        {room.type}
                                    </span>
                                    {room.isPomodoro && (
                                        <span className="text-[10px] font-black uppercase px-2 py-1 border-2 border-black bg-red-200 flex items-center gap-1">
                                            <Clock size={12} /> Pomodoro
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black uppercase mb-2 leading-tight group-hover:underline decoration-4">{room.title}</h3>
                                <p className="font-bold text-gray-500 mb-6 uppercase text-sm">Topic: {room.topic}</p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-sm font-bold uppercase">
                                        <Users size={16} />
                                        <span>{room.members}/{room.maxMembers} Members</span>
                                        <div className="flex -space-x-2 ml-2">
                                            {[...Array(Math.min(3, room.members))].map((_, i) => (
                                                <div key={i} className="w-6 h-6 rounded-full bg-gray-300 border-2 border-black"></div>
                                            ))}
                                            {room.members > 3 && <div className="w-6 h-6 rounded-full bg-black text-white border-2 border-black flex items-center justify-center text-[8px] font-bold">+{room.members - 3}</div>}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm font-bold uppercase text-gray-500">
                                        <Clock size={16} />
                                        <span>Active for {room.activeTime}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={() => { playClick(); onJoinRoom(room.id); }}
                                className="w-full py-3 border-4 border-black font-black uppercase bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2"
                            >
                                Join Room <ArrowRight size={18} />
                            </button>
                        </div>
                    ))}

                    {/* Placeholder for 'No more rooms' or 'Join by code' */}
                    <div className="border-4 border-dashed border-gray-400 p-6 flex flex-col items-center justify-center text-center gap-4 text-gray-400 hover:border-black hover:text-black transition-colors cursor-pointer group h-full min-h-[300px]" onClick={playClick}>
                        <div className="w-16 h-16 border-4 border-current mb-2 flex items-center justify-center rounded-full group-hover:scale-110 transition-transform">
                            <Monitor size={32} />
                        </div>
                        <h3 className="text-xl font-black uppercase">Join by Room Code</h3>
                        <p className="font-bold text-sm max-w-[200px]">Have a specific code from a friend? Enter it here to jump in.</p>
                    </div>
                </div>

                {/* My History Section */}
                <div className="bg-stripes-inverted p-8 border-4 border-black">
                    <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <h3 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
                            <BookOpen size={24} /> My Study History
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-4 bg-gray-50 border-2 border-black">
                                <span className="text-xs font-black uppercase text-gray-500">This Week</span>
                                <div className="text-4xl font-black uppercase mt-1">6h 30m</div>
                                <div className="text-sm font-bold text-green-600 mt-2">↑ 15% vs last week</div>
                            </div>
                            <div className="p-4 bg-gray-50 border-2 border-black">
                                <span className="text-xs font-black uppercase text-gray-500">Avg Session</span>
                                <div className="text-4xl font-black uppercase mt-1">1h 45m</div>
                                <div className="text-sm font-bold text-gray-400 mt-2">Focus Score: 88%</div>
                            </div>
                            <div className="p-4 bg-gray-50 border-2 border-black">
                                <span className="text-xs font-black uppercase text-gray-500">Top Subject</span>
                                <div className="text-4xl font-black uppercase mt-1">DBMS</div>
                                <div className="text-sm font-bold text-gray-400 mt-2">4 sessions total</div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <CreateRoomModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} onJoin={(id) => { setShowCreateModal(false); onJoinRoom(id); }} />
        </div>
    );
};

export default StudyRooms;
