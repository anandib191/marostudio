import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';

interface UnifiedCreditsSummaryBoxProps {
  totalCredits: number | null;
  usedPhotoshootCredits: number;
  usedMarketingCredits: number;
  className?: string;
  creditsPerPhotoshootGeneration?: number;
  creditsPerMarketingGeneration?: number;
}

// Default values - these will be used if not provided
const DEFAULT_CREDITS_PER_GENERATION = {
  photoshoot: 20,
  marketing: 5,
};

export const UnifiedCreditsSummaryBox: React.FC<UnifiedCreditsSummaryBoxProps> = ({
  totalCredits,
  usedPhotoshootCredits,
  usedMarketingCredits,
  className = '',
  creditsPerPhotoshootGeneration,
  creditsPerMarketingGeneration
}) => {
  if (totalCredits === null) {
    return null;
  }

  // Use provided values or fall back to defaults
  const CREDITS_PER_PHOTOSHOOT = creditsPerPhotoshootGeneration || DEFAULT_CREDITS_PER_GENERATION.photoshoot;
  const CREDITS_PER_MARKETING = creditsPerMarketingGeneration || DEFAULT_CREDITS_PER_GENERATION.marketing;

  // Calculate total used credits and remaining credits
  const totalUsedCredits = usedPhotoshootCredits + usedMarketingCredits;
  const remainingCredits = Math.max(0, totalCredits - totalUsedCredits);

  // Calculate remaining generations for each type
  const photoshootGenerationsRemaining = Math.floor(remainingCredits / CREDITS_PER_PHOTOSHOOT);
  const marketingGenerationsRemaining = Math.floor(remainingCredits / CREDITS_PER_MARKETING);

  // Check if user can generate each type
  const canGeneratePhotoshoot = remainingCredits >= CREDITS_PER_PHOTOSHOOT;
  const canGenerateMarketing = remainingCredits >= CREDITS_PER_MARKETING;

  return (
    <div className={`bg-neutral-800/80 border border-white/10 rounded-xl p-4 ${className}`}>
      {/* Header */}
      {/* <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="bg-neutral-700/50 rounded-lg p-2">
            <SparklesIcon className="w-4 h-4 text-yellow-400" />
          </div>
          <span className="text-white text-sm font-medium">
            Unified Credits
          </span>
        </div>
        <div className={`text-sm font-medium ${remainingCredits > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
          {remainingCredits.toLocaleString()} Available
        </div>
      </div> */}

      {/* Credit Summary */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">Total Credits:</span>
          <span className="text-white font-medium">{totalCredits.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">Used Credits:</span>
          <span className="text-neutral-300 font-medium">{totalUsedCredits.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-400">Remaining Credits:</span>
          <span className={`${remainingCredits > 0 ? 'text-green-400' : 'text-red-400'} font-medium`}>
            {remainingCredits.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Usage Breakdown */}
      {/* <div className="border-t border-white/10 pt-2 space-y-1">
        <div className="text-xs text-neutral-400 mb-2">Usage Breakdown:</div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-300">Photoshoot:</span>
          <div className="text-right">
            <span className="text-xs text-yellow-400 font-medium">{usedPhotoshootCredits} used</span>
            {canGeneratePhotoshoot && (
              <div className="text-xs text-green-400">
                {photoshootGenerationsRemaining} more possible
              </div>
            )}
            {!canGeneratePhotoshoot && remainingCredits > 0 && (
              <div className="text-xs text-orange-400">
                Need {CREDITS_PER_PHOTOSHOOT - remainingCredits} more
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-neutral-300">Marketing:</span>
          <div className="text-right">
            <span className="text-xs text-yellow-400 font-medium">{usedMarketingCredits} used</span>
            {canGenerateMarketing && (
              <div className="text-xs text-green-400">
                {marketingGenerationsRemaining} more possible
              </div>
            )}
            {!canGenerateMarketing && remainingCredits > 0 && (
              <div className="text-xs text-orange-400">
                Need {CREDITS_PER_MARKETING - remainingCredits} more
              </div>
            )}
          </div>
        </div>
      </div> */}

      {/* Cost Information */}
      {/* <div className="border-t border-white/10 pt-2 mt-2">
        <div className="text-xs text-neutral-400 mb-1">Cost per generation:</div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-300">Photoshoot:</span>
          <span className="text-yellow-400 font-semibold">{CREDITS_PER_PHOTOSHOOT} credits</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-neutral-300">Marketing:</span>
          <span className="text-yellow-400 font-semibold">{CREDITS_PER_MARKETING} credits</span>
        </div>
      </div> */}

      {/* Status Message */}
      {remainingCredits === 0 && (
        <div className="mt-3 p-2 bg-red-500/10 border border-red-500/20 rounded-lg">
          <div className="text-xs text-red-400 text-center">
            No credits remaining. Please upgrade your plan to continue generating.
          </div>
        </div>
      )}

      {remainingCredits > 0 && remainingCredits < Math.min(CREDITS_PER_PHOTOSHOOT, CREDITS_PER_MARKETING) && (
        <div className="mt-3 p-2 bg-orange-500/10 border border-orange-500/20 rounded-lg">
          <div className="text-xs text-orange-400 text-center">
            Low credits! Consider upgrading your plan for more generations.
          </div>
        </div>
      )}
    </div>
  );
};
