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
      {/* Background gradient overlay - matching website theme */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.04) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(244, 63, 94, 0.04) 0%, transparent 50%)
          `
        }}
      />

      <div className="container-lg w-full max-w-7xl mx-auto">
        <div className="hero-content-wrapper grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Left side - Text content */}
          <div className="hero-text w-full max-w-full text-left lg:text-left text-center lg:text-left flex flex-col justify-center animate-slide-up">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-4 text-white tracking-tight">
              One Click <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-rose-500 bg-clip-text text-transparent">Professional Photoshoot</span><br />
              Without Studio
            </h1>
            <h2 className="text-base sm:text-lg md:text-xl font-normal leading-relaxed text-neutral-400 mb-8 max-w-full">
              Create stunning visuals with MARO Studio AI product photography and Marketing Poster generation powered by Growlouder Productions. no studio, no noise, just creation.
            </h2>
            
            {/* Taglines */}
            <div className="tagline-button-alignment flex flex-wrap gap-3 justify-start lg:justify-start justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="tagline inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-md text-sm font-medium text-neutral-400 hover:border-indigo-500/30 hover:text-white transition-all hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" className="text-indigo-400 flex-shrink-0">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" fill="currentColor"></path>
                </svg>
                Free HD Download
              </div>
              <div className="tagline inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-md text-sm font-medium text-neutral-400 hover:border-indigo-500/30 hover:text-white transition-all hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" className="text-indigo-400 flex-shrink-0">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" fill="currentColor"></path>
                </svg>
                No Watermark
              </div>
              <div className="tagline inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-md text-sm font-medium text-neutral-400 hover:border-indigo-500/30 hover:text-white transition-all hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" className="text-indigo-400 flex-shrink-0">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" fill="currentColor"></path>
                </svg>
                Cost Effective
              </div>
              <div className="tagline inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-white/10 rounded-md text-sm font-medium text-neutral-400 hover:border-indigo-500/30 hover:text-white transition-all hover:-translate-y-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="18" height="18" className="text-indigo-400 flex-shrink-0">
                  <path d="M320 576C178.6 576 64 461.4 64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576zM438 209.7C427.3 201.9 412.3 204.3 404.5 215L285.1 379.2L233 327.1C223.6 317.7 208.4 317.7 199.1 327.1C189.8 336.5 189.7 351.7 199.1 361L271.1 433C276.1 438 282.9 440.5 289.9 440C296.9 439.5 303.3 435.9 307.4 430.2L443.3 243.2C451.1 232.5 448.7 217.5 438 209.7z" fill="currentColor"></path>
                </svg>
                Consistent Quality
              </div>
            </div>

            {/* Buttons */}
            <div className="hero-button-alignment flex gap-4 justify-start lg:justify-start justify-center flex-wrap animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <button
                onClick={handleCreateImage}
                className="button-ui inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-rose-500 border-none rounded-lg text-white font-semibold text-base cursor-pointer transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl hover:shadow-indigo-900/30"
              >
                <span>Create Your First Image</span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L12 9L6 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                onClick={handleWatchDemo}
                className="button-demo inline-flex items-center gap-2.5 px-8 py-4 bg-transparent border-[1.5px] border-indigo-500/30 rounded-lg text-white font-semibold text-base cursor-pointer transition-all hover:border-indigo-500/50 hover:bg-indigo-500/10 shadow-sm hover:shadow-md"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.5 11.4813V8.36103C4.5 4.47468 7.2466 2.8865 10.6098 4.82968L13.319 6.39917L16.0283 7.96865C19.3914 9.91183 19.3914 13.0882 16.0283 15.0313L13.319 16.6008L10.6098 18.1703C7.2466 20.1135 4.5 18.5253 4.5 14.639V11.4813Z" stroke="currentColor" strokeWidth="1.6" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
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
            align-items: stretch;
            gap: 0.75rem;
          }
          .button-ui,
          .button-demo {
            width: 100%;
            max-width: 320px;
            margin: 0 auto;
          }
        }
      `}</style>
    </section>
  );
};
