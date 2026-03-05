/**
 * API Error Handler Tests
 */

import { describe, it, expect, vi } from 'vitest';
import {
  getErrorType,
  getUserFriendlyMessage,
  getRetryDelay,
  shouldRetry,
  parseValidationErrors,
  formatValidationErrors,
  getSuggestedAction,
  ErrorType,
} from '../errorHandler';
import { APIError } from '../client';

describe('API Error Handler', () => {
  describe('getErrorType', () => {
    it('should identify network errors', () => {
      const error: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      expect(getErrorType(error)).toBe(ErrorType.NETWORK);
    });

    it('should identify timeout errors', () => {
      const error: APIError = {
        code: 'TIMEOUT',
        message: 'Request timed out',
        retryable: true,
      };

      expect(getErrorType(error)).toBe(ErrorType.TIMEOUT);
    });

    it('should identify server errors', () => {
      const error: APIError = {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error',
        status: 500,
        retryable: true,
      };

      expect(getErrorType(error)).toBe(ErrorType.SERVER);
    });

    it('should identify validation errors', () => {
      const error: APIError = {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
        status: 400,
        retryable: false,
      };

      expect(getErrorType(error)).toBe(ErrorType.VALIDATION);
    });

    it('should identify authentication errors', () => {
      const error: APIError = {
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
        status: 401,
        retryable: false,
      };

      expect(getErrorType(error)).toBe(ErrorType.AUTHENTICATION);
    });

    it('should identify rate limit errors', () => {
      const error: APIError = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        status: 429,
        retryable: true,
      };

      expect(getErrorType(error)).toBe(ErrorType.RATE_LIMIT);
    });
  });

  describe('getUserFriendlyMessage', () => {
    it('should return friendly message for network errors', () => {
      const error: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      const message = getUserFriendlyMessage(error);
      expect(message).toContain('internet connection');
    });

    it('should return friendly message for timeout errors', () => {
      const error: APIError = {
        code: 'TIMEOUT',
        message: 'Request timed out',
        retryable: true,
      };

      const message = getUserFriendlyMessage(error);
      expect(message).toContain('too long');
    });

    it('should return friendly message for server errors', () => {
      const error: APIError = {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Server error',
        status: 500,
        retryable: true,
      };

      const message = getUserFriendlyMessage(error);
      expect(message).toContain('server encountered an error');
    });
  });

  describe('getRetryDelay', () => {
    it('should return 0 for non-retryable errors', () => {
      const error: APIError = {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
        retryable: false,
      };

      expect(getRetryDelay(error, 0)).toBe(0);
    });

    it('should return exponential backoff delay for retryable errors', () => {
      const error: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      const delay1 = getRetryDelay(error, 0);
      const delay2 = getRetryDelay(error, 1);
      const delay3 = getRetryDelay(error, 2);

      expect(delay2).toBeGreaterThan(delay1);
      expect(delay3).toBeGreaterThan(delay2);
    });

    it('should cap delay at maximum', () => {
      const error: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      const delay = getRetryDelay(error, 10);
      expect(delay).toBeLessThanOrEqual(30000); // Max 30 seconds
    });

    it('should use longer delay for rate limit errors', () => {
      const rateLimitError: APIError = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        retryable: true,
      };

      const networkError: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      const rateLimitDelay = getRetryDelay(rateLimitError, 1);
      const networkDelay = getRetryDelay(networkError, 1);

      expect(rateLimitDelay).toBeGreaterThan(networkDelay);
    });
  });

  describe('shouldRetry', () => {
    it('should retry network errors', () => {
      const error: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      expect(shouldRetry(error, 0, 3)).toBe(true);
    });

    it('should retry timeout errors', () => {
      const error: APIError = {
        code: 'TIMEOUT',
        message: 'Request timed out',
        retryable: true,
      };

      expect(shouldRetry(error, 0, 3)).toBe(true);
    });

    it('should not retry validation errors', () => {
      const error: APIError = {
        code: 'BAD_REQUEST',
        message: 'Invalid input',
        retryable: false,
      };

      expect(shouldRetry(error, 0, 3)).toBe(false);
    });

    it('should not retry after max attempts', () => {
      const error: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      expect(shouldRetry(error, 3, 3)).toBe(false);
    });
  });

  describe('parseValidationErrors', () => {
    it('should parse array of validation errors', () => {
      const error: APIError = {
        code: 'BAD_REQUEST',
        message: 'Validation failed',
        retryable: false,
        details: [
          { field: 'email', message: 'Invalid email' },
          { field: 'age', message: 'Must be positive' },
        ],
      };

      const errors = parseValidationErrors(error);
      expect(errors).toHaveLength(2);
      expect(errors[0].field).toBe('email');
      expect(errors[1].field).toBe('age');
    });

    it('should parse object of validation errors', () => {
      const error: APIError = {
        code: 'BAD_REQUEST',
        message: 'Validation failed',
        retryable: false,
        details: {
          email: 'Invalid email',
          age: 'Must be positive',
        },
      };

      const errors = parseValidationErrors(error);
      expect(errors).toHaveLength(2);
    });

    it('should return empty array for no details', () => {
      const error: APIError = {
        code: 'BAD_REQUEST',
        message: 'Validation failed',
        retryable: false,
      };

      const errors = parseValidationErrors(error);
      expect(errors).toHaveLength(0);
    });
  });

  describe('formatValidationErrors', () => {
    it('should format validation errors for display', () => {
      const errors = [
        { field: 'email', message: 'Invalid email', code: 'INVALID_EMAIL' },
        { field: 'age', message: 'Must be positive', code: 'INVALID_AGE' },
      ];

      const formatted = formatValidationErrors(errors);
      expect(formatted).toContain('email');
      expect(formatted).toContain('Invalid email');
      expect(formatted).toContain('age');
      expect(formatted).toContain('Must be positive');
    });

    it('should handle single error', () => {
      const errors = [
        { field: 'email', message: 'Invalid email' },
      ];

      const formatted = formatValidationErrors(errors);
      expect(formatted).toBe('email: Invalid email');
    });

    it('should handle empty errors', () => {
      const formatted = formatValidationErrors([]);
      expect(formatted).toBe('Validation failed');
    });
  });

  describe('getSuggestedAction', () => {
    it('should suggest action for network errors', () => {
      const error: APIError = {
        code: 'NETWORK_ERROR',
        message: 'Network failed',
        retryable: true,
      };

      const action = getSuggestedAction(error);
      expect(action).toContain('internet connection');
    });

    it('should suggest action for authentication errors', () => {
      const error: APIError = {
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
        retryable: false,
      };

      const action = getSuggestedAction(error);
      expect(action).toContain('log in');
    });

    it('should suggest action for rate limit errors', () => {
      const error: APIError = {
        code: 'RATE_LIMIT_EXCEEDED',
        message: 'Too many requests',
        retryable: true,
      };

      const action = getSuggestedAction(error);
      expect(action).toContain('Wait');
    });
  });
});
