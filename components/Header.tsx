/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon } from './icons/HomeIcon';
import { NavMenuIcon } from './icons/NavMenuIcon';
import { CloseIcon } from './icons/CloseIcon';
import { Logo } from './Logo';
import { ProfileDropdown } from './ProfileDropdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface HeaderProps {
  hasGeneratedContent: boolean;
  onMenuClick: () => void;
  isMenuOpen: boolean;
  activeSection: string;
}

const navLinks: Array<{ path: string; label: string; isScroll?: boolean }> = [
  { path: '/', label: 'Overview' },
  { path: '#our-flow', label: 'WORKFLOW', isScroll: true },
  { path: '/pricing', label: 'Pricing' },
  { path: '/contact', label: 'Have Query?' },
];

export const Header: React.FC<HeaderProps> = ({ hasGeneratedContent, onMenuClick, isMenuOpen, activeSection }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState<string>('/');

  // Initialize active nav item based on location and hash
  useEffect(() => {
    if (location.pathname !== '/') {
      // For other pages, set based on pathname
      setActiveNavItem(location.pathname);
    } else if (location.hash === '#our-flow') {
      setActiveNavItem('#our-flow');
    } else {
      // Check initial scroll position
      const scrollY = window.scrollY;
      const workflowSection = document.getElementById('our-flow');
      if (workflowSection && scrollY > 300) {
        const rect = workflowSection.getBoundingClientRect();
        if (rect.top < 200) {
          setActiveNavItem('#our-flow');
        } else {
          setActiveNavItem('/');
        }
      } else {
        setActiveNavItem('/');
      }
    }
  }, [location.pathname, location.hash]);

  const isActive = (path: string) => {
    // For non-home pages, check pathname
    if (location.pathname !== '/') {
      return location.pathname === path;
    }

    // For home page, check activeNavItem
    if (path === '/') {
      return activeNavItem === '/';
    }
    if (path === '#our-flow') {
      return activeNavItem === '#our-flow';
    }
    return location.pathname === path;
  };

  // Scroll detection for active nav item on home page
  useEffect(() => {
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const workflowSection = document.getElementById('our-flow');
      const scrollPosition = window.scrollY;
      const headerHeight = 100;

      if (workflowSection) {
        const rect = workflowSection.getBoundingClientRect();
        const sectionTop = rect.top + scrollPosition;
        const viewportTop = scrollPosition;

        // More precise detection: Workflow is active when section is near top of viewport
        // Consider it active when section top is within 250px of viewport top
        const isWorkflowActive = (
          sectionTop <= viewportTop + 250 &&
          sectionTop >= viewportTop - 100
        );

        if (isWorkflowActive && scrollPosition > 200) {
          setActiveNavItem('#our-flow');
        } else if (scrollPosition < 150) {
          // Overview is active when near top of page
          setActiveNavItem('/');
        }
      } else {
        // If section doesn't exist, default to overview
        setActiveNavItem('/');
      }
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledHandleScroll, { passive: true });
    handleScroll(); // Check initial state

    return () => window.removeEventListener('scroll', throttledHandleScroll);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name');
    // Force page reload to refresh all components
    window.location.href = '/';
  };

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('access_token');
    const storedName = localStorage.getItem('user_name');
    const storedEmail = localStorage.getItem('user_email');

    setIsAuthenticated(!!token);

    // Set name and email from localStorage if available
    if (storedName) {
      setUserName(storedName);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
    }

    const fetchUserData = async () => {
      try {
        // Only check user token, not admin token
        if (!token) {
          setSubscriptionPlan(null);
          setUserName(null);
          setUserEmail(null);
          return;
        }

        // Add cache-busting query parameter to ensure fresh data
        const res = await fetch(`${API_URL}/api/credits?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        const data = await res.json();
        if (res.ok && data.success) {
          // Update user name from API response (only use actual name from database, not email)
          if (data.userName && data.userName.trim()) {
            setUserName(data.userName.trim());
            localStorage.setItem('user_name', data.userName.trim());
          } else if (storedName && storedName.trim()) {
            // Keep existing stored name if API doesn't return one
            setUserName(storedName.trim());
          } else {
            // Clear username if no name is available (don't use email)
            setUserName(null);
            localStorage.removeItem('user_name');
          }

          // Set user email from API response or localStorage
          if (data.email && data.email.trim()) {
            setUserEmail(data.email.trim());
            localStorage.setItem('user_email', data.email.trim());
          } else if (storedEmail && storedEmail.trim()) {
            setUserEmail(storedEmail.trim());
          } else {
            setUserEmail(null);
            localStorage.removeItem('user_email');
          }

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
        // Silently fail - don't break the app if fetch fails
        console.error('Failed to fetch user data:', err);
        setSubscriptionPlan(null);
      }
    };

    fetchUserData();
    // Refresh every 5 seconds to catch auth/credit updates (reduced from 3s to avoid rate limits)
    const interval = setInterval(fetchUserData, 5000);

    // Listen for custom auth change events (when user logs in/registers)
    const handleAuthChange = () => {
      const newToken = localStorage.getItem('access_token');
      const newName = localStorage.getItem('user_name');
      const newEmail = localStorage.getItem('user_email');
      setIsAuthenticated(!!newToken);
      if (newName) {
        setUserName(newName);
      }
      if (newEmail) {
        setUserEmail(newEmail);
      }
      fetchUserData();
    };

    // Also listen for storage changes (when user logs in/registers in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user_name' || e.key === 'user_email') {
        handleAuthChange();
      }
    };

    window.addEventListener('userAuthChanged', handleAuthChange);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('userAuthChanged', handleAuthChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-[101] bg-black/70 backdrop-blur-xl border-b-0">
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
              <span className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full uppercase tracking-wider">
                {subscriptionPlan}
              </span>
            )}
          </div>
          {/* Show username only for authenticated/active users (only actual name, not email) */}
          {isAuthenticated && userName && userName.trim() && (
            <p className="text-xs text-white/90 font-medium truncate max-w-[200px] sm:max-w-none mt-0.5" title={userName}>
              {userName}
            </p>
          )}
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-12 text-[10px] md:text-[11px] uppercase tracking-[0.2em] font-bold">
          {navLinks.map(link => {
            // Hide pricing for unauthenticated users

            if (link.isScroll) {
              return (
                <button
                  key={link.path}
                  onClick={() => {
                    setActiveNavItem('#our-flow');
                    if (location.pathname !== '/') {
                      navigate('/');
                      setTimeout(() => {
                        const element = document.getElementById('our-flow');
                        if (element) {
                          const headerHeight = 100;
                          const elementPosition = element.offsetTop;
                          // Increased offset to skip the carousel section above
                          const offsetPosition = elementPosition - headerHeight - 40;
                          window.scrollTo({
                            top: offsetPosition,
                            behavior: 'smooth'
                          });
                        }
                      }, 100);
                    } else {
                      const element = document.getElementById('our-flow');
                      if (element) {
                        const headerHeight = 100;
                        const elementPosition = element.offsetTop;
                        // Increased offset to skip the carousel section above
                        const offsetPosition = elementPosition - headerHeight - 40;
                        window.scrollTo({
                          top: offsetPosition,
                          behavior: 'smooth'
                        });
                      }
                    }
                  }}
                  className={`relative transition-colors ${isActive(link.path) ? 'text-white drop-shadow-lg' : 'text-white hover:text-gold-300 hover:drop-shadow-lg'
                    }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-500" />
                  )}
                </button>
              );
            }
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => {
                  if (link.path === '/') {
                    setActiveNavItem('/');
                    if (location.pathname !== '/') {
                      navigate('/');
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                className={`relative transition-colors ${isActive(link.path) ? 'text-white' : 'text-white hover:text-gold-300'
                  }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-gold-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 md:gap-4">
          {hasGeneratedContent && (
            <button
              onClick={() => navigate('/')}
              className="hidden sm:flex p-2 text-neutral-400 hover:text-white transition-colors"
              title="Back to Home"
            >
              <HomeIcon className="w-4 h-4" />
            </button>
          )}

          {/* Profile Dropdown - Show for authenticated users */}
          {isAuthenticated ? (
            <ProfileDropdown userEmail={userEmail} onLogout={handleLogout} />
          ) : (
            /* Sign In Button - Show for unauthenticated users */
            <button
              onClick={() => navigate('/login')}
              className="text-[9px] md:text-[10px] uppercase tracking-widest text-gold-400 hover:text-gold-300 font-bold py-2 md:py-2.5 px-3 md:px-4 rounded-full transition-all duration-300 border border-gold-500/30 hover:border-gold-400 hover:bg-gold-500/10"
            >
              Sign In
            </button>
          )}

          <button
            onClick={() => location.pathname === '/studio' ? navigate('/studio', { state: { start: true }, replace: true }) : navigate('/studio')}
            className="btn-launch-studio hidden md:flex items-center gap-1.5 text-[9px] md:text-[10px] uppercase tracking-widest text-white font-bold py-0.5 md:py-1 pl-2 pr-0.5 md:pl-2.5 md:pr-0.5 rounded-full transition-all duration-300 transform active:scale-95"
          >
            <span>Launch Studio</span>
            <span className="launch-studio-arrow flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-white/20 flex items-center justify-center">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="M7 17L17 7M17 7h-6M17 7v6" />
              </svg>
            </span>
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
    </header>
  );
};
