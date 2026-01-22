import React from 'react';

export const FilePdfIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
        <path d="M14 3v5h5" />
        <path d="M9 13v5" />
        <path d="M9 13a2 2 0 1 1 2 2H9" />
        <path d="M14 18v-5h1.5a1.5 1.5 0 0 1 0 3H14" />
    </svg>
);
