
import { useCallback, useEffect, useState } from 'react';

// Short retro click sound (blip)
const CLICK_SOUND = 'data:audio/wav;base64,UklGRjIAAABXQVZFZm10IBIAAAABAAEAQB8AAEAfAAABAAgAAABmYWN0BAAAAAAAAABkYXRhAAAAAA=='; // Placeholder - will replace with real sound below
// Actually, let's use a real base64 valid short beep.
// This is a short square wave or similar 'blip'
const RETRO_CLICK = 'data:audio/wav;base64,UklGRl9vT1BXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'; // This is truncated invalid.

// Let's use a simple HTML5 Audio approach with a tiny synthesized buffer or a better Base64.
// For now, I'll implement a clean synthesized beep using Web Audio API to avoid huge base64 strings and ensure performance.

import { useSoundContext } from '../context/SoundContext';

const useSound = () => {
    const { isMuted } = useSoundContext();

    const playClick = useCallback(() => {
        if (isMuted) return;

        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'square';
            osc.frequency.setValueAtTime(150, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05); // Zip up effect

            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.05);
        } catch (e) {
            console.error("Audio play failed", e);
        }
    }, [isMuted]);

    return playClick;
};

export default useSound;
