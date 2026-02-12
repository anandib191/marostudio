import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  className?: string;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  isActive = false,
  className = "",
}) => {
  const baseStyle = {
    transition: 'all 700ms cubic-bezier(0.175, 0.885, 0.32, 1.5)',
  };
  
  // Outer container for hover transform effect
  return (
    <button
      onClick={onClick}
      aria-pressed={isActive}
      className={`relative transition-transform duration-300 ease-in-out hover:scale-105 ${className}`}
      style={baseStyle}
    >
      {/* Main Glass Effect Wrapper */}
      <div
        className={`relative flex items-center justify-center font-semibold overflow-hidden text-neutral-200 cursor-pointer rounded-xl h-full w-full`}
        style={baseStyle}
      >
        {/* 1. Base background & blur layer */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backdropFilter: "blur(4px)",
            filter: "url(#glass-distortion)",
            isolation: "isolate",
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            ...baseStyle,
          }}
        />
        
        {/* 2. Inner shadow / highlight layer */}
        <div
          className="absolute inset-0 z-10 rounded-xl overflow-hidden"
          style={{
            boxShadow: `inset 1px 1px 1px 0 rgba(255, 255, 255, 0.2), inset -1px -1px 1px 0 rgba(0, 0, 0, 0.2), 0 1px 6px rgba(0, 0, 0, 0.1)`,
            border: isActive ? '1px solid rgba(230, 183, 30, 0.8)' : '1px solid rgba(255, 255, 255, 0.2)',
            ...baseStyle,
          }}
        />

        {/* 3. Content */}
        <div className="relative z-20 h-full w-full flex items-center justify-center">
          {children}
        </div>
      </div>
    </button>
  );
};
