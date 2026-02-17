import React from 'react';

export const UKFlagIcon: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 30" className={className}><clipPath id="a-uk-flag"><path d="M0 0v30h60V0z"/></clipPath><g clipPath="url(#a-uk-flag)"><path d="M0 0v30h60V0z" fill="#012169"/><path d="m0 0 60 30m-60 0L60 0" stroke="#fff" strokeWidth="6"/><path d="m0 0 60 30m-60 0L60 0" stroke="#c8102e" strokeWidth="4"/><path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10"/><path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6"/></g></svg>
);