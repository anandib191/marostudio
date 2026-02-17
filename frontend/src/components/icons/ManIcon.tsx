
import React from 'react';

export const ManIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M6 3v18h12V3" />
        <path d="M6 3l6 7 6-7" />
        <path d="M12 10l6 4" />
        <path d="M12 10L6 14" />
        <path d="M9.5 5.5L8 6.5" />
        <path d="M8 12h2" />
        <circle cx="15.5" cy="13.5" r=".5" fill="currentColor" stroke="none" />
        <circle cx="15.5" cy="16.5" r=".5" fill="currentColor" stroke="none" />
    </svg>
);
