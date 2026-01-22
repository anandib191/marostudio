
import React from 'react';
import { SadFaceIcon } from './icons/SadFaceIcon';
import { HappyEmojiIcon } from './icons/HappyEmojiIcon';
import { Logo } from './Logo';

interface SubmissionPopupProps {
    isOpen: boolean;
    onClose: () => void;
    success: boolean;
    fullName: string;
    email: string;
    phone: string;
}

export const SubmissionPopup: React.FC<SubmissionPopupProps> = ({ isOpen, onClose, success, fullName, email, phone }) => {
    if (!isOpen) return null;

    const mainTextColor = 'text-neutral-500';
    const highlightColor = 'text-indigo-600';
    const boldColor = 'text-neutral-800';
    const buttonBg = 'bg-indigo-600';
    const buttonHoverBg = 'hover:bg-indigo-700';
    const buttonTextColor = 'text-white';

    const successContent = (
        <>
            <HappyEmojiIcon className={`w-12 h-12 my-4 ${highlightColor}`} />
            <h2 className={`text-xl font-serif-display font-bold ${boldColor} break-all mb-2`}>
                Thank you <span className={highlightColor}>{fullName}</span>,
            </h2>
            <p className={`mt-2 ${mainTextColor} leading-relaxed text-sm break-all font-light`}>
                Inquiry received. Our team will contact you at <span className={`font-semibold ${boldColor}`}>{phone}</span> or <span className={`font-semibold ${boldColor}`}>{email}</span> within <span className={`font-semibold ${highlightColor}`}>24 hours</span>.
            </p>
        </>
    );

    const failureContent = (
        <>
            <SadFaceIcon className={`w-12 h-12 my-4 text-red-500`} />
            <h2 className={`text-xl font-serif-display font-bold ${boldColor} break-all mb-2`}>
                Hello <span className="text-red-500">{fullName}</span>,
            </h2>
            <p className={`mt-2 ${mainTextColor} leading-relaxed text-sm break-all font-light`}>
                We encountered a technical error. Please try again or reach out directly via email.
            </p>
            <p className={`mt-4 text-sm font-bold uppercase tracking-widest ${highlightColor}`}>
                hello@nextgenphoto.ai
            </p>
        </>
    );

    return (
        <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="relative w-full max-w-sm bg-white rounded-[32px] shadow-2xl p-10 flex flex-col items-center text-center animate-pop-in"
                onClick={(e) => e.stopPropagation()}
            >
                <Logo />
                
                <div className="mt-4 w-full flex flex-col items-center">
                    {success ? successContent : failureContent}
                </div>

                <button 
                    onClick={onClose} 
                    className={`mt-10 w-full ${buttonBg} ${buttonTextColor} font-bold text-[11px] uppercase tracking-[0.3em] py-4 px-6 rounded-2xl shadow-xl shadow-indigo-900/20 transition-all duration-300 transform hover:scale-[1.02] ${buttonHoverBg} focus:outline-none`}
                >
                    Return to Studio
                </button>
            </div>
        </div>
    );
};
