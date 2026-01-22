import React from 'react';

export const ElectronicsIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <rect x="2" y="7" width="20" height="13" rx="2" ry="2" />
        <path d="M16 21V7" />
        <path d="M8 21V7" />
        <path d="M12 21V7" />
        <line x1="12" y1="3" x2="12" y2="4" />
        <line x1="10" y1="3" x2="10" y2="4" />
        <line x1="14" y1="3" x2="14" y2="4" />
    </svg>
);
