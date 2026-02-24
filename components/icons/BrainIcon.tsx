import React from 'react';

export const BrainIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 8V4.5a2.5 2.5 0 0 0-5 0V8" />
        <path d="M12 16v-4" />
        <path d="M15.5 8a2.5 2.5 0 0 0-2.5-2.5" />
        <path d="M12 8h-5" />
        <path d="M8.5 8a2.5 2.5 0 0 1-2.5-2.5" />
        <path d="M12 20a8 8 0 0 0 4.5-14.5" />
        <path d="M12 20a8 8 0 0 1-4.5-14.5" />
        <path d="M19 10a2.5 2.5 0 0 0 0-5" />
        <path d="M5 10a2.5 2.5 0 0 1 0-5" />
        <path d="M12 16a2.5 2.5 0 0 0 2.5 2.5" />
        <path d="M12 16a2.5 2.5 0 0 1-2.5 2.5" />
    </svg>
);
