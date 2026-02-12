import React from 'react';

interface Feature {
  dotColor: string;
  title: string;
  subtitle: string;
  description: string;
}

export const FeaturesSection: React.FC = () => {
  const features: Feature[] = [
    {
      dotColor: 'bg-gold-400',
      title: 'Fashion',
      subtitle: 'Fashion Photography',
      description: 'Transform your fashion and jewelry designs into runway-quality images with MARO Studio. Generate detailed, on-model photoshoots and unlimited variations for campaigns without the cost of traditional shoots.',
    },
    {
      dotColor: 'bg-gold-500',
      title: 'Accessories',
      subtitle: 'Accessories Photography',
      description: 'Elevate your jewelry, bags, watches, and accessories with AI-generated lifestyle and studio shots. Create stunning on-model or minimalist product visuals ideal for lookbooks, product pages, and high-engagement Instagram campaigns.',
    },
    {
      dotColor: 'bg-gold-400',
      title: 'Product',
      subtitle: 'Product Photography',
      description: 'Create clean, conversion-ready product images for any platform. From white-background Amazon shots to lifestyle visuals, our AI product photo generator delivers professional results, no studio needed. Generate endless variations for seasonal updates.',
    },
    {
      dotColor: 'bg-gold-600',
      title: 'Marketing & Ads',
      subtitle: 'Marketing & Ads Visuals',
      description: 'Generate eye-catching marketing materials, social media content, and ad creatives that stop the scroll. From Instagram carousels to billboard-worthy hero images, create diverse creative variations for every platform and audience segment. Test more concepts, find what resonates, and scale winning campaigns faster.',
    },
  ];

  return (
    <section className="features-section w-full py-8 md:py-12 bg-black relative">
      <div className="container-lg w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="features-text text-center mb-8 md:mb-12 max-w-3xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[38px] font-bold text-white mb-4 leading-tight tracking-tight">
            Create <span className="bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">Professional Photoshoots & Visuals</span> Without a Studio
          </h2>
          <p className="text-base md:text-lg text-neutral-300 leading-relaxed">
            The complete AI toolkit for fashion, product, and marketing content creation.
          </p>
        </div>
        <div className="features-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="features-grid-item bg-neutral-900 p-6 rounded-xl border border-white/10 transition-all hover:-translate-y-1.5 hover:border-gold-500/30 hover:shadow-xl relative overflow-hidden group"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              {/* Top gradient line on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-gold-500 to-gold-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="dot-text flex items-center gap-3 mb-4">
                <div className={`${feature.dotColor} w-2 h-2 rounded-full flex-shrink-0`}></div>
                <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  {feature.title}
                </h3>
              </div>
              <h4 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight tracking-tight">
                {feature.subtitle}
              </h4>
              <p className="text-sm md:text-base text-neutral-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
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
          .features-section {
            padding: 1.5rem 0;
          }
          .features-text {
            margin-bottom: 1.5rem;
          }
          .features-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .features-grid-item {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
};
