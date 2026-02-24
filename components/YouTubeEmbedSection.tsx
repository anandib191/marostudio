import React from 'react';

export const YouTubeEmbedSection: React.FC = () => {
  // Demo video IDs - Change these to your YouTube video IDs
  const video1Id = 'dQw4w9WgXcQ'; // Change this to your video ID
  const video2Id = 'jNQXAC9IVRw'; // Change this to your video ID

  return (
    <section className="youtube-embed-section w-full py-12 md:py-16 bg-black relative">
      <div className="container-lg3 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="youtube-embed-header text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white leading-tight tracking-tight">
            Learn How to Get{' '}
            <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">Max Results</span>
          </h2>
          <p className="mt-4 text-neutral-400 text-lg max-w-2xl mx-auto">
            Watch these quick demos to master the platform and create stunning visuals for your brand.
          </p>
        </div>

        {/* Videos Display */}
        <div className="videos-display-container grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="video-wrapper flex flex-col gap-4 transition-all hover:-translate-y-1">
            <div className="video-container relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10 transition-all hover:border-gold-500/30 hover:shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed/${video1Id}`}
                title="YouTube video player 1"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="youtube-iframe absolute top-0 left-0 w-full h-full border-none rounded-xl"
              ></iframe>
            </div>
            <div className="video-info px-2">
              <h3 className="text-xl font-semibold text-white leading-tight">Getting Started with MARO Studio</h3>
            </div>
          </div>

          <div className="video-wrapper flex flex-col gap-4 transition-all hover:-translate-y-1">
            <div className="video-container relative w-full pb-[56.25%] h-0 overflow-hidden rounded-xl bg-neutral-900 border border-white/10 transition-all hover:border-gold-500/30 hover:shadow-xl">
              <iframe
                src={`https://www.youtube.com/embed/${video2Id}`}
                title="YouTube video player 2"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="youtube-iframe absolute top-0 left-0 w-full h-full border-none rounded-xl"
              ></iframe>
            </div>
            <div className="video-info px-2">
              <h3 className="text-xl font-semibold text-white leading-tight">Creating Pro-Level Photoshoots</h3>
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
        @media (max-width: 1024px) {
          .videos-display-container {
            gap: 1.5rem;
          }
        }
        @media (max-width: 768px) {
          .youtube-embed-section {
            padding: 1.5rem 0;
          }
          .youtube-embed-header {
            margin-bottom: 1.5rem;
          }
          .youtube-embed-header h2 {
            font-size: 1.75rem;
          }
          .videos-display-container {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .video-info h3 {
            font-size: 1.125rem;
          }
        }
      `}</style>
    </section>
  );
};
