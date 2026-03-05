/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * React Query client configuration for server state management
 * 
 * Configuration:
 * - staleTime: 5 minutes - Data is considered fresh for 5 minutes
 * - cacheTime: 10 minutes - Unused data is garbage collected after 10 minutes
 * - retry: 3 attempts with exponential backoff for failed requests
 * - refetchOnWindowFocus: false - Prevents unnecessary refetches when window regains focus
 * 
 * Error handling:
 * - Automatic retry with exponential backoff
 * - Error logging for debugging
 * - Graceful degradation on persistent failures
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Unused data is garbage collected after 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests up to 3 times with exponential backoff
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Don't refetch on window focus to reduce unnecessary network requests
      refetchOnWindowFocus: false,
      
      // Refetch on mount if data is stale
      refetchOnMount: true,
      
      // Don't refetch on reconnect by default
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once on failure
      retry: 1,
      
      // Error handling for mutations
      onError: (error) => {
        console.error('Mutation error:', error);
      },
    },
  },
});
