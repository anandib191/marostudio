/**
 * Professional error handling utilities
 * Provides consistent error messages across the application
 */

export interface ApiError {
  success: false;
  message: string;
  errorType?: string;
  retryAfter?: number;
}

/**
 * Handle API errors professionally
 */
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred'): string => {
  // Network errors
  if (error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
    return 'Unable to connect to the server. Please check your internet connection and try again.';
  }

  // Rate limit errors (429)
  if (error.status === 429 || error.errorType === 'RATE_LIMIT') {
    const retryAfter = error.retryAfter;
    if (retryAfter) {
      const minutes = Math.ceil(retryAfter / 60);
      const seconds = retryAfter % 60;
      if (minutes > 0) {
        return `Rate limit exceeded. Please wait ${minutes} minute${minutes !== 1 ? 's' : ''}${seconds > 0 ? ` and ${seconds} second${seconds !== 1 ? 's' : ''}` : ''} before trying again.`;
      }
      return `Rate limit exceeded. Please wait ${seconds} second${seconds !== 1 ? 's' : ''} before trying again.`;
    }
    return error.message || 'Too many requests. Please wait a moment before trying again.';
  }

  // Server errors (500+)
  if (error.status >= 500) {
    return 'Server error. Our team has been notified. Please try again in a few moments.';
  }

  // Client errors (400-499)
  if (error.status >= 400 && error.status < 500) {
    return error.message || 'Invalid request. Please check your input and try again.';
  }

  // Default error message
  return error.message || defaultMessage;
};

/**
 * Extract error from fetch response
 */
export const extractErrorFromResponse = async (response: Response): Promise<ApiError> => {
  try {
    const data = await response.json();
    return {
      success: false,
      message: data.message || `Error: ${response.status} ${response.statusText}`,
      errorType: data.errorType,
      retryAfter: data.retryAfter,
    };
  } catch {
    return {
      success: false,
      message: `Error: ${response.status} ${response.statusText}`,
    };
  }
};

/**
 * Check if error is rate limit error
 */
export const isRateLimitError = (error: any): boolean => {
  return error.status === 429 || error.errorType === 'RATE_LIMIT';
};
