
import React from 'react';

export const Logo: React.FC = () => (
    <div className="flex items-center gap-1 group cursor-pointer">
        <div className="logo-square w-5 h-5 rounded-[4px] bg-gold-500 flex items-center justify-center mr-1 transform transition-all duration-500 group-hover:rotate-[360deg]">
            <span className="text-[10px] font-black text-white">MS</span>
        </div>
        <span className="font-sans text-lg font-bold tracking-tighter text-white group-hover:text-gold-300 transition-colors">
            MARO
        </span>
        <span className="font-serif-display italic text-lg font-medium text-gold-500 group-hover:text-gold-400 transition-colors ml-0.5 drop-shadow-sm">
            Studio
        </span>
    </div>
);
