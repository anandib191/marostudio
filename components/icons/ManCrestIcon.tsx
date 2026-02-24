
import React from 'react';

export const ManCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M14.5 6A1.5 1.5 0 1 0 11.5 6A1.5 1.5 0 0 0 14.5 6Z" />
        <path d="M13 7.5L11 11L8.5 22h7L13 11V7.5" />
        <path d="M11 11L15 10.5" />
        <path d="M8.5 14L11 13" />
        <path d="M13 11L11.5 19" />
    </svg>
);
