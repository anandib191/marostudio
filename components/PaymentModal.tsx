import React, { useState, useEffect } from 'react';
import { loadScript } from './utils/razorpayLoader';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  planName: string;
  amount: number;
  billingPeriod: 'monthly' | 'yearly';
  onPaymentSuccess: (paymentId: string, orderId: string) => void;
  onPaymentError: (error: string) => void;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  planName,
  amount,
  billingPeriod,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Promo code state
  const [promoCode, setPromoCode] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoData, setPromoData] = useState<{
    promoCode: string;
    discountType: string;
    discountValue: number;
    originalAmount: number;
    discountAmount: number;
    finalAmount: number;
  } | null>(null);

  useEffect(() => {
    if (isOpen && !isScriptLoaded) {
      loadScript('https://checkout.razorpay.com/v1/checkout.js')
        .then(() => {
          setIsScriptLoaded(true);
        })
        .catch((error) => {
          console.error('Failed to load Razorpay script:', error);
          onPaymentError('Failed to load payment gateway');
        });
    }
  }, [isOpen, isScriptLoaded, onPaymentError]);

  // Reset promo state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setPromoCode('');
      setPromoError('');
      setPromoApplied(false);
      setPromoData(null);
    }
  }, [isOpen]);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      setPromoError('Please enter a promo code');
      return;
    }

    setPromoLoading(true);
    setPromoError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setPromoError('Please login to continue');
        return;
      }

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/payment/validate-promo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: promoCode.trim(),
          planName,
          billingPeriod,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setPromoApplied(true);
        setPromoData(data);
        setPromoError('');
      } else {
        setPromoError(data.message || 'Invalid promo code');
        setPromoApplied(false);
        setPromoData(null);
      }
    } catch (error: any) {
      setPromoError('Failed to validate promo code');
      setPromoApplied(false);
      setPromoData(null);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoApplied(false);
    setPromoData(null);
    setPromoError('');
  };

  const getFinalAmount = () => {
    if (promoApplied && promoData) {
      return promoData.finalAmount;
    }
    return amount;
  };

  const handlePayment = async () => {
    if (!isScriptLoaded || !window.Razorpay) {
      onPaymentError('Payment gateway not loaded. Please refresh and try again.');
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        onPaymentError('Please login to continue');
        return;
      }

      // Get API URL
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      
      const finalAmount = getFinalAmount();

      // Create order
      const orderResponse = await fetch(`${apiUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: finalAmount,
          planName: planName,
          billingPeriod: billingPeriod,
          promoCode: promoApplied && promoData ? promoData.promoCode : undefined,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      const { order, keyId } = orderData;

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'MARO Studio',
        description: `${planName} Plan - ${billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Subscription${promoApplied ? ` (Promo: ${promoData?.promoCode})` : ''}`,
        order_id: order.id,
        handler: async function (response: any) {
          try {
            // Get API URL (in case it's not in scope)
            const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
            
            // Verify payment
            const verifyResponse = await fetch(`${apiUrl}/api/payment/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planName: planName,
                billingPeriod: billingPeriod,
                amount: finalAmount,
                promoCode: promoApplied && promoData ? promoData.promoCode : undefined,
                promoDiscount: promoApplied && promoData ? promoData.discountAmount : undefined,
                originalAmount: promoApplied && promoData ? promoData.originalAmount : undefined,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              onPaymentSuccess(response.razorpay_payment_id, response.razorpay_order_id);
              onClose();
            } else {
              onPaymentError(verifyData.message || 'Payment verification failed');
            }
          } catch (error: any) {
            console.error('Payment verification error:', error);
            onPaymentError(error.message || 'Failed to verify payment');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          email: localStorage.getItem('user_email') || '',
        },
        theme: {
          color: '#e6b71e',
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        console.error('Payment failed:', response.error);
        // Log failed payment to backend
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
          fetch(`${apiUrl}/api/payment/log-failed`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              planName,
              billingPeriod,
              orderId: order.id,
              errorCode: response.error.code,
              errorDescription: response.error.description,
              amount: finalAmount,
            }),
          }).catch((err) => console.error('Failed to log payment failure:', err));
        } catch (_) {}
        onPaymentError(response.error.description || 'Payment failed');
        setIsLoading(false);
      });
      razorpay.open();

    } catch (error: any) {
      console.error('Payment error:', error);
      onPaymentError(error.message || 'Failed to initiate payment');
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const finalAmount = getFinalAmount();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border-2 border-gold-500/30 rounded-3xl shadow-2xl shadow-gold-500/20 max-w-md w-full mx-4 p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gold-400 mb-2 font-serif-display drop-shadow-md">
            Complete Payment
          </h3>
          <p className="text-neutral-400 text-sm">
            {planName} Plan - {billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
          </p>
        </div>

        <div className="mb-4 p-4 bg-black/40 rounded-xl border border-gold-500/20 hover:border-gold-500/30 transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">Plan</span>
            <span className="text-gold-300 font-semibold">{planName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">Billing Period</span>
            <span className="text-gold-300 font-semibold capitalize">{billingPeriod}</span>
          </div>

          {/* Price breakdown with promo */}
          {promoApplied && promoData ? (
            <>
              <div className="flex justify-between items-center mb-1">
                <span className="text-neutral-400">Original Price</span>
                <span className="text-neutral-500 line-through text-sm">₹{promoData.originalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-green-400 text-sm flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  Discount ({promoData.promoCode})
                </span>
                <span className="text-green-400 font-semibold text-sm">-₹{promoData.discountAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gold-500/20">
                <span className="text-neutral-400">Amount to Pay</span>
                <span className="text-gold-400 font-bold text-xl drop-shadow">₹{finalAmount.toLocaleString('en-IN')}</span>
              </div>
            </>
          ) : (
            <div className="flex justify-between items-center pt-2 border-t border-gold-500/20">
              <span className="text-neutral-400">Amount</span>
              <span className="text-gold-400 font-bold text-xl drop-shadow">₹{amount.toLocaleString('en-IN')}</span>
            </div>
          )}
        </div>

        {/* Promo Code Input */}
        <div className="mb-6">
          {promoApplied && promoData ? (
            <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400 font-semibold text-sm">
                  {promoData.promoCode} applied
                  <span className="text-green-500/70 font-normal ml-1">
                    ({promoData.discountType === 'percentage' ? `${promoData.discountValue}% off` : `₹${promoData.discountValue} off`})
                  </span>
                </span>
              </div>
              <button
                onClick={handleRemovePromo}
                className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                title="Remove promo code"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => {
                    setPromoCode(e.target.value.toUpperCase());
                    setPromoError('');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyPromo();
                    }
                  }}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-2.5 bg-black/40 border border-white/10 rounded-xl text-white text-sm placeholder-neutral-500 focus:outline-none focus:border-gold-500/50 transition-colors uppercase tracking-wider"
                  disabled={promoLoading}
                />
                <button
                  onClick={handleApplyPromo}
                  disabled={promoLoading || !promoCode.trim()}
                  className="px-5 py-2.5 bg-gold-600/20 hover:bg-gold-600/30 border border-gold-500/30 text-gold-400 text-sm font-semibold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {promoLoading ? (
                    <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </button>
              </div>
              {promoError && (
                <p className="text-red-400 text-xs mt-2 pl-1">{promoError}</p>
              )}
            </>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-6 py-3 text-neutral-300 hover:text-white border border-white/20 hover:border-white/40 rounded-xl transition-all duration-300 font-semibold text-sm uppercase tracking-wider hover:bg-white/5 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={isLoading || !isScriptLoaded}
            className="flex-1 px-6 py-3 text-white bg-gold-600 hover:bg-gold-500 rounded-xl transition-all duration-300 font-semibold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : `Pay ₹${finalAmount.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </div>
  );
};
