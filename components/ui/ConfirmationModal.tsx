import React, { useEffect } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonClass?: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmButtonClass = 'bg-red-600 hover:bg-red-500',
}) => {
  // Disable body scroll and prevent background interaction when modal is open
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      // Prevent interaction with background elements
      const mainContent = document.querySelector('main');
      if (mainContent) {
        (mainContent as HTMLElement).style.pointerEvents = 'none';
      }

      // Cleanup function
      return () => {
        document.body.style.overflow = originalOverflow;
        if (mainContent) {
          (mainContent as HTMLElement).style.pointerEvents = '';
        }
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '20vh',
        pointerEvents: 'auto'
      }}
    >
      {/* Backdrop - Blurs ONLY the background, overlay stays sharp */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleCancel}
        onMouseDown={(e) => e.preventDefault()}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 100,
          cursor: 'pointer',
          pointerEvents: 'auto',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      />
      
      {/* Modal - Sharp and in focus, no blur on overlay itself */}
      <div 
        className="relative bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 animate-fade-in"
        style={{
          position: 'relative',
          zIndex: 101,
          marginTop: '10vh',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          filter: 'none', // Ensure overlay is sharp
          backdropFilter: 'none' // No blur on overlay
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          {/* Icon/Header */}
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-white mb-3 font-serif-display text-center">
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-neutral-400 mb-8 text-center leading-relaxed text-base">
            {message}
          </p>
          
          {/* Buttons */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={handleCancel}
              className="px-8 py-3 text-neutral-300 hover:text-white border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 font-semibold text-sm uppercase tracking-wider hover:bg-white/5"
            >
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`px-8 py-3 text-white rounded-xl transition-all duration-300 font-semibold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:scale-105 ${confirmButtonClass}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
