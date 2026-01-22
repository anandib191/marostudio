import React, { useRef, useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ConfirmationModal } from './ui/ConfirmationModal';

interface DropdownMenuProps {
    onClose: () => void;
    activeSection: string;
}

const navLinks = [
  { path: '/', label: 'Overview' },
  { path: '/workflow', label: 'Workflow' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/contact', label: 'Have Query?' },
];

export const DropdownMenu: React.FC<DropdownMenuProps> = ({ onClose, activeSection }) => {
    const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

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
        onClose();
    };

    return (
        <div
            ref={menuRef}
            className="fixed top-20 right-4 z-[60] w-[calc(100vw-2rem)] max-w-sm bg-neutral-950/90 backdrop-blur-xl rounded-2xl border border-neutral-700/50 shadow-2xl p-8 animate-fade-in-down-right"
        >
            <nav className="flex flex-col items-center space-y-6">
                 {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            onClick={onClose}
            className={`transition-colors text-lg ${isActive(link.path) ? 'font-semibold text-white' : 'text-neutral-300 hover:text-white'}`}
                    >
                        {link.label}
          </Link>
                ))}
                <button 
                  onClick={() => { (location.pathname === '/studio' ? navigate('/studio', { state: { start: true }, replace: true }) : navigate('/studio')); onClose(); }}
                  className="mt-4 w-full text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 font-semibold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105 btn-glow"
                >
                  Launch Studio
                </button>
        <button 
          onClick={() => {
            setShowLogoutModal(true);
            onClose();
          }}
          className="mt-2 w-full text-neutral-400 hover:text-white border border-neutral-700 hover:border-neutral-500 font-semibold py-3 px-4 rounded-full transition-all duration-300"
        >
          Logout
                </button>
            </nav>

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
        </div>
    );
};
