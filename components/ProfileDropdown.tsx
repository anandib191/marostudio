import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ProfileIcon } from './ProfileIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { ImageIcon } from './icons/ImageIcon';
import { LogoutIcon } from './icons/LogoutIcon';
import { ConfirmationModal } from './ui/ConfirmationModal';
import './ProfileDropdown.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface ProfileDropdownProps {
  userEmail: string | null;
  onLogout: () => void;
}

export const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userEmail, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [totalCredits, setTotalCredits] = useState<number | null>(null);
  const [remainingCredits, setRemainingCredits] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCredits = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/api/credits?t=${Date.now()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          console.log('ProfileDropdown - Credits data:', data);
          
          setTotalCredits(data.totalCredits || 0);
          setRemainingCredits(data.remainingCredits || 0);
        }
      } catch (error) {
        console.error('ProfileDropdown - Error fetching credits:', error);
      }
    };

    fetchCredits();
    const interval = setInterval(fetchCredits, 10000);
    return () => clearInterval(interval);
  }, []);

  // Click outside effect to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const creditPercentage = totalCredits && totalCredits > 0 
    ? Math.round((remainingCredits! / totalCredits) * 100)
    : 0;

  console.log('ProfileDropdown - Credit calculation:', {
    totalCredits,
    remainingCredits,
    creditPercentage
  }); // Debug log

  const handleMyGenerations = () => {
    setIsOpen(false);
    navigate('/previously-generated');
  };

  const handleTopUpCredits = () => {
    setIsOpen(false);
    navigate('/pricing');
  };

  const handleSignOut = () => {
    setIsOpen(false);
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    onLogout();
    setShowLogoutModal(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-gold-500/10 transition-all duration-300 group"
        aria-label="Profile menu"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center group-hover:from-gold-300 group-hover:to-gold-500 transition-all duration-300 shadow-lg group-hover:shadow-gold-500/25">
          <ProfileIcon className="w-4 h-4 text-white" />
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop - Blur entire website background */}
          <div 
            className="fixed inset-0 z-[9999] backdrop-blur-sm bg-black/30" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu - Positioned and responsive */}
          <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-neutral-900 border border-gold-500/20 rounded-xl shadow-2xl shadow-gold-500/10 z-[10000] overflow-hidden">
            {/* Credits Progress */}
            <div className="px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-neutral-400 font-medium">Credits</span>
                <span className="text-xs text-gold-400 font-semibold">
                  {remainingCredits} / {totalCredits}
                </span>
              </div>
              
              {/* Progress Bar - Enhanced Golden Gradient */}
              <div className="relative h-2 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-gold-400 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${creditPercentage}%` }}
                >
                  {/* Golden Shimmer Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 via-transparent to-transparent animate-pulse"></div>
                </div>
              </div>
              
              {/* Percentage Remaining */}
              <div className="mt-2 text-xs text-gold-400/80 font-medium text-center">
                {creditPercentage}% remaining
              </div>
            </div>

            {/* User Info */}
            {userEmail && (
              <div className="px-4 py-3 border-b border-neutral-800">
                <p className="text-sm font-medium text-white truncate">{userEmail}</p>
              </div>
            )}

            {/* Menu Items */}
            <div className="py-2">
              <button
                onClick={handleMyGenerations}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-gold-500/10 transition-all duration-200"
              >
                <ImageIcon className="w-4 h-4 text-gold-400" />
                <span>My Generations</span>
              </button>

              <button
                onClick={handleTopUpCredits}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white transition-all duration-200"
              >
                {/* Credit Card Icon */}
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <span>Top Up Credits</span>
              </button>

              <button
                onClick={() => { setIsOpen(false); navigate('/purchase-history'); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-300 hover:text-white hover:bg-gold-500/10 transition-all duration-200"
              >
                {/* Receipt Icon */}
                <svg className="w-4 h-4 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <span>Purchase History</span>
              </button>
              
              <div className="border-t border-neutral-800 my-2"></div>

              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
              >
                <LogoutIcon className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
      
      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access the site."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />
    </div>
  );
};
