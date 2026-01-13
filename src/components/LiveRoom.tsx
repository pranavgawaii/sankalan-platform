
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

const LiveRoom: React.FC<{ roomData: any; onLeave: () => void }> = ({ roomData, onLeave }) => {
    const playClick = useSound();

    // Settings State
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [settings, setSettings] = useState({
        workTime: 25,
        breakTime: 5,
        waterReminder: 30, // minutes (0 to disable)
        soundEnabled: true,
        autoStartBreak: false
    });

    // Room State
    const [micOn, setMicOn] = useState(false);
    const [videoOn, setVideoOn] = useState(false);

    // Timer State
    const [timerActive, setTimerActive] = useState(true);
    const [mode, setMode] = useState<'WORK' | 'BREAK'>('WORK'); // Current mode
    const [timeLeft, setTimeLeft] = useState(settings.workTime * 60);

    const [messages, setMessages] = useState([
        { user: 'Priya', text: 'Q15 is tough, anyone solved it?', time: '10:23 AM' },
        { user: 'Rahul', text: 'Yeah, check page 3 of the notes.', time: '10:24 AM' }
    ]);
    const [newMessage, setNewMessage] = useState('');

    // --- Effects ---

    // 1. Timer Logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timerActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            // Timer finished
            if (settings.soundEnabled) {
                // Play alarm sound (using click for now as placeholder, ideally a different sound)
                playClick();
            }

            // Auto-switch mode
            if (mode === 'WORK') {
                setMode('BREAK');
                setTimeLeft(settings.breakTime * 60);
                if (!settings.autoStartBreak) setTimerActive(false);
            } else {
                setMode('WORK');
                setTimeLeft(settings.workTime * 60);
                setTimerActive(false); // Always pause after break
            }
        }
        return () => clearInterval(interval);
    }, [timerActive, timeLeft, mode, settings, playClick]);

    // 2. Water Reminder Logic
    useEffect(() => {
        if (settings.waterReminder > 0) {
            const hydrationInterval = setInterval(() => {
                if (settings.soundEnabled) playClick();
                // We could use a toast here, but for now a simple alert or just a console log/visual cue?
                // Using a browser notification if allowed, or just a temporary UI element.
                // For simplicity, let's append a system message to chat.
                setMessages(prev => [...prev, {
                    user: 'SYSTEM',
                    text: '💧 Time to drink water! Stay hydrated.',
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
            }, settings.waterReminder * 60 * 1000);
            return () => clearInterval(hydrationInterval);
        }
    }, [settings.waterReminder, settings.soundEnabled, playClick]);

    // Apply settings to timer when they change (if timer is reset or unused)? 
    // Or just let the current session finish. 
    // Let's reset timer if settings change ONLY if it wasn't running? No, complicate.
    // Simple approach: settings apply on NEXT cycle or manual reset.
    // Actually, if user changes workTime, we should probably update timeLeft if it was at the start?
    // Let's keep it simple: Settings take effect on next phase switch or reset.

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

            {/* Settings Modal */}
            {settingsOpen && (
                <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-6 border-b-4 border-black pb-4">
                            <h2 className="text-xl font-black uppercase flex items-center gap-2">
                                <Settings size={24} /> Room Settings
                            </h2>
                            <button onClick={() => { playClick(); setSettingsOpen(false); }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Pomodoro Settings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase text-gray-500">⏱️ Timer Preferences</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold uppercase block mb-1">Work (mins)</label>
                                        <input
                                            type="number"
                                            value={settings.workTime}
                                            onChange={(e) => setSettings({ ...settings, workTime: parseInt(e.target.value) || 25 })}
                                            className="w-full border-2 border-black p-2 font-mono font-bold"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold uppercase block mb-1">Break (mins)</label>
                                        <input
                                            type="number"
                                            value={settings.breakTime}
                                            onChange={(e) => setSettings({ ...settings, breakTime: parseInt(e.target.value) || 5 })}
                                            className="w-full border-2 border-black p-2 font-mono font-bold"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Health & Cool Stuff */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-black uppercase text-gray-500">🥤 Wellness & Vibes</h3>
                                <div>
                                    <label className="text-xs font-bold uppercase block mb-1">Hydration Reminder (mins)</label>
                                    <div className="flex gap-2">
                                        {[0, 15, 30, 45, 60].map(m => (
                                            <button
                                                key={m}
                                                onClick={() => { playClick(); setSettings({ ...settings, waterReminder: m }); }}
                                                className={`px-3 py-1 border-2 border-black text-xs font-bold uppercase transition-all ${settings.waterReminder === m ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
                                            >
                                                {m === 0 ? 'Off' : `${m}m`}
                                            </button>
                                        ))}
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-400 mt-1">*Plays a sound and shows a chat alert.</p>
                                </div>

                                <label className="flex items-center gap-3 cursor-pointer p-2 border-2 border-transparent hover:bg-gray-50 rounded">
                                    <div className={`w-5 h-5 border-2 border-black flex items-center justify-center ${settings.soundEnabled ? 'bg-black text-white' : 'bg-white'}`}>
                                        {settings.soundEnabled && <span className="text-xs">✓</span>}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={settings.soundEnabled}
                                        onChange={() => setSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                                    />
                                    <span className="text-xs font-bold uppercase">Enable Sound Effects</span>
                                </label>
                            </div>

                            <button
                                onClick={() => {
                                    playClick();
                                    setSettingsOpen(false);
                                    // Reset timer on save to apply new settings immediately? 
                                    // Optional: setTimeLeft(settings.workTime * 60); setMode('WORK'); setTimerActive(false);
                                }}
                                className="w-full bg-black text-white py-3 font-black uppercase border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                            >
                                Save Settings
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Bar */}
            <header className="bg-black text-white h-16 flex items-center justify-between px-4 border-b-4 border-black shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <div>
                        <h1 className="font-black uppercase text-sm md:text-lg tracking-wide">{roomData.title}</h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">Room ID: #{roomData.id.slice(-4)} • {roomData.type} Mode</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { playClick(); onLeave(); }}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-xs font-black uppercase border-2 border-transparent hover:border-white transition-all flex items-center gap-2"
                    >
                        <LogOut size={14} /> <span className="hidden sm:inline">Leave Room</span>
                    </button>
                    <button
                        className="p-2 hover:bg-gray-800 rounded-full transition-transform active:rotate-90"
                        onClick={() => { playClick(); setSettingsOpen(true); }}
                    >
                        <Settings size={20} />
                    </button>
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
                    <div className={`p-4 border-b-4 border-black transition-colors ${mode === 'WORK' ? 'bg-yellow-50' : 'bg-green-50'}`}>
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="font-black uppercase text-sm flex items-center gap-2">
                                <Clock size={16} /> {mode} TIMER
                            </h3>
                            <button onClick={() => { playClick(); setSettingsOpen(true) }} className="text-[10px] font-bold underline hover:text-blue-600">SETTINGS</button>
                        </div>
                        <div className="text-5xl font-black font-mono text-center my-2 tracking-widest">{formatTime(timeLeft)}</div>
                        <div className="flex gap-1 h-2 bg-gray-200 mb-4 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${mode === 'WORK' ? 'bg-black' : 'bg-green-600'}`}
                                style={{ width: `${(timeLeft / ((mode === 'WORK' ? settings.workTime : settings.breakTime) * 60)) * 100}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-center gap-2">
                            <button
                                onClick={() => { playClick(); setTimerActive(!timerActive); }}
                                className={`px-4 py-1 text-white text-xs font-black uppercase flex items-center gap-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all ${mode === 'WORK' ? 'bg-black' : 'bg-green-600'}`}
                            >
                                {timerActive ? <><Pause size={12} /> Pause</> : <><Play size={12} /> Start</>}
                            </button>
                            <button
                                onClick={() => {
                                    playClick();
                                    setTimerActive(false);
                                    setMode(mode === 'WORK' ? 'BREAK' : 'WORK');
                                    setTimeLeft((mode === 'WORK' ? settings.breakTime : settings.workTime) * 60);
                                }}
                                className="px-3 py-1 border-2 border-black text-xs font-black uppercase hover:bg-gray-100 flex items-center gap-1"
                            >
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
                                <div key={i} className={`flex flex-col ${msg.user === 'You' ? 'items-end' : (msg.user === 'SYSTEM' ? 'items-center' : 'items-start')}`}>
                                    {msg.user === 'SYSTEM' ? (
                                        <div className="bg-blue-100 text-blue-800 text-[10px] font-bold px-3 py-1 rounded-full uppercase border-2 border-blue-200 shadow-sm animate-bounce">
                                            {msg.text}
                                        </div>
                                    ) : (
                                        <>
                                            <div className={`max-w-[85%] p-2 border-2 border-black text-xs font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] ${msg.user === 'You' ? 'bg-black text-white' : 'bg-white'}`}>
                                                {msg.text}
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{msg.user} • {msg.time}</span>
                                        </>
                                    )}
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
