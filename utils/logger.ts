/**
 * Production-safe logger utility
 * Removes console logs in production builds
 */

const isProduction = import.meta.env.PROD;
const isDevelopment = import.meta.env.DEV;

class Logger {
  log(...args: any[]) {
    if (!isProduction) {
      console.log(...args);
    }
  }

  error(...args: any[]) {
    // Always log errors, even in production (but could send to error tracking service)
    console.error(...args);
    
    // In production, you could send to error tracking service
    if (isProduction) {
      // Example: sendToErrorTracking(args);
    }
  }

  warn(...args: any[]) {
    if (!isProduction) {
      console.warn(...args);
    }
  }

  info(...args: any[]) {
    if (!isProduction) {
      console.info(...args);
    }
  }

  debug(...args: any[]) {
    if (isDevelopment) {
      console.debug(...args);
    }
  }
}

export const logger = new Logger();
