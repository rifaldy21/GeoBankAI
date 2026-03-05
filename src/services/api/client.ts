/**
 * API Client for BRI Intelligence Dashboard
 * 
 * Provides a centralized HTTP client with:
 * - Request/response interceptors for authentication
 * - Comprehensive error handling with retry logic
 * - Configurable timeouts for different request types
 * - Request/response logging for debugging
 */

// Request configuration interface
export interface RequestConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  headers?: Record<string, string>;
  params?: Record<string, any>;
}

// API error interface
export interface APIError {
  code: string;
  message: string;
  status?: number;
  details?: any;
  retryable: boolean;
}

// Request types for timeout configuration
export type RequestType = 'data' | 'ai' | 'upload';

// Default timeout configurations (in milliseconds)
const TIMEOUT_CONFIG: Record<RequestType, number> = {
  data: 30000,  // 30 seconds for data requests
  ai: 60000,    // 60 seconds for AI requests
  upload: 120000, // 120 seconds for file uploads
};

// Default retry configuration
const DEFAULT_RETRIES = 3;
const DEFAULT_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 10000; // 10 seconds

/**
 * APIClient class
 * 
 * Handles all HTTP requests with authentication, error handling, and retry logic
 */
export class APIClient {
  private baseURL: string;
  private authToken: string | null = null;
  private requestInterceptors: Array<(config: RequestConfig) => RequestConfig> = [];
  private responseInterceptors: Array<(response: any) => any> = [];

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string | null): void {
    this.authToken = token;
  }

  /**
   * Get authentication token
   */
  getAuthToken(): string | null {
    return this.authToken;
  }

  /**
   * Add request interceptor
   */
  addRequestInterceptor(interceptor: (config: RequestConfig) => RequestConfig): void {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * Add response interceptor
   */
  addResponseInterceptor(interceptor: (response: any) => any): void {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * Apply request interceptors
   */
  private applyRequestInterceptors(config: RequestConfig): RequestConfig {
    let modifiedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      modifiedConfig = interceptor(modifiedConfig);
    }
    
    return modifiedConfig;
  }

  /**
   * Apply response interceptors
   */
  private applyResponseInterceptors(response: any): any {
    let modifiedResponse = response;
    
    for (const interceptor of this.responseInterceptors) {
      modifiedResponse = interceptor(modifiedResponse);
    }
    
    return modifiedResponse;
  }

  /**
   * Build full URL with query parameters
   */
  private buildURL(endpoint: string, params?: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`, window.location.origin);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    
    return url.toString();
  }

  /**
   * Build request headers
   */
  private buildHeaders(customHeaders?: Record<string, string>): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    };

    // Add authentication token if available
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }

    return headers;
  }

  /**
   * Calculate exponential backoff delay
   */
  private calculateBackoffDelay(attempt: number, baseDelay: number): number {
    const delay = baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 1000; // Add jitter to prevent thundering herd
    return Math.min(delay + jitter, MAX_RETRY_DELAY);
  }

  /**
   * Determine if error is retryable
   */
  private isRetryableError(status?: number, error?: any): boolean {
    // Network errors are retryable
    if (!status) return true;
    
    // Server errors (5xx) are retryable
    if (status >= 500) return true;
    
    // Rate limiting (429) is retryable
    if (status === 429) return true;
    
    // Timeout errors are retryable
    if (error?.name === 'AbortError') return true;
    
    // Client errors (4xx) are not retryable
    return false;
  }

  /**
   * Handle API errors
   */
  private handleError(error: any, status?: number): APIError {
    const retryable = this.isRetryableError(status, error);

    // Network error
    if (!status) {
      return {
        code: 'NETWORK_ERROR',
        message: 'Network connection failed. Please check your internet connection.',
        retryable: true,
      };
    }

    // Timeout error
    if (error?.name === 'AbortError') {
      return {
        code: 'TIMEOUT',
        message: 'Request timed out. Please try again.',
        status,
        retryable: true,
      };
    }

    // HTTP error codes
    switch (status) {
      case 400:
        return {
          code: 'BAD_REQUEST',
          message: error.message || 'Invalid request. Please check your input.',
          status,
          details: error.details,
          retryable: false,
        };
      
      case 401:
        return {
          code: 'UNAUTHORIZED',
          message: 'Authentication required. Please log in.',
          status,
          retryable: false,
        };
      
      case 403:
        return {
          code: 'FORBIDDEN',
          message: 'You do not have permission to access this resource.',
          status,
          retryable: false,
        };
      
      case 404:
        return {
          code: 'NOT_FOUND',
          message: 'The requested resource was not found.',
          status,
          retryable: false,
        };
      
      case 429:
        return {
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Too many requests. Please wait a moment and try again.',
          status,
          retryable: true,
        };
      
      case 500:
        return {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Server error. Please try again later.',
          status,
          retryable: true,
        };
      
      case 502:
      case 503:
      case 504:
        return {
          code: 'SERVICE_UNAVAILABLE',
          message: 'Service temporarily unavailable. Please try again later.',
          status,
          retryable: true,
        };
      
      default:
        return {
          code: 'UNKNOWN_ERROR',
          message: error.message || 'An unexpected error occurred.',
          status,
          details: error.details,
          retryable,
        };
    }
  }

  /**
   * Log request for debugging
   */
  private logRequest(method: string, url: string, config?: RequestConfig): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Request] ${method} ${url}`, {
        headers: config?.headers,
        params: config?.params,
        timeout: config?.timeout,
      });
    }
  }

  /**
   * Log response for debugging
   */
  private logResponse(method: string, url: string, status: number, data: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API Response] ${method} ${url} - ${status}`, data);
    }
  }

  /**
   * Log error for debugging
   */
  private logError(method: string, url: string, error: APIError): void {
    if (process.env.NODE_ENV === 'development') {
      console.error(`[API Error] ${method} ${url}`, error);
    }
  }

  /**
   * Make HTTP request with retry logic
   */
  private async request<T>(
    method: string,
    endpoint: string,
    data?: any,
    config: RequestConfig = {}
  ): Promise<T> {
    // Apply request interceptors
    const modifiedConfig = this.applyRequestInterceptors(config);

    const {
      timeout = TIMEOUT_CONFIG.data,
      retries = DEFAULT_RETRIES,
      retryDelay = DEFAULT_RETRY_DELAY,
      headers: customHeaders,
      params,
    } = modifiedConfig;

    const url = this.buildURL(endpoint, params);
    const headers = this.buildHeaders(customHeaders);

    // Log request
    this.logRequest(method, url, modifiedConfig);

    let lastError: APIError | null = null;

    // Retry loop
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        // Make fetch request
        const response = await fetch(url, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Parse response
        let responseData: any;
        const contentType = response.headers.get('content-type');
        
        if (contentType?.includes('application/json')) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        // Handle HTTP errors
        if (!response.ok) {
          const error = this.handleError(responseData, response.status);
          
          // Log error
          this.logError(method, url, error);

          // Retry if error is retryable and we have retries left
          if (error.retryable && attempt < retries) {
            const delay = this.calculateBackoffDelay(attempt, retryDelay);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          }

          throw error;
        }

        // Log successful response
        this.logResponse(method, url, response.status, responseData);

        // Apply response interceptors
        const modifiedResponse = this.applyResponseInterceptors(responseData);

        return modifiedResponse as T;

      } catch (error: any) {
        // Handle fetch errors (network, timeout, etc.)
        const apiError = this.handleError(error);
        lastError = apiError;

        // Log error
        this.logError(method, url, apiError);

        // Retry if error is retryable and we have retries left
        if (apiError.retryable && attempt < retries) {
          const delay = this.calculateBackoffDelay(attempt, retryDelay);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }

        throw apiError;
      }
    }

    // If we exhausted all retries, throw the last error
    throw lastError || {
      code: 'MAX_RETRIES_EXCEEDED',
      message: 'Maximum retry attempts exceeded.',
      retryable: false,
    };
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('GET', endpoint, undefined, config);
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('POST', endpoint, data, config);
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PUT', endpoint, data, config);
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>('DELETE', endpoint, undefined, config);
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    return this.request<T>('PATCH', endpoint, data, config);
  }
}

// Create and export default API client instance
const apiClient = new APIClient();

// Add default request interceptor for authentication
apiClient.addRequestInterceptor((config) => {
  // Add any default request modifications here
  return config;
});

// Add default response interceptor
apiClient.addResponseInterceptor((response) => {
  // Add any default response modifications here
  return response;
});

export default apiClient;

// Export timeout configurations for use in React Query hooks
export { TIMEOUT_CONFIG };
