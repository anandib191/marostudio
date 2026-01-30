import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface CreditsSummaryBoxProps {
  credits: number | null;
  creditType?: 'photoshoot' | 'marketing';
  className?: string;
  creditsPerGeneration?: number; // Optional: can be passed dynamically
}

// Default values - these will be used if not provided
const DEFAULT_CREDITS_PER_GENERATION = {
  photoshoot: 20,
  marketing: 5,
};

export const CreditsSummaryBox: React.FC<CreditsSummaryBoxProps> = ({ 
  credits, 
  creditType = 'photoshoot',
  className = '',
  creditsPerGeneration
}) => {
  if (credits === null) {
    return null;
  }

  // Use provided value or fall back to defaults
  const CREDITS_PER_GENERATION = creditsPerGeneration || DEFAULT_CREDITS_PER_GENERATION[creditType];
  
  const canGenerate = credits >= CREDITS_PER_GENERATION;
  const generationsRemaining = Math.floor(credits / CREDITS_PER_GENERATION);

  return (
    <div className={`bg-neutral-800/80 border border-white/10 rounded-xl p-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-700/50 rounded-lg p-2">
            <SparklesIcon className="w-4 h-4 text-yellow-400" />
          </div>
          <span className="text-white text-sm font-medium">
            Credits Summary
          </span>
        </div>
        <div className={`text-sm font-medium ${canGenerate ? 'text-yellow-400' : 'text-red-400'}`}>
          {credits.toLocaleString()} Available
        </div>
      </div>
      
      {/* Cost and Remaining Generations */}
      <div className="text-xs text-neutral-400 mt-1">
        <span className="text-neutral-500">Cost per generation: </span>
        <span className="text-yellow-400 font-semibold">{CREDITS_PER_GENERATION} credits</span>
        {canGenerate && (
          <>
            <span className="mx-2">•</span>
            <span className="text-neutral-500">Remaining generation: </span>
            <span className="text-green-400 font-semibold">{generationsRemaining} {generationsRemaining === 1 ? 'time' : 'times'}</span>
          </>
        )}
        {!canGenerate && (
          <>
            <span className="mx-2">•</span>
            <span className="text-red-400 font-semibold">Insufficient credits</span>
          </>
        )}
      </div>
    </div>
  );
};
