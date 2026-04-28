import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Logo } from '../Logo';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { CheckIcon } from '../icons/CheckIcon';
import { StarIcon } from '../icons/StarIcon';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getProxiedUrlForReview = (url: string) => {
  if (!url) return '';
  if (import.meta.env.DEV && url.includes('amazonaws.com') && !url.includes('/s3-proxy')) {
    const urlObj = new URL(url);
    return `/s3-proxy${urlObj.pathname}${urlObj.search}`;
  }
  return url;
};

export interface PricePlan {
  _id?: string;
  name: string;
  price: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  isPopular: boolean;
  totalCredits?: number; // Unified credit system
}

interface User {
  _id: string;
  name?: string;
  email: string;
  role: 'user' | 'admin';
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  subscriptionPlan?: string | null;
  subscriptionBillingPeriod?: 'monthly' | 'yearly' | null;
  subscriptionPurchasedAt?: string | null;
  subscriptionExpiresAt?: string | null;
  // Unified credit system
  totalCredits?: number;
  usedPhotoshootCredits?: number;
  usedMarketingCredits?: number;
  planName?: string;
  remainingCredits?: number;
  photoshootGenerationsUsed?: number;
  marketingGenerationsUsed?: number;
  photoshootGenerationsRemaining?: number;
  marketingGenerationsRemaining?: number;
  isActive?: boolean;
}

type SidebarSection = 'price-plans' | 'users' | 'admins' | 'credits' | 'statistics' | 'gen-history' | 'promo-codes' | 'reviews';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [section, setSection] = useState<SidebarSection>('price-plans');
  const [userEmail, setUserEmail] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Price Plans state
  const [plans, setPlans] = useState<PricePlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [refreshingPlans, setRefreshingPlans] = useState(false);
  const [savingPlans, setSavingPlans] = useState(false);
  const [syncingCredits, setSyncingCredits] = useState(false);
  const [showSyncPreview, setShowSyncPreview] = useState(false);
  const [syncPreview, setSyncPreview] = useState<any>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  // Users state
  const [users, setUsers] = useState<User[]>([]);
  const [usersPage, setUsersPage] = useState(1);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPages, setUsersPages] = useState(0);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [activeSubscriptions, setActiveSubscriptions] = useState(0);
  const [loadingUserStats, setLoadingUserStats] = useState(false);
  const [userStatusFilter, setUserStatusFilter] = useState('');
  const [userTimeFilter, setUserTimeFilter] = useState('');
  const [userSearchEmail, setUserSearchEmail] = useState('');

  // Admins state
  const [admins, setAdmins] = useState<User[]>([]);
  const [adminsPage, setAdminsPage] = useState(1);
  const [adminsTotal, setAdminsTotal] = useState(0);
  const [adminsPages, setAdminsPages] = useState(0);
  const [loadingAdmins, setLoadingAdmins] = useState(false);

  // Free tier credits state
  const [freeTierCredits, setFreeTierCredits] = useState({
    totalCredits: 100, // Default free tier credits (will be loaded from API)
  });
  const [loadingFreeTier, setLoadingFreeTier] = useState(false);
  const [savingFreeTier, setSavingFreeTier] = useState(false);

  // Credit deduction configuration state
  const [creditDeductions, setCreditDeductions] = useState({
    creditsPerPhotoshootGeneration: 20,
    creditsPerMarketingGeneration: 20,
  });
  const [loadingCreditDeductions, setLoadingCreditDeductions] = useState(false);
  const [savingCreditDeductions, setSavingCreditDeductions] = useState(false);

  // Statistics state
  const [statistics, setStatistics] = useState({
    categories: '4+',
    activeUsers: '10k+',
    imageGenerated: '50k+',
    activeSubscription: '1k+',
  });
  const [loadingStatistics, setLoadingStatistics] = useState(false);
  const [savingStatistics, setSavingStatistics] = useState(false);

  // Add Admin state
  const [addAdminEmail, setAddAdminEmail] = useState('');
  const [addAdminOTP, setAddAdminOTP] = useState('');
  const [addAdminStep, setAddAdminStep] = useState<'email' | 'otp'>('email');
  const [addAdminLoading, setAddAdminLoading] = useState(false);
  const [addAdminError, setAddAdminError] = useState('');
  const [deleteAdminId, setDeleteAdminId] = useState<string | null>(null);
  const [showDeleteAdminModal, setShowDeleteAdminModal] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
  // Credit adjustment state
  const [creditAdjustUserId, setCreditAdjustUserId] = useState<string | null>(null);
  const [creditAdjustEmail, setCreditAdjustEmail] = useState('');
  const [creditAdjustAmount, setCreditAdjustAmount] = useState('');
  const [creditAdjustReason, setCreditAdjustReason] = useState('');
  const [creditAdjustCurrentCredits, setCreditAdjustCurrentCredits] = useState(0);
  const [showCreditAdjustModal, setShowCreditAdjustModal] = useState(false);
  const [adjustingCredits, setAdjustingCredits] = useState(false);

  // User detail overlay state
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
  const [selectedUserHistory, setSelectedUserHistory] = useState<any[]>([]);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);

  // Generation history state
  const [generations, setGenerations] = useState<any[]>([]);
  const [loadingGenerations, setLoadingGenerations] = useState(false);
  const [genPage, setGenPage] = useState(1);
  const [genTotalPages, setGenTotalPages] = useState(1);
  const [expandedGenId, setExpandedGenId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [genFilterType, setGenFilterType] = useState('all');
  const [genFilterPlan, setGenFilterPlan] = useState('all');
  const [genSearchEmail, setGenSearchEmail] = useState('');

  // Reviews state
  const [reviews, setReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);

  // Promo codes state
  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [loadingPromoCodes, setLoadingPromoCodes] = useState(false);
  const [showPromoForm, setShowPromoForm] = useState(false);
  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [promoForm, setPromoForm] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    applicablePlans: [] as { planName: string; discountValue: number }[],
    maxUses: 100,
    expiresAt: '',
  });
  const [savingPromo, setSavingPromo] = useState(false);
  const [deletingPromoId, setDeletingPromoId] = useState<string | null>(null);
  const [showDeletePromoModal, setShowDeletePromoModal] = useState(false);

  const [planToDeleteIndex, setPlanToDeleteIndex] = useState<number | null>(null);
  const [showDeletePlanModal, setShowDeletePlanModal] = useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = useState<number | null>(null);
  const [showEditPlanOverlay, setShowEditPlanOverlay] = useState(false);
  const [showAddPlanOverlay, setShowAddPlanOverlay] = useState(false);
  const [newPlan, setNewPlan] = useState<PricePlan>({
    name: '',
    price: '',
    yearlyPrice: '',
    description: '',
    features: [],
    isPopular: false,
    totalCredits: 0,
    photoshootCredits: 0,
    marketingPosterCredits: 0,
  });


  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const role = localStorage.getItem('admin_role');
    const email = localStorage.getItem('admin_email');

    if (!token || role !== 'admin') {
      navigate('/admin/login');
      return;
    }
    setUserEmail(email || '');
    if (section === 'price-plans') {
      loadPlans(token);
    } else if (section === 'users') {
      loadUsers(token, usersPage, userStatusFilter, userTimeFilter, userSearchEmail);
      loadUserStats(token);
    } else if (section === 'admins') {
      loadAdmins(token, adminsPage);
    } else if (section === 'credits') {
      loadPlans(token); // Load plans to show credits
      loadFreeTierCredits(token); // Load free tier credits
      loadCreditDeductions(token); // Load credit deduction configuration
    } else if (section === 'statistics') {
      loadStatistics(token);
    } else if (section === 'gen-history') {
      loadGenerations(token, genPage, genFilterType, genSearchEmail, genFilterPlan);
    } else if (section === 'reviews') {
      loadReviews(token, reviewPage);
    } else if (section === 'promo-codes') {
      loadPromoCodes(token);
      loadPlans(token); // Need plans for the form
    }
  }, [navigate, section, usersPage, adminsPage, genPage, reviewPage]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPlans = async (token: string) => {
    // Don't set loading or clear plans if we already have plans (prevents flash)
    const hasExistingPlans = plans.length > 0;
    if (!hasExistingPlans) {
      setLoadingPlans(true);
    } else {
      setRefreshingPlans(true); // Show subtle loading overlay for refresh
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/price-plans`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log('Plans data received:', data); // Debug log
      if (res.ok && data.success && Array.isArray(data.plans)) {
        console.log('Setting plans:', data.plans); // Debug log
        setPlans(data.plans); // Directly replace old data with new data
      } else {
        toast.error(data.message || 'Failed to load plans', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load price plans', { position: "top-right", autoClose: 3000 });
    } finally {
      if (!hasExistingPlans) {
        setLoadingPlans(false);
      } else {
        setRefreshingPlans(false);
      }
    }
  };

  const loadFreeTierCredits = async (token: string) => {
    setLoadingFreeTier(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/free-tier-credits`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFreeTierCredits({
          totalCredits: data.freeTierTotalCredits || 100,
        });
      } else {
        toast.error(data.message || 'Failed to load free tier credits', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load free tier credits', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoadingFreeTier(false);
    }
  };

  const loadCreditDeductions = async (token: string) => {
    setLoadingCreditDeductions(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/credit-deductions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCreditDeductions({
          creditsPerPhotoshootGeneration: data.creditsPerPhotoshootGeneration || 20,
          creditsPerMarketingGeneration: data.creditsPerMarketingGeneration || 20,
        });
      } else {
        toast.error(data.message || 'Failed to load credit deduction settings', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load credit deduction settings', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoadingCreditDeductions(false);
    }
  };

  const loadStatistics = async (token: string) => {
    setLoadingStatistics(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/statistics`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success && data.statistics) {
        setStatistics({
          categories: data.statistics.categories || '4+',
          activeUsers: data.statistics.activeUsers || '10k+',
          imageGenerated: data.statistics.imageGenerated || '50k+',
          activeSubscription: data.statistics.activeSubscription || '1k+',
        });
      } else {
        toast.error(data.message || 'Failed to load statistics', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load statistics', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoadingStatistics(false);
    }
  };

  const saveStatistics = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    setSavingStatistics(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/statistics`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(statistics),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Statistics updated successfully', { position: "top-right", autoClose: 3000 });
      } else {
        toast.error(data.message || 'Failed to save statistics', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to save statistics', { position: "top-right", autoClose: 3000 });
    } finally {
      setSavingStatistics(false);
    }
  };

  const loadGenerations = async (token: string, page: number, type: string = genFilterType, search: string = genSearchEmail, plan: string = genFilterPlan) => {
    setLoadingGenerations(true);
    try {
      let queryUrl = `${API_URL}/api/user/generations/admin/all?page=${page}&limit=10`;
      if (type && type !== 'all') queryUrl += `&type=${encodeURIComponent(type)}`;
      if (search) queryUrl += `&search=${encodeURIComponent(search)}`;
      if (plan && plan !== 'all') queryUrl += `&plan=${encodeURIComponent(plan)}`;
      
      const res = await fetch(queryUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setGenerations(data.generations || []);
        setGenTotalPages(data.pagination?.pages || 1);
      } else {
        toast.error(data.message || 'Failed to load generations', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load generations', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoadingGenerations(false);
    }
  };

  const loadReviews = async (token: string, page: number) => {
    setLoadingReviews(true);
    try {
      const res = await fetch(`${API_URL}/api/user/generations/admin/all?page=${page}&limit=12&hasRating=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setReviews(data.generations || []);
        setReviewTotalPages(data.pagination?.pages || 1);
      } else {
        toast.error(data.message || 'Failed to load reviews', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load reviews', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoadingReviews(false);
    }
  };

  // ==================== PROMO CODE FUNCTIONS ====================
  const loadPromoCodes = async (token: string) => {
    setLoadingPromoCodes(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/promo-codes`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setPromoCodes(data.promoCodes || []);
      } else {
        toast.error(data.message || 'Failed to load promo codes', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load promo codes', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoadingPromoCodes(false);
    }
  };

  const handleSavePromo = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    if (!promoForm.code.trim()) {
      toast.error('Promo code name is required', { position: "top-right", autoClose: 3000 });
      return;
    }

    // Filter out plans with 0 discount
    const activePlans = promoForm.applicablePlans.filter((p) => p.discountValue > 0);
    if (activePlans.length === 0) {
      toast.error('Set discount for at least one plan', { position: "top-right", autoClose: 3000 });
      return;
    }

    setSavingPromo(true);
    try {
      const url = editingPromo
        ? `${API_URL}/api/admin/promo-codes/${editingPromo._id}`
        : `${API_URL}/api/admin/promo-codes`;
      const method = editingPromo ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          code: promoForm.code,
          discountType: promoForm.discountType,
          applicablePlans: activePlans,
          maxUses: promoForm.maxUses,
          expiresAt: promoForm.expiresAt || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(editingPromo ? 'Promo code updated' : 'Promo code created', { position: "top-right", autoClose: 3000 });
        setShowPromoForm(false);
        loadPromoCodes(token);
      } else {
        toast.error(data.message || 'Failed to save promo code', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to save promo code', { position: "top-right", autoClose: 3000 });
    } finally {
      setSavingPromo(false);
    }
  };

  const handleEditPromo = (promo: any) => {
    setEditingPromo(promo);
    // Map existing applicable plans to form, ensuring all current plans are shown
    const formPlans = plans.map((p) => {
      const existing = promo.applicablePlans?.find((ap: any) => ap.planName.toLowerCase() === p.name.toLowerCase());
      return { planName: p.name, discountValue: existing?.discountValue || 0 };
    });
    setPromoForm({
      code: promo.code,
      discountType: promo.discountType || 'percentage',
      applicablePlans: formPlans,
      maxUses: promo.maxUses,
      expiresAt: promo.expiresAt ? new Date(promo.expiresAt).toISOString().split('T')[0] : '',
    });
    setShowPromoForm(true);
  };

  const handleDeletePromo = async () => {
    if (!deletingPromoId) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/promo-codes/${deletingPromoId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Promo code deleted', { position: "top-right", autoClose: 3000 });
        loadPromoCodes(token);
      } else {
        toast.error(data.message || 'Failed to delete promo code', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to delete promo code', { position: "top-right", autoClose: 3000 });
    } finally {
      setShowDeletePromoModal(false);
      setDeletingPromoId(null);
    }
  };

  const handleTogglePromo = async (id: string) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/promo-codes/${id}/toggle`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.promoCode.isActive ? 'Promo code activated' : 'Promo code deactivated', { position: "top-right", autoClose: 3000 });
        loadPromoCodes(token);
      } else {
        toast.error(data.message || 'Failed to toggle promo code', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to toggle promo code', { position: "top-right", autoClose: 3000 });
    }
  };

  const loadUsers = async (token: string, page: number, status: string = userStatusFilter, time: string = userTimeFilter, search: string = userSearchEmail) => {
    // Don't show loading if we already have users (prevents flash)
    const hasExistingUsers = users.length > 0;
    if (!hasExistingUsers) {
      setLoadingUsers(true);
    }

    try {
      let queryUrl = `${API_URL}/api/admin/users?role=user&page=${page}&limit=100`;
      if (status) queryUrl += `&status=${encodeURIComponent(status)}`;
      if (time) queryUrl += `&time=${encodeURIComponent(time)}`;
      if (search) queryUrl += `&search=${encodeURIComponent(search)}`;

      const res = await fetch(queryUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Ensure users is always an array
        const usersList = Array.isArray(data.users) ? data.users : [];
        setUsers(usersList); // Directly replace old data with new data
        setUsersTotal(data.pagination?.total || 0);
        setUsersPages(data.pagination?.pages || 0);
      } else {
        setUsers([]); // Set empty array on error
        toast.error(data.message || 'Failed to load users', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      console.error('Error loading users:', e);
      setUsers([]); // Set empty array on error
      toast.error('Failed to load users', { position: "top-right", autoClose: 3000 });
    } finally {
      if (!hasExistingUsers) {
        setLoadingUsers(false);
      }
    }
  };

  const loadUserStats = async (token: string) => {
    setLoadingUserStats(true);
    try {
      // Get all users (no pagination) to count active subscriptions
      const res = await fetch(`${API_URL}/api/admin/users?role=user&page=1&limit=1000`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        const usersList = Array.isArray(data.users) ? data.users : [];
        // Count users with active subscriptions
        const activeCount = usersList.filter((user: User) => {
          if (user.subscriptionPlan && user.subscriptionExpiresAt) {
            const expiresAt = new Date(user.subscriptionExpiresAt);
            const now = new Date();
            return expiresAt > now;
          }
          return false;
        }).length;
        setActiveSubscriptions(activeCount);
      }
    } catch (e) {
      console.error('Error loading user stats:', e);
    } finally {
      setLoadingUserStats(false);
    }
  };

  const loadAdmins = async (token: string, page: number) => {
    // Don't show loading if we already have admins (prevents flash)
    const hasExistingAdmins = admins.length > 0;
    if (!hasExistingAdmins) {
      setLoadingAdmins(true);
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users?role=admin&page=${page}&limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAdmins(data.users || []); // Directly replace old data with new data
        setAdminsTotal(data.pagination?.total || 0);
        setAdminsPages(data.pagination?.pages || 0);
      } else {
        toast.error(data.message || 'Failed to load admins', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to load admins', { position: "top-right", autoClose: 3000 });
    } finally {
      if (!hasExistingAdmins) {
        setLoadingAdmins(false);
      }
    }
  };

  const handleSavePlans = async (plansToSave?: PricePlan[]) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    setSavingPlans(true);
    try {
      // Use provided plans or current state
      const plansToProcess = plansToSave || plans;

      // Filter out blank features from all plans before saving
      // Also ensure only one plan is popular
      // Clean features array without auto-adding credit features
      const cleanedPlans = plansToProcess.map(plan => {
        const filteredFeatures = (plan.features || []).filter((f: string) => f && f.trim().length > 0);

        // Only remove old credit features, don't add new ones automatically
        const nonCreditFeatures = filteredFeatures.filter(f =>
          !f.toLowerCase().includes('photoshoot generation') &&
          !f.toLowerCase().includes('marketing poster generation')
        );

        return {
          ...plan,
          features: nonCreditFeatures
        };
      });

      // Ensure only one plan is popular (keep the first one found as popular)
      let foundPopular = false;
      const finalPlans = cleanedPlans.map(plan => {
        if (plan.isPopular) {
          if (foundPopular) {
            return { ...plan, isPopular: false };
          } else {
            foundPopular = true;
            return plan;
          }
        }
        return plan;
      });

      console.log('Sending to backend:', { plans: finalPlans });

      const res = await fetch(`${API_URL}/api/admin/price-plans`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ plans: finalPlans }),
      });
      const data = await res.json();
      console.log('Backend response:', data);
      if (res.ok && data.success) {
        setPlans(data.plans || finalPlans);
        toast.success('Price plans updated successfully', { position: "top-right", autoClose: 3000 });
      } else {
        toast.error(data.message || 'Failed to save', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to save price plans', { position: "top-right", autoClose: 3000 });
    } finally {
      setSavingPlans(false);
    }
  };

  const handlePreviewSync = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setLoadingPreview(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/sync-credits/preview`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSyncPreview(data.preview);
        setShowSyncPreview(true);
      } else {
        toast.error(data.message || 'Failed to load preview', { position: "top-right", autoClose: 3000 });
      }
    } catch (e: any) {
      console.error('Preview sync error:', e);
      toast.error('Failed to load preview. Please try again.', { position: "top-right", autoClose: 3000 });
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleSyncCredits = async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setSyncingCredits(true);
    setShowSyncPreview(false);
    try {
      const res = await fetch(`${API_URL}/api/admin/sync-credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (res.ok && data.success) {
        const stats = data.stats || {};
        const message = `Credits synced successfully! Updated: ${stats.updated || 0}, Skipped: ${stats.skipped || 0}, Expired Reset: ${stats.expiredReset || 0}`;
        toast.success(message, { position: "top-right", autoClose: 5000 });

        // Refresh users list to show updated credits
        if (section === 'users') {
          await loadUsers(token, usersPage);
        }
        setSyncPreview(null);
      } else {
        toast.error(data.message || 'Failed to sync credits', { position: "top-right", autoClose: 3000 });
      }
    } catch (e: any) {
      console.error('Sync credits error:', e);
      toast.error('Failed to sync credits. Please try again.', { position: "top-right", autoClose: 3000 });
    } finally {
      setSyncingCredits(false);
    }
  };

  const handleSendAdminOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminError('');
    setAddAdminLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/send-admin-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: addAdminEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAddAdminStep('otp');
        toast.success('OTP sent to email', { position: "top-right", autoClose: 3000 });
      } else {
        setAddAdminError(data.message || 'Failed to send OTP');
      }
    } catch (e) {
      setAddAdminError('Failed to send OTP');
    } finally {
      setAddAdminLoading(false);
    }
  };

  const handleVerifyAdminOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddAdminError('');
    setAddAdminLoading(true);
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/verify-admin-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email: addAdminEmail, otp: addAdminOTP }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Admin added successfully', { position: "top-right", autoClose: 3000 });
        setAddAdminEmail('');
        setAddAdminOTP('');
        setAddAdminStep('email');
        loadAdmins(token, adminsPage);
      } else {
        setAddAdminError(data.message || 'Invalid OTP');
      }
    } catch (e) {
      setAddAdminError('Failed to verify OTP');
    } finally {
      setAddAdminLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_email');
    localStorage.removeItem('admin_role');
    // Force page reload to refresh all components
    window.location.href = '/admin/login';
  };

  const handleDeleteAdmin = async () => {
    if (!deleteAdminId) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/remove-admin/${deleteAdminId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('Admin privileges removed successfully', { position: "top-right", autoClose: 3000 });
        loadAdmins(token, adminsPage);
      } else {
        toast.error(data.message || 'Failed to remove admin', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to remove admin', { position: "top-right", autoClose: 3000 });
    } finally {
      setShowDeleteAdminModal(false);
      setDeleteAdminId(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserId) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/users/${deleteUserId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success('User deleted successfully', { position: "top-right", autoClose: 3000 });
        loadUsers(token, usersPage);
        // Close user detail overlay if open
        setShowUserDetail(false);
        setSelectedUserDetail(null);
        setSelectedUserHistory([]);
      } else {
        toast.error(data.message || 'Failed to delete user', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to delete user', { position: "top-right", autoClose: 3000 });
    } finally {
      setShowDeleteUserModal(false);
      setDeleteUserId(null);
    }
  };

  const handleAdjustCredits = async () => {
    if (!creditAdjustUserId || !creditAdjustAmount) return;
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    setAdjustingCredits(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${creditAdjustUserId}/adjust-credits`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ adjustment: parseInt(creditAdjustAmount), reason: creditAdjustReason || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        toast.success(data.message || 'Credits adjusted', { position: "top-right", autoClose: 3000 });
        loadUsers(token, usersPage);
        // Refresh user detail overlay if open
        if (showUserDetail && creditAdjustUserId) {
          loadUserDetail(creditAdjustUserId);
        }
        setShowCreditAdjustModal(false);
        setCreditAdjustUserId(null);
        setCreditAdjustAmount('');
        setCreditAdjustReason('');
      } else {
        toast.error(data.message || 'Failed to adjust credits', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to adjust credits', { position: "top-right", autoClose: 3000 });
    } finally {
      setAdjustingCredits(false);
    }
  };

  const loadUserDetail = async (userId: string) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;
    setLoadingUserDetail(true);
    setShowUserDetail(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/users/${userId}/details`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSelectedUserDetail(data.user);
        setSelectedUserHistory(data.history || []);
      } else {
        toast.error(data.message || 'Failed to load user details', { position: "top-right", autoClose: 3000 });
        setShowUserDetail(false);
      }
    } catch (e) {
      toast.error('Failed to load user details', { position: "top-right", autoClose: 3000 });
      setShowUserDetail(false);
    } finally {
      setLoadingUserDetail(false);
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'purchase': return 'Plan Purchase';
      case 'payment_failed': return 'Payment Failed';
      case 'usage': return 'Credit Usage';
      case 'manual_adjustment': return 'Admin Adjustment';
      case 'admin_sync': return 'Admin Sync';
      case 'expiry': return 'Plan Expired';
      default: return action;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'purchase': return 'text-green-400 bg-green-500/15';
      case 'payment_failed': return 'text-red-400 bg-red-500/15';
      case 'usage': return 'text-blue-400 bg-blue-500/15';
      case 'manual_adjustment': return 'text-gold-400 bg-gold-500/15';
      case 'admin_sync': return 'text-purple-400 bg-purple-500/15';
      case 'expiry': return 'text-orange-400 bg-orange-500/15';
      default: return 'text-neutral-400 bg-neutral-500/15';
    }
  };

  const updatePlan = (index: number, field: keyof PricePlan, value: string | string[] | boolean | number) => {
    setPlans((prev) => {
      const next = prev.map((p, i) => {
        if (i === index) {
          const updatedPlan = { ...p, [field]: value };

          // Don't automatically sync features when credits are updated
          // Features should be managed independently

          return updatedPlan;
        } else {
          // If another plan is being set as popular, unset this one
          if (field === 'isPopular' && value === true) {
            return { ...p, isPopular: false };
          }
          return p;
        }
      });
      return next;
    });
  };

  const addFeature = (planIndex: number) => {
    setPlans((prev) =>
      prev.map((p, i) =>
        i === planIndex ? { ...p, features: [...(p.features || []), ''] } : p
      )
    );
  };

  const updateFeature = (planIndex: number, featIndex: number, value: string) => {
    setPlans((prev) =>
      prev.map((p, i) => {
        if (i !== planIndex) return p;
        const f = [...(p.features || [])];
        f[featIndex] = value;
        return { ...p, features: f };
      })
    );
  };

  const removeFeature = (planIndex: number, featIndex: number) => {
    setPlans((prev) =>
      prev.map((p, i) => {
        if (i !== planIndex) return p;
        const f = (p.features || []).filter((_, j) => j !== featIndex);
        return { ...p, features: f };
      })
    );
  };

  const addPlan = () => {
    setNewPlan({
      name: '',
      price: '',
      yearlyPrice: '',
      description: '',
      features: [],
      isPopular: false,
      photoshootCredits: 0,
      marketingPosterCredits: 0,
    });
    setShowAddPlanOverlay(true);
  };

  const removePlan = (index: number) => {
    if (plans.length <= 1) return;
    setPlanToDeleteIndex(index);
    setShowDeletePlanModal(true);
  };

  const setPlanAsPopular = async (index: number) => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    setSavingPlans(true);
    try {
      const currentPlan = plans[index];
      if (!currentPlan._id) {
        toast.error('Cannot update plan without ID', { position: "top-right", autoClose: 3000 });
        setSavingPlans(false);
        return;
      }

      const isCurrentlyPopular = currentPlan.isPopular;
      const newPopularStatus = !isCurrentlyPopular;

      // Update the plan's popular status
      const res = await fetch(`${API_URL}/api/admin/price-plans/${currentPlan._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: currentPlan.name,
          price: currentPlan.price,
          yearlyPrice: currentPlan.yearlyPrice,
          description: currentPlan.description,
          features: currentPlan.features,
          isPopular: newPopularStatus,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Reload all plans to get updated state
        await loadPlans(token);
        toast.success(isCurrentlyPopular ? 'Popular status removed' : 'Plan set as popular', { position: "top-right", autoClose: 3000 });
      } else {
        toast.error(data.message || 'Failed to update popular plan', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to update popular plan', { position: "top-right", autoClose: 3000 });
    } finally {
      setSavingPlans(false);
    }
  };

  const confirmDeletePlan = async () => {
    if (planToDeleteIndex === null || plans.length <= 1) return;

    const token = localStorage.getItem('admin_token');
    if (!token) return;

    const planToDelete = plans[planToDeleteIndex];
    if (!planToDelete._id) {
      toast.error('Cannot delete plan without ID', { position: "top-right", autoClose: 3000 });
      setShowDeletePlanModal(false);
      setPlanToDeleteIndex(null);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/price-plans/${planToDelete._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Remove plan from local state
        const updatedPlans = plans.filter((_, i) => i !== planToDeleteIndex);
        setPlans(updatedPlans);
        toast.success('Plan deleted successfully', { position: "top-right", autoClose: 3000 });
      } else {
        toast.error(data.message || 'Failed to delete plan', { position: "top-right", autoClose: 3000 });
      }
    } catch (e) {
      toast.error('Failed to delete plan', { position: "top-right", autoClose: 3000 });
    }

    setShowDeletePlanModal(false);
    setPlanToDeleteIndex(null);
  };

  const handleEditPlan = (index: number) => {
    setEditingPlanIndex(index);
    setShowEditPlanOverlay(true);
  };

  const handleCloseEditOverlay = () => {
    // Remove blank features from the plan being edited before closing
    if (editingPlanIndex !== null) {
      setPlans((prev) => {
        const updated = [...prev];
        updated[editingPlanIndex] = {
          ...updated[editingPlanIndex],
          features: (updated[editingPlanIndex].features || []).filter((f: string) => f && f.trim().length > 0)
        };
        return updated;
      });
    }
    setShowEditPlanOverlay(false);
    setEditingPlanIndex(null);
  };

  const handleCloseAddPlanOverlay = () => {
    setShowAddPlanOverlay(false);
    setNewPlan({
      name: '',
      price: '',
      yearlyPrice: '',
      description: '',
      features: [],
      isPopular: false,
      photoshootCredits: 0,
      marketingPosterCredits: 0,
    });
  };

  const updateNewPlan = (field: keyof PricePlan, value: string | string[] | boolean) => {
    setNewPlan((prev) => {
      const updated = { ...prev, [field]: value };
      // If setting isPopular to true, unset all existing plans
      if (field === 'isPopular' && value === true) {
        setPlans((prevPlans) => prevPlans.map((p) => ({ ...p, isPopular: false })));
      }
      return updated;
    });
  };

  const addNewPlanFeature = () => {
    setNewPlan((prev) => ({ ...prev, features: [...(prev.features || []), ''] }));
  };

  const updateNewPlanFeature = (featIndex: number, value: string) => {
    setNewPlan((prev) => {
      const f = [...(prev.features || [])];
      f[featIndex] = value;
      return { ...prev, features: f };
    });
  };

  const removeNewPlanFeature = (featIndex: number) => {
    setNewPlan((prev) => ({
      ...prev,
      features: (prev.features || []).filter((_, j) => j !== featIndex),
    }));
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Never';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid Date';
      }
      // More compact format for mobile
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid Date';
    }
  };

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return '';
      }
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return '';
    }
  };

  const getDaysUntilExpiry = (dateString?: string) => {
    if (!dateString) return 0;
    try {
      const expiryDate = new Date(dateString);
      const now = new Date();
      if (isNaN(expiryDate.getTime())) {
        return 0;
      }
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    } catch (error) {
      return 0;
    }
  };

  const sidebar = (
    <aside className="w-64 h-screen fixed left-0 top-0 bg-neutral-950/95 backdrop-blur-xl border-r border-white/5 flex flex-col overflow-y-auto z-50">
      <div className="p-6 border-b border-white/5">
        <Logo />
      </div>
      <nav className="p-4 flex-1 space-y-1">
        <button
          onClick={() => {
            setSection('price-plans');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'price-plans' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Price Plans
        </button>
        <button
          onClick={() => {
            setSection('users');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'users' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Users
        </button>
        <button
          onClick={() => {
            setSection('admins');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'admins' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Admins
        </button>
        <button
          onClick={() => {
            setSection('credits');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'credits' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Credits
        </button>
        <button
          onClick={() => {
            setSection('statistics');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'statistics' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Statistics
        </button>
        <button
          onClick={() => {
            setSection('gen-history');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'gen-history' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          Gen History
        </button>
        <button
          onClick={() => {
            setSection('reviews');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'reviews' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          ⭐ Reviews
        </button>
        <button
          onClick={() => {
            setSection('promo-codes');
            setSidebarOpen(false);
          }}
          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${section === 'promo-codes' ? 'bg-gold-600/20 text-gold-400' : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
        >
          🏷️ Promo Codes
        </button>
      </nav>
    </aside>
  );

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Fixed Sidebar - Desktop */}
      <div className="hidden md:block">{sidebar}</div>

      {/* Mobile: overlay + sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute left-0 top-0 bottom-0 w-64" onClick={(e) => e.stopPropagation()}>
            {sidebar}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-black/90 backdrop-blur-xl border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-6 min-w-0 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-neutral-400 hover:text-white rounded-lg flex-shrink-0"
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xs sm:text-sm text-neutral-400 whitespace-nowrap">Welcome,</span>
              <span className="text-xs sm:text-sm font-medium text-white truncate" title={userEmail}>{userEmail}</span>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium whitespace-nowrap flex-shrink-0"
          >
            Logout
          </button>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">

            {section === 'price-plans' && (
              <div className="w-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold font-serif-display">Price Plans</h2>
                  <div className="flex gap-3">
                    {refreshingPlans && (
                      <div className="flex items-center gap-2 px-3 py-2 bg-gold-500/10 border border-gold-500/30 rounded-lg">
                        <div className="sparkle-loader">
                          <div className="sparkle"></div>
                          <div className="sparkle"></div>
                          <div className="sparkle"></div>
                        </div>
                        <span className="text-xs text-gold-400 font-medium">Refreshing...</span>
                      </div>
                    )}
                    <button
                      onClick={addPlan}
                      className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                      Add Plan
                    </button>
                  </div>
                </div>

                {loadingPlans ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 items-stretch">
                    {plans.map((plan, i) => (
                      <div
                        key={i}
                        className={`relative rounded-2xl p-4 sm:p-6 md:p-8 text-center flex flex-col h-full transition-all duration-500 ease-out ${plan.isPopular
                          ? 'bg-neutral-900 border-2 border-gold-500 shadow-2xl shadow-gold-900/40 z-10'
                          : 'bg-neutral-950/50 border border-neutral-800'
                          }`}
                      >
                        {/* Edit, Popular, and Delete Icons */}
                        <div className="absolute top-4 right-4 flex gap-2 z-10">
                          <button
                            onClick={() => handleEditPlan(i)}
                            className="p-2 bg-black/60 hover:bg-gold-600/80 rounded-lg text-gold-400 hover:text-white transition-colors"
                            title="Edit Plan"
                            aria-label="Edit Plan"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => setPlanAsPopular(i)}
                            disabled={savingPlans}
                            className={`p-2 bg-black/60 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${plan.isPopular
                              ? 'bg-gold-500/80 hover:bg-gold-600/80 text-white'
                              : 'hover:bg-yellow-600/80 text-yellow-400 hover:text-white'
                              }`}
                            title={plan.isPopular ? 'Remove Popular' : 'Set as Popular'}
                            aria-label={plan.isPopular ? 'Remove Popular' : 'Set as Popular'}
                          >
                            <StarIcon className={`w-4 h-4 ${plan.isPopular ? 'fill-current' : ''}`} />
                          </button>
                          <button
                            onClick={() => {
                              setPlanToDeleteIndex(i);
                              setShowDeletePlanModal(true);
                            }}
                            disabled={plans.length <= 1}
                            className="p-2 bg-black/60 hover:bg-red-600/80 rounded-lg text-red-400 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Delete Plan"
                            aria-label="Delete Plan"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>

                        {plan.isPopular && (
                          <div
                            key={`badge-${plan._id || i}-${plan.isPopular}`}
                            className="absolute top-0 right-6 -translate-y-1/2 bg-gold-500 py-1 px-3 rounded-full flex items-center text-xs font-semibold text-white uppercase tracking-wider"
                          >
                            <StarIcon className="w-4 h-4 mr-1.5 fill-current" />
                            Most Popular
                          </div>
                        )}

                        <div className="flex-1 flex flex-col">
                          <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                          <div className="mt-4 flex items-baseline justify-center gap-x-2">
                            <span className="text-5xl font-bold tracking-tight text-white">
                              ₹{plan.price}
                            </span>
                            <span className="text-sm font-semibold leading-6 tracking-wide text-neutral-400">/ month</span>
                          </div>
                          <p className="mt-1 text-xs leading-5 text-neutral-500">billed monthly</p>
                          <p className="mt-1 text-xs leading-5 text-neutral-500">₹{plan.yearlyPrice}/mo billed annually</p>

                          <ul className="mt-8 flex-1 space-y-3 text-sm leading-6 text-neutral-300 text-left">
                            {(plan.features || []).map((feature, idx) => (
                              <li key={idx} className="flex gap-x-3">
                                <CheckIcon className="h-6 w-6 flex-none text-gold-500" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>

                          <div className="mt-auto pt-8">
                            <p className="text-xs leading-5 text-neutral-500 h-8">{plan.description || 'No description'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {section === 'users' && (
              <div className="w-full max-w-6xl">
                <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-display">Users</h2>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search email/name..."
                      className="px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white max-w-[180px]"
                      value={userSearchEmail}
                      onChange={(e) => setUserSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setUsersPage(1) && loadUsers(localStorage.getItem('admin_token') || '', 1, userStatusFilter, userTimeFilter, userSearchEmail)}
                    />
                    <select
                      className="px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white cursor-pointer"
                      value={userStatusFilter}
                      onChange={(e) => {
                         setUserStatusFilter(e.target.value);
                         setUsersPage(1);
                         loadUsers(localStorage.getItem('admin_token') || '', 1, e.target.value, userTimeFilter, userSearchEmail);
                      }}
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active Plan</option>
                      <option value="expired">Expired Plan</option>
                      <option value="free">Free / None</option>
                    </select>
                    <select
                      className="px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white cursor-pointer"
                      value={userTimeFilter}
                      onChange={(e) => {
                         setUserTimeFilter(e.target.value);
                         setUsersPage(1);
                         loadUsers(localStorage.getItem('admin_token') || '', 1, userStatusFilter, e.target.value, userSearchEmail);
                      }}
                    >
                      <option value="">All Time</option>
                      <option value="7days">Last 7 Days</option>
                      <option value="30days">Last 30 Days</option>
                    </select>
                    <button
                      onClick={() => {
                        setUsersPage(1);
                        loadUsers(localStorage.getItem('admin_token') || '', 1, userStatusFilter, userTimeFilter, userSearchEmail);
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {/* User Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {/* Total Users Card */}
                  <div className="bg-gradient-to-br from-gold-900/30 to-gold-800/20 border border-gold-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-neutral-400 font-medium mb-1">Total Users</p>
                        {loadingUserStats ? (
                          <div className="animate-pulse h-8 w-16 bg-neutral-700 rounded"></div>
                        ) : (
                          <h3 className="text-2xl sm:text-3xl font-bold text-white">{usersTotal.toLocaleString()}</h3>
                        )}
                      </div>
                      <div className="bg-gold-500/20 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-gold-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Active Subscriptions Card */}
                  <div className="bg-gradient-to-br from-green-900/30 to-green-800/20 border border-green-500/30 rounded-xl p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs sm:text-sm text-neutral-400 font-medium mb-1">Active Subscriptions</p>
                        {loadingUserStats ? (
                          <div className="animate-pulse h-8 w-16 bg-neutral-700 rounded"></div>
                        ) : (
                          <h3 className="text-2xl sm:text-3xl font-bold text-white">{activeSubscriptions.toLocaleString()}</h3>
                        )}
                        <p className="text-xs text-neutral-500 mt-1">Currently active plans</p>
                      </div>
                      <div className="bg-green-500/20 p-3 rounded-lg">
                        <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {loadingUsers ? (
                  <div className="flex items-center justify-center py-12 sm:py-16">
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : (
                  <>
                    <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] sm:min-w-[1200px]">
                          <thead className="bg-neutral-800/50">
                            <tr>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Name</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Email</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Plan</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Credits (Used/Total)</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Purchase Date</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Expiry Date</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Created</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Last Login</th>
                              <th className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-left text-[9px] xs:text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {users && users.length > 0 ? users.map((user) => (
                              <tr key={user?._id || Math.random()} className="hover:bg-neutral-800/30 cursor-pointer" onClick={() => user?._id && loadUserDetail(user._id)}>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] xs:text-xs sm:text-sm text-white">
                                  <div className="max-w-[100px] xs:max-w-[120px] sm:max-w-none truncate" title={user?.name || ''}>{user?.name || '—'}</div>
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] xs:text-xs sm:text-sm text-white">
                                  <div className="max-w-[120px] xs:max-w-[150px] sm:max-w-none truncate" title={user?.email || ''}>{user?.email || 'N/A'}</div>
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] xs:text-xs sm:text-sm">
                                  <div className="flex flex-col gap-0.5 xs:gap-1">
                                    <span className={`inline-block px-1.5 xs:px-2 py-0.5 rounded text-[9px] xs:text-[10px] sm:text-xs font-medium ${user?.planName === 'Free'
                                      ? 'bg-neutral-500/20 text-neutral-300'
                                      : user?.planName === 'Gold'
                                        ? 'bg-yellow-500/20 text-yellow-300'
                                        : user?.planName === 'Platinum'
                                          ? 'bg-gold-500/20 text-gold-300'
                                          : 'bg-blue-500/20 text-blue-300'
                                      }`}>
                                      {user?.planName || 'Free'}
                                    </span>
                                    {user?.isActive !== undefined && (
                                      <span className={`text-[8px] xs:text-[9px] ${user.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                                        {user.isActive ? '● Active' : '● Expired'}
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] xs:text-xs sm:text-sm whitespace-nowrap">
                                  <span className={`inline-block px-1.5 xs:px-2 py-0.5 xs:py-1 rounded text-[9px] xs:text-[10px] sm:text-xs font-medium ${user?.isVerified ? 'bg-emerald-500/20 text-emerald-300' : 'bg-yellow-500/20 text-yellow-300'
                                    }`}>
                                    {user?.isVerified ? 'Verified' : 'Unverified'}
                                  </span>
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs text-neutral-400">
                                  <div className="flex flex-col gap-0.5">
                                    <span className="whitespace-nowrap">
                                      Photo: {user?.usedPhotoshootCredits ?? 0}/{user?.totalPhotoshootCredits ?? 0}
                                      {user?.photoshootGenerationsUsed !== undefined && (
                                        <span className="text-neutral-500 ml-1">({user.photoshootGenerationsUsed} gen)</span>
                                      )}
                                    </span>
                                    <span className="whitespace-nowrap">
                                      Marketing: {user?.usedMarketingCredits ?? 0}/{user?.totalMarketingCredits ?? 0}
                                      {user?.marketingGenerationsUsed !== undefined && (
                                        <span className="text-neutral-500 ml-1">({user.marketingGenerationsUsed} gen)</span>
                                      )}
                                    </span>
                                    {(user?.photoshootGenerationsRemaining !== undefined || user?.marketingGenerationsRemaining !== undefined) && (
                                      <div className="mt-1 pt-1 border-t border-white/5">
                                        <span className="text-[8px] text-emerald-400">
                                          Remaining: Photo {user?.photoshootGenerationsRemaining ?? 0} | Marketing {user?.marketingGenerationsRemaining ?? 0}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs text-neutral-400 whitespace-nowrap">
                                  {user?.subscriptionPurchasedAt ? (
                                    <div className="flex flex-col">
                                      <span>{formatDate(user.subscriptionPurchasedAt)}</span>
                                      <span className="text-[8px] text-neutral-500">{formatDateTime(user.subscriptionPurchasedAt)}</span>
                                    </div>
                                  ) : (
                                    <span className="text-neutral-600">N/A</span>
                                  )}
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs whitespace-nowrap">
                                  {user?.subscriptionExpiresAt ? (
                                    <div className="flex flex-col">
                                      <span className={user?.isActive ? 'text-emerald-400' : 'text-red-400'}>
                                        {formatDate(user.subscriptionExpiresAt)}
                                      </span>
                                      <span className={`text-[8px] ${user?.isActive ? 'text-emerald-500' : 'text-red-500'}`}>
                                        {formatDateTime(user.subscriptionExpiresAt)}
                                      </span>
                                      {user?.isActive && (
                                        <span className="text-[8px] text-neutral-500 mt-0.5">
                                          {getDaysUntilExpiry(user.subscriptionExpiresAt)} days left
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <span className="text-neutral-600">N/A</span>
                                  )}
                                </td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs text-neutral-400 whitespace-nowrap">{formatDate(user?.createdAt)}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[9px] xs:text-[10px] sm:text-xs text-neutral-400 whitespace-nowrap">{formatDate(user?.lastLogin)}</td>
                                <td className="px-2 sm:px-3 md:px-4 py-2.5 sm:py-3 text-[10px] xs:text-xs sm:text-sm whitespace-nowrap">
                                  {user?._id && (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setCreditAdjustUserId(user._id);
                                          setCreditAdjustEmail(user?.email || '');
                                          setCreditAdjustCurrentCredits(user?.totalCredits || 0);
                                          setCreditAdjustAmount('');
                                          setCreditAdjustReason('');
                                          setShowCreditAdjustModal(true);
                                        }}
                                        className="p-1.5 sm:p-2 text-gold-400 hover:text-gold-300 hover:bg-gold-500/10 rounded transition-colors"
                                        title="Adjust credits"
                                        aria-label="Adjust credits"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setDeleteUserId(user._id);
                                          setShowDeleteUserModal(true);
                                        }}
                                        className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                        title="Delete user"
                                        aria-label="Delete user"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-neutral-400 text-sm">
                                  No users found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {usersPages > 1 && (
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          onClick={() => setUsersPage((p) => Math.max(1, p - 1))}
                          disabled={usersPage === 1}
                          className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white text-sm rounded-lg transition-colors"
                        >
                          Previous
                        </button>
                        <span className="text-xs sm:text-sm text-neutral-400 text-center">
                          Page {usersPage} of {usersPages} ({usersTotal} total)
                        </span>
                        <button
                          onClick={() => setUsersPage((p) => Math.min(usersPages, p + 1))}
                          disabled={usersPage === usersPages}
                          className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white text-sm rounded-lg transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {section === 'admins' && (
              <div className="w-full max-w-6xl">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold font-serif-display">Admins</h2>
                </div>

                {/* Add Admin Form */}
                <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Add New Admin</h3>
                  {addAdminStep === 'email' ? (
                    <form onSubmit={handleSendAdminOTP} className="space-y-4">
                      <div>
                        <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Email</label>
                        <input
                          type="email"
                          value={addAdminEmail}
                          onChange={(e) => setAddAdminEmail(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          placeholder="admin@example.com"
                        />
                      </div>
                      {addAdminError && (
                        <div className="text-sm text-red-400">{addAdminError}</div>
                      )}
                      <button
                        type="submit"
                        disabled={addAdminLoading}
                        className="px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {addAdminLoading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyAdminOTP} className="space-y-4">
                      <div>
                        <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Email</label>
                        <input
                          type="email"
                          value={addAdminEmail}
                          disabled
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-neutral-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">OTP</label>
                        <input
                          type="text"
                          value={addAdminOTP}
                          onChange={(e) => setAddAdminOTP(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          required
                          maxLength={6}
                          className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-center text-xl sm:text-2xl tracking-widest focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          placeholder="000000"
                        />
                      </div>
                      {addAdminError && (
                        <div className="text-sm text-red-400">{addAdminError}</div>
                      )}
                      <div className="flex flex-col sm:flex-row gap-3">
                        <button
                          type="submit"
                          disabled={addAdminLoading || addAdminOTP.length !== 6}
                          className="flex-1 sm:flex-none px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {addAdminLoading ? 'Verifying...' : 'Verify & Add Admin'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setAddAdminStep('email');
                            setAddAdminOTP('');
                            setAddAdminError('');
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          Change Email
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Admins List */}
                {loadingAdmins ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : (
                  <>
                    <div className="bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                          <thead className="bg-neutral-800/50">
                            <tr>
                              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Email</th>
                              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Status</th>
                              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap hidden sm:table-cell">Created</th>
                              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap hidden lg:table-cell">Last Login</th>
                              <th className="px-3 sm:px-4 py-2.5 sm:py-3 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {admins.map((admin) => (
                              <tr key={admin._id} className="hover:bg-neutral-800/30">
                                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm text-white">
                                  <div className="max-w-[200px] sm:max-w-none truncate" title={admin.email}>{admin.email}</div>
                                </td>
                                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                                  <span className="inline-block px-2 py-1 rounded text-[10px] sm:text-xs font-medium bg-gold-500/20 text-gold-300">
                                    Admin
                                  </span>
                                </td>
                                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs text-neutral-400 whitespace-nowrap hidden sm:table-cell">{formatDate(admin.createdAt)}</td>
                                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-[10px] sm:text-xs text-neutral-400 whitespace-nowrap hidden lg:table-cell">{formatDate(admin.lastLogin)}</td>
                                <td className="px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm whitespace-nowrap">
                                  {admin.email.toLowerCase() !== userEmail.toLowerCase() && (
                                    <button
                                      onClick={() => {
                                        setDeleteAdminId(admin._id);
                                        setShowDeleteAdminModal(true);
                                      }}
                                      className="p-1.5 sm:p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                                      title="Remove admin privileges"
                                      aria-label="Delete admin"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    {adminsPages > 1 && (
                      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                        <button
                          onClick={() => setAdminsPage((p) => Math.max(1, p - 1))}
                          disabled={adminsPage === 1}
                          className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white text-sm rounded-lg transition-colors"
                        >
                          Previous
                        </button>
                        <span className="text-xs sm:text-sm text-neutral-400 text-center">
                          Page {adminsPage} of {adminsPages} ({adminsTotal} total)
                        </span>
                        <button
                          onClick={() => setAdminsPage((p) => Math.min(adminsPages, p + 1))}
                          disabled={adminsPage === adminsPages}
                          className="w-full sm:w-auto px-4 py-2 bg-white/10 hover:bg-white/15 disabled:opacity-30 text-white text-sm rounded-lg transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {section === 'credits' && (
              <div className="w-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-serif-display">Credits Management</h2>
                  <p className="text-sm text-neutral-400">Configure credits for each pricing plan</p>
                </div>

                {loadingPlans ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Free Tier Credits Section */}
                    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border-2 border-gold-500/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">Free Tier Credits</h3>
                          <p className="text-xs text-neutral-400 mt-1">Credits for users without a subscription plan</p>
                        </div>
                        <span className="px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full">
                          Default Plan
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-6 mb-4">
                        <div>
                          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            Total Credits (Unified System)
                          </label>
                          <input
                            type="number"
                            min="0"
                            value={freeTierCredits.totalCredits}
                            onChange={(e) => setFreeTierCredits(prev => ({
                              ...prev,
                              totalCredits: parseInt(e.target.value) || 0
                            }))}
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          />
                          <p className="text-xs text-neutral-500 mt-2">
                            Users can use these credits for both photoshoot (20 credits each) and marketing poster (20 credits each) generation
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem('admin_token');
                            if (!token) {
                              toast.error('Authentication required', { position: "top-right", autoClose: 3000 });
                              return;
                            }

                            setSavingFreeTier(true);
                            try {
                              const res = await fetch(`${API_URL}/api/admin/free-tier-credits`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  freeTierTotalCredits: freeTierCredits.totalCredits,
                                }),
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                toast.success('Free tier credits updated successfully!', { position: "top-right", autoClose: 3000 });
                              } else {
                                toast.error(data.message || 'Failed to save free tier credits', { position: "top-right", autoClose: 3000 });
                              }
                            } catch (e) {
                              toast.error('Failed to save free tier credits', { position: "top-right", autoClose: 3000 });
                            } finally {
                              setSavingFreeTier(false);
                            }
                          }}
                          disabled={savingFreeTier}
                          className="px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {savingFreeTier ? 'Saving...' : 'Save Free Tier Credits'}
                        </button>
                      </div>
                    </div>

                    {/* Credit Deduction Per Generation Section */}
                    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border-2 border-gold-500/30 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-white">Credit Deduction per Generation</h3>
                          <p className="text-xs text-neutral-400 mt-1">Configure how many credits are deducted for each generation</p>
                        </div>
                        <span className="px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full">
                          Per Generation
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            Photoshoot Credits (per generation)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={creditDeductions.creditsPerPhotoshootGeneration}
                            onChange={(e) => setCreditDeductions(prev => ({
                              ...prev,
                              creditsPerPhotoshootGeneration: parseInt(e.target.value) || 1
                            }))}
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            Marketing Poster Credits (per generation)
                          </label>
                          <input
                            type="number"
                            min="1"
                            value={creditDeductions.creditsPerMarketingGeneration}
                            onChange={(e) => setCreditDeductions(prev => ({
                              ...prev,
                              creditsPerMarketingGeneration: parseInt(e.target.value) || 1
                            }))}
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem('admin_token');
                            if (!token) {
                              toast.error('Authentication required', { position: "top-right", autoClose: 3000 });
                              return;
                            }

                            setSavingCreditDeductions(true);
                            try {
                              const res = await fetch(`${API_URL}/api/admin/credit-deductions`, {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  Authorization: `Bearer ${token}`,
                                },
                                body: JSON.stringify({
                                  creditsPerPhotoshootGeneration: creditDeductions.creditsPerPhotoshootGeneration,
                                  creditsPerMarketingGeneration: creditDeductions.creditsPerMarketingGeneration,
                                }),
                              });
                              const data = await res.json();
                              if (res.ok && data.success) {
                                toast.success('Credit deduction settings updated successfully!', { position: "top-right", autoClose: 3000 });
                              } else {
                                toast.error(data.message || 'Failed to save credit deduction settings', { position: "top-right", autoClose: 3000 });
                              }
                            } catch (e) {
                              toast.error('Failed to save credit deduction settings', { position: "top-right", autoClose: 3000 });
                            } finally {
                              setSavingCreditDeductions(false);
                            }
                          }}
                          disabled={savingCreditDeductions}
                          className="px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {savingCreditDeductions ? 'Saving...' : 'Save Credit Deductions'}
                        </button>
                      </div>
                    </div>

                    {/* Paid Plans Section */}
                    <div className="pt-4">
                      <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Paid Plans</h3>
                      <div className="text-xs text-neutral-400 mb-2">
                        Debug: Plans count = {plans.length}, First plan = {plans[0] ? JSON.stringify(plans[0]) : 'No plans'}
                      </div>
                    </div>
                    {plans.map((plan, i) => (
                      <div
                        key={i}
                        className="bg-neutral-900/50 border border-white/10 rounded-xl p-4 sm:p-6 mb-4"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
                          {plan.isPopular && (
                            <span className="px-3 py-1 bg-gold-500/20 text-gold-400 text-xs font-semibold rounded-full">
                              Most Popular
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                              Total Credits (per month) - Unified System
                            </label>
                            <input
                              type="number"
                              min="0"
                              value={plan.totalCredits || 0}
                              onChange={(e) => updatePlan(i, 'totalCredits', parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                            />
                            <p className="text-xs text-neutral-500 mt-2">
                              Users can use these credits for both photoshoot (20 each) and marketing poster (20 each) generation
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        onClick={handlePreviewSync}
                        disabled={loadingPreview || syncingCredits || savingPlans}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        title="Preview credit changes before syncing"
                      >
                        {loadingPreview ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Loading...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Preview Changes
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleSyncCredits}
                        disabled={syncingCredits || savingPlans}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        title="Sync credits for all users based on their subscription plans"
                      >
                        {syncingCredits ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Syncing...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Sync Credits
                          </>
                        )}
                      </button>
                      <button
                        onClick={async () => {
                          alert('Save Plans button clicked!');
                          const token = localStorage.getItem('admin_token');
                          if (!token) return;

                          setSavingPlans(true);
                          try {
                            // Save complete plan data, not just credits
                            await handleSavePlans(plans);
                            toast.success('Price plans saved successfully!', { position: "top-right", autoClose: 3000 });
                          } catch (e) {
                            toast.error('Failed to save price plans', { position: "top-right", autoClose: 3000 });
                          } finally {
                            setSavingPlans(false);
                          }
                        }}
                        disabled={savingPlans || syncingCredits}
                        className="px-6 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                      >
                        {savingPlans ? 'Saving...' : 'Save Plans'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {section === 'statistics' && (
              <div className="w-full">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold font-serif-display">Statistics Management</h2>
                  <p className="text-sm text-neutral-400">Update statistics displayed on the landing page</p>
                </div>

                {loadingStatistics ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-neutral-900/80 to-neutral-800/50 border-2 border-gold-500/30 rounded-xl p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            Categories
                          </label>
                          <input
                            type="text"
                            value={statistics.categories}
                            onChange={(e) => setStatistics(prev => ({ ...prev, categories: e.target.value }))}
                            placeholder="e.g., 4+"
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          />
                          <p className="text-xs text-neutral-500 mt-1">Displayed as: "{statistics.categories} Categories"</p>
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            Active Users
                          </label>
                          <input
                            type="text"
                            value={statistics.activeUsers}
                            onChange={(e) => setStatistics(prev => ({ ...prev, activeUsers: e.target.value }))}
                            placeholder="e.g., 10k+"
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          />
                          <p className="text-xs text-neutral-500 mt-1">Displayed as: "{statistics.activeUsers} Active Users"</p>
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            Image Generated
                          </label>
                          <input
                            type="text"
                            value={statistics.imageGenerated}
                            onChange={(e) => setStatistics(prev => ({ ...prev, imageGenerated: e.target.value }))}
                            placeholder="e.g., 50k+"
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          />
                          <p className="text-xs text-neutral-500 mt-1">Displayed as: "{statistics.imageGenerated} Image Generated"</p>
                        </div>
                        <div>
                          <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                            Active Subscription
                          </label>
                          <input
                            type="text"
                            value={statistics.activeSubscription}
                            onChange={(e) => setStatistics(prev => ({ ...prev, activeSubscription: e.target.value }))}
                            placeholder="e.g., 1k+"
                            className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                          />
                          <p className="text-xs text-neutral-500 mt-1">Displayed as: "{statistics.activeSubscription} Active Subscription"</p>
                        </div>
                      </div>

                      <div className="flex justify-end pt-4 border-t border-white/10">
                        <button
                          onClick={saveStatistics}
                          disabled={savingStatistics}
                          className="px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                          {savingStatistics ? 'Saving...' : 'Save Statistics'}
                        </button>
                      </div>
                    </div>

                    {/* Preview Section */}
                    <div className="bg-neutral-900/50 border border-white/10 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-black p-4 rounded-xl border border-white/10 text-center">
                          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">
                            {statistics.categories}
                          </h3>
                          <p className="text-sm text-neutral-400">Categories</p>
                        </div>
                        <div className="bg-black p-4 rounded-xl border border-white/10 text-center">
                          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">
                            {statistics.activeUsers}
                          </h3>
                          <p className="text-sm text-neutral-400">Active Users</p>
                        </div>
                        <div className="bg-black p-4 rounded-xl border border-white/10 text-center">
                          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">
                            {statistics.imageGenerated}
                          </h3>
                          <p className="text-sm text-neutral-400">Image Generated</p>
                        </div>
                        <div className="bg-black p-4 rounded-xl border border-white/10 text-center">
                          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gold-400 via-gold-500 to-gold-500 bg-clip-text text-transparent">
                            {statistics.activeSubscription}
                          </h3>
                          <p className="text-sm text-neutral-400">Active Subscription</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {section === 'gen-history' && (
              <div className="w-full">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold font-serif-display">Generation History</h2>
                    <p className="text-sm text-neutral-400">All image generations by users</p>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      type="text"
                      placeholder="Search email..."
                      className="px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white max-w-[200px]"
                      value={genSearchEmail}
                      onChange={(e) => setGenSearchEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setGenPage(1) && loadGenerations(localStorage.getItem('admin_token') || '', 1, genFilterType, genSearchEmail, genFilterPlan)}
                    />
                    <select
                      className="px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white cursor-pointer"
                      value={genFilterType}
                      onChange={(e) => {
                         setGenFilterType(e.target.value);
                         setGenPage(1);
                         loadGenerations(localStorage.getItem('admin_token') || '', 1, e.target.value, genSearchEmail, genFilterPlan);
                      }}
                    >
                      <option value="all">All Types</option>
                      <option value="photoshoot">Photoshoot</option>
                      <option value="marketing">Marketing</option>
                    </select>
                    <select
                      className="px-3 py-2 bg-neutral-900 border border-white/10 rounded-lg text-sm text-white cursor-pointer"
                      value={genFilterPlan}
                      onChange={(e) => {
                         setGenFilterPlan(e.target.value);
                         setGenPage(1);
                         loadGenerations(localStorage.getItem('admin_token') || '', 1, genFilterType, genSearchEmail, e.target.value);
                      }}
                    >
                      <option value="all">All Plans</option>
                      <option value="free">Free Plan</option>
                      <option value="paid">Paid Plan</option>
                    </select>
                    <button
                      onClick={() => {
                        setGenPage(1);
                        loadGenerations(localStorage.getItem('admin_token') || '', 1, genFilterType, genSearchEmail, genFilterPlan);
                      }}
                      className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      Filter
                    </button>
                  </div>
                </div>

                {loadingGenerations ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : generations.length === 0 ? (
                  <div className="text-center py-16 text-neutral-500">
                    No generations recorded yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead className="bg-neutral-800/50">
                          <tr>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">User Email</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Type</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Quality</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Canvas</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Environment</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Aesthetic</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Persona</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider"># Images</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Credits</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Rating</th>
                            <th className="px-3 py-2.5 text-left text-[10px] sm:text-xs font-semibold text-neutral-400 uppercase tracking-wider">Date & Time</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {generations.map((gen: any) => (
                            <React.Fragment key={gen._id}>
                              <tr
                                className="hover:bg-neutral-800/30 cursor-pointer"
                                onClick={() => setExpandedGenId(expandedGenId === gen._id ? null : gen._id)}
                              >
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-white">
                                  <div className="max-w-[180px] truncate" title={gen.userEmail}>{gen.userEmail}</div>
                                </td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium ${gen.type === 'photoshoot' ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'}`}>
                                    {gen.type === 'photoshoot' ? 'Photoshoot' : 'Marketing'}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm">
                                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${gen.quality === '4K' ? 'bg-gold-500/20 text-gold-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                    {gen.quality || 'HD'}
                                  </span>
                                </td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-neutral-400 capitalize">{gen.category || '—'}</td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-neutral-400 capitalize">{gen.background || '—'}</td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-neutral-400 capitalize">{gen.style || '—'}</td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-neutral-400">{gen.creatorName || '—'}</td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-white font-medium">{gen.numberOfImages || gen.imageUrls?.length || 0}</td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-neutral-400">{gen.creditsUsed || 0}</td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-neutral-400">
                                  {gen.rating > 0 ? (
                                    <div className="flex items-center text-gold-400 gap-1">
                                      <span className="font-bold">{gen.rating}</span>
                                      <StarIcon className="w-3.5 h-3.5" />
                                    </div>
                                  ) : '—'}
                                </td>
                                <td className="px-3 py-2.5 text-xs sm:text-sm text-neutral-400 whitespace-nowrap">
                                  <div>{formatDate(gen.createdAt)}</div>
                                  <div className="text-[10px] text-neutral-500">{formatDateTime(gen.createdAt)}</div>
                                </td>
                              </tr>
                              {expandedGenId === gen._id && (
                                <tr>
                                  <td colSpan={10} className="px-3 py-4 bg-neutral-900/50">
                                    <div className="space-y-3">
                                      {/* Source Image (uploaded photo) */}
                                      {gen.sourceImageUrl && (
                                        <div>
                                          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">Uploaded Photo</p>
                                          <a href={getProxiedUrlForReview(gen.sourceImageUrl)} target="_blank" rel="noopener noreferrer" className="inline-block">
                                            <img
                                              src={getProxiedUrlForReview(gen.sourceImageUrl)}
                                              alt="Uploaded source"
                                              className="h-28 sm:h-36 object-contain rounded-lg border-2 border-gold-500/30 bg-black/30 p-1"
                                              loading="lazy"
                                              onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                              }}
                                            />
                                          </a>
                                        </div>
                                      )}
                                      {/* Generated Images */}
                                      {gen.imageUrls && gen.imageUrls.length > 0 && (
                                        <div>
                                          <p className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold mb-2">Generated Images</p>
                                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                            {gen.imageUrls.map((url: string, idx: number) => (
                                              <button key={idx} onClick={() => setPreviewImage(getProxiedUrlForReview(url))} className="block w-full text-left">
                                                <img
                                                  src={getProxiedUrlForReview(url)}
                                                  alt={`Gen ${idx + 1}`}
                                                  className="w-full h-24 sm:h-32 object-contain rounded-lg border border-white/10 hover:border-gold-500/50 transition-colors bg-black/30 p-1"
                                                  loading="lazy"
                                                  onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                  }}
                                                />
                                              </button>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                      {/* Extra Details Row */}
                                      <div className="flex flex-wrap gap-4 text-xs text-neutral-500 pt-1">
                                        {gen.productType && <span>Product Type: <span className="text-neutral-300 capitalize">{gen.productType}</span></span>}
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination */}
                    {genTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                          onClick={() => setGenPage(Math.max(1, genPage - 1))}
                          disabled={genPage === 1}
                          className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 border border-white/10 rounded-lg disabled:opacity-30 hover:bg-neutral-700"
                        >
                          Previous
                        </button>
                        <span className="text-xs text-neutral-400">Page {genPage} of {genTotalPages}</span>
                        <button
                          onClick={() => setGenPage(Math.min(genTotalPages, genPage + 1))}
                          disabled={genPage === genTotalPages}
                          className="px-3 py-1.5 text-xs bg-neutral-800 text-neutral-300 border border-white/10 rounded-lg disabled:opacity-30 hover:bg-neutral-700"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== REVIEWS SECTION ==================== */}
            {section === 'reviews' && (
              <div className="w-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-bold font-serif-display text-white">⭐ User Reviews</h2>
                    <p className="text-sm text-neutral-400">All generations that received user ratings.</p>
                  </div>
                </div>

                {loadingReviews ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">⭐</div>
                    <p className="text-neutral-400 text-lg">No reviews yet</p>
                    <p className="text-neutral-500 text-sm mt-1">When users rate their generated results, they will appear here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {reviews.map((review) => (
                        <div key={review._id} className="bg-neutral-900/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col hover:border-gold-500/30 transition-all shadow-xl">
                          <div className="aspect-[4/3] bg-black/80 relative flex items-center justify-center p-2 border-b border-white/10">
                             <img 
                               src={getProxiedUrlForReview(review.imageUrls?.[0] || review.sourceImageUrl)} 
                               alt="Review preview" 
                               className="w-full h-full object-contain"
                               onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                             />
                             <div className="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-gold-500/40 flex items-center gap-1 shadow-lg shadow-black">
                                <span className="font-bold text-gold-400 text-sm">{review.rating}</span>
                                <StarIcon className="w-3.5 h-3.5 text-gold-400" />
                             </div>
                             <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2 py-1 rounded border border-white/10 shadow-lg shadow-black">
                                <span className={`text-[10px] font-medium uppercase tracking-wider ${review.type === 'photoshoot' ? 'text-blue-300' : 'text-purple-300'}`}>
                                  {review.type || 'Photoshoot'}
                                </span>
                             </div>
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col">
                            <h3 className="font-medium text-white truncate text-sm mb-1" title={review.userEmail}>{review.userEmail}</h3>
                            <p className="text-[10px] text-neutral-500 mb-4">{new Date(review.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                            
                            <div className="bg-black/30 p-4 flex-1 rounded-xl border border-white/5 mt-auto">
                               {review.ratingFeedback ? (
                                  <p className="text-sm text-neutral-300 italic leading-relaxed">"{review.ratingFeedback}"</p>
                               ) : (
                                  <p className="text-sm text-neutral-600 italic">No feedback text provided.</p>
                               )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {reviewTotalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-6">
                        <button
                          onClick={() => setReviewPage(Math.max(1, reviewPage - 1))}
                          disabled={reviewPage === 1}
                          className="px-4 py-2 text-sm bg-neutral-800 text-neutral-300 border border-white/10 rounded-xl disabled:opacity-30 hover:bg-neutral-700 hover:text-white transition-colors"
                        >
                          Previous
                        </button>
                        <span className="text-sm text-neutral-400 font-medium px-4">Page {reviewPage} of {reviewTotalPages}</span>
                        <button
                          onClick={() => setReviewPage(Math.min(reviewTotalPages, reviewPage + 1))}
                          disabled={reviewPage === reviewTotalPages}
                          className="px-4 py-2 text-sm bg-neutral-800 text-neutral-300 border border-white/10 rounded-xl disabled:opacity-30 hover:bg-neutral-700 hover:text-white transition-colors"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ==================== PROMO CODES SECTION ==================== */}
            {section === 'promo-codes' && (
              <div className="w-full">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  <h2 className="text-2xl font-bold font-serif-display">🏷️ Promo Codes</h2>
                  <button
                    onClick={() => {
                      setEditingPromo(null);
                      setPromoForm({
                        code: '',
                        discountType: 'percentage',
                        applicablePlans: plans.map((p) => ({ planName: p.name, discountValue: 0 })),
                        maxUses: 100,
                        expiresAt: '',
                      });
                      setShowPromoForm(true);
                    }}
                    className="px-4 py-2 bg-gold-600 hover:bg-gold-500 text-white text-sm font-semibold rounded-lg transition-colors"
                  >
                    + Create Promo Code
                  </button>
                </div>

                {loadingPromoCodes ? (
                  <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-500 border-t-transparent" />
                  </div>
                ) : promoCodes.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-5xl mb-4">🏷️</div>
                    <p className="text-neutral-400 text-lg">No promo codes yet</p>
                    <p className="text-neutral-500 text-sm mt-1">Create your first promo code to offer discounts</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {promoCodes.map((promo) => (
                      <div
                        key={promo._id}
                        className={`rounded-xl border p-4 sm:p-5 transition-all ${
                          promo.isActive
                            ? 'bg-neutral-900/50 border-white/10 hover:border-gold-500/30'
                            : 'bg-neutral-950/50 border-white/5 opacity-60'
                        }`}
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-white font-mono tracking-wider">{promo.code}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                promo.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                              }`}>
                                {promo.isActive ? 'Active' : 'Inactive'}
                              </span>
                              {promo.expiresAt && new Date(promo.expiresAt) < new Date() && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-semibold">Expired</span>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {promo.applicablePlans?.map((ap: any) => (
                                <span key={ap.planName} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-1 rounded">
                                  {ap.planName}: <span className="text-gold-400 font-semibold">{promo.discountType === 'percentage' ? `${ap.discountValue}%` : `₹${ap.discountValue}`}</span> off
                                </span>
                              ))}
                            </div>
                            <div className="flex flex-wrap gap-4 mt-2 text-xs text-neutral-500">
                              <span>Usage: <span className="text-neutral-300 font-semibold">{promo.usedCount}/{promo.maxUses}</span></span>
                              {promo.expiresAt && (
                                <span>Expires: <span className="text-neutral-300">{new Date(promo.expiresAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span></span>
                              )}
                              <span>Created: {new Date(promo.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePromo(promo._id)}
                              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                                promo.isActive
                                  ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                                  : 'bg-green-500/15 text-green-400 hover:bg-green-500/25'
                              }`}
                            >
                              {promo.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleEditPromo(promo)}
                              className="p-2 bg-neutral-800 hover:bg-gold-600/50 rounded-lg text-gold-400 hover:text-white transition-colors"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setDeletingPromoId(promo._id);
                                setShowDeletePromoModal(true);
                              }}
                              className="p-2 bg-neutral-800 hover:bg-red-600/50 rounded-lg text-red-400 hover:text-white transition-colors"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>

                        {/* Usage details - show users who used it */}
                        {promo.usedBy && promo.usedBy.length > 0 && (
                          <details className="mt-3">
                            <summary className="text-xs text-neutral-500 cursor-pointer hover:text-neutral-300 transition-colors">
                              View {promo.usedBy.length} usage(s)
                            </summary>
                            <div className="mt-2 space-y-1 max-h-40 overflow-y-auto">
                              {promo.usedBy.map((usage: any, idx: number) => (
                                <div key={idx} className="flex items-center justify-between text-xs bg-neutral-800/50 rounded px-3 py-1.5">
                                  <span className="text-neutral-300">{usage.email}</span>
                                  <div className="flex items-center gap-3 text-neutral-500">
                                    <span>{usage.planName}</span>
                                    <span className="text-green-400">-₹{usage.discountApplied}</span>
                                    <span>{new Date(usage.usedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />

      <ConfirmationModal
        isOpen={showDeleteAdminModal}
        onClose={() => {
          setShowDeleteAdminModal(false);
          setDeleteAdminId(null);
        }}
        onConfirm={handleDeleteAdmin}
        title="Remove Admin Privileges"
        message={`Are you sure you want to remove admin privileges from this user? They will be converted to a regular user.`}
        confirmText="Remove Admin"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />

      <ConfirmationModal
        isOpen={showDeleteUserModal}
        onClose={() => {
          setShowDeleteUserModal(false);
          setDeleteUserId(null);
        }}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete this user? This action cannot be undone and all user data will be permanently removed.`}
        confirmText="Delete User"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />

      <ConfirmationModal
        isOpen={showDeletePlanModal}
        onClose={() => {
          setShowDeletePlanModal(false);
          setPlanToDeleteIndex(null);
        }}
        onConfirm={confirmDeletePlan}
        title="Delete Price Plan"
        message={`Are you sure you want to delete this price plan? This action cannot be undone.`}
        confirmText="Delete Plan"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />

      {/* Promo Code Delete Confirmation */}
      <ConfirmationModal
        isOpen={showDeletePromoModal}
        onClose={() => {
          setShowDeletePromoModal(false);
          setDeletingPromoId(null);
        }}
        onConfirm={handleDeletePromo}
        title="Delete Promo Code"
        message="Are you sure you want to delete this promo code? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-500"
      />

      {/* Promo Code Create/Edit Overlay */}
      {showPromoForm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-gold-500/30 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h3 className="text-xl font-bold font-serif-display">
                {editingPromo ? 'Edit Promo Code' : 'Create Promo Code'}
              </h3>
              <button
                onClick={() => setShowPromoForm(false)}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Code Name */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Promo Code</label>
                <input
                  type="text"
                  value={promoForm.code}
                  onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. MARO50"
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm uppercase tracking-wider focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>

              {/* Discount Type */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Discount Type</label>
                <div className="flex gap-3">
                  <button
                    onClick={() => setPromoForm({ ...promoForm, discountType: 'percentage' })}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      promoForm.discountType === 'percentage'
                        ? 'bg-gold-600/20 text-gold-400 border border-gold-500/40'
                        : 'bg-neutral-800 text-neutral-400 border border-white/5 hover:border-white/10'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    onClick={() => setPromoForm({ ...promoForm, discountType: 'fixed' })}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      promoForm.discountType === 'fixed'
                        ? 'bg-gold-600/20 text-gold-400 border border-gold-500/40'
                        : 'bg-neutral-800 text-neutral-400 border border-white/5 hover:border-white/10'
                    }`}
                  >
                    Fixed (₹)
                  </button>
                </div>
              </div>

              {/* Per-Plan Discount Values */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Plan Discounts <span className="normal-case text-neutral-600">(set 0 to exclude plan)</span>
                </label>
                <div className="space-y-2">
                  {promoForm.applicablePlans.map((plan, idx) => (
                    <div key={plan.planName} className="flex items-center gap-3 bg-neutral-800/50 rounded-lg px-4 py-2.5">
                      <span className="text-sm text-neutral-300 flex-1">{plan.planName}</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={promoForm.discountType === 'percentage' ? 100 : undefined}
                          value={plan.discountValue}
                          onChange={(e) => {
                            const updatedPlans = [...promoForm.applicablePlans];
                            updatedPlans[idx] = { ...updatedPlans[idx], discountValue: Number(e.target.value) || 0 };
                            setPromoForm({ ...promoForm, applicablePlans: updatedPlans });
                          }}
                          className="w-20 px-3 py-1.5 bg-black/40 border border-white/10 rounded text-white text-sm text-center focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        />
                        <span className="text-xs text-neutral-500">
                          {promoForm.discountType === 'percentage' ? '%' : '₹'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Max Uses */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Max Uses (Total Users)</label>
                <input
                  type="number"
                  min="1"
                  value={promoForm.maxUses}
                  onChange={(e) => setPromoForm({ ...promoForm, maxUses: Number(e.target.value) || 1 })}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Expiry Date <span className="normal-case text-neutral-600">(optional)</span>
                </label>
                <input
                  type="date"
                  value={promoForm.expiresAt}
                  onChange={(e) => setPromoForm({ ...promoForm, expiresAt: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowPromoForm(false)}
                className="flex-1 px-4 py-2.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePromo}
                disabled={savingPromo}
                className="flex-1 px-4 py-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
              >
                {savingPromo ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Saving...
                  </>
                ) : (
                  editingPromo ? 'Update Promo Code' : 'Create Promo Code'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-4 sm:p-6 lg:p-8 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative w-full h-full flex items-center justify-center max-w-7xl">
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-0 right-0 p-2 text-white bg-black/50 hover:bg-black rounded-full transition-colors z-[70] translate-x-2 -translate-y-2 sm:translate-x-4 sm:-translate-y-4"
              aria-label="Close preview"
            >
              <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Add Plan Overlay */}
      {showAddPlanOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-serif-display">Add New Plan</h3>
              <button
                onClick={handleCloseAddPlanOverlay}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Name</label>
                  <input
                    value={newPlan.name}
                    onChange={(e) => updateNewPlan('name', e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Monthly Price ($)</label>
                  <input
                    value={newPlan.price}
                    onChange={(e) => updateNewPlan('price', e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Yearly Price (₹/mo)</label>
                  <input
                    value={newPlan.yearlyPrice}
                    onChange={(e) => updateNewPlan('yearlyPrice', e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Total Credits (per month) - Unified System</label>
                  <input
                    type="number"
                    min="0"
                    value={newPlan.totalCredits || 0}
                    onChange={(e) => updateNewPlan('totalCredits', String(parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                  <p className="text-xs text-neutral-500 mt-2">
                    Users can use these credits for both photoshoot (20 each) and marketing poster (20 each) generation
                  </p>
                </div>
                <div className="sm:col-span-2 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="add-plan-popular"
                    checked={newPlan.isPopular}
                    onChange={(e) => updateNewPlan('isPopular', e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-gold-600 focus:ring-gold-500"
                  />
                  <label htmlFor="add-plan-popular" className="text-sm text-neutral-300">Most Popular</label>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Description</label>
                  <input
                    value={newPlan.description}
                    onChange={(e) => updateNewPlan('description', e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-neutral-500 uppercase tracking-wider">Features</label>
                  <button
                    onClick={addNewPlanFeature}
                    className="text-xs text-gold-400 hover:text-gold-300"
                  >
                    + Add Feature
                  </button>
                </div>
                <ul className="space-y-2">
                  {(newPlan.features || []).map((f, j) => (
                    <li key={j} className="flex gap-2">
                      <input
                        value={f}
                        onChange={(e) => updateNewPlanFeature(j, e.target.value)}
                        className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeNewPlanFeature(j)}
                        className="p-2 text-red-400 hover:text-red-300 rounded"
                        aria-label="Remove"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={handleCloseAddPlanOverlay}
                  className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    // Validate required fields
                    if (!newPlan.name.trim()) {
                      toast.error('Plan name is required', { position: "top-right", autoClose: 3000 });
                      return;
                    }
                    if (!newPlan.price.trim()) {
                      toast.error('Monthly price is required', { position: "top-right", autoClose: 3000 });
                      return;
                    }
                    if (!newPlan.yearlyPrice.trim()) {
                      toast.error('Yearly price is required', { position: "top-right", autoClose: 3000 });
                      return;
                    }

                    const token = localStorage.getItem('admin_token');
                    if (!token) {
                      toast.error('Authentication required', { position: "top-right", autoClose: 3000 });
                      return;
                    }

                    setSavingPlans(true);
                    try {
                      // Filter blank features
                      const cleanedFeatures = (newPlan.features || []).filter((f: string) => f && f.trim().length > 0);

                      // Create new plan via POST
                      const res = await fetch(`${API_URL}/api/admin/price-plans`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                        body: JSON.stringify({
                          name: newPlan.name.trim(),
                          price: newPlan.price.trim(),
                          yearlyPrice: newPlan.yearlyPrice.trim(),
                          description: newPlan.description.trim(),
                          features: cleanedFeatures,
                          isPopular: newPlan.isPopular,
                          photoshootCredits: newPlan.photoshootCredits || 0,
                        }),
                      });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        // Reload all plans to get the new one with ID
                        await loadPlans(token);
                        toast.success('New plan created successfully!', { position: "top-right", autoClose: 3000 });
                        handleCloseAddPlanOverlay();
                      } else {
                        toast.error(data.message || 'Failed to save plan', { position: "top-right", autoClose: 3000 });
                      }
                    } catch (e) {
                      toast.error('Failed to save plan', { position: "top-right", autoClose: 3000 });
                    } finally {
                      setSavingPlans(false);
                    }
                  }}
                  disabled={savingPlans}
                  className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {savingPlans ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Overlay */}
      {showEditPlanOverlay && editingPlanIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-neutral-900 border border-white/10 rounded-2xl p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold font-serif-display">Edit Plan</h3>
              <button
                onClick={handleCloseEditOverlay}
                className="p-2 text-neutral-400 hover:text-white rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {editingPlanIndex !== null && (
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Name</label>
                    <input
                      value={plans[editingPlanIndex].name}
                      onChange={(e) => updatePlan(editingPlanIndex, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Monthly Price ($)</label>
                    <input
                      value={plans[editingPlanIndex].price}
                      onChange={(e) => updatePlan(editingPlanIndex, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Yearly Price (₹/mo)</label>
                    <input
                      value={plans[editingPlanIndex].yearlyPrice}
                      onChange={(e) => updatePlan(editingPlanIndex, 'yearlyPrice', e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Total Credits (per month) - Unified System</label>
                    <input
                      type="number"
                      min="0"
                      value={plans[editingPlanIndex].totalCredits || 0}
                      onChange={(e) => updatePlan(editingPlanIndex, 'totalCredits', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                    <p className="text-xs text-neutral-500 mt-2">
                      Users can use these credits for both photoshoot (20 each) and marketing poster (20 each) generation
                    </p>
                  </div>
                  <div className="sm:col-span-2 flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="edit-plan-popular"
                      checked={plans[editingPlanIndex].isPopular}
                      onChange={(e) => updatePlan(editingPlanIndex, 'isPopular', e.target.checked)}
                      className="rounded border-white/20 bg-black/40 text-gold-600 focus:ring-gold-500"
                    />
                    <label htmlFor="edit-plan-popular" className="text-sm text-neutral-300">Most Popular</label>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Description</label>
                    <input
                      value={plans[editingPlanIndex].description}
                      onChange={(e) => updatePlan(editingPlanIndex, 'description', e.target.value)}
                      className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs text-neutral-500 uppercase tracking-wider">Features</label>
                    <button
                      onClick={() => addFeature(editingPlanIndex)}
                      className="text-xs text-gold-400 hover:text-gold-300"
                    >
                      + Add Feature
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {(plans[editingPlanIndex].features || []).map((f, j) => (
                      <li key={j} className="flex gap-2">
                        <input
                          value={f}
                          onChange={(e) => updateFeature(editingPlanIndex, j, e.target.value)}
                          className="flex-1 px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                        />
                        <button
                          onClick={() => removeFeature(editingPlanIndex, j)}
                          className="p-2 text-red-400 hover:text-red-300 rounded"
                          aria-label="Remove"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                  <button
                    onClick={handleCloseEditOverlay}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/15 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (editingPlanIndex === null) return;

                      const planToEdit = plans[editingPlanIndex];
                      if (!planToEdit._id) {
                        toast.error('Cannot edit plan without ID', { position: "top-right", autoClose: 3000 });
                        return;
                      }

                      const token = localStorage.getItem('admin_token');
                      if (!token) {
                        toast.error('Authentication required', { position: "top-right", autoClose: 3000 });
                        return;
                      }

                      setSavingPlans(true);
                      try {
                        // Filter blank features
                        const filteredFeatures = (planToEdit.features || []).filter((f: string) => f && f.trim().length > 0);

                        // Auto-update features array to include credits if credit fields are set
                        const creditFeatures: string[] = [];
                        if (planToEdit.photoshootCredits !== undefined && planToEdit.photoshootCredits !== null) {
                          creditFeatures.push(`${planToEdit.photoshootCredits.toLocaleString()} Photoshoot generation`);
                        }
                        if (planToEdit.marketingPosterCredits !== undefined && planToEdit.marketingPosterCredits !== null) {
                          creditFeatures.push(`${planToEdit.marketingPosterCredits.toLocaleString()} Marketing poster generation`);
                        }

                        // Remove old credit features and add new ones
                        const nonCreditFeatures = filteredFeatures.filter(f =>
                          !f.toLowerCase().includes('photoshoot generation') &&
                          !f.toLowerCase().includes('marketing poster generation')
                        );

                        const cleanedFeatures = [...creditFeatures, ...nonCreditFeatures];

                        // Update plan via PUT
                        const res = await fetch(`${API_URL}/api/admin/price-plans/${planToEdit._id}`, {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                          body: JSON.stringify({
                            name: planToEdit.name,
                            price: planToEdit.price,
                            yearlyPrice: planToEdit.yearlyPrice,
                            description: planToEdit.description,
                            features: cleanedFeatures,
                            isPopular: planToEdit.isPopular,
                            photoshootCredits: planToEdit.photoshootCredits || 0,
                            marketingPosterCredits: planToEdit.marketingPosterCredits || 0,
                          }),
                        });
                        const data = await res.json();
                        if (res.ok && data.success) {
                          // Reload all plans to get updated state
                          await loadPlans(token);
                          toast.success('Plan updated successfully!', { position: "top-right", autoClose: 3000 });
                          handleCloseEditOverlay();
                        } else {
                          toast.error(data.message || 'Failed to update plan', { position: "top-right", autoClose: 3000 });
                        }
                      } catch (e) {
                        toast.error('Failed to update plan', { position: "top-right", autoClose: 3000 });
                      } finally {
                        setSavingPlans(false);
                      }
                    }}
                    disabled={savingPlans}
                    className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
                  >
                    {savingPlans ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* User Detail Overlay */}
      {showUserDetail && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border border-gold-500/20 rounded-xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-white/10 flex items-start justify-between gap-4">
              <div className="min-w-0">
                {loadingUserDetail ? (
                  <div className="animate-pulse h-6 w-48 bg-neutral-700 rounded mb-2" />
                ) : (
                  <>
                    <h2 className="text-lg font-bold text-white truncate">{selectedUserDetail?.name || 'User'}</h2>
                    <p className="text-sm text-neutral-400 truncate">{selectedUserDetail?.email}</p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {selectedUserDetail?.subscriptionPlan && (
                        <span className="text-xs px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 font-medium">
                          {selectedUserDetail.subscriptionPlan}
                        </span>
                      )}
                      {selectedUserDetail?.subscriptionBillingPeriod && (
                        <span className="text-xs px-2 py-0.5 rounded bg-neutral-700 text-neutral-300 capitalize">
                          {selectedUserDetail.subscriptionBillingPeriod}
                        </span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${selectedUserDetail?.isActive ? 'bg-green-500/20 text-green-300' : selectedUserDetail?.subscriptionPlan ? 'bg-red-500/20 text-red-300' : 'bg-neutral-700 text-neutral-400'}`}>
                        {selectedUserDetail?.isActive ? '● Active' : selectedUserDetail?.subscriptionPlan ? '● Expired' : 'Free'}
                      </span>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => { setShowUserDetail(false); setSelectedUserDetail(null); setSelectedUserHistory([]); }}
                className="text-neutral-400 hover:text-white transition-colors flex-shrink-0 p-1"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {loadingUserDetail ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-500 border-t-transparent" />
              </div>
            ) : selectedUserDetail && (
              <div className="overflow-y-auto flex-1 p-5 space-y-5">
                {/* Credit Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-neutral-800/50 rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Total Credits</div>
                    <div className="text-lg font-bold text-white">{(selectedUserDetail.totalCredits || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Remaining</div>
                    <div className="text-lg font-bold text-emerald-400">{(selectedUserDetail.remainingCredits || 0).toLocaleString()}</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Photoshoot Gen</div>
                    <div className="text-lg font-bold text-blue-400">{selectedUserDetail.photoshootGenerations || 0}</div>
                  </div>
                  <div className="bg-neutral-800/50 rounded-lg p-3 border border-white/5">
                    <div className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Marketing Gen</div>
                    <div className="text-lg font-bold text-purple-400">{selectedUserDetail.marketingGenerations || 0}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setCreditAdjustUserId(selectedUserDetail._id);
                      setCreditAdjustEmail(selectedUserDetail.email);
                      setCreditAdjustCurrentCredits(selectedUserDetail.totalCredits || 0);
                      setCreditAdjustAmount('');
                      setCreditAdjustReason('');
                      setShowCreditAdjustModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-gold-600/20 text-gold-400 border border-gold-500/30 rounded-lg hover:bg-gold-600/30 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Adjust Credits
                  </button>
                  <button
                    onClick={() => {
                      setDeleteUserId(selectedUserDetail._id);
                      setShowDeleteUserModal(true);
                    }}
                    className="flex items-center gap-2 px-3 py-2 text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete User
                  </button>
                </div>

                {/* Info Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-neutral-500">Created: </span>
                    <span className="text-neutral-300">{formatDate(selectedUserDetail.createdAt)}</span>
                  </div>
                  <div>
                    <span className="text-neutral-500">Last Login: </span>
                    <span className="text-neutral-300">{formatDate(selectedUserDetail.lastLogin)}</span>
                  </div>
                  {selectedUserDetail.subscriptionPurchasedAt && (
                    <div>
                      <span className="text-neutral-500">Purchased: </span>
                      <span className="text-neutral-300">{formatDate(selectedUserDetail.subscriptionPurchasedAt)}</span>
                    </div>
                  )}
                  {selectedUserDetail.subscriptionExpiresAt && (
                    <div>
                      <span className="text-neutral-500">Expires: </span>
                      <span className={selectedUserDetail.isActive ? 'text-emerald-400' : 'text-red-400'}>{formatDate(selectedUserDetail.subscriptionExpiresAt)}</span>
                    </div>
                  )}
                </div>

                {/* Activity Timeline */}
                <div>
                  <h3 className="text-sm font-semibold text-white mb-3">Activity Timeline</h3>
                  {selectedUserHistory.length === 0 ? (
                    <p className="text-neutral-500 text-sm text-center py-8">No activity recorded yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedUserHistory.map((entry: any, idx: number) => (
                        <div key={idx} className="bg-neutral-800/40 rounded-lg p-3 border border-white/5 hover:border-white/10 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-start gap-2.5 min-w-0">
                              <span className={`mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0 text-[10px] ${getActionColor(entry.action)}`}>
                                {entry.action === 'purchase' ? '✓' : entry.action === 'payment_failed' ? '✗' : entry.action === 'usage' ? '▶' : entry.action === 'manual_adjustment' ? '⚡' : '•'}
                              </span>
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-xs font-semibold text-white">{getActionLabel(entry.action)}</span>
                                  {entry.planName && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-700 text-neutral-300">{entry.planName}</span>
                                  )}
                                </div>
                                {entry.reason && (
                                  <p className="text-[11px] text-neutral-400 mt-0.5 break-words">{entry.reason}</p>
                                )}
                                {entry.razorpayPaymentId && (
                                  <p className="text-[10px] text-neutral-500 font-mono mt-0.5">Pay ID: {entry.razorpayPaymentId}</p>
                                )}
                                {entry.adminEmail && (
                                  <p className="text-[10px] text-gold-500 mt-0.5">by {entry.adminEmail}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <div className="text-[10px] text-neutral-500 whitespace-nowrap">{formatDate(entry.date)}</div>
                              {entry.amount && (
                                <div className="text-xs font-semibold text-neutral-300 mt-0.5">₹{Number(entry.amount).toLocaleString('en-IN')}</div>
                              )}
                              {entry.totalCredits?.change !== undefined && entry.totalCredits.change !== 0 && (
                                <div className={`text-[10px] font-mono mt-0.5 ${entry.totalCredits.change > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {entry.totalCredits.change > 0 ? '+' : ''}{entry.totalCredits.change} credits
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Credit Adjust Modal */}
      {showCreditAdjustModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-gold-500/30 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white mb-1">Adjust Credits</h2>
              <p className="text-sm text-neutral-400">{creditAdjustEmail}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Current Credits</label>
                <div className="text-xl font-bold text-gold-400">{creditAdjustCurrentCredits.toLocaleString()}</div>
              </div>
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">
                  Adjustment (+ to add, - to subtract)
                </label>
                <input
                  type="number"
                  value={creditAdjustAmount}
                  onChange={(e) => setCreditAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-lg font-mono focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="e.g. 500 or -100"
                />
              </div>
              {creditAdjustAmount && (
                <div className="bg-neutral-800/50 rounded-lg p-3 border border-white/5">
                  <span className="text-xs text-neutral-400">New Total: </span>
                  <span className="text-lg font-bold text-white">
                    {Math.max(0, creditAdjustCurrentCredits + parseInt(creditAdjustAmount || '0')).toLocaleString()}
                  </span>
                </div>
              )}
              <div>
                <label className="block text-xs text-neutral-500 uppercase tracking-wider mb-2">Reason (optional)</label>
                <input
                  type="text"
                  value={creditAdjustReason}
                  onChange={(e) => setCreditAdjustReason(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent"
                  placeholder="e.g. Bonus credits, refund, etc."
                />
              </div>
            </div>
            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => { setShowCreditAdjustModal(false); setCreditAdjustUserId(null); }}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdjustCredits}
                disabled={adjustingCredits || !creditAdjustAmount || parseInt(creditAdjustAmount) === 0}
                className="flex-1 px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white rounded-lg transition-colors"
              >
                {adjustingCredits ? 'Adjusting...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteUserModal}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDeleteUser}
        onCancel={() => { setShowDeleteUserModal(false); setDeleteUserId(null); }}
        variant="danger"
      />

      {/* Sync Credits Preview Modal */}
      {showSyncPreview && syncPreview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-neutral-800 border-2 border-gold-500/30 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Credit Sync Preview</h2>
                  <p className="text-sm text-neutral-400">Review changes before syncing credits to users</p>
                </div>
                <button
                  onClick={() => setShowSyncPreview(false)}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-neutral-800/50 rounded-lg p-4 border border-white/10">
                  <div className="text-xs text-neutral-400 uppercase mb-1">Total Users</div>
                  <div className="text-2xl font-bold text-white">{syncPreview.totalUsers}</div>
                </div>
                <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-500/30">
                  <div className="text-xs text-emerald-400 uppercase mb-1">Will Increase</div>
                  <div className="text-2xl font-bold text-emerald-400">{syncPreview.usersWithIncrease}</div>
                </div>
                <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                  <div className="text-xs text-red-400 uppercase mb-1">Will Decrease</div>
                  <div className="text-2xl font-bold text-red-400">{syncPreview.usersWithDecrease}</div>
                </div>
              </div>

              {syncPreview.changes && syncPreview.changes.length > 0 ? (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-white mb-3">Affected Users ({syncPreview.affectedUsers})</h3>
                  <div className="max-h-96 overflow-y-auto space-y-2">
                    {syncPreview.changes.map((change: any, idx: number) => (
                      <div key={idx} className="bg-neutral-800/50 rounded-lg p-4 border border-white/10">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="text-sm font-semibold text-white mb-1">{change.email}</div>
                            <div className="text-xs text-neutral-400">Plan: {change.plan}</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-3">
                          <div>
                            <div className="text-xs text-neutral-400 mb-1">Photoshoot Credits</div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-neutral-300">{change.current.photoshoot}</span>
                              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className={`text-sm font-semibold ${change.change.photoshoot >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {change.new.photoshoot}
                              </span>
                              {change.change.photoshoot !== 0 && (
                                <span className={`text-xs ${change.change.photoshoot >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  ({change.change.photoshoot >= 0 ? '+' : ''}{change.change.photoshoot})
                                </span>
                              )}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-400 mb-1">Marketing Credits</div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-neutral-300">{change.current.marketing}</span>
                              <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className={`text-sm font-semibold ${change.change.marketing >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                {change.new.marketing}
                              </span>
                              {change.change.marketing !== 0 && (
                                <span className={`text-xs ${change.change.marketing >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  ({change.change.marketing >= 0 ? '+' : ''}{change.change.marketing})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 text-xs text-neutral-500">
                          Used: {change.used.photoshoot} photoshoot, {change.used.marketing} marketing
                        </div>
                      </div>
                    ))}
                  </div>
                  {syncPreview.affectedUsers > 50 && (
                    <div className="text-xs text-neutral-400 text-center mt-2">
                      Showing first 50 of {syncPreview.affectedUsers} affected users
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  No changes detected. All users already have correct credits.
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 flex gap-3">
              <button
                onClick={() => setShowSyncPreview(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSyncCredits}
                disabled={syncingCredits}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {syncingCredits ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Syncing...
                  </>
                ) : (
                  'Confirm & Sync Credits'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .sparkle-loader {
          display: flex;
          gap: 4px;
          align-items: center;
        }
        
        .sparkle {
          width: 4px;
          height: 4px;
          background: linear-gradient(135deg, #818cf8, #c084fc);
          border-radius: 50%;
          animation: sparkle 1.4s ease-in-out infinite;
        }
        
        .sparkle:nth-child(1) {
          animation-delay: 0s;
        }
        
        .sparkle:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .sparkle:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes sparkle {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 1;
            box-shadow: 0 0 8px rgba(129, 140, 248, 0.8);
          }
        }
      `}</style>
    </div>
  );
};
