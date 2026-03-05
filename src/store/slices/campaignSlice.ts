import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface CampaignMetrics {
  targetCount: number;
  contacted: number;
  converted: number;
  conversionRate: number;
  revenue: number;
}

interface Campaign {
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
}

interface DormantMerchant {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
  };
  lastActivityDate: Date;
  daysSinceActivity: number;
  historicalValue: number;
  assignedRM?: string;
  priority: 'high' | 'medium' | 'low';
}

interface PriorityRegion {
  regionId: string;
  regionName: string;
  opportunityScore: number;
  potentialRevenue: number;
  merchantCount: number;
  rank: number;
}

interface CampaignState {
  campaigns: Campaign[];
  dormantMerchants: DormantMerchant[];
  priorityRegions: PriorityRegion[];
  selectedCampaignId: string | null;
  selectedRegionId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: CampaignState = {
  campaigns: [],
  dormantMerchants: [],
  priorityRegions: [],
  selectedCampaignId: null,
  selectedRegionId: null,
  loading: false,
  error: null,
};

const campaignSlice = createSlice({
  name: 'campaign',
  initialState,
  reducers: {
    setCampaigns: (state, action: PayloadAction<Campaign[]>) => {
      state.campaigns = action.payload;
    },
    setDormantMerchants: (state, action: PayloadAction<DormantMerchant[]>) => {
      state.dormantMerchants = action.payload;
    },
    setPriorityRegions: (state, action: PayloadAction<PriorityRegion[]>) => {
      state.priorityRegions = action.payload.sort((a, b) => b.opportunityScore - a.opportunityScore);
    },
    setSelectedCampaignId: (state, action: PayloadAction<string | null>) => {
      state.selectedCampaignId = action.payload;
    },
    setSelectedRegionId: (state, action: PayloadAction<string | null>) => {
      state.selectedRegionId = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addCampaign: (state, action: PayloadAction<Campaign>) => {
      state.campaigns.push(action.payload);
    },
    updateCampaign: (state, action: PayloadAction<Campaign>) => {
      const index = state.campaigns.findIndex(c => c.id === action.payload.id);
      if (index > -1) {
        state.campaigns[index] = action.payload;
      }
    },
    deleteCampaign: (state, action: PayloadAction<string>) => {
      state.campaigns = state.campaigns.filter(c => c.id !== action.payload);
    },
    updateCampaignMetrics: (state, action: PayloadAction<{ id: string; metrics: CampaignMetrics }>) => {
      const campaign = state.campaigns.find(c => c.id === action.payload.id);
      if (campaign) {
        campaign.metrics = action.payload.metrics;
      }
    },
    updateDormantMerchant: (state, action: PayloadAction<DormantMerchant>) => {
      const index = state.dormantMerchants.findIndex(m => m.id === action.payload.id);
      if (index > -1) {
        state.dormantMerchants[index] = action.payload;
      } else {
        state.dormantMerchants.push(action.payload);
      }
    },
    resetCampaign: (state) => {
      state.selectedCampaignId = null;
      state.selectedRegionId = null;
      state.error = null;
    },
  },
});

export const {
  setCampaigns,
  setDormantMerchants,
  setPriorityRegions,
  setSelectedCampaignId,
  setSelectedRegionId,
  setLoading,
  setError,
  addCampaign,
  updateCampaign,
  deleteCampaign,
  updateCampaignMetrics,
  updateDormantMerchant,
  resetCampaign,
} = campaignSlice.actions;

// Selectors
export const selectCampaigns = (state: RootState) => state.campaign.campaigns;
export const selectDormantMerchants = (state: RootState) => state.campaign.dormantMerchants;
export const selectPriorityRegions = (state: RootState) => state.campaign.priorityRegions;
export const selectSelectedCampaignId = (state: RootState) => state.campaign.selectedCampaignId;
export const selectSelectedRegionId = (state: RootState) => state.campaign.selectedRegionId;
export const selectCampaignLoading = (state: RootState) => state.campaign.loading;
export const selectCampaignError = (state: RootState) => state.campaign.error;

export const selectActiveCampaigns = (state: RootState) =>
  state.campaign.campaigns.filter(c => c.status === 'active');

export const selectCampaignById = (campaignId: string) => (state: RootState) =>
  state.campaign.campaigns.find(c => c.id === campaignId);

export const selectDormantMerchantsByPriority = (priority: 'high' | 'medium' | 'low') => (state: RootState) =>
  state.campaign.dormantMerchants.filter(m => m.priority === priority);

export const selectMerchantsInRegion = (regionId: string) => (state: RootState) =>
  state.campaign.dormantMerchants.filter(m => {
    // This would need actual region matching logic based on merchant location
    // For now, returning all merchants as placeholder
    return true;
  });

export default campaignSlice.reducer;
