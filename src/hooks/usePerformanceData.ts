/**
 * React Query hooks for Performance Module
 * 
 * Provides data fetching hooks for:
 * - RM (Relationship Manager) performance tracking
 * - RM portfolio summaries
 * - RM targets vs realization
 * - RM leaderboard rankings
 * - Branch performance tracking
 * - Branch coverage and productivity metrics
 * - Branch opportunities
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { API_ENDPOINTS, buildEndpoint } from '../services/api/endpoints';

/**
 * RM performance interface
 */
export interface RMPerformance {
  id: string;
  name: string;
  email: string;
  phone: string;
  territory: string;
  branch: string;
  portfolio: Portfolio;
  targets: Targets;
  achievements: Achievements;
  status: 'Top Performer' | 'On Track' | 'Needs Improvement';
  rank?: number;
  performanceScore: number;
}

/**
 * Portfolio interface
 */
export interface Portfolio {
  totalCustomers: number;
  totalMerchants: number;
  casaValue: number; // in billions
  creditOutstanding: number; // in billions
}

/**
 * Targets interface
 */
export interface Targets {
  leads: number;
  acquisition: number;
  casa: number; // in billions
  qrisActivation: number;
}

/**
 * Achievements interface
 */
export interface Achievements {
  acquired: number;
  conversionRate: number; // percentage
  casaGrowth: number; // percentage
  qrisActivationRate: number; // percentage
  merchantReactivationRate: number; // percentage
}

/**
 * Branch performance interface
 */
export interface BranchPerformance {
  id: string;
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  coverage: BranchCoverage;
  kpis: BranchKPIs;
  rmCount: number;
  territory: string;
  performanceScore: number;
}

/**
 * Branch coverage interface
 */
export interface BranchCoverage {
  area: number; // in km²
  districts: string[];
  villages: string[];
  radiusKm: number;
}

/**
 * Branch KPIs interface
 */
export interface BranchKPIs {
  totalCustomers: number;
  totalMerchants: number;
  casaTotal: number; // in billions
  creditOutstanding: number; // in billions
  productivity: number;
  unaddressedOpportunities: number;
}

/**
 * Branch productivity metrics interface
 */
export interface BranchProductivity {
  branchId: string;
  branchName: string;
  metrics: {
    customersPerRM: number;
    merchantsPerRM: number;
    transactionsPerDay: number;
    revenuePerRM: number;
    efficiencyScore: number;
  };
  trends: {
    customerGrowth: number; // percentage
    merchantGrowth: number; // percentage
    revenueGrowth: number; // percentage
  };
}

/**
 * Branch opportunities interface
 */
export interface BranchOpportunities {
  branchId: string;
  branchName: string;
  opportunities: Array<{
    id: string;
    type: 'acquisition' | 'reactivation' | 'cross-sell' | 'upsell';
    description: string;
    potentialValue: number;
    priority: 'high' | 'medium' | 'low';
    assignedRM?: string;
  }>;
  totalValue: number;
  addressedCount: number;
  unaddressedCount: number;
}

/**
 * Performance filter parameters
 */
export interface PerformanceFilters {
  territory?: string;
  branch?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: 'Top Performer' | 'On Track' | 'Needs Improvement';
}

/**
 * Hook to fetch all RM performance data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with RM performance data
 * 
 * @example
 * const { data: rms } = usePerformanceRMs({ territory: 'Jakarta' });
 */
export function usePerformanceRMs(
  filters?: PerformanceFilters
): UseQueryResult<RMPerformance[], Error> {
  return useQuery({
    queryKey: ['performance', 'rms', filters],
    queryFn: async () => {
      const response = await apiClient.get<RMPerformance[]>(
        API_ENDPOINTS.performance.rms,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch specific RM performance
 * 
 * @param rmId - RM ID
 * @returns Query result with RM performance data
 * 
 * @example
 * const { data: rm } = usePerformanceRM('rm-123');
 */
export function usePerformanceRM(
  rmId: string
): UseQueryResult<RMPerformance, Error> {
  return useQuery({
    queryKey: ['performance', 'rm', rmId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.performance.rm, rmId);
      const response = await apiClient.get<RMPerformance>(endpoint);
      return response;
    },
    enabled: !!rmId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch RM leaderboard
 * 
 * @param limit - Number of top RMs to fetch
 * @param filters - Optional filter parameters
 * @returns Query result with RM leaderboard data
 * 
 * @example
 * const { data: leaderboard } = usePerformanceLeaderboard(10);
 */
export function usePerformanceLeaderboard(
  limit: number = 10,
  filters?: PerformanceFilters
): UseQueryResult<RMPerformance[], Error> {
  return useQuery({
    queryKey: ['performance', 'leaderboard', limit, filters],
    queryFn: async () => {
      const response = await apiClient.get<RMPerformance[]>(
        API_ENDPOINTS.performance.leaderboard,
        { params: { limit, ...filters } }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch RM portfolio summary
 * 
 * @param rmId - RM ID
 * @returns Query result with portfolio data
 * 
 * @example
 * const { data: portfolio } = usePerformancePortfolio('rm-123');
 */
export function usePerformancePortfolio(
  rmId: string
): UseQueryResult<Portfolio, Error> {
  return useQuery({
    queryKey: ['performance', 'portfolio', rmId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.performance.portfolio, rmId);
      const response = await apiClient.get<Portfolio>(endpoint);
      return response;
    },
    enabled: !!rmId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch RM targets vs realization
 * 
 * @param rmId - RM ID
 * @returns Query result with targets and achievements data
 * 
 * @example
 * const { data: targets } = usePerformanceTargets('rm-123');
 */
export function usePerformanceTargets(
  rmId: string
): UseQueryResult<{ targets: Targets; achievements: Achievements }, Error> {
  return useQuery({
    queryKey: ['performance', 'targets', rmId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.performance.targets, rmId);
      const response = await apiClient.get<{ targets: Targets; achievements: Achievements }>(endpoint);
      return response;
    },
    enabled: !!rmId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch all branch performance data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with branch performance data
 * 
 * @example
 * const { data: branches } = usePerformanceBranches({ territory: 'Jakarta' });
 */
export function usePerformanceBranches(
  filters?: PerformanceFilters
): UseQueryResult<BranchPerformance[], Error> {
  return useQuery({
    queryKey: ['performance', 'branches', filters],
    queryFn: async () => {
      const response = await apiClient.get<BranchPerformance[]>(
        API_ENDPOINTS.performance.branches,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch specific branch performance
 * 
 * @param branchId - Branch ID
 * @returns Query result with branch performance data
 * 
 * @example
 * const { data: branch } = usePerformanceBranch('branch-123');
 */
export function usePerformanceBranch(
  branchId: string
): UseQueryResult<BranchPerformance, Error> {
  return useQuery({
    queryKey: ['performance', 'branch', branchId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.performance.branch, branchId);
      const response = await apiClient.get<BranchPerformance>(endpoint);
      return response;
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch branch coverage data
 * 
 * @param branchId - Branch ID
 * @returns Query result with branch coverage data
 * 
 * @example
 * const { data: coverage } = usePerformanceCoverage('branch-123');
 */
export function usePerformanceCoverage(
  branchId: string
): UseQueryResult<BranchCoverage, Error> {
  return useQuery({
    queryKey: ['performance', 'coverage', branchId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.performance.coverage, branchId);
      const response = await apiClient.get<BranchCoverage>(endpoint);
      return response;
    },
    enabled: !!branchId,
    staleTime: 10 * 60 * 1000, // 10 minutes - coverage changes infrequently
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}

/**
 * Hook to fetch branch productivity metrics
 * 
 * @param branchId - Branch ID
 * @returns Query result with branch productivity data
 * 
 * @example
 * const { data: productivity } = usePerformanceProductivity('branch-123');
 */
export function usePerformanceProductivity(
  branchId: string
): UseQueryResult<BranchProductivity, Error> {
  return useQuery({
    queryKey: ['performance', 'productivity', branchId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.performance.productivity, branchId);
      const response = await apiClient.get<BranchProductivity>(endpoint);
      return response;
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch branch opportunities
 * 
 * @param branchId - Branch ID
 * @returns Query result with branch opportunities data
 * 
 * @example
 * const { data: opportunities } = usePerformanceOpportunities('branch-123');
 */
export function usePerformanceOpportunities(
  branchId: string
): UseQueryResult<BranchOpportunities, Error> {
  return useQuery({
    queryKey: ['performance', 'opportunities', branchId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.performance.opportunities, branchId);
      const response = await apiClient.get<BranchOpportunities>(endpoint);
      return response;
    },
    enabled: !!branchId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch all performance data at once
 * 
 * Combines RM and branch queries for convenience.
 * Use individual hooks if you only need specific data.
 * 
 * @param filters - Optional filter parameters
 * @returns Object with all performance query results
 * 
 * @example
 * const performance = usePerformanceData({ territory: 'Jakarta' });
 * if (performance.rms.isLoading) return <Loading />;
 * return <Performance rms={performance.rms.data} />;
 */
export function usePerformanceData(filters?: PerformanceFilters) {
  const rms = usePerformanceRMs(filters);
  const leaderboard = usePerformanceLeaderboard(10, filters);
  const branches = usePerformanceBranches(filters);

  return {
    rms,
    leaderboard,
    branches,
    isLoading: rms.isLoading || leaderboard.isLoading || branches.isLoading,
    isError: rms.isError || leaderboard.isError || branches.isError,
  };
}
