import React, { useState, useEffect } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Logo } from '../Logo';

interface SignupAuthProps {
  onAuthSuccess: (email: string, token: string) => void;
  onSwitchToLogin: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const SignupAuth: React.FC<SignupAuthProps> = ({ onAuthSuccess, onSwitchToLogin }) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.auth-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  // Validate phone number
  const validatePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');

    if (!cleaned) {
      return 'Phone number is required';
    }

    if (cleaned.length !== 10) {
      return 'Phone number must be exactly 10 digits';
    }

    // Check if it contains only digits
    if (!/^[0-9]{10}$/.test(cleaned)) {
      return 'Phone number must contain only digits';
    }

    return '';
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setPhoneNumber(value);

    // Validate on change
    if (value) {
      const error = validatePhoneNumber(value);
      setPhoneError(error);
    } else {
      setPhoneError('');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setPhoneError('');
    setLoading(true);

    // Validate phone number before submitting
    const phoneValidationError = validatePhoneNumber(phoneNumber);
    if (phoneValidationError) {
      setPhoneError(phoneValidationError);
      setLoading(false);
      return;
    }

    // Validate name
    if (!name.trim()) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    // Validate email
    if (!email.trim()) {
      setError('Email is required');
      setLoading(false);
      return;
    }

    try {
      const url = `${API_URL}/api/auth/send-otp`;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          is_signup: true,
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        // Handle rate limit errors professionally with user-friendly messages
        if (response.status === 429 || errorData.errorType === 'RATE_LIMIT') {
          const retryAfter = errorData.retryAfter || 0;
          const canRetry = errorData.canRetry !== false; // Default to true if not specified

          let userMessage = '';
          if (canRetry && retryAfter > 0 && retryAfter < 60) {
            // Short wait (less than 1 minute) - friendly message
            userMessage = `Please wait ${retryAfter} second${retryAfter !== 1 ? 's' : ''} before requesting a new code.`;
          } else if (retryAfter > 0) {
            // Longer wait - show minutes and seconds
            const minutes = Math.floor(retryAfter / 60);
            const seconds = retryAfter % 60;
            if (minutes > 0) {
              userMessage = `Please wait ${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''} before requesting a new code.`;
            } else {
              userMessage = `Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before requesting a new code.`;
            }
          } else {
            // Use server message or default
            userMessage = errorData.message || 'Please wait a moment before requesting a new code.';
          }

          const error: any = new Error(userMessage);
          error.status = 429;
          error.errorType = 'RATE_LIMIT';
          error.retryAfter = retryAfter;
          error.canRetry = canRetry;
          throw error;
        }

        // Check if user already exists
        if (errorData.userExists) {
          throw new Error('User already registered. Please login instead.');
        }

        // Check if email is invalid (disposable/fake)
        if (errorData.invalidEmail) {
          throw new Error(errorData.message || 'Invalid email address. Please use a valid email.');
        }

        throw new Error(errorData.message || errorData.detail || `Failed to send OTP: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || data.detail || 'Failed to send OTP');
      }

      setOtpSent(true);
      setStep('otp');
      // Start 20 second cooldown for resend (signup is more lenient)
      setResendCooldown(20);
      setCanResend(false);

      // Countdown timer
      const countdownInterval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      console.error('Send OTP error:', err);

      // Handle user already exists error with login option
      if (err.userExists) {
        setError(err.message || 'An account with this email already exists. Please login instead.');
      } else if (err.status === 429 || err.errorType === 'RATE_LIMIT') {
        // Error message already set in the catch block above
        setError(err.message || 'Please wait a moment before requesting a new code.');
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to send OTP. Please try again.');
      }
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
        const error: any = new Error(data.message || data.detail || 'Invalid OTP');
        error.status = response.status;
        error.errorType = data.errorType;
        error.retryAfter = data.retryAfter;
        throw error;
      }

      // Store user token and name
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', email);
      localStorage.setItem('user_role', data.role || 'user');
      if (data.user?.name) {
        localStorage.setItem('user_name', data.user.name);
      }
      // Dispatch custom event to notify Header component
      window.dispatchEvent(new Event('userAuthChanged'));

      onAuthSuccess(email, data.access_token);
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || resendCooldown > 0) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          is_signup: true,
          name: name.trim(),
          phoneNumber: phoneNumber.trim(),
        }),
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        // Handle rate limit errors professionally
        if (response.status === 429 || errorData.errorType === 'RATE_LIMIT') {
          const retryAfter = errorData.retryAfter || 0;
          const canRetry = errorData.canRetry !== false;

          let userMessage = '';
          if (canRetry && retryAfter > 0 && retryAfter < 60) {
            userMessage = `Please wait ${retryAfter} second${retryAfter !== 1 ? 's' : ''} before requesting a new code.`;
            setResendCooldown(retryAfter);
            setCanResend(false);

            // Start countdown
            const countdownInterval = setInterval(() => {
              setResendCooldown((prev) => {
                if (prev <= 1) {
                  clearInterval(countdownInterval);
                  setCanResend(true);
                  return 0;
                }
                return prev - 1;
              });
            }, 1000);
          } else if (retryAfter > 0) {
            const minutes = Math.floor(retryAfter / 60);
            const seconds = retryAfter % 60;
            if (minutes > 0) {
              userMessage = `Please wait ${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''} before requesting a new code.`;
            } else {
              userMessage = `Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before requesting a new code.`;
            }
          } else {
            userMessage = errorData.message || 'Please wait a moment before requesting a new code.';
          }

          setError(userMessage);
          return;
        }

        throw new Error(errorData.message || errorData.detail || 'Failed to resend OTP');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || data.detail || 'Failed to resend OTP');
      }

      setOtp('');
      setError('');
      // Reset cooldown
      setResendCooldown(20);
      setCanResend(false);

      // Start countdown timer
      const countdownInterval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) return;

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Google sign up failed');
      }

      // Store user token
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user_email', data.user?.email || '');
      localStorage.setItem('user_role', data.role || 'user');
      if (data.user?.name) {
        localStorage.setItem('user_name', data.user.name);
      }
      // Dispatch custom event to notify Header component
      window.dispatchEvent(new Event('userAuthChanged'));

      onAuthSuccess(data.user?.email || '', data.access_token);
    } catch (err: any) {
      setError(err.message || 'Google sign up failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-[100]" style={{ overflow: 'hidden', height: '100vh', top: '80px' }}>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-[-1]">
        <img
          src="https://images.unsplash.com/photo-1516924962500-2b4b3b99ea02?q=80&w=1920&auto=format&fit=crop"
          alt="Authentication background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      {/* Content Container - Centered */}
      <div className="flex flex-col items-center justify-center w-full h-full" style={{ overflow: 'hidden' }}>

        {/* Auth Form */}
        <div className="w-full max-w-md mx-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4">
          <h1 className="text-lg font-bold text-white font-serif-display mb-0.5 text-center">
            Create Account
          </h1>
          <p className="text-xs text-neutral-400 mb-2 text-center">
            {step === 'details'
              ? 'Fill in your details to get started'
              : 'Enter the OTP sent to your email'
            }
          </p>

          {error && (
            <div className={`mb-2 p-1.5 rounded-lg text-xs ${error.includes('already exists') || error.includes('login instead')
              ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
              : 'bg-red-500/20 border border-red-500/50 text-red-300'
              }`}>
              <div className="flex flex-col gap-1">
                <span>{error}</span>
                {(error.includes('already exists') || error.includes('login instead')) && onSwitchToLogin && (
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-blue-400 hover:text-blue-300 font-semibold underline mt-1 text-left"
                  >
                    Sign in instead →
                  </button>
                )}
              </div>
            </div>
          )}

          {step === 'details' ? (
            <>
              <div className="mb-2 w-full flex justify-center">
                <div className="w-full">
                  <div className="flex justify-center">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => setError('Google sign up failed. Please try again.')}
                      theme="outline"
                      shape="rectangular"
                      text="signup_with"
                      size="large"
                      width="100%"
                    />
                  </div>
                </div>
              </div>
              <div className="relative mb-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-black/60 text-neutral-400">OR</span>
                </div>
              </div>
              <form onSubmit={handleSendOTP} className="space-y-2">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-neutral-300 mb-1">
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
                    placeholder="John Doe"
                    disabled={loading}
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-neutral-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    required
                    className={`w-full px-3 py-2 bg-white/5 border rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 text-sm ${phoneError
                      ? 'border-red-500/50 focus:ring-red-500 focus:border-red-500'
                      : 'border-white/10 focus:ring-gold-500 focus:border-transparent'
                      }`}
                    placeholder="9876543210"
                    disabled={loading}
                  />
                  {phoneError && (
                    <p className="mt-1 text-xs text-red-400">{phoneError}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-neutral-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-sm"
                    placeholder="your.email@example.com"
                    disabled={loading}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || !name.trim() || !phoneNumber.trim() || !email.trim() || !!phoneError}
                  className="w-full py-1.5 btn-auth-submit text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>
                <div className="text-center text-xs text-neutral-400 pt-0.5">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="text-gold-400 hover:text-gold-300 font-semibold"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            </>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-2">
              <div>
                <label htmlFor="otp" className="block text-xs font-medium text-neutral-300 mb-1">
                  OTP Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent text-center text-lg tracking-widest"
                  placeholder="000000"
                  disabled={loading}
                />
              </div>
              <div className="text-xs text-neutral-400 text-center">
                OTP sent to <span className="text-white">{email}</span>
              </div>
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-1.5 btn-auth-submit text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Verifying...' : 'Verify OTP & Create Account'}
              </button>
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={!canResend || resendCooldown > 0 || loading}
                className={`w-full py-0.5 text-xs transition-colors ${!canResend || resendCooldown > 0 || loading
                  ? 'text-neutral-600 cursor-not-allowed opacity-50'
                  : 'text-gold-400 hover:text-gold-300'
                  }`}
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep('details');
                  setOtp('');
                  setError('');
                }}
                className="w-full py-0.5 text-gradient-gold text-xs transition-colors hover:scale-105 transform duration-300"
              >
                Change Email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
