import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface TAMEstimation {
  regionId: string;
  regionName: string;
  productivePopulation: number;
  potentialMerchants: number;
  purchasingPower: number;
  marketSize: number;
  currentPenetration: number;
  estimatedGap: number;
}

interface ProductPenetration {
  product: 'CASA' | 'Credit' | 'QRIS' | 'Savings';
  penetrationRate: number;
  potential: number;
  gap: number;
}

interface PenetrationAnalysis {
  regionId: string;
  regionName: string;
  productCategories: ProductPenetration[];
  overallPenetration: number;
  gapVsPotential: number;
  priorityScore: number;
}

interface MarketState {
  tamEstimations: TAMEstimation[];
  penetrationAnalysis: PenetrationAnalysis[];
  selectedRegionId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: MarketState = {
  tamEstimations: [],
  penetrationAnalysis: [],
  selectedRegionId: null,
  loading: false,
  error: null,
};

const marketSlice = createSlice({
  name: 'market',
  initialState,
  reducers: {
    setTAMEstimations: (state, action: PayloadAction<TAMEstimation[]>) => {
      state.tamEstimations = action.payload;
    },
    setPenetrationAnalysis: (state, action: PayloadAction<PenetrationAnalysis[]>) => {
      state.penetrationAnalysis = action.payload;
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
    updateTAMEstimation: (state, action: PayloadAction<TAMEstimation>) => {
      const index = state.tamEstimations.findIndex(
        tam => tam.regionId === action.payload.regionId
      );
      if (index > -1) {
        state.tamEstimations[index] = action.payload;
      } else {
        state.tamEstimations.push(action.payload);
      }
    },
    updatePenetrationAnalysis: (state, action: PayloadAction<PenetrationAnalysis>) => {
      const index = state.penetrationAnalysis.findIndex(
        pa => pa.regionId === action.payload.regionId
      );
      if (index > -1) {
        state.penetrationAnalysis[index] = action.payload;
      } else {
        state.penetrationAnalysis.push(action.payload);
      }
    },
    resetMarket: (state) => {
      state.selectedRegionId = null;
      state.error = null;
    },
  },
});

export const {
  setTAMEstimations,
  setPenetrationAnalysis,
  setSelectedRegionId,
  setLoading,
  setError,
  updateTAMEstimation,
  updatePenetrationAnalysis,
  resetMarket,
} = marketSlice.actions;

// Selectors
export const selectTAMEstimations = (state: RootState) => state.market.tamEstimations;
export const selectPenetrationAnalysis = (state: RootState) => state.market.penetrationAnalysis;
export const selectSelectedRegionId = (state: RootState) => state.market.selectedRegionId;
export const selectMarketLoading = (state: RootState) => state.market.loading;
export const selectMarketError = (state: RootState) => state.market.error;
export const selectTAMByRegion = (regionId: string) => (state: RootState) =>
  state.market.tamEstimations.find(tam => tam.regionId === regionId);
export const selectPenetrationByRegion = (regionId: string) => (state: RootState) =>
  state.market.penetrationAnalysis.find(pa => pa.regionId === regionId);

export default marketSlice.reducer;
