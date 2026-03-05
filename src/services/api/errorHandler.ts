/**
 * API Error Handler
 * 
 * Centralized error handling for API requests with:
 * - Timeout error handling
 * - Network error handling
 * - Server error handling
 * - Validation error handling
 * - Retry logic with exponential backoff
 * - User-friendly error messages
 */

import { APIError } from './client';

export interface ErrorHandlerConfig {
  showNotification?: boolean;
  logError?: boolean;
  retryable?: boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface DetailedAPIError extends APIError {
  validationErrors?: ValidationError[];
  timestamp: Date;
  requestId?: string;
}

/**
 * Error type classification
 */
export enum ErrorType {
  NETWORK = 'NETWORK',
  TIMEOUT = 'TIMEOUT',
  SERVER = 'SERVER',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Get error type from API error
 */
export function getErrorType(error: APIError): ErrorType {
  switch (error.code) {
    case 'NETWORK_ERROR':
      return ErrorType.NETWORK;
    
    case 'TIMEOUT':
      return ErrorType.TIMEOUT;
    
    case 'INTERNAL_SERVER_ERROR':
    case 'SERVICE_UNAVAILABLE':
      return ErrorType.SERVER;
    
    case 'BAD_REQUEST':
      return ErrorType.VALIDATION;
    
    case 'UNAUTHORIZED':
      return ErrorType.AUTHENTICATION;
    
    case 'FORBIDDEN':
      return ErrorType.AUTHORIZATION;
    
    case 'NOT_FOUND':
      return ErrorType.NOT_FOUND;
    
    case 'RATE_LIMIT_EXCEEDED':
      return ErrorType.RATE_LIMIT;
    
    default:
      return ErrorType.UNKNOWN;
  }
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: APIError): string {
  const errorType = getErrorType(error);

  switch (errorType) {
    case ErrorType.NETWORK:
      return 'Unable to connect to the server. Please check your internet connection and try again.';
    
    case ErrorType.TIMEOUT:
      return 'The request took too long to complete. Please try again or simplify your query.';
    
    case ErrorType.SERVER:
      return 'The server encountered an error. Our team has been notified. Please try again later.';
    
    case ErrorType.VALIDATION:
      return error.message || 'The data you provided is invalid. Please check your input and try again.';
    
    case ErrorType.AUTHENTICATION:
      return 'Your session has expired. Please log in again to continue.';
    
    case ErrorType.AUTHORIZATION:
      return 'You do not have permission to perform this action. Please contact your administrator.';
    
    case ErrorType.NOT_FOUND:
      return 'The requested resource could not be found. It may have been moved or deleted.';
    
    case ErrorType.RATE_LIMIT:
      return 'You have made too many requests. Please wait a moment before trying again.';
    
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
}

/**
 * Get retry delay based on error type and attempt number
 */
export function getRetryDelay(error: APIError, attempt: number): number {
  const errorType = getErrorType(error);
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds

  // No retry for non-retryable errors
  if (!error.retryable) {
    return 0;
  }

  // Exponential backoff with jitter
  let delay: number;

  switch (errorType) {
    case ErrorType.RATE_LIMIT:
      // Longer delay for rate limiting
      delay = Math.min(baseDelay * Math.pow(2, attempt) * 2, maxDelay);
      break;
    
    case ErrorType.SERVER:
    case ErrorType.TIMEOUT:
      // Standard exponential backoff
      delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      break;
    
    case ErrorType.NETWORK:
      // Shorter delay for network errors
      delay = Math.min(baseDelay * Math.pow(1.5, attempt), maxDelay);
      break;
    
    default:
      delay = baseDelay;
  }

  // Add jitter (±20%) but ensure we don't exceed maxDelay
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.min(Math.max(0, delay + jitter), maxDelay);
}

/**
 * Determine if error should be retried
 */
export function shouldRetry(error: APIError, attempt: number, maxRetries: number = 3): boolean {
  // Don't retry if max retries exceeded
  if (attempt >= maxRetries) {
    return false;
  }

  // Don't retry if error is not retryable
  if (!error.retryable) {
    return false;
  }

  const errorType = getErrorType(error);

  // Retry network, timeout, server, and rate limit errors
  return [
    ErrorType.NETWORK,
    ErrorType.TIMEOUT,
    ErrorType.SERVER,
    ErrorType.RATE_LIMIT,
  ].includes(errorType);
}

/**
 * Parse validation errors from API response
 */
export function parseValidationErrors(error: APIError): ValidationError[] {
  if (!error.details) {
    return [];
  }

  // Handle different validation error formats
  if (Array.isArray(error.details)) {
    return error.details.map((detail: any) => ({
      field: detail.field || detail.path || 'unknown',
      message: detail.message || detail.msg || 'Validation error',
      code: detail.code,
    }));
  }

  if (typeof error.details === 'object') {
    return Object.entries(error.details).map(([field, message]) => ({
      field,
      message: String(message),
    }));
  }

  return [];
}

/**
 * Create detailed error object
 */
export function createDetailedError(error: APIError): DetailedAPIError {
  const validationErrors = getErrorType(error) === ErrorType.VALIDATION
    ? parseValidationErrors(error)
    : undefined;

  return {
    ...error,
    validationErrors,
    timestamp: new Date(),
  };
}

/**
 * Log error to console (development) or monitoring service (production)
 */
export function logError(error: DetailedAPIError, context?: Record<string, any>): void {
  const errorLog = {
    ...error,
    context,
    userAgent: navigator.userAgent,
    url: window.location.href,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[API Error]', errorLog);
  } else {
    // In production, send to monitoring service
    // Example: Sentry.captureException(error, { extra: errorLog });
    console.error('[API Error]', errorLog);
  }
}

/**
 * Handle API error with retry logic
 */
export async function handleAPIError<T>(
  operation: () => Promise<T>,
  config: ErrorHandlerConfig = {}
): Promise<T> {
  const {
    showNotification = true,
    logError: shouldLog = true,
    retryable = true,
  } = config;

  const maxRetries = retryable ? 3 : 0;
  let lastError: APIError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error as APIError;
      const detailedError = createDetailedError(lastError);

      // Log error
      if (shouldLog) {
        logError(detailedError, { attempt, maxRetries });
      }

      // Check if should retry
      if (shouldRetry(lastError, attempt, maxRetries)) {
        const delay = getRetryDelay(lastError, attempt);
        
        if (process.env.NODE_ENV === 'development') {
          console.log(`[API Error] Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
        }

        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      // Show notification if enabled
      if (showNotification) {
        const message = getUserFriendlyMessage(lastError);
        // In a real app, show toast notification here
        console.warn('[User Notification]', message);
      }

      throw detailedError;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Unknown error');
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: ValidationError[]): string {
  if (errors.length === 0) {
    return 'Validation failed';
  }

  if (errors.length === 1) {
    return `${errors[0].field}: ${errors[0].message}`;
  }

  return errors
    .map(error => `• ${error.field}: ${error.message}`)
    .join('\n');
}

/**
 * Check if error is a specific type
 */
export function isErrorType(error: APIError, type: ErrorType): boolean {
  return getErrorType(error) === type;
}

/**
 * Get suggested action for error
 */
export function getSuggestedAction(error: APIError): string {
  const errorType = getErrorType(error);

  switch (errorType) {
    case ErrorType.NETWORK:
      return 'Check your internet connection and try again.';
    
    case ErrorType.TIMEOUT:
      return 'Try simplifying your request or try again later.';
    
    case ErrorType.SERVER:
      return 'Please try again in a few minutes.';
    
    case ErrorType.VALIDATION:
      return 'Please correct the highlighted fields and try again.';
    
    case ErrorType.AUTHENTICATION:
      return 'Please log in again to continue.';
    
    case ErrorType.AUTHORIZATION:
      return 'Contact your administrator for access.';
    
    case ErrorType.NOT_FOUND:
      return 'Go back and try a different action.';
    
    case ErrorType.RATE_LIMIT:
      return 'Wait a moment before trying again.';
    
    default:
      return 'Try again or contact support if the problem persists.';
  }
}

export default {
  getErrorType,
  getUserFriendlyMessage,
  getRetryDelay,
  shouldRetry,
  parseValidationErrors,
  createDetailedError,
  logError,
  handleAPIError,
  formatValidationErrors,
  isErrorType,
  getSuggestedAction,
};
