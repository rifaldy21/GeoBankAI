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
  labelId: string;
  labelEn: string;
  path: string;
}

export interface MenuItem {
  id: string;
  labelId: string;
  labelEn: string;
  icon: LucideIcon;
  path?: string;
  submenus?: SubMenuItem[];
}

export const MENU_CONFIG: MenuItem[] = [
  {
    id: 'dashboard',
    labelId: 'Dashboard',
    labelEn: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
  },
  {
    id: 'territorial-intelligence',
    labelId: 'Territorial Intelligence',
    labelEn: 'Territorial Intelligence',
    icon: Map,
    submenus: [
      {
        id: 'interactive-map',
        labelId: 'Peta Interaktif',
        labelEn: 'Interactive Map',
        path: '/territorial-intelligence/interactive-map',
      },
      {
        id: 'cluster-analysis',
        labelId: 'Cluster & Area Analysis',
        labelEn: 'Cluster & Area Analysis',
        path: '/territorial-intelligence/cluster-analysis',
      },
      {
        id: 'drill-down',
        labelId: 'Drill-down Capability',
        labelEn: 'Drill-down Capability',
        path: '/territorial-intelligence/drill-down',
      },
    ],
  },
  {
    id: 'market-intelligence',
    labelId: 'Market Intelligence',
    labelEn: 'Market Intelligence',
    icon: TrendingUp,
    submenus: [
      {
        id: 'tam-estimation',
        labelId: 'Estimasi TAM',
        labelEn: 'TAM Estimation',
        path: '/market-intelligence/tam-estimation',
      },
      {
        id: 'penetration-analysis',
        labelId: 'Analisis Penetrasi & Gap',
        labelEn: 'Penetration & Gap Analysis',
        path: '/market-intelligence/penetration-analysis',
      },
    ],
  },
  {
    id: 'performance',
    labelId: 'Kinerja',
    labelEn: 'Performance',
    icon: Users,
    submenus: [
      {
        id: 'rm-performance',
        labelId: 'Kinerja RM',
        labelEn: 'RM Performance',
        path: '/performance/rm-performance',
      },
      {
        id: 'branch-performance',
        labelId: 'Kinerja Cabang',
        labelEn: 'Branch Performance',
        path: '/performance/branch-performance',
      },
    ],
  },
  {
    id: 'intelligence-assistant',
    labelId: 'Intelligence Assistant',
    labelEn: 'Intelligence Assistant',
    icon: Sparkles,
    path: '/intelligence-assistant',
  },
  {
    id: 'reporting',
    labelId: 'Pelaporan & Analitik',
    labelEn: 'Reporting & Analytics',
    icon: BarChart3,
    path: '/reporting',
  },
  {
    id: 'data-management',
    labelId: 'Manajemen Data',
    labelEn: 'Data Management',
    icon: Database,
    submenus: [
      {
        id: 'internal-data',
        labelId: 'Data Internal',
        labelEn: 'Internal Data',
        path: '/data-management/internal-data',
      },
      {
        id: 'external-data',
        labelId: 'Data Eksternal',
        labelEn: 'External Data',
        path: '/data-management/external-data',
      },
      {
        id: 'geospatial-data',
        labelId: 'Data Geospasial',
        labelEn: 'Geospatial Data',
        path: '/data-management/geospatial-data',
      },
    ],
  },
  {
    id: 'campaign',
    labelId: 'Campaign & Activation',
    labelEn: 'Campaign & Activation',
    icon: Target,
    path: '/campaign',
  },
];
