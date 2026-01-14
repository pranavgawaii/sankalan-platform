import React, { useState } from 'react';
import { Users, Clock, Plus, ArrowRight, Play, BookOpen, Mic, MicOff, Video, VideoOff, MessageSquare, X, Monitor, Smile, MoreVertical, Layout, Settings, Trash2, Share2, Copy, Lock } from 'lucide-react';
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

// --- Components ---

const CreateRoomModal: React.FC<{ isOpen: boolean; onClose: () => void; onCreate: (room: any) => void }> = ({ isOpen, onClose, onCreate }) => {
    const playClick = useSound();
    const [formData, setFormData] = useState({
        title: '',
        subject: 'DBMS',
        maxMembers: 4,
        type: 'Collaborative',
        topic: '',
        workTime: 25,
        breakTime: 5,
        announcement: '',
        isPrivate: false
    });

    const handleSubmit = () => {
        playClick();
        if (!formData.title) {
            alert('Please enter a room name');
            return;
        }
        onCreate({
            ...formData,
            activeTime: 'Just started',
            members: 1,
            isPomodoro: formData.type === 'Focus',
            settings: { // Pass these initial settings to the LiveRoom
                workTime: Number(formData.workTime),
                breakTime: Number(formData.breakTime),
                announcement: formData.announcement,
                isPrivate: formData.isPrivate
            }
        });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white border-4 border-black w-full max-w-2xl shadow-[16px_16px_0px_0px_rgba(255,255,255,0.2)] max-h-[90vh] overflow-y-auto">
                <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black sticky top-0 z-10">
                    <h3 className="text-xl font-black uppercase flex items-center gap-2"><Plus size={24} /> Mission Setup Protocol</h3>
                    <button onClick={() => { playClick(); onClose(); }}><X size={24} /></button>
                </div>

                <div className="p-6 space-y-8">
                    {/* Section 1: Identity */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase bg-yellow-300 inline-block px-2 border-2 border-black -rotate-1">1. Room Identity</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase mb-1 block">Room Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., DBMS Marathon"
                                    className="w-full border-2 border-black p-3 font-bold uppercase focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase mb-1 block">Subject</label>
                                <select
                                    className="w-full border-2 border-black p-3 font-bold uppercase cursor-pointer focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                >
                                    <option>DBMS</option>
                                    <option>CN</option>
                                    <option>OS</option>
                                    <option>ML</option>
                                    <option>DSA</option>
                                    <option>Web Dev</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase mb-1 block">Topic / Goal</label>
                            <input
                                type="text"
                                placeholder="e.g. Solving 2023 PYQs together"
                                className="w-full border-2 border-black p-3 font-bold uppercase focus:outline-none focus:bg-yellow-50 focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                                value={formData.topic}
                                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Section 2: Configuration */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase bg-green-300 inline-block px-2 border-2 border-black rotate-1">2. Configuration</h4>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase mb-1 block">Room Mode</label>
                                <div className="space-y-2">
                                    {['Focus', 'Collaborative', 'Doubt'].map((t, i) => (
                                        <label key={i} className={`flex items-center gap-2 p-2 border-2 border-black cursor-pointer hover:bg-gray-50 ${formData.type === t ? 'bg-black text-white hover:bg-black' : 'bg-white'}`}>
                                            <input
                                                type="radio"
                                                name="roomType"
                                                className="hidden"
                                                checked={formData.type === t}
                                                onChange={() => setFormData({ ...formData, type: t as any })}
                                            />
                                            <span className="font-bold uppercase text-[10px]">{t}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] font-black uppercase mb-1 block">Max Squad</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[2, 4, 6, 8, 12, 20].map(n => (
                                        <button
                                            key={n}
                                            onClick={() => { playClick(); setFormData({ ...formData, maxMembers: n }); }}
                                            className={`py-2 text-xs font-bold border-2 border-black transition-all ${formData.maxMembers === n ? 'bg-black text-white shadow-[2px_2px_0px_0px_rgba(100,100,100,1)]' : 'hover:bg-gray-100'}`}
                                        >
                                            {n}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Timer Config */}
                        <div className="bg-gray-50 border-2 border-black p-4 relative">
                            <label className="absolute -top-3 left-4 bg-white px-2 text-[10px] font-black uppercase text-gray-500 border-2 border-black">Timer Protocols</label>
                            <div className="grid grid-cols-2 gap-6 mt-2">
                                <div>
                                    <label className="text-[10px] font-black uppercase mb-1 block flex items-center gap-1"><Clock size={10} /> Work Interval (min)</label>
                                    <input
                                        type="number"
                                        min="1" max="60"
                                        className="w-full border-b-2 border-black bg-transparent p-1 font-mono font-bold text-center text-lg focus:outline-none focus:bg-white"
                                        value={formData.workTime}
                                        onChange={e => setFormData({ ...formData, workTime: Number(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black uppercase mb-1 block flex items-center gap-1"><Smile size={10} /> Break Interval (min)</label>
                                    <input
                                        type="number"
                                        min="1" max="30"
                                        className="w-full border-b-2 border-black bg-transparent p-1 font-mono font-bold text-center text-lg focus:outline-none focus:bg-white"
                                        value={formData.breakTime}
                                        onChange={e => setFormData({ ...formData, breakTime: Number(e.target.value) })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Comms */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-black uppercase bg-blue-300 inline-block px-2 border-2 border-black -rotate-1">3. Access & Comms</h4>

                        {/* Privacy Toggle */}
                        <div className="grid grid-cols-2 gap-4">
                            <div
                                onClick={() => { playClick(); setFormData({ ...formData, isPrivate: false }); }}
                                className={`border-2 border-black p-3 cursor-pointer transition-all ${!formData.isPrivate ? 'bg-black text-white shadow-[4px_4px_0px_0px_#222]' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <div className="font-black uppercase text-xs flex items-center gap-2 mb-1"><Users size={14} /> Public Channel</div>
                                <p className={`text-[10px] leading-tight ${!formData.isPrivate ? 'text-gray-400' : 'text-gray-500'}`}>Open to all students. Visible in the lobby.</p>
                            </div>
                            <div
                                onClick={() => { playClick(); setFormData({ ...formData, isPrivate: true }); }}
                                className={`border-2 border-black p-3 cursor-pointer transition-all ${formData.isPrivate ? 'bg-black text-white shadow-[4px_4px_0px_0px_#222]' : 'bg-white hover:bg-gray-50'}`}
                            >
                                <div className="font-black uppercase text-xs flex items-center gap-2 mb-1"><Lock size={14} /> Private Uplink</div>
                                <p className={`text-[10px] leading-tight ${formData.isPrivate ? 'text-gray-400' : 'text-gray-500'}`}>Hidden from lobby. Invite only via direct link.</p>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase mb-1 block">Room Announcement / Rule</label>
                            <textarea
                                placeholder="e.g. Mic ON required! No lurking allowed."
                                className="w-full border-2 border-black p-3 font-bold uppercase focus:outline-none focus:bg-yellow-50 h-20 resize-none"
                                value={formData.announcement}
                                onChange={e => setFormData({ ...formData, announcement: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="w-full py-4 bg-black text-white border-4 border-black font-black uppercase text-xl hover:bg-white hover:text-black hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-y-1 active:shadow-none"
                    >
                        Initialize Room →
                    </button>
                </div>
            </div>
        </div>
    );
};

interface StudyRoomsProps {
    rooms: Room[];
    onCreateRoom: (room: any) => void;
    onJoinRoom: (roomId: string) => void;
    onDeleteRoom?: (roomId: string) => void; // Optional for now to avoid breaking App.tsx if currently missing
}

const StudyRooms: React.FC<StudyRoomsProps> = ({ rooms, onCreateRoom, onJoinRoom, onDeleteRoom }) => {
    const playClick = useSound();
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinInput, setShowJoinInput] = useState(false);
    const [joinCode, setJoinCode] = useState('');

    const handleCopyLink = (roomId: string) => {
        playClick();
        navigator.clipboard.writeText(`https://sankalan.app/room/${roomId}`);
        alert("Invite Link Copied! Share it with your squad. 🚀");
    };

    return (
        <div className="min-h-screen bg-dots pt-24 pb-20 px-4">
            <div className="container mx-auto max-w-6xl">

                {/* Header */}
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]"></span>
                            <span className="font-black uppercase tracking-widest text-sm text-red-600">Live • Global Traffic</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-black leading-none drop-shadow-sm">
                            Study <span className="bg-black text-white px-2">HQ</span>
                        </h1>
                        <p className="text-xl font-bold uppercase opacity-60 mt-4 md:ml-1 tracking-wide">
                            Collaborate. Dominate. Repeat.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => { playClick(); setShowCreateModal(true); }}
                            className="bg-yellow-400 text-black px-8 py-4 font-black uppercase border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center gap-3 text-lg"
                        >
                            <Plus size={24} strokeWidth={3} /> New Room
                        </button>
                    </div>
                </div>

                {/* Active Rooms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                    {/* Join By Code Card */}
                    <div className="bg-black text-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(100,100,100,0.5)] flex flex-col justify-between h-full min-h-[320px] group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-20"><Monitor size={64} /></div>

                        <div className="relative z-10">
                            <h3 className="text-3xl font-black uppercase mb-4 leading-none">Console <br /> Access</h3>
                            <p className="text-gray-400 font-mono text-sm mb-6">{'>'} ENTER_ACCESS_CODE_</p>

                            <input
                                type="text"
                                placeholder="XXX-XXX"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value)}
                                className="w-full bg-gray-900 border-2 border-gray-700 p-3 font-mono text-lg text-green-400 focus:outline-none focus:border-green-500 uppercase placeholder-gray-700 mb-4"
                            />
                        </div>

                        <button
                            onClick={() => {
                                if (joinCode.trim()) {
                                    playClick();
                                    onJoinRoom(joinCode);
                                }
                            }}
                            className="w-full py-3 bg-white text-black font-black uppercase border-2 border-white hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02] duration-200"
                        >
                            Connect <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Room Cards */}
                    {rooms.map(room => (
                        <div key={room.id} className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between h-full relative group">

                            {/* Card Header Pattern */}
                            <div className={`h-3 w-full border-b-4 border-black ${room.type === 'Focus' ? 'bg-purple-400' : (room.type === 'Doubt' ? 'bg-red-400' : 'bg-yellow-400')}`}></div>

                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`text-[10px] font-black uppercase px-2 py-1 border-2 border-black inline-flex items-center gap-1 ${room.type === 'Focus' ? 'bg-purple-100' : 'bg-yellow-100'}`}>
                                        {room.type === 'Focus' ? <Clock size={10} /> : <Users size={10} />} {room.type}
                                    </div>

                                    {/* Action Menu */}
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => handleCopyLink(room.id)} className="p-1.5 hover:bg-gray-100 border-2 border-black rounded-sm transition-colors" title="Invite Friends">
                                            <Share2 size={14} />
                                        </button>
                                        {onDeleteRoom && (
                                            <button onClick={() => { playClick(); onDeleteRoom(room.id); }} className="p-1.5 hover:bg-red-100 text-red-600 border-2 border-black rounded-sm transition-colors" title="Delete Room">
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black uppercase mb-2 leading-tight tracking-tight line-clamp-2">{room.title}</h3>
                                <p className="font-bold text-gray-500 mb-6 uppercase text-xs flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    {room.activeTime} • {room.topic}
                                </p>

                                {/* Members Visual */}
                                <div className="flex items-center gap-3 mt-auto mb-6">
                                    <div className="flex -space-x-3">
                                        {[...Array(Math.min(3, room.members))].map((_, i) => (
                                            <div key={i} className={`w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-[10px] font-black ${['bg-blue-200', 'bg-pink-200', 'bg-green-200'][i]}`}>
                                                {String.fromCharCode(65 + i)}
                                            </div>
                                        ))}
                                        {room.members > 3 && (
                                            <div className="w-8 h-8 rounded-full bg-black text-white border-2 border-black flex items-center justify-center text-[10px] font-black z-10">
                                                +{room.members - 3}
                                            </div>
                                        )}
                                    </div>
                                    <span className="text-xs font-bold uppercase text-gray-400">{room.members}/{room.maxMembers} Online</span>
                                </div>

                                <button
                                    onClick={() => { playClick(); onJoinRoom(room.id); }}
                                    className="w-full py-3 border-4 border-black font-black uppercase bg-white hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2 group-hover:shadow-md"
                                >
                                    Enter Room <ArrowRight size={18} strokeWidth={3} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats / Motivation Footer */}
                <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-black text-white flex items-center justify-center border-4 border-black">
                            <BookOpen size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black uppercase">Your Impact</h3>
                            <p className="text-xs font-bold uppercase text-gray-400">Stats reset weekly</p>
                        </div>
                    </div>

                    <div className="flex gap-8 md:gap-16 text-center">
                        <div>
                            <div className="text-3xl font-black">12h</div>
                            <div className="text-[10px] font-bold uppercase bg-yellow-300 px-1 inline-block">Focused</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black">88%</div>
                            <div className="text-[10px] font-bold uppercase bg-green-300 px-1 inline-block">Efficiency</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black">42</div>
                            <div className="text-[10px] font-bold uppercase bg-blue-300 px-1 inline-block">Streak</div>
                        </div>
                    </div>
                </div>

            </div>

            <CreateRoomModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onCreate={(newRoom) => {
                    onCreateRoom(newRoom);
                    setShowCreateModal(false);
                }}
            />
        </div>
    );
};

export default StudyRooms;
