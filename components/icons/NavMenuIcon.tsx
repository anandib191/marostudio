import React from 'react';

export const NavMenuIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M20 7H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M20 12H4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M20 17H10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
);
