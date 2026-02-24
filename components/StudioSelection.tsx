
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

const STUDIO_IMAGES: Record<Studio, string[]> = {
    photo: [
        '/assets/images/image_carousel/fashion/webp/fashion-1.webp',
        '/assets/images/image_carousel/fashion/webp/fashion-2.webp',
        '/assets/images/image_carousel/fashion/webp/fashion-3.webp',
    ],
    marketing: [
        '/assets/images/image_carousel/marketing/webp/marketing-1.webp',
        '/assets/images/image_carousel/marketing/webp/marketing-2.webp',
        '/assets/images/image_carousel/marketing/webp/marketing-3.webp',
    ],
};

export const StudioSelection: React.FC<StudioSelectionProps> = ({ onSelect, onBack }) => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cachedCount, setCachedCount] = useState(0);
    const [cycleIndex, setCycleIndex] = useState(0);

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

    useEffect(() => {
        const timer = setInterval(() => setCycleIndex(prev => (prev + 1) % 3), 2500);
        return () => clearInterval(timer);
    }, []);

    const studios: { id: Studio; name: string; desc: string; icon: React.FC<{ className?: string }> }[] = [
        { id: 'photo', name: 'Photo Studio', desc: 'Generate full photoshoots with AI models and custom styles.', icon: CameraIcon },
        { id: 'marketing', name: 'Marketing Studio', desc: 'Create professional promotional posters for your products.', icon: SparklesIcon },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center relative mb-10 md:mb-14">
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
                {studios.map((studio) => {
                    const images = STUDIO_IMAGES[studio.id];
                    return (
                        <GlassButton key={studio.id} onClick={() => onSelect(studio.id)} className="group w-full">
                            <div className="flex flex-col w-full overflow-hidden rounded-xl">
                                {/* Image area */}
                                <div className="relative w-full aspect-[4/3] overflow-hidden bg-neutral-900">
                                    {images.map((src, i) => (
                                        <img
                                            key={src}
                                            src={src}
                                            alt={studio.name}
                                            loading="lazy"
                                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out group-hover:scale-105 transition-transform duration-500"
                                            style={{ opacity: cycleIndex === i ? 1 : 0 }}
                                        />
                                    ))}
                                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent" />
                                </div>
                                {/* Label below */}
                                <div className="px-6 py-4 md:py-5 text-center">
                                    <h3 className="font-sans font-semibold text-xl md:text-2xl text-white mb-1">{studio.name}</h3>
                                    <p className="text-sm text-neutral-400">{studio.desc}</p>
                                </div>
                            </div>
                        </GlassButton>
                    );
                })}
            </div>
        </div>
    );
};
