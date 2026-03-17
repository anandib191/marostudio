
import React, { useState, useEffect, useMemo } from 'react';

type LoadingMode = 'image';

const imageLoadingMessages = [
  "Painting with pixels and light...",
  "Warming up the AI's imagination...",
  "Stitching together the perfect shot...",
  "Consulting the digital muses...",
  "Developing stunning visuals...",
];

interface LoadingScreenProps {
    imageUrl?: string | null;
    generatedImages?: string[];
    mode: LoadingMode;
    message?: string;
    totalImages?: number;
}

const BackgroundSparkles = () => (
    <div className="absolute inset-0" aria-hidden="true">
        <div className="particle" style={{ left: '5%', width: '80px', height: '80px', animationDelay: '0s', animationDuration: '25s' }}></div>
        <div className="particle" style={{ left: '15%', width: '30px', height: '30px', animationDelay: '1s', animationDuration: '18s' }}></div>
        <div className="particle" style={{ left: '30%', width: '100px', height: '100px', animationDelay: '3s', animationDuration: '22s' }}></div>
        <div className="particle" style={{ left: '45%', width: '50px', height: '50px', animationDelay: '0s', animationDuration: '30s' }}></div>
        <div className="particle" style={{ left: '65%', width: '20px', height: '20px', animationDelay: '5s', animationDuration: '15s' }}></div>
        <div className="particle" style={{ left: '80%', width: '120px', height: '120px', animationDelay: '2s', animationDuration: '28s' }}></div>
        <div className="particle" style={{ left: '95%', width: '40px', height: '40px', animationDelay: '4s', animationDuration: '20s' }}></div>
    </div>
);


export const LoadingScreen: React.FC<LoadingScreenProps> = ({ imageUrl, generatedImages = [], message, totalImages }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [visibleImageIndex, setVisibleImageIndex] = useState(0);
  
  const loadingMessages = imageLoadingMessages;

  useEffect(() => {
        const interval = setInterval(() => {
            setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        }, 2500);
        return () => clearInterval(interval);
  }, [loadingMessages]);

  const allImages = useMemo(() => {
    return [imageUrl, ...generatedImages].filter((img): img is string => !!img);
  }, [imageUrl, generatedImages]);

  useEffect(() => {
    if (allImages.length > 1) {
      const interval = setInterval(() => {
        setVisibleImageIndex(prevIndex => (prevIndex + 1) % allImages.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [allImages.length]);
  
  const currentMessage = message || loadingMessages[messageIndex];
  const generatedCount = generatedImages.filter(Boolean).length;
  const total = totalImages || 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg flex flex-col items-center justify-center z-[100] animate-fade-in p-4 overflow-hidden">
      <BackgroundSparkles />
      <div className="relative z-10 flex flex-col items-center justify-center gap-8 w-full">
          
          <div className="loading-container w-full max-w-xs md:max-w-sm aspect-square bg-black/30 rounded-2xl shimmer-container overflow-hidden">
              {allImages.length > 0 ? (
                  <div className="relative w-full h-full">
                      {allImages.map((src, index) => (
                          <img 
                            key={`${src.substring(0, 20)}-${index}`}
                            src={src} 
                            alt={index === 0 ? "Original product" : `Generated image ${index}`}
                            className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${visibleImageIndex === index ? 'opacity-100' : 'opacity-0'}`}
                          />
                      ))}
                  </div>
              ) : imageUrl ? (
                 <img 
                    src={imageUrl} 
                    alt="Original product"
                    className="w-full h-full object-cover"
                  />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 rounded-full border-8 border-white/20"></div>
                        <div className="absolute inset-0 rounded-full border-8 border-transparent border-l-gold-500 animate-spin"></div>
                    </div>
                </div>
              )}
          </div>

          {/* Progress indicator */}
          {total > 0 && (
            <div className="w-full max-w-xs flex flex-col items-center gap-2">
                <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-gold-500 to-gold-400 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.max(5, (generatedCount / total) * 100)}%` }}
                    />
                </div>
                <p className="text-[11px] text-neutral-400 font-medium tracking-wide">
                    {generatedCount < total 
                        ? `Generating image ${generatedCount + 1} of ${total}...`
                        : 'Finishing up...'
                    }
                    <span className="text-neutral-600 ml-2">~{Math.max(10, (total - generatedCount) * 15)}s remaining</span>
                </p>
            </div>
          )}

          <div className="h-6 relative w-full max-w-sm overflow-hidden text-center">
              <p key={currentMessage} className="absolute inset-0 text-white text-lg font-medium animate-fade-in-up">
                  {currentMessage}
              </p>
          </div>
      </div>
    </div>
  );
};
