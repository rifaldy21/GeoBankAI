# Routing Configuration

This document describes the routing structure for the BRI Intelligence Dashboard.

## Route Structure

### Overview
- **8 main menus**
- **17 submenu items** across 4 parent menus
- **Nested routes** with automatic redirects
- **Lazy loading** for optimal performance

## Complete Route Map

```
/ (root)
├── / → redirects to /dashboard
├── /dashboard
│   └── Dashboard Page (Executive Overview)
│
├── /territorial-intelligence
│   ├── / → redirects to /territorial-intelligence/interactive-map
│   ├── /interactive-map (Peta Interaktif)
│   ├── /cluster-analysis (Cluster & Area Analysis)
│   └── /drill-down (Drill-down Capability)
│
├── /market-intelligence
│   ├── / → redirects to /market-intelligence/tam-estimation
│   ├── /tam-estimation (TAM Estimation)
│   └── /penetration-analysis (Penetration & Gap Analysis)
│
├── /performance
│   ├── / → redirects to /performance/rm-performance
│   ├── /rm-performance (RM Performance)
│   └── /branch-performance (Cabang Performance)
│
├── /intelligence-assistant
│   └── Intelligence Assistant Page
│
├── /reporting
│   └── Reporting & Analytics Page
│
├── /data-management
│   ├── / → redirects to /data-management/internal-data
│   ├── /internal-data (Internal Data)
│   ├── /external-data (External Data)
│   └── /geospatial-data (Geospatial Data)
│
└── /campaign
    └── Campaign & Activation Page
```

## Route Details

### 1. Dashboard (`/dashboard`)
- **Component**: `DashboardPage`
- **Description**: Executive overview with KPIs and national insights
- **Requirements**: 2.1-2.7

### 2. Territorial Intelligence (`/territorial-intelligence`)
Parent route with 3 submenus:

#### 2.1 Interactive Map (`/territorial-intelligence/interactive-map`)
- **Component**: `InteractiveMapView`
- **Description**: Interactive map with layers and heatmaps
- **Requirements**: 3.1-3.7

#### 2.2 Cluster Analysis (`/territorial-intelligence/cluster-analysis`)
- **Component**: `ClusterAnalysisView`
- **Description**: Regional cluster and area analysis
- **Requirements**: 4.1-4.4

#### 2.3 Drill-down (`/territorial-intelligence/drill-down`)
- **Component**: `DrillDownView`
- **Description**: Hierarchical geographical drill-down
- **Requirements**: 5.1-5.3

### 3. Market Intelligence (`/market-intelligence`)
Parent route with 2 submenus:

#### 3.1 TAM Estimation (`/market-intelligence/tam-estimation`)
- **Component**: `TAMEstimationView`
- **Description**: Total Addressable Market estimation
- **Requirements**: 6.1-6.5

#### 3.2 Penetration Analysis (`/market-intelligence/penetration-analysis`)
- **Component**: `PenetrationAnalysisView`
- **Description**: Market penetration and gap analysis
- **Requirements**: 7.1-7.3

### 4. Performance (`/performance`)
Parent route with 2 submenus:

#### 4.1 RM Performance (`/performance/rm-performance`)
- **Component**: `RMPerformanceView`
- **Description**: Relationship Manager performance tracking
- **Requirements**: 8.1-8.7

#### 4.2 Branch Performance (`/performance/branch-performance`)
- **Component**: `BranchPerformanceView`
- **Description**: Branch-level KPIs and coverage metrics
- **Requirements**: 9.1-9.4

### 5. Intelligence Assistant (`/intelligence-assistant`)
- **Component**: `IntelligenceAssistantPage`
- **Description**: AI-powered conversational interface with visual outputs
- **Requirements**: 10.1-10.10

### 6. Reporting & Analytics (`/reporting`)
- **Component**: `ReportingPage`
- **Description**: Custom pivot analysis and reporting
- **Requirements**: 11.1-11.6

### 7. Data Management (`/data-management`)
Parent route with 3 submenus:

#### 7.1 Internal Data (`/data-management/internal-data`)
- **Component**: `InternalDataView`
- **Description**: Internal bank data management
- **Requirements**: 12.1-12.5

#### 7.2 External Data (`/data-management/external-data`)
- **Component**: `ExternalDataView`
- **Description**: External data sources management
- **Requirements**: 13.1-13.3

#### 7.3 Geospatial Data (`/data-management/geospatial-data`)
- **Component**: `GeospatialDataView`
- **Description**: Geographical boundaries and coordinate data
- **Requirements**: 14.1-14.3

### 8. Campaign & Activation (`/campaign`)
- **Component**: `CampaignPage`
- **Description**: Campaign management and merchant activation
- **Requirements**: 15.1-15.5

## Index Route Redirects

Parent routes with submenus automatically redirect to their first submenu:

- `/territorial-intelligence` → `/territorial-intelligence/interactive-map`
- `/market-intelligence` → `/market-intelligence/tam-estimation`
- `/performance` → `/performance/rm-performance`
- `/data-management` → `/data-management/internal-data`

## Role-Based Access Control

Route guards are implemented using the `ProtectedRoute` component (Task 25.3) to enforce role-based access:

### Role Permissions

- **Direksi**: Access to all modules (national view)
- **Regional Head**: Access to most modules except data management (regional view)
- **Branch Manager**: Limited module access (branch view)
- **RM**: Minimal module access (portfolio view)

### ProtectedRoute Component

The `ProtectedRoute` component provides comprehensive access control:

**Features:**
- Checks user authentication status
- Verifies module access based on user role
- Redirects unauthorized users to appropriate landing page
- Displays informative access denied message
- Logs unauthorized access attempts for security monitoring

**Usage Example:**
```tsx
import ProtectedRoute from '../components/ProtectedRoute';

// Protect a route with module-based access control
<Route
  path="data-management"
  element={
    <ProtectedRoute moduleId="data-management">
      <DataManagementPage />
    </ProtectedRoute>
  }
/>

// With custom redirect and message
<Route
  path="campaign"
  element={
    <ProtectedRoute 
      moduleId="campaign"
      redirectTo="/dashboard"
      accessDeniedMessage="Campaign management requires Regional Head or Direksi role."
    >
      <CampaignPage />
    </ProtectedRoute>
  }
/>
```

**Security Features:**
- Unauthorized access attempts are logged with timestamp, user info, and attempted path
- Logs are stored in localStorage (development) and sent to logging service (production)
- Access denied page shows user-friendly message with role information
- Provides options to return to dashboard or go back

## Performance Optimization

- **Lazy Loading**: All page components are lazy-loaded using `React.lazy()`
- **Code Splitting**: Automatic code splitting by route
- **Preloading**: Components will be preloaded for expanded menu sections (Task 28.1)

## Implementation Status

- [x] Route configuration created
- [x] Layout component placeholder created
- [x] All page component placeholders created
- [x] Full page implementations (Phases 3-6)
- [x] ProtectedRoute component created (Phase 6, Task 25.3)
- [ ] Route guards integrated into routing configuration
- [ ] Performance optimizations (Phase 7)

## Next Steps

1. **Task 2.2**: Implement full Layout component with Header and Sidebar
2. **Phase 2**: Build enhanced navigation system
3. **Phase 3**: Implement actual page components with full functionality
4. **Phase 6**: Add role-based access control and route guards
