export interface CachedItem {
  id: string;
  url: string; // PDF data URL or image data URL
  timestamp: number;
  studioType: 'photo' | 'marketing';
  prompt?: string;
  name?: string; // Lookbook name/title (for PDFs)
  type: 'pdf' | 'image'; // Type of cached item
}

const CACHE_KEY = 'generated_cache';
const MAX_CACHE_SIZE = 10000; // Maximum number of items to cache
const MAX_STORAGE_SIZE = 9 * 1024 * 1024; // Maximum storage size: 9MB
const WARN_LARGE_IMAGE_SIZE = 3 * 1024 * 1024; // Warn if single image > 3MB

// Check if IndexedDB is available
const USE_INDEXED_DB = typeof indexedDB !== 'undefined';

// Lazy load IndexedDB cache manager
let indexedDBCache: typeof import('./indexedDBCache') | null = null;

const getIndexedDBCache = async () => {
  if (!USE_INDEXED_DB) return null;
  if (!indexedDBCache) {
    try {
      indexedDBCache = await import('./indexedDBCache');
    } catch (error) {
      console.error('❌ Failed to load IndexedDB cache:', error);
      return null;
    }
  }
  return indexedDBCache;
};

/**
 * Add a generated lookbook PDF to cache (PhotoStudio)
 */
export const addLookbookToCache = async (
  pdfBlob: Blob | string, // Can be Blob or base64 data URL
  studioType: 'photo' | 'marketing',
  prompt?: string,
  name?: string
): Promise<void> => {
  // Try IndexedDB first (unlimited storage)
  const indexedDB = await getIndexedDBCache();
  if (indexedDB) {
    try {
      await indexedDB.addLookbookToCache(pdfBlob, studioType, prompt, name);
      return;
    } catch (error) {
      console.warn('⚠️ IndexedDB failed, falling back to localStorage:', error);
    }
  }

  // Fallback to localStorage
  return new Promise((resolve, reject) => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      const cachedItems: CachedItem[] = cached ? JSON.parse(cached) : [];
      
      // Convert Blob to base64 if needed
      if (pdfBlob instanceof Blob) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const pdfDataUrl = reader.result as string;
          const newItem: CachedItem = {
            id: `lookbook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            url: pdfDataUrl,
            timestamp: Date.now(),
            studioType,
            prompt,
            name,
            type: 'pdf',
          };

          cachedItems.unshift(newItem);
          const trimmedItems = cachedItems.slice(0, MAX_CACHE_SIZE);
          localStorage.setItem(CACHE_KEY, JSON.stringify(trimmedItems));
          console.log('✅ Lookbook PDF added to localStorage cache:', newItem.id);
          window.dispatchEvent(new Event('cacheUpdated'));
          resolve();
        };
        reader.onerror = () => reject(new Error('Failed to read PDF blob'));
        reader.readAsDataURL(pdfBlob);
      } else {
        // Already a data URL
        const newItem: CachedItem = {
          id: `lookbook_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url: pdfBlob,
          timestamp: Date.now(),
          studioType,
          prompt,
          name,
          type: 'pdf',
        };

        cachedItems.unshift(newItem);
        const trimmedItems = cachedItems.slice(0, MAX_CACHE_SIZE);
        localStorage.setItem(CACHE_KEY, JSON.stringify(trimmedItems));
        console.log('✅ Lookbook PDF added to localStorage cache:', newItem.id);
        window.dispatchEvent(new Event('cacheUpdated'));
        resolve();
      }
    } catch (error) {
      console.error('❌ Failed to add lookbook to cache:', error);
      reject(error);
    }
  });
};

/**
 * Add a generated image to cache (PhotoStudio categories)
 * Uses IndexedDB for unlimited storage, falls back to localStorage
 */
export const addToCache = async (
  url: string,
  studioType: 'photo' | 'marketing',
  prompt?: string
): Promise<void> => {
  // Try IndexedDB first (unlimited storage)
  const indexedDB = await getIndexedDBCache();
  if (indexedDB) {
    try {
      await indexedDB.addToCache(url, studioType, prompt);
      return;
    } catch (error) {
      console.warn('⚠️ IndexedDB failed, falling back to localStorage:', error);
    }
  }

  // Fallback to localStorage (limited storage)
  try {
    // Check if URL is too large (localStorage has ~5-10MB limit)
    if (url.startsWith('data:') && url.length > WARN_LARGE_IMAGE_SIZE) {
      console.warn(`⚠️ Large image detected (>${Math.round(WARN_LARGE_IMAGE_SIZE / 1024 / 1024)}MB), consider using IndexedDB for unlimited storage`);
    }
    
    const cached = localStorage.getItem(CACHE_KEY);
    const cachedItems: CachedItem[] = cached ? JSON.parse(cached) : [];
    
    const newItem: CachedItem = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      timestamp: Date.now(),
      studioType,
      prompt,
      type: 'image',
    };

    cachedItems.unshift(newItem);
    const trimmedItems = cachedItems.slice(0, MAX_CACHE_SIZE);
    
    // Try to save to localStorage
    try {
      const serialized = JSON.stringify(trimmedItems);
      const serializedSize = serialized.length;
      
      if (serializedSize > MAX_STORAGE_SIZE) {
        console.warn(`⚠️ Cache size exceeds ${Math.round(MAX_STORAGE_SIZE / 1024 / 1024)}MB (${Math.round(serializedSize / 1024 / 1024)}MB), removing oldest items...`);
        let itemsToKeep = trimmedItems;
        const targetSize = Math.floor(MAX_STORAGE_SIZE * 0.9);
        
        while (itemsToKeep.length > 1) {
          const testSerialized = JSON.stringify(itemsToKeep);
          if (testSerialized.length <= targetSize) break;
          itemsToKeep = itemsToKeep.slice(0, -1);
        }
        
        localStorage.setItem(CACHE_KEY, JSON.stringify(itemsToKeep));
        console.log(`✅ Cache trimmed to ${itemsToKeep.length} items (${Math.round(JSON.stringify(itemsToKeep).length / 1024 / 1024)}MB)`);
      } else {
        localStorage.setItem(CACHE_KEY, serialized);
        console.log('✅ Image added to localStorage cache:', newItem.id, `(Total: ${Math.round(serializedSize / 1024 / 1024)}MB, ${trimmedItems.length} items)`);
      }
    } catch (storageError: any) {
      if (storageError.name === 'QuotaExceededError' || storageError.code === 22) {
        console.warn('⚠️ localStorage quota exceeded. Consider using IndexedDB for unlimited storage.');
        let itemsToKeep = trimmedItems;
        let trimPercent = 0.2;
        
        while (itemsToKeep.length > 1) {
          itemsToKeep = trimmedItems.slice(0, Math.floor(trimmedItems.length * (1 - trimPercent)));
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify(itemsToKeep));
            console.log(`✅ Cache trimmed to ${itemsToKeep.length} items`);
            break;
          } catch (retryError) {
            trimPercent += 0.1;
            if (trimPercent >= 0.9) {
              itemsToKeep = trimmedItems.slice(0, Math.min(10, trimmedItems.length));
              try {
                localStorage.setItem(CACHE_KEY, JSON.stringify(itemsToKeep));
                console.log(`✅ Cache trimmed to ${itemsToKeep.length} items (emergency mode)`);
                break;
              } catch (finalError) {
                localStorage.removeItem(CACHE_KEY);
                console.warn('⚠️ Cache cleared due to storage limit');
                return;
              }
            }
          }
        }
      } else {
        throw storageError;
      }
    }
    
    window.dispatchEvent(new Event('cacheUpdated'));
  } catch (error) {
    console.error('❌ Failed to add image to cache:', error);
  }
};

/**
 * Get all cached items (PDFs and images)
 * Uses IndexedDB for unlimited storage, falls back to localStorage
 */
export const getCachedItems = async (): Promise<CachedItem[]> => {
  // Try IndexedDB first
  const indexedDB = await getIndexedDBCache();
  if (indexedDB) {
    try {
      return await indexedDB.getCachedItems();
    } catch (error) {
      console.warn('⚠️ IndexedDB failed, falling back to localStorage:', error);
    }
  }

  // Fallback to localStorage
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return [];
    
    const items: CachedItem[] = JSON.parse(cached);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error('❌ Failed to get cached items:', error);
    return [];
  }
};

/**
 * Get cached lookbooks (PDFs only)
 */
export const getCachedLookbooks = async (): Promise<CachedItem[]> => {
  const items = await getCachedItems();
  return items.filter(item => item.type === 'pdf');
};

/**
 * Get cached images only
 */
export const getCachedImages = async (): Promise<CachedItem[]> => {
  const items = await getCachedItems();
  return items.filter(item => item.type === 'image');
};

/**
 * Remove a specific item from cache
 */
export const removeFromCache = async (itemId: string): Promise<void> => {
  // Try IndexedDB first
  const indexedDB = await getIndexedDBCache();
  if (indexedDB) {
    try {
      await indexedDB.removeFromCache(itemId);
      return;
    } catch (error) {
      console.warn('⚠️ IndexedDB failed, falling back to localStorage:', error);
    }
  }

  // Fallback to localStorage
  try {
    const cachedItems = await getCachedItems();
    const filtered = cachedItems.filter(item => item.id !== itemId);
    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
    console.log('✅ Item removed from localStorage cache:', itemId);
    window.dispatchEvent(new Event('cacheUpdated'));
  } catch (error) {
    console.error('❌ Failed to remove item from cache:', error);
  }
};

/**
 * Clear all cached images
 */
export const clearCache = async (): Promise<void> => {
  // Try IndexedDB first
  const indexedDB = await getIndexedDBCache();
  if (indexedDB) {
    try {
      await indexedDB.clearCache();
      return;
    } catch (error) {
      console.warn('⚠️ IndexedDB failed, falling back to localStorage:', error);
    }
  }

  // Fallback to localStorage
  try {
    localStorage.removeItem(CACHE_KEY);
    console.log('✅ localStorage cache cleared');
    window.dispatchEvent(new Event('cacheUpdated'));
  } catch (error) {
    console.error('❌ Failed to clear cache:', error);
  }
};

/**
 * Get cache stats
 */
export const getCacheStats = async (): Promise<{
  totalImages: number;
  photoImages: number;
  marketingImages: number;
  oldestTimestamp: number | null;
  newestTimestamp: number | null;
  totalSize: number; // Size in bytes
  totalSizeMB: number; // Size in MB
  itemCount: number;
}> => {
  // Try IndexedDB first
  const indexedDB = await getIndexedDBCache();
  if (indexedDB) {
    try {
      return await indexedDB.getCacheStats();
    } catch (error) {
      console.warn('⚠️ IndexedDB stats failed, falling back to localStorage:', error);
    }
  }

  // Fallback to localStorage
  const allItems = await getCachedItems();
  const serialized = JSON.stringify(allItems);
  const totalSize = serialized.length;
  
  return {
    totalImages: allItems.length,
    photoImages: allItems.filter(item => item.studioType === 'photo').length,
    marketingImages: allItems.filter(item => item.studioType === 'marketing').length,
    oldestTimestamp: allItems.length > 0 ? allItems[allItems.length - 1].timestamp : null,
    newestTimestamp: allItems.length > 0 ? allItems[0].timestamp : null,
    totalSize,
    totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
    itemCount: allItems.length,
  };
};

/**
 * Clean up old items (older than specified days)
 */
export const cleanOldImages = async (days: number = 7): Promise<void> => {
  try {
    const cachedItems = await getCachedItems();
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const filtered = cachedItems.filter(item => item.timestamp > cutoffTime);
    
    // Try IndexedDB first
    const indexedDB = await getIndexedDBCache();
    if (indexedDB) {
      try {
        await indexedDB.cleanOldImages(days);
        return;
      } catch (error) {
        console.warn('⚠️ IndexedDB cleanup failed, falling back to localStorage:', error);
      }
    }

    // Fallback to localStorage
    localStorage.setItem(CACHE_KEY, JSON.stringify(filtered));
    console.log(`✅ Cleaned ${cachedItems.length - filtered.length} old items`);
  } catch (error) {
    console.error('❌ Failed to clean old items:', error);
  }
};
