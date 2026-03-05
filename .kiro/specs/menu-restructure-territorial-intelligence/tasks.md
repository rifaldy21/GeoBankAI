# Implementation Plan: Menu Restructure & Territorial Intelligence

## Overview

This implementation plan transforms the BRI Intelligence Dashboard from a 3-menu structure to a comprehensive 8-menu navigation system with multi-level submenus. The implementation follows an 8-phase approach over 8 weeks, building from foundation to full feature set with integrated testing.

**Technology Stack**: React 19, TypeScript, Vite, React Router v6, Redux Toolkit, React Query, Tailwind CSS, Recharts, Leaflet, fast-check

**Key Implementation Notes**:
- Existing Chatbot component only needs minor enhancements (visual outputs + rename to "Intelligence Assistant")
- Market Intelligence has 2 submenus (TAM Estimation, Penetration & Gap Analysis)
- Reuse existing components: StatCard, TrendChart, GeoMap, LeafletMap, RMPerformanceCard, RMLeaderboard, FilterPanel
- Property-based testing with minimum 100 iterations per property

## Tasks

### Phase 1: Foundation Setup (Week 1-2)

- [x] 1. Install and configure project dependencies
  - Install React Router v6: `npm install react-router-dom@6`
  - Install Redux Toolkit: `npm install @reduxjs/toolkit react-redux`
  - Install React Query: `npm install @tanstack/react-query`
  - Install fast-check for property-based testing: `npm install --save-dev fast-check`
  - Verify all dependencies are properly installed and compatible
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 2. Set up routing infrastructure
  - [x] 2.1 Create routing configuration file at `src/routes/index.tsx`
    - Define route structure for all 8 main menus and 17 submenu items
    - Implement nested routes for modules with submenus (Territorial Intelligence, Market Intelligence, Performance, Data Management)
    - Add index route redirects for parent routes (e.g., `/territorial-intelligence` → `/territorial-intelligence/interactive-map`)
    - Configure route guards for role-based access control
    - _Requirements: 1.1, 1.2, 1.3, 16.1, 16.2, 16.3, 16.4_

  - [x] 2.2 Create Layout component at `src/components/Layout.tsx`
    - Implement Layout component with Header, Sidebar, and Outlet for page content
    - Add responsive container structure with proper spacing
    - Integrate React Router's Outlet component for nested route rendering
    - _Requirements: 1.1, 17.1, 17.2_

  - [ ]* 2.3 Write property test for route navigation
    - **Property 2: Navigation Without Submenus**
    - **Validates: Requirements 1.3**

- [x] 3. Set up state management infrastructure
  - [x] 3.1 Create Redux store configuration at `src/store/index.ts`
    - Configure Redux store with Redux Toolkit
    - Set up Redux DevTools integration
    - Create initial slice structure (navigation, territorial, market, performance, campaign, data)
    - _Requirements: 1.4, 1.5, 1.6_

  - [x] 3.2 Create AuthContext at `src/contexts/AuthContext.tsx`
    - Define User interface with role, assignedArea, and permissions
    - Implement AuthContext with user state, login, logout, and hasPermission methods
    - Create AuthProvider component
    - Add mock authentication for development
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 3.3 Create FilterContext at `src/contexts/FilterContext.tsx`
    - Define GlobalFilters interface with dateRange, territory, branch, product, rmId
    - Implement FilterContext with filters state, updateFilters, and resetFilters methods
    - Create FilterProvider component
    - _Requirements: 2.7, 11.2_

  - [x] 3.4 Configure React Query client at `src/lib/queryClient.ts`
    - Set up React Query client with appropriate cache times (5 min stale, 10 min cache)
    - Configure default query options for error handling and retries
    - Add QueryClientProvider to app root
    - _Requirements: 2.7, 8.2, 8.3, 9.1_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


### Phase 2: Enhanced Navigation System (Week 2-3)

- [x] 5. Create menu configuration system
  - [x] 5.1 Define menu configuration at `src/config/menuConfig.ts`
    - Define MenuItem and SubMenuItem TypeScript interfaces
    - Create MENU_CONFIG array with all 8 main menus (Dashboard, Territorial Intelligence, Market Intelligence, Performance, Intelligence Assistant, Reporting & Analytics, Data Management, Campaign & Activation)
    - Add 17 submenu items across parent menus (3 under Territorial Intelligence, 2 under Market Intelligence, 2 under Performance, 3 under Data Management)
    - Import Lucide React icons for each menu (LayoutDashboard, Map, TrendingUp, Users, Sparkles, BarChart3, Database, Target)
    - _Requirements: 1.1, 1.2_

  - [ ]* 5.2 Write property test for menu configuration
    - **Property 1: Submenu Expansion Toggle**
    - **Validates: Requirements 1.4**

- [x] 6. Implement enhanced Sidebar component
  - [x] 6.1 Create Sidebar component at `src/components/Sidebar.tsx`
    - Implement SidebarProps interface with isCollapsed and onToggleCollapse
    - Render all 8 top-level menu items from MENU_CONFIG
    - Implement expandable/collapsible submenu sections using Motion for animations
    - Add active state highlighting based on current route using useLocation hook
    - Maintain expansion state in Redux navigationSlice
    - Add keyboard navigation support (Tab, Enter, Arrow keys)
    - Add ARIA labels and accessibility attributes (aria-expanded, aria-label, role)
    - Implement responsive behavior (full sidebar on desktop, collapsible on mobile)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 17.1, 17.2, 17.3, 19.1, 19.2, 19.3, 19.4_

  - [ ]* 6.2 Write property tests for Sidebar navigation
    - **Property 3: Active Menu Highlighting**
    - **Validates: Requirements 1.5**

  - [ ]* 6.3 Write property test for menu state persistence
    - **Property 4: Menu State Persistence During Sibling Navigation**
    - **Validates: Requirements 1.6**

  - [ ]* 6.4 Write property tests for responsive behavior
    - **Property 23: Responsive Navigation Behavior**
    - **Validates: Requirements 17.1, 17.2**

  - [ ]* 6.5 Write property test for viewport state persistence
    - **Property 24: Menu State Persistence Across Viewport Changes**
    - **Validates: Requirements 17.3**

  - [ ]* 6.6 Write property tests for keyboard navigation
    - **Property 28: Keyboard Navigation Support**
    - **Property 29: ARIA Label Presence**
    - **Property 30: Focus Indicator Visibility**
    - **Property 31: Keyboard Activation Equivalence**
    - **Validates: Requirements 19.1, 19.2, 19.3, 19.4**

- [x] 7. Create navigation Redux slice
  - [x] 7.1 Create navigationSlice at `src/store/slices/navigationSlice.ts`
    - Define NavigationState interface with expandedMenus, activeRoute, breadcrumbs
    - Implement toggleMenu, setActiveRoute, and updateBreadcrumbs reducers
    - Export actions and selectors
    - _Requirements: 1.4, 1.5, 1.6_

- [x] 8. Create Breadcrumb component
  - [x] 8.1 Create Breadcrumb component at `src/components/Breadcrumb.tsx`
    - Implement breadcrumb trail showing current location hierarchy
    - Generate breadcrumbs from current route path
    - Add navigation links to parent routes
    - Style with Tailwind CSS for consistent appearance
    - _Requirements: 1.5_

- [x] 9. Implement Header component
  - [x] 9.1 Create Header component at `src/components/Header.tsx`
    - Add application title and logo
    - Integrate Breadcrumb component
    - Add user profile dropdown with role display
    - Add global filter controls (date range, territory)
    - Add mobile menu toggle button
    - _Requirements: 2.7, 16.1, 16.2, 16.3, 16.4, 17.1_

- [x] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


### Phase 3: Page Layouts and Routing (Week 3-4)

- [x] 11. Create shared page layout components
  - [x] 11.1 Create PageLayout component at `src/components/PageLayout.tsx`
    - Define PageLayoutProps interface with title, subtitle, actions, filters, children
    - Implement responsive grid layout with proper spacing
    - Add loading state and error boundary support
    - Style with Tailwind CSS for consistent page structure
    - _Requirements: 1.3, 17.1, 17.2_

  - [x] 11.2 Create PageHeader component at `src/components/PageHeader.tsx`
    - Display page title and optional subtitle
    - Render action buttons (export, refresh, etc.)
    - Add responsive layout for mobile devices
    - _Requirements: 1.3_

  - [x] 11.3 Create PageFilters component at `src/components/PageFilters.tsx`
    - Reuse existing FilterPanel component
    - Add territory, date range, branch, product filters
    - Connect to FilterContext for global filter state
    - Add filter reset functionality
    - _Requirements: 2.7, 11.2, 12.4_

- [x] 12. Implement Dashboard page
  - [x] 12.1 Create DashboardPage at `src/pages/DashboardPage.tsx`
    - Reuse existing StatCard components for 6 KPIs (Total Nasabah, Total Merchant, CASA Growth, QRIS Penetration Rate, TAM Coverage, Active Merchant Rate)
    - Reuse existing GeoMap/LeafletMap for national heatmap visualization
    - Display top 10 regions ranked by opportunity gap using existing components
    - Reuse existing TrendChart for growth trend visualizations (MoM, YoY)
    - Add AI-generated alerts section
    - Add quick query chatbot interface link to Intelligence Assistant
    - Connect to FilterContext for time period filtering
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_

  - [ ]* 12.2 Write property test for dashboard time filter
    - **Property 5: Time Filter Updates All Metrics**
    - **Validates: Requirements 2.7**

- [x] 13. Implement Territorial Intelligence pages
  - [x] 13.1 Create InteractiveMapView at `src/pages/territorial/InteractiveMapView.tsx`
    - Reuse existing LeafletMap/SimpleLeafletMap component
    - Implement map layer toggles (branch, ATM, merchant, customer, competitor, POI)
    - Add administrative boundary layers (Province, City, District, Village)
    - Add heatmap overlays (CASA density, QRIS adoption, credit outstanding, merchant density)
    - Implement radius analysis tool (5km, 10km configurable)
    - Implement custom polygon selection tool
    - Add layer visibility controls with performance optimization
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_

  - [ ]* 13.2 Write property test for map layer toggle performance
    - **Property 6: Map Layer Toggle Performance**
    - **Validates: Requirements 3.7**

  - [x] 13.3 Create ClusterAnalysisView at `src/pages/territorial/ClusterAnalysisView.tsx`
    - Display regions categorized by performance level (high, medium, low)
    - Show TAM versus realization gap analysis per region
    - Display market share estimation by region
    - Show coverage ratio metrics per region
    - Use existing chart components for visualizations
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 13.4 Create DrillDownView at `src/pages/territorial/DrillDownView.tsx`
    - Implement region click handler to show detail panel
    - Display region metrics (total customers, merchants, transaction volume, assigned RMs, target vs realization, opportunity score)
    - Implement hierarchical drill-down (province → city → district → village)
    - Update map view focus on drill-down
    - Add breadcrumb trail for drill-down navigation
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ]* 13.5 Write property tests for drill-down functionality
    - **Property 7: Region Click Shows Detail Panel**
    - **Property 8: Hierarchical Drill-Down Navigation**
    - **Property 9: Map View Updates on Drill-Down**
    - **Validates: Requirements 5.1, 5.2, 5.3**

- [x] 14. Implement Market Intelligence pages
  - [x] 14.1 Create TAMEstimationView at `src/pages/market/TAMEstimationView.tsx`
    - Display productive population estimates by region in table format
    - Display potential merchant counts by region
    - Display purchasing power estimates based on regional GDP data
    - Display market size estimates per region
    - Add sorting and filtering capabilities
    - Use existing chart components for visualizations
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [x] 14.2 Create PenetrationAnalysisView at `src/pages/market/PenetrationAnalysisView.tsx`
    - Display penetration rates per product category (CASA, Credit, QRIS, Savings)
    - Display gap metrics comparing actual penetration to market potential
    - Display ranked list of regions prioritized for expansion
    - Use existing chart components (bar charts, pie charts) for visualizations
    - _Requirements: 7.1, 7.2, 7.3_

- [x] 15. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


### Phase 4: Performance Tracking and Intelligence Assistant (Week 4-5)

- [x] 16. Implement Performance pages
  - [x] 16.1 Create RMPerformanceView at `src/pages/performance/RMPerformanceView.tsx`
    - Reuse existing RMPerformanceCard component for RM portfolio summaries
    - Display target versus realization metrics per RM
    - Display QRIS activation rate per RM
    - Display CASA growth per RM
    - Display merchant reactivation rate per RM
    - Reuse existing RMLeaderboard component for ranking display
    - Add filtering by territory and branch
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7_

  - [ ]* 16.2 Write property test for RM leaderboard sorting
    - **Property 10: RM Leaderboard Sorting**
    - **Validates: Requirements 8.7**

  - [x] 16.3 Create BranchPerformanceView at `src/pages/performance/BranchPerformanceView.tsx`
    - Display KPI metrics for each branch (total customers, merchants, CASA, credit outstanding)
    - Display territorial coverage area per branch
    - Display productivity metrics per branch territory
    - Display unaddressed opportunities per branch territory
    - Use existing chart components for visualizations
    - Add map view showing branch locations and coverage areas
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [x] 17. Enhance Intelligence Assistant (rename from Chatbot)
  - [x] 17.1 Rename Chatbot component to IntelligenceAssistant
    - Rename file from `src/components/Chatbot.tsx` to `src/components/IntelligenceAssistant.tsx`
    - Update all imports throughout the codebase
    - Update menu configuration to display "Intelligence Assistant" instead of "BRI AI Assistant"
    - _Requirements: 10.1_

  - [x] 17.2 Implement query analysis logic at `src/services/ai/queryAnalyzer.ts`
    - Create QueryAnalysis interface with intent, entities, timeframe, metrics
    - Implement determineVisualization function to map query intent to visualization type
    - Add intent detection for: comparison, trend, distribution, geographical, tabular
    - _Requirements: 10.9_

  - [x] 17.3 Create visual output renderer components
    - Create VisualOutputRenderer at `src/components/IntelligenceAssistant/VisualOutputRenderer.tsx`
    - Create ChartRenderer at `src/components/IntelligenceAssistant/ChartRenderer.tsx` using Recharts
    - Create TableRenderer at `src/components/IntelligenceAssistant/TableRenderer.tsx`
    - Create MapRenderer at `src/components/IntelligenceAssistant/MapRenderer.tsx` using Leaflet
    - Define VisualOutput, ChartConfig, TableConfig, MapConfig interfaces
    - _Requirements: 10.4, 10.5, 10.6, 10.10_

  - [x] 17.4 Enhance GeminiService for visual output generation
    - Update `src/services/ai/geminiService.ts` to detect visual output markers in AI responses
    - Implement parseResponse method to extract structured data from AI responses
    - Update buildSystemInstruction to include visual output generation capabilities
    - Add support for [CHART:type], [TABLE], and [MAP] markers in AI responses
    - _Requirements: 10.4, 10.5, 10.6, 10.9_

  - [x] 17.5 Integrate visual outputs into IntelligenceAssistant component
    - Update ChatMessage interface to include optional visualOutput field
    - Render VisualOutputRenderer inline within chat conversation
    - Maintain existing conversational interface and markdown rendering
    - Maintain existing suggested question templates
    - _Requirements: 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.10_

  - [ ]* 17.6 Write property tests for Intelligence Assistant
    - **Property 11: Natural Language Query Processing**
    - **Property 12: Automatic Visualization Type Selection**
    - **Property 13: Markdown Rendering in Chat**
    - **Property 14: Visual Output Inline Display**
    - **Validates: Requirements 10.2, 10.4, 10.5, 10.6, 10.7, 10.9, 10.10**

- [x] 18. Create IntelligenceAssistantPage
  - [x] 18.1 Create IntelligenceAssistantPage at `src/pages/IntelligenceAssistantPage.tsx`
    - Render enhanced IntelligenceAssistant component
    - Add page layout with title and instructions
    - Maintain full-screen chat interface
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 10.9, 10.10_

- [x] 19. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


### Phase 5: Reporting and Data Management (Week 5-6)

- [x] 20. Implement Reporting and Analytics page
  - [x] 20.1 Create ReportingPage at `src/pages/ReportingPage.tsx`
    - Implement pivot table functionality using a data table component
    - Add multi-level geographical filters (Province, City, District, Village)
    - Add time series analysis controls with date range picker
    - Add product segmentation analysis filters
    - Implement Excel export functionality using a library like xlsx
    - Implement PDF export functionality using a library like jsPDF
    - Use existing chart components for visualizations
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [ ]* 20.2 Write property test for export functionality
    - **Property 15: Export Format Support**
    - **Validates: Requirements 11.5, 11.6**

- [x] 21. Implement Data Management pages
  - [x] 21.1 Create DataTable component at `src/components/DataTable.tsx`
    - Define DataTableProps interface with data, columns, sortable, filterable, exportable, pagination
    - Implement sortable columns with sort indicators
    - Implement filterable columns with filter inputs
    - Implement pagination controls
    - Add row click handler support
    - Style with Tailwind CSS for consistent appearance
    - _Requirements: 12.3, 12.4, 13.1, 13.2, 14.1_

  - [ ]* 21.2 Write property test for data filtering
    - **Property 16: Data Filtering by Multiple Criteria**
    - **Validates: Requirements 12.4**

  - [x] 21.3 Create InternalDataView at `src/pages/data/InternalDataView.tsx`
    - Create tabs for customer data, merchant data, transaction data, RM data, branch data
    - Use DataTable component for each data type
    - Display data quality metrics (completeness, accuracy indicators)
    - Add filtering by multiple criteria
    - Add data refresh functionality
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

  - [x] 21.4 Create ExternalDataView at `src/pages/data/ExternalDataView.tsx`
    - Create tabs for demographic data, regional GDP data, POI data, merchant directory data
    - Use DataTable component for each data type
    - Display data source information with last update timestamp
    - Implement file import functionality for external data
    - Add file upload component with validation
    - _Requirements: 13.1, 13.2, 13.3_

  - [ ]* 21.5 Write property test for file import
    - **Property 17: File Import Functionality**
    - **Validates: Requirements 13.3**

  - [x] 21.6 Create GeospatialDataView at `src/pages/data/GeospatialDataView.tsx`
    - Create tabs for administrative boundary data, coordinate data, map layer configurations
    - Use DataTable component for coordinate data
    - Implement GeoJSON file upload for boundary polygons
    - Add GeoJSON format validation
    - Implement coordinate accuracy validation (100 meter tolerance)
    - Display map preview of uploaded boundaries
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 21.7 Write property tests for geospatial data validation
    - **Property 18: GeoJSON Upload Validation**
    - **Property 19: Coordinate Accuracy Validation**
    - **Validates: Requirements 14.2, 14.3**

- [x] 22. Create data management Redux slices
  - [x] 22.1 Create dataSlice at `src/store/slices/dataSlice.ts`
    - Define DataState interface with internal, external, geospatial data
    - Implement reducers for data loading, filtering, and quality metrics
    - Export actions and selectors
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 13.1, 13.2, 13.3, 14.1, 14.2, 14.3_

- [x] 23. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


### Phase 6: Campaign Module and Role-Based Access Control (Week 6-7)

- [x] 24. Implement Campaign and Activation page
  - [x] 24.1 Create CampaignPage at `src/pages/CampaignPage.tsx`
    - Display priority regions ranked by opportunity score in descending order
    - Display dormant merchants list with last activity date and days since activity
    - Generate follow-up action lists for RMs
    - Track activation success rates per campaign
    - Implement region selection with downloadable merchant target list generation
    - Add campaign creation and management interface
    - Use existing chart components for campaign metrics visualization
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [ ]* 24.2 Write property tests for campaign functionality
    - **Property 20: Priority Region Ranking**
    - **Property 21: Region-Based Merchant List Generation**
    - **Validates: Requirements 15.1, 15.5**

  - [x] 24.3 Create campaignSlice at `src/store/slices/campaignSlice.ts`
    - Define CampaignState interface with campaigns, dormantMerchants, priorityRegions
    - Implement reducers for campaign management and metrics tracking
    - Export actions and selectors
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [x] 25. Implement role-based access control system
  - [x] 25.1 Create permissions configuration at `src/services/auth/permissions.ts`
    - Define PERMISSIONS object with role-based access rules for Direksi, Regional Head, Branch Manager, RM
    - Specify viewLevel (national, regional, branch, portfolio) for each role
    - Specify module access permissions for each role
    - Specify export and data management permissions for each role
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 25.2 Implement data filtering by role at `src/services/auth/roleFilters.ts`
    - Create filterDataByRole function that filters data based on user role and assigned area
    - Implement filtering logic for national (Direksi), regional (Regional Head), branch (Branch Manager), and portfolio (RM) levels
    - Add type-safe filtering for different data types (regions, branches, RMs, customers, merchants)
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 25.3 Create ProtectedRoute component at `src/components/ProtectedRoute.tsx`
    - Implement route guard that checks user permissions before rendering
    - Redirect unauthorized users to appropriate landing page
    - Display informative message about access restrictions
    - Log unauthorized access attempts
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x] 25.4 Integrate role-based filtering across all modules
    - Update DashboardPage to filter data by user role
    - Update TerritorialIntelligence pages to filter regions by user role
    - Update MarketIntelligence pages to filter market data by user role
    - Update Performance pages to filter RM and branch data by user role
    - Update Reporting page to filter analysis data by user role
    - Update DataManagement pages to apply role-based access controls
    - Update Campaign page to filter campaign data by user role
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ]* 25.5 Write property test for role-based data filtering
    - **Property 22: Role-Based Data Filtering**
    - **Validates: Requirements 16.1, 16.2, 16.3, 16.4**

- [x] 26. Implement API integration layer
  - [x] 26.1 Create API client at `src/services/api/client.ts`
    - Implement APIClient class with get, post, put, delete methods
    - Add error handling with retry logic
    - Add request/response interceptors for authentication
    - Add timeout configuration (30s for data, 60s for AI)
    - _Requirements: All data-fetching requirements_

  - [x] 26.2 Define API endpoints at `src/services/api/endpoints.ts`
    - Define API_ENDPOINTS object with endpoints for dashboard, territorial, market, performance, ai, data, campaign modules
    - Organize endpoints by module for maintainability
    - _Requirements: All data-fetching requirements_

  - [x] 26.3 Create React Query hooks for data fetching
    - Create `src/hooks/useDashboardData.ts` for dashboard KPIs and metrics
    - Create `src/hooks/useTerritorialData.ts` for map layers, regions, boundaries
    - Create `src/hooks/useMarketData.ts` for TAM and penetration analysis
    - Create `src/hooks/usePerformanceData.ts` for RM and branch performance
    - Create `src/hooks/useCampaignData.ts` for campaign and dormant merchant data
    - Configure appropriate cache times and refetch strategies
    - _Requirements: 2.1-2.7, 3.1-3.7, 4.1-4.4, 5.1-5.3, 6.1-6.5, 7.1-7.3, 8.1-8.7, 9.1-9.4, 15.1-15.5_

- [x] 27. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


### Phase 7: Performance Optimization and Testing (Week 7-8)

- [x] 28. Implement performance optimizations
  - [x] 28.1 Add code splitting and lazy loading
    - Implement React.lazy() for all page components
    - Add Suspense boundaries with loading indicators
    - Configure route-based code splitting in Vite
    - Preload components for expanded menu sections
    - _Requirements: 18.3_

  - [ ]* 28.2 Write property tests for navigation performance
    - **Property 25: Route Transition Performance**
    - **Property 26: Submenu Animation Performance**
    - **Property 27: Route Component Preloading**
    - **Validates: Requirements 18.1, 18.2, 18.3**

  - [x] 28.3 Optimize map rendering performance
    - Implement marker clustering for large datasets
    - Add virtual scrolling for map layer lists
    - Optimize heatmap rendering with canvas-based approach
    - Implement debouncing for map interactions
    - _Requirements: 3.7_

  - [x] 28.4 Optimize data table performance
    - Implement virtual scrolling for large tables
    - Add pagination with configurable page sizes
    - Optimize sorting and filtering algorithms
    - Implement memoization for expensive computations
    - _Requirements: 12.3, 12.4, 13.1, 14.1_

  - [x] 28.5 Optimize bundle size
    - Analyze bundle size with Vite build analyzer
    - Remove unused dependencies
    - Optimize imports (use named imports instead of default)
    - Configure tree shaking in Vite
    - _Requirements: 18.1, 18.2_

- [ ]* 29. Write comprehensive unit tests
  - [ ]* 29.1 Write unit tests for Sidebar component
    - Test menu item rendering (8 top-level items)
    - Test submenu expansion/collapse
    - Test navigation on menu click
    - Test active state highlighting
    - Test responsive behavior
    - Test keyboard navigation

  - [ ]* 29.2 Write unit tests for page components
    - Test DashboardPage rendering with 6 KPI cards
    - Test InteractiveMapView layer toggles
    - Test DrillDownView region selection
    - Test RMPerformanceView leaderboard display
    - Test IntelligenceAssistant visual output rendering
    - Test ReportingPage export functionality
    - Test DataManagement file upload
    - Test CampaignPage region selection

  - [ ]* 29.3 Write unit tests for data filtering
    - Test filterDataByRole for all roles
    - Test multi-criteria filtering in DataTable
    - Test time period filtering in Dashboard
    - Test geographical filtering in Reporting

  - [ ]* 29.4 Write unit tests for API integration
    - Test API client error handling
    - Test React Query hooks data fetching
    - Test cache invalidation
    - Test retry logic

- [ ]* 30. Write integration tests
  - [ ]* 30.1 Write integration test for navigation flow
    - Test navigation through all 8 main menus
    - Test submenu expansion and navigation
    - Test breadcrumb updates
    - Test active state persistence

  - [ ]* 30.2 Write integration test for drill-down flow
    - Test province → city → district → village navigation
    - Test map view updates on drill-down
    - Test detail panel display
    - Test breadcrumb trail

  - [ ]* 30.3 Write integration test for role-based access
    - Test data filtering for all roles
    - Test module access restrictions
    - Test unauthorized access redirects

  - [ ]* 30.4 Write integration test for Intelligence Assistant
    - Test query submission and response
    - Test visual output generation
    - Test chart, table, and map rendering
    - Test markdown rendering

- [ ]* 31. Perform accessibility testing
  - [ ]* 31.1 Run automated accessibility tests
    - Use axe-core to test all pages
    - Fix any WCAG 2.1 AA violations
    - Test color contrast ratios
    - Test ARIA labels and roles

  - [ ]* 31.2 Perform manual keyboard navigation testing
    - Test Tab navigation through all menus
    - Test Enter key activation
    - Test Arrow key navigation
    - Test focus indicators visibility

  - [ ]* 31.3 Test with screen readers
    - Test with NVDA or JAWS
    - Verify menu announcements
    - Verify form label associations
    - Verify landmark regions

- [ ]* 32. Perform performance testing
  - [ ]* 32.1 Run Lighthouse audits
    - Test all main pages
    - Ensure performance score >90
    - Ensure accessibility score 100
    - Ensure best practices score >90

  - [ ]* 32.2 Profile with Chrome DevTools
    - Measure route transition times (target <300ms)
    - Measure submenu animation times (target <200ms)
    - Measure map layer toggle times (target <500ms)
    - Measure initial page load time (target <2s)
    - Measure time to interactive (target <3s)

  - [ ]* 32.3 Test with slow network conditions
    - Test with 3G throttling
    - Verify loading indicators display
    - Verify error handling for timeouts
    - Verify retry mechanisms work

- [x] 33. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.


### Phase 8: Error Handling, Documentation, and Deployment (Week 8)

- [x] 34. Implement comprehensive error handling
  - [x] 34.1 Create error boundary components
    - Create ErrorBoundary component at `src/components/ErrorBoundary.tsx`
    - Add fallback UI for component errors
    - Log errors for monitoring
    - Add error recovery mechanisms

  - [x] 34.2 Implement API error handling
    - Create error handler at `src/services/api/errorHandler.ts`
    - Handle different error types (timeout, network, server, validation)
    - Implement retry logic with exponential backoff
    - Display user-friendly error messages
    - Add error logging

  - [x] 34.3 Implement map and visualization error handling
    - Add fallback UI for map loading failures
    - Add fallback table view for chart rendering errors
    - Validate GeoJSON before rendering
    - Display specific validation errors with examples

  - [x] 34.4 Implement AI integration error handling
    - Handle Gemini API failures (rate limit, invalid key, timeout)
    - Fall back to text-only responses on visual output generation failures
    - Display clear error messages to users
    - Log AI errors for debugging

  - [x] 34.5 Implement data management error handling
    - Validate file size (max 50MB) before upload
    - Validate file format before upload
    - Show progress indicators for uploads
    - Display validation errors with row/column references
    - Allow partial import of valid records

- [ ]* 35. Create documentation
  - [ ]* 35.1 Write component documentation
    - Document all major components with JSDoc comments
    - Include prop descriptions and usage examples
    - Document component interfaces and types
    - Add inline code comments for complex logic

  - [ ]* 35.2 Write API documentation
    - Document all API endpoints
    - Document request/response formats
    - Document error codes and handling
    - Document authentication requirements

  - [ ]* 35.3 Create user guide
    - Write navigation guide explaining menu structure
    - Write feature guides for each module
    - Create screenshots and diagrams
    - Document role-based access controls

  - [ ]* 35.4 Create deployment guide
    - Document environment variables
    - Document build process
    - Document deployment steps
    - Document monitoring and logging setup

- [ ]* 36. Prepare for deployment
  - [ ]* 36.1 Configure production build
    - Optimize Vite production configuration
    - Configure environment variables for production
    - Enable source maps for debugging
    - Configure CDN for static assets

  - [ ]* 36.2 Set up monitoring and logging
    - Integrate error tracking (e.g., Sentry)
    - Set up performance monitoring
    - Configure analytics tracking
    - Set up audit logging for security events

  - [ ]* 36.3 Create deployment scripts
    - Create build script with production optimizations
    - Create deployment script for staging environment
    - Create deployment script for production environment
    - Create rollback script for emergency rollbacks

- [ ]* 37. Deploy to staging and conduct user acceptance testing
  - [ ]* 37.1 Deploy to staging environment
    - Run production build
    - Deploy to staging server
    - Verify all features work in staging
    - Test with production-like data

  - [ ]* 37.2 Conduct user acceptance testing
    - Test all 8 main menus and 17 submenu items
    - Test role-based access for all 4 roles
    - Test all critical user flows
    - Collect user feedback and address issues

  - [ ]* 37.3 Perform final security audit
    - Review authentication and authorization
    - Test for common vulnerabilities (XSS, CSRF, injection)
    - Review data filtering and access controls
    - Test API security

- [ ]* 38. Deploy to production
  - [ ]* 38.1 Final production deployment
    - Run final production build
    - Deploy to production server
    - Verify all features work in production
    - Monitor for errors and performance issues

  - [ ]* 38.2 Create user training materials
    - Create video tutorials for key features
    - Create quick reference guides
    - Schedule training sessions for users
    - Provide support documentation

- [ ]* 39. Final checkpoint - Project completion
  - Ensure all tests pass, verify all features are working, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties with minimum 100 iterations
- Unit tests validate specific examples, edge cases, and integration points
- All 31 correctness properties from the design document are covered in property tests
- Existing components (StatCard, TrendChart, GeoMap, LeafletMap, RMPerformanceCard, RMLeaderboard, FilterPanel) should be reused wherever possible
- The Intelligence Assistant only requires minor enhancements (visual outputs + rename) - existing functionality is maintained
- Role-based access control is integrated throughout all modules to ensure proper data filtering

