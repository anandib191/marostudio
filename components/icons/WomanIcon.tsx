
import React from 'react';

export const WomanIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M6.5,4 C8.5,6 10.5,5 12,5 C13.5,5 15.5,6 17.5,4" />
        <path d="M17.5,4 L19,9" />
        <path d="M6.5,4 L5,9" />
        <path d="M19,9 C16,10 8,10 5,9" />
        <path d="M19,9 C19,16 14,21 12,21" />
        <path d="M5,9 C5,16 10,21 12,21" />
        <path d="M12,21 L10,9" />
        <path d="M12,21 L14,9" />
    </svg>
);
