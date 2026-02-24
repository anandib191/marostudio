import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Benefit {
  icon: string;
  title: string;
  description: string;
  number: string;
}

export const WhyAIStudioSection: React.FC = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  const benefits: Benefit[] = [
    {
      icon: '/assets/icons/studio-fill.svg',
      title: 'No Studio Required',
      description: 'The Smartest Way to Create Brand-Worthy Product Photos',
      number: '01',
    },
    {
      icon: '/assets/icons/Lightning.svg',
      title: 'Lightning Fast',
      description: 'Get professional images in seconds.',
      number: '02',
    },
    {
      icon: '/assets/icons/Effective.svg',
      title: 'Cost-Effective',
      description: 'Up to 95% cheaper than traditional photoshoots.',
      number: '03',
    },
    {
      icon: '/assets/icons/Consistent.svg',
      title: 'Consistent Quality',
      description: 'Every product, every time—flawless, on-brand images.',
      number: '04',
    },
  ];

  const handleCreateImage = () => {
    navigate('/studio');
  };

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll('.why-card');
    if (!cards) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('why-card--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="why-ai-studio why-section-wrapper" ref={sectionRef}>
      {/* Radial background glow */}
      <div className="why-section-bg-glow" />

      <div className="why-section-inner">
        {/* ── Heading ── */}
        <div className="why-heading-block">
          <h2 className="why-heading">
            Why{' '}
            <span className="why-maro-gradient-text">MARO Studio</span>?
          </h2>
          <div className="why-heading-accent" />
          <p className="why-subtitle">
            The Smartest Way to Create Brand-Worthy Product Photos
          </p>
        </div>

        {/* ── Cards ── */}
        <div className="why-cards-row">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="why-card"
              style={{ animationDelay: `${i * 0.12}s` }}
            >
              {/* Gold top-edge glow line */}
              <div className="why-card-top-glow" />

              {/* Number badge */}
              <span className="why-card-number">{b.number}</span>

              {/* Icon */}
              <div className="why-card-icon-ring">
                <img
                  src={b.icon}
                  alt={b.title}
                  className="why-card-icon-img"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>

              {/* Text */}
              <h3 className="why-card-title">{b.title}</h3>
              <p className="why-card-desc">{b.description}</p>
            </div>
          ))}
        </div>

        {/* ── CTA ── */}
        <div className="why-cta-wrap">
          <button onClick={handleCreateImage} className="why-cta-btn">
            <span>Create Your First Image</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 3L10 8L6 13"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
