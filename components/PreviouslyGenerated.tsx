import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';
import { toast } from 'react-toastify';
import { getCachedItems, removeFromCache, clearCache, getCacheStats, type CachedItem } from '../utils/cacheManager';
import { StudioSidebar } from './StudioSidebar';

export const PreviouslyGenerated: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CachedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<CachedItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [cacheStats, setCacheStats] = useState<ReturnType<typeof getCacheStats> | null>(null);

  useEffect(() => {
    loadCachedItems();

    // Reload when page becomes visible (user navigates back)
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadCachedItems();
      }
    };

    // Reload when window gets focus (user switches back to tab)
    const handleFocus = () => {
      loadCachedItems();
    };

    // Listen for storage changes (cache updates from other tabs/components)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'generated_cache') {
        console.log('📦 Storage event detected, reloading cache...');
        loadCachedItems();
      }
    };

    // Listen for custom cache update events (same-tab updates)
    const handleCacheUpdate = () => {
      console.log('📦 Custom cache update event detected, reloading cache...');
      loadCachedItems();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cacheUpdated', handleCacheUpdate);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cacheUpdated', handleCacheUpdate);
    };
  }, []);

  const loadCachedItems = async () => {
    setLoading(true);
    try {
      const cachedItems = await getCachedItems();
      // Filter to only show images (not PDFs/lookbooks)
      const imageItems = cachedItems.filter(item => item.type === 'image');
      // Sort by timestamp (newest first)
      const sortedItems = imageItems.sort((a, b) => b.timestamp - a.timestamp);
      setItems(sortedItems);

      // Update cache stats
      try {
        const stats = await getCacheStats();
        setCacheStats(stats);

        console.log('✅ Loaded cached images:', sortedItems.length);
        console.log('📋 Items breakdown:', {
          total: sortedItems.length,
          photo: sortedItems.filter(i => i.studioType === 'photo').length,
          marketing: sortedItems.filter(i => i.studioType === 'marketing').length,
          size: `${stats.totalSizeMB}MB`,
        });
      } catch (statsError) {
        console.warn('⚠️ Failed to load cache stats (non-critical):', statsError);
        // Don't show error for stats failure, just log it
      }
    } catch (error) {
      console.error('❌ Failed to load cached items:', error);
      // Only show error if it's a critical failure (no items at all)
      // If items exist but stats failed, don't show error
      if (items.length === 0) {
        toast.error('Failed to load images. Please try refreshing.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (item: CachedItem) => {
    try {
      // Image download
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${item.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Image downloaded successfully!');
    } catch (error) {
      console.error('Download failed:', error);
      toast.error('Failed to download');
    }
  };

  const handleDelete = (itemId: string) => {
    setItemToDelete(itemId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await removeFromCache(itemToDelete);
      const updatedItems = items.filter(item => item.id !== itemToDelete);
      setItems(updatedItems);
      setSelectedItem(null);
      setShowDeleteConfirm(false);
      setItemToDelete(null);
      toast.success('Image removed from cache');
      // Reload stats
      const stats = await getCacheStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Failed to delete item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleClearAll = () => {
    setShowClearAllConfirm(true);
  };

  const confirmClearAll = async () => {
    try {
      await clearCache();
      setItems([]);
      setShowClearAllConfirm(false);
      setCacheStats(null);
      toast.success('All cached images cleared');
    } catch (error) {
      console.error('Failed to clear items:', error);
      toast.error('Failed to clear images');
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex w-full bg-black text-white" style={{ minHeight: 'calc(100vh - 56px)' }}>
      {/* Background */}
      <div className="fixed inset-0 z-[-1]">
        <div className="absolute inset-0 bg-gradient-to-b from-gold-950/20 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(230,183,30,0.08),transparent_50%)]"></div>
      </div>

      <StudioSidebar
        activeStudio={null}
        currentStep={-1}
        onSelectStudio={() => { }}
        onJumpToStep={() => { }}
        onExit={() => navigate('/studio')}
      />

      <main className="flex-1 min-w-0 overflow-x-hidden pt-8 px-4 sm:px-6 lg:px-14 pb-20">
        {/* Header */}
        <div className="mb-8">

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">Previously Generated</h1>
              <p className="text-neutral-400 text-sm">
                Your cached images from this session
              </p>
              {cacheStats && (
                <div className="mt-2 flex items-center gap-4 text-xs text-neutral-500">
                  <span>{cacheStats.itemCount} items</span>
                  <span>•</span>
                  <span>{cacheStats.totalSizeMB}MB used</span>
                  <span>•</span>
                  <span>{cacheStats.photoImages} photo</span>
                  <span>•</span>
                  <span>{cacheStats.marketingImages} marketing</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadCachedItems}
                className="px-4 py-2 bg-gold-500/20 hover:bg-gold-500/30 border border-gold-500/50 rounded-lg text-gold-300 text-sm font-medium transition-colors flex items-center gap-2"
                title="Refresh cache"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              {items.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 rounded-lg text-red-300 text-sm font-medium transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Important Note */}
        <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <h3 className="font-semibold text-amber-300 mb-1">Session Cache Notice</h3>
              <p className="text-sm text-amber-200/80">
                These images are stored locally in your browser cache. They will be automatically deleted when your session expires or if you clear your browser data. Please download any images you want to keep permanently.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gold-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-neutral-400">Loading images...</p>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <svg className="w-20 h-20 text-neutral-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No Images Yet</h3>
            <p className="text-neutral-400 text-sm mb-6">Generate images to see them here!</p>
            <button
              onClick={() => navigate('/studio')}
              className="px-6 py-3 bg-gold-600 hover:bg-gold-500 rounded-lg font-semibold transition-colors"
            >
              Go to Studio
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="group relative bg-neutral-900/50 border border-white/10 rounded-xl overflow-hidden hover:border-gold-500/50 transition-all duration-300 cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square relative overflow-hidden bg-neutral-800">
                  {/* Image Preview */}
                  <img
                    src={item.url}
                    alt="Generated image"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(item);
                        }}
                        className="w-full px-4 py-2 bg-gold-600 hover:bg-gold-500 rounded-lg text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.studioType === 'photo'
                      ? 'bg-gold-500/20 text-gold-300'
                      : 'bg-amber-500/20 text-amber-300'
                      }`}>
                      {item.studioType === 'photo' ? 'Photo Studio' : 'Marketing Studio'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.id);
                      }}
                      className="p-1.5 hover:bg-red-500/20 rounded-lg transition-colors"
                      title="Remove from cache"
                    >
                      <svg className="w-4 h-4 text-neutral-400 hover:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <p className="text-xs text-neutral-500">{formatDate(item.timestamp)}</p>
                  {item.prompt && (
                    <p className="text-xs text-neutral-400 mt-2 line-clamp-2">{item.prompt}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Preview Modal - Blurred Overlay (Navbar Hidden) - Scrollable */}
      {selectedItem && (
        <>
          <style>{`
            .modal-scrollable::-webkit-scrollbar {
              display: none;
            }
            .modal-scrollable {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[99999] overflow-y-auto modal-scrollable"
            onClick={() => setSelectedItem(null)}
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
          >
            {/* Close Button - Fixed Top Right (Responsive & Always Visible) */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedItem(null);
              }}
              className="fixed top-4 right-4 sm:top-6 sm:right-6 p-3 sm:p-3.5 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full text-black transition-all duration-200 hover:scale-110 active:scale-95 z-[100000] shadow-2xl border-2 border-white/50 flex items-center justify-center"
              style={{
                minWidth: '44px',
                minHeight: '44px',
                width: '44px',
                height: '44px',
              }}
              title="Close"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Content Container - Responsive with proper spacing for close button */}
            <div className="flex flex-col items-center justify-center min-h-screen pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6">
              <div
                className="relative max-w-6xl w-full flex flex-col items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Image Viewer */}
                <div className="w-full mb-4 sm:mb-6 rounded-xl overflow-hidden shadow-2xl">
                  <img
                    src={selectedItem.url}
                    alt="Preview"
                    className="w-full h-auto max-h-[90vh] sm:max-h-[93vh] object-contain"
                  />
                </div>

                {/* Action Buttons (Responsive) */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md mb-6 sm:mb-8">
                  <button
                    onClick={() => handleDownload(selectedItem)}
                    className="flex-1 px-4 sm:px-5 py-3 sm:py-2.5 bg-gold-600 hover:bg-gold-700 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      handleDelete(selectedItem.id);
                    }}
                    className="px-4 sm:px-5 py-3 sm:py-2.5 bg-red-500 hover:bg-red-600 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base min-h-[44px]"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="px-4 sm:px-5 py-3 sm:py-2.5 bg-neutral-600 hover:bg-neutral-700 rounded-lg text-white font-semibold transition-colors flex items-center justify-center gap-2 shadow-lg text-sm sm:text-base min-h-[44px]"
                    title="Close"
                    aria-label="Close modal"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Delete Image?</h3>
                <p className="text-neutral-400 text-sm mt-1">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setItemToDelete(null);
                }}
                className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-red-500/20 rounded-full">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Clear All Items?</h3>
                <p className="text-neutral-400 text-sm mt-1">All {items.length} cached items will be deleted.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearAllConfirm(false)}
                className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 rounded-xl text-white font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-white font-semibold transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
