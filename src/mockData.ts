import { Stat, RMPerformance, DistrictData } from './types';

export const MOCK_STATS: Stat[] = [
  {
    label: 'Total Merchants',
    value: '1,240',
    change: '+12% this month',
    trend: 'up',
    icon: 'Store',
    color: 'bg-blue-500',
  },
  {
    label: 'Active RMs',
    value: '48',
    change: '95% Utilization',
    trend: 'neutral',
    icon: 'Users',
    color: 'bg-purple-500',
  },
  {
    label: 'Avg. Conversion',
    value: '24.5%',
    change: '+3.2% vs last month',
    trend: 'up',
    icon: 'TrendingUp',
    color: 'bg-emerald-500',
  },
  {
    label: 'Total CASA',
    value: 'Rp 4.2T',
    change: '+Rp 120B growth',
    trend: 'up',
    icon: 'Wallet',
    color: 'bg-orange-500',
  }
];

export const MOCK_RM_DATA: RMPerformance[] = [
  {
    id: '1',
    name: 'Sari Wulandari',
    targetLeads: 50,
    acquired: 42,
    conversion: 84,
    status: 'Top Performer',
    portfolio: 12.5,
  },
  {
    id: '2',
    name: 'Budi Hartono',
    targetLeads: 50,
    acquired: 15,
    conversion: 30,
    status: 'Needs Improvement',
    portfolio: 4.2,
  },
  {
    id: '3',
    name: 'Andi Pratama',
    targetLeads: 50,
    acquired: 35,
    conversion: 70,
    status: 'On Track',
    portfolio: 8.9,
  }
];

export const MOCK_DISTRICT_PERFORMANCE: DistrictData[] = [
  { name: 'Tanah Abang', potential: 120, acquired: 45, conversion: 37.5 },
  { name: 'Menteng', potential: 80, acquired: 62, conversion: 77.5 },
  { name: 'Thamrin', potential: 150, acquired: 90, conversion: 60 },
  { name: 'Cempaka Putih', potential: 100, acquired: 30, conversion: 30 },
  { name: 'Johar Baru', potential: 90, acquired: 25, conversion: 27.7 },
  { name: 'Sawah Besar', potential: 110, acquired: 40, conversion: 36.3 },
];
