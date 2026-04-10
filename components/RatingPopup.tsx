import React, { useState, useEffect } from 'react';

interface RatingPopupProps {
    generationId: string | null;
    isVisible?: boolean;
    onClose?: () => void;
    isLight?: boolean;
    variant?: 'popup' | 'inline';
    initialRating?: number;
    initialFeedback?: string;
    onSyncState?: (rating: number, feedback: string) => void;
}

const STAR_LABELS = ['Poor', 'Below Average', 'Good', 'Very Good', 'Excellent'];

export const RatingPopup: React.FC<RatingPopupProps> = ({ 
    generationId, isVisible = true, onClose, isLight, variant = 'popup',
    initialRating = 0, initialFeedback = '', onSyncState 
}) => {
    const [rating, setRating] = useState<number>(initialRating);
    const [hoveredStar, setHoveredStar] = useState<number>(0);
    const [feedback, setFeedback] = useState<string>(initialFeedback);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showContent, setShowContent] = useState(false);

    // Sync external state changes
    useEffect(() => {
        setRating(initialRating);
        setFeedback(initialFeedback);
    }, [initialRating, initialFeedback]);

    // Animate in after mount
    useEffect(() => {
        if (isVisible || variant === 'inline') {
            const timer = setTimeout(() => setShowContent(true), 100);
            return () => clearTimeout(timer);
        } else {
            setShowContent(false);
        }
    }, [isVisible, variant]);

    if (variant === 'popup' && !isVisible) return null;

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            if (generationId) {
                const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
                const token = localStorage.getItem('access_token');
                if (token) {
                    await fetch(`${API_URL}/api/user/generations/${generationId}/rating`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ rating, ratingFeedback: feedback || null }),
                    });
                }
            }
            onSyncState?.(rating, feedback); // Notify parent to sync state across any other variants

            setIsSubmitted(true);
            setTimeout(() => {
                if (variant === 'popup') {
                    onClose?.();
                    setTimeout(() => {
                        setIsSubmitted(false);
                        setIsSubmitting(false);
                    }, 300);
                } else {
                    // Inline form flashes thank you and returns to updatable state
                    setIsSubmitted(false);
                    setIsSubmitting(false);
                }
            }, 1800);
        } catch (err) {
            console.error('Rating submit error:', err);
            setIsSubmitting(false);
        }
    };

    const handleSkip = () => {
        if (variant === 'popup') {
            onClose?.();
        }
    };

    const activeStar = hoveredStar || rating;

    const wrapperClass = variant === 'popup'
        ? `fixed inset-0 z-[200] flex items-center justify-center transition-all duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`
        : `w-full flex items-center justify-center transition-all duration-500 py-12 ${showContent ? 'opacity-100' : 'opacity-0'}`;

    const wrapperStyle = variant === 'popup'
        ? { backdropFilter: 'blur(8px)', background: 'rgba(0,0,0,0.6)' }
        : {};

    return (
        <div
            className={wrapperClass}
            style={wrapperStyle}
            onClick={(e) => { if (e.target === e.currentTarget && variant === 'popup') handleSkip(); }}
        >
            <div
                className={`relative w-full max-w-md mx-4 rounded-2xl border overflow-hidden transition-all duration-500 transform ${variant === 'popup' ? (showContent ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4') : 'scale-100 translate-y-0'
                    } ${isLight
                        ? 'bg-neutral-50/80 border-neutral-200'
                        : 'bg-neutral-900/50 border-white/10'
                    }`}
            >
                {/* Gold accent line at top */}
                <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-60" />

                <div className="px-8 pt-8 pb-6">
                    {isSubmitted ? (
                        /* ── Thank You State ── */
                        <div className="text-center animate-fade-in py-4">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                                <svg className="w-8 h-8 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className={`text-lg font-bold mb-1 ${isLight ? 'text-neutral-800' : 'text-white'}`}>
                                Thank You!
                            </h3>
                            <p className={`text-sm ${isLight ? 'text-neutral-500' : 'text-neutral-400'}`}>
                                Your feedback helps us improve
                            </p>
                        </div>
                    ) : (
                        /* ── Rating Form ── */
                        <>
                            {/* Header */}
                            <div className="text-center mb-6">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gold-500/10 border border-gold-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <h3 className={`font-serif-display text-xl font-bold tracking-tight ${isLight ? 'text-neutral-800' : 'text-white'}`}>
                                    {initialRating > 0 ? 'Your Rating' : 'Rate Your Results'}
                                </h3>
                                <p className={`text-xs mt-1 ${isLight ? 'text-neutral-500' : 'text-neutral-500'}`}>
                                    How satisfied are you with the generated images?
                                </p>
                            </div>

                            {/* Stars */}
                            <div className="flex justify-center gap-2 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredStar(star)}
                                        onMouseLeave={() => setHoveredStar(0)}
                                        className="group p-1 transition-transform duration-200 hover:scale-125 focus:outline-none"
                                        style={{ color: star <= activeStar ? '#e6b71e' : isLight ? '#d1d5db' : '#404040' }}
                                    >
                                        <svg className="w-8 h-8 transition-all duration-200" viewBox="0 0 24 24" fill={star <= activeStar ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={star <= activeStar ? 0 : 1.5}>
                                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>

                            {/* Star label */}
                            <p className={`text-center text-xs font-medium h-5 mb-4 transition-opacity ${activeStar > 0 ? 'opacity-100' : 'opacity-0'}`}
                                style={{ color: '#e6b71e' }}>
                                {activeStar > 0 ? STAR_LABELS[activeStar - 1] : ''}
                            </p>

                            {/* Feedback text area (shows after rating) */}
                            {rating > 0 && (
                                <div className="animate-fade-in mb-5">
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="Any suggestions? (optional)"
                                        rows={2}
                                        className={`w-full rounded-lg border px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-gold-500/30 transition-colors ${isLight
                                            ? 'bg-neutral-50 border-neutral-200 text-neutral-800 placeholder:text-neutral-400'
                                            : 'bg-white/5 border-white/10 text-white placeholder:text-neutral-600'
                                            }`}
                                    />
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex gap-3">
                                {variant === 'popup' && (
                                    <button
                                        onClick={handleSkip}
                                        className={`flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-lg border transition-all ${isLight
                                            ? 'text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                                            : 'text-neutral-500 border-white/10 hover:border-white/20 hover:text-neutral-300'
                                            }`}
                                    >
                                        Skip
                                    </button>
                                )}
                                <button
                                    onClick={handleSubmit}
                                    disabled={rating === 0 || isSubmitting}
                                    className={`flex-1 py-2.5 text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${rating > 0
                                        ? 'bg-gold-700 hover:bg-gold-600 text-white shadow-lg shadow-gold-950/30'
                                        : isLight
                                            ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                            : 'bg-white/5 text-neutral-600 cursor-not-allowed'
                                        }`}
                                >
                                    {isSubmitting ? (
                                        <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    ) : initialRating > 0 ? (
                                        'Update Rating'
                                    ) : (
                                        'Submit'
                                    )}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
