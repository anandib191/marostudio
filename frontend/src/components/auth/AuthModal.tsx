import React, { useState } from 'react';
import { EmailOTPAuth } from './EmailOTPAuth';
import { SignupAuth } from './SignupAuth';

interface AuthModalProps {
  onAuthSuccess: (email: string, token: string) => void;
  onClose?: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  onAuthSuccess, 
  onClose,
  initialMode = 'login' 
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  if (mode === 'signup') {
    return (
      <SignupAuth
        onAuthSuccess={onAuthSuccess}
        onSwitchToLogin={() => setMode('login')}
      />
    );
  }

  return (
    <EmailOTPAuth
      onAuthSuccess={onAuthSuccess}
      isAdmin={false}
      onSwitchToSignup={() => setMode('signup')}
    />
  );
};
