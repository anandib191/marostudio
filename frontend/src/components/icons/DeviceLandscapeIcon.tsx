
import React from 'react';

export const DeviceLandscapeIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <rect x="2" y="7" width="20" height="10" rx="2" />
        <path d="M7 12h.01" />
    </svg>
);
