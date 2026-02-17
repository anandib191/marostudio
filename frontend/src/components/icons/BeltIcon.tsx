
import React from 'react';

export const BeltIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M18 6V4a2 2 0 0 0-2-2h-3a2 2 0 0 0-2 2v2" />
        <path d="M10 6h4" />
        <path d="M18 10v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6" />
        <path d="M12 18v-2" />
    </svg>
);
