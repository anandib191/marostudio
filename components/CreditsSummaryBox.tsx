import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreditsSummaryBoxProps {
  credits: number | null;
  creditType?: 'photoshoot' | 'marketing';
  className?: string;
}

export const CreditsSummaryBox: React.FC<CreditsSummaryBoxProps> = ({ 
  credits, 
  creditType = 'photoshoot',
  className = '' 
}) => {
  if (credits === null) {
    return null;
  }

  return (
    <div className={`bg-neutral-800/80 border border-white/10 rounded-xl p-3 flex items-center justify-between ${className}`}>
      {/* Left side - Icon and Label */}
      <div className="flex items-center gap-3">
        <div className="bg-neutral-700/50 rounded-lg p-2">
          <SparklesIcon className="w-4 h-4 text-yellow-400" />
        </div>
        <span className="text-white text-sm font-medium">
          Credits Summary
        </span>
      </div>

      {/* Right side - Available Credits */}
      <div className="text-yellow-400 text-sm font-medium">
        {credits} Available
      </div>
    </div>
  );
};
