
import React from 'react';

export const WomanCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M14.5 4.5C14.5 5.88 13.4 7 12 7C10.6 7 9.5 5.88 9.5 4.5C9.5 3.12 10.6 2 12 2C13.4 2 14.5 3.12 14.5 4.5Z" />
        <path d="M12 7L11 11L8.5 22H15.5L13 11L12 7Z" />
        <path d="M11 11C12.5 12 15 12.5 16 11.5" />
        <path d="M8.5 22C10.5 20.5 13.5 20.5 15.5 22" />
    </svg>
);
