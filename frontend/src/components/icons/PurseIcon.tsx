import React from 'react';

export const PurseIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M8 8a4 4 0 0 0-4 4v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a4 4 0 0 0-4-4Z" />
        <path d="M12 12V8" />
        <path d="M16 8a4 4 0 1 0-8 0" />
    </svg>
);
