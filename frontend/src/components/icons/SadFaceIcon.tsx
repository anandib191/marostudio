import React from 'react';

export const SadFaceIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M16 16s-1.5-2.5-4-2.5s-4 2.5-4 2.5"></path>
        <line x1="9" y1="10" x2="9.01" y2="10"></line>
        <line x1="15" y1="10" x2="15.01" y2="10"></line>
    </svg>
);