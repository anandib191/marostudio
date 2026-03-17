import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CameraIcon } from './icons/CameraIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { getCacheStats } from '../utils/cacheManager';

type StudioType = 'photo' | 'marketing';

export interface SidebarStep {
    label: string;
    phase?: string; // the phase/step to jump to when clicked
}

interface StudioSidebarProps {
    activeStudio: StudioType | null;
    currentStep: number;
    onSelectStudio: (studio: StudioType) => void;
    onJumpToStep: (stepIndex: number, phase?: string) => void;
    onExit: () => void;
}

const PHOTO_STEPS: SidebarStep[] = [
    { label: 'Select Category', phase: 'category' },
    { label: 'Upload Images', phase: 'upload' },
    { label: 'Production Details', phase: 'details' },
    { label: 'Generate', phase: 'generating' },
];

const MARKETING_STEPS: SidebarStep[] = [
    { label: 'Upload & Details', phase: 'upload' },
    { label: 'Generate', phase: 'generate' },
];

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
    activeStudio,
    currentStep,
    onSelectStudio,
    onJumpToStep,
    onExit,
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const previewStudio: StudioType = activeStudio ?? 'photo';
    const steps = previewStudio === 'photo' ? PHOTO_STEPS : MARKETING_STEPS;
    const effectiveStep = activeStudio === previewStudio ? currentStep : -1;
    const isPhoto = previewStudio === 'photo';

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cachedCount, setCachedCount] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsLoggedIn(!!token);
        if (token) {
            getCacheStats().then(stats => setCachedCount(stats.itemCount)).catch(() => { });
        }
    }, []);

    const canJumpTo = (index: number) => {
        return activeStudio !== null && index <= effectiveStep;
    };

    return (
        <aside
            className="hidden lg:flex flex-col w-[240px] flex-shrink-0 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto border-r border-white/10 bg-black"
        >
            {/* Studio switcher */}
            <div className="px-4 pt-8 pb-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-3">
                    Studio
                </p>
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => onSelectStudio('photo')}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all text-xs font-medium ${previewStudio === 'photo'
                            ? 'bg-gold-500/10 text-gold-400'
                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                    >
                        <CameraIcon className={`w-3.5 h-3.5 flex-shrink-0 ${previewStudio === 'photo' ? 'text-gold-400' : ''}`} />
                        Photo Shoot
                    </button>
                    <button
                        onClick={() => onSelectStudio('marketing')}
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all text-xs font-medium ${previewStudio === 'marketing'
                            ? 'bg-amber-500/10 text-amber-400'
                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.05]'
                            }`}
                    >
                        <SparklesIcon className={`w-3.5 h-3.5 flex-shrink-0 ${previewStudio === 'marketing' ? 'text-amber-400' : ''}`} />
                        Marketing
                    </button>
                </div>
            </div>

            {/* Divider */}
            <div className="mx-4 border-t border-white/10" />

            {/* Steps */}
            <nav className="flex-1 px-4 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-500 mb-3">
                    Steps
                </p>
                <div className="flex flex-col gap-0.5">
                    {steps.map((step, index) => {
                        const isActive = effectiveStep === index;
                        const isCompleted = effectiveStep > index;
                        const isClickable = canJumpTo(index);
                        const isPreview = effectiveStep === -1;

                        return (
                            <button
                                key={index}
                                disabled={!isClickable}
                                onClick={() => isClickable && onJumpToStep(index, step.phase)}
                                className={`
                  flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-left
                  transition-all duration-150
                  ${isActive ? (isPhoto ? 'bg-gold-500/[0.08] text-gold-400' : 'bg-amber-500/[0.08] text-amber-400') : ''}
                  ${isCompleted ? 'text-neutral-400 hover:bg-white/[0.05] cursor-pointer' : ''}
                  ${isPreview || (!isActive && !isCompleted) ? 'text-neutral-600 cursor-default' : ''}
                `}
                            >
                                {/* Indicator */}
                                <span className={`
                  flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
                  ${isCompleted
                                        ? 'bg-transparent text-neutral-400'
                                        : isActive
                                            ? isPhoto ? 'bg-gold-500 text-white' : 'bg-amber-500 text-white'
                                            : 'border border-neutral-700 text-neutral-600'}
                `}>
                                    {isCompleted
                                        ? <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                        : index + 1
                                    }
                                </span>

                                {/* Label */}
                                <span className={`text-[11px] font-medium leading-tight ${isActive ? 'font-semibold' : ''}`}>
                                    {step.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </nav>

            {/* Previously Generated + Back */}
            <div className="px-4 pb-6 flex flex-col gap-1">
                {isLoggedIn && (
                    <button
                        onClick={() => navigate('/previously-generated')}
                        className={`flex items-center gap-2 w-full px-3 py-2.5 rounded-lg text-[11px] transition-all ${location.pathname === '/previously-generated'
                            ? 'bg-gold-500/10 text-gold-400 font-semibold border border-gold-500/20'
                            : 'text-neutral-400 hover:text-white hover:bg-white/[0.05] border border-transparent'
                            }`}
                    >
                        <svg className={`w-3.5 h-3.5 flex-shrink-0 ${location.pathname === '/previously-generated' ? 'text-gold-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="flex-1 text-left">Previously Generated</span>
                        {cachedCount > 0 && (
                            <span className="px-1.5 py-0.5 bg-gold-500/20 text-gold-600 text-[9px] font-bold rounded-full">
                                {cachedCount}
                            </span>
                        )}
                    </button>
                )}
                <button
                    onClick={onExit}
                    className="flex items-center gap-2 px-3 py-2 text-[11px] text-neutral-500 hover:text-white transition-colors"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Switch Studio
                </button>
            </div>
        </aside>
    );
};
