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
import { UnifiedCreditsSummaryBox } from './UnifiedCreditsSummaryBox';
import { addToCache, getCachedItems } from '../utils/cacheManager';
import { toast } from 'react-toastify';
import { notifyGenerationComplete } from '../utils/notification';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const MarketingStudio: React.FC<{ onExit: () => void; onContentGenerated: () => void; onStepChange?: (step: number) => void; }> = ({ onExit, onContentGenerated, onStepChange }) => {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState<ImageFile | null>(null);
    const [logoFile, setLogoFile] = useState<ImageFile | null>(null);
    const [extraDetails, setExtraDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedPoster, setGeneratedPoster] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [totalCredits, setTotalCredits] = useState<number | null>(null);
    const [usedPhotoshootCredits, setUsedPhotoshootCredits] = useState<number>(0);
    const [usedMarketingCredits, setUsedMarketingCredits] = useState<number>(0);
    const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchCredits = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setTotalCredits(null);
            setRemainingCredits(null);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/credits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok && data.success) {
                setTotalCredits(data.totalCredits);
                setUsedPhotoshootCredits(data.usedPhotoshootCredits);
                setUsedMarketingCredits(data.usedMarketingCredits);
                setRemainingCredits(data.remainingCredits);
            }
        } catch (err) {
            console.error('Failed to fetch credits:', err);
        }
    }, []);

    useEffect(() => {
        // Check authentication status
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        if (token) {
            fetchCredits();
            // Refresh credits every 5 seconds to catch payment/admin updates (reduced to avoid rate limits)
            const interval = setInterval(fetchCredits, 5000); // Every 5 seconds
            return () => clearInterval(interval);
        }
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

    // Notify parent about step changes for sidebar tracking
    // step 0: no image, step 1: image uploaded, step -1: generating or done
    useEffect(() => {
        if (isLoading || generatedPoster) {
            onStepChange?.(-1);
        } else if (imageFile) {
            onStepChange?.(1);
        } else {
            onStepChange?.(0);
        }
    }, [imageFile, isLoading, generatedPoster, onStepChange]);

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

        // Check if user is authenticated
        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login', { state: { from: { pathname: '/studio' } } });
            return;
        }

        // Check credits before generation
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
                    const errorMsg = checkData.message || 'You have no marketing poster credits remaining.';
                    setError(errorMsg);
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
            notifyGenerationComplete('Marketing Poster');

            // Add poster to cache for "Previously Generated" page
            // Convert URL to data URL if needed (for persistence in localStorage)
            try {
                console.log('🔄 Starting cache process for marketing poster...');
                console.log('📋 Poster URL type:', poster ? (poster.startsWith('data:') ? 'data URL' : 'remote URL') : 'null');

                let posterDataUrl = poster;

                // If poster is a URL (not already a data URL), convert it to data URL
                if (poster && !poster.startsWith('data:')) {
                    console.log('🔄 Converting remote URL to data URL...');
                    console.log('📋 Poster URL:', poster.substring(0, 100));

                    // Check if URL is valid
                    if (!poster.startsWith('http://') && !poster.startsWith('https://')) {
                        console.error('❌ Invalid URL format:', poster.substring(0, 100));
                        throw new Error('Invalid URL format');
                    }

                    try {
                        console.log('📡 Fetching poster from URL...');
                        const response = await fetch(poster, {
                            mode: 'cors',
                            cache: 'no-cache'
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                        }

                        console.log('✅ Response OK, converting to blob...');
                        const blob = await response.blob();
                        console.log('✅ Fetched blob, size:', blob.size, 'bytes, type:', blob.type);

                        if (blob.size === 0) {
                            throw new Error('Blob is empty');
                        }

                        const reader = new FileReader();
                        posterDataUrl = await new Promise<string>((resolve, reject) => {
                            const timeout = setTimeout(() => {
                                reject(new Error('FileReader timeout'));
                            }, 10000); // 10 second timeout

                            reader.onloadend = () => {
                                clearTimeout(timeout);
                                const result = reader.result as string;
                                if (!result || result.length === 0) {
                                    reject(new Error('Empty data URL'));
                                    return;
                                }
                                console.log('✅ Converted to data URL, length:', result.length, 'chars');
                                resolve(result);
                            };
                            reader.onerror = (error) => {
                                clearTimeout(timeout);
                                console.error('❌ FileReader error:', error);
                                reject(new Error('FileReader failed'));
                            };
                            reader.readAsDataURL(blob);
                        });
                        console.log('✅ Successfully converted URL to data URL');
                    } catch (fetchError) {
                        console.error('❌ Failed to convert poster URL to data URL:', fetchError);
                        console.error('📋 Error details:', {
                            message: fetchError instanceof Error ? fetchError.message : String(fetchError),
                            posterUrl: poster?.substring(0, 100),
                            stack: fetchError instanceof Error ? fetchError.stack : undefined
                        });
                        // If conversion fails, try to cache the original URL anyway
                        // Some URLs might be persistent (CDN URLs)
                        console.warn('⚠️ Conversion failed, caching original URL as fallback');
                        posterDataUrl = poster;
                    }
                } else if (poster && poster.startsWith('data:')) {
                    console.log('✅ Poster is already a data URL, no conversion needed');
                    posterDataUrl = poster;
                } else {
                    console.error('❌ Poster is null or empty');
                    throw new Error('Poster is null or empty');
                }

                // Ensure we have a valid URL/data URL before caching
                if (!posterDataUrl || posterDataUrl.length === 0) {
                    throw new Error('Invalid poster data URL');
                }

                const cachePrompt = `Marketing poster${extraDetails ? ` - ${extraDetails.substring(0, 50)}` : ''}`;
                console.log('💾 Adding to cache with prompt:', cachePrompt);
                console.log('📋 Data URL length:', posterDataUrl?.length);
                console.log('📋 Data URL preview:', posterDataUrl?.substring(0, 50) + '...');

                await addToCache(posterDataUrl, 'marketing', cachePrompt);
                console.log('✅ Marketing poster added to cache successfully');

                // Verify it was cached
                setTimeout(async () => {
                    try {
                        const verifyCache = await getCachedItems();
                        const marketingItems = verifyCache.filter(item => item.studioType === 'marketing');
                        console.log('✅ Verification: Total cached marketing items:', marketingItems.length);
                        if (marketingItems.length === 0) {
                            console.error('❌ WARNING: No marketing items found in cache after adding!');
                        } else {
                            console.log('✅ Latest marketing item:', {
                                id: marketingItems[0].id,
                                timestamp: new Date(marketingItems[0].timestamp).toISOString(),
                                prompt: marketingItems[0].prompt
                            });
                        }
                    } catch (error) {
                        console.error('❌ Failed to verify cache:', error);
                    }
                }, 100);
            } catch (cacheError) {
                console.error('❌ Failed to cache marketing poster:', cacheError);
                console.error('📋 Cache error details:', cacheError);
                // Don't fail generation if caching fails
            }

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
                            if (deductData.success) {
                                // Update from server response
                                setTotalCredits(deductData.totalCredits);
                                setUsedPhotoshootCredits(deductData.usedPhotoshootCredits);
                                setUsedMarketingCredits(deductData.usedMarketingCredits);
                                setRemainingCredits(deductData.remainingCredits);
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

                // Save generation record for admin tracking
                try {
                    await fetch(`${API_URL}/api/user/generations/save`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            type: 'marketing',
                            quality: '2K',
                            imageUrls: [poster],
                            creditsUsed: 20,
                            sourceImageUrl: imageFile?.previewUrl || null,
                            numberOfImages: 1,
                        }),
                    });
                } catch (err) {
                    console.error('Save generation record error:', err);
                }
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!generatedPoster) return;

        try {
            // Convert data URL to blob for reliable download
            const response = await fetch(generatedPoster);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `marketing-poster-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Clean up the blob URL
            window.URL.revokeObjectURL(url);

            toast.success('Poster downloaded successfully!', {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (error) {
            console.error('Download failed:', error);
            toast.error('Failed to download poster. Please try again.', {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    if (isLoading) {
        return <LoadingScreen mode="image" imageUrl={imageFile?.previewUrl} />;
    }

    return (
        <div className="w-full max-w-5xl mx-auto animate-fade-in-up px-2 sm:px-4">
            <div className="text-center mb-6 sm:mb-8">
                <h2 className="font-serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-white">Marketing <span className="italic text-neutral-400">Studio</span></h2>
                <p className="mt-1.5 text-xs sm:text-sm text-neutral-400">Create promotional posters in a snap.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
                <div className="bg-neutral-900/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl space-y-4">
                    <div>
                        <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-300 mb-2">Upload Your Product</h3>
                        <ImageUploader onImageUpload={handleImageUpload} initialPreview={imageFile?.previewUrl} aspectRatio="aspect-[4/3]" />
                    </div>

                    <div className="grid grid-cols-[auto_1fr] gap-3 sm:gap-4 items-start">
                        <div className="w-[80px] sm:w-[100px]">
                            <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-300 mb-2">Logo</h3>
                            <ImageUploader
                                onImageUpload={handleLogoUpload}
                                initialPreview={logoFile?.previewUrl}
                                aspectRatio="aspect-square"
                                title="LOGO"
                                subtitle="PNG"
                            />
                        </div>
                        <div>
                            <label htmlFor="extra-details-textarea" className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-300 mb-2 block">
                                Extra Details (optional)
                            </label>
                            <textarea
                                id="extra-details-textarea"
                                name="extraDetails"
                                value={extraDetails}
                                onChange={(e) => setExtraDetails(e.target.value)}
                                placeholder="e.g., Summer Sale, 20% Off, New Arrival"
                                className="w-full bg-neutral-900/70 border border-white/15 rounded-md py-2 px-3 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:ring-1 focus:ring-gold-500/30 resize-none"
                                rows={3}
                            />
                        </div>
                    </div>

                    {!isAuthenticated ? (
                        <button
                            onClick={() => navigate('/login', { state: { from: { pathname: '/studio' } } })}
                            className="w-full text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white bg-gradient-to-r from-orange-500 via-gold-500 to-gold-500 hover:from-orange-600 hover:via-gold-600 hover:to-gold-600 font-bold py-3 sm:py-3.5 px-8 rounded-xl shadow-lg shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            LOG IN TO GENERATE
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleGenerate}
                                disabled={!imageFile || isLoading || (remainingCredits !== null && remainingCredits < 20)}
                                className="w-full text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed font-bold py-3 sm:py-3.5 px-8 rounded-xl shadow-lg shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                GENERATE POSTER
                            </button>
                            {remainingCredits !== null && (
                                <div className="space-y-2">
                                    <UnifiedCreditsSummaryBox
                                        totalCredits={totalCredits}
                                        usedPhotoshootCredits={usedPhotoshootCredits}
                                        usedMarketingCredits={usedMarketingCredits}
                                    />
                                    {remainingCredits < 20 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                navigate('/pricing');
                                            }}
                                            className="w-full text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold py-3 px-8 rounded-xl shadow-lg shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Purchase Plan to Get Credits
                                        </button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="bg-neutral-900/40 backdrop-blur-xl p-4 sm:p-6 rounded-2xl border border-white/10 shadow-2xl">
                    <h3 className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold text-neutral-300 mb-3 text-center">Generated Poster</h3>
                    <div className="w-full aspect-[4/5] bg-neutral-900/70 rounded-xl flex items-center justify-center border border-white/10 overflow-hidden">
                        {generatedPoster ? (
                            <div className="group relative w-full h-full">
                                <img src={generatedPoster} alt="Generated marketing poster" className="w-full h-full object-contain" />
                                <button
                                    onClick={handleDownload}
                                    className="absolute top-3 right-3 p-2.5 rounded-full bg-black/60 backdrop-blur-sm text-white hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 border border-white/10"
                                    aria-label="Download poster"
                                >
                                    <DownloadIcon />
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <p className="text-neutral-500 text-xs sm:text-sm">Your poster will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {error && <div className="mt-6 p-4 bg-red-900/30 border border-red-500/50 text-red-300 rounded-lg text-center max-w-md mx-auto">{error}</div>}
        </div>
    );
};