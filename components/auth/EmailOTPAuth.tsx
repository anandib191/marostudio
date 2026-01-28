import React, { useState, useEffect } from 'react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { Logo } from '../Logo';

interface EmailOTPAuthProps {
  onAuthSuccess: (email: string, token: string) => void;
  isAdmin?: boolean;
  onSwitchToSignup?: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const EmailOTPAuth: React.FC<EmailOTPAuthProps> = ({ onAuthSuccess, isAdmin = false, onSwitchToSignup }) => {
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    const container = document.querySelector('.auth-container');
    if (container) {
      container.scrollTop = 0;
    }
  }, []);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const url = `${API_URL}/api/auth/send-otp`;
      
      // Debug: Log the API URL in development
      if (import.meta.env.DEV) {
        console.log('Sending OTP to:', url);
        console.log('API_URL:', API_URL);
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, is_admin: isAdmin }),
      });

      // Check if response is ok before trying to parse JSON
      if (!response.ok) {
        // If 404, provide more helpful error
        if (response.status === 404) {
          throw new Error(`API endpoint not found. Check if VITE_API_URL is set correctly. Current: ${API_URL}`);
        }
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        
        // Handle user not found error (for login)
        if (errorData.userNotFound) {
          const error: any = new Error('No account found with this email. Please sign up first.');
          error.userNotFound = true;
          throw error;
        }
        
        // Handle rate limit errors professionally with user-friendly messages
        if (response.status === 429 || errorData.errorType === 'RATE_LIMIT') {
          const retryAfter = errorData.retryAfter || 0;
          const canRetry = errorData.canRetry !== false;
          
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
        
        const error: any = new Error(errorData.message || errorData.detail || `Failed to send OTP: ${response.status}`);
        error.status = response.status;
        error.errorType = errorData.errorType;
        error.retryAfter = errorData.retryAfter;
        throw error;
      }

      const data = await response.json();

      if (!data.success) {
        // If user not found during login, show helpful message with signup option
        if (data.userNotFound && onSwitchToSignup) {
          setError(data.message || 'No account found. Please sign up first.');
          return;
        }
        throw new Error(data.message || data.detail || 'Failed to send OTP');
      }

      setOtpSent(true);
      setStep('otp');
    } catch (err: any) {
      console.error('Send OTP error:', err);
      console.error('API_URL used:', API_URL);
      console.error('Full URL:', `${API_URL}/api/auth/send-otp`);
      
      // Handle user not found error with signup option
      if (err.userNotFound) {
        setError(err.message || 'No account found with this email. Please sign up first.');
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError(`Cannot connect to server. Please check if backend is running at: ${API_URL}`);
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
        // Store user name if available
        if (data.user?.name) {
          localStorage.setItem('user_name', data.user.name);
        } else if (data.name) {
          localStorage.setItem('user_name', data.name);
        }
        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('userAuthChanged'));
        // Don't set admin token for user login
      }
      
      onAuthSuccess(email, data.access_token);
    } catch (err: any) {
      // Handle rate limit errors professionally with user-friendly messages
      if (err.status === 429 || err.errorType === 'RATE_LIMIT') {
        const retryAfter = err.retryAfter || 0;
        const canRetry = err.canRetry !== false;
        
        let userMessage = '';
        if (canRetry && retryAfter > 0 && retryAfter < 60) {
          userMessage = `Please wait ${retryAfter} second${retryAfter !== 1 ? 's' : ''} before requesting a new code.`;
        } else if (retryAfter > 0) {
          const minutes = Math.floor(retryAfter / 60);
          const seconds = retryAfter % 60;
          if (minutes > 0) {
            userMessage = `Please wait ${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''} before requesting a new code.`;
          } else {
            userMessage = `Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before requesting a new code.`;
          }
        } else {
          userMessage = err.message || 'Please wait a moment before requesting a new code.';
        }
        setError(userMessage);
      } else if (err.message?.includes('Failed to fetch') || err.message?.includes('NetworkError')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Invalid OTP. Please try again.');
      }
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
        throw new Error(data.message || 'Google authentication failed');
      }

      // Store tokens
      if (isAdmin) {
        localStorage.setItem('admin_token', data.access_token);
        localStorage.setItem('admin_email', data.user?.email || '');
        localStorage.setItem('admin_role', data.role || 'admin');
      } else {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user_email', data.user?.email || '');
        localStorage.setItem('user_role', data.role || 'user');
        if (data.user?.name) {
          localStorage.setItem('user_name', data.user.name);
        }
        // Dispatch custom event to notify Header component
        window.dispatchEvent(new Event('userAuthChanged'));
      }
      
      onAuthSuccess(data.user?.email || '', data.access_token);
    } catch (err: any) {
      setError(err.message || 'Google authentication failed. Please try again.');
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
          {isAdmin ? 'Admin Sign In' : 'Sign In'}
        </h1>
        <p className="text-xs text-neutral-400 mb-2 text-center">
          {step === 'email' 
            ? 'Enter your email to receive an OTP'
            : 'Enter the OTP sent to your email'
          }
        </p>

        {error && (
          <div className={`mb-2 p-1.5 rounded-lg text-xs ${
            error.includes('No account found') || error.includes('sign up')
              ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300'
              : 'bg-red-500/20 border border-red-500/50 text-red-300'
          }`}>
            <div className="flex flex-col gap-1">
              <span>{error}</span>
              {error.includes('No account found') && onSwitchToSignup && (
                <button
                  type="button"
                  onClick={onSwitchToSignup}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline mt-1 text-left"
                >
                  Create an account instead →
                </button>
              )}
            </div>
          </div>
        )}

        {step === 'email' ? (
          <>
            {!isAdmin && (
              <div className="mb-2 w-full flex justify-center">
                <div className="w-full max-w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google sign in failed. Please try again.')}
                    theme="outline"
                    shape="rectangular"
                    text="signin_with"
                    size="large"
                    width="100%"
                  />
                </div>
              </div>
            )}
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
                <label htmlFor="email" className="block text-xs font-medium text-neutral-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                  placeholder="your.email@example.com"
                  disabled={loading}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? 'Sending...' : 'Send OTP'}
              </button>
              {!isAdmin && onSwitchToSignup && (
                <div className="text-center text-xs text-neutral-400 pt-0.5">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={onSwitchToSignup}
                    className="text-indigo-400 hover:text-indigo-300 font-semibold"
                  >
                    Sign Up
                  </button>
                </div>
              )}
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
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-lg tracking-widest"
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
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading}
              className="w-full py-0.5 text-indigo-400 hover:text-indigo-300 text-xs transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="w-full py-0.5 text-neutral-400 hover:text-neutral-300 text-xs transition-colors"
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
