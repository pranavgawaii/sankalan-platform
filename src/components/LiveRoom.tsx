
import React, { useState, useEffect } from 'react';
import {
    Clock,
    MessageSquare,
    Mic,
    MicOff,
    Video,
    VideoOff,
    Monitor,
    Users,
    X,
    Settings,
    MoreVertical,
    Send,
    Smile,
    FileText,
    ChevronDown,
    LogOut,
    Play,
    Pause,
    SkipForward
} from 'lucide-react';
import useSound from '../hooks/useSound';

const LiveRoom: React.FC<{ onLeave: () => void }> = ({ onLeave }) => {
    const playClick = useSound();
    const [micOn, setMicOn] = useState(false);
    const [videoOn, setVideoOn] = useState(false);
    const [timerActive, setTimerActive] = useState(true);
    const [timeLeft, setTimeLeft] = useState(15 * 60 + 43); // 15:43
    const [messages, setMessages] = useState([
        { user: 'Priya', text: 'Q15 is tough, anyone solved it?', time: '10:23 AM' },
        { user: 'Rahul', text: 'Yeah, check page 3 of the notes.', time: '10:24 AM' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    // Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        setMessages([...messages, { user: 'You', text: newMessage, time: 'Now' }]);
        setNewMessage('');
        playClick();
    };

    return (
        <div className="fixed inset-0 bg-gray-100 z-[100] flex flex-col h-screen overflow-hidden">

            {/* Top Bar */}
            <header className="bg-black text-white h-16 flex items-center justify-between px-4 border-b-4 border-black shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                        <h1 className="font-black uppercase text-sm md:text-lg tracking-wide">DBMS Marathon - Endsem Prep</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Room ID: #8X92 • Collaborative Mode</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { playClick(); onLeave(); }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-black uppercase border-2 border-transparent hover:border-white transition-all flex items-center gap-2"
                    >
                        <LogOut size={14} /> <span className="hidden sm:inline">Leave Room</span>
                    </button>
                    <button className="p-2 hover:bg-gray-800 rounded-full" onClick={playClick}><Settings size={20} /></button>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* Left Panel - Study Space (75%) */}
                <main className="flex-1 bg-dots p-4 overflow-y-auto relative flex flex-col">

                    {/* Mock Shared Content */}
                    <div className="flex-1 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] flex flex-col relative overflow-hidden">

                        {/* Toolbar */}
                        <div className="bg-gray-100 border-b-4 border-black p-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="px-3 py-1 bg-black text-white text-xs font-black uppercase flex items-center gap-2">
                                    <FileText size={12} /> Viewing: DBMS_2024_Q15.pdf <ChevronDown size={12} />
                                </button>
                                <span className="text-xs font-bold uppercase text-gray-500 ml-2">Page 3 of 12</span>
                            </div>
                            <div className="flex gap-2">
                                <button className="p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black transition-all"><Monitor size={16} /></button>
                                <button className="p-1 hover:bg-gray-200 border-2 border-transparent hover:border-black transition-all"><MoreVertical size={16} /></button>
                            </div>
                        </div>

                        {/* PDF Viewer Simulation */}
                        <div className="flex-1 bg-gray-50 p-8 overflow-y-auto flex items-center justify-center">
                            <div className="w-full max-w-3xl bg-white border-2 border-gray-300 shadow-lg min-h-[600px] p-12 relative">
                                {/* Simulated PDF Content */}
                                <div className="w-3/4 h-8 bg-gray-200 mb-6"></div>
                                <div className="space-y-4">
                                    <div className="w-full h-4 bg-gray-100"></div>
                                    <div className="w-full h-4 bg-gray-100"></div>
                                    <div className="w-5/6 h-4 bg-gray-100"></div>
                                    <div className="w-full h-4 bg-gray-100"></div>
                                </div>
                                <div className="mt-12 p-6 border-2 border-dashed border-red-300 bg-red-50">
                                    <h3 className="font-bold text-red-800 uppercase mb-2">Question 15 (10 Marks)</h3>
                                    <p className="font-mono text-sm">Consider a relation R(A, B, C, D, E) with FDs: A→B, BC→E, E→DA. Decompose R into BCNF.</p>
                                </div>
                                <div className="absolute top-4 right-4 text-xs font-bold text-gray-400 rotate-90 origin-top-right">SANKALAN VIEWER</div>
                            </div>
                        </div>

                        {/* Floating Action Bar */}
                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/90 px-6 py-3 rounded-full border-2 border-white/20 backdrop-blur-md shadow-2xl">
                            <button
                                onClick={() => { playClick(); setMicOn(!micOn); }}
                                className={`p-3 rounded-full transition-colors ${micOn ? 'bg-white text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                            >
                                {micOn ? <Mic size={20} /> : <MicOff size={20} />}
                            </button>
                            <button
                                onClick={() => { playClick(); setVideoOn(!videoOn); }}
                                className={`p-3 rounded-full transition-colors ${videoOn ? 'bg-white text-black' : 'bg-gray-700 text-white hover:bg-gray-600'}`}
                            >
                                {videoOn ? <Video size={20} /> : <VideoOff size={20} />}
                            </button>
                            <div className="w-px h-8 bg-gray-600"></div>
                            <button className="p-3 rounded-full bg-red-600 text-white hover:bg-red-500" onClick={() => { playClick(); onLeave(); }}>
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </main>

                {/* Right Panel - Sidebar (25%) */}
                <aside className="w-full md:w-80 bg-white border-l-4 border-black flex flex-col shrink-0 h-[40vh] md:h-auto border-t-4 md:border-t-0">

                    {/* Pomodoro Timer */}
                    <div className="p-4 border-b-4 border-black bg-yellow-50">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-black uppercase text-sm flex items-center gap-2"><Clock size={16} /> Pomodoro Timer</h3>
                            <button className="text-[10px] font-bold underline">SETTINGS</button>
                        </div>
                        <div className="text-5xl font-black font-mono text-center my-2 tracking-widest">{formatTime(timeLeft)}</div>
                        <div className="flex gap-1 h-2 bg-gray-200 mb-4 rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-black"></div>
                        </div>
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => { playClick(); setTimerActive(!timerActive); }}
                                className="px-4 py-1 bg-black text-white text-xs font-black uppercase flex items-center gap-1"
                            >
                                {timerActive ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start</>}
                            </button>
                            <button className="px-3 py-1 border-2 border-black text-xs font-black uppercase hover:bg-gray-100 flex items-center gap-1">
                                <SkipForward size={12} /> Skip
                            </button>
                        </div>
                    </div>

                    {/* Members List */}
                    <div className="p-4 border-b-4 border-black bg-white flex-1 overflow-y-auto max-h-[200px] md:max-h-[300px]">
                        <h3 className="font-black uppercase text-xs text-gray-500 mb-3 flex justify-between">
                            Members <span>4/8</span>
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-black flex items-center justify-center text-xs font-black">YO</div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm uppercase">You</div>
                                    <div className="text-[10px] font-bold text-green-600">Studying...</div>
                                </div>
                                <MicOff size={14} className="text-gray-400" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-black flex items-center justify-center text-xs font-black">RA</div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm uppercase">Rahul</div>
                                    <div className="text-[10px] font-bold text-yellow-600">On Break</div>
                                </div>
                                <MicOff size={14} className="text-gray-400" />
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-black flex items-center justify-center text-xs font-black">PR</div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm uppercase">Priya</div>
                                    <div className="text-[10px] font-bold text-green-600">Studying...</div>
                                </div>
                                <Mic size={14} className="text-green-500 animate-pulse" />
                            </div>
                            <div className="flex items-center gap-3 opacity-50">
                                <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-black flex items-center justify-center text-xs font-black">AM</div>
                                <div className="flex-1">
                                    <div className="font-bold text-sm uppercase">Amit</div>
                                    <div className="text-[10px] font-bold text-gray-500">AFK - 5m</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Chat Section */}
                    <div className="flex-1 flex flex-col min-h-[200px] bg-gray-50">
                        <div className="p-2 border-b-2 border-gray-200">
                            <h3 className="font-black uppercase text-xs text-gray-500">Quick Chat</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] p-2 border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] ${msg.user === 'You' ? 'bg-black text-white' : 'bg-white'}`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{msg.user} • {msg.time}</span>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={handleSendMessage} className="p-2 border-t-2 border-black bg-white flex gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 border-2 border-gray-300 p-2 text-xs font-bold focus:border-black focus:outline-none uppercase"
                            />
                            <button type="submit" onClick={playClick} className="bg-black text-white p-2 border-2 border-black hover:bg-gray-800">
                                <Send size={16} />
                            </button>
                        </form>
                    </div>

                </aside>
            </div>
        </div>
    );
};

export default LiveRoom;
