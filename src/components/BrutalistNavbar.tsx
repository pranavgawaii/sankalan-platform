'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    User,
    Volume2,
    VolumeX,
    Menu,
    X,
    LayoutDashboard,
    Settings,
    LogOut,
} from 'lucide-react';

interface BrutalistNavbarProps {
    onNavigate: (view: string) => void;
    currentView?: string;
    userName?: string;
}

// --- Navigation Data ---
const NAV_ITEMS = [
    { label: 'DASHBOARD', id: 'dashboard', type: 'link' },
    {
        label: 'ACADEMICS',
        id: 'academics',
        type: 'dropdown',
        items: [
            { label: 'PYQs Archive', id: 'pyqs', icon: '📚' },
            { label: 'Study Materials', id: 'materials', icon: '📖' },
            { label: 'Lecture Notes', id: 'materials', icon: '📄' }
        ]
    },
    {
        label: 'CODE ARENA',
        id: 'code-arena',
        type: 'dropdown',
        items: [
            { label: 'Practice Problems', id: 'code-arena', icon: '💻' },
            { label: 'My Progress', id: 'code-arena', icon: '📊' },
            { label: 'Leaderboard', id: 'code-arena', icon: '🏆' },
            { label: 'DSA Sheets', id: 'pathways', icon: '📝' }
        ]
    },
    {
        label: 'CAREER',
        id: 'career',
        type: 'dropdown',
        items: [
            { label: 'AI Tools', id: 'tools', icon: '🤖' },
            { label: 'Roadmaps', id: 'pathways', icon: '🗺️' },
            { label: 'Placement Prep', id: 'tools', icon: '📅' }
        ]
    },
    {
        label: 'COMMUNITY',
        id: 'community',
        type: 'dropdown',
        items: [
            { label: 'Project Showcase', id: 'study-rooms', icon: '🎓' },
            { label: 'Study Rooms', id: 'study-rooms', icon: '👥' },
            { label: 'Campus Events', id: 'study-rooms', icon: '🎉' },
            { label: 'Forums', id: 'study-rooms', icon: '💬' }
        ]
    },
    { label: 'ABOUT', id: 'about', type: 'link' },
];

const BrutalistNavbar: React.FC<BrutalistNavbarProps> = ({
    onNavigate,
    currentView,
    userName = 'PRANAV GAWAI'
}) => {
    const [activeTab, setActiveTab] = useState<string | null>(null); // For dropdowns
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const navbarRef = useRef<HTMLDivElement>(null);

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
                setActiveTab(null);
                setIsProfileOpen(false);
            }
        };

        // Close on ESC
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setActiveTab(null);
                setIsProfileOpen(false);
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, []);

    const handleTabClick = (item: typeof NAV_ITEMS[0]) => {
        if (item.type === 'link') {
            onNavigate(item.id);
            setActiveTab(null);
        } else {
            setActiveTab(activeTab === item.label ? null : item.label);
        }
    };

    const handleSubItemClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent bubbling causing re-toggle
        onNavigate(id);
        setActiveTab(null);
        setIsMobileMenuOpen(false);
    };

    const activeDropdownItem = NAV_ITEMS.find(item => item.label === activeTab);

    return (
        <>
            <nav
                ref={navbarRef}
                className="fixed top-0 left-0 right-0 z-50 h-[70px] bg-white border-b-[4px] border-black font-[Space_Mono] flex items-center justify-between"
            >

                {/* LEFT: LOGO */}
                <button
                    onClick={() => onNavigate('dashboard')}
                    className="flex items-center gap-3 pl-8 hover:opacity-70 transition-opacity h-full"
                >
                    <span className="text-2xl">🎓</span>
                    <span className="text-[22px] font-bold tracking-tight text-black uppercase">SANKALAN</span>
                </button>

                {/* CENTER: TABS (Desktop) */}
                <div className="hidden lg:flex items-center h-full justify-center absolute left-1/2 -translate-x-1/2">
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => handleTabClick(item)}
                            className={`
                h-full px-6 flex items-center justify-center
                text-[16px] font-bold uppercase tracking-tight
                border-l-[3px] border-transparent border-r-[3px]
                transition-all duration-150 ease-in-out
                ${(activeTab === item.label || (item.type === 'link' && currentView === item.id))
                                    ? 'bg-black text-white border-black'
                                    : 'bg-white text-black hover:bg-black hover:text-white border-transparent hover:border-black'
                                }
              `}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>

                {/* RIGHT: ICONS & PROFILE */}
                <div className="hidden md:flex items-center h-full pr-8 gap-4">

                    {/* Sound Toggle */}
                    <button
                        onClick={() => setIsSoundOn(!isSoundOn)}
                        className="w-12 h-12 flex items-center justify-center border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all group"
                    >
                        {isSoundOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </button>

                    {/* Notifications */}
                    <button className="w-12 h-12 flex items-center justify-center border-[3px] border-black bg-white hover:bg-black hover:text-white transition-all relative">
                        <Bell size={24} />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-600 rounded-full border border-white" />
                    </button>

                    {/* Profile */}
                    <div className="relative">
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="w-[180px] h-12 border-[3px] border-black flex items-center justify-center gap-3 bg-white hover:bg-black hover:text-white transition-all font-bold text-[14px]"
                        >
                            <span className="truncate max-w-[120px]">{userName}</span>
                            <User size={18} />
                        </button>

                        <AnimatePresence>
                            {isProfileOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full right-0 mt-2 w-[200px] bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col z-50"
                                >
                                    <button onClick={() => { onNavigate('dashboard'); setIsProfileOpen(false) }} className="h-[44px] flex items-center px-4 font-bold text-black hover:bg-black hover:text-white transition-colors gap-3 border-b border-black text-sm">
                                        <LayoutDashboard size={16} /> DASHBOARD
                                    </button>
                                    <button onClick={() => { onNavigate('settings'); setIsProfileOpen(false) }} className="h-[44px] flex items-center px-4 font-bold text-black hover:bg-black hover:text-white transition-colors gap-3 border-b border-black text-sm">
                                        <Settings size={16} /> SETTINGS
                                    </button>
                                    <button onClick={() => setIsProfileOpen(false)} className="h-[44px] flex items-center px-4 font-bold text-red-600 hover:bg-red-600 hover:text-white transition-colors gap-3 text-sm">
                                        <LogOut size={16} /> LOGOUT
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* MOBILE HAMBURGER */}
                <button
                    className="lg:hidden p-4 mr-4"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu size={32} />
                </button>

                {/* MOBILE OVERLAY */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "tween", duration: 0.3 }}
                            className="fixed inset-0 bg-black z-[60] flex flex-col p-8 overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-12">
                                <span className="text-white text-2xl font-bold">MENU</span>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white">
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                {NAV_ITEMS.map((item) => (
                                    <div key={item.label}>
                                        <button
                                            onClick={() => item.type === 'link' ? handleSubItemClick(item.id, {} as any) : setActiveTab(activeTab === item.label ? null : item.label)}
                                            className="text-white text-2xl font-bold uppercase w-full text-left"
                                        >
                                            {item.label}
                                        </button>
                                        {item.type === 'dropdown' && activeTab === item.label && (
                                            <div className="flex flex-col pl-4 mt-4 gap-4 border-l-2 border-white/20">
                                                {item.items?.map(sub => (
                                                    <button
                                                        key={sub.label}
                                                        onClick={(e) => handleSubItemClick(sub.id, e)}
                                                        className="text-gray-400 text-lg hover:text-white text-left flex items-center gap-3"
                                                    >
                                                        <span>{sub.icon}</span> {sub.label}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </nav>

            {/* FULL WIDTH DROPDOWN PANEL (Desktop) */}
            <AnimatePresence>
                {activeDropdownItem && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed top-[70px] left-0 right-0 bg-white border-b-[4px] border-black z-40 overflow-hidden shadow-xl"
                    >
                        <div className="max-w-7xl mx-auto py-8 px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {activeDropdownItem.items?.map((subItem) => (
                                <button
                                    key={subItem.label}
                                    onClick={(e) => handleSubItemClick(subItem.id, e)}
                                    className="flex items-center gap-4 p-3 hover:bg-black hover:text-white transition-colors group text-left border border-transparent hover:border-black"
                                >
                                    <span className="text-2xl group-hover:scale-110 transition-transform">{subItem.icon}</span>
                                    <span className="font-bold text-[15px] uppercase tracking-wide">{subItem.label}</span>
                                </button>
                            ))}
                        </div>
                        {/* Bottom decoration bar */}
                        <div className="h-2 bg-black w-full" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Spacer for fixed navbar */}
            <div className="h-[70px]" />
        </>
    );
};

export default BrutalistNavbar;
