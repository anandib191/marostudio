/// <reference types="vite/client" />

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Logo } from './Logo';
import { ProfileDropdown } from './ProfileDropdown';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const StudioTopBar: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userEmail, setUserEmail] = useState<string | null>(null);
    const [subscriptionPlan, setSubscriptionPlan] = useState<string | null>(null);

    const handleLogout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');
        window.location.href = '/';
    };

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedEmail = localStorage.getItem('user_email');
        setIsAuthenticated(!!token);
        if (storedEmail) setUserEmail(storedEmail);

        const fetchUser = async () => {
            if (!token) return;
            try {
                const res = await fetch(`${API_URL}/api/credits?t=${Date.now()}`, {
                    headers: { Authorization: `Bearer ${token}` },
                    cache: 'no-store',
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    if (data.email) { setUserEmail(data.email); localStorage.setItem('user_email', data.email); }
                    if (data.subscriptionPlan && data.subscriptionExpiresAt) {
                        const expires = new Date(data.subscriptionExpiresAt);
                        setSubscriptionPlan(expires > new Date() ? data.subscriptionPlan : null);
                    }
                }
            } catch { /* silent */ }
        };

        fetchUser();
        const interval = setInterval(fetchUser, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="sticky top-0 z-[101] h-14 flex items-center justify-between px-4 lg:px-6 bg-black/60 backdrop-blur-xl border-b border-white/[0.05]">
            {/* Left: Logo */}
            <button onClick={() => navigate('/')} className="opacity-70 hover:opacity-100 transition-opacity">
                <Logo />
            </button>

            {/* Right: Plan badge + Profile */}
            <div className="flex items-center gap-3">
                {subscriptionPlan && (
                    <span className="hidden sm:inline-flex px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/20 rounded-full">
                        {subscriptionPlan}
                    </span>
                )}
                {isAuthenticated ? (
                    <ProfileDropdown userEmail={userEmail} onLogout={handleLogout} />
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[10px] uppercase tracking-widest text-gold-400 hover:text-gold-300 font-bold py-1.5 px-3.5 rounded-full border border-gold-500/30 hover:border-gold-400 hover:bg-gold-500/10 transition-all"
                    >
                        Sign In
                    </button>
                )}
            </div>
        </header>
    );
};
