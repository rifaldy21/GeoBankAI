import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface DataQualityMetrics {
  completeness: number;
  accuracy: number;
  consistency: number;
  timeliness: number;
}

interface DataSource {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'geospatial';
  category: string;
  lastUpdated: Date;
  recordCount: number;
  qualityMetrics: DataQualityMetrics;
}

interface Customer {
  id: string;
  name: string;
  type: string;
  branch: string;
  rm: string;
  casaBalance: number;
  creditOutstanding: number;
  status: string;
}

interface Merchant {
  id: string;
  name: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  branch: string;
  rm: string;
  qrisActive: boolean;
  lastTransactionDate: Date;
  status: string;
}

interface Transaction {
  id: string;
  date: Date;
  customerId: string;
  merchantId?: string;
  type: string;
  amount: number;
  channel: string;
}

interface InternalData {
  customers: Customer[];
  merchants: Merchant[];
  transactions: Transaction[];
}

interface DemographicData {
  regionId: string;
  regionName: string;
  population: number;
  productivePopulation: number;
  averageIncome: number;
  urbanizationRate: number;
}

interface GDPData {
  regionId: string;
  regionName: string;
  gdp: number;
  gdpPerCapita: number;
  growthRate: number;
  year: number;
}

interface POI {
  id: string;
  name: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
  regionId: string;
}

interface ExternalData {
  demographics: DemographicData[];
  regionalGDP: GDPData[];
  pois: POI[];
}

interface BoundaryData {
  id: string;
  level: 'province' | 'city' | 'district' | 'village';
  name: string;
  geojson: any;
  parentId?: string;
}

interface CoordinateData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  type: string;
  accuracy: number;
}

interface GeospatialData {
  boundaries: BoundaryData[];
  coordinates: CoordinateData[];
}

interface DataState {
  internal: InternalData;
  external: ExternalData;
  geospatial: GeospatialData;
  dataSources: DataSource[];
  selectedDataType: 'internal' | 'external' | 'geospatial' | null;
  selectedCategory: string | null;
  filters: Record<string, any>;
  loading: boolean;
  error: string | null;
}

const initialState: DataState = {
  internal: {
    customers: [],
    merchants: [],
    transactions: [],
  },
  external: {
    demographics: [],
    regionalGDP: [],
    pois: [],
  },
  geospatial: {
    boundaries: [],
    coordinates: [],
  },
  dataSources: [],
  selectedDataType: null,
  selectedCategory: null,
  filters: {},
  loading: false,
  error: null,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setInternalData: (state, action: PayloadAction<Partial<InternalData>>) => {
      state.internal = { ...state.internal, ...action.payload };
    },
    setExternalData: (state, action: PayloadAction<Partial<ExternalData>>) => {
      state.external = { ...state.external, ...action.payload };
    },
    setGeospatialData: (state, action: PayloadAction<Partial<GeospatialData>>) => {
      state.geospatial = { ...state.geospatial, ...action.payload };
    },
    setDataSources: (state, action: PayloadAction<DataSource[]>) => {
      state.dataSources = action.payload;
    },
    setSelectedDataType: (state, action: PayloadAction<'internal' | 'external' | 'geospatial' | null>) => {
      state.selectedDataType = action.payload;
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },
    setFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.filters = action.payload;
    },
    updateFilter: (state, action: PayloadAction<{ key: string; value: any }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.internal.customers.push(action.payload);
    },
    updateCustomer: (state, action: PayloadAction<Customer>) => {
      const index = state.internal.customers.findIndex(c => c.id === action.payload.id);
      if (index > -1) {
        state.internal.customers[index] = action.payload;
      }
    },
    addMerchant: (state, action: PayloadAction<Merchant>) => {
      state.internal.merchants.push(action.payload);
    },
    updateMerchant: (state, action: PayloadAction<Merchant>) => {
      const index = state.internal.merchants.findIndex(m => m.id === action.payload.id);
      if (index > -1) {
        state.internal.merchants[index] = action.payload;
      }
    },
    addBoundary: (state, action: PayloadAction<BoundaryData>) => {
      state.geospatial.boundaries.push(action.payload);
    },
    updateBoundary: (state, action: PayloadAction<BoundaryData>) => {
      const index = state.geospatial.boundaries.findIndex(b => b.id === action.payload.id);
      if (index > -1) {
        state.geospatial.boundaries[index] = action.payload;
      }
    },
    updateDataSourceQuality: (state, action: PayloadAction<{ id: string; metrics: DataQualityMetrics }>) => {
      const source = state.dataSources.find(s => s.id === action.payload.id);
      if (source) {
        source.qualityMetrics = action.payload.metrics;
      }
    },
    resetData: (state) => {
      state.selectedDataType = null;
      state.selectedCategory = null;
      state.filters = {};
      state.error = null;
    },
  },
});

export const {
  setInternalData,
  setExternalData,
  setGeospatialData,
  setDataSources,
  setSelectedDataType,
  setSelectedCategory,
  setFilters,
  updateFilter,
  clearFilters,
  setLoading,
  setError,
  addCustomer,
  updateCustomer,
  addMerchant,
  updateMerchant,
  addBoundary,
  updateBoundary,
  updateDataSourceQuality,
  resetData,
} = dataSlice.actions;

// Selectors
export const selectInternalData = (state: RootState) => state.data.internal;
export const selectExternalData = (state: RootState) => state.data.external;
export const selectGeospatialData = (state: RootState) => state.data.geospatial;
export const selectDataSources = (state: RootState) => state.data.dataSources;
export const selectSelectedDataType = (state: RootState) => state.data.selectedDataType;
export const selectSelectedCategory = (state: RootState) => state.data.selectedCategory;
export const selectFilters = (state: RootState) => state.data.filters;
export const selectDataLoading = (state: RootState) => state.data.loading;
export const selectDataError = (state: RootState) => state.data.error;

export const selectCustomers = (state: RootState) => state.data.internal.customers;
export const selectMerchants = (state: RootState) => state.data.internal.merchants;
export const selectTransactions = (state: RootState) => state.data.internal.transactions;

export const selectDataSourcesByType = (type: 'internal' | 'external' | 'geospatial') => (state: RootState) =>
  state.data.dataSources.filter(source => source.type === type);

export const selectBoundariesByLevel = (level: 'province' | 'city' | 'district' | 'village') => (state: RootState) =>
  state.data.geospatial.boundaries.filter(boundary => boundary.level === level);

export default dataSlice.reducer;
