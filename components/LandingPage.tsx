
import React, { useRef } from 'react';
import { HeroBanner } from './HeroBanner';
import { FeaturesSection } from './FeaturesSection';
import { StatisticsSection } from './StatisticsSection';
import { WhyAIStudioSection } from './WhyAIStudioSection';
import { GenerateContentSection } from './GenerateContentSection';
import { HowItWorksSection } from './HowItWorksSection';
import { Footer } from './Footer';

interface LandingPageProps {
  onStart: () => void;
  onBookDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart, onBookDemo }) => {
  const contactRef = useRef<HTMLElement>(null);

  return (
    <div id="home" className="w-full flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Hero Banner Section - Full width below navbar */}
      <HeroBanner onStart={onStart} />

      {/* Statistics Section */}
      <StatisticsSection />

      {/* Features Section - Professional Photoshoots & Visuals */}
      <FeaturesSection />

      {/* Why MARO Studio Section */}
      <WhyAIStudioSection />

      {/* Generate Content Section */}
      <GenerateContentSection />

      {/* How to Use Section (includes YouTube videos) */}
      <HowItWorksSection />

      <Footer ref={contactRef}/>
    </div>
  );
};
