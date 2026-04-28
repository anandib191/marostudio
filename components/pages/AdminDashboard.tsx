import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConfirmationModal } from '../ui/ConfirmationModal';

interface DashboardStats {
  totalUsers: number;
  totalGenerations: number;
  activeSubscriptions: number;
  revenue: number;
}

const getProxiedUrlForReview = (url: string) => {
  if (!url) return '';
  if (import.meta.env.DEV && url.includes('amazonaws.com') && !url.includes('/s3-proxy')) {
    const urlObj = new URL(url);
    return `/s3-proxy${urlObj.pathname}${urlObj.search}`;
  }
  return url;
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalGenerations: 0,
    activeSubscriptions: 0,
    revenue: 0,
  });
  const [recentReviews, setRecentReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const role = localStorage.getItem('admin_role');
    const email = localStorage.getItem('admin_email');

    if (!token || role !== 'admin') {
      navigate('/admin/login');
      return;
    }

    setUserEmail(email || '');

    // Fetch dashboard stats
    const fetchStats = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        
        const [statsResponse, generationsResponse] = await Promise.all([
          fetch(`${API_URL}/api/admin/stats`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${API_URL}/api/user/generations/admin/all?limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          })
        ]);

        if (statsResponse.ok) {
          const data = await statsResponse.json();
          if (data.success) {
            setStats({
              totalUsers: data.totalUsers,
              totalGenerations: data.totalGenerations,
              activeSubscriptions: data.activeSubscriptions,
              revenue: data.revenue,
            });
          }
        } else {
          // If unauthorized, redirect to login
          if (statsResponse.status === 401 || statsResponse.status === 403) {
            navigate('/admin/login');
            return;
          }
        }

        if (generationsResponse.ok) {
           const genData = await generationsResponse.json();
           if (genData.success && genData.generations) {
              const reviews = genData.generations.filter((g: any) => g.rating > 0);
              setRecentReviews(reviews);
           }
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_role');
    // Force page reload to refresh all components
    window.location.href = '/admin/login';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-500 mx-auto mb-4"></div>
          <p className="text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold font-serif-display">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-400">{userEmail}</span>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors text-sm font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">{stats.totalUsers.toLocaleString()}</p>
          </div>
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-2">Total Generations</h3>
            <p className="text-3xl font-bold text-white">{stats.totalGenerations.toLocaleString()}</p>
          </div>
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-2">Active Subscriptions</h3>
            <p className="text-3xl font-bold text-white">{stats.activeSubscriptions.toLocaleString()}</p>
          </div>
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-sm text-neutral-400 uppercase tracking-wider mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-white">${stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Additional Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6 flex flex-col max-h-[500px]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Recent Reviews
            </h2>
            <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {recentReviews.length > 0 ? recentReviews.map((review, i) => (
                <div key={i} className="flex gap-4 p-3 bg-white/5 rounded-lg border border-white/5">
                  <img src={getProxiedUrlForReview(review.imageUrls?.[0])} className="w-16 h-16 object-cover rounded bg-black shrink-0" alt="Generations" />
                  <div className="flex-1 min-w-0">
                     <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium truncate pr-2">{review.userEmail}</span>
                        <div className="flex text-gold-400 shrink-0">
                           {[1,2,3,4,5].map(s => (
                             <svg key={s} className="w-3.5 h-3.5" fill={s <= review.rating ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={s <= review.rating ? 0 : 2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                             </svg>
                           ))}
                        </div>
                     </div>
                     {review.ratingFeedback && <p className="text-xs text-neutral-400 italic">"{review.ratingFeedback}"</p>}
                     <p className="text-[10px] text-neutral-500 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-neutral-400 p-4 text-center border border-dashed border-white/10 rounded-lg">No reviews submitted yet.</div>
              )}
            </div>
          </div>
          <div className="bg-neutral-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded-lg transition-colors text-sm font-semibold">
                Manage Users
              </button>
              <button className="w-full px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded-lg transition-colors text-sm font-semibold">
                View Reports
              </button>
              <button className="w-full px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded-lg transition-colors text-sm font-semibold">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </main>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access the admin dashboard."
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />
    </div>
  );
};
