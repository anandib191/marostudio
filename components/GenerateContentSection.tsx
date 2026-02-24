import React, { useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

export const GenerateContentSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('Fashion Photography');
  const [isHovered, setIsHovered] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const swiperRef = useRef<any>(null);

  const handleImageLoad = (imageId: string) => {
    setLoadedImages(prev => new Set(prev).add(imageId));
  };

  // Category configuration with folder mapping
  const categoryConfig = [
    { name: 'Fashion Photography', folder: 'fashion' },
    { name: 'Accessories Photography', folder: 'accessories' },
    { name: 'Product Photography', folder: 'product' },
    { name: 'Marketing & Ads', folder: 'marketing' },
  ];

  const categories = categoryConfig.map(cat => cat.name);

  // Generate 3 images per category using new folder structure
  const generateImageArray = () => {
    const images: Array<{
      id: string;
      folder: string;
      category: string;
      imageNumber: number;
    }> = [];

    categoryConfig.forEach((config) => {
      for (let i = 1; i <= 3; i++) {
        images.push({
          id: `${config.folder}-${i}`,
          folder: config.folder,
          category: config.name,
          imageNumber: i,
        });
      }
    });

    return images;
  };

  const images = generateImageArray();
  const filteredImages = images.filter(img => img.category === activeCategory);

  // Auto-scroll through images of active category, then move to next category
  useEffect(() => {
    if (isHovered) {
      // When hovering, pause auto-scroll but don't clear intervals
      // This ensures smooth resume when mouse leaves
      return;
    }

    let imageIndex = 0;
    const currentFilteredImages = images.filter(img => img.category === activeCategory);
    const totalImages = currentFilteredImages.length; // Should be 3 per category

    // Check if small screen (mobile/tablet)
    const isSmallScreen = window.innerWidth < 1024;
    // On small screens: Match button animation (5s) - show 3 images in 5s = ~1.67s per image
    // On desktop: Show all 3 images at once, so no need to auto-scroll through individual images
    const imageChangeInterval = isSmallScreen ? 1667 : null; // No auto-scroll on desktop (showing all 3)
    const categoryChangeInterval = isSmallScreen ? 5000 : 7500; // Match button animation (5s) on small screens

    // Scroll through all images of current category one by one
    const imageInterval = setInterval(() => {
      if (!isHovered && swiperRef.current && swiperRef.current.swiper) {
        imageIndex = (imageIndex + 1) % totalImages;
        swiperRef.current.swiper.slideTo(imageIndex);
      }
    }, imageChangeInterval);

    // After showing all images of current category, move to next category
    const categoryInterval = setInterval(() => {
      if (!isHovered) {
        setIsTransitioning(true);

        setTimeout(() => {
          const currentIndex = categories.indexOf(activeCategory);
          const nextIndex = (currentIndex + 1) % categories.length;
          setActiveCategory(categories[nextIndex]);
          imageIndex = 0; // Reset image index for new category

          // Reset swiper to first slide of new category
          setTimeout(() => {
            if (swiperRef.current && swiperRef.current.swiper) {
              // On large screens, ensure we're at the start to show all 3 images
              swiperRef.current.swiper.slideTo(0);
            }
            setIsTransitioning(false);
          }, 300);
        }, 300);
      }
    }, categoryChangeInterval);

    return () => {
      if (imageInterval) clearInterval(imageInterval);
      clearInterval(categoryInterval);
    };
  }, [activeCategory, isHovered, categories, images]);

  // Get folder name from category
  const getCategoryFolder = (categoryName: string): string => {
    const config = categoryConfig.find(cat => cat.name === categoryName);
    return config ? config.folder : 'fashion';
  };

  // Helper function to get image path with multiple format support
  const getImagePath = (folder: string, imageNumber: number): string => {
    // Return base path without extension - we'll try multiple formats
    return `/assets/images/image_carousel/${folder}/${folder}-${imageNumber}`;
  };

  // Helper function to get WebP image path
  const getWebPImagePath = (folder: string, imageNumber: number): string => {
    return `/assets/images/image_carousel/${folder}/webp/${folder}-${imageNumber}.webp`;
  };

  const handleCategoryClick = (category: string) => {
    if (category === activeCategory) return;

    setIsTransitioning(true);
    setTimeout(() => {
      setActiveCategory(category);
      // Reset swiper to first slide when category changes
      setTimeout(() => {
        if (swiperRef.current && swiperRef.current.swiper) {
          swiperRef.current.swiper.slideTo(0);
        }
        setIsTransitioning(false);
      }, 300);
    }, 300);
  };

  return (
    <section className={`generate-section w-full py-12 bg-neutral-900 ${isHovered ? 'carousel-hovered' : ''}`}>
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-4xl font-bold text-white mb-4">
            Turn Products into <span className="scroll-stoppers-gradient-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">Scroll-Stoppers</span>
          </h2>
          <p className="text-lg text-neutral-400">
            Create studio quality visuals with advanced AI that transforms your ideas into stunning photographs.
          </p>
        </div>

        {/* Category Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden transform hover:scale-105 ${activeCategory === category
                ? 'generate-active-cat-btn text-white shadow-lg shadow-gold-500/50 scale-105'
                : 'generate-inactive-cat-btn text-neutral-300 hover:bg-neutral-700/80 hover:shadow-md'
                }`}
            >
              <span className="relative z-10">{category}</span>
              {activeCategory === category && (
                <div className="absolute bottom-0 left-0 h-0.5 generate-section-flow-line animate-progress z-0 progress-bar-small-screen"></div>
              )}
              {activeCategory !== category && (
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/5 to-gold-500/0 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Carousel */}
      <div
        className={`max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 transition-opacity duration-300 flex justify-center ${isTransitioning ? 'opacity-0' : 'opacity-100'
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Swiper
          ref={swiperRef}
          spaceBetween={32}
          slidesPerView={1}
          speed={600}
          loop={false}
          allowTouchMove={true}
          grabCursor={true}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            640: {
              slidesPerView: 1,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 1,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 32,
            },
            1280: {
              slidesPerView: 3,
              spaceBetween: 40,
            },
          }}
          className="mySwiper"
        >
          {filteredImages.map((image, index) => {
            const isLoaded = loadedImages.has(image.id);
            const webpPath = getWebPImagePath(image.folder, image.imageNumber);

            return (
              <SwiperSlide key={image.id}>
                <div className="image-card group">
                  <div className="image-container">
                    {/* Loading Skeleton */}
                    {!isLoaded && (
                      <div className="loading-skeleton">
                        <div className="skeleton-shimmer"></div>
                        <div className="skeleton-content">
                          <div className="skeleton-circle"></div>
                          <div className="skeleton-text"></div>
                        </div>
                      </div>
                    )}

                    {/* Actual Image with Lazy Loading - WebP with fallback */}
                    <picture>
                      <source srcSet={getWebPImagePath(image.folder, image.imageNumber)} type="image/webp" />
                      <img
                        src={webpPath}
                        alt={`${image.category} - Image ${image.imageNumber}`}
                        className={`carousel-image ${isLoaded ? 'loaded' : 'loading'}`}
                        loading="lazy"
                        decoding="async"
                        onLoad={() => handleImageLoad(image.id)}
                        onError={(e) => {
                          const currentSrc = e.currentTarget.src;
                          const basePath = getImagePath(image.folder, image.imageNumber);
                          // Try different formats as fallback
                          if (currentSrc.includes('/webp/')) {
                            e.currentTarget.src = `${basePath}.png`;
                          } else if (currentSrc.endsWith('.png')) {
                            e.currentTarget.src = `${basePath}.jpg`;
                          } else {
                            // All failed, use fallback
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop';
                            handleImageLoad(image.id);
                          }
                        }}
                      />
                    </picture>
                    <div className="image-overlay"></div>
                  </div>
                  <div className="image-label">
                    <div className="label-dot"></div>
                    <span>{image.category}</span>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <style>{`
        .mySwiper {
          padding: 32px 0;
        }

        .image-card {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          animation: fadeInSlide 0.6s ease-out both;
        }

        @keyframes fadeInSlide {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .image-card:nth-child(1) { animation-delay: 0.1s; }
        .image-card:nth-child(2) { animation-delay: 0.2s; }
        .image-card:nth-child(3) { animation-delay: 0.3s; }

        .image-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(230, 183, 30, 0.3);
          border-color: rgba(230, 183, 30, 0.5);
        }

        .image-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
        }

        /* Responsive image sizing for 3 images on large screens */
        @media (min-width: 1024px) {
          .image-card {
            aspect-ratio: 3/4;
            height: 480px;
          }
          
          .image-container {
            height: 100%;
          }
          
          .mySwiper {
            padding: 24px 0;
          }
        }
        
        @media (max-width: 1023px) {
          .image-card {
            aspect-ratio: 3/4;
            height: 380px;
            margin: 0 auto;
          }
          
          .mySwiper {
            display: flex;
            justify-content: center;
          }
        }

        /* Loading Skeleton */
        .loading-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .skeleton-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.05) 50%,
            transparent 100%
          );
          animation: shimmer 2s infinite;
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .skeleton-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          z-index: 1;
        }

        .skeleton-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 3px solid rgba(99, 102, 241, 0.3);
          border-top-color: #e6b71e;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .skeleton-text {
          width: 120px;
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          animation: pulse 1.5s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }

        /* Image Loading States */
        .carousel-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .carousel-image.loading {
          opacity: 0;
          transform: scale(1.1);
        }

        .carousel-image.loaded {
          opacity: 1;
          transform: scale(1);
          animation: imageReveal 0.6s ease-out;
        }

        @keyframes imageReveal {
          from {
            opacity: 0;
            filter: blur(10px);
            transform: scale(1.05);
          }
          to {
            opacity: 1;
            filter: blur(0);
            transform: scale(1);
          }
        }

        .image-card:hover .carousel-image.loaded {
          transform: scale(1.1);
        }

        .image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(230, 183, 30, 0.1) 0%,
            rgba(0, 0, 0, 0.4) 50%,
            rgba(0, 0, 0, 0.7) 100%
          );
          opacity: 0;
          transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .image-card:hover .image-overlay {
          opacity: 1;
        }

        .image-card::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 12px;
          border: 2px solid transparent;
          background: linear-gradient(135deg, #e6b71e, #ae820d) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .image-card:hover::after {
          opacity: 0.5;
        }

        .image-label {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-size: 14px;
          font-weight: 500;
          transform: translateY(100%);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.9) 60%);
          backdrop-filter: blur(4px);
        }

        .image-card:hover .image-label {
          transform: translateY(0);
        }

        .label-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #e6b71e;
          box-shadow: 0 0 8px rgba(230, 183, 30, 0.6);
          animation: dotPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }

        @keyframes dotPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.2);
          }
        }

        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }

        .animate-progress {
          animation: progress 7.5s linear;
        }
        
        @media (max-width: 1023px) {
          .progress-bar-small-screen {
            animation: progress 5s linear;
          }
        }

        /* Performance Optimizations */
        .image-card,
        .carousel-image,
        .image-overlay,
        .loading-skeleton {
          will-change: transform, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }

        /* Smooth scrolling */
        .mySwiper {
          -webkit-overflow-scrolling: touch;
          scroll-behavior: smooth;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .mySwiper {
            padding: 24px 0;
          }

          .image-card:hover {
            transform: translateY(-4px);
          }

          @keyframes fadeInSlide {
            from {
              opacity: 0;
              transform: translateY(20px) scale(0.97);
            }
            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }

        /* Reduce motion for accessibility */
        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </section>
  );
};
