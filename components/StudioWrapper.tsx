import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhotoStudio } from './PhotoStudio';
import { MarketingStudio } from './MarketingStudio';
import { StudioSidebar } from './StudioSidebar';
import { ThemeToggle } from './ThemeToggle';

type Studio = 'photo' | 'marketing';

// Map sidebar step index → PhotoStudio phase string (for jump navigation)
const PHOTO_STEP_PHASES = ['details', 'generating', 'results'];

// Map PhotoStudio phase → sidebar step index
const phaseToStep = (phase: string): number => {
  switch (phase) {
    case 'category': return 0;
    case 'upload': return 0;
    case 'identification': return 0;
    case 'details': return 0;
    case 'generating': return 1;
    case 'results': return 2;
    default: return 0;
  }
};

export const StudioWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Default directly to 'photo' studio — skip the StudioSelection screen
  const [activeStudio, setActiveStudio] = useState<Studio>('photo');
  const [photoPhase, setPhotoPhase] = useState<string>('details');
  const [marketingStep, setMarketingStep] = useState<number>(0);
  // Light/Dark theme for the main studio content panel
  const [isLight, setIsLight] = useState(true);

  // Ref to the jump function registered by PhotoStudio
  const jumpToPhaseRef = useRef<((phase: string) => void) | null>(null);

  // Reset on "Launch Studio" click from header
  useEffect(() => {
    if (location.state?.start) {
      setActiveStudio('photo');
      setPhotoPhase('details');
      setMarketingStep(0);
      jumpToPhaseRef.current = null;
      navigate('/studio', { replace: true, state: {} });
    }
  }, [location.state?.start, navigate]);

  const handleStudioExit = () => {
    setActiveStudio('photo');
    setPhotoPhase('details');
    setMarketingStep(0);
    jumpToPhaseRef.current = null;
  };

  // Called when user clicks a sidebar step
  const handleJumpToStep = (stepIndex: number, _phase?: string) => {
    if (activeStudio === 'photo' && jumpToPhaseRef.current) {
      const targetPhase = PHOTO_STEP_PHASES[stepIndex] ?? 'details';
      jumpToPhaseRef.current(targetPhase);
    }
    if (activeStudio === 'marketing') {
      setMarketingStep(stepIndex);
    }
  };

  const currentSidebarStep =
    activeStudio === 'photo'
      ? phaseToStep(photoPhase)
      : activeStudio === 'marketing'
        ? marketingStep
        : -1;

  return (
    <div className="flex w-full" style={{ minHeight: 'calc(100vh - 64px)' }}>

      {/* ─── Left Sidebar — always dark ─── */}
      <StudioSidebar
        activeStudio={activeStudio}
        currentStep={currentSidebarStep}
        onSelectStudio={(studio) => setActiveStudio(studio)}
        onJumpToStep={handleJumpToStep}
        onExit={handleStudioExit}
      />

      {/* ─── Main Content ─── */}
      <main
        className={`flex-1 min-w-0 overflow-x-hidden relative transition-colors duration-500 ${isLight ? 'studio-light' : ''}`}
      >
        {/* Theme Toggle — always in top-right corner of main content */}
        <div className="absolute top-4 right-4 z-50">
          <ThemeToggle isLight={isLight} onToggle={() => setIsLight(l => !l)} />
        </div>

        <div className="w-full h-full py-8 px-6 md:px-10 lg:px-14">
          {activeStudio === 'photo' && (
            <PhotoStudio
              onExit={handleStudioExit}
              onContentGenerated={() => { }}
              onPhaseChange={(phase) => setPhotoPhase(phase)}
              onJumpToPhaseRef={(fn) => { jumpToPhaseRef.current = fn; }}
              isLight={isLight}
            />
          )}
          {activeStudio === 'marketing' && (
            <MarketingStudio
              onExit={handleStudioExit}
              onContentGenerated={() => { }}
              onStepChange={(step) => setMarketingStep(step)}
              isLight={isLight}
            />
          )}
        </div>
      </main>
    </div>
  );
};
