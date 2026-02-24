import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmailOTPAuth } from '../auth/EmailOTPAuth';

export const AdminLoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = (email: string, token: string) => {
    navigate('/dashboard');
  };

  return <EmailOTPAuth onAuthSuccess={handleAuthSuccess} isAdmin={true} />;
};
