import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroImageCarousel } from './HeroImageCarousel';

interface HeroBannerProps {
  onStart?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onStart }) => {
  const navigate = useNavigate();

  const handleCreateImage = () => {
    if (onStart) {
      onStart();
    } else {
      navigate('/studio');
    }
  };

  const handleWatchDemo = () => {
    // Scroll to demo section or navigate to workflow
    const demoSection = document.getElementById('our-flow');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/workflow');
    }
  };

  return (
    <section className="hero-banner relative bg-black min-h-[calc(80vh)] flex items-center pt-4 pb-8 px-4 sm:px-6 lg:px-8 w-full -mx-4 sm:-mx-5 md:-mx-6 lg:-mx-8">
      {/* Background gradient overlay - matching website theme - Removed for better readability */}

      <div className="container-lg w-full max-w-7xl mx-auto">
        <div className="hero-content-wrapper grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left side - Text content */}
          <div className="hero-text w-full max-w-full text-left lg:text-left text-center lg:text-left flex flex-col justify-center animate-slide-up relative">
            {/* Soft radial glow behind text */}
            <div className="absolute top-1/2 left-0 w-[120%] h-[150%] -translate-y-1/2 -translate-x-[10%] bg:radial-gradient(circle_at_center,rgba(230,183,30,0.15)_0%,transparent_60%) pointer-events-none z-[-1]" style={{ background: 'radial-gradient(circle at center, rgba(230,183,30,0.15) 0%, transparent 60%)' }} />

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6 text-white tracking-tighter">
              One Click <span className="hero-gradient-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(248,205,107,0.3)]">Professional Photoshoot</span><br />
              Without Studio
            </h1>
            <h2 className="hero-desc text-lg sm:text-xl md:text-2xl font-light leading-relaxed text-neutral-300 mb-10 max-w-[90%] lg:max-w-full mx-auto lg:mx-0">
              Create stunning visuals with MARO Studio AI product photography and Marketing Poster generation powered by Growlouder Productions. No studio, no noise, just creation.
            </h2>

            {/* Taglines - visible with golden checkmarks */}
            <div className="tagline-button-alignment flex flex-wrap gap-3 justify-center lg:justify-start mb-10 animate-slide-up relative z-10" style={{ animationDelay: '0.2s' }}>
              <div className="tagline inline-flex items-center gap-2 px-5 py-2 bg-neutral-900/30 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-neutral-200 hover:bg-neutral-800/50 hover:border-gold-500/40 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-gold-400 flex-shrink-0" fill="currentColor">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                </svg>
                Free HD Download
              </div>
              <div className="tagline inline-flex items-center gap-2 px-5 py-2 bg-neutral-900/30 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-neutral-200 hover:bg-neutral-800/50 hover:border-gold-500/40 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-gold-400 flex-shrink-0" fill="currentColor">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                </svg>
                No Watermark
              </div>
              <div className="tagline inline-flex items-center gap-2 px-5 py-2 bg-neutral-900/30 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-neutral-200 hover:bg-neutral-800/50 hover:border-gold-500/40 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-gold-400 flex-shrink-0" fill="currentColor">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                </svg>
                Cost Effective
              </div>
              <div className="tagline inline-flex items-center gap-2 px-5 py-2 bg-neutral-900/30 backdrop-blur-md border border-white/10 rounded-full text-sm font-medium text-neutral-200 hover:bg-neutral-800/50 hover:border-gold-500/40 transition-all duration-300 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="16" height="16" className="text-gold-400 flex-shrink-0" fill="currentColor">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" />
                </svg>
                Consistent Quality
              </div>
            </div>

            {/* Buttons */}
            <div className="hero-button-alignment flex gap-4 justify-start lg:justify-start justify-center flex-wrap animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={handleCreateImage}
                className="group relative button-ui inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all duration-300 hover:shadow-[0_0_30px_rgba(240,196,100,0.5)] hover:-translate-y-1 overflow-hidden z-10"
              >
                <span className="absolute inset-0 w-[200%] h-full -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer" />
                <span className="relative z-10">Create Your First Image</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform transition-transform group-hover:translate-x-1 relative z-10">
                  <path d="M6 3L12 9L6 15" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={handleWatchDemo}
                className="button-demo inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg text-white font-semibold text-base cursor-pointer transition-all"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 11.4813V8.36103C4.5 4.47468 7.2466 2.8865 10.6098 4.82968L13.319 6.39917L16.0283 7.96865C19.3914 9.91183 19.3914 13.0882 16.0283 15.0313L13.319 16.6008L10.6098 18.1703C7.2466 20.1135 4.5 18.5253 4.5 14.639V11.4813Z" stroke="#f8cd6b" strokeWidth="1.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right side - Image Carousel */}
          <div className="hero-carousel-wrapper w-full max-w-full relative z-10 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <HeroImageCarousel />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slideUp 0.8s ease-out both;
        }
        @media (max-width: 1024px) {
          .hero-banner {
            min-height: auto;
            max-height: none;
          }
          .hero-content-wrapper {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            min-height: auto;
          }
          .hero-text {
            text-align: center;
          }
          .tagline-button-alignment {
            justify-content: center;
          }
          .hero-button-alignment {
            justify-content: center;
          }
        }
        @media (max-width: 768px) {
          .hero-banner {
            padding: 1rem 0;
            min-height: auto;
            max-height: none;
          }
          .hero-button-alignment {
            flex-direction: column;
            align-items: center;
            gap: 0.75rem;
            justify-content: center;
          }
          .button-ui,
          .button-demo {
            width: 100%;
            max-width: 320px;
          }
        }
      `}</style>
    </section>
  );
};
