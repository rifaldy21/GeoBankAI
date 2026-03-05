/**
 * Unit tests for API Client
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { APIClient, TIMEOUT_CONFIG } from '../client';

// Mock fetch globally
global.fetch = vi.fn();

describe('APIClient', () => {
  let client: APIClient;

  beforeEach(() => {
    client = new APIClient('/api');
    vi.clearAllMocks();
  });

  describe('Constructor and Configuration', () => {
    it('should create client with default base URL', () => {
      const defaultClient = new APIClient();
      expect(defaultClient).toBeDefined();
    });

    it('should create client with custom base URL', () => {
      const customClient = new APIClient('/custom-api');
      expect(customClient).toBeDefined();
    });

    it('should set and get auth token', () => {
      const token = 'test-token-123';
      client.setAuthToken(token);
      expect(client.getAuthToken()).toBe(token);
    });

    it('should clear auth token when set to null', () => {
      client.setAuthToken('test-token');
      client.setAuthToken(null);
      expect(client.getAuthToken()).toBeNull();
    });
  });

  describe('GET Requests', () => {
    it('should make successful GET request', async () => {
      const mockData = { id: 1, name: 'Test' };
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData,
      });

      const result = await client.get('/test');
      
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
        })
      );
      expect(result).toEqual(mockData);
    });

    it('should include auth token in headers when set', async () => {
      const token = 'test-token-123';
      client.setAuthToken(token);

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.get('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': `Bearer ${token}`,
          }),
        })
      );
    });

    it('should include query parameters in URL', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.get('/test', {
        params: { page: 1, limit: 10, filter: 'active' },
      });

      const callUrl = (global.fetch as any).mock.calls[0][0];
      expect(callUrl).toContain('page=1');
      expect(callUrl).toContain('limit=10');
      expect(callUrl).toContain('filter=active');
    });

    it('should handle custom headers', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.get('/test', {
        headers: { 'X-Custom-Header': 'custom-value' },
      });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value',
          }),
        })
      );
    });
  });

  describe('POST Requests', () => {
    it('should make successful POST request with data', async () => {
      const requestData = { name: 'Test', value: 123 };
      const responseData = { id: 1, ...requestData };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 201,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => responseData,
      });

      const result = await client.post('/test', requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test'),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(responseData);
    });

    it('should handle POST request without data', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.post('/test');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: undefined,
        })
      );
    });
  });

  describe('PUT Requests', () => {
    it('should make successful PUT request', async () => {
      const requestData = { id: 1, name: 'Updated' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => requestData,
      });

      const result = await client.put('/test/1', requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test/1'),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(requestData);
    });
  });

  describe('DELETE Requests', () => {
    it('should make successful DELETE request', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 204,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.delete('/test/1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test/1'),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('PATCH Requests', () => {
    it('should make successful PATCH request', async () => {
      const requestData = { name: 'Patched' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => requestData,
      });

      const result = await client.patch('/test/1', requestData);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/test/1'),
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(requestData);
    });
  });

  describe('Timeout Configuration', () => {
    it('should have correct default timeout configurations', () => {
      expect(TIMEOUT_CONFIG.data).toBe(30000);
      expect(TIMEOUT_CONFIG.ai).toBe(60000);
      expect(TIMEOUT_CONFIG.upload).toBe(120000);
    });

    it('should accept custom timeout configuration', async () => {
      const customTimeout = 5000;

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.get('/test', { timeout: customTimeout });

      // Verify fetch was called (timeout is handled internally)
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  describe('Interceptors', () => {
    it('should apply request interceptors', async () => {
      const interceptor = vi.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-Intercepted': 'true' },
      }));

      client.addRequestInterceptor(interceptor);

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.get('/test');

      expect(interceptor).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Intercepted': 'true',
          }),
        })
      );
    });

    it('should apply response interceptors', async () => {
      const mockData = { id: 1, name: 'Test' };
      const interceptor = vi.fn((response) => ({
        ...response,
        intercepted: true,
      }));

      client.addResponseInterceptor(interceptor);

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData,
      });

      const result = await client.get('/test');

      expect(interceptor).toHaveBeenCalledWith(mockData);
      expect(result).toHaveProperty('intercepted', true);
    });

    it('should apply multiple interceptors in order', async () => {
      const interceptor1 = vi.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-First': '1' },
      }));

      const interceptor2 = vi.fn((config) => ({
        ...config,
        headers: { ...config.headers, 'X-Second': '2' },
      }));

      client.addRequestInterceptor(interceptor1);
      client.addRequestInterceptor(interceptor2);

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      });

      await client.get('/test');

      expect(interceptor1).toHaveBeenCalled();
      expect(interceptor2).toHaveBeenCalled();
      expect(global.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-First': '1',
            'X-Second': '2',
          }),
        })
      );
    });
  });

  describe('Response Content Types', () => {
    it('should handle JSON responses', async () => {
      const mockData = { id: 1, name: 'Test' };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => mockData,
      });

      const result = await client.get('/test');
      expect(result).toEqual(mockData);
    });

    it('should handle text responses', async () => {
      const mockText = 'Plain text response';

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'text/plain' }),
        text: async () => mockText,
      });

      const result = await client.get('/test');
      expect(result).toBe(mockText);
    });
  });
});
