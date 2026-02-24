import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * Intercepts global fetch requests to handle session expiration (401/403).
 * Clears authentication state and notifies the application without forcing a redirect,
 * allowing the user to remain on the current page in an unauthenticated state.
 */
export const AuthInterceptor: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const originalFetch = window.fetch;

        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);

                // Check for unauthorized (401) or forbidden (403) responses
                if (response.status === 401 || response.status === 403) {
                    const url = args[0] as string;

                    // Ignore login/auth endpoints to prevent loops or interfering with login errors
                    if (url.includes('/login') || url.includes('/auth') || url.includes('/signin')) {
                        return response;
                    }

                    // In test mode, many API routes return 401 because they need DB.
                    // Don't treat these as real session expiry — skip the toast.
                    const testModeRoutes = ['/api/credits', '/api/statistics', '/api/payment', '/api/user', '/api/price-plans'];
                    if (testModeRoutes.some(r => url.includes(r))) {
                        return response;
                    }

                    // Check if we are already logged out to prevent spamming toasts
                    const token = localStorage.getItem('access_token') || localStorage.getItem('admin_token');
                    if (token) {
                        // Clear auth data
                        localStorage.removeItem('access_token');
                        localStorage.removeItem('user_name');
                        localStorage.removeItem('user_email');
                        localStorage.removeItem('user_role');
                        localStorage.removeItem('admin_token');
                        localStorage.removeItem('admin_role');
                        localStorage.removeItem('admin_email');

                        // Dispatch event so other components (Header, etc.) can update UI immediately
                        window.dispatchEvent(new Event('userAuthChanged'));
                        window.dispatchEvent(new Event('storage'));

                        // Show notification
                        toast.info('Session expired. You have been logged out.', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                        });

                        // Redirect logic:
                        // 1. If hitting an Admin route or Dashboard, FORCE redirect to Admin Login
                        if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard')) {
                            navigate('/admin/login', { replace: true });
                        }
                        // 2. Otherwise (User routes), stay on page (as per previous request)
                    }
                }

                return response;
            } catch (error) {
                // Network errors, etc. are handled by the caller or global error handler
                throw error;
            }
        };

        // Cleanup: restore original fetch on unmount
        return () => {
            window.fetch = originalFetch;
        };
    }, [navigate]); // Dependencies

    return null; // Headless component
};
