import React from 'react';

export const IndiaFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 21 15" className={className}>
        <rect width="21" height="15" fill="#FFF"/>
        <rect width="21" height="5" fill="#F93"/>
        <rect y="10" width="21" height="5" fill="#128807"/>
        <circle cx="10.5" cy="7.5" r="2" fill="#FFF"/>
        <circle cx="10.5" cy="7.5" r="1.5" fill="#008"/>
        <circle cx="10.5" cy="7.5" r="0.6" fill="#FFF"/>
        <path d="M10.5 5.5v4M8.5 7.5h4M9.06 6.06l2.88 2.88M9.06 8.94l2.88-2.88" stroke="#008" strokeWidth="0.5" strokeLinecap="round"/>
    </svg>
);