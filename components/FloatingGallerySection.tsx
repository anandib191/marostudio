import React from 'react';

const row1 = [
    '/assets/images/hero-carousel/a10/webp/a10-1.webp',
    '/assets/images/hero-carousel/a9/webp/a9-1.webp',
    '/assets/images/hero-carousel/a8/webp/a8-1.webp',
    '/assets/images/hero-carousel/a7/webp/a7-1.webp',
    '/assets/images/hero-carousel/a5/webp/a5-1.webp',
    '/assets/images/hero-carousel/a4/webp/a4-1.webp',
    '/assets/images/hero-carousel/a3/webp/a3-1.webp',
];

const row2 = [
    '/assets/images/hero-carousel/a10/webp/a10-2.webp',
    '/assets/images/hero-carousel/a9/webp/a9-2.webp',
    '/assets/images/hero-carousel/a8/webp/a8-2.webp',
    '/assets/images/hero-carousel/a7/webp/a7-2.webp',
    '/assets/images/hero-carousel/a5/webp/a5-2.webp',
    '/assets/images/hero-carousel/a4/webp/a4-2.webp',
    '/assets/images/hero-carousel/a3/webp/a3-2.webp',
];

const row3 = [
    '/assets/images/hero-carousel/a10/webp/a10-3.webp',
    '/assets/images/hero-carousel/a9/webp/a9-3.webp',
    '/assets/images/hero-carousel/a8/webp/a8-3.webp',
    '/assets/images/hero-carousel/a7/webp/a7-3.webp',
    '/assets/images/hero-carousel/a5/webp/a5-3.webp',
    '/assets/images/hero-carousel/a4/webp/a4-3.webp',
    '/assets/images/hero-carousel/a3/webp/a3-3.webp',
];

export const FloatingGallerySection: React.FC = () => {
    return (
        <section className="w-full relative bg-black py-4 overflow-hidden border-t border-white/5">
            {/* Edge Gradients for smooth fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

            <div className="flex flex-col gap-4 md:gap-5 w-full">
                {/* Row 1 - Left to Right */}
                <div className="relative flex overflow-hidden w-full">
                    <div className="flex gap-4 md:gap-5 animate-marquee-right shrink-0 min-w-full">
                        {[...row1, ...row1, ...row1, ...row1].map((src, i) => (
                            <div key={`r1-${i}`} className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] aspect-square rounded-2xl md:rounded-3xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10 opacity-80 transition-opacity hover:opacity-100">
                                <img src={src} alt="Gallery item" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 2 - Right to Left */}
                <div className="relative flex overflow-hidden w-full">
                    <div className="flex gap-4 md:gap-5 animate-marquee-left shrink-0 min-w-full">
                        {[...row2, ...row2, ...row2, ...row2].map((src, i) => (
                            <div key={`r2-${i}`} className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] aspect-square rounded-2xl md:rounded-3xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10 opacity-80 transition-opacity hover:opacity-100">
                                <img src={src} alt="Gallery item" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Row 3 - Left to Right */}
                <div className="relative flex overflow-hidden w-full hidden sm:flex">
                    <div className="flex gap-4 md:gap-5 animate-marquee-right-fast shrink-0 min-w-full">
                        {[...row3, ...row3, ...row3, ...row3].map((src, i) => (
                            <div key={`r3-${i}`} className="w-[120px] sm:w-[150px] md:w-[180px] lg:w-[220px] aspect-square rounded-2xl md:rounded-3xl overflow-hidden shrink-0 bg-neutral-900 border border-white/10 opacity-80 transition-opacity hover:opacity-100">
                                <img src={src} alt="Gallery item" className="w-full h-full object-cover" loading="lazy" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-marquee-left {
          animation: marquee-left 90s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 100s linear infinite;
        }
        .animate-marquee-right-fast {
          animation: marquee-right 80s linear infinite;
        }
      `}</style>
        </section>
    );
};
