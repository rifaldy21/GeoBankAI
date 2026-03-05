import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface GeoPoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  metadata?: Record<string, any>;
}

interface MapLayer {
  id: string;
  name: string;
  type: 'branch' | 'atm' | 'merchant' | 'customer' | 'competitor' | 'poi';
  data: GeoPoint[];
  visible: boolean;
  icon?: string;
  color?: string;
}

interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

interface HeatmapLayer {
  id: string;
  name: string;
  type: 'casa' | 'qris' | 'credit' | 'merchant-density';
  data: HeatmapPoint[];
  visible: boolean;
  gradient?: string[];
}

interface BoundaryLayer {
  id: string;
  level: 'province' | 'city' | 'district' | 'village';
  geojson: any;
  visible: boolean;
}

interface Region {
  id: string;
  name: string;
  level: 'province' | 'city' | 'district' | 'village';
  parentId?: string;
  boundary?: any;
  center?: [number, number];
  metrics?: {
    totalCustomers: number;
    totalMerchants: number;
    transactionVolume: number;
    assignedRMs: number;
    targetRealization: number;
    opportunityScore: number;
  };
}

interface TerritorialState {
  selectedRegion: Region | null;
  mapLayers: MapLayer[];
  heatmaps: HeatmapLayer[];
  boundaries: BoundaryLayer[];
  drillDownHistory: Region[];
}

const initialState: TerritorialState = {
  selectedRegion: null,
  mapLayers: [],
  heatmaps: [],
  boundaries: [],
  drillDownHistory: [],
};

const territorialSlice = createSlice({
  name: 'territorial',
  initialState,
  reducers: {
    setSelectedRegion: (state, action: PayloadAction<Region | null>) => {
      state.selectedRegion = action.payload;
    },
    toggleMapLayer: (state, action: PayloadAction<string>) => {
      const layer = state.mapLayers.find(l => l.id === action.payload);
      if (layer) {
        layer.visible = !layer.visible;
      }
    },
    toggleHeatmap: (state, action: PayloadAction<string>) => {
      const heatmap = state.heatmaps.find(h => h.id === action.payload);
      if (heatmap) {
        heatmap.visible = !heatmap.visible;
      }
    },
    toggleBoundary: (state, action: PayloadAction<string>) => {
      const boundary = state.boundaries.find(b => b.id === action.payload);
      if (boundary) {
        boundary.visible = !boundary.visible;
      }
    },
    setMapLayers: (state, action: PayloadAction<MapLayer[]>) => {
      state.mapLayers = action.payload;
    },
    setHeatmaps: (state, action: PayloadAction<HeatmapLayer[]>) => {
      state.heatmaps = action.payload;
    },
    setBoundaries: (state, action: PayloadAction<BoundaryLayer[]>) => {
      state.boundaries = action.payload;
    },
    addToDrillDownHistory: (state, action: PayloadAction<Region>) => {
      state.drillDownHistory.push(action.payload);
    },
    popDrillDownHistory: (state) => {
      state.drillDownHistory.pop();
    },
    clearDrillDownHistory: (state) => {
      state.drillDownHistory = [];
    },
    resetTerritorial: (state) => {
      state.selectedRegion = null;
      state.drillDownHistory = [];
    },
  },
});

export const {
  setSelectedRegion,
  toggleMapLayer,
  toggleHeatmap,
  toggleBoundary,
  setMapLayers,
  setHeatmaps,
  setBoundaries,
  addToDrillDownHistory,
  popDrillDownHistory,
  clearDrillDownHistory,
  resetTerritorial,
} = territorialSlice.actions;

// Selectors
export const selectSelectedRegion = (state: RootState) => state.territorial.selectedRegion;
export const selectMapLayers = (state: RootState) => state.territorial.mapLayers;
export const selectHeatmaps = (state: RootState) => state.territorial.heatmaps;
export const selectBoundaries = (state: RootState) => state.territorial.boundaries;
export const selectDrillDownHistory = (state: RootState) => state.territorial.drillDownHistory;
export const selectVisibleMapLayers = (state: RootState) =>
  state.territorial.mapLayers.filter(layer => layer.visible);
export const selectVisibleHeatmaps = (state: RootState) =>
  state.territorial.heatmaps.filter(heatmap => heatmap.visible);

export default territorialSlice.reducer;
