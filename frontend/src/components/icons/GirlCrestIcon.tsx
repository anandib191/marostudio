
import React from 'react';

export const GirlCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M10 12l-2 8h8l-2-8z" />
    </svg>
);
