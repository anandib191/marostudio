/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon } from './icons/HomeIcon';
import { NavMenuIcon } from './icons/NavMenuIcon';
import { CloseIcon } from './icons/CloseIcon';
import { Logo } from './Logo';
import { ConfirmationModal } from './ui/ConfirmationModal';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface HeaderProps {
    hasGeneratedContent: boolean;
    onMenuClick: () => void;
    isMenuOpen: boolean;
    activeSection: string;
}

const navLinks = [
  { path: '/', label: 'Overview' },
  { path: '/workflow', label: 'Workflow' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/contact', label: 'Have Query?' },
];

export const Header: React.FC<HeaderProps> = ({ hasGeneratedContent, onMenuClick, isMenuOpen, activeSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname === path;
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    navigate('/login');
    };

  useEffect(() => {
    // Get user email from localStorage
    const email = localStorage.getItem('user_email');
    setUserEmail(email);

    const fetchSubscriptionPlan = async () => {
      try {
        // Only check user token, not admin token
        const token = localStorage.getItem('access_token');
        if (!token) {
          setSubscriptionPlan(null);
          return;
        }

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
              setSubscriptionPlan(data.subscriptionPlan);
            } else {
              setSubscriptionPlan(null);
            }
          } else {
            setSubscriptionPlan(null);
          }
        }
      } catch (err) {
        // Silently fail - don't break the app if subscription fetch fails
        console.error('Failed to fetch subscription plan:', err);
        setSubscriptionPlan(null);
      }
    };

    fetchSubscriptionPlan();
    // Refresh every 30 seconds
    const interval = setInterval(fetchSubscriptionPlan, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <Link 
              to="/"
                aria-label="Go to homepage"
                className="transition-opacity hover:opacity-80"
              >
                <Logo />
            </Link>
            {subscriptionPlan && (
              <span className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full uppercase tracking-wider">
                {subscriptionPlan}
              </span>
            )}
          </div>
          {userEmail && (
            <p className="text-xs text-neutral-400 font-medium">
              Welcome, {userEmail}
            </p>
          )}
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-12 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
                  className={`relative transition-colors ${
                isActive(link.path) ? 'text-white' : 'text-neutral-500 hover:text-white'
                  }`}
              >
                  {link.label}
              {isActive(link.path) && (
                      <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                  )}
            </Link>
          ))}
        </nav>
            
        {/* Actions */}
        <div className="flex items-center gap-4">
            {hasGeneratedContent && (
              <button 
              onClick={() => navigate('/')}
                className="hidden sm:flex p-2 text-neutral-400 hover:text-white transition-colors"
                title="Back to Home"
              >
                <HomeIcon className="w-4 h-4" />
              </button>
            )}

            <button 
            onClick={() => setShowLogoutModal(true)}
            className="hidden md:block text-[9px] md:text-[10px] uppercase tracking-widest text-neutral-400 hover:text-white font-bold py-2 md:py-2.5 px-3 md:px-4 rounded-full transition-all duration-300"
            title="Logout"
          >
            Logout
          </button>

          <button 
            onClick={() => location.pathname === '/studio' ? navigate('/studio', { state: { start: true }, replace: true }) : navigate('/studio')} 
            className="hidden md:block text-[9px] md:text-[10px] uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-500 font-bold py-2 md:py-2.5 px-4 md:px-6 rounded-full transition-all duration-300 transform active:scale-95 shadow-lg shadow-indigo-900/20"
          >
            Launch Studio
          </button>

             <button
                onClick={onMenuClick}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                className="p-2 rounded-lg text-neutral-400 hover:text-white md:hidden"
            >
                {isMenuOpen ? <CloseIcon className="w-6 h-6" /> : <NavMenuIcon className="w-6 h-6" />}
            </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access the site."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />
    </header>
  );
};
