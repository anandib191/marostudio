import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'maro_studio_welcomed';

export const WelcomePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeVideo, setActiveVideo] = useState(0);

  const videos = [
    {
      title: 'Getting Started with MARO Studio',
      src: 'https://www.youtube.com/embed/ZB33feFCAwE',
    },
  ];

  useEffect(() => {
    const alreadyWelcomed = localStorage.getItem(STORAGE_KEY);
    if (!alreadyWelcomed) {
      // Small delay so the page loads first
      const timer = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, 'true');
  };

  const handleGetStarted = () => {
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="welcome-popup-backdrop" onClick={handleClose} />

      {/* Modal */}
      <div className="welcome-popup-modal">
        {/* Close button */}
        <button className="welcome-popup-close" onClick={handleClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Badge */}
        <div className="welcome-popup-badge">WELCOME</div>

        {/* Heading */}
        <h2 className="welcome-popup-heading">
          Learn How to Use<br />
          <span className="welcome-popup-heading-gold">MARO Studio</span>
        </h2>

        {/* Video heading */}
        <div className="welcome-popup-video-header">
          <h3 className="welcome-popup-video-title">{videos[0].title}</h3>
        </div>

        {/* Video embed */}
        <div className="welcome-popup-video-wrap">
          <iframe
            key={activeVideo}
            src={videos[activeVideo].src}
            title={videos[activeVideo].title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="welcome-popup-iframe"
          />
        </div>

        {/* Description */}
        <p className="welcome-popup-desc">
          Watch these quick tutorials to learn how to create stunning product photos with AI — from uploading your image to downloading the final result.
        </p>

        {/* Buttons */}
        <div className="welcome-popup-actions" style={{ marginTop: '1.25rem' }}>
          <button className="welcome-popup-btn-primary" onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="welcome-popup-btn-secondary" onClick={handleClose}>
            Skip for Now
          </button>
        </div>
      </div>

      <style>{`
        /* ── Backdrop ── */
        .welcome-popup-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          z-index: 9998;
          animation: welcomeFadeIn 0.3s ease forwards;
        }

        /* ── Modal ── */
        .welcome-popup-modal {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.95);
          z-index: 9999;
          width: 94vw;
          max-width: 520px;
          max-height: 90vh;
          overflow-y: auto;
          background: #111;
          border: 1px solid rgba(230, 183, 30, 0.15);
          border-radius: 1.25rem;
          padding: 2rem 1.75rem 1.75rem;
          box-shadow:
            0 24px 80px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(230, 183, 30, 0.08);
          animation: welcomeSlideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        /* ── Close ── */
        .welcome-popup-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          background: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: none !important;
        }
        .welcome-popup-close:hover {
          background: rgba(255, 255, 255, 0.12) !important;
          color: #fff;
          transform: none !important;
        }

        /* ── Badge ── */
        .welcome-popup-badge {
          display: inline-block;
          padding: 0.3rem 1rem;
          border-radius: 999px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #111;
          background: linear-gradient(90deg, #fadea5, #e6b71e);
          margin-bottom: 1rem;
        }

        /* ── Heading ── */
        .welcome-popup-heading {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          line-height: 1.25;
          margin-bottom: 1.25rem;
          letter-spacing: -0.01em;
        }
        .welcome-popup-heading-gold {
          background: linear-gradient(90deg, #fadea5, #f8cd6b, #e6b71e);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        /* ── Video Header ── */
        .welcome-popup-video-header {
          margin-bottom: 1rem;
          text-align: center;
        }
        .welcome-popup-video-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: #fff;
          opacity: 0.9;
        }

        /* ── Video ── */
        .welcome-popup-video-wrap {
          position: relative;
          width: 100%;
          padding-bottom: 56.25%;
          border-radius: 0.75rem;
          overflow: hidden;
          background: #000;
          border: 1px solid rgba(255, 255, 255, 0.06);
          margin-bottom: 1rem;
        }
        .welcome-popup-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }

        /* ── Description ── */
        .welcome-popup-desc {
          font-size: 0.82rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.45);
          margin-bottom: 1.25rem;
          text-align: center;
        }

        /* ── Actions ── */
        .welcome-popup-actions {
          display: flex;
          gap: 0.75rem;
        }
        .welcome-popup-btn-primary {
          flex: 1;
          padding: 0.8rem 1.25rem;
          border-radius: 0.6rem;
          font-weight: 700;
          font-size: 0.9rem;
          cursor: pointer;
          border: none !important;
          color: #111 !important;
          background: linear-gradient(90deg, #fadea5, #f8cd6b, #e6b71e) !important;
          box-shadow: 0 4px 20px rgba(230, 183, 30, 0.3) !important;
          transition: all 0.25s ease;
        }
        .welcome-popup-btn-primary:hover {
          box-shadow: 0 8px 30px rgba(230, 183, 30, 0.45) !important;
          transform: translateY(-2px) !important;
        }
        .welcome-popup-btn-secondary {
          flex: 1;
          padding: 0.8rem 1.25rem;
          border-radius: 0.6rem;
          font-weight: 600;
          font-size: 0.9rem;
          cursor: pointer;
          color: rgba(255, 255, 255, 0.55) !important;
          background: transparent !important;
          border: 1px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: none !important;
          transition: all 0.25s ease;
        }
        .welcome-popup-btn-secondary:hover {
          background: rgba(255, 255, 255, 0.05) !important;
          color: rgba(255, 255, 255, 0.8) !important;
          transform: none !important;
        }

        /* ── Animations ── */
        @keyframes welcomeFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes welcomeSlideUp {
          from {
            opacity: 0;
            transform: translate(-50%, -48%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        /* ── Mobile ── */
        @media (max-width: 640px) {
          .welcome-popup-modal {
            width: 92vw;
            max-width: none;
            max-height: 95dvh;
            padding: 1.4rem 1.1rem 1.2rem;
            border-radius: 0.875rem;
          }
          .welcome-popup-close {
            top: 0.75rem;
            right: 0.75rem;
            width: 28px;
            height: 28px;
          }
          .welcome-popup-close svg {
            width: 14px;
            height: 14px;
          }
          .welcome-popup-badge {
            padding: 0.2rem 0.65rem;
            font-size: 0.55rem;
            margin-bottom: 0.6rem;
          }
          .welcome-popup-heading {
            font-size: 1.15rem;
            margin-bottom: 0.75rem;
            line-height: 1.3;
          }
          .welcome-popup-tabs {
            flex-direction: row;
            gap: 0.3rem;
            margin-bottom: 0.65rem;
          }
          .welcome-popup-tab {
            padding: 0.4rem 0.45rem;
            font-size: 0.6rem;
            gap: 0.2rem;
            line-height: 1.3;
          }
          .welcome-popup-tab-num {
            font-size: 0.5rem;
          }
          .welcome-popup-video-wrap {
            padding-bottom: 48%;
            margin-bottom: 0.7rem;
            border-radius: 0.5rem;
          }
          .welcome-popup-desc {
            font-size: 0.68rem;
            line-height: 1.4;
            margin-bottom: 0.75rem;
          }
          .welcome-popup-actions {
            flex-direction: row;
            gap: 0.4rem;
          }
          .welcome-popup-btn-primary,
          .welcome-popup-btn-secondary {
            padding: 0.55rem 0.5rem;
            font-size: 0.78rem;
            border-radius: 0.5rem;
          }
        }

        /* Very small phones */
        @media (max-width: 380px) {
          .welcome-popup-modal {
            padding: 0.9rem 0.8rem 0.8rem;
          }
          .welcome-popup-heading {
            font-size: 1rem;
            margin-bottom: 0.5rem;
          }
          .welcome-popup-video-wrap {
            padding-bottom: 44%;
          }
          .welcome-popup-desc {
            display: none;
          }
        }
      `}</style>
    </>
  );
};
