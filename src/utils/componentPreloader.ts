/**
 * Component Preloader Utility
 * Preloads lazy-loaded components for expanded menu sections
 * 
 * This improves user experience by loading components in the background
 * when a user expands a menu section, so navigation feels instant.
 * 
 * Requirements: 18.3
 */

// Import all lazy-loaded page components
const componentMap = {
  // Dashboard
  dashboard: () => import('../pages/DashboardPage'),
  
  // Territorial Intelligence
  'territorial-intelligence': {
    'interactive-map': () => import('../pages/territorial/InteractiveMapView'),
    'cluster-analysis': () => import('../pages/territorial/ClusterAnalysisView'),
    'drill-down': () => import('../pages/territorial/DrillDownView'),
  },
  
  // Market Intelligence
  'market-intelligence': {
    'tam-estimation': () => import('../pages/market/TAMEstimationView'),
    'penetration-analysis': () => import('../pages/market/PenetrationAnalysisView'),
  },
  
  // Performance
  performance: {
    'rm-performance': () => import('../pages/performance/RMPerformanceView'),
    'branch-performance': () => import('../pages/performance/BranchPerformanceView'),
  },
  
  // Intelligence Assistant
  'intelligence-assistant': () => import('../pages/IntelligenceAssistantPage'),
  
  // Reporting & Analytics
  reporting: () => import('../pages/ReportingPage'),
  
  // Data Management
  'data-management': {
    'internal-data': () => import('../pages/data/InternalDataView'),
    'external-data': () => import('../pages/data/ExternalDataView'),
    'geospatial-data': () => import('../pages/data/GeospatialDataView'),
  },
  
  // Campaign & Activation
  campaign: () => import('../pages/CampaignPage'),
};

// Track which components have been preloaded to avoid duplicate requests
const preloadedComponents = new Set<string>();

/**
 * Preload a single component
 * @param menuId - The menu ID to preload components for
 */
export const preloadMenuComponents = (menuId: string): void => {
  // Skip if already preloaded
  if (preloadedComponents.has(menuId)) {
    return;
  }

  const component = componentMap[menuId as keyof typeof componentMap];
  
  if (!component) {
    return;
  }

  // If it's a function, preload the single component
  if (typeof component === 'function') {
    component().catch((error) => {
      console.error(`Failed to preload component for menu: ${menuId}`, error);
    });
    preloadedComponents.add(menuId);
  } 
  // If it's an object, preload all submenu components
  else if (typeof component === 'object') {
    Object.entries(component).forEach(([submenuId, loader]) => {
      const fullId = `${menuId}.${submenuId}`;
      if (!preloadedComponents.has(fullId)) {
        loader().catch((error) => {
          console.error(`Failed to preload component for submenu: ${fullId}`, error);
        });
        preloadedComponents.add(fullId);
      }
    });
    preloadedComponents.add(menuId);
  }
};

/**
 * Preload multiple menu components
 * @param menuIds - Array of menu IDs to preload
 */
export const preloadMultipleMenus = (menuIds: string[]): void => {
  menuIds.forEach((menuId) => {
    preloadMenuComponents(menuId);
  });
};

/**
 * Clear the preloaded components cache
 * Useful for testing or when you want to force re-preloading
 */
export const clearPreloadCache = (): void => {
  preloadedComponents.clear();
};
