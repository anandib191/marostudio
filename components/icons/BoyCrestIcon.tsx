
import React from 'react';

export const BoyCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle cx="12" cy="7" r="3" />
        <path d="M10 12h4v8H10z" />
        <line x1="10" y1="16" x2="8" y2="16" />
        <line x1="14" y1="16" x2="16" y2="16" />
    </svg>
);
