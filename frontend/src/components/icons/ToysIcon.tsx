
import React from 'react';

export const ToysIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M12 2.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5z" />
        <path d="M12 10.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5z" />
        <path d="M12 18.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5z" />
        <path d="M18 5a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
        <path d="M18 13a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
        <path d="M18 21a4 4 0 1 0-8 0 4 4 0 0 0 8 0z" />
    </svg>
);
