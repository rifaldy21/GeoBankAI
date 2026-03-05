/**
 * React Query hooks for Campaign & Activation Module
 * 
 * Provides data fetching hooks for:
 * - Campaign list and management
 * - Priority regions for targeting
 * - Dormant merchants identification
 * - Target list generation
 * - Follow-up actions for RMs
 * - Campaign metrics and activation rates
 */

import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import apiClient from '../services/api/client';
import { API_ENDPOINTS, buildEndpoint } from '../services/api/endpoints';

/**
 * Campaign interface
 */
export interface Campaign {
  id: string;
  name: string;
  type: 'acquisition' | 'reactivation' | 'retention';
  status: 'draft' | 'active' | 'completed';
  targetRegions: string[];
  targetMerchants: string[];
  assignedRMs: string[];
  startDate: Date;
  endDate: Date;
  metrics: CampaignMetrics;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Campaign metrics interface
 */
export interface CampaignMetrics {
  targetCount: number;
  contacted: number;
  converted: number;
  conversionRate: number; // percentage
  revenue: number; // in billions
  roi: number; // percentage
}

/**
 * Priority region interface
 */
export interface PriorityRegion {
  regionId: string;
  regionName: string;
  opportunityScore: number;
  rank: number;
  metrics: {
    potentialMerchants: number;
    dormantMerchants: number;
    estimatedRevenue: number;
    competitiveIntensity: number;
  };
  recommendation: string;
}

/**
 * Dormant merchant interface
 */
export interface DormantMerchant {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    regionId: string;
    regionName: string;
  };
  lastActivityDate: Date;
  daysSinceActivity: number;
  historicalValue: number; // in millions
  assignedRM?: string;
  priority: 'high' | 'medium' | 'low';
  contactInfo: {
    phone?: string;
    email?: string;
  };
}

/**
 * Target list interface
 */
export interface TargetList {
  regionId: string;
  regionName: string;
  merchants: Array<{
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    priority: 'high' | 'medium' | 'low';
    estimatedValue: number;
  }>;
  totalCount: number;
  totalEstimatedValue: number;
  generatedAt: Date;
}

/**
 * Follow-up action interface
 */
export interface FollowUpAction {
  id: string;
  rmId: string;
  rmName: string;
  merchantId: string;
  merchantName: string;
  actionType: 'call' | 'visit' | 'email' | 'follow-up';
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  status: 'pending' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

/**
 * Activation rates interface
 */
export interface ActivationRates {
  overall: {
    totalTargets: number;
    activated: number;
    activationRate: number; // percentage
  };
  byCampaign: Array<{
    campaignId: string;
    campaignName: string;
    activationRate: number; // percentage
    trend: 'increasing' | 'stable' | 'decreasing';
  }>;
  byRM: Array<{
    rmId: string;
    rmName: string;
    activationRate: number; // percentage
    totalActivated: number;
  }>;
  byRegion: Array<{
    regionId: string;
    regionName: string;
    activationRate: number; // percentage
  }>;
}

/**
 * Campaign filter parameters
 */
export interface CampaignFilters {
  type?: 'acquisition' | 'reactivation' | 'retention';
  status?: 'draft' | 'active' | 'completed';
  regionId?: string;
  rmId?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

/**
 * Create campaign parameters
 */
export interface CreateCampaignParams {
  name: string;
  type: 'acquisition' | 'reactivation' | 'retention';
  targetRegions: string[];
  targetMerchants?: string[];
  assignedRMs: string[];
  startDate: Date;
  endDate: Date;
}

/**
 * Update campaign parameters
 */
export interface UpdateCampaignParams {
  name?: string;
  status?: 'draft' | 'active' | 'completed';
  targetRegions?: string[];
  targetMerchants?: string[];
  assignedRMs?: string[];
  startDate?: Date;
  endDate?: Date;
}

/**
 * Hook to fetch all campaigns
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with campaigns data
 * 
 * @example
 * const { data: campaigns } = useCampaigns({ status: 'active' });
 */
export function useCampaigns(
  filters?: CampaignFilters
): UseQueryResult<Campaign[], Error> {
  return useQuery({
    queryKey: ['campaign', 'list', filters],
    queryFn: async () => {
      const response = await apiClient.get<Campaign[]>(
        API_ENDPOINTS.campaign.list,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch specific campaign
 * 
 * @param campaignId - Campaign ID
 * @returns Query result with campaign data
 * 
 * @example
 * const { data: campaign } = useCampaign('campaign-123');
 */
export function useCampaign(
  campaignId: string
): UseQueryResult<Campaign, Error> {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.campaign, campaignId);
      const response = await apiClient.get<Campaign>(endpoint);
      return response;
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch priority regions
 * 
 * @param limit - Number of priority regions to fetch
 * @param filters - Optional filter parameters
 * @returns Query result with priority regions data
 * 
 * @example
 * const { data: priorityRegions } = useCampaignPriorityRegions(20);
 */
export function useCampaignPriorityRegions(
  limit: number = 20,
  filters?: Omit<CampaignFilters, 'type' | 'status'>
): UseQueryResult<PriorityRegion[], Error> {
  return useQuery({
    queryKey: ['campaign', 'priorityRegions', limit, filters],
    queryFn: async () => {
      const response = await apiClient.get<PriorityRegion[]>(
        API_ENDPOINTS.campaign.priorityRegions,
        { params: { limit, ...filters } }
      );
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
  });
}

/**
 * Hook to fetch dormant merchants
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with dormant merchants data
 * 
 * @example
 * const { data: dormantMerchants } = useCampaignDormantMerchants({ regionId: 'region-123' });
 */
export function useCampaignDormantMerchants(
  filters?: Omit<CampaignFilters, 'type' | 'status'>
): UseQueryResult<DormantMerchant[], Error> {
  return useQuery({
    queryKey: ['campaign', 'dormantMerchants', filters],
    queryFn: async () => {
      const response = await apiClient.get<DormantMerchant[]>(
        API_ENDPOINTS.campaign.dormantMerchants,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch specific dormant merchant
 * 
 * @param merchantId - Merchant ID
 * @returns Query result with dormant merchant data
 * 
 * @example
 * const { data: merchant } = useCampaignDormantMerchant('merchant-123');
 */
export function useCampaignDormantMerchant(
  merchantId: string
): UseQueryResult<DormantMerchant, Error> {
  return useQuery({
    queryKey: ['campaign', 'dormantMerchant', merchantId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.dormantMerchant, merchantId);
      const response = await apiClient.get<DormantMerchant>(endpoint);
      return response;
    },
    enabled: !!merchantId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch target list for a region
 * 
 * @param regionId - Region ID
 * @returns Query result with target list data
 * 
 * @example
 * const { data: targetList } = useCampaignTargetList('region-123');
 */
export function useCampaignTargetList(
  regionId: string
): UseQueryResult<TargetList, Error> {
  return useQuery({
    queryKey: ['campaign', 'targetList', regionId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.targetList, regionId);
      const response = await apiClient.get<TargetList>(endpoint);
      return response;
    },
    enabled: !!regionId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch follow-up actions
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with follow-up actions data
 * 
 * @example
 * const { data: actions } = useCampaignFollowUpActions({ rmId: 'rm-123' });
 */
export function useCampaignFollowUpActions(
  filters?: Omit<CampaignFilters, 'type' | 'status'>
): UseQueryResult<FollowUpAction[], Error> {
  return useQuery({
    queryKey: ['campaign', 'followUpActions', filters],
    queryFn: async () => {
      const response = await apiClient.get<FollowUpAction[]>(
        API_ENDPOINTS.campaign.followUpActions,
        { params: filters }
      );
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - actions should be fresh
    gcTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch campaign metrics
 * 
 * @param campaignId - Campaign ID
 * @returns Query result with campaign metrics data
 * 
 * @example
 * const { data: metrics } = useCampaignMetrics('campaign-123');
 */
export function useCampaignMetrics(
  campaignId: string
): UseQueryResult<CampaignMetrics, Error> {
  return useQuery({
    queryKey: ['campaign', 'metrics', campaignId],
    queryFn: async () => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.metrics, campaignId);
      const response = await apiClient.get<CampaignMetrics>(endpoint);
      return response;
    },
    enabled: !!campaignId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to fetch activation rates
 * 
 * @param filters - Optional filter parameters
 * @returns Query result with activation rates data
 * 
 * @example
 * const { data: activationRates } = useCampaignActivationRates();
 */
export function useCampaignActivationRates(
  filters?: Omit<CampaignFilters, 'type' | 'status'>
): UseQueryResult<ActivationRates, Error> {
  return useQuery({
    queryKey: ['campaign', 'activationRates', filters],
    queryFn: async () => {
      const response = await apiClient.get<ActivationRates>(
        API_ENDPOINTS.campaign.activationRates,
        { params: filters }
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Hook to create a new campaign
 * 
 * @returns Mutation result for creating campaign
 * 
 * @example
 * const createCampaign = useCreateCampaign();
 * createCampaign.mutate({
 *   name: 'Q1 Acquisition',
 *   type: 'acquisition',
 *   targetRegions: ['region-1'],
 *   assignedRMs: ['rm-1', 'rm-2'],
 *   startDate: new Date(),
 *   endDate: new Date()
 * });
 */
export function useCreateCampaign(): UseMutationResult<Campaign, Error, CreateCampaignParams> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: CreateCampaignParams) => {
      const response = await apiClient.post<Campaign>(
        API_ENDPOINTS.campaign.create,
        params
      );
      return response;
    },
    onSuccess: () => {
      // Invalidate campaigns list to refetch
      queryClient.invalidateQueries({ queryKey: ['campaign', 'list'] });
    },
  });
}

/**
 * Hook to update a campaign
 * 
 * @returns Mutation result for updating campaign
 * 
 * @example
 * const updateCampaign = useUpdateCampaign();
 * updateCampaign.mutate({
 *   campaignId: 'campaign-123',
 *   status: 'active'
 * });
 */
export function useUpdateCampaign(): UseMutationResult<
  Campaign,
  Error,
  { campaignId: string; params: UpdateCampaignParams }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, params }) => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.update, campaignId);
      const response = await apiClient.put<Campaign>(endpoint, params);
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific campaign and list
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] });
      queryClient.invalidateQueries({ queryKey: ['campaign', 'list'] });
    },
  });
}

/**
 * Hook to delete a campaign
 * 
 * @returns Mutation result for deleting campaign
 * 
 * @example
 * const deleteCampaign = useDeleteCampaign();
 * deleteCampaign.mutate('campaign-123');
 */
export function useDeleteCampaign(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.delete, campaignId);
      await apiClient.delete(endpoint);
    },
    onSuccess: () => {
      // Invalidate campaigns list to refetch
      queryClient.invalidateQueries({ queryKey: ['campaign', 'list'] });
    },
  });
}

/**
 * Hook to download target list for a region
 * 
 * @returns Mutation result for downloading target list
 * 
 * @example
 * const downloadTargetList = useDownloadTargetList();
 * downloadTargetList.mutate('region-123');
 */
export function useDownloadTargetList(): UseMutationResult<Blob, Error, string> {
  return useMutation({
    mutationFn: async (regionId: string) => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.downloadTargetList, regionId);
      const response = await apiClient.get<Blob>(endpoint, {
        headers: { 'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
      });
      return response;
    },
  });
}

/**
 * Hook to assign campaign to RMs
 * 
 * @returns Mutation result for assigning campaign
 * 
 * @example
 * const assignCampaign = useAssignCampaign();
 * assignCampaign.mutate({
 *   campaignId: 'campaign-123',
 *   rmIds: ['rm-1', 'rm-2']
 * });
 */
export function useAssignCampaign(): UseMutationResult<
  Campaign,
  Error,
  { campaignId: string; rmIds: string[] }
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ campaignId, rmIds }) => {
      const endpoint = buildEndpoint(API_ENDPOINTS.campaign.assign, campaignId);
      const response = await apiClient.post<Campaign>(endpoint, { rmIds });
      return response;
    },
    onSuccess: (data, variables) => {
      // Invalidate specific campaign
      queryClient.invalidateQueries({ queryKey: ['campaign', variables.campaignId] });
    },
  });
}

/**
 * Hook to fetch all campaign data at once
 * 
 * Combines all campaign queries for convenience.
 * Use individual hooks if you only need specific data.
 * 
 * @param filters - Optional filter parameters
 * @returns Object with all campaign query results
 * 
 * @example
 * const campaign = useCampaignData({ status: 'active' });
 * if (campaign.campaigns.isLoading) return <Loading />;
 * return <Campaign campaigns={campaign.campaigns.data} />;
 */
export function useCampaignData(filters?: CampaignFilters) {
  const campaigns = useCampaigns(filters);
  const priorityRegions = useCampaignPriorityRegions(20, filters);
  const dormantMerchants = useCampaignDormantMerchants(filters);
  const followUpActions = useCampaignFollowUpActions(filters);
  const activationRates = useCampaignActivationRates(filters);

  return {
    campaigns,
    priorityRegions,
    dormantMerchants,
    followUpActions,
    activationRates,
    isLoading: campaigns.isLoading || priorityRegions.isLoading || 
               dormantMerchants.isLoading || followUpActions.isLoading || 
               activationRates.isLoading,
    isError: campaigns.isError || priorityRegions.isError || 
             dormantMerchants.isError || followUpActions.isError || 
             activationRates.isError,
  };
}
