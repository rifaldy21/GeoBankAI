/**
 * AI Error Handler Tests
 */

import { describe, it, expect } from 'vitest';
import {
  parseGeminiError,
  createFallbackResponse,
  getSuggestedAction,
  canUseFallback,
  formatAIErrorForUser,
  AIErrorCode,
} from '../errorHandler';

describe('AI Error Handler', () => {
  describe('parseGeminiError', () => {
    it('should parse network errors', () => {
      const error = new TypeError('fetch failed');
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.NETWORK_ERROR);
      expect(aiError.retryable).toBe(true);
    });

    it('should parse timeout errors', () => {
      const error = { name: 'AbortError', message: 'Timeout' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.TIMEOUT);
      expect(aiError.retryable).toBe(true);
    });

    it('should parse rate limit errors', () => {
      const error = { status: 429, message: 'Rate limit exceeded' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.RATE_LIMIT);
      expect(aiError.retryable).toBe(true);
      expect(aiError.userMessage).toContain('Too many');
    });

    it('should parse invalid API key errors', () => {
      const error = { status: 401, message: 'Invalid API key' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.INVALID_API_KEY);
      expect(aiError.retryable).toBe(false);
      expect(aiError.userMessage).toContain('configuration error');
    });

    it('should parse quota exceeded errors', () => {
      const error = { message: 'quota exceeded' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.QUOTA_EXCEEDED);
      expect(aiError.retryable).toBe(false);
    });

    it('should parse invalid request errors', () => {
      const error = { status: 400, message: 'Bad request' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.INVALID_REQUEST);
      expect(aiError.retryable).toBe(false);
      expect(aiError.fallbackAvailable).toBe(true);
    });

    it('should parse content filter errors', () => {
      const error = { message: 'Content blocked by safety filter' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.CONTENT_FILTER);
      expect(aiError.retryable).toBe(false);
      expect(aiError.fallbackAvailable).toBe(true);
    });

    it('should parse model errors', () => {
      const error = { status: 500, message: 'Internal server error' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.MODEL_ERROR);
      expect(aiError.retryable).toBe(true);
    });

    it('should parse unknown errors', () => {
      const error = { message: 'Something went wrong' };
      const aiError = parseGeminiError(error);

      expect(aiError.code).toBe(AIErrorCode.UNKNOWN);
      expect(aiError.retryable).toBe(true);
    });
  });

  describe('createFallbackResponse', () => {
    it('should create fallback response', () => {
      const query = 'Show me RM performance';
      const response = createFallbackResponse(query);

      expect(response).toContain('unable to generate');
      expect(response).toContain('Performance');
    });

    it('should include guidance', () => {
      const query = 'Test query';
      const response = createFallbackResponse(query);

      expect(response).toContain('dashboard');
      expect(response.toLowerCase()).toContain('try');
    });
  });

  describe('getSuggestedAction', () => {
    it('should suggest action for rate limit errors', () => {
      const error = parseGeminiError({ status: 429, message: 'Rate limit' });
      const action = getSuggestedAction(error);

      expect(action).toContain('Wait');
    });

    it('should suggest action for invalid API key', () => {
      const error = parseGeminiError({ status: 401, message: 'Invalid key' });
      const action = getSuggestedAction(error);

      expect(action).toContain('administrator');
    });

    it('should suggest action for timeout', () => {
      const error = parseGeminiError({ name: 'AbortError' });
      const action = getSuggestedAction(error);

      expect(action).toContain('simpler');
    });

    it('should suggest action for network error', () => {
      const error = parseGeminiError(new TypeError('fetch failed'));
      const action = getSuggestedAction(error);

      expect(action).toContain('internet connection');
    });

    it('should suggest action for invalid request', () => {
      const error = parseGeminiError({ status: 400, message: 'Bad request' });
      const action = getSuggestedAction(error);

      expect(action).toContain('Rephrase');
    });
  });

  describe('canUseFallback', () => {
    it('should allow fallback for invalid request', () => {
      const error = parseGeminiError({ status: 400, message: 'Bad request' });
      expect(canUseFallback(error)).toBe(true);
    });

    it('should allow fallback for content filter', () => {
      const error = parseGeminiError({ message: 'Content blocked' });
      expect(canUseFallback(error)).toBe(true);
    });

    it('should not allow fallback for rate limit', () => {
      const error = parseGeminiError({ status: 429, message: 'Rate limit' });
      expect(canUseFallback(error)).toBe(false);
    });

    it('should not allow fallback for invalid API key', () => {
      const error = parseGeminiError({ status: 401, message: 'Invalid key' });
      expect(canUseFallback(error)).toBe(false);
    });
  });

  describe('formatAIErrorForUser', () => {
    it('should format rate limit error', () => {
      const error = parseGeminiError({ status: 429, message: 'Rate limit' });
      const formatted = formatAIErrorForUser(error);

      expect(formatted.title).toBe('Too Many Requests');
      expect(formatted.message).toContain('Too many');
      expect(formatted.action).toContain('Wait');
    });

    it('should format invalid API key error', () => {
      const error = parseGeminiError({ status: 401, message: 'Invalid key' });
      const formatted = formatAIErrorForUser(error);

      expect(formatted.title).toBe('Configuration Error');
      expect(formatted.message).toContain('configuration');
      expect(formatted.action).toContain('administrator');
    });

    it('should format timeout error', () => {
      const error = parseGeminiError({ name: 'AbortError' });
      const formatted = formatAIErrorForUser(error);

      expect(formatted.title).toBe('Request Timeout');
      expect(formatted.message).toContain('too long');
      expect(formatted.action).toContain('simpler');
    });

    it('should format network error', () => {
      const error = parseGeminiError(new TypeError('fetch failed'));
      const formatted = formatAIErrorForUser(error);

      expect(formatted.title).toBe('Connection Error');
      expect(formatted.message).toContain('connect');
      expect(formatted.action).toContain('internet');
    });
  });
});
