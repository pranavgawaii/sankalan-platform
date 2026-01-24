'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Bell,
    Volume2,
    VolumeX,
    Menu,
    X,
    Home,
    Settings,
    LogOut,
    User as UserIcon,
    ChevronDown
} from 'lucide-react';

interface NavbarProps {
    currentPath?: string; // Mapped from currentView in App.tsx
    userName?: string;
    userInitials?: string;
    hasNotifications?: boolean;
    onSoundToggle?: () => void;
    onNotificationClick?: () => void;
    onLogout?: () => void;
    onNavigate: (view: string) => void;
}

const NAV_ITEMS = [
    { label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
    { label: 'Academics', id: 'academics', path: '/academics' },
    { label: 'Code Arena', id: 'code-arena', path: '/code-arena' },
    { label: 'Career', id: 'career', path: '/career' },
    { label: 'Community', id: 'community', path: '/community' },
    { label: 'About', id: 'about', path: '/about' },
];

const ModernNavbar: React.FC<NavbarProps> = ({
    currentPath,
    userName = 'Pranav Gawai',
    userInitials = 'PG',
    hasNotifications = false,
    onSoundToggle,
    onNotificationClick,
    onLogout,
    onNavigate
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSoundOn, setIsSoundOn] = useState(true);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close profile dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSoundToggle = () => {
        setIsSoundOn(!isSoundOn);
        onSoundToggle?.();
    };

    const handleNavClick = (id: string) => {
        onNavigate(id);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-md shadow-[0_1px_3px_rgba(0,0,0,0.05)] border-b border-gray-100 flex items-center justify-between font-['Inter']">

                {/* LEFT: LOGO */}
                <div
                    onClick={() => handleNavClick('dashboard')}
                    className="flex items-center gap-2.5 pl-6 cursor-pointer hover:opacity-80 transition-opacity duration-150"
                >
                    <span className="text-2xl">🎓</span>
                    <span className="text-[20px] font-bold text-black tracking-tight">SANKALAN</span>
                </div>

                {/* CENTER: MAIN NAVIGATION (Desktop) */}
                <div className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
                    {NAV_ITEMS.map((item) => {
                        const isActive = currentPath === item.id;
                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`
                  relative px-4 py-2 rounded-md transition-all duration-200 ease-in-out
                  text-[15px] font-medium
                  ${isActive
                                        ? 'text-black font-semibold bg-gray-100'
                                        : 'text-gray-500 hover:text-black hover:bg-gray-50 hover:scale-[1.02]'
                                    }
                `}
                            >
                                {item.label}
                                {isActive && (
                                    <span className="absolute bottom-1.5 left-4 right-4 h-[2px] bg-black rounded-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* RIGHT: ACTIONS & PROFILE */}
                <div className="flex items-center gap-3 pr-6">

                    {/* Mobile Menu Toggle */}
                    <button
                        className="lg:hidden p-2 text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMobileMenuOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    {/* Sound Toggle */}
                    <button
                        onClick={handleSoundToggle}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-150"
                    >
                        {isSoundOn ? <Volume2 size={20} /> : <VolumeX size={20} />}
                    </button>

                    {/* Notifications */}
                    <button
                        onClick={onNotificationClick}
                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-50 rounded-lg transition-all duration-150 relative"
                    >
                        <Bell size={20} />
                        {hasNotifications && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
                        )}
                    </button>

                    {/* Profile Dropdown */}
                    <div className="relative hidden md:block" ref={profileRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-2.5 pl-1.5 pr-3 py-1.5 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-150 group"
                        >
                            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-xs font-semibold">
                                {userInitials}
                            </div>
                            <span className="text-sm font-medium text-gray-900 group-hover:text-black">
                                {userName}
                            </span>
                        </button>

                        {isProfileOpen && (
                            <div className="absolute top-full right-0 mt-2 w-[220px] bg-white border border-gray-200 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.1)] p-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => { handleNavClick('dashboard'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <Home size={18} /> Dashboard
                                </button>
                                <button
                                    onClick={() => { handleNavClick('settings'); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-black hover:bg-gray-50 rounded-md transition-colors"
                                >
                                    <Settings size={18} /> Settings
                                </button>
                                <div className="h-px bg-gray-100 my-1" />
                                <button
                                    onClick={() => { onLogout?.(); setIsProfileOpen(false); }}
                                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                >
                                    <LogOut size={18} /> Logout
                                </button>
                            </div>
                        )}
                    </div>

                </div>
            </nav>

            {/* MOBILE MENU OVERLAY */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm animate-in fade-in duration-200 flex flex-col items-center justify-center">
                    <button
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="absolute top-6 right-6 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X size={32} />
                    </button>

                    <div className="flex flex-col items-center gap-6 w-full max-w-sm px-6">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => handleNavClick(item.id)}
                                className={`
                  text-lg font-medium tracking-wide transition-all duration-200
                  ${currentPath === item.id ? 'text-white border-b-2 border-white pb-1' : 'text-gray-400 hover:text-white hover:scale-105'}
                `}
                            >
                                {item.label}
                            </button>
                        ))}

                        <div className="w-full h-px bg-white/10 my-4" />

                        <button
                            onClick={() => { onLogout?.(); setIsMobileMenuOpen(false); }}
                            className="text-lg font-medium text-red-400 hover:text-red-300 transition-colors flex items-center gap-2"
                        >
                            <LogOut size={20} /> Logout
                        </button>
                    </div>
                </div>
            )}

            {/* Spacer */}
            <div className="h-16" />
        </>
    );
};

export default ModernNavbar;
