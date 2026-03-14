
import React, { useRef } from 'react';
import { HeroBanner } from './HeroBanner';
// import { FeaturesSection } from './FeaturesSection'; // COMMENTED: "Create Professional Photoshoots & Visuals Without a Studio" section - uncomment to restore
import { StatisticsSection } from './StatisticsSection';
import { WhyAIStudioSection } from './WhyAIStudioSection';
import { QualityComparisonSection } from './QualityComparisonSection';
import { GenerateContentSection } from './GenerateContentSection';
import { HowItWorksSection } from './HowItWorksSection';
import { FloatingGallerySection } from './FloatingGallerySection';
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

      {/* Floating Gallery Section */}
      <FloatingGallerySection />

      {/* Statistics Section */}
      <StatisticsSection />

      {/* COMMENTED: "Create Professional Photoshoots & Visuals Without a Studio" section - to restore: uncomment import above and the line below */}
      {/* <FeaturesSection /> */}

      {/* How to Use Section (includes YouTube videos) */}
      <HowItWorksSection />

      {/* Why MARO Studio Section */}
      <WhyAIStudioSection />

      {/* 4K Quality Comparison Section */}
      <QualityComparisonSection />

      {/* Generate Content Section */}
      <GenerateContentSection />

      <Footer ref={contactRef} />
    </div>
  );
};
