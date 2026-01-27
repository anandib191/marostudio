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
import { CreditsSummaryBox } from './CreditsSummaryBox';
import { addToCache, getCachedItems } from '../utils/cacheManager';
import { toast } from 'react-toastify';

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
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const fetchCredits = useCallback(async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setMarketingPosterCredits(null);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/credits?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
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

                    {!isAuthenticated ? (
                        <button
                            onClick={() => navigate('/login', { state: { from: { pathname: '/studio' } } })}
                            className="w-full text-white bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 hover:from-orange-600 hover:via-rose-600 hover:to-pink-600 font-semibold py-3 px-8 rounded-lg shadow-lg shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            LOG IN TO GENERATE
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={handleGenerate}
                                disabled={!imageFile || isLoading || (marketingPosterCredits !== null && marketingPosterCredits <= 0)}
                                className="w-full text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-neutral-600 disabled:to-neutral-700 disabled:cursor-not-allowed font-semibold py-3 px-8 rounded-lg shadow-lg shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                <SparklesIcon className="w-5 h-5" />
                                GENERATE POSTER
                            </button>
                            {marketingPosterCredits !== null && (
                                <div className="mt-3">
                                    {marketingPosterCredits > 0 ? (
                                        <CreditsSummaryBox 
                                            credits={marketingPosterCredits} 
                                            creditType="marketing"
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            <div className="bg-neutral-800/80 border border-red-500/20 rounded-xl p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="bg-neutral-700/50 rounded-lg p-2">
                                                        <SparklesIcon className="w-4 h-4 text-red-400" />
                                                    </div>
                                                    <span className="text-white text-sm font-medium">
                                                        Credits Summary
                                                    </span>
                                                </div>
                                                <div className="text-red-400 text-sm font-medium">
                                                    0 Available
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    navigate('/pricing');
                                                }}
                                                    className="w-full text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-semibold py-3 px-8 rounded-lg shadow-lg shadow-orange-900/30 transition-all duration-300 flex items-center justify-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                Purchase Plan to Get Credits
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
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