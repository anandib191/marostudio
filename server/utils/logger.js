/**
 * Production-ready logger utility
 * Logs to console in development, can be extended to log to external services in production
 */

const isDevelopment = process.env.NODE_ENV === 'development';

const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
    // In production, you could send to logging service
    // Example: sendToLoggingService('info', message, args);
  },

  error: (message, error, ...args) => {
    const errorMessage = error instanceof Error ? error.message : error;
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    if (isDevelopment) {
      console.error(`[ERROR] ${message}`, errorMessage, errorStack, ...args);
    } else {
      // In production, log to external service
      console.error(`[ERROR] ${message}`, errorMessage);
      // Example: sendToErrorTrackingService(message, error, args);
    }
  },

  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
    // In production, you could send to logging service
  },

  debug: (message, ...args) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
    // Never log debug in production
  },
};

export default logger;
