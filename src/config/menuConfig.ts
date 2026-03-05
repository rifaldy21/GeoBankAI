import {
  LayoutDashboard,
  Map,
  TrendingUp,
  Users,
  Sparkles,
  BarChart3,
  Database,
  Target,
  type LucideIcon,
} from 'lucide-react';

export interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path?: string;
  submenus?: SubMenuItem[];
}

export const MENU_CONFIG: MenuItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'territorial-intelligence',
    label: 'Territorial Intelligence',
    icon: Map,
    submenus: [
      {
        id: 'interactive-map',
        label: 'Peta Interaktif',
        path: '/territorial-intelligence/interactive-map',
      },
      {
        id: 'cluster-analysis',
        label: 'Cluster & Area Analysis',
        path: '/territorial-intelligence/cluster-analysis',
      },
      {
        id: 'drill-down',
        label: 'Drill-down Capability',
        path: '/territorial-intelligence/drill-down',
      },
    ],
  },
  {
    id: 'market-intelligence',
    label: 'Market Intelligence',
    icon: TrendingUp,
    submenus: [
      {
        id: 'tam-estimation',
        label: 'TAM Estimation',
        path: '/market-intelligence/tam-estimation',
      },
      {
        id: 'penetration-analysis',
        label: 'Penetration & Gap Analysis',
        path: '/market-intelligence/penetration-analysis',
      },
    ],
  },
  {
    id: 'performance',
    label: 'Performance',
    icon: Users,
    submenus: [
      {
        id: 'rm-performance',
        label: 'RM Performance',
        path: '/performance/rm-performance',
      },
      {
        id: 'branch-performance',
        label: 'Cabang Performance',
        path: '/performance/branch-performance',
      },
    ],
  },
  {
    id: 'intelligence-assistant',
    label: 'Intelligence Assistant',
    icon: Sparkles,
    path: '/intelligence-assistant',
  },
  {
    id: 'reporting',
    label: 'Reporting & Analytics',
    icon: BarChart3,
    path: '/reporting',
  },
  {
    id: 'data-management',
    label: 'Data Management',
    icon: Database,
    submenus: [
      {
        id: 'internal-data',
        label: 'Internal Data',
        path: '/data-management/internal-data',
      },
      {
        id: 'external-data',
        label: 'External Data',
        path: '/data-management/external-data',
      },
      {
        id: 'geospatial-data',
        label: 'Geospatial Data',
        path: '/data-management/geospatial-data',
      },
    ],
  },
  {
    id: 'campaign',
    label: 'Campaign & Activation',
    icon: Target,
    path: '/campaign',
  },
];
