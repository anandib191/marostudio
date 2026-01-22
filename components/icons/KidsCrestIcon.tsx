
import React from 'react';

export const KidsCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M14 7a2 2 0 1 0-4 0" />
        <path d="M12 8L10 4H14L12 8z" />
        <path d="M12 8v5" />
        <path d="M12 13l-4 4" />
        <path d="M12 13l4.5 2.5" />
        <path d="M10.5 19.5L8 17" />
        <path d="M16.5 15.5L18.5 14" />
        <path d="M10 4H8v3" />
    </svg>
);
