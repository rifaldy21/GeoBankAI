/**
 * AI Integration Error Handler
 * 
 * Handles errors specific to Gemini API integration:
 * - Rate limit errors
 * - Invalid API key errors
 * - Timeout errors
 * - Fallback to text-only responses
 * - Clear error messages for users
 */

export interface AIError {
  code: AIErrorCode;
  message: string;
  userMessage: string;
  retryable: boolean;
  fallbackAvailable: boolean;
  details?: any;
}

export enum AIErrorCode {
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_API_KEY = 'INVALID_API_KEY',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_REQUEST = 'INVALID_REQUEST',
  MODEL_ERROR = 'MODEL_ERROR',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  CONTENT_FILTER = 'CONTENT_FILTER',
  UNKNOWN = 'UNKNOWN',
}

/**
 * Parse Gemini API error
 */
export function parseGeminiError(error: any): AIError {
  // Handle network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return {
      code: AIErrorCode.NETWORK_ERROR,
      message: 'Network error while connecting to AI service',
      userMessage: 'Unable to connect to AI service. Please check your internet connection.',
      retryable: true,
      fallbackAvailable: false,
    };
  }

  // Handle timeout errors
  if (error.name === 'AbortError' || error.code === 'ETIMEDOUT') {
    return {
      code: AIErrorCode.TIMEOUT,
      message: 'AI request timed out',
      userMessage: 'The AI request took too long. Please try a simpler query or try again later.',
      retryable: true,
      fallbackAvailable: false,
    };
  }

  // Handle Gemini API specific errors
  const errorMessage = error.message || error.error?.message || '';
  const statusCode = error.status || error.error?.status;

  // Quota exceeded errors (check before rate limit)
  if (
    errorMessage.includes('quota exceeded') ||
    errorMessage.includes('billing')
  ) {
    return {
      code: AIErrorCode.QUOTA_EXCEEDED,
      message: 'Gemini API quota exceeded',
      userMessage: 'AI service quota exceeded. Please contact support.',
      retryable: false,
      fallbackAvailable: false,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Rate limit errors
  if (
    statusCode === 429 ||
    errorMessage.includes('rate limit')
  ) {
    return {
      code: AIErrorCode.RATE_LIMIT,
      message: 'Gemini API rate limit exceeded',
      userMessage: 'Too many AI requests. Please wait a moment before trying again.',
      retryable: true,
      fallbackAvailable: false,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Invalid API key errors
  if (
    statusCode === 401 ||
    statusCode === 403 ||
    errorMessage.includes('API key') ||
    errorMessage.includes('authentication') ||
    errorMessage.includes('unauthorized')
  ) {
    return {
      code: AIErrorCode.INVALID_API_KEY,
      message: 'Invalid or missing Gemini API key',
      userMessage: 'AI service configuration error. Please contact support.',
      retryable: false,
      fallbackAvailable: false,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Quota exceeded errors
  if (
    errorMessage.includes('quota exceeded') ||
    errorMessage.includes('billing')
  ) {
    return {
      code: AIErrorCode.QUOTA_EXCEEDED,
      message: 'Gemini API quota exceeded',
      userMessage: 'AI service quota exceeded. Please contact support.',
      retryable: false,
      fallbackAvailable: false,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Quota exceeded errors
  if (
    errorMessage.includes('quota exceeded') ||
    errorMessage.includes('billing')
  ) {
    return {
      code: AIErrorCode.QUOTA_EXCEEDED,
      message: 'Gemini API quota exceeded',
      userMessage: 'AI service quota exceeded. Please contact support.',
      retryable: false,
      fallbackAvailable: false,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Invalid request errors
  if (
    statusCode === 400 ||
    errorMessage.includes('invalid request') ||
    errorMessage.includes('bad request')
  ) {
    return {
      code: AIErrorCode.INVALID_REQUEST,
      message: 'Invalid request to Gemini API',
      userMessage: 'Your query could not be processed. Please try rephrasing your question.',
      retryable: false,
      fallbackAvailable: true,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Content filter errors
  if (
    errorMessage.includes('content filter') ||
    errorMessage.includes('safety') ||
    errorMessage.includes('blocked')
  ) {
    return {
      code: AIErrorCode.CONTENT_FILTER,
      message: 'Content filtered by Gemini API',
      userMessage: 'Your query was blocked by content filters. Please try a different question.',
      retryable: false,
      fallbackAvailable: true,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Model errors
  if (
    statusCode === 500 ||
    statusCode === 503 ||
    errorMessage.includes('model') ||
    errorMessage.includes('server error')
  ) {
    return {
      code: AIErrorCode.MODEL_ERROR,
      message: 'Gemini API model error',
      userMessage: 'The AI service encountered an error. Please try again in a moment.',
      retryable: true,
      fallbackAvailable: false,
      details: { statusCode, originalMessage: errorMessage },
    };
  }

  // Unknown errors
  return {
    code: AIErrorCode.UNKNOWN,
    message: errorMessage || 'Unknown AI error',
    userMessage: 'An unexpected error occurred with the AI service. Please try again.',
    retryable: true,
    fallbackAvailable: false,
    details: { statusCode, originalMessage: errorMessage, error },
  };
}

/**
 * Handle AI error with retry logic
 */
export async function handleAIError<T>(
  operation: () => Promise<T>,
  maxRetries: number = 2
): Promise<T> {
  let lastError: AIError | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = parseGeminiError(error);

      // Log error
      logAIError(lastError, attempt);

      // Don't retry if error is not retryable
      if (!lastError.retryable || attempt >= maxRetries) {
        throw lastError;
      }

      // Calculate retry delay with exponential backoff
      const delay = calculateRetryDelay(lastError, attempt);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[AI Error] Retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`);
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

/**
 * Calculate retry delay based on error type and attempt
 */
function calculateRetryDelay(error: AIError, attempt: number): number {
  const baseDelay = 1000; // 1 second
  const maxDelay = 30000; // 30 seconds

  let delay: number;

  switch (error.code) {
    case AIErrorCode.RATE_LIMIT:
      // Longer delay for rate limiting
      delay = Math.min(baseDelay * Math.pow(2, attempt) * 3, maxDelay);
      break;

    case AIErrorCode.TIMEOUT:
    case AIErrorCode.MODEL_ERROR:
      // Standard exponential backoff
      delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      break;

    case AIErrorCode.NETWORK_ERROR:
      // Shorter delay for network errors
      delay = Math.min(baseDelay * Math.pow(1.5, attempt), maxDelay);
      break;

    default:
      delay = baseDelay;
  }

  // Add jitter (±20%)
  const jitter = delay * 0.2 * (Math.random() * 2 - 1);
  return Math.max(0, delay + jitter);
}

/**
 * Log AI error
 */
function logAIError(error: AIError, attempt: number): void {
  const logData = {
    ...error,
    attempt,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[AI Error]', logData);
  } else {
    // In production, send to monitoring service
    console.error('[AI Error]', logData);
  }
}

/**
 * Create fallback text-only response
 */
export function createFallbackResponse(query: string): string {
  return `I apologize, but I'm unable to generate a detailed response at the moment. However, I can provide some general guidance:

For queries about:
- Performance metrics: Check the Performance dashboard for RM and branch statistics
- Territorial analysis: Visit the Territorial Intelligence section for maps and regional data
- Market insights: Explore the Market Intelligence module for TAM and penetration analysis
- Reports: Use the Reporting & Analytics section for custom analysis

Please try your query again, or contact support if the issue persists.`;
}

/**
 * Get suggested action for AI error
 */
export function getSuggestedAction(error: AIError): string {
  switch (error.code) {
    case AIErrorCode.RATE_LIMIT:
      return 'Wait a few moments before sending another query.';

    case AIErrorCode.INVALID_API_KEY:
      return 'Contact your system administrator to configure the AI service.';

    case AIErrorCode.TIMEOUT:
      return 'Try asking a simpler question or break your query into smaller parts.';

    case AIErrorCode.NETWORK_ERROR:
      return 'Check your internet connection and try again.';

    case AIErrorCode.INVALID_REQUEST:
      return 'Rephrase your question and try again.';

    case AIErrorCode.MODEL_ERROR:
      return 'Wait a moment and try again.';

    case AIErrorCode.QUOTA_EXCEEDED:
      return 'Contact support to increase your AI service quota.';

    case AIErrorCode.CONTENT_FILTER:
      return 'Try asking a different question that focuses on business data.';

    default:
      return 'Try again or contact support if the problem persists.';
  }
}

/**
 * Check if error allows fallback response
 */
export function canUseFallback(error: AIError): boolean {
  return error.fallbackAvailable;
}

/**
 * Format error for user display
 */
export function formatAIErrorForUser(error: AIError): {
  title: string;
  message: string;
  action: string;
} {
  return {
    title: getErrorTitle(error.code),
    message: error.userMessage,
    action: getSuggestedAction(error),
  };
}

/**
 * Get error title based on error code
 */
function getErrorTitle(code: AIErrorCode): string {
  switch (code) {
    case AIErrorCode.RATE_LIMIT:
      return 'Too Many Requests';

    case AIErrorCode.INVALID_API_KEY:
      return 'Configuration Error';

    case AIErrorCode.TIMEOUT:
      return 'Request Timeout';

    case AIErrorCode.NETWORK_ERROR:
      return 'Connection Error';

    case AIErrorCode.INVALID_REQUEST:
      return 'Invalid Query';

    case AIErrorCode.MODEL_ERROR:
      return 'Service Error';

    case AIErrorCode.QUOTA_EXCEEDED:
      return 'Quota Exceeded';

    case AIErrorCode.CONTENT_FILTER:
      return 'Content Blocked';

    default:
      return 'Error';
  }
}

/**
 * Wrap AI service call with error handling
 */
export async function safeAICall<T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<{ success: boolean; data?: T; error?: AIError }> {
  try {
    const data = await handleAIError(operation);
    return { success: true, data };
  } catch (error: any) {
    const aiError = error as AIError;
    
    // Return fallback if available
    if (fallback !== undefined && canUseFallback(aiError)) {
      return { success: true, data: fallback };
    }

    return { success: false, error: aiError };
  }
}

export default {
  parseGeminiError,
  handleAIError,
  createFallbackResponse,
  getSuggestedAction,
  canUseFallback,
  formatAIErrorForUser,
  safeAICall,
};
