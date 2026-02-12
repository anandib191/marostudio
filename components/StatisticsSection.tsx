import React, { useState, useEffect } from 'react';

interface Stat {
  number: string;
  label: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const StatisticsSection: React.FC = () => {
  const [stats, setStats] = useState<Stat[]>([
    { number: '4+', label: 'Categories' },
    { number: '10k+', label: 'Active Users' },
    { number: '50k+', label: 'Image Generated' },
    { number: '1k+', label: 'Active Subscription' },
  ]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await fetch(`${API_URL}/api/statistics`);
        const data = await response.json();
        if (data.success && data.statistics) {
          setStats([
            { number: data.statistics.categories || '4+', label: 'Categories' },
            { number: data.statistics.activeUsers || '10k+', label: 'Active Users' },
            { number: data.statistics.imageGenerated || '50k+', label: 'Image Generated' },
            { number: data.statistics.activeSubscription || '1k+', label: 'Active Subscription' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
        // Keep default values on error
      }
    };

    fetchStatistics();
  }, []);

  return (
    <section className="counter-section w-full py-8 md:py-12 bg-neutral-900 relative">
      <div className="container-lg w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="counter-grid grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-center animate-fade-in-up">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="stat-box"
              style={{ animationDelay: `${0.1 * (index + 1)}s` }}
            >
              <div className="upper-line"></div>
              <div className="stat-number">
                {stat.number}
              </div>
              <div className="stat-label">
                {stat.label}
              </div>
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
          .counter-section {
            padding: 1.5rem 0;
          }
          .counter-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }
          .counter-grid-item {
            padding: 1.5rem;
          }
          .counter-grid-item h3 {
            font-size: 2rem;
            margin-bottom: 0.5rem;
          }
          .counter-grid-item p {
            font-size: 0.875rem;
          }
        }
      `}</style>
    </section>
  );
};
