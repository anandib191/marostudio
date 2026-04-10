import React from "react";

export const HowItWorksSection: React.FC = () => {
  return (
    <section
      className="how-it-works w-full pt-8 md:pt-12 pb-4 md:pb-6 bg-black relative"
      id="our-flow"
    >
      <div className="container-lg3 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="how-it-works-text text-center mb-6 md:mb-8 animate-fade-in-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-bold text-white leading-tight tracking-tight">
            How to{" "}
            <span className="how-to-use-gradient-text bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">
              Use
            </span>
          </h2>
        </div>

        {/* YouTube Video Section - Integrated without header */}
        <div
          className="videos-section mt-8 md:mt-12 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="video-display-container max-w-4xl mx-auto">
            <div className="video-wrapper flex flex-col gap-4 transition-all hover:-translate-y-1">
              <div className="video-container relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10 transition-all hover:border-gold-500/30 hover:shadow-xl">
                <iframe
                  src="https://www.youtube.com/embed/ZB33feFCAwE"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="youtube-iframe absolute top-0 left-0 w-full h-full border-none rounded-xl"
                ></iframe>
              </div>
              <div className="video-info px-2 text-center">
                <h3 className="text-xl font-semibold text-white leading-tight">
                  Getting Started with MARO Studio
                </h3>
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
        .animate-fade-in-up {
          animation: slideUp 0.6s ease-out both;
        }
      `}</style>
    </section>
  );
};
