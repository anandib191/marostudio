
import React, { useState, useEffect } from 'react';
import { BuildingIcon } from './icons/BuildingIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const images = {
  original: {
    src: 'https://images.unsplash.com/photo-1611312449412-6cefac5dc3e4?q=80&w=800&auto=format&fit=crop',
    label: 'Original',
    icon: <BuildingIcon className="w-4 h-4" />,
  },
  refreshed: {
    src: 'https://images.unsplash.com/photo-1551028719-00167b16e2d8?q=80&w=800&auto=format&fit=crop',
    label: 'Refreshed',
    icon: <SparklesIcon className="w-4 h-4" />,
  },
};

export const CatalogRefreshCard: React.FC = () => {
    const [activeView, setActiveView] = useState<'original' | 'refreshed'>('original');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveView(prev => prev === 'original' ? 'refreshed' : 'original');
        }, 4000); 

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        setProgress(0);
        const timer = setTimeout(() => setProgress(100), 100);
        return () => clearTimeout(timer);
    }, [activeView]);

    const currentImage = images[activeView];

    return (
        <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-4 animate-float-card" style={{animationDelay: '300ms'}}>
            <div className="relative w-full aspect-[3/4] bg-neutral-800 rounded-2xl border border-white/10 shadow-2xl overflow-hidden p-3">
                <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <div className="relative w-full h-full">
                        {Object.entries(images).map(([key, img]) => (
                            <img
                                key={key}
                                src={img.src}
                                alt={img.label}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeView === key ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                    </div>

                    <div className="absolute top-4 left-4 z-10">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-white font-semibold text-sm backdrop-blur-sm animate-fade-in ${activeView === 'original' ? 'bg-neutral-800/60' : 'bg-orange-500/80'}`}>
                            {currentImage.icon}
                            <span>{currentImage.label}</span>
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 z-10">
                        <div className="p-3 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg">
                            <p className="text-center text-sm font-semibold text-neutral-800 mb-2">Catalog Refresh</p>
                            <div className="w-full bg-neutral-300 rounded-full h-1.5 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-1.5 rounded-full"
                                    style={{ width: `${progress}%`, transition: 'width 3.8s linear' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex items-center justify-center gap-2">
                <button aria-label="Show original image" onClick={() => setActiveView('original')} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeView === 'original' ? 'bg-rose-500' : 'bg-neutral-600 hover:bg-neutral-400'}`} />
                <button aria-label="Show refreshed image" onClick={() => setActiveView('refreshed')} className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${activeView === 'refreshed' ? 'bg-rose-500' : 'bg-neutral-600 hover:bg-neutral-400'}`} />
            </div>
        </div>
    );
};
