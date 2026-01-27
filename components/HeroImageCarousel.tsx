import React, { useState, useEffect } from 'react';

interface ImageVariation {
  id: string;
  variations: string[];
}

export const HeroImageCarousel: React.FC = () => {
  // Main images configuration - each main image has 3 variations
  const mainImages: ImageVariation[] = [
    { id: 'a1', variations: ['a1-1', 'a1-2', 'a1-3'] },
    { id: 'a2', variations: ['a2-1', 'a2-2', 'a2-3'] },
    { id: 'a3', variations: ['a3-1', 'a3-2', 'a3-3'] },
    { id: 'a4', variations: ['a4-1', 'a4-2', 'a4-3'] },
    { id: 'a5', variations: ['a5-1', 'a5-2', 'a5-3'] },
    { id: 'a6', variations: ['a6-1', 'a6-2', 'a6-3'] },
    { id: 'a7', variations: ['a7-1', 'a7-2', 'a7-3'] },
  ];

  const [currentMainIndex, setCurrentMainIndex] = useState(0);
  const [currentVariationIndex, setCurrentVariationIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  // Preload current set of images
  const preloadVisibleImages = (mainIndex: number) => {
    const main = mainImages[mainIndex];
    
    // Preload current main image (all 3 variations)
    main.variations.forEach((variation) => {
      const imgPath = `/assets/images/hero-carousel/${main.id}/${variation}.png`;
      
      const img = new Image();
      img.src = imgPath;
      img.onload = () => {
        setImageLoaded((prev) => ({
          ...prev,
          [imgPath]: true
        }));
      };
      img.onerror = () => {
        setImageLoaded((prev) => ({
          ...prev,
          [imgPath]: false
        }));
      };
    });
  };

  // Initial preload for current view
  useEffect(() => {
    preloadVisibleImages(currentMainIndex);
  }, []);

  // Preload when main index changes
  useEffect(() => {
    preloadVisibleImages(currentMainIndex);
  }, [currentMainIndex]);

  useEffect(() => {
    // Single timer that changes every 2 seconds
    // After 3 variations (6 seconds total), move to next main image
    const timer = setInterval(() => {
      setCurrentVariationIndex((prevVariation) => {
        const nextVariation = prevVariation + 1;
        
        // If we've shown all 3 variations, move to next main image
        if (nextVariation >= 3) {
          // Preload next set of images
          const nextMain = (currentMainIndex + 1) % mainImages.length;
          preloadVisibleImages(nextMain);
          
          // Change main image instantly
          setCurrentMainIndex(nextMain);
          
          return 0; // Reset variation index
        }
        
        return nextVariation;
      });
    }, 2000); // 2 seconds per variation

    return () => {
      clearInterval(timer);
    };
  }, [currentMainIndex, mainImages.length]);

  // Get the actual image format based on folder
  const getBeforeImageFormat = (mainIndex: number): string => {
    const main = mainImages[mainIndex];
    // a1-main is jpg, all others are png
    return main.id === 'a1' ? 'jpg' : 'png';
  };

  // Get image path for variations (all are .png)
  const getImagePath = (mainIndex: number, variationIndex: number): string => {
    const main = mainImages[mainIndex];
    const variation = main.variations[variationIndex];
    return `/assets/images/hero-carousel/${main.id}/${variation}.png`;
  };

  // Get WebP image path for variations
  const getWebPImagePath = (mainIndex: number, variationIndex: number): string => {
    const main = mainImages[mainIndex];
    const variation = main.variations[variationIndex];
    return `/assets/images/hero-carousel/${main.id}/webp/${variation}.webp`;
  };

  // Get the "before" image path
  const getBeforeImagePath = (mainIndex: number): string => {
    const main = mainImages[mainIndex];
    const format = getBeforeImageFormat(mainIndex);
    return `/assets/images/hero-carousel/${main.id}/${main.id}-main.${format}`;
  };

  // Get WebP "before" image path
  const getWebPBeforeImagePath = (mainIndex: number): string => {
    const main = mainImages[mainIndex];
    return `/assets/images/hero-carousel/${main.id}/webp/${main.id}-main.webp`;
  };

  // Fallback image if carousel images don't exist
  const fallbackImage = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop';

  return (
    <div className="image-carousel-container relative w-full h-full min-h-[500px] flex items-center justify-center py-6">
      {/* Desktop Layout - Side by Side */}
      <div className="carousel-wrapper-desktop hidden md:flex items-center justify-center gap-8 w-full max-w-[1200px] relative">
        {/* Left Card - BEFORE IMAGE */}
        <div className="carousel-card-left relative rounded-2xl overflow-hidden w-[40%] h-[500px] transform z-[2] shadow-xl">
          <div className="card-image-wrapper w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
            <img
              key={`before-${currentMainIndex}`}
              src={getBeforeImagePath(currentMainIndex)}
              alt={`Before - ${mainImages[currentMainIndex].id}`}
              className="card-image w-full h-full object-cover opacity-0 transition-opacity duration-300"
              loading="eager"
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onError={(e) => {
                console.error(`Failed to load: ${getBeforeImagePath(currentMainIndex)}`);
                e.currentTarget.src = fallbackImage;
                e.currentTarget.style.opacity = '1';
              }}
            />
          </div>
          {/* BEFORE Badge - Left Corner Inside Image */}
          <div className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 z-10 shadow-lg">
            BEFORE
          </div>
        </div>

        {/* Right Card - AFTER IMAGE */}
        <div className="carousel-card-center relative rounded-2xl overflow-hidden cursor-pointer w-[60%] h-[550px] opacity-100 transform z-[3] shadow-2xl hover:scale-[1.02] transition-transform">
          <div className="card-image-wrapper w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
            <picture>
              <source srcSet={getWebPImagePath(currentMainIndex, currentVariationIndex)} type="image/webp" />
              <img
                key={`${currentMainIndex}-${currentVariationIndex}`}
                src={getImagePath(currentMainIndex, currentVariationIndex)}
                alt={`${mainImages[currentMainIndex].id} variation ${currentVariationIndex + 1}`}
                className="card-image w-full h-full object-cover opacity-0 transition-opacity duration-300"
                loading="eager"
                onLoad={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error(`Failed to load: ${getImagePath(currentMainIndex, currentVariationIndex)}`);
                  e.currentTarget.src = fallbackImage;
                  e.currentTarget.style.opacity = '1';
                }}
              />
            </picture>
          </div>
          {/* AFTER Badge - Left Corner Inside Image */}
          <div className="absolute top-5 left-5 bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-4 py-2 rounded-lg text-sm font-bold z-10 shadow-lg">
            AFTER
          </div>
          {/* Variation indicator */}
          <div className="variation-indicator absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`variation-dot w-2 h-2 rounded-full transition-all ${
                  idx === currentVariationIndex 
                    ? 'bg-white w-6 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          {/* Variation number display */}
          <div className="variation-badge absolute top-5 right-5 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-semibold z-10 backdrop-blur-md">
            {currentVariationIndex + 1}/3
          </div>
        </div>
      </div>

      {/* Mobile Layout - Vertical Stack with Full Image */}
      <div className="carousel-wrapper-mobile flex md:hidden flex-col items-center justify-center gap-3 w-full px-4">
        {/* BEFORE Image - Larger Size */}
        <div className="before-preview-mobile relative rounded-xl overflow-hidden w-full max-w-[280px] h-[240px] sm:max-w-[320px] sm:h-[280px] shadow-xl">
          <div className="card-image-wrapper w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
            <img
              key={`before-mobile-${currentMainIndex}`}
              src={getBeforeImagePath(currentMainIndex)}
              alt={`Before - ${mainImages[currentMainIndex].id}`}
              className="card-image w-full h-full object-cover opacity-0 transition-opacity duration-300"
              loading="eager"
              onLoad={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
              onError={(e) => {
                console.error(`Failed to load: ${getBeforeImagePath(currentMainIndex)}`);
                e.currentTarget.src = fallbackImage;
                e.currentTarget.style.opacity = '1';
              }}
            />
          </div>
          {/* BEFORE Badge - Left Corner Inside Image */}
          <div className="absolute top-3 left-3 bg-neutral-900/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 z-10 shadow-lg">
            BEFORE
          </div>
        </div>

        {/* Full Image - AFTER (Current Variation) */}
        <div className="carousel-card-mobile relative rounded-2xl overflow-hidden w-full max-w-[500px] aspect-[3/4] shadow-2xl">
          <div className="card-image-wrapper w-full h-full relative overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900">
            <picture>
              <source srcSet={getWebPImagePath(currentMainIndex, currentVariationIndex)} type="image/webp" />
              <img
                key={`mobile-${currentMainIndex}-${currentVariationIndex}`}
                src={getImagePath(currentMainIndex, currentVariationIndex)}
                alt={`${mainImages[currentMainIndex].id} variation ${currentVariationIndex + 1}`}
                className="card-image w-full h-full object-cover opacity-0 transition-opacity duration-300"
                loading="eager"
                onLoad={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                onError={(e) => {
                  console.error(`Failed to load: ${getImagePath(currentMainIndex, currentVariationIndex)}`);
                  e.currentTarget.src = fallbackImage;
                  e.currentTarget.style.opacity = '1';
                }}
              />
            </picture>
          </div>
          {/* AFTER Badge - Left Corner Inside Image */}
          <div className="absolute top-3 left-3 bg-gradient-to-r from-indigo-500 to-rose-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold z-10 shadow-lg">
            AFTER
          </div>
          {/* Variation indicator */}
          <div className="variation-indicator absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className={`variation-dot w-2 h-2 rounded-full transition-all ${
                  idx === currentVariationIndex 
                    ? 'bg-white w-6 rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.5)]' 
                    : 'bg-white/40'
                }`}
              />
            ))}
          </div>
          {/* Variation number display */}
          <div className="variation-badge absolute top-3 right-3 bg-black/70 text-white px-3 py-1.5 rounded-full text-xs font-semibold z-10 backdrop-blur-md">
            {currentVariationIndex + 1}/3
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .image-carousel-container {
            min-height: 250px;
          }
          .carousel-card-left {
            width: 38%;
            height: 350px;
          }
          .carousel-card-center {
            width: 62%;
            height: 450px;
          }
        }
        @media (max-width: 768px) {
          .carousel-wrapper-desktop {
            gap: 12px;
          }
          .carousel-card-left {
            width: 35%;
            height: 340px;
          }
          .carousel-card-center {
            width: 65%;
            height: 380px;
          }
          .variation-indicator {
            bottom: 10px;
          }
          .variation-dot {
            width: 6px;
            height: 6px;
          }
          .variation-dot.active {
            width: 20px;
          }
        }
        @media (max-width: 480px) {
          .carousel-card-mobile {
            max-width: 100%;
            aspect-ratio: 3/4;
          }
          .before-preview-mobile {
            max-width: 280px;
            height: 200px;
          }
        }
        @media (min-width: 481px) and (max-width: 767px) {
          .before-preview-mobile {
            max-width: 320px;
            height: 240px;
          }
        }
      `}</style>
    </div>
  );
};
