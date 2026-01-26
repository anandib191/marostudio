/**
 * Rate limiting middleware
 * Prevents abuse by limiting requests per IP
 */

// Simple in-memory rate limiter (for production, consider Redis-based solution)
const requestCounts = new Map();

const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
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
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    }

    record.count++;
    next();
  };
};

// Email-based rate limiter for OTP (more user-friendly)
const emailRateLimiter = (windowMs = 10 * 60 * 1000, maxRequests = 10) => {
  const emailRequestCounts = new Map();
  
  return (req, res, next) => {
    const email = req.body?.email?.toLowerCase()?.trim();
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
      });
      return next();
    }

    if (now > record.resetTime) {
      emailRequestCounts.set(email, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many OTP requests for this email. Please wait a few minutes before requesting again.',
      });
    }

    record.count++;
    next();
  };
};

// Different rate limits for different routes
export const generalLimiter = rateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes
export const authLimiter = rateLimiter(15 * 60 * 1000, 10); // 10 requests per 15 minutes for auth
export const otpLimiter = emailRateLimiter(10 * 60 * 1000, 10); // 10 OTP requests per email per 10 minutes (more reasonable)
export const adminLimiter = rateLimiter(15 * 60 * 1000, 50); // 50 requests per 15 minutes for admin
