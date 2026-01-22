import React, { useState } from 'react';
import { Logo } from '../Logo';

interface EmailOTPAuthProps {
  onAuthSuccess: (email: string, token: string) => void;
  isAdmin?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const EmailOTPAuth: React.FC<EmailOTPAuthProps> = ({ onAuthSuccess, isAdmin = false }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, is_admin: isAdmin }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.detail || 'Failed to send OTP');
      }

      setOtpSent(true);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.detail || 'Invalid OTP');
      }

      // Store tokens separately for admin and user
      if (isAdmin) {
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_email', email);
        localStorage.setItem('admin_role', data.role || 'admin');
        // Don't set user token for admin login
      } else {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_email', email);
        localStorage.setItem('user_role', data.role || 'user');
        // Don't set admin token for user login
      }
      
      onAuthSuccess(email, data.access_token);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, is_admin: isAdmin }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.detail || 'Failed to resend OTP');
      }

      setOtp('');
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center p-8 z-[100]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-[-1]">
        <img 
          src="https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=1920&auto=format&fit=crop" 
          alt="Authentication background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      {/* Header with Logo */}
      <header className="w-full mb-8">
        <div className="flex justify-center">
          <Logo />
        </div>
      </header>

      {/* Auth Form */}
      <div className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-white font-serif-display mb-2 text-center">
          {isAdmin ? 'Admin Sign In' : 'Sign In'}
        </h1>
        <p className="text-sm text-neutral-400 mb-8 text-center">
          {step === 'email' 
            ? 'Enter your email to receive an OTP'
            : 'Enter the OTP sent to your email'
          }
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="your.email@example.com"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-neutral-300 mb-2">
                OTP Code
              </label>
              <input
                id="otp"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                maxLength={6}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="000000"
                disabled={loading}
              />
            </div>
            <div className="text-sm text-neutral-400 text-center">
              OTP sent to <span className="text-white">{email}</span>
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full py-2 text-indigo-400 hover:text-indigo-300 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Resend OTP
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email');
                setOtp('');
                setError('');
              }}
              className="w-full py-2 text-neutral-400 hover:text-neutral-300 text-sm transition-colors"
            >
              Change Email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
