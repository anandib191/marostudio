
import React, { useRef } from 'react';
import { ImageCarousel } from './ImageCarousel';
import { DemoCard } from './DemoCard';
import { AIModelsGrid } from './AIModelsGrid';
import { Footer } from './Footer';

interface LandingPageProps {
  onStart: () => void;
  onBookDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBookDemo }) => {
  const contactRef = useRef<HTMLElement>(null);

  return (
    <div id="home" className="w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-7xl pt-4 md:pt-6 pb-4 animate-fade-in-up">
        <h1 className="font-serif-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white tracking-tighter leading-none mb-6">
            Vision <span className="font-sans italic text-neutral-400 font-light lowercase text-[0.6em] ml-2 tracking-normal">unbound.</span>
        </h1>
        <p className="text-[8px] md:text-[10px] uppercase tracking-[0.7em] font-medium text-neutral-500 mb-12">
            - no camera • no light • no shoot
        </p>
        <p className="mt-8 text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed">
          The future of product photography is neural. <br className="hidden md:block"/>
          Replace logistics with pure visual intelligence.
        </p>
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-5">
          <button
            onClick={onStart}
            className="text-[11px] uppercase tracking-[0.25em] text-white bg-indigo-600 hover:bg-indigo-500 font-bold py-4 px-12 rounded-full transition-all duration-500 transform hover:-translate-y-1 active:scale-95 shadow-xl shadow-indigo-900/30"
          >
            Enter Studio
          </button>
          <button
            onClick={onBookDemo}
            className="text-[11px] uppercase tracking-[0.25em] text-neutral-300 hover:text-white border border-white/10 hover:border-white/20 font-bold py-4 px-12 rounded-full transition-all duration-300"
          >
            Send Us Your Query
          </button>
        </div>
      </section>

      {/* Hero Showcase */}
      <div className="w-full mt-24 md:mt-40">
        <ImageCarousel />
      </div>

      {/* Narrative Section */}
      <section className="mt-32 md:mt-64 text-center animate-fade-in-up">
          <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white tracking-tighter mb-8">
            High-fashion. <br/>Zero studio time.
          </h2>
          <p className="mt-4 text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Empowering brands to scale their visual narrative at the speed of thought.
          </p>
      </section>

      {/* Feature Block 1: The Transformation (Structures Maintained) */}
      <section className="w-full max-w-7xl mt-24 md:mt-40 lg:mt-56 flex flex-col lg:flex-row items-center justify-between gap-12 md:gap-20 lg:gap-32 animate-fade-in-up">
          <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block text-[9px] uppercase tracking-[0.4em] font-bold text-indigo-400 mb-6 md:mb-8 bg-indigo-500/10 px-4 py-1.5 rounded-full">
                  Fabric to Frame
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter mb-6 md:mb-8 leading-tight">
                From flat-lay <br/>to editorial.
              </h2>
              <p className="text-neutral-400 text-base md:text-lg lg:text-xl font-light leading-relaxed mb-8 md:mb-12 max-w-xl">
                Upload raw product assets and witness their transformation into cinematic campaigns in under 60 seconds.
              </p>
              <button
                  onClick={onStart}
                  className="w-full sm:w-auto text-[10px] uppercase tracking-widest text-white bg-neutral-900 hover:bg-neutral-800 border border-white/5 font-bold py-4 px-12 rounded-full transition-all"
              >
                  Try Now
              </button>
          </div>
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
              {/* strukture unchanged as requested */}
              <DemoCard />
          </div>
      </section>
      
      {/* Feature Block 2: AI Models */}
      <section className="w-full max-w-7xl mt-24 md:mt-40 lg:mt-56 flex flex-col-reverse lg:flex-row items-center justify-between gap-12 md:gap-20 lg:gap-32 animate-fade-in-up">
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-start">
              <AIModelsGrid />
          </div>
          <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block text-[9px] uppercase tracking-[0.4em] font-bold text-indigo-400 mb-8 bg-indigo-500/10 px-4 py-1.5 rounded-full">
                  Diverse Casting
              </span>
              <h2 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tighter mb-8 leading-tight">
                Models for <br/>every identity.
              </h2>
              <p className="text-neutral-400 text-base md:text-lg lg:text-xl font-light leading-relaxed mb-8 md:mb-12 max-w-xl">
                Access a limitless library of AI personas. Casting is now a click, ensuring representation across all campaign touchpoints.
              </p>
              <button
                  onClick={onStart}
                  className="w-full sm:w-auto text-[10px] uppercase tracking-widest text-white bg-neutral-900 hover:bg-neutral-800 border border-white/5 font-bold py-4 px-12 rounded-full transition-all"
              >
                  Explore Personas
              </button>
          </div>
      </section>

      <Footer ref={contactRef}/>
    </div>
  );
};
