
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CameraIcon } from './icons/CameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { GlassButton } from './ui/GlassButton';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { getCacheStats } from '../utils/cacheManager';

type Studio = 'photo' | 'marketing';

interface StudioSelectionProps {
    onSelect: (studio: Studio) => void;
    onBack: () => void;
}

export const StudioSelection: React.FC<StudioSelectionProps> = ({ onSelect, onBack }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cachedCount, setCachedCount] = useState(0);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);

        // Get cached images count (async)
        const loadCacheStats = async () => {
            try {
                const stats = await getCacheStats();
                setCachedCount(stats.totalImages);
            } catch (error) {
                console.error('Failed to load cache stats:', error);
                setCachedCount(0);
            }
        };
        loadCacheStats();
    }, []);

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center relative mb-12 md:mb-16">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                    aria-label="Go back to landing page"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Home</span>
                </button>
                <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-normal">Choose Your Studio</h2>
                <p className="mt-2 text-neutral-300">What would you like to create today?</p>
            </div>
            <div className="w-full max-w-sm md:max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <GlassButton onClick={() => onSelect('photo')} className="group w-full">
                    <div className="px-6 py-8 md:py-12 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                        <CameraIcon className="w-10 h-10 md:w-14 md:h-14 text-gold-300 group-hover:text-gold-200 transition-colors duration-300" />
                        <h3 className="font-sans font-semibold text-xl md:text-2xl text-white">Photo Studio</h3>
                        <p className="text-sm text-neutral-400 text-center">Generate full photoshoots with AI models and custom styles.</p>
                    </div>
                </GlassButton>
                <GlassButton onClick={() => onSelect('marketing')} className="group w-full">
                    <div className="px-6 py-8 md:py-12 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                        <SparklesIcon className="w-10 h-10 md:w-14 md:h-14 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
                        <h3 className="font-sans font-semibold text-xl md:text-2xl text-white">Marketing Studio</h3>
                        <p className="text-sm text-neutral-400 text-center">Create professional promotional posters for your products.</p>
                    </div>
                </GlassButton>
            </div>

            {/* Previously Generated Button - Only show if user is logged in */}
            {isLoggedIn && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={() => navigate('/previously-generated')}
                        className="group relative px-6 py-3 bg-gradient-to-r from-gold-600/20 to-gold-600/20 hover:from-gold-600/30 hover:to-gold-600/30 border border-gold-500/30 hover:border-gold-500/50 rounded-xl transition-all duration-300 flex items-center gap-3"
                    >
                        <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-white">Previously Generated</span>
                            {cachedCount > 0 && (
                                <span className="px-2 py-0.5 bg-gold-500/30 text-gold-300 text-xs font-bold rounded-full">
                                    {cachedCount}
                                </span>
                            )}
                        </div>
                        <svg className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            )}
        </div>
    );
};
