/**
 * React Query hooks for Territorial Intelligence Module
 * 
 * Provides data fetching hooks for:
 * - Map layers (branch, ATM, merchant, customer, competitor, POI)
 * - Regions and boundaries (province, city, district, village)
 * - Heatmaps (CASA density, QRIS adoption, credit outstanding, merchant density)
 * - Cluster analysis and area analysis
 * - Drill-down capabilities
 * - Radius and polygon analysis
 */

import { useQuery, UseQueryResult } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { API_ENDPOINTS, buildEndpoint } from '../services/api/endpoints';

/**
 * Region interface
 */
export interface Region {
  id: string;
  name: string;
  level: 'province' | 'city' | 'district' | 'village';
  parentId?: string;
  boundary: GeoJSON.Feature;
  center: [number, number];
  metrics: RegionMetrics;
}

/**
 * Region metrics interface
 */
export interface RegionMetrics {
  totalCustomers: number;
  totalMerchants: number;
  transactionVolume: number;
  assignedRMs: number;
  targetRealization: number;
  opportunityScore: number;
  casaTotal: number;
  qrisPenetration: number;
}

/**
 * Map layer interface
 */
export interface MapLayer {
  id: string;
  name: string;
  type: 'branch' | 'atm' | 'merchant' | 'customer' | 'competitor' | 'poi';
  data: GeoPoint[];
  visible: boolean;
  icon?: string;
  color?: string;
}

/**
 * Geo point interface
 */
export interface GeoPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  metadata?: Record<string, any>;
}

/**
 * Heatmap layer interface
 */
export interface HeatmapLayer {
  id: string;
  name: string;
  type: 'casa' | 'qris' | 'credit' | 'merchant-density';
  data: HeatmapPoint[];
  visible: boolean;
  gradient?: string[];
}

/**
 * Heatmap point interface
 */
export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
  value: number;
}

/**
 * Boundary layer interface
 */
export interface BoundaryLayer {
  id: string;
  level: 'province' | 'city' | 'district' | 'village';
  geojson: GeoJSON.FeatureCollection;
  visible: boolean;
}

/**
 * Cluster analysis data interface
 */
export interface ClusterAnalysis {
  clusters: Array<{
    id: string;
    name: string;
    performanceLevel: 'high' | 'medium' | 'low';
    regions: string[];
    metrics: {
      avgOpportunityScore: number;
      totalCustomers: number;
      totalMerchants: number;
      marketShare: number;
    };
  }>;
}

/**
 * Area analysis data interface
 */
export interface AreaAnalysis {
  areas: Array<{
    id: string;
    name: string;
    tamVsRealization: {
      tam: number;
      realization: number;
      gap: number;
      gapPercent: number;
    };
    marketShare: number;
    coverageRatio: number;
  }>;
}

/**
 * Drill-down data interface
 */
export interface DrillDownData {
  region: Region;
  children: Region[];
  detailMetrics: {
    totalCustomers: number;
    totalMerchants: number;
    transactionVolume: number;
    assignedRMs: number;
    targetVsRealization: {
      target: number;
      realization: number;
      achievementRate: number;
    };
    opportunityScore: number;
  };
}

/**
 * Radius analysis parameters
 */
export interface RadiusAnalysisParams {
  center: [number, number];
  radius: number; // in kilometers
  layerTypes?: string[];
}

/**
 * Polygon analysis parameters
 */
export interface PolygonAnalysisParams {
  polygon: GeoJSON.Polygon;
  layerTypes?: string[];
}

/**
 * Territorial filter parameters
 */
export interface TerritorialFilters {
  regionId?: string;
  level?: 'province' | 'city' | 'district' | 'village';
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Hook to fetch all regions
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with regions data
 * 
 * @example
 * const { data: regions } = useTerritorialRegions({ level: 'province' });
 */
export function useTerritorialRegions(
  filters?: TerritorialFilters
): UseQueryResult<Region[], Error> {
  return useQuery({
    queryKey: ['territorial', 'regions', filters],
    queryFn: async () => {
      const response = await apiClient.get<Region[]>(
        API_ENDPOINTS.territorial.regions,
        { params: filters }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - region data changes infrequently
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch specific region details
 * 
 * @param regionId - Region ID
 * @returns Query result with region data
 * 
 * @example
 * const { data: region } = useTerritorialRegion('region-123');
 */
export function useTerritorialRegion(
  regionId: string
): UseQueryResult<Region, Error> {
  return useQuery({
    queryKey: ['territorial', 'region', regionId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.territorial.region, regionId);
      const response = await apiClient.get<Region>(endpoint);
      return response;
    },
    enabled: !!regionId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch map layers
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with map layers data
 * 
 * @example
 * const { data: layers } = useTerritorialLayers();
 */
export function useTerritorialLayers(
  filters?: TerritorialFilters
): UseQueryResult<MapLayer[], Error> {
  return useQuery({
    queryKey: ['territorial', 'layers', filters],
    queryFn: async () => {
      const response = await apiClient.get<MapLayer[]>(
        API_ENDPOINTS.territorial.layers,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch specific layer data
 * 
 * @param layerId - Layer ID
 * @returns Query result with layer data
 * 
 * @example
 * const { data: layer } = useTerritorialLayer('branch-layer');
 */
export function useTerritorialLayer(
  layerId: string
): UseQueryResult<MapLayer, Error> {
  return useQuery({
    queryKey: ['territorial', 'layer', layerId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.territorial.layer, layerId);
      const response = await apiClient.get<MapLayer>(endpoint);
      return response;
    },
    enabled: !!layerId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch heatmap data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with heatmaps data
 * 
 * @example
 * const { data: heatmaps } = useTerritorialHeatmaps();
 */
export function useTerritorialHeatmaps(
  filters?: TerritorialFilters
): UseQueryResult<HeatmapLayer[], Error> {
  return useQuery({
    queryKey: ['territorial', 'heatmaps', filters],
    queryFn: async () => {
      const response = await apiClient.get<HeatmapLayer[]>(
        API_ENDPOINTS.territorial.heatmaps,
        { params: filters }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - heatmap data changes less frequently
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch specific heatmap data
 * 
 * @param heatmapId - Heatmap ID
 * @returns Query result with heatmap data
 * 
 * @example
 * const { data: heatmap } = useTerritorialHeatmap('casa-density');
 */
export function useTerritorialHeatmap(
  heatmapId: string
): UseQueryResult<HeatmapLayer, Error> {
  return useQuery({
    queryKey: ['territorial', 'heatmap', heatmapId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.territorial.heatmap, heatmapId);
      const response = await apiClient.get<HeatmapLayer>(endpoint);
      return response;
    },
    enabled: !!heatmapId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch administrative boundaries
 * 
 * @param level - Optional boundary level filter
 * @returns Query result with boundaries data
 * 
 * @example
 * const { data: boundaries } = useTerritorialBoundaries('province');
 */
export function useTerritorialBoundaries(
  level?: 'province' | 'city' | 'district' | 'village'
): UseQueryResult<BoundaryLayer[], Error> {
  return useQuery({
    queryKey: ['territorial', 'boundaries', level],
    queryFn: async () => {
      const endpoint = level 
        ? buildEndpoint(API_ENDPOINTS.territorial.boundary, level)
        : API_ENDPOINTS.territorial.boundaries;
      const response = await apiClient.get<BoundaryLayer[]>(endpoint);
      return response;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - boundaries rarely change
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to fetch cluster analysis data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with cluster analysis data
 * 
 * @example
 * const { data: clusters } = useTerritorialClusters();
 */
export function useTerritorialClusters(
  filters?: TerritorialFilters
): UseQueryResult<ClusterAnalysis, Error> {
  return useQuery({
    queryKey: ['territorial', 'clusters', filters],
    queryFn: async () => {
      const response = await apiClient.get<ClusterAnalysis>(
        API_ENDPOINTS.territorial.clusters,
        { params: filters }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch area analysis data
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with area analysis data
 * 
 * @example
 * const { data: areaAnalysis } = useTerritorialAreaAnalysis();
 */
export function useTerritorialAreaAnalysis(
  filters?: TerritorialFilters
): UseQueryResult<AreaAnalysis, Error> {
  return useQuery({
    queryKey: ['territorial', 'areaAnalysis', filters],
    queryFn: async () => {
      const response = await apiClient.get<AreaAnalysis>(
        API_ENDPOINTS.territorial.areaAnalysis,
        { params: filters }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

/**
 * Hook to fetch drill-down data for a region
 * 
 * @param regionId - Region ID
 * @returns Query result with drill-down data
 * 
 * @example
 * const { data: drillDown } = useTerritorialDrillDown('region-123');
 */
export function useTerritorialDrillDown(
  regionId: string
): UseQueryResult<DrillDownData, Error> {
  return useQuery({
    queryKey: ['territorial', 'drillDown', regionId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.territorial.drillDown, regionId);
      const response = await apiClient.get<DrillDownData>(endpoint);
      return response;
    },
    enabled: !!regionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch radius analysis data
 * 
 * @param params - Radius analysis parameters
 * @returns Query result with radius analysis data
 * 
 * @example
 * const { data: radiusAnalysis } = useTerritorialRadiusAnalysis({
 *   center: [-6.2088, 106.8456],
 *   radius: 5
 * });
 */
export function useTerritorialRadiusAnalysis(
  params: RadiusAnalysisParams
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['territorial', 'radiusAnalysis', params],
    queryFn: async () => {
      const response = await apiClient.get(
        API_ENDPOINTS.territorial.radiusAnalysis,
        { params }
      );
      return response;
    },
    enabled: !!params.center && !!params.radius,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch polygon analysis data
 * 
 * @param params - Polygon analysis parameters
 * @returns Query result with polygon analysis data
 * 
 * @example
 * const { data: polygonAnalysis } = useTerritorialPolygonAnalysis({
 *   polygon: { type: 'Polygon', coordinates: [...] }
 * });
 */
export function useTerritorialPolygonAnalysis(
  params: PolygonAnalysisParams
): UseQueryResult<any, Error> {
  return useQuery({
    queryKey: ['territorial', 'polygonAnalysis', params],
    queryFn: async () => {
      const response = await apiClient.post(
        API_ENDPOINTS.territorial.polygonAnalysis,
        params
      );
      return response;
    },
    enabled: !!params.polygon,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}
