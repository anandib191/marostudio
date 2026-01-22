import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EmailOTPAuth } from '../auth/EmailOTPAuth';

export const UserLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
    navigate(from, { replace: true });
  };

  return <EmailOTPAuth onAuthSuccess={handleAuthSuccess} isAdmin={false} />;
};
