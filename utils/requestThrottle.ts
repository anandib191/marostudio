/**
 * Request throttling utility
 * Prevents excessive API calls by debouncing/throttling requests
 */

interface ThrottleOptions {
  delay?: number; // Minimum time between requests (ms)
  maxRequests?: number; // Max requests per window
  windowMs?: number; // Time window (ms)
}

class RequestThrottle {
  private requestTimestamps: Map<string, number[]> = new Map();
  
  /**
   * Check if request should be throttled
   */
  shouldThrottle(key: string, options: ThrottleOptions = {}): boolean {
    const {
      delay = 1000, // Default 1 second between requests
      maxRequests = 10,
      windowMs = 60000, // Default 1 minute window
    } = options;
    
    const now = Date.now();
    const timestamps = this.requestTimestamps.get(key) || [];
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(ts => now - ts < windowMs);
    
    // Check if we've exceeded max requests
    if (validTimestamps.length >= maxRequests) {
      return true;
    }
    
    // Check if last request was too recent
    if (validTimestamps.length > 0) {
      const lastRequest = validTimestamps[validTimestamps.length - 1];
      if (now - lastRequest < delay) {
        return true;
      }
    }
    
    // Add current timestamp
    validTimestamps.push(now);
    this.requestTimestamps.set(key, validTimestamps);
    
    return false;
  }
  
  /**
   * Clear throttling for a key
   */
  clear(key: string): void {
    this.requestTimestamps.delete(key);
  }
  
  /**
   * Clear all throttling
   */
  clearAll(): void {
    this.requestTimestamps.clear();
  }
}

export const requestThrottle = new RequestThrottle();

/**
 * Throttled fetch wrapper
 */
export const throttledFetch = async (
  url: string,
  options: RequestInit = {},
  throttleKey?: string
): Promise<Response> => {
  const key = throttleKey || url;
  
  // Check if request should be throttled
  if (requestThrottle.shouldThrottle(key, {
    delay: 500, // 500ms minimum between same requests
    maxRequests: 20, // Max 20 requests per minute
    windowMs: 60000, // 1 minute window
  })) {
    throw new Error('Request throttled. Please wait a moment before trying again.');
  }
  
  return fetch(url, options);
};
