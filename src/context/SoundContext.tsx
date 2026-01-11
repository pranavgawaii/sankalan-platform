
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SoundContextType {
    isMuted: boolean;
    toggleMute: () => void;
    setMuted: (muted: boolean) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Initialize from localStorage if available, default to false (sound on)
    const [isMuted, setIsMuted] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('sankalan_sound_muted');
            return saved === 'true';
        }
        return false;
    });

    useEffect(() => {
        localStorage.setItem('sankalan_sound_muted', String(isMuted));
    }, [isMuted]);

    const toggleMute = () => setIsMuted(prev => !prev);
    const setMuted = (muted: boolean) => setIsMuted(muted);

    return (
        <SoundContext.Provider value={{ isMuted, toggleMute, setMuted }}>
            {children}
        </SoundContext.Provider>
    );
};

export const useSoundContext = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSoundContext must be used within a SoundProvider');
    }
    return context;
};
