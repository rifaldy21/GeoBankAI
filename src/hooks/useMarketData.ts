/**
 * React Query hooks for Market Intelligence Module
 * 
 * Provides data fetching hooks for:
 * - TAM (Total Addressable Market) estimation
 * - Penetration analysis by product category
 * - Gap analysis comparing actual vs potential
 * - Priority regions for expansion
 * - Market share estimation
 * - Competitive intelligence
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { API_ENDPOINTS, buildEndpoint } from '../services/api/endpoints';

/**
 * TAM estimation interface
 */
export interface TAMEstimation {
  regionId: string;
  regionName: string;
  productivePopulation: number;
  potentialMerchants: number;
  purchasingPower: number; // in billions
  marketSize: number; // in billions
  currentPenetration: number; // percentage
  estimatedGap: number; // in billions
}

/**
 * Product penetration interface
 */
export interface ProductPenetration {
  product: 'CASA' | 'Credit' | 'QRIS' | 'Savings';
  penetrationRate: number; // percentage
  potential: number;
  gap: number;
  gapPercent: number;
}

/**
 * Penetration analysis interface
 */
export interface PenetrationAnalysis {
  regionId: string;
  regionName: string;
  productCategories: ProductPenetration[];
  overallPenetration: number; // percentage
  gapVsPotential: number;
  priorityScore: number;
}

/**
 * Gap analysis interface
 */
export interface GapAnalysis {
  regions: Array<{
    regionId: string;
    regionName: string;
    tam: number;
    realization: number;
    gap: number;
    gapPercent: number;
    priorityLevel: 'high' | 'medium' | 'low';
  }>;
  summary: {
    totalTAM: number;
    totalRealization: number;
    totalGap: number;
    avgGapPercent: number;
  };
}

/**
 * Priority region interface
 */
export interface PriorityRegion {
  regionId: string;
  regionName: string;
  priorityScore: number;
  rank: number;
  metrics: {
    opportunityGap: number;
    marketPotential: number;
    currentPenetration: number;
    competitiveIntensity: number;
  };
  recommendation: string;
}

/**
 * Market share data interface
 */
export interface MarketShare {
  regionId: string;
  regionName: string;
  ourShare: number; // percentage
  competitors: Array<{
    name: string;
    share: number; // percentage
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
  totalMarketSize: number;
  ourMarketValue: number;
}

/**
 * Competitive analysis interface
 */
export interface CompetitiveAnalysis {
  regionId: string;
  regionName: string;
  competitors: Array<{
    id: string;
    name: string;
    branches: number;
    marketShare: number;
    strengths: string[];
    weaknesses: string[];
  }>;
  competitivePosition: 'leader' | 'challenger' | 'follower' | 'nicher';
  threats: string[];
  opportunities: string[];
}

/**
 * Market filter parameters
 */
export interface MarketFilters {
  regionId?: string;
  product?: 'CASA' | 'Credit' | 'QRIS' | 'Savings';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Hook to fetch TAM estimation data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with TAM data
 * 
 * @example
 * const { data: tamData } = useMarketTAM({ regionId: 'region-123' });
 */
export function useMarketTAM(
  filters?: MarketFilters
): UseQueryResult<TAMEstimation[], Error> {
  return useQuery({
    queryKey: ['market', 'tam', filters],
    queryFn: async () => {
      const response = await apiClient.get<TAMEstimation[]>(
        API_ENDPOINTS.market.tam,
        { params: filters }
      );
      return response;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - TAM data changes infrequently
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch TAM for specific region
 * 
 * @param regionId - Region ID
 * @returns Query result with TAM data for region
 * 
 * @example
 * const { data: tam } = useMarketTAMByRegion('region-123');
 */
export function useMarketTAMByRegion(
  regionId: string
): UseQueryResult<TAMEstimation, Error> {
  return useQuery({
    queryKey: ['market', 'tam', 'region', regionId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.market.tamByRegion, regionId);
      const response = await apiClient.get<TAMEstimation>(endpoint);
      return response;
    },
    enabled: !!regionId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch penetration analysis data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with penetration analysis data
 * 
 * @example
 * const { data: penetration } = useMarketPenetration({ product: 'QRIS' });
 */
export function useMarketPenetration(
  filters?: MarketFilters
): UseQueryResult<PenetrationAnalysis[], Error> {
  return useQuery({
    queryKey: ['market', 'penetration', filters],
    queryFn: async () => {
      const response = await apiClient.get<PenetrationAnalysis[]>(
        API_ENDPOINTS.market.penetration,
        { params: filters }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}

/**
 * Hook to fetch penetration by product category
 * 
 * @param product - Product category
 * @param filters - Optional filter parameters
 * @returns Query result with product penetration data
 * 
 * @example
 * const { data: qrisPenetration } = useMarketPenetrationByProduct('QRIS');
 */
export function useMarketPenetrationByProduct(
  product: 'CASA' | 'Credit' | 'QRIS' | 'Savings',
  filters?: Omit<MarketFilters, 'product'>
): UseQueryResult<PenetrationAnalysis[], Error> {
  return useQuery({
    queryKey: ['market', 'penetration', 'product', product, filters],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.market.penetrationByProduct, product);
      const response = await apiClient.get<PenetrationAnalysis[]>(
        endpoint,
        { params: filters }
      );
      return response;
    },
    enabled: !!product,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}

/**
 * Hook to fetch gap analysis data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with gap analysis data
 * 
 * @example
 * const { data: gapAnalysis } = useMarketGapAnalysis();
 */
export function useMarketGapAnalysis(
  filters?: MarketFilters
): UseQueryResult<GapAnalysis, Error> {
  return useQuery({
    queryKey: ['market', 'gapAnalysis', filters],
    queryFn: async () => {
      const response = await apiClient.get<GapAnalysis>(
        API_ENDPOINTS.market.gapAnalysis,
        { params: filters }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}

/**
 * Hook to fetch priority regions for expansion
 * 
 * @param limit - Number of priority regions to fetch
 * @param filters - Optional filter parameters
 * @returns Query result with priority regions data
 * 
 * @example
 * const { data: priorityRegions } = useMarketPriorityRegions(20);
 */
export function useMarketPriorityRegions(
  limit: number = 20,
  filters?: MarketFilters
): UseQueryResult<PriorityRegion[], Error> {
  return useQuery({
    queryKey: ['market', 'priorityRegions', limit, filters],
    queryFn: async () => {
      const response = await apiClient.get<PriorityRegion[]>(
        API_ENDPOINTS.market.priorityRegions,
        { params: { limit, ...filters } }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}

/**
 * Hook to fetch market share estimation
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with market share data
 * 
 * @example
 * const { data: marketShare } = useMarketShare({ regionId: 'region-123' });
 */
export function useMarketShare(
  filters?: MarketFilters
): UseQueryResult<MarketShare[], Error> {
  return useQuery({
    queryKey: ['market', 'marketShare', filters],
    queryFn: async () => {
      const response = await apiClient.get<MarketShare[]>(
        API_ENDPOINTS.market.marketShare,
        { params: filters }
      );
      return response;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - market share changes slowly
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to fetch competitive intelligence
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with competitive analysis data
 * 
 * @example
 * const { data: competitive } = useMarketCompetitive({ regionId: 'region-123' });
 */
export function useMarketCompetitive(
  filters?: MarketFilters
): UseQueryResult<CompetitiveAnalysis[], Error> {
  return useQuery({
    queryKey: ['market', 'competitive', filters],
    queryFn: async () => {
      const response = await apiClient.get<CompetitiveAnalysis[]>(
        API_ENDPOINTS.market.competitive,
        { params: filters }
      );
      return response;
    },
    staleTime: 20 * 60 * 1000, // 20 minutes - competitive data changes slowly
    gcTime: 40 * 60 * 1000, // 40 minutes
  });
}

/**
 * Hook to fetch all market intelligence data at once
 * 
 * Combines all market queries for convenience.
 * Use individual hooks if you only need specific data.
 * 
 * @param filters - Optional filter parameters
 * @returns Object with all market query results
 * 
 * @example
 * const market = useMarketData({ regionId: 'region-123' });
 * if (market.tam.isLoading) return <Loading />;
 * return <MarketIntelligence tam={market.tam.data} />;
 */
export function useMarketData(filters?: MarketFilters) {
  const tam = useMarketTAM(filters);
  const penetration = useMarketPenetration(filters);
  const gapAnalysis = useMarketGapAnalysis(filters);
  const priorityRegions = useMarketPriorityRegions(20, filters);
  const marketShare = useMarketShare(filters);
  const competitive = useMarketCompetitive(filters);

  return {
    tam,
    penetration,
    gapAnalysis,
    priorityRegions,
    marketShare,
    competitive,
    isLoading: tam.isLoading || penetration.isLoading || gapAnalysis.isLoading ||
               priorityRegions.isLoading || marketShare.isLoading || competitive.isLoading,
    isError: tam.isError || penetration.isError || gapAnalysis.isError ||
             priorityRegions.isError || marketShare.isError || competitive.isError,
  };
}
