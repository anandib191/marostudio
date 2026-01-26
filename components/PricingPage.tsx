import React, { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CheckIcon } from './icons/CheckIcon';
import { StarIcon } from './icons/StarIcon';
import { PaymentModal } from './PaymentModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Declare confetti as a global function for TypeScript
declare const confetti: (options: any) => void;

type PlanItem = { name: string; price: string; yearlyPrice: string; description: string; features: string[]; isPopular: boolean };

const FALLBACK_PLANS: PlanItem[] = [
    {
        name: 'Silver',
        price: '49',
        yearlyPrice: '40',
        description: 'For early brands and creators',
        features: [
            "Access to model library",
            "Background presets",
            "Max upload file size: 10 MB",
            "Max output resolution: HD (up to 1080px)",
            "No watermark",
            "Regenerations per image: 1",
            "Edits per image: 1",
            "Email Support within 48 hours"
        ],
        isPopular: false,
    },
    {
        name: 'Gold',
        price: '59',
        yearlyPrice: '47',
        description: 'For growing teams',
        features: [
            "Access to model library",
            "Background presets",
            "Max upload file size: 10 MB",
            "Max output resolution: 2K (up to 2048px)",
            "No watermark",
            "Regenerations per image: 2",
            "Edits per image: 1",
            "Email Support within 24 hours"
        ],
        isPopular: true,
    },
    {
        name: 'Platinum',
        price: '68',
        yearlyPrice: '54',
        description: 'For high-velocity teams',
        features: [
            "Access to model library",
            "Background presets",
            "Max upload file size: 10 MB",
            "Max output resolution: 2K (up to 2048px)",
            "No watermark",
            "Regenerations per image: 3",
            "Edits per image: 1",
            "Email Support within 12 hours"
        ],
        isPopular: false,
    }
];

export const PricingPage: React.FC = () => {
    const [plans, setPlans] = useState<PlanItem[]>(FALLBACK_PLANS);
    const [isMonthly, setIsMonthly] = useState(true);
    const switchRef = useRef<HTMLButtonElement>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
    const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState<string | null>(null);

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
            const res = await fetch(`${API_URL}/api/credits`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            if (res.ok && data.success) {
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
        fetch(`${API_URL}/api/price-plans`)
            .then((res) => res.json())
            .then((data) => { if (data.success && Array.isArray(data.plans) && data.plans.length) setPlans(data.plans); })
            .catch(() => {});
        
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-4 items-stretch perspective-container">
                    {plans.map((plan, index) => {
                        // Case-insensitive comparison for current plan
                        const isCurrentPlan = currentSubscriptionPlan && plan.name 
                            ? currentSubscriptionPlan.toLowerCase().trim() === plan.name.toLowerCase().trim()
                            : false;
                        const currentPlanLevel = currentSubscriptionPlan ? (planHierarchy[currentSubscriptionPlan] || 0) : 0;
                        const planLevel = planHierarchy[plan.name] || 0;
                        const isLowerPlan = currentPlanLevel > 0 && planLevel < currentPlanLevel;
                        const isDisabled = isLowerPlan || isCurrentPlan;

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
                                    {(plan.features || []).map((feature) => (
                                        <li key={feature} className="flex gap-x-3">
                                            <CheckIcon className="h-6 w-6 flex-none text-rose-500" />
                                            {feature}
                                        </li>
                                    ))}
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
                                        {isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
                                    </button>
                                    <p className="mt-6 text-xs leading-5 text-neutral-500 h-8">{plan.description}</p>
                                </div>
                            </div>
                        </div>
                        );
                    })}
                </div>
            </div>

            {showPaymentModal && selectedPlan && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => {
                        setShowPaymentModal(false);
                        setSelectedPlan(null);
                    }}
                    planName={selectedPlan.name}
                    amount={parseFloat(isMonthly ? selectedPlan.price : selectedPlan.yearlyPrice)}
                    billingPeriod={isMonthly ? 'monthly' : 'yearly'}
                    onPaymentSuccess={handlePaymentSuccess}
                    onPaymentError={handlePaymentError}
                />
            )}
        </div>
    );
};
