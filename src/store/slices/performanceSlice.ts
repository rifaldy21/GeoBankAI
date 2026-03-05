import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface Portfolio {
  totalCustomers: number;
  totalMerchants: number;
  casaValue: number;
  creditOutstanding: number;
}

interface Targets {
  leads: number;
  acquisition: number;
  casa: number;
  qrisActivation: number;
}

interface Achievements {
  acquired: number;
  conversionRate: number;
  casaGrowth: number;
  qrisActivationRate: number;
  merchantReactivationRate: number;
}

interface RMPerformance {
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
  performanceScore: number;
}

interface BranchCoverage {
  area: number;
  districts: string[];
  villages: string[];
  radiusKm: number;
}

interface BranchKPIs {
  totalCustomers: number;
  totalMerchants: number;
  casaTotal: number;
  creditOutstanding: number;
  productivity: number;
  unaddressedOpportunities: number;
}

interface BranchPerformance {
  id: string;
  name: string;
  code: string;
  location: {
    lat: number;
    lng: number;
  };
  coverage: BranchCoverage;
  kpis: BranchKPIs;
  rmCount: number;
  territory: string;
}

interface PerformanceState {
  rmPerformances: RMPerformance[];
  branchPerformances: BranchPerformance[];
  selectedRMId: string | null;
  selectedBranchId: string | null;
  sortBy: 'performanceScore' | 'casaGrowth' | 'qrisActivationRate' | 'conversionRate';
  sortOrder: 'asc' | 'desc';
  loading: boolean;
  error: string | null;
}

const initialState: PerformanceState = {
  rmPerformances: [],
  branchPerformances: [],
  selectedRMId: null,
  selectedBranchId: null,
  sortBy: 'performanceScore',
  sortOrder: 'desc',
  loading: false,
  error: null,
};

const performanceSlice = createSlice({
  name: 'performance',
  initialState,
  reducers: {
    setRMPerformances: (state, action: PayloadAction<RMPerformance[]>) => {
      state.rmPerformances = action.payload;
    },
    setBranchPerformances: (state, action: PayloadAction<BranchPerformance[]>) => {
      state.branchPerformances = action.payload;
    },
    setSelectedRMId: (state, action: PayloadAction<string | null>) => {
      state.selectedRMId = action.payload;
    },
    setSelectedBranchId: (state, action: PayloadAction<string | null>) => {
      state.selectedBranchId = action.payload;
    },
    setSortBy: (state, action: PayloadAction<PerformanceState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<'asc' | 'desc'>) => {
      state.sortOrder = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateRMPerformance: (state, action: PayloadAction<RMPerformance>) => {
      const index = state.rmPerformances.findIndex(rm => rm.id === action.payload.id);
      if (index > -1) {
        state.rmPerformances[index] = action.payload;
      } else {
        state.rmPerformances.push(action.payload);
      }
    },
    updateBranchPerformance: (state, action: PayloadAction<BranchPerformance>) => {
      const index = state.branchPerformances.findIndex(
        branch => branch.id === action.payload.id
      );
      if (index > -1) {
        state.branchPerformances[index] = action.payload;
      } else {
        state.branchPerformances.push(action.payload);
      }
    },
    resetPerformance: (state) => {
      state.selectedRMId = null;
      state.selectedBranchId = null;
      state.error = null;
    },
  },
});

export const {
  setRMPerformances,
  setBranchPerformances,
  setSelectedRMId,
  setSelectedBranchId,
  setSortBy,
  setSortOrder,
  setLoading,
  setError,
  updateRMPerformance,
  updateBranchPerformance,
  resetPerformance,
} = performanceSlice.actions;

// Selectors
export const selectRMPerformances = (state: RootState) => state.performance.rmPerformances;
export const selectBranchPerformances = (state: RootState) => state.performance.branchPerformances;
export const selectSelectedRMId = (state: RootState) => state.performance.selectedRMId;
export const selectSelectedBranchId = (state: RootState) => state.performance.selectedBranchId;
export const selectSortBy = (state: RootState) => state.performance.sortBy;
export const selectSortOrder = (state: RootState) => state.performance.sortOrder;
export const selectPerformanceLoading = (state: RootState) => state.performance.loading;
export const selectPerformanceError = (state: RootState) => state.performance.error;

export const selectSortedRMPerformances = (state: RootState) => {
  const { rmPerformances, sortBy, sortOrder } = state.performance;
  const sorted = [...rmPerformances].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortBy) {
      case 'performanceScore':
        aValue = a.performanceScore;
        bValue = b.performanceScore;
        break;
      case 'casaGrowth':
        aValue = a.achievements.casaGrowth;
        bValue = b.achievements.casaGrowth;
        break;
      case 'qrisActivationRate':
        aValue = a.achievements.qrisActivationRate;
        bValue = b.achievements.qrisActivationRate;
        break;
      case 'conversionRate':
        aValue = a.achievements.conversionRate;
        bValue = b.achievements.conversionRate;
        break;
      default:
        aValue = a.performanceScore;
        bValue = b.performanceScore;
    }

    return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
  });

  return sorted;
};

export const selectRMById = (rmId: string) => (state: RootState) =>
  state.performance.rmPerformances.find(rm => rm.id === rmId);

export const selectBranchById = (branchId: string) => (state: RootState) =>
  state.performance.branchPerformances.find(branch => branch.id === branchId);

export default performanceSlice.reducer;
