import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CheckIcon } from './icons/CheckIcon';
import { StarIcon } from './icons/StarIcon';
import { PaymentModal } from './PaymentModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Log API URL in development for debugging
if (import.meta.env.DEV) {
  console.log('PricingPage API_URL:', API_URL);
}

// Declare confetti as a global function for TypeScript
declare const confetti: (options: any) => void;

type PlanItem = { 
  name: string; 
  price: string; 
  yearlyPrice: string; 
  description: string; 
  features: string[]; 
  isPopular: boolean;
  photoshootCredits?: number;
  marketingPosterCredits?: number;
};

export const PricingPage: React.FC = () => {
    const [plans, setPlans] = useState<PlanItem[]>([]);
    const [loadingPlans, setLoadingPlans] = useState(true);
    const [isMonthly, setIsMonthly] = useState(true);
    const switchRef = useRef<HTMLButtonElement>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
    const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState<string | null>(null);
    const [photoshootCredits, setPhotoshootCredits] = useState<number | null>(null);
    const [marketingPosterCredits, setMarketingPosterCredits] = useState<number | null>(null);

    // Plan hierarchy: Silver < Gold < Platinum
    const planHierarchy: { [key: string]: number } = {
        'Silver': 1,
        'Gold': 2,
        'Platinum': 3,
    };

    const fetchSubscriptionPlan = async () => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setCurrentSubscriptionPlan(null);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/api/credits?t=${Date.now()}`, {
                headers: { Authorization: `Bearer ${token}` },
                cache: 'no-store',
            });
            const data = await res.json();
            if (res.ok && data.success) {
                // Store credits to check if they're over
                const photoshoot = data.photoshootCredits || 0;
                const marketing = data.marketingPosterCredits || 0;
                setPhotoshootCredits(photoshoot);
                setMarketingPosterCredits(marketing);
                
                
                // Check if subscription is still valid
                if (data.subscriptionPlan && data.subscriptionExpiresAt) {
                    const expiresAt = new Date(data.subscriptionExpiresAt);
                    const now = new Date();
                    if (expiresAt > now) {
                        setCurrentSubscriptionPlan(data.subscriptionPlan);
                    } else {
                        setCurrentSubscriptionPlan(null);
                    }
                } else {
                    setCurrentSubscriptionPlan(null);
                }
            }
        } catch (err) {
            console.error('Failed to fetch subscription plan:', err);
        }
    };

    useEffect(() => {
        const fetchPlans = async () => {
            setLoadingPlans(true);
            try {
                // Add cache-busting and timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
                
                const apiUrl = `${API_URL}/api/price-plans`;
                console.log('Fetching plans from:', apiUrl);
                
                const res = await fetch(apiUrl, {
                    signal: controller.signal,
                    headers: {
                        'Cache-Control': 'no-cache',
                    },
                    mode: 'cors',
                });
                
                clearTimeout(timeoutId);
                
                if (!res.ok) {
                    console.error(`API error: ${res.status} ${res.statusText}`);
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                
                const data = await res.json();
                console.log('Plans API response:', { success: data.success, plansCount: data.plans?.length });
                
                if (data.success && Array.isArray(data.plans) && data.plans.length > 0) {
                    // Ensure plans have required fields
                    const validPlans = data.plans.map((plan: any) => ({
                        name: plan.name || '',
                        price: plan.price || '0',
                        yearlyPrice: plan.yearlyPrice || '0',
                        description: plan.description || '',
                        features: Array.isArray(plan.features) ? plan.features : [],
                        isPopular: plan.isPopular || false,
                        photoshootCredits: plan.photoshootCredits || 0,
                        marketingPosterCredits: plan.marketingPosterCredits || 0,
                    }));
                    setPlans(validPlans);
                } else {
                    // Fallback to default plans if API returns empty
                    console.warn('No plans available from API, using fallback');
                    // Try to use default plans structure
                    const fallbackPlans: PlanItem[] = [
                        { name: 'Silver', price: '749', yearlyPrice: '699', description: 'Perfect for getting started', features: ['1000 Photoshoot generation', '1000 Marketing poster generation'], isPopular: false },
                        { name: 'Gold', price: '1499', yearlyPrice: '1439', description: 'For growing businesses', features: ['2500 Photoshoot generation', '2500 Marketing poster generation'], isPopular: true },
                        { name: 'Platinum', price: '5999', yearlyPrice: '5939', description: 'For high-volume needs', features: ['10000 Photoshoot generation', '10000 Marketing poster generation'], isPopular: false },
                    ];
                    setPlans(fallbackPlans);
                }
            } catch (error: any) {
                console.error('Failed to fetch plans:', error);
                // Fallback to default plans on error
                const fallbackPlans: PlanItem[] = [
                    { name: 'Silver', price: '749', yearlyPrice: '699', description: 'Perfect for getting started', features: ['1000 Photoshoot generation', '1000 Marketing poster generation'], isPopular: false },
                    { name: 'Gold', price: '1499', yearlyPrice: '1439', description: 'For growing businesses', features: ['2500 Photoshoot generation', '2500 Marketing poster generation'], isPopular: true },
                    { name: 'Platinum', price: '5999', yearlyPrice: '5939', description: 'For high-volume needs', features: ['10000 Photoshoot generation', '10000 Marketing poster generation'], isPopular: false },
                ];
                setPlans(fallbackPlans);
                // Show error toast only in development
                if (import.meta.env.DEV) {
                    console.error('Pricing plans fetch error:', error.message);
                }
            } finally {
                setLoadingPlans(false);
            }
        };

        fetchPlans();
        fetchSubscriptionPlan();
    }, []);

    const handleToggle = () => {
        const newIsMonthly = !isMonthly;
        setIsMonthly(newIsMonthly);
        
        // Trigger confetti when switching to yearly
        if (!newIsMonthly && switchRef.current) {
            const rect = switchRef.current.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;

            confetti({
                particleCount: 70,
                spread: 80,
                origin: {
                    x: x / window.innerWidth,
                    y: y / window.innerHeight,
                },
                colors: ["#ec4899", "#f472b6", "#f9a8d4", "#fef3c7"],
                ticks: 200,
                gravity: 1.2,
                decay: 0.94,
                startVelocity: 30,
                shapes: ["circle", "square"],
            });
        }
    };

    const handleChoosePlan = (plan: PlanItem) => {
        setSelectedPlan(plan);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (paymentId: string, orderId: string) => {
        toast.success('Payment successful! Your credits have been updated.', {
            position: "top-right",
            autoClose: 3000,
        });
        // Refresh subscription plan after successful payment
        await fetchSubscriptionPlan();
        // Reload the page to refresh all components with updated credits
        // Use window.location.href instead of reload() to ensure proper navigation
        setTimeout(() => {
            window.location.href = '/pricing';
        }, 1500);
        setShowPaymentModal(false);
    };

    const handlePaymentError = (error: string) => {
        toast.error(`Payment failed: ${error}`, {
            position: "top-right",
            autoClose: 4000,
        });
        setShowPaymentModal(false);
    };

    return (
        <div className="w-full py-4 md:py-6 bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center space-y-4 mb-12 animate-fade-in-up">
                    <h2 className="text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-bold tracking-tight font-serif-display text-white">Find the Perfect Plan</h2>
                    <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
                        Flexible pricing for teams of all sizes. Start for free and scale as you grow.
                    </p>
                </div>

                <div className="flex justify-center items-center mb-10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                    <span className={`font-semibold transition-colors ${isMonthly ? 'text-white' : 'text-neutral-500'}`}>Monthly</span>
                    <button
                        ref={switchRef}
                        onClick={handleToggle}
                        role="switch"
                        aria-checked={!isMonthly}
                        className="relative mx-4 inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 focus:ring-offset-black bg-neutral-800"
                    >
                        <span className={`pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${!isMonthly ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                    <span className={`font-semibold transition-colors ${!isMonthly ? 'text-white' : 'text-neutral-500'}`}>
                        Annual billing <span className="text-rose-400">(Save 20%)</span>
                    </span>
                </div>

                {loadingPlans ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <div className="sparkle-loader-large">
                            <div className="sparkle-large"></div>
                            <div className="sparkle-large"></div>
                            <div className="sparkle-large"></div>
                        </div>
                        <p className="text-indigo-400 text-sm font-medium">Loading pricing plans...</p>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-4">
                        <p className="text-neutral-400 text-lg">No pricing plans available at the moment.</p>
                        <p className="text-neutral-500 text-sm">Please check back later or contact support.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-4 items-stretch perspective-container">
                        {plans.map((plan, index) => {
                        // Case-insensitive comparison for current plan
                        const isCurrentPlan = currentSubscriptionPlan && plan.name 
                            ? currentSubscriptionPlan.toLowerCase().trim() === plan.name.toLowerCase().trim()
                            : false;
                        const currentPlanLevel = currentSubscriptionPlan ? (planHierarchy[currentSubscriptionPlan] || 0) : 0;
                        const planLevel = planHierarchy[plan.name] || 0;
                        
                        // Check if user has no credits (either photoshoot OR marketing credits are 0)
                        // If any credit type is 0, enable all plans so user can purchase
                        const hasNoCredits = photoshootCredits !== null && marketingPosterCredits !== null 
                            && (photoshootCredits === 0 || marketingPosterCredits === 0);
                        
                        // Logic:
                        // 1. If credits are 0: Enable ALL plans (including current plan - user can repurchase)
                        // 2. If user has credits > 0 and has a plan: Disable current plan and lower plans (only allow upgrades)
                        const isLowerPlan = currentPlanLevel > 0 && planLevel < currentPlanLevel;
                        
                        // If credits are 0, enable ALL plans (no restrictions). 
                        // Otherwise, disable current plan and lower plans (upgrade only).
                        let isDisabled = false;
                        if (hasNoCredits) {
                            // Credits are 0 - enable ALL plans
                            isDisabled = false;
                        } else {
                            // Credits available - apply normal restrictions
                            isDisabled = isCurrentPlan || isLowerPlan;
                        }

                        return (
                        <div
                            key={`${plan.name}-${index}`}
                            className={`relative rounded-2xl p-6 sm:p-8 text-center flex flex-col h-full transition-all duration-500 ease-out ${
                                plan.isPopular 
                                    ? 'bg-neutral-900 border-2 border-rose-500 shadow-2xl shadow-rose-900/40 z-10' 
                                    : isCurrentPlan
                                    ? 'bg-neutral-950/50 border-2 border-indigo-500'
                                    : 'bg-neutral-950/50 border border-neutral-800'
                            } lg:transform-gpu ${plan.isPopular ? 'lg:scale-100 lg:-translate-y-4' : 'lg:scale-95'}`}
                        >
                            {/* Badges on Card Border - Desktop Only */}
                            {(plan.isPopular || isCurrentPlan) && (
                                <>
                                    {/* Desktop: On Border */}
                                    <div className="hidden lg:flex absolute -top-4 left-1/2 -translate-x-1/2 flex-row items-center gap-2 z-20">
                                        {isCurrentPlan && (
                                            <div className="bg-indigo-500 py-1.5 px-4 rounded-full flex items-center text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap shadow-lg">
                                                Your Current Plan
                                            </div>
                                        )}
                                        {plan.isPopular && (
                                            <div className="bg-rose-500 py-1.5 px-4 rounded-full flex items-center text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap shadow-lg">
                                                <StarIcon className="w-4 h-4 mr-1.5 fill-current" />
                                                Most Popular
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Mobile/Tablet: Inside Card */}
                                    <div className="flex lg:hidden flex-row justify-center items-center gap-2 mb-2 flex-wrap">
                                        {isCurrentPlan && (
                                            <div className="bg-indigo-500 py-1.5 px-3 sm:px-4 rounded-full flex items-center text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap shadow-lg">
                                                Your Current Plan
                                            </div>
                                        )}
                                        {plan.isPopular && (
                                            <div className="bg-rose-500 py-1.5 px-3 sm:px-4 rounded-full flex items-center text-[10px] sm:text-xs font-semibold text-white uppercase tracking-wider whitespace-nowrap shadow-lg">
                                                <StarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 fill-current" />
                                                Most Popular
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                            <div className="flex-1 flex flex-col">
                                <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                                <div className="mt-4 flex items-baseline justify-center gap-x-2">
                                    <span key={isMonthly ? plan.price : plan.yearlyPrice} className="text-5xl font-bold tracking-tight text-white animate-price-fade-in">
                                        ₹{isMonthly ? plan.price : plan.yearlyPrice}
                                    </span>
                                    <span className="text-sm font-semibold leading-6 tracking-wide text-neutral-400">/ month</span>
                                </div>
                                <p className="mt-1 text-xs leading-5 text-neutral-500">{isMonthly ? 'billed monthly' : 'billed annually'}</p>

                                <ul className="mt-8 flex-1 space-y-3 text-sm leading-6 text-neutral-300 text-left">
                                    {/* Show credits from credit fields if available, otherwise use features */}
                                    {plan.photoshootCredits !== undefined && plan.marketingPosterCredits !== undefined ? (
                                        <>
                                            <li className="flex gap-x-3">
                                                <CheckIcon className="h-6 w-6 flex-none text-rose-500" />
                                                <span>{plan.photoshootCredits.toLocaleString()} Photoshoot generation</span>
                                            </li>
                                            <li className="flex gap-x-3">
                                                <CheckIcon className="h-6 w-6 flex-none text-rose-500" />
                                                <span>{plan.marketingPosterCredits.toLocaleString()} Marketing poster generation</span>
                                            </li>
                                            {/* Show other features if any */}
                                            {(plan.features || []).filter(f => f && !f.toLowerCase().includes('photoshoot') && !f.toLowerCase().includes('marketing')).map((feature) => (
                                                <li key={feature} className="flex gap-x-3">
                                                    <CheckIcon className="h-6 w-6 flex-none text-rose-500" />
                                                    {feature}
                                                </li>
                                            ))}
                                        </>
                                    ) : (
                                        // Fallback to features array if credit fields not available
                                        (plan.features || []).map((feature) => (
                                            <li key={feature} className="flex gap-x-3">
                                                <CheckIcon className="h-6 w-6 flex-none text-rose-500" />
                                                {feature}
                                            </li>
                                        ))
                                    )}
                                </ul>

                                <div className="mt-auto pt-8">
                                    <button 
                                        onClick={() => handleChoosePlan(plan)}
                                        disabled={isDisabled}
                                        className={`w-full py-3 px-6 text-base font-semibold rounded-lg transition-all duration-300 transform ${
                                            isDisabled 
                                                ? 'opacity-50 cursor-not-allowed bg-neutral-700 text-neutral-400' 
                                                : plan.isPopular 
                                                    ? 'text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 btn-glow hover:scale-105' 
                                                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:scale-105'
                                        }`}
                                    >
                                        {isCurrentPlan && !hasNoCredits ? 'Current Plan' : hasNoCredits ? 'Purchase Plan' : 'Choose Plan'}
                                    </button>
                                    <p className="mt-6 text-xs leading-5 text-neutral-500 h-8">{plan.description}</p>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                    </div>
                )}
            </div>

            {showPaymentModal && selectedPlan && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedPlan(null);
                    }}
                    planName={selectedPlan.name}
                    amount={isMonthly ? parseFloat(selectedPlan.price) : parseFloat(selectedPlan.yearlyPrice) * 12}
                    billingPeriod={isMonthly ? 'monthly' : 'yearly'}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                />
            )}
            
            <style>{`
                .sparkle-loader-large {
                    display: flex;
                    gap: 12px;
                    align-items: center;
                }
                
                .sparkle-large {
                    width: 16px;
                    height: 16px;
                    background: linear-gradient(135deg, #818cf8, #c084fc, #f472b6);
                    border-radius: 50%;
                    animation: sparkleLarge 1.4s ease-in-out infinite;
                }
                
                .sparkle-large:nth-child(1) {
                    animation-delay: 0s;
                }
                
                .sparkle-large:nth-child(2) {
                    animation-delay: 0.2s;
                }
                
                .sparkle-large:nth-child(3) {
                    animation-delay: 0.4s;
                }
                
                @keyframes sparkleLarge {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 0.4;
                    }
                    50% {
                        transform: scale(1.8);
                        opacity: 1;
                        box-shadow: 0 0 20px rgba(129, 140, 248, 0.8),
                                    0 0 40px rgba(192, 132, 252, 0.4);
                    }
                }
            `}</style>
        </div>
    );
};
