
import React from 'react';

export const FashionCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M12 2L4 4v3l-3 4v4h22v-4l-3-4V4L12 2z" />
        <path d="M4 9l4 4v9h8v-9l4-4" />
    </svg>
);
