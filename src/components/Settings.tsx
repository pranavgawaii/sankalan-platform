
import React, { useState } from 'react';
import { Bell, Moon, Shield, Trash2, LogOut, ChevronRight, Volume2, ArrowLeft } from 'lucide-react';
import useSound from '../hooks/useSound';
import { useSoundContext } from '../context/SoundContext';

const Toggle: React.FC<{ label: string; checked: boolean; onChange: () => void }> = ({ label, checked, onChange }) => {
    const playClick = useSound();
    return (
        <div className="flex items-center justify-between p-4 border-2 border-black bg-white hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => { playClick(); onChange(); }}>
            <span className="font-bold uppercase text-sm">{label}</span>
            <div className={`w-12 h-6 border-2 border-black relative transition-colors ${checked ? 'bg-black' : 'bg-gray-200'}`}>
                <div className={`absolute top-0 bottom-0 w-6 border-r-2 border-black bg-white transition-transform ${checked ? 'translate-x-full' : 'translate-x-0'}`}></div>
            </div>
        </div>
    );
};

const Settings: React.FC<{ onLogout: () => void; onBack: () => void }> = ({ onLogout, onBack }) => {
    const playClick = useSound();
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(false);
    const { isMuted, setMuted } = useSoundContext();

    return (
        <div className="container mx-auto max-w-4xl">
            <div className="space-y-8">
                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Bell size={20} /> Preferences
                    </h3>
                    <div className="space-y-4">
                        <Toggle label="Push Notifications" checked={notifications} onChange={() => setNotifications(!notifications)} />
                        <Toggle label="Dark Mode (Beta)" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                        <Toggle label="Sound Effects" checked={!isMuted} onChange={() => setMuted(!isMuted)} />
                    </div>
                </div>

                <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <h3 className="text-xl font-black uppercase mb-6 flex items-center gap-2">
                        <Shield size={20} /> Privacy & Security
                    </h3>
                    <button className="w-full flex justify-between items-center p-4 border-2 border-black hover:bg-black hover:text-white transition-colors uppercase font-bold text-sm mb-3 group">
                        Change Password <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="w-full flex justify-between items-center p-4 border-2 border-black hover:bg-black hover:text-white transition-colors uppercase font-bold text-sm group">
                        Manage Devices <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>

            {/* Account Column */}
            <div className="space-y-8">
                <div className="bg-stripes p-8 border-4 border-black text-center">
                    <div className="bg-white border-4 border-black p-6 inline-block mb-6">
                        <h3 className="text-2xl font-black uppercase">Logged in as</h3>
                        <p className="font-bold">student@mitadt.ac.in</p>
                    </div>

                    <button
                        onClick={onLogout}
                        className="w-full bg-white border-4 border-black p-4 text-lg font-black uppercase flex items-center justify-center gap-2 hover:bg-red-50 hover:text-red-600 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4"
                    >
                        <LogOut size={20} /> Sign Out
                    </button>
                </div>

                <div className="border-4 border-red-600 bg-red-50 p-6">
                    <h3 className="text-xl font-black uppercase text-red-600 mb-4 flex items-center gap-2">
                        <Trash2 size={20} /> Danger Zone
                    </h3>
                    <p className="text-xs font-bold uppercase text-red-800 mb-6 leading-relaxed">
                        Once you delete your account, there is no going back. All your saved PYQs, notes, and progress will be permanently removed.
                    </p>
                    <button className="w-full bg-red-600 text-white border-4 border-red-800 p-4 font-black uppercase hover:bg-red-700 transition-colors">
                        Delete Account
                    </button>
                </div>
            </div>

        </div>
    );
};

export default Settings;
