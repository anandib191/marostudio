
import React from 'react';

export const ChildIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M5 3H3l-1 4h20l-1-4h-2" />
        <path d="M18 3a6 4 0 0 0-12 0" />
        <path d="M2 7l2 14h16l2-14z" />
        <path d="M12 12.5l1.5 2.5 2.5.5-2 2 .5 3-2.5-1.5L12 20l-2.5 1.5.5-3-2-2 2.5-.5 1.5-2.5z" />
    </svg>
);
