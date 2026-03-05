/**
 * API Endpoints Configuration
 * 
 * Centralized endpoint definitions for all modules in the BRI Intelligence Dashboard.
 * Organized by module for maintainability and easy reference.
 * 
 * Modules:
 * - Dashboard: Executive overview with KPIs and national insights
 * - Territorial Intelligence: Geospatial analysis with maps and drill-down
 * - Market Intelligence: TAM estimation and penetration analysis
 * - Performance: RM and branch performance tracking
 * - Intelligence Assistant: AI-powered conversational analytics
 * - Reporting & Analytics: Pivot analysis and time series reporting
 * - Data Management: Internal, external, and geospatial data management
 * - Campaign & Activation: Targeting and merchant reactivation campaigns
 */

/**
 * API Endpoints organized by module
 */
export const API_ENDPOINTS = {
  /**
   * Dashboard Module
   * Executive overview with KPIs, national insights, and alerts
   */
  dashboard: {
    // Get all dashboard KPIs (Total Nasabah, Total Merchant, CASA Growth, etc.)
    kpis: '/dashboard/kpis',
    
    // Get national heatmap data
    heatmap: '/dashboard/heatmap',
    
    // Get top regions by opportunity gap
    topRegions: '/dashboard/top-regions',
    
    // Get growth trends (MoM, YoY)
    trends: '/dashboard/trends',
    
    // Get AI-generated alerts and insights
    alerts: '/dashboard/alerts',
    
    // Get quick insights summary
    insights: '/dashboard/insights',
  },

  /**
   * Territorial Intelligence Module
   * Geospatial analysis with interactive maps, clusters, and drill-down
   */
  territorial: {
    // Get all regions with metrics
    regions: '/territorial/regions',
    
    // Get specific region details
    region: (regionId: string) => `/territorial/regions/${regionId}`,
    
    // Get map layers (branch, ATM, merchant, customer, competitor, POI)
    layers: '/territorial/layers',
    
    // Get specific layer data
    layer: (layerId: string) => `/territorial/layers/${layerId}`,
    
    // Get heatmap data (CASA density, QRIS adoption, credit outstanding, merchant density)
    heatmaps: '/territorial/heatmaps',
    
    // Get specific heatmap data
    heatmap: (heatmapId: string) => `/territorial/heatmaps/${heatmapId}`,
    
    // Get administrative boundaries (province, city, district, village)
    boundaries: '/territorial/boundaries',
    
    // Get specific boundary level
    boundary: (level: string) => `/territorial/boundaries/${level}`,
    
    // Get cluster analysis data
    clusters: '/territorial/clusters',
    
    // Get area analysis data
    areaAnalysis: '/territorial/area-analysis',
    
    // Get drill-down data for a region
    drillDown: (regionId: string) => `/territorial/drill-down/${regionId}`,
    
    // Get radius analysis data
    radiusAnalysis: '/territorial/radius-analysis',
    
    // Get polygon selection analysis
    polygonAnalysis: '/territorial/polygon-analysis',
  },

  /**
   * Market Intelligence Module
   * TAM estimation and penetration analysis
   */
  market: {
    // Get TAM estimation data
    tam: '/market/tam-estimation',
    
    // Get TAM for specific region
    tamByRegion: (regionId: string) => `/market/tam-estimation/${regionId}`,
    
    // Get penetration analysis data
    penetration: '/market/penetration-analysis',
    
    // Get penetration by product category
    penetrationByProduct: (product: string) => `/market/penetration-analysis/product/${product}`,
    
    // Get gap analysis data
    gapAnalysis: '/market/gap-analysis',
    
    // Get priority regions for expansion
    priorityRegions: '/market/priority-regions',
    
    // Get market share estimation
    marketShare: '/market/market-share',
    
    // Get competitive intelligence
    competitive: '/market/competitive-analysis',
  },

  /**
   * Performance Module
   * RM and branch performance tracking
   */
  performance: {
    // Get all RM performance data
    rms: '/performance/rms',
    
    // Get specific RM performance
    rm: (rmId: string) => `/performance/rms/${rmId}`,
    
    // Get RM leaderboard
    leaderboard: '/performance/rms/leaderboard',
    
    // Get RM portfolio summary
    portfolio: (rmId: string) => `/performance/rms/${rmId}/portfolio`,
    
    // Get RM targets vs realization
    targets: (rmId: string) => `/performance/rms/${rmId}/targets`,
    
    // Get all branch performance data
    branches: '/performance/branches',
    
    // Get specific branch performance
    branch: (branchId: string) => `/performance/branches/${branchId}`,
    
    // Get branch coverage data
    coverage: (branchId: string) => `/performance/branches/${branchId}/coverage`,
    
    // Get branch productivity metrics
    productivity: (branchId: string) => `/performance/branches/${branchId}/productivity`,
    
    // Get branch opportunities
    opportunities: (branchId: string) => `/performance/branches/${branchId}/opportunities`,
  },

  /**
   * Intelligence Assistant Module
   * AI-powered conversational analytics with visual outputs
   */
  ai: {
    // Send chat message and get AI response
    chat: '/ai/chat',
    
    // Get chat history
    history: '/ai/chat/history',
    
    // Clear chat history
    clearHistory: '/ai/chat/clear',
    
    // Generate visual output (chart, table, map)
    generateVisual: '/ai/generate-visual',
    
    // Get suggested questions
    suggestions: '/ai/suggestions',
    
    // Analyze query intent
    analyzeQuery: '/ai/analyze-query',
    
    // Get AI insights for specific data
    insights: '/ai/insights',
  },

  /**
   * Reporting & Analytics Module
   * Pivot analysis and time series reporting
   */
  reporting: {
    // Get pivot table data
    pivot: '/reporting/pivot',
    
    // Get time series analysis
    timeSeries: '/reporting/time-series',
    
    // Get product segmentation analysis
    productSegmentation: '/reporting/product-segmentation',
    
    // Export report to Excel
    exportExcel: '/reporting/export/excel',
    
    // Export report to PDF
    exportPdf: '/reporting/export/pdf',
    
    // Get saved reports
    savedReports: '/reporting/saved',
    
    // Save report configuration
    saveReport: '/reporting/save',
    
    // Delete saved report
    deleteReport: (reportId: string) => `/reporting/saved/${reportId}`,
  },

  /**
   * Data Management Module
   * Internal, external, and geospatial data management
   */
  data: {
    /**
     * Internal Data
     * Customer, merchant, transaction, RM, and branch data
     */
    internal: {
      // Customer data
      customers: '/data/internal/customers',
      customer: (customerId: string) => `/data/internal/customers/${customerId}`,
      
      // Merchant data
      merchants: '/data/internal/merchants',
      merchant: (merchantId: string) => `/data/internal/merchants/${merchantId}`,
      
      // Transaction data
      transactions: '/data/internal/transactions',
      transaction: (transactionId: string) => `/data/internal/transactions/${transactionId}`,
      
      // RM data
      rms: '/data/internal/rms',
      rm: (rmId: string) => `/data/internal/rms/${rmId}`,
      
      // Branch data
      branches: '/data/internal/branches',
      branch: (branchId: string) => `/data/internal/branches/${branchId}`,
      
      // Data quality metrics
      qualityMetrics: '/data/internal/quality-metrics',
    },

    /**
     * External Data
     * Demographics, regional GDP, POI, and merchant directory
     */
    external: {
      // Demographic data
      demographics: '/data/external/demographics',
      demographic: (regionId: string) => `/data/external/demographics/${regionId}`,
      
      // Regional GDP data
      gdp: '/data/external/gdp',
      gdpByRegion: (regionId: string) => `/data/external/gdp/${regionId}`,
      
      // POI (Point of Interest) data
      pois: '/data/external/pois',
      poi: (poiId: string) => `/data/external/pois/${poiId}`,
      
      // Merchant directory data
      merchantDirectory: '/data/external/merchant-directory',
      
      // Data source information
      sources: '/data/external/sources',
      
      // Import external data
      import: '/data/external/import',
    },

    /**
     * Geospatial Data
     * Administrative boundaries, coordinates, and map layers
     */
    geospatial: {
      // Administrative boundary data
      boundaries: '/data/geospatial/boundaries',
      boundary: (boundaryId: string) => `/data/geospatial/boundaries/${boundaryId}`,
      
      // Upload boundary polygon (GeoJSON)
      uploadBoundary: '/data/geospatial/boundaries/upload',
      
      // Coordinate data
      coordinates: '/data/geospatial/coordinates',
      coordinate: (coordinateId: string) => `/data/geospatial/coordinates/${coordinateId}`,
      
      // Validate coordinates
      validateCoordinates: '/data/geospatial/coordinates/validate',
      
      // Map layer configurations
      layers: '/data/geospatial/layers',
      layer: (layerId: string) => `/data/geospatial/layers/${layerId}`,
      
      // Update layer configuration
      updateLayer: (layerId: string) => `/data/geospatial/layers/${layerId}`,
    },

    /**
     * File Upload
     * Generic file upload endpoint for all data types
     */
    upload: '/data/upload',
    
    /**
     * Data Validation
     * Validate data before import
     */
    validate: '/data/validate',
  },

  /**
   * Campaign & Activation Module
   * Targeting and merchant reactivation campaigns
   */
  campaign: {
    // Get all campaigns
    list: '/campaign/list',
    
    // Get specific campaign
    campaign: (campaignId: string) => `/campaign/${campaignId}`,
    
    // Create new campaign
    create: '/campaign/create',
    
    // Update campaign
    update: (campaignId: string) => `/campaign/${campaignId}`,
    
    // Delete campaign
    delete: (campaignId: string) => `/campaign/${campaignId}`,
    
    // Get priority regions
    priorityRegions: '/campaign/priority-regions',
    
    // Get dormant merchants
    dormantMerchants: '/campaign/dormant-merchants',
    
    // Get dormant merchant details
    dormantMerchant: (merchantId: string) => `/campaign/dormant-merchants/${merchantId}`,
    
    // Generate target list for region
    targetList: (regionId: string) => `/campaign/target-list/${regionId}`,
    
    // Download target list
    downloadTargetList: (regionId: string) => `/campaign/target-list/${regionId}/download`,
    
    // Get follow-up actions for RMs
    followUpActions: '/campaign/follow-up-actions',
    
    // Get campaign metrics
    metrics: (campaignId: string) => `/campaign/${campaignId}/metrics`,
    
    // Get activation success rates
    activationRates: '/campaign/activation-rates',
    
    // Assign campaign to RMs
    assign: (campaignId: string) => `/campaign/${campaignId}/assign`,
  },

  /**
   * Authentication & User Management
   * User authentication and profile management
   */
  auth: {
    // User login
    login: '/auth/login',
    
    // User logout
    logout: '/auth/logout',
    
    // Refresh authentication token
    refresh: '/auth/refresh',
    
    // Get current user profile
    profile: '/auth/profile',
    
    // Update user profile
    updateProfile: '/auth/profile/update',
    
    // Change password
    changePassword: '/auth/password/change',
    
    // Reset password
    resetPassword: '/auth/password/reset',
  },

  /**
   * System & Configuration
   * System settings and configuration
   */
  system: {
    // Get system configuration
    config: '/system/config',
    
    // Update system configuration
    updateConfig: '/system/config/update',
    
    // Get system health status
    health: '/system/health',
    
    // Get system version
    version: '/system/version',
  },
} as const;

/**
 * Helper function to build endpoint URL with parameters
 * 
 * @param endpoint - The endpoint string or function
 * @param params - Parameters to pass to endpoint function
 * @returns The complete endpoint URL
 * 
 * @example
 * buildEndpoint(API_ENDPOINTS.territorial.region, 'region-123')
 * // Returns: '/territorial/regions/region-123'
 */
export function buildEndpoint(
  endpoint: string | ((...args: any[]) => string),
  ...params: any[]
): string {
  if (typeof endpoint === 'function') {
    return endpoint(...params);
  }
  return endpoint;
}

/**
 * Type-safe endpoint builder with validation
 * 
 * @param module - The module name
 * @param endpoint - The endpoint name
 * @param params - Optional parameters for dynamic endpoints
 * @returns The complete endpoint URL
 * 
 * @example
 * getEndpoint('territorial', 'region', 'region-123')
 * // Returns: '/territorial/regions/region-123'
 */
export function getEndpoint(
  module: keyof typeof API_ENDPOINTS,
  endpoint: string,
  ...params: any[]
): string {
  const moduleEndpoints = API_ENDPOINTS[module] as any;
  
  if (!moduleEndpoints) {
    throw new Error(`Module "${module}" not found in API_ENDPOINTS`);
  }
  
  const endpointValue = moduleEndpoints[endpoint];
  
  if (!endpointValue) {
    throw new Error(`Endpoint "${endpoint}" not found in module "${module}"`);
  }
  
  return buildEndpoint(endpointValue, ...params);
}

/**
 * Export endpoint categories for easy access
 */
export const {
  dashboard,
  territorial,
  market,
  performance,
  ai,
  reporting,
  data,
  campaign,
  auth,
  system,
} = API_ENDPOINTS;

export default API_ENDPOINTS;
