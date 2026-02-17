import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { StudioSelection } from './StudioSelection';
import { PhotoStudio } from './PhotoStudio';
import { MarketingStudio } from './MarketingStudio';

type Studio = 'photo' | 'marketing';

export const StudioWrapper: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeStudio, setActiveStudio] = useState<Studio | null>(null);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);

  // When Header/Dropdown "Launch Studio" is clicked while already on /studio, they pass state.start to reset to selection
  useEffect(() => {
    if (location.state?.start) {
      setActiveStudio(null);
      setHasGeneratedContent(false);
      navigate('/studio', { replace: true, state: {} });
    }
  }, [location.state?.start, navigate]);

  const handleStudioExit = () => {
    setActiveStudio(null);
    setHasGeneratedContent(false);
  };

  const handleContentGenerated = () => {
    setHasGeneratedContent(true);
  };

  if (activeStudio === 'photo') {
    return <PhotoStudio onExit={handleStudioExit} onContentGenerated={handleContentGenerated} />;
  }
  
  if (activeStudio === 'marketing') {
    return <MarketingStudio onExit={handleStudioExit} onContentGenerated={handleContentGenerated} />;
  }

  return (
    <StudioSelection 
      onSelect={(studio) => setActiveStudio(studio)} 
      onBack={() => navigate('/')} 
    />
  );
};
