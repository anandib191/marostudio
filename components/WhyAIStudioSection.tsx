import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export const WhyAIStudioSection: React.FC = () => {
  const navigate = useNavigate();

  const benefits: Benefit[] = [
    {
      icon: '/assets/icons/studio-fill.svg',
      title: 'No Studio Required',
      description: 'The Smartest Way to Create Brand-Worthy Product Photos',
    },
    {
      icon: '/assets/icons/Lightning.svg',
      title: 'Lightning Fast',
      description: 'Get professional images in seconds.',
    },
    {
      icon: '/assets/icons/Effective.svg',
      title: 'Cost-Effective',
      description: 'Up to 95% cheaper than traditional photoshoots.',
    },
    {
      icon: '/assets/icons/Consistent.svg',
      title: 'Consistent Quality',
      description: 'Every product, every time—flawless, on-brand images.',
    },
  ];

  const handleCreateImage = () => {
    navigate('/studio');
  };

  return (
    <section className="why-ai-studio w-full py-8 md:py-12 bg-black relative">
      <div className="container-lg3 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="why-ai-studio-text text-center mb-8 md:mb-12 max-w-3xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] font-bold text-white mb-4 leading-tight tracking-tight">
            Why <span className="why-maro-gradient-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-600 bg-clip-text text-transparent drop-shadow-lg">MARO Studio</span>?
          </h2>
          <p className="text-base md:text-lg text-neutral-400 leading-relaxed">
            The Smartest Way to Create Brand-Worthy Product Photo's
          </p>
        </div>
        <div className="why-ai-studio-grid max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="why-ai-studio-grid-items benefits grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="icon-grid why-maro-benefit-box flex gap-4 p-6 bg-neutral-900 rounded-xl transition-all hover:translate-x-1 hover:shadow-lg"
              >
                <img
                  src={benefit.icon}
                  alt={benefit.title}
                  className="w-16 h-16 flex-shrink-0 transition-transform hover:scale-105"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {benefit.title}
                  </h3>
                  <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
            <div className="button-top-alignment mt-4 flex justify-center col-span-1 sm:col-span-2">
              <button
                onClick={handleCreateImage}
                className="button-ui inline-flex items-center gap-2.5 px-7 py-3.5 rounded-lg font-semibold text-lg cursor-pointer transition-all"
              >
                <span>Create Your First Image</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 3L10 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
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
        @media (max-width: 768px) {
          .why-ai-studio {
            padding: 1.5rem 0;
          }
          .why-ai-studio-text {
            margin-bottom: 1.5rem;
          }
          .why-ai-studio-grid-items.benefits {
            grid-template-columns: 1fr;
            max-width: 100%;
          }
          .icon-grid {
            gap: 1rem;
            padding: 1.5rem;
          }
          .icon-grid img {
            width: 3rem;
            height: 3rem;
          }
          .icon-grid h3 {
            font-size: 1.125rem;
          }
          .icon-grid p {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </section>
  );
};
