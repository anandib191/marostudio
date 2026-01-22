
import React from 'react';

export const Logo: React.FC = () => (
    <div className="flex items-center gap-1 text-white group cursor-pointer">
        <div className="w-5 h-5 rounded-[4px] bg-indigo-500 flex items-center justify-center mr-1 transform transition-all duration-500 group-hover:rotate-[360deg] shadow-lg shadow-indigo-500/20">
            <span className="text-[10px] font-black text-white">N</span>
        </div>
        <span className="font-sans text-lg font-bold tracking-tighter">
            NextGen
        </span>
        <span className="font-serif-display italic text-lg font-medium text-neutral-500 group-hover:text-indigo-400 transition-colors ml-0.5">
            photo
        </span>
    </div>
);
