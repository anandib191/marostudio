
import React from 'react';

export const AccessoriesCrestIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
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
        <path d="M12 22C16.4183 22 20 18.4183 20 14C20 9.58172 16.4183 6 12 6C7.58172 6 4 9.58172 4 14C4 18.4183 7.58172 22 12 22Z" />
        <path d="M12 11L15 14L12 17L9 14L12 11Z" />
        <path d="M12 6V2" />
    </svg>
);
