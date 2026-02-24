import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StudioSelection } from './StudioSelection';
import { PhotoStudio } from './PhotoStudio';
import { MarketingStudio } from './MarketingStudio';
import { StudioSidebar } from './StudioSidebar';

type Studio = 'photo' | 'marketing';

// Map sidebar step index → PhotoStudio phase string (for jump navigation)
const PHOTO_STEP_PHASES = ['category', 'upload', 'details', 'generating'];

// Map PhotoStudio phase → sidebar step index
const phaseToStep = (phase: string): number => {
  switch (phase) {
    case 'category': return 0;
    case 'upload': return 1;
    case 'identification': return 2;
    case 'details': return 2;
    case 'generating': return 3;
    case 'results': return 4;
    default: return 0;
  }
};

export const StudioWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeStudio, setActiveStudio] = useState<Studio | null>(null);
  const [photoPhase, setPhotoPhase] = useState<string>('category');
  const [marketingStep, setMarketingStep] = useState<number>(0);

  // Ref to the jump function registered by PhotoStudio
  const jumpToPhaseRef = useRef<((phase: string) => void) | null>(null);

  // Reset on "Launch Studio" click from header
  useEffect(() => {
    if (location.state?.start) {
      setActiveStudio(null);
      setPhotoPhase('category');
      setMarketingStep(0);
      jumpToPhaseRef.current = null;
      navigate('/studio', { replace: true, state: {} });
    }
  }, [location.state?.start, navigate]);

  const handleStudioExit = () => {
    setActiveStudio(null);
    setPhotoPhase('category');
    setMarketingStep(0);
    jumpToPhaseRef.current = null;
  };

  // Called when user clicks a sidebar step
  const handleJumpToStep = (stepIndex: number, _phase?: string) => {
    if (activeStudio === 'photo' && jumpToPhaseRef.current) {
      const targetPhase = PHOTO_STEP_PHASES[stepIndex] ?? 'category';
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

      {/* ─── Left Sidebar ─── */}
      <StudioSidebar
        activeStudio={activeStudio}
        currentStep={currentSidebarStep}
        onSelectStudio={(studio) => setActiveStudio(studio)}
        onJumpToStep={handleJumpToStep}
        onExit={handleStudioExit}
      />

      {/* ─── Main Content ─── */}
      <main className="flex-1 min-w-0 overflow-x-hidden">
        <div className="w-full h-full py-8 px-6 md:px-10 lg:px-14">
          {!activeStudio && (
            <StudioSelection
              onSelect={(studio) => setActiveStudio(studio)}
              onBack={() => navigate('/')}
            />
          )}
          {activeStudio === 'photo' && (
            <PhotoStudio
              onExit={handleStudioExit}
              onContentGenerated={() => { }}
              onPhaseChange={(phase) => setPhotoPhase(phase)}
              onJumpToPhaseRef={(fn) => { jumpToPhaseRef.current = fn; }}
            />
          )}
          {activeStudio === 'marketing' && (
            <MarketingStudio
              onExit={handleStudioExit}
              onContentGenerated={() => { }}
              onStepChange={(step) => setMarketingStep(step)}
            />
          )}
        </div>
      </main>
    </div>
  );
};
