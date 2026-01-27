/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per IP
 * Admin users completely skip rate limiting (real-world solution)
 */

// Simple in-memory rate limiter (for production, consider Redis-based solution)
const requestCounts = new Map();

/**
 * Check if request has valid authentication token
 */
const isAuthenticated = (req) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      // Basic token validation (just check if it exists and has format)
      // Full validation happens in protect middleware
      if (token && token.length > 20) {
        return true;
      }
    }
    return false;
  } catch {
    return false;
  }
};

const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100, skipAuthenticated = true) => {
  return (req, res, next) => {
    // Skip rate limiting for admin users completely (real-world solution)
    if (req.user && req.user.role === 'admin') {
      return next();
    }
    
    // Skip rate limiting for authenticated users if enabled
    if (skipAuthenticated && isAuthenticated(req)) {
      return next();
    }
    
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries periodically
    if (requestCounts.size > 10000) {
      for (const [key, value] of requestCounts.entries()) {
        if (now - value.resetTime > windowMs) {
          requestCounts.delete(key);
        }
      }
    }

    const record = requestCounts.get(ip);
    
    if (!record) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (now > record.resetTime) {
      requestCounts.set(ip, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000 / 60); // minutes
      return res.status(429).json({
        success: false,
        message: `Rate limit exceeded. Please wait ${remainingTime} minute${remainingTime !== 1 ? 's' : ''} before trying again.`,
        errorType: 'RATE_LIMIT',
        retryAfter: Math.ceil((record.resetTime - now) / 1000), // seconds
      });
    }

    record.count++;
    next();
  };
};

// Email-based rate limiter for OTP (more user-friendly with progressive delays)
const emailRateLimiter = (windowMs = 10 * 60 * 1000, maxRequests = 10, isSignup = false) => {
  const emailRequestCounts = new Map();
  
  return (req, res, next) => {
    const email = req.body?.email?.toLowerCase()?.trim();
    const is_signup = req.body?.is_signup || false;
    const now = Date.now();
    
    // If no email in request body, fall back to IP-based limiting
    if (!email) {
      return rateLimiter(windowMs, maxRequests)(req, res, next);
    }
    
    // Clean up old entries periodically
    if (emailRequestCounts.size > 10000) {
      for (const [key, value] of emailRequestCounts.entries()) {
        if (now - value.resetTime > windowMs) {
          emailRequestCounts.delete(key);
        }
      }
    }

    const record = emailRequestCounts.get(email);
    
    if (!record) {
      emailRequestCounts.set(email, {
        count: 1,
        resetTime: now + windowMs,
        lastRequestTime: now,
      });
      return next();
    }

    if (now > record.resetTime) {
      emailRequestCounts.set(email, {
        count: 1,
        resetTime: now + windowMs,
        lastRequestTime: now,
      });
      return next();
    }

    // Progressive delay: Wait at least 30 seconds between requests (for signup: 20 seconds)
    const minDelay = is_signup ? 20000 : 30000; // 20s for signup, 30s for login
    const timeSinceLastRequest = now - record.lastRequestTime;
    
    if (timeSinceLastRequest < minDelay) {
      const waitSeconds = Math.ceil((minDelay - timeSinceLastRequest) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSeconds} second${waitSeconds !== 1 ? 's' : ''} before requesting a new code.`,
        errorType: 'RATE_LIMIT',
        retryAfter: waitSeconds,
        canRetry: true,
      });
    }

    if (record.count >= maxRequests) {
      const remainingTime = Math.ceil((record.resetTime - now) / 1000);
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      
      let message = 'You\'ve reached the maximum number of OTP requests. ';
      if (minutes > 0) {
        message += `Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''}.`;
      } else {
        message += `Please try again in ${seconds} second${seconds !== 1 ? 's' : ''}.`;
      }
      
      return res.status(429).json({
        success: false,
        message,
        errorType: 'RATE_LIMIT',
        retryAfter: remainingTime,
        canRetry: false,
      });
    }

    record.count++;
    record.lastRequestTime = now;
    next();
  };
};

// Different rate limits for different routes
// Authenticated users skip rate limiting (trusted users)
export const generalLimiter = rateLimiter(15 * 60 * 1000, 200, true); // 200 requests per 15 minutes (authenticated users skip)
export const authLimiter = rateLimiter(15 * 60 * 1000, 50, false); // 50 requests per 15 minutes for auth (public routes, no skip)
// Separate limiters for signup (more lenient) and login
export const otpLimiter = (req, res, next) => {
  // Check if this is a signup request
  const isSignup = req.body?.is_signup === true;
  
  if (isSignup) {
    // Signup: 15 requests per 15 minutes, 20 second minimum delay
    return emailRateLimiter(15 * 60 * 1000, 15, true)(req, res, next);
  } else {
    // Login: 10 requests per 10 minutes, 30 second minimum delay
    return emailRateLimiter(10 * 60 * 1000, 10, false)(req, res, next);
  }
};
export const adminLimiter = rateLimiter(15 * 60 * 1000, 5000, true); // 5000 requests per 15 minutes for admin (authenticated users skip)
export const creditsLimiter = rateLimiter(15 * 60 * 1000, 5000, true); // 5000 requests per 15 minutes (authenticated users skip - for frequent polling)

// Admin GET requests limiter (more lenient for dashboard data fetching)
export const adminGetLimiter = rateLimiter(15 * 60 * 1000, 10000, true); // 10000 GET requests per 15 minutes (authenticated users skip)
