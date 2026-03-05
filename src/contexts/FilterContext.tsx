import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Date range interface
export interface DateRange {
  startDate: Date;
  endDate: Date;
}

// Global filters interface
export interface GlobalFilters {
  dateRange: DateRange;
  territory: string[];
  branch: string[];
  product: string[];
  rmId?: string;
}

// Filter context value interface
export interface FilterContextValue {
  filters: GlobalFilters;
  updateFilters: (filters: Partial<GlobalFilters>) => void;
  resetFilters: () => void;
}

// Create context with undefined default
const FilterContext = createContext<FilterContextValue | undefined>(undefined);

// Default filter values
const DEFAULT_FILTERS: GlobalFilters = {
  dateRange: {
    startDate: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), // Last month start
    endDate: new Date(), // Today
  },
  territory: [],
  branch: [],
  product: [],
  rmId: undefined,
};

// FilterProvider props
interface FilterProviderProps {
  children: ReactNode;
}

// FilterProvider component
export const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
  const [filters, setFilters] = useState<GlobalFilters>(DEFAULT_FILTERS);

  // Update filters function - merges partial updates with existing filters
  const updateFilters = useCallback((newFilters: Partial<GlobalFilters>): void => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  }, []);

  // Reset filters to default values
  const resetFilters = useCallback((): void => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const value: FilterContextValue = {
    filters,
    updateFilters,
    resetFilters,
  };

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
};

// Custom hook to use filter context
export const useFilters = (): FilterContextValue => {
  const context = useContext(FilterContext);
  
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider');
  }
  
  return context;
};
