import React, { useState, useEffect, useRef } from 'react';

interface Step {
  icon: string;
  number: string;
  title: string;
  description: string;
}

export const HowItWorksSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(false);
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const steps: Step[] = [
    {
      icon: '/assets/icons/upload-file.svg',
      number: '/assets/icons/01.svg',
      title: 'Upload Your Product Image',
      description: 'Start by uploading a clean, high-quality photo of your product.',
    },
    {
      icon: '/assets/icons/Theme.svg',
      number: '/assets/icons/02.svg',
      title: 'Choose Theme & Add Details',
      description: 'Select from a range of high-end aesthetics and add product details.',
    },
    {
      icon: '/assets/icons/download-fill.svg',
      number: '/assets/icons/03.svg',
      title: 'Download Your Asset',
      description: 'Export professional PDF catalogs and high-resolution image ZIPs.',
    },
  ];

  const themes = ['Modern', 'Cinematic', 'Vintage', 'Monochrome', 'Aesthetic', 'Close Up'];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => {
        const nextStep = (prev + 1) % steps.length;
        if (nextStep === 0) {
          setUploadedImage(false);
        } else if (nextStep === 1) {
          setSelectedButton(null);
          setTimeout(() => {
            setSelectedButton(0); // Select first button (Modern)
          }, 500);
        }
        return nextStep;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isVisible, steps.length]);

  useEffect(() => {
    if (activeStep === 0 && isVisible) {
      setTimeout(() => {
        setUploadedImage(true);
      }, 1500);
    }
  }, [activeStep, isVisible]);

  useEffect(() => {
    if (activeStep === 1 && isVisible) {
      setTimeout(() => {
        setSelectedButton(0); // Select first button (Modern)
      }, 1000);
    }
  }, [activeStep, isVisible]);

  const renderStepAnimation = () => {
    switch (activeStep) {
      case 0:
        return (
          <div className="step-animation-container w-full h-full flex flex-col overflow-hidden">
            <div className="step-title text-lg font-bold text-white mb-4 flex-shrink-0">Upload Your Product Image</div>
            <div className="upload-area flex-1 flex items-center overflow-hidden">
              <div className={`upload-box w-full h-full max-h-full rounded-xl border-2 border-dashed transition-all duration-500 flex items-center justify-center ${
                uploadedImage ? 'border-green-500 bg-green-500/10 p-4' : 'border-white/20 bg-neutral-900 p-8'
              }`}>
                {!uploadedImage ? (
                  <div className="upload-placeholder animate-fade-in text-center">
                    <div className="upload-icon-wrapper mb-4">
                      <img src="/assets/icons/upload-file.svg" alt="Upload" className="w-12 h-12 mx-auto opacity-50" />
                    </div>
                    <div className="upload-text text-neutral-400">
                      <p className="font-medium">Drag & Drop your image here</p>
                      <span className="text-sm">or click to browse</span>
                    </div>
                    <div className="upload-progress mt-4 h-1 bg-white/10 rounded-full overflow-hidden max-w-xs mx-auto">
                      <div className="upload-progress-bar h-full bg-indigo-500 animate-pulse" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                ) : (
                  <div className="uploaded-preview relative w-full max-w-sm h-full max-h-[420px] mx-auto rounded-lg overflow-hidden animate-fade-in-scale bg-neutral-800 shadow-xl">
                    <img 
                      src="/assets/images/flow/img_upload.jpg" 
                      alt="Uploaded" 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.error('Failed to load img_upload.jpg, trying .png');
                        e.currentTarget.src = '/assets/images/flow/img_upload.png';
                        e.currentTarget.onerror = () => {
                          console.error('All formats failed for img_upload');
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                        };
                      }} 
                    />
                    <div className="upload-success absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 animate-slide-in-right shadow-lg z-10 text-sm">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span className="font-semibold">Image Uploaded</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="step-animation-container w-full h-full flex flex-col justify-center">
            <div className="step-title text-lg font-bold text-white mb-5 text-center flex-shrink-0">Choose Theme & Add Details</div>
            <div className="theme-buttons-container grid grid-cols-2 gap-2.5 flex-1 content-center">
              {themes.map((theme, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setSelectedButton(index);
                  }}
                  className={`theme-button h-[60px] rounded-lg border-2 transition-all duration-300 cursor-pointer relative flex items-center justify-center font-semibold text-xs ${
                    selectedButton === index
                      ? 'border-indigo-500 bg-gradient-to-r from-indigo-500 via-indigo-400 to-rose-400 text-black scale-105 shadow-[0_4px_12px_rgba(99,102,241,0.4)]'
                      : 'border-white/20 bg-neutral-900 text-white hover:border-indigo-500/50 hover:bg-indigo-500/5'
                  }`}
                  style={selectedButton === index ? { animation: 'selectButton 0.4s ease-out' } : {}}
                >
                  <span className="font-semibold">{theme}</span>
                  {selectedButton === index && (
                    <div className="selection-arrow absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-r from-indigo-500 to-rose-400 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(99,102,241,0.5)]" style={{ animation: 'arrowAppear 0.5s ease-out' }}>
                      <svg width="14" height="14" viewBox="0 0 20 20" fill="none" className="text-black">
                        <path d="M5 7L10 12L15 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="step-animation-container w-full">
            <div className="step-title text-lg font-bold text-white mb-5">Download Your Asset</div>
            <div className="photo-grid grid grid-cols-3 gap-3 mb-5">
              {[1, 2, 3].map((item, index) => (
                <div
                  key={index}
                  className="photo-grid-item rounded-lg overflow-hidden border border-white/10 hover:border-indigo-500/50 transition-all animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <picture>
                    <source srcSet={`/assets/images/flow/webp/hero${item}.webp`} type="image/webp" />
                    <img
                      src={`/assets/images/flow/hero${item}.png`}
                      alt={`Photo ${item}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        console.error(`Failed to load hero${item}.png, trying .jpg`);
                        const currentSrc = e.currentTarget.src;
                        if (currentSrc.endsWith('.png')) {
                          e.currentTarget.src = `/assets/images/flow/hero${item}.jpg`;
                        } else {
                          console.error(`All formats failed for hero${item}`);
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
                        }
                      }}
                    />
                  </picture>
                </div>
              ))}
            </div>
            <div className="download-button inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-rose-500 text-white font-semibold text-sm rounded-lg cursor-pointer hover:shadow-lg transition-all">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M10 13V3M10 13L6 9M10 13L14 9M3 16H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>Download All</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="how-it-works w-full pt-8 md:pt-12 pb-4 md:pb-6 bg-black relative" id="our-flow" ref={sectionRef}>
      <div className="container-lg3 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="how-it-works-text text-center mb-6 md:mb-8 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-tight tracking-tight">
            How to <span className="bg-gradient-to-r from-indigo-400 via-indigo-500 to-rose-500 bg-clip-text text-transparent">Use</span>
          </h2>
        </div>
        <div className="how-it-works-grid grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="steps-container flex flex-col gap-0 relative">
            {/* Process Bar */}
            <div className="process-bar absolute left-0 top-0 bottom-0 w-1 z-10 pointer-events-none">
              <div className="process-line absolute left-0.5 top-0 w-0.5 h-full bg-transparent rounded-sm">
                <div
                  className={`process-fill absolute left-0.5 top-0 w-0.5 bg-gradient-to-b from-indigo-500 to-rose-500 rounded-sm transition-all duration-1000 ${
                    activeStep === 0 ? 'h-[33.33%]' : activeStep === 1 ? 'h-[66.66%]' : 'h-full'
                  }`}
                  style={{ boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)' }}
                ></div>
              </div>
            </div>

            {steps.map((step, index) => (
              <div
                key={index}
                className="how-it-works-item relative pl-12 pb-8"
              >
                {/* Process Node */}
                <div
                  className={`process-node absolute left-0 top-0 w-4 h-4 rounded-full border-2 transform -translate-y-1/2 transition-all z-20 ${
                    index === activeStep
                      ? 'bg-gradient-to-r from-indigo-500 to-rose-500 border-indigo-500 scale-125'
                      : 'bg-transparent border-white/20'
                  }`}
                  style={{ left: 'calc(2px - 8px - 1.5rem)' }}
                ></div>
                <div className="border-text">
                  <div className="spacing">
                    <div className="icon-counter flex items-center gap-4 mb-3">
                      <img
                        src={step.icon}
                        alt={step.title}
                        className="w-10 h-10 opacity-70"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <img
                        src={step.number}
                        alt={`Step ${index + 1}`}
                        className="w-8 h-8"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Animation Container */}
          <div className="animation-container bg-neutral-900 rounded-xl p-5 border border-white/10 h-[500px] flex flex-col overflow-hidden">
            {renderStepAnimation()}
          </div>
        </div>

        {/* YouTube Videos Section - Integrated without header */}
        <div className="videos-section mt-12 md:mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="videos-display-container grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start">
            <div className="video-wrapper flex flex-col gap-4 transition-all hover:-translate-y-1">
              <div className="video-container relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10 transition-all hover:border-indigo-500/30 hover:shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                  title="YouTube video player 1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="youtube-iframe absolute top-0 left-0 w-full h-full border-none rounded-xl"
                ></iframe>
              </div>
              <div className="video-info px-2">
                <h3 className="text-xl font-semibold text-white leading-tight">Video 1</h3>
              </div>
            </div>

            <div className="video-wrapper flex flex-col gap-4 transition-all hover:-translate-y-1">
              <div className="video-container relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10 transition-all hover:border-indigo-500/30 hover:shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/jNQXAC9IVRw"
                  title="YouTube video player 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="youtube-iframe absolute top-0 left-0 w-full h-full border-none rounded-xl"
                ></iframe>
              </div>
              <div className="video-info px-2">
                <h3 className="text-xl font-semibold text-white leading-tight">Video 2</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slideInRight {
          0% {
            opacity: 0;
            transform: translateX(20px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes selectButton {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1.05);
          }
        }
        @keyframes arrowAppear {
          0% {
            opacity: 0;
            transform: scale(0) rotate(-180deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        .animate-fade-in-up {
          animation: slideUp 0.6s ease-out both;
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out both;
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.6s ease-out both;
        }
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out 0.3s both;
        }
        .upload-placeholder {
          transition: opacity 0.3s ease-out;
        }
        .uploaded-preview {
          transition: opacity 0.3s ease-out;
        }
        @media (max-width: 768px) {
          .how-it-works {
            padding: 1.5rem 0;
          }
          .how-it-works-text {
            margin-bottom: 1.5rem;
          }
          .how-it-works-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .theme-buttons-container {
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
          }
          .theme-button {
            height: 60px !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>
    </section>
  );
};
