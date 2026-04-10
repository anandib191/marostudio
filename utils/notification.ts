import { toast } from 'react-toastify';

export const playNotificationSound = () => {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5

        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

        osc1.start(ctx.currentTime);
        osc2.start(ctx.currentTime);
        osc1.stop(ctx.currentTime + 0.8);
        osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
        console.warn('Could not play notification sound', e);
    }
};

export const notifyGenerationComplete = (feature: string = 'Photoshoot') => {
    // Check if the user is currently looking at the studio page
    const isStudioVisible = document.visibilityState === 'visible' && window.location.pathname.includes('/studio');
    
    // Dispatch a global event so the sidebar can show the "New" badge
    window.dispatchEvent(new CustomEvent('generation_complete'));
    
    if (!isStudioVisible) {
        playNotificationSound();
        toast.success(`✨ Your ${feature} generation is complete!`, {
            position: 'top-right',
            autoClose: 6000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'dark'
        });
    }
};
