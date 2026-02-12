/**
 * IndexedDB-based cache manager for unlimited storage
 * Migrates from localStorage automatically
 */

export interface CachedItem {
  id: string;
  url: string; // Image data URL only
  timestamp: number;
  studioType: 'photo' | 'marketing';
  prompt?: string;
  type: 'image'; // Type of cached item - only images
}

const DB_NAME = 'nextgen_cache_db';
const DB_VERSION = 1;
const STORE_NAME = 'cached_items';
const INDEX_NAME = 'timestamp';

let dbInstance: IDBDatabase | null = null;

/**
 * Initialize IndexedDB database
 */
const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (dbInstance) {
      resolve(dbInstance);
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('❌ IndexedDB open failed:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      console.log('✅ IndexedDB opened successfully');
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      
      // Create object store if it doesn't exist
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        // Create index for timestamp (for sorting)
        objectStore.createIndex(INDEX_NAME, 'timestamp', { unique: false });
        console.log('✅ IndexedDB object store created');
      }
    };
  });
};

/**
 * Migrate data from localStorage to IndexedDB
 */
const migrateFromLocalStorage = async (): Promise<void> => {
  try {
    const CACHE_KEY = 'generated_cache';
    const cached = localStorage.getItem(CACHE_KEY);
    
    if (!cached) {
      console.log('📦 No localStorage data to migrate');
      return;
    }

    const items: CachedItem[] = JSON.parse(cached);
    if (!Array.isArray(items) || items.length === 0) {
      console.log('📦 No items to migrate');
      return;
    }

    console.log(`🔄 Migrating ${items.length} items from localStorage to IndexedDB...`);
    
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    // Check if items already exist
    const existingCount = await new Promise<number>((resolve) => {
      const countRequest = store.count();
      countRequest.onsuccess = () => resolve(countRequest.result);
      countRequest.onerror = () => resolve(0);
    });

    if (existingCount > 0) {
      console.log(`📦 IndexedDB already has ${existingCount} items, skipping migration`);
      return;
    }

    // Add all items to IndexedDB
    const addPromises = items.map((item) => {
      return new Promise<void>((resolve, reject) => {
        const request = store.add(item);
        request.onsuccess = () => resolve();
        request.onerror = () => {
          // If item already exists, try put instead
          const putRequest = store.put(item);
          putRequest.onsuccess = () => resolve();
          putRequest.onerror = () => reject(putRequest.error);
        };
      });
    });

    await Promise.all(addPromises);
    console.log(`✅ Migrated ${items.length} items to IndexedDB`);
    
    // Optionally clear localStorage after migration
    // localStorage.removeItem(CACHE_KEY);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    // Don't throw - continue with IndexedDB even if migration fails
  }
};

/**
 * Add a generated image to cache (PhotoStudio categories)
 */
export const addToCache = async (
  url: string,
  studioType: 'photo' | 'marketing',
  prompt?: string
): Promise<void> => {
  try {
    await migrateFromLocalStorage(); // Ensure migration on first use
    
    const db = await initDB();
    
    const newItem: CachedItem = {
      id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      timestamp: Date.now(),
      studioType,
      prompt,
      type: 'image',
    };

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.add(newItem);
      request.onsuccess = () => {
        console.log('✅ Image added to IndexedDB cache:', newItem.id);
        window.dispatchEvent(new Event('cacheUpdated'));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('❌ Failed to add image to IndexedDB cache:', error);
    throw error;
  }
};

/**
 * Get all cached items (PDFs and images)
 */
export const getCachedItems = async (): Promise<CachedItem[]> => {
  try {
    await migrateFromLocalStorage(); // Ensure migration on first use
    
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index(INDEX_NAME);

    return new Promise<CachedItem[]>((resolve, reject) => {
      const request = index.getAll();
      
      request.onsuccess = () => {
        const items: CachedItem[] = request.result || [];
        // Sort by timestamp (newest first)
        items.sort((a, b) => b.timestamp - a.timestamp);
        resolve(items);
      };
      
      request.onerror = () => {
        console.error('❌ Failed to get cached items from IndexedDB:', request.error);
        reject(request.error);
      };
    });
  } catch (error) {
    console.error('❌ Failed to get cached items:', error);
    return [];
  }
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
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.delete(itemId);
      request.onsuccess = () => {
        console.log('✅ Item removed from IndexedDB cache:', itemId);
        window.dispatchEvent(new Event('cacheUpdated'));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('❌ Failed to remove item from IndexedDB cache:', error);
    throw error;
  }
};

/**
 * Clear all cached images
 */
export const clearCache = async (): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    await new Promise<void>((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => {
        console.log('✅ IndexedDB cache cleared');
        window.dispatchEvent(new Event('cacheUpdated'));
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('❌ Failed to clear IndexedDB cache:', error);
    throw error;
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
  totalSize: number;
  totalSizeMB: number;
  itemCount: number;
}> => {
  try {
    const items = await getCachedItems();
    const serialized = JSON.stringify(items);
    const totalSize = serialized.length;
    
    return {
      totalImages: items.length,
      photoImages: items.filter(item => item.studioType === 'photo').length,
      marketingImages: items.filter(item => item.studioType === 'marketing').length,
      oldestTimestamp: items.length > 0 ? items[items.length - 1].timestamp : null,
      newestTimestamp: items.length > 0 ? items[0].timestamp : null,
      totalSize,
      totalSizeMB: Math.round(totalSize / 1024 / 1024 * 100) / 100,
      itemCount: items.length,
    };
  } catch (error) {
    console.error('❌ Failed to get cache stats:', error);
    return {
      totalImages: 0,
      photoImages: 0,
      marketingImages: 0,
      oldestTimestamp: null,
      newestTimestamp: null,
      totalSize: 0,
      totalSizeMB: 0,
      itemCount: 0,
    };
  }
};

/**
 * Clean up old items (older than specified days)
 */
export const cleanOldImages = async (days: number = 7): Promise<void> => {
  try {
    const db = await initDB();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index(INDEX_NAME);
    
    const cutoffTime = Date.now() - (days * 24 * 60 * 60 * 1000);
    
    const items = await getCachedItems();
    const itemsToDelete = items.filter(item => item.timestamp < cutoffTime);
    
    if (itemsToDelete.length === 0) {
      console.log('✅ No old items to clean');
      return;
    }

    const deletePromises = itemsToDelete.map(item => {
      return new Promise<void>((resolve, reject) => {
        const request = store.delete(item.id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      });
    });

    await Promise.all(deletePromises);
    console.log(`✅ Cleaned ${itemsToDelete.length} old items from IndexedDB`);
    window.dispatchEvent(new Event('cacheUpdated'));
  } catch (error) {
    console.error('❌ Failed to clean old items:', error);
    throw error;
  }
};

/**
 * Get estimated storage quota
 */
export const getStorageQuota = async (): Promise<{
  usage: number;
  quota: number;
  usageMB: number;
  quotaMB: number;
  percentage: number;
}> => {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage || 0,
        quota: estimate.quota || 0,
        usageMB: Math.round((estimate.usage || 0) / 1024 / 1024 * 100) / 100,
        quotaMB: Math.round((estimate.quota || 0) / 1024 / 1024 * 100) / 100,
        percentage: estimate.quota ? Math.round(((estimate.usage || 0) / estimate.quota) * 100) : 0,
      };
    }
    return {
      usage: 0,
      quota: 0,
      usageMB: 0,
      quotaMB: 0,
      percentage: 0,
    };
  } catch (error) {
    console.error('❌ Failed to get storage quota:', error);
    return {
      usage: 0,
      quota: 0,
      usageMB: 0,
      quotaMB: 0,
      percentage: 0,
    };
  }
};
