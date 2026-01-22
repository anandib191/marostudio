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
      
      // Create order
      const orderResponse = await fetch(`${apiUrl}/api/payment/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount: amount,
          planName: planName,
          billingPeriod: billingPeriod,
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
        name: 'NextGen Photo',
        description: `${planName} Plan - ${billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
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
          color: '#6366f1',
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

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-white/20 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8">
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-white mb-2 font-serif-display">
            Complete Payment
          </h3>
          <p className="text-neutral-400 text-sm">
            {planName} Plan - {billingPeriod === 'monthly' ? 'Monthly' : 'Yearly'} Subscription
          </p>
        </div>

        <div className="mb-6 p-4 bg-black/40 rounded-xl border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">Plan</span>
            <span className="text-white font-semibold">{planName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-neutral-400">Billing Period</span>
            <span className="text-white font-semibold capitalize">{billingPeriod}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-white/5">
            <span className="text-neutral-400">Amount</span>
            <span className="text-white font-bold text-xl">₹{amount}</span>
          </div>
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
            className="flex-1 px-6 py-3 text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all duration-300 font-semibold text-sm uppercase tracking-wider shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
