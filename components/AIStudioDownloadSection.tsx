import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

export const AIStudioDownloadSection: React.FC = () => {
  return (
    <section className="ai-studio-download w-full py-8 md:py-12 bg-black relative">
      <div className="container-lg4 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="download-box grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center animate-fade-in-up">
          <div className="download-spacing animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="download-title mb-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white mb-3 leading-tight tracking-tight">
                The AI Studio Image Generator at a glance now
              </h2>
              <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
                AI isn't here to replace human creativity but it can amplify it
              </p>
            </div>
            <div className="download-subbox">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-400 via-indigo-500 to-rose-500 bg-clip-text text-transparent leading-tight">
                AI Studio App
              </h3>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                Start Your Product Shoot
              </h3>
              <div className="scan-code flex flex-col sm:flex-row gap-4 sm:gap-6 items-start mt-6 p-4 sm:p-6 bg-neutral-900 rounded-xl border border-white/10 transition-all hover:border-indigo-500/30 hover:shadow-lg">
                <div className="code flex-shrink-0 transition-transform hover:scale-105">
                  <QRCodeSVG
                    value="https://play.google.com/store/apps/details?id=com.app.ai.studio"
                    size={140}
                    level="H"
                    includeMargin={true}
                    style={{ borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '8px', background: '#FFFFFF' }}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm md:text-base text-neutral-400 mb-4 leading-relaxed">
                    Create stunning product photos in seconds with AI. Download the AI Studio App now!
                  </p>
                  <div className="playstore transition-transform hover:scale-105">
                    <a 
                      href="https://play.google.com/store/apps/details?id=com.app.ai.studio" 
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img 
                        src="/assets/icons/google-play.svg" 
                        alt="Get it on Google Play" 
                        className="h-14 w-auto"
                        onError={(e) => {
                          // Fallback if image doesn't exist
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mobile-image flex justify-center items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <img 
              src="/assets/images/ai-studio-mobile.png" 
              alt="AI Studio Mobile App" 
              className="max-w-full h-auto filter drop-shadow-[0_16px_48px_rgba(0,0,0,0.4)] transition-transform hover:-translate-y-1"
              onError={(e) => {
                // Fallback placeholder if image doesn't exist
                e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="600" viewBox="0 0 300 600"%3E%3Crect fill="%23111111" width="300" height="600"/%3E%3Ctext fill="%23444" x="50%25" y="50%25" text-anchor="middle" font-size="16"%3EMobile App Preview%3C/text%3E%3C/svg%3E';
              }}
            />
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
        .animate-fade-in-up {
          animation: slideUp 0.6s ease-out both;
        }
        @media (max-width: 1024px) {
          .download-box {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .mobile-image {
            order: -1;
          }
        }
        @media (max-width: 768px) {
          .ai-studio-download {
            padding: 1.5rem 0;
          }
          .download-title h2 {
            font-size: 1.75rem;
          }
          .download-title p {
            font-size: 1rem;
          }
          .download-subbox h3 {
            font-size: 1.375rem;
          }
          .scan-code {
            flex-direction: column;
            gap: 1rem;
          }
          .playstore img {
            height: 3rem;
          }
        }
      `}</style>
    </section>
  );
};
