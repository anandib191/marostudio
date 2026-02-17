import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EmailOTPAuth } from '../auth/EmailOTPAuth';
import { SignupAuth } from '../auth/SignupAuth';

export const UserLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Check URL params for mode
  const urlParams = new URLSearchParams(location.search);
  const [mode, setMode] = useState<'login' | 'signup'>(urlParams.get('mode') === 'signup' ? 'signup' : 'login');

  // If already authenticated, redirect to home
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      const from = (location.state as any)?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [navigate, location]);

  const handleAuthSuccess = (email: string, token: string) => {
    // Redirect to the page they were trying to access, or home page
    const from = (location.state as any)?.from?.pathname || '/';
    // Force page reload to refresh all components with new auth state
    window.location.href = from;
  };

  if (mode === 'signup') {
    return (
      <SignupAuth
        onAuthSuccess={handleAuthSuccess}
        onSwitchToLogin={() => setMode('login')}
      />
    );
  }

  return (
    <EmailOTPAuth 
      onAuthSuccess={handleAuthSuccess} 
      isAdmin={false}
      onSwitchToSignup={() => setMode('signup')}
    />
  );
};
