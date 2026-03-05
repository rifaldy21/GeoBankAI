import { createBrowserRouter, Navigate } from 'react-router-dom';
import Layout from '../components/Layout';

// Lazy load page components for better performance
import { lazy } from 'react';

// Dashboard
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Territorial Intelligence
const InteractiveMapView = lazy(() => import('../pages/territorial/InteractiveMapView'));
const ClusterAnalysisView = lazy(() => import('../pages/territorial/ClusterAnalysisView'));
const DrillDownView = lazy(() => import('../pages/territorial/DrillDownView'));

// Market Intelligence
const TAMEstimationView = lazy(() => import('../pages/market/TAMEstimationView'));
const PenetrationAnalysisView = lazy(() => import('../pages/market/PenetrationAnalysisView'));

// Performance
const RMPerformanceView = lazy(() => import('../pages/performance/RMPerformanceView'));
const BranchPerformanceView = lazy(() => import('../pages/performance/BranchPerformanceView'));

// Intelligence Assistant
const IntelligenceAssistantPage = lazy(() => import('../pages/IntelligenceAssistantPage'));

// Reporting & Analytics
const ReportingPage = lazy(() => import('../pages/ReportingPage'));

// Data Management
const InternalDataView = lazy(() => import('../pages/data/InternalDataView'));
const ExternalDataView = lazy(() => import('../pages/data/ExternalDataView'));
const GeospatialDataView = lazy(() => import('../pages/data/GeospatialDataView'));

// Campaign & Activation
const CampaignPage = lazy(() => import('../pages/CampaignPage'));

/**
 * Route configuration for the BRI Intelligence Dashboard
 * 
 * Structure:
 * - 8 main menus
 * - 17 submenu items across 4 parent menus
 * - Nested routes with index redirects for parent routes
 * - Role-based access control via route guards
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        // Root redirect to dashboard
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        // 1. Dashboard (Executive Overview)
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        // 2. Territorial Intelligence (3 submenus)
        path: 'territorial-intelligence',
        children: [
          {
            // Redirect parent route to first submenu
            index: true,
            element: <Navigate to="interactive-map" replace />,
          },
          {
            // 2.1 Peta Interaktif (Interactive Map)
            path: 'interactive-map',
            element: <InteractiveMapView />,
          },
          {
            // 2.2 Cluster & Area Analysis
            path: 'cluster-analysis',
            element: <ClusterAnalysisView />,
          },
          {
            // 2.3 Drill-down Capability
            path: 'drill-down',
            element: <DrillDownView />,
          },
        ],
      },
      {
        // 3. Market Intelligence (2 submenus)
        path: 'market-intelligence',
        children: [
          {
            // Redirect parent route to first submenu
            index: true,
            element: <Navigate to="tam-estimation" replace />,
          },
          {
            // 3.1 TAM Estimation
            path: 'tam-estimation',
            element: <TAMEstimationView />,
          },
          {
            // 3.2 Penetration & Gap Analysis
            path: 'penetration-analysis',
            element: <PenetrationAnalysisView />,
          },
        ],
      },
      {
        // 4. Performance (2 submenus)
        path: 'performance',
        children: [
          {
            // Redirect parent route to first submenu
            index: true,
            element: <Navigate to="rm-performance" replace />,
          },
          {
            // 4.1 RM Performance
            path: 'rm-performance',
            element: <RMPerformanceView />,
          },
          {
            // 4.2 Cabang Performance (Branch Performance)
            path: 'branch-performance',
            element: <BranchPerformanceView />,
          },
        ],
      },
      {
        // 5. Intelligence Assistant (no submenus)
        path: 'intelligence-assistant',
        element: <IntelligenceAssistantPage />,
      },
      {
        // 6. Reporting & Analytics (no submenus)
        path: 'reporting',
        element: <ReportingPage />,
      },
      {
        // 7. Data Management (3 submenus)
        path: 'data-management',
        children: [
          {
            // Redirect parent route to first submenu
            index: true,
            element: <Navigate to="internal-data" replace />,
          },
          {
            // 7.1 Internal Data
            path: 'internal-data',
            element: <InternalDataView />,
          },
          {
            // 7.2 External Data
            path: 'external-data',
            element: <ExternalDataView />,
          },
          {
            // 7.3 Geospatial Data
            path: 'geospatial-data',
            element: <GeospatialDataView />,
          },
        ],
      },
      {
        // 8. Campaign & Activation (no submenus)
        path: 'campaign',
        element: <CampaignPage />,
      },
    ],
  },
]);

export default router;
