
import React, { useState, useEffect, useCallback } from 'react';

const carouselItems = [
    { 
        id: 1, 
        src: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop', 
        tag: 'Editorial', 
        title: "Women's Fashion" 
    },
    { 
        id: 2, 
        src: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop', 
        tag: 'Product', 
        title: 'Luxury Accessories' 
    },
    { 
        id: 3, 
        src: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1200&auto=format&fit=crop', 
        tag: 'Studio', 
        title: "Men's Tailoring" 
    },
    { 
        id: 4, 
        src: 'https://images.unsplash.com/photo-1519278477977-bc44a035cda1?q=80&w=1200&auto=format&fit=crop', 
        tag: 'Kids', 
        title: 'Youth Collection' 
    },
    { 
        id: 5, 
        src: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200&auto=format&fit=crop', 
        tag: 'Jewelry', 
        title: 'Fine Ornaments' 
    }
];

export const ImageCarousel: React.FC = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, []);

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [nextSlide]);

    return (
        <div className="w-full relative py-12 md:py-24 overflow-hidden perspective-container flex flex-col items-center">
            {/* Ambient Background Glow to match the active slide */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gold-500/10 blur-[200px] rounded-full pointer-events-none -z-10" />

            <div className="relative flex items-center justify-center w-full h-[450px] md:h-[650px]">
                {carouselItems.map((item, index) => {
                    const diff = index - activeIndex;
                    // Handle circular logic so the slider loops infinitely
                    let offset = diff;
                    if (diff > Math.floor(carouselItems.length / 2)) offset = diff - carouselItems.length;
                    if (diff < -Math.floor(carouselItems.length / 2)) offset = diff + carouselItems.length;

                    const isActive = offset === 0;
                    const isHidden = Math.abs(offset) > 1;

                    return (
                        <div
                            key={item.id}
                            className={`absolute transition-all duration-[1200ms] cubic-bezier(0.25, 1, 0.5, 1) transform-gpu ${
                                isHidden ? 'opacity-0 scale-50 pointer-events-none' : 'opacity-100'
                            }`}
                            style={{
                                zIndex: isActive ? 40 : 20 - Math.abs(offset),
                                transform: `
                                    translateX(${offset * 75}%) 
                                    scale(${isActive ? 1 : 0.65}) 
                                    rotateY(${offset * -25}deg)
                                `,
                                opacity: isActive ? 1 : 0.2
                            }}
                        >
                            <div className={`relative w-[280px] md:w-[480px] aspect-[3/4.5] rounded-[3rem] overflow-hidden border ${isActive ? 'border-white/20 shadow-[0_60px_120px_rgba(0,0,0,0.7)]' : 'border-white/5 shadow-2xl'} group bg-neutral-900`}>
                                <img
                                    src={item.src}
                                    alt={item.title}
                                    className={`w-full h-full object-cover transition-transform duration-[5000ms] ease-out ${
                                        isActive ? 'scale-105' : 'scale-125 grayscale-[40%]'
                                    }`}
                                />
                                
                                {/* Item Overlay Text - Sharp and clear on focus */}
                                <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                    <div className="absolute bottom-16 left-12 text-left">
                                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 mb-5 shadow-2xl">
                                            <div className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                                            <span className="text-[10px] uppercase tracking-[0.5em] font-bold text-gold-300">
                                                {item.tag}
                                            </span>
                                        </div>
                                        <h3 className="text-4xl md:text-6xl font-serif-display text-white italic tracking-tighter leading-none drop-shadow-2xl">
                                            {item.title}
                                        </h3>
                                    </div>
                                </div>

                                {/* Active card subtle glare */}
                                {isActive && (
                                    <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-transparent mix-blend-overlay" />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Premium Progress Indicators */}
            <div className="mt-16 flex gap-3">
                {carouselItems.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setActiveIndex(index)}
                        className={`h-1.5 rounded-full transition-all duration-1000 ${
                            activeIndex === index ? 'w-24 bg-gold-500' : 'w-4 bg-neutral-800 hover:bg-neutral-700'
                        }`}
                        aria-label={`Switch to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};
