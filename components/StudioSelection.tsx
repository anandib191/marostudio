
import React from 'react';
import { CameraIcon } from './icons/CameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { GlassButton } from './ui/GlassButton';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

type Studio = 'photo' | 'marketing';

interface StudioSelectionProps {
    onSelect: (studio: Studio) => void;
    onBack: () => void;
}

export const StudioSelection: React.FC<StudioSelectionProps> = ({ onSelect, onBack }) => {
    return (
        <div className="w-full max-w-4xl mx-auto animate-fade-in-up">
            <div className="text-center relative mb-12 md:mb-16">
                <button
                    onClick={onBack}
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                    aria-label="Go back to landing page"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Home</span>
                </button>
                <h2 className="font-serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-normal">Choose Your Studio</h2>
                <p className="mt-2 text-neutral-300">What would you like to create today?</p>
            </div>
            <div className="w-full max-w-sm md:max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                <GlassButton onClick={() => onSelect('photo')} className="group w-full">
                    <div className="px-6 py-8 md:py-12 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                        <CameraIcon className="w-10 h-10 md:w-14 md:h-14 text-rose-300 group-hover:text-rose-200 transition-colors duration-300" />
                        <h3 className="font-sans font-semibold text-xl md:text-2xl text-white">Photo Studio</h3>
                        <p className="text-sm text-neutral-400 text-center">Generate full photoshoots with AI models and custom styles.</p>
                    </div>
                </GlassButton>
                <GlassButton onClick={() => onSelect('marketing')} className="group w-full">
                    <div className="px-6 py-8 md:py-12 flex flex-col w-full items-center justify-center gap-4 md:gap-6">
                        <SparklesIcon className="w-10 h-10 md:w-14 md:h-14 text-amber-300 group-hover:text-amber-200 transition-colors duration-300" />
                        <h3 className="font-sans font-semibold text-xl md:text-2xl text-white">Marketing Studio</h3>
                        <p className="text-sm text-neutral-400 text-center">Create professional promotional posters for your products.</p>
                    </div>
                </GlassButton>
            </div>
        </div>
    );
};
