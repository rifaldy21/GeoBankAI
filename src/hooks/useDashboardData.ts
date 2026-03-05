/**
 * React Query hooks for Dashboard Module
 * 
 * Provides data fetching hooks for:
 * - Dashboard KPIs (Total Nasabah, Total Merchant, CASA Growth, etc.)
 * - National heatmap data
 * - Top regions by opportunity gap
 * - Growth trends (MoM, YoY)
 * - AI-generated alerts and insights
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { API_ENDPOINTS } from '../services/api/endpoints';

/**
 * Dashboard KPI data interface
 */
export interface DashboardKPIs {
  totalNasabah: number;
  totalMerchant: number;
  casaGrowth: number;
  qrisPenetrationRate: number;
  tamCoverage: number;
  activeMerchantRate: number;
  lastUpdated: Date;
}

/**
 * Heatmap data interface
 */
export interface HeatmapData {
  regions: Array<{
    id: string;
    name: string;
    lat: number;
    lng: number;
    value: number;
    intensity: number;
  }>;
}

/**
 * Top region interface
 */
export interface TopRegion {
  id: string;
  name: string;
  opportunityGap: number;
  rank: number;
  metrics: {
    totalCustomers: number;
    totalMerchants: number;
    potential: number;
    realization: number;
  };
}

/**
 * Growth trend interface
 */
export interface GrowthTrend {
  period: string;
  date: Date;
  value: number;
  change: number;
  changePercent: number;
}

/**
 * Growth trends data interface
 */
export interface GrowthTrends {
  monthOverMonth: GrowthTrend[];
  yearOverYear: GrowthTrend[];
}

/**
 * Alert interface
 */
export interface Alert {
  id: string;
  type: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: Date;
  actionable: boolean;
  actionUrl?: string;
}

/**
 * Insight interface
 */
export interface Insight {
  id: string;
  category: 'descriptive' | 'diagnostic' | 'predictive' | 'prescriptive';
  title: string;
  description: string;
  confidence: number;
  timestamp: Date;
}

/**
 * Dashboard filter parameters
 */
export interface DashboardFilters {
  dateRange?: {
    start: Date;
    end: Date;
  };
  territory?: string[];
  branch?: string[];
  product?: string[];
}

/**
 * Hook to fetch dashboard KPIs
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with KPI data
 * 
 * @example
 * const { data: kpis, isLoading, error } = useDashboardKPIs({ 
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * });
 */
export function useDashboardKPIs(
  filters?: DashboardFilters
): UseQueryResult<DashboardKPIs, Error> {
  return useQuery({
    queryKey: ['dashboard', 'kpis', filters],
    queryFn: async () => {
      const response = await apiClient.get<DashboardKPIs>(
        API_ENDPOINTS.dashboard.kpis,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch national heatmap data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with heatmap data
 * 
 * @example
 * const { data: heatmap, isLoading } = useDashboardHeatmap();
 */
export function useDashboardHeatmap(
  filters?: DashboardFilters
): UseQueryResult<HeatmapData, Error> {
  return useQuery({
    queryKey: ['dashboard', 'heatmap', filters],
    queryFn: async () => {
      const response = await apiClient.get<HeatmapData>(
        API_ENDPOINTS.dashboard.heatmap,
        { params: filters }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - heatmap data changes less frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch top regions by opportunity gap
 * 
 * @param limit - Number of top regions to fetch (default: 10)
 * @param filters - Optional filter parameters
 * @returns Query result with top regions data
 * 
 * @example
 * const { data: topRegions } = useDashboardTopRegions(10);
 */
export function useDashboardTopRegions(
  limit: number = 10,
  filters?: DashboardFilters
): UseQueryResult<TopRegion[], Error> {
  return useQuery({
    queryKey: ['dashboard', 'topRegions', limit, filters],
    queryFn: async () => {
      const response = await apiClient.get<TopRegion[]>(
        API_ENDPOINTS.dashboard.topRegions,
        { params: { limit, ...filters } }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch growth trends (MoM, YoY)
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with growth trends data
 * 
 * @example
 * const { data: trends } = useDashboardTrends({
 *   dateRange: { start: new Date('2024-01-01'), end: new Date('2024-12-31') }
 * });
 */
export function useDashboardTrends(
  filters?: DashboardFilters
): UseQueryResult<GrowthTrends, Error> {
  return useQuery({
    queryKey: ['dashboard', 'trends', filters],
    queryFn: async () => {
      const response = await apiClient.get<GrowthTrends>(
        API_ENDPOINTS.dashboard.trends,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch AI-generated alerts
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with alerts data
 * 
 * @example
 * const { data: alerts } = useDashboardAlerts();
 */
export function useDashboardAlerts(
  filters?: DashboardFilters
): UseQueryResult<Alert[], Error> {
  return useQuery({
    queryKey: ['dashboard', 'alerts', filters],
    queryFn: async () => {
      const response = await apiClient.get<Alert[]>(
        API_ENDPOINTS.dashboard.alerts,
        { params: filters }
      );
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - alerts should be fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for new alerts
  });
}

/**
 * Hook to fetch AI-generated insights
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with insights data
 * 
 * @example
 * const { data: insights } = useDashboardInsights();
 */
export function useDashboardInsights(
  filters?: DashboardFilters
): UseQueryResult<Insight[], Error> {
  return useQuery({
    queryKey: ['dashboard', 'insights', filters],
    queryFn: async () => {
      const response = await apiClient.get<Insight[]>(
        API_ENDPOINTS.dashboard.insights,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch all dashboard data at once
 * 
 * Combines all dashboard queries for convenience.
 * Use individual hooks if you only need specific data.
 * 
 * @param filters - Optional filter parameters
 * @returns Object with all dashboard query results
 * 
 * @example
 * const dashboard = useDashboardData();
 * if (dashboard.kpis.isLoading) return <Loading />;
 * return <Dashboard kpis={dashboard.kpis.data} />;
 */
export function useDashboardData(filters?: DashboardFilters) {
  const kpis = useDashboardKPIs(filters);
  const heatmap = useDashboardHeatmap(filters);
  const topRegions = useDashboardTopRegions(10, filters);
  const trends = useDashboardTrends(filters);
  const alerts = useDashboardAlerts(filters);
  const insights = useDashboardInsights(filters);

  return {
    kpis,
    heatmap,
    topRegions,
    trends,
    alerts,
    insights,
    isLoading: kpis.isLoading || heatmap.isLoading || topRegions.isLoading || 
               trends.isLoading || alerts.isLoading || insights.isLoading,
    isError: kpis.isError || heatmap.isError || topRegions.isError || 
             trends.isError || alerts.isError || insights.isError,
  };
}
