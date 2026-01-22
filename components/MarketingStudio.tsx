/// <reference types="vite/client" />

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageFile } from '../types';
import { generateMarketingPoster } from '../services/geminiServiceold';
import { ImageUploader } from './ImageUploader';
import { Loader } from './Loader';
import { DownloadIcon } from './icons/DownloadIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { LoadingScreen } from './LoadingScreen';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const MarketingStudio: React.FC<{ onExit: () => void; onContentGenerated: () => void; }> = ({ onExit, onContentGenerated }) => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<ImageFile | null>(null);
    const [logoFile, setLogoFile] = useState<ImageFile | null>(null);
    const [extraDetails, setExtraDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [marketingPosterCredits, setMarketingPosterCredits] = useState<number | null>(null);

    const fetchCredits = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setMarketingPosterCredits(null);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/credits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                const credits = typeof data.marketingPosterCredits === 'number' ? data.marketingPosterCredits : null;
                setMarketingPosterCredits(credits);
                console.log('Fetched marketing poster credits:', credits);
            }
        } catch (err) {
            console.error('Failed to fetch credits:', err);
        }
    }, []);

    useEffect(() => {
        fetchCredits();
        // Refresh credits more frequently to catch payment updates
        const interval = setInterval(fetchCredits, 10000); // Every 10 seconds
        return () => clearInterval(interval);
    }, [fetchCredits]);

    // Also refresh credits when component becomes visible (user navigates back)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                fetchCredits();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [fetchCredits]);

    const handleImageUpload = (file: ImageFile) => {
        setImageFile(file);
        setGeneratedPoster(null);
        setError(null);
    };

    const handleLogoUpload = (file: ImageFile) => {
        setLogoFile(file);
    };
    
    const handleGenerate = async () => {
        if (!imageFile) {
            setError('Please upload an image first.');
            return;
        }

        // Check credits before generation
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const checkRes = await fetch(`${API_URL}/api/credits/check`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ type: 'marketing' }),
                });
                const checkData = await checkRes.json();
                
                if (!checkData.success || !checkData.hasCredits) {
                    setError(checkData.message || 'You have no marketing poster credits remaining. Please upgrade your plan.');
                    return;
                }
            } catch (err) {
                console.error('Credit check error:', err);
                // Continue with generation if credit check fails (for development/testing)
            }
        }

        setIsLoading(true);
        setError(null);
        setGeneratedPoster(null);

        try {
            const poster = await generateMarketingPoster(imageFile, extraDetails, logoFile);
            setGeneratedPoster(poster);
            onContentGenerated();

            // Deduct credit after successful generation
            if (token) {
                try {
                    const deductRes = await fetch(`${API_URL}/api/credits/deduct`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ type: 'marketing' }),
                    });
                    
                    // Update credits immediately after successful deduction
                    if (deductRes.ok) {
                        try {
                            const deductData = await deductRes.json();
                            console.log('Deduct response:', deductData);
                            if (deductData.success && typeof deductData.marketingPosterCredits === 'number') {
                                // Update from server response immediately
                                setMarketingPosterCredits(deductData.marketingPosterCredits);
                                console.log('Credits updated from response:', deductData.marketingPosterCredits);
                            } else {
                                // Fallback: fetch from server
                                console.log('Deduct response missing credits, fetching...');
                                await fetchCredits();
                            }
                        } catch (parseErr) {
                            console.error('Error parsing deduct response:', parseErr);
                            // Fallback: fetch from server
                            await fetchCredits();
                        }
                    } else {
                        // If deduction failed, refresh credits anyway
                        const errorText = await deductRes.text();
                        console.log('Deduct request failed:', deductRes.status, errorText);
                        await fetchCredits();
                    }
                } catch (err) {
                    console.error('Credit deduction error:', err);
                    // Always try to refresh credits even if deduction fails
                    try {
                        await fetchCredits();
                    } catch (fetchErr) {
                        console.error('Failed to refresh credits:', fetchErr);
                    }
                }
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownload = () => {
        if (!generatedPoster) return;
        const link = document.createElement('a');
        link.href = generatedPoster;
        link.download = 'marketing-poster.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return <LoadingScreen mode="image" imageUrl={imageFile?.previewUrl} />;
    }

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in-up">
            <div className="relative text-center mb-10">
                 <button
                    onClick={onExit}
                    className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-2 text-neutral-300 hover:text-white transition-colors"
                    aria-label="Go back to studio selection"
                >
                    <ArrowLeftIcon className="w-5 h-5" />
                    <span className="hidden sm:inline">Back</span>
                </button>
                <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-white">Marketing Studio</h2>
                <p className="mt-2 text-neutral-300">Create promotional posters in a snap.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-4 text-center">1. Upload Your Product</h3>
                        <ImageUploader onImageUpload={handleImageUpload} initialPreview={imageFile?.previewUrl} />
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-4 text-center">2. Upload Your Logo (Optional)</h3>
                         <div className="max-w-xs mx-auto">
                            <ImageUploader 
                                onImageUpload={handleLogoUpload} 
                                initialPreview={logoFile?.previewUrl}
                                aspectRatio="aspect-square"
                                title="UPLOAD LOGO"
                                subtitle="Recommended: PNG with transparent background"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="extra-details-textarea" className="font-semibold text-lg text-white mb-4 text-center block">
                            <h3>3. Add Extra Details (optional)</h3>
                        </label>
                        <textarea
                            id="extra-details-textarea"
                            name="extraDetails"
                            value={extraDetails}
                            onChange={(e) => setExtraDetails(e.target.value)}
                            placeholder="e.g., Summer Sale, 20% Off, New Arrival"
                            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-3 px-4 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-rose-500"
                            rows={2}
                        />
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={!imageFile || isLoading || (marketingPosterCredits !== null && marketingPosterCredits <= 0)}
                        className="w-full text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed font-semibold py-3 px-8 rounded-lg shadow-lg shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <SparklesIcon className="w-5 h-5" />
                        GENERATE POSTER
                    </button>
                    {marketingPosterCredits !== null && (
                        <div className="mt-3 text-center">
                            {marketingPosterCredits > 0 ? (
                                <p className="text-xs">
                                    <span className="text-amber-400">You have {marketingPosterCredits} poster credit{marketingPosterCredits !== 1 ? 's' : ''} remaining</span>
                                </p>
                            ) : (
                                <div className="space-y-2">
                                    <p className="text-xs text-red-400">No poster credits remaining</p>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            navigate('/pricing');
                                        }}
                                        className="w-full text-[10px] uppercase tracking-widest text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold py-3 px-6 rounded-full transition-all transform hover:-translate-y-0.5 shadow-lg shadow-orange-900/20"
                                    >
                                        Purchase plan for more generation
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-neutral-900/40 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-2xl">
                    <h3 className="font-semibold text-lg text-white mb-4 text-center">4. Your Generated Poster</h3>
                    <div className="w-full aspect-[4/5] bg-neutral-800/50 rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-700">
                        {generatedPoster ? (
                            <div className="group relative w-full h-full">
                                <img src={generatedPoster} alt="Generated marketing poster" className="w-full h-full object-contain rounded-md" />
                                <button
                                    onClick={handleDownload}
                                    className="absolute top-3 right-3 p-2 rounded-full bg-black/50 backdrop-blur-sm text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Download poster"
                                >
                                    <DownloadIcon />
                                </button>
                            </div>
                        ) : (
                            <p className="text-neutral-400 text-sm">Your poster will appear here</p>
                        )}
                    </div>
                </div>
            </div>
            {error && <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg text-center max-w-md mx-auto">{error}</div>}
        </div>
    );
};