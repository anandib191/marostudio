import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './components/ErrorBoundary';
import { Header } from './components/Header';
import { StudioTopBar } from './components/StudioTopBar';
import { DropdownMenu } from './components/DropdownMenu';
import { GlassFilter } from './components/ui/GlassFilter';
import { BookDemoPage } from './components/BookDemoPage';
import { StudioWrapper } from './components/StudioWrapper';
import { LandingPage } from './components/LandingPage';
import { PricingPageRoute } from './components/pages/PricingPageRoute';
import { ContactPage } from './components/pages/ContactPage';
import { UserLoginPage } from './components/pages/UserLoginPage';
import { AdminLoginPage } from './components/pages/AdminLoginPage';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { Dashboard } from './components/pages/Dashboard';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PreviouslyGenerated } from './components/PreviouslyGenerated';
import { PrivacyPolicy } from './components/pages/PrivacyPolicy';
import { TermsOfService } from './components/pages/TermsOfService';
import { AuthInterceptor } from './components/auth/AuthInterceptor';
import { WelcomePopup } from './components/WelcomePopup';

// Canvas Effect Hook
const useCanvasEffect = () => {
  useEffect(() => {
    const body = document.body;
    let mouseTimer: NodeJS.Timeout;
    let isMouseMoving = false;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseMoving) {
        isMouseMoving = true;
        body.classList.add('canvas-active');
      }

      // Clear existing timer
      clearTimeout(mouseTimer);

      // Set new timer to remove effect after mouse stops
      mouseTimer = setTimeout(() => {
        isMouseMoving = false;
        body.classList.remove('canvas-active');
      }, 100);
    };

    const handleMouseLeave = () => {
      isMouseMoving = false;
      body.classList.remove('canvas-active');
      clearTimeout(mouseTimer);
    };

    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(mouseTimer);
      body.classList.remove('canvas-active');
    };
  }, []);
};

// --- Main App Component ---
const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasGeneratedContent, setHasGeneratedContent] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Apply canvas effect throughout the website
  useCanvasEffect();

  // Check authentication status on mount and when location changes
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    setIsAuthenticated(!!token);
    setIsCheckingAuth(false);
  }, [location]);

  // Determine if we should show landing background
  const isLandingPage = location.pathname === '/' ||
    location.pathname === '/pricing' ||
    location.pathname === '/contact' ||
    location.pathname === '/book-demo' ||
    location.pathname === '/privacy-policy' ||
    location.pathname === '/terms';
  const showLandingBackground = isLandingPage;

  // Determine current route for active section
  const getActiveSection = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/pricing') return 'pricing';
    if (location.pathname === '/contact') return 'contact';
    return '';
  };

  return (
    <div className="min-h-screen bg-black text-neutral-200 font-sans relative flex flex-col">
      <AuthInterceptor />
      <WelcomePopup />
      {showLandingBackground && (
        <>
          <div className="fixed inset-0 w-full h-full z-[-2] bg-black" />
          <div className="fixed inset-0 w-screen h-screen z-[-1] overflow-hidden">
            <iframe
              className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2"
              src="https://player.vimeo.com/video/909756734?badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&loop=1&muted=1&background=1"
              allow="autoplay; fullscreen"
              allowFullScreen
              frameBorder="0"
            />
            <div className="absolute inset-0 bg-black/50" />
          </div>
        </>
      )}

      {/* Studio pages get a minimal top bar; all other public pages get the full header */}
      {location.pathname === '/studio' || location.pathname === '/previously-generated' ? (
        <StudioTopBar />
      ) : !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/dashboard') ? (
        <>
          <Header
            hasGeneratedContent={hasGeneratedContent}
            onMenuClick={() => setIsMenuOpen(prev => !prev)}
            isMenuOpen={isMenuOpen}
            activeSection={getActiveSection()}
          />
          {isMenuOpen && (
            <DropdownMenu
              onClose={() => setIsMenuOpen(false)}
              activeSection={getActiveSection()}
            />
          )}
        </>
      ) : null}

      {!showLandingBackground && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/dashboard') && (
        <GlassFilter />
      )}

      <main className={`relative z-10 flex-grow flex flex-col ${location.pathname.startsWith('/dashboard')
        ? 'p-0 items-stretch justify-start'
        : location.pathname === '/studio' || location.pathname === '/previously-generated'
          ? 'p-0 items-stretch justify-start'
          : `${showLandingBackground ? 'justify-start' : 'items-center justify-center'} px-4 sm:px-5 md:px-6 lg:px-8 ${(location.pathname === '/contact' || location.pathname === '/pricing' || location.pathname === '/workflow' || location.pathname === '/') ? 'pt-0 pb-4 md:pb-6' : 'py-8 md:py-16'}`
        }`}>
        {isCheckingAuth ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading...</p>
            </div>
          </div>
        ) : (
          <Routes>
            {/* Auth Routes - Public */}
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />

            {/* Public Routes - Viewable without authentication, but generation requires auth */}
            <Route path="/" element={
              <LandingPage
                onStart={() => navigate('/studio')}
                onBookDemo={() => navigate('/contact')}
              />
            } />
            <Route path="/pricing" element={<PricingPageRoute />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/book-demo" element={<BookDemoPage />} />
            <Route path="/studio" element={<StudioWrapper />} />
            <Route path="/previously-generated" element={<PreviouslyGenerated />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                localStorage.getItem('admin_token') && localStorage.getItem('admin_role') === 'admin' ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              }
            />

            {/* Dashboard: admin only (email+OTP via /admin/login) */}
            <Route
              path="/dashboard"
              element={
                localStorage.getItem('admin_token') && localStorage.getItem('admin_role') === 'admin' ? (
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                ) : (
                  <Navigate to="/admin/login" replace />
                )
              }
            />

            {/* Default redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>

      {!showLandingBackground && !location.pathname.startsWith('/admin') && !location.pathname.startsWith('/login') && !location.pathname.startsWith('/dashboard') && location.pathname !== '/studio' && (
        <footer className="text-center py-6 text-sm text-neutral-500 relative z-10">
        </footer>
      )}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        toastClassName="bg-neutral-900 border border-white/10 text-white"
        aria-label="Notifications"
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
};

export default App;
