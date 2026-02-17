
import React from 'react';

export const FurnitureIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M20 9v10H4V9"/>
        <path d="M4 7h16v2H4z"/>
        <path d="M6 19v-8"/>
        <path d="M18 19v-8"/>
    </svg>
);
