import React, { useEffect, useRef, useState } from 'react';

export const QualityComparisonSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
            setIsAnimating(true);
            
            // Animation takes 8s total (5s zoom in, holds, then zoom out)
            // Let's match the timing of the CSS animation we're creating
            setTimeout(() => {
              setIsAnimating(false);
            }, 8000);
          }
        });
      },
      { threshold: 0.5 } // Trigger when 50% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <section ref={sectionRef} className="w-full py-24 px-4 md:px-8 bg-black relative flex flex-col items-center justify-center">
      <style>{`
        @keyframes customTwoStepZoom {
          0% { transform: scale(1) translate(0, 0); }
          35% { transform: scale(2.5) translate(0%, -10%); }
          55% { transform: scale(2.5) translate(0%, -10%); }
          100% { transform: scale(4.5) translate(3%, -20%); }
        }
        @keyframes autoZoomCycle {
          0% { transform: scale(1) translate(0, 0); }
          25% { transform: scale(2.5) translate(0%, -10%); }
          50% { transform: scale(4.5) translate(3%, -20%); }
          75% { transform: scale(2.5) translate(0%, -10%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        .zoom-image-layer {
          transition: transform 1.2s cubic-bezier(0.2, 0.8, 0.2, 1);
          will-change: transform;
        }
        .group:hover .zoom-image-layer {
          animation: customTwoStepZoom 8s ease-in-out forwards;
        }
        .auto-animating .zoom-image-layer {
          animation: autoZoomCycle 8s ease-in-out forwards;
        }
      `}</style>
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] max-w-[1000px] bg-gold-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl w-full z-10 flex flex-col items-center">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">
            Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-amber-200">4K Difference</span>
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto text-lg">
            See every detail crystal clear. Hover over the images to see the zoom effect, demonstrating how MARO Studio maintains flawless quality even up close.
          </p>
        </div>

        {/* Comparison Cards */}
        <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 w-full ${isAnimating ? 'auto-animating' : ''}`}>
          
          {/* HD Card */}
          <div className="flex flex-col items-center w-full">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 group relative bg-neutral-900 cursor-crosshair">
              {/* This is where the user will provide their HD image */}
              <img 
                src="/old-pixels-hd.jpeg" 
                alt="Standard HD Quality" 
                className="w-full h-full object-cover object-center zoom-image-layer origin-center"
              />
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-neutral-400"></span>
                <span className="text-sm font-semibold text-white tracking-wider">Standard HD</span>
              </div>
            </div>
            <p className="mt-4 text-neutral-400 text-sm">Typical 1080p Resolution (Blurred when scaled)</p>
          </div>

          {/* 4K Card */}
          <div className="flex flex-col items-center w-full">
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-gold-500/30 group relative bg-neutral-900 cursor-crosshair shadow-[0_0_30px_rgba(230,183,30,0.1)]">
              {/* This is where the user will provide their 4K image */}
              <img 
                src="/old-pixels-1767411677486.jpeg" 
                alt="MARO Studio 4K Quality" 
                className="w-full h-full object-cover object-center zoom-image-layer origin-center"
              />
              <div className="absolute top-4 left-4 bg-gold-500/20 backdrop-blur-md px-4 py-2 rounded-full border border-gold-500/50 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-gold-400 shadow-[0_0_8px_#fbbf24]"></span>
                <span className="text-sm font-semibold text-gold-100 tracking-wider">MARO Studio 4K</span>
              </div>
            </div>
            <p className="mt-4 text-gold-400/80 text-sm">Ultra HD Resolution (Flawless detail up close)</p>
          </div>

        </div>
      </div>
    </section>
  );
};
