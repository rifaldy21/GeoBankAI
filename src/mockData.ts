import { Stat, RMPerformance, DistrictData } from './types';

export const MOCK_STATS: Stat[] = [
  {
    label: 'Total Merchants',
    value: '2,847',
    change: '+12.5% from last month',
    trend: 'up',
    icon: 'Store',
    color: 'bg-indigo-600'
  },
  {
    label: 'Active RMs',
    value: '24',
    change: '+2 new this quarter',
    trend: 'up',
    icon: 'Users',
    color: 'bg-purple-600'
  },
  {
    label: 'Conversion Rate',
    value: '24.5%',
    change: '-2.1% from target',
    trend: 'down',
    icon: 'TrendingUp',
    color: 'bg-emerald-600'
  },
  {
    label: 'Total CASA',
    value: 'Rp 1.2T',
    change: '+8.3% growth',
    trend: 'up',
    icon: 'Wallet',
    color: 'bg-amber-600'
  }
];

export const MOCK_RM_DATA: RMPerformance[] = [
  {
    id: '1',
    name: 'Arief Wicaksono',
    targetLeads: 120,
    acquired: 101,
    conversion: 84,
    status: 'Top Performer',
    portfolio: 3.2,
    phone: '+62 812-3456-7890',
    email: 'arief.wicaksono@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Menteng'
  },
  {
    id: '2',
    name: 'Dimas Prasetya',
    targetLeads: 100,
    acquired: 38,
    conversion: 38,
    status: 'Needs Improvement',
    portfolio: 1.8,
    phone: '+62 820-1234-5678',
    email: 'dimas.prasetya@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Senen'
  },
  {
    id: '3',
    name: 'Kartika Sari',
    targetLeads: 110,
    acquired: 78,
    conversion: 71,
    status: 'On Track',
    portfolio: 2.5,
    phone: '+62 814-5678-9012',
    email: 'kartika.sari@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Tanah Abang'
  },
  {
    id: '4',
    name: 'Fajar Ramadhan',
    targetLeads: 115,
    acquired: 95,
    conversion: 83,
    status: 'Top Performer',
    portfolio: 2.9,
    phone: '+62 813-4567-8901',
    email: 'fajar.ramadhan@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Menteng'
  },
  {
    id: '5',
    name: 'Indah Permata',
    targetLeads: 105,
    acquired: 68,
    conversion: 65,
    status: 'On Track',
    portfolio: 2.1,
    phone: '+62 815-6789-0123',
    email: 'indah.permata@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Gambir'
  },
  {
    id: '6',
    name: 'Rizki Firmansyah',
    targetLeads: 95,
    acquired: 25,
    conversion: 26,
    status: 'Needs Improvement',
    portfolio: 1.2,
    phone: '+62 821-2345-6789',
    email: 'rizki.firmansyah@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Pasar Baru'
  },
  {
    id: '7',
    name: 'Nurul Hidayati',
    targetLeads: 108,
    acquired: 62,
    conversion: 58,
    status: 'On Track',
    portfolio: 1.9,
    phone: '+62 816-7890-1234',
    email: 'nurul.hidayati@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Sawah Besar'
  },
  {
    id: '8',
    name: 'Bayu Setiawan',
    targetLeads: 102,
    acquired: 55,
    conversion: 52,
    status: 'On Track',
    portfolio: 1.7,
    phone: '+62 817-8901-2345',
    email: 'bayu.setiawan@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Kemayoran'
  },
  {
    id: '9',
    name: 'Putri Maharani',
    targetLeads: 98,
    acquired: 48,
    conversion: 45,
    status: 'Needs Improvement',
    portfolio: 1.5,
    phone: '+62 818-9012-3456',
    email: 'putri.maharani@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Cempaka Putih'
  },
  {
    id: '10',
    name: 'Eko Prasetyo',
    targetLeads: 104,
    acquired: 42,
    conversion: 40,
    status: 'Needs Improvement',
    portfolio: 1.4,
    phone: '+62 819-0123-4567',
    email: 'eko.prasetyo@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Johar Baru'
  },
  {
    id: '11',
    name: 'Anisa Rahma',
    targetLeads: 112,
    acquired: 88,
    conversion: 79,
    status: 'Top Performer',
    portfolio: 2.7,
    phone: '+62 822-3456-7890',
    email: 'anisa.rahma@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Tanah Abang'
  },
  {
    id: '12',
    name: 'Yoga Aditama',
    targetLeads: 106,
    acquired: 72,
    conversion: 68,
    status: 'On Track',
    portfolio: 2.3,
    phone: '+62 823-4567-8901',
    email: 'yoga.aditama@bri.co.id',
    territory: 'Jakarta Pusat',
    branch: 'Gambir'
  }
];

export const MOCK_DISTRICT_PERFORMANCE: DistrictData[] = [
  { name: 'Menteng', potential: 450, acquired: 320, conversion: 71.1 },
  { name: 'Tanah Abang', potential: 520, acquired: 280, conversion: 53.8 },
  { name: 'Gambir', potential: 380, acquired: 290, conversion: 76.3 },
  { name: 'Sawah Besar', potential: 410, acquired: 310, conversion: 75.6 },
  { name: 'Kemayoran', potential: 390, acquired: 250, conversion: 64.1 },
  { name: 'Senen', potential: 360, acquired: 240, conversion: 66.7 },
  { name: 'Cempaka Putih', potential: 340, acquired: 220, conversion: 64.7 },
  { name: 'Johar Baru', potential: 370, acquired: 257, conversion: 69.5 },
];

// Merchant locations in Jakarta Pusat (lat, lng)
export const MOCK_MERCHANTS = [
  // Menteng Area
  { id: 'm1', name: 'Toko Berkah Jaya', lat: -6.1944, lng: 106.8294, status: 'acquired', casa: 45, rm: 'Sari Wulandari', category: 'Retail' },
  { id: 'm2', name: 'Warung Makan Sederhana', lat: -6.1956, lng: 106.8312, status: 'acquired', casa: 28, rm: 'Ahmad Hidayat', category: 'F&B' },
  { id: 'm3', name: 'Toko Elektronik Maju', lat: -6.1932, lng: 106.8278, status: 'acquired', casa: 67, rm: 'Sari Wulandari', category: 'Electronics' },
  { id: 'm4', name: 'Apotek Sehat', lat: -6.1968, lng: 106.8301, status: 'potential', casa: 0, rm: null, category: 'Healthcare' },
  { id: 'm5', name: 'Salon Cantik', lat: -6.1941, lng: 106.8289, status: 'potential', casa: 0, rm: null, category: 'Services' },
  
  // Tanah Abang Area
  { id: 'm6', name: 'Toko Kain Murah', lat: -6.1856, lng: 106.8145, status: 'acquired', casa: 52, rm: 'Rina Kusuma', category: 'Textile' },
  { id: 'm7', name: 'Warung Kopi Nikmat', lat: -6.1867, lng: 106.8156, status: 'acquired', casa: 31, rm: 'Dewi Lestari', category: 'F&B' },
  { id: 'm8', name: 'Toko Bangunan Jaya', lat: -6.1845, lng: 106.8134, status: 'acquired', casa: 89, rm: 'Ahmad Hidayat', category: 'Construction' },
  { id: 'm9', name: 'Bengkel Motor', lat: -6.1878, lng: 106.8167, status: 'potential', casa: 0, rm: null, category: 'Automotive' },
  { id: 'm10', name: 'Toko Sepatu', lat: -6.1851, lng: 106.8149, status: 'potential', casa: 0, rm: null, category: 'Fashion' },
  
  // Gambir Area
  { id: 'm11', name: 'Restoran Padang', lat: -6.1753, lng: 106.8267, status: 'acquired', casa: 43, rm: 'Budi Santoso', category: 'F&B' },
  { id: 'm12', name: 'Toko Buku Cerdas', lat: -6.1764, lng: 106.8278, status: 'acquired', casa: 36, rm: 'Rina Kusuma', category: 'Retail' },
  { id: 'm13', name: 'Laundry Express', lat: -6.1742, lng: 106.8256, status: 'potential', casa: 0, rm: null, category: 'Services' },
  { id: 'm14', name: 'Minimarket 24', lat: -6.1775, lng: 106.8289, status: 'acquired', casa: 54, rm: 'Sari Wulandari', category: 'Retail' },
  
  // Sawah Besar Area
  { id: 'm15', name: 'Toko Emas Murni', lat: -6.1589, lng: 106.8234, status: 'acquired', casa: 125, rm: 'Ahmad Hidayat', category: 'Jewelry' },
  { id: 'm16', name: 'Warung Nasi Goreng', lat: -6.1598, lng: 106.8245, status: 'acquired', casa: 22, rm: 'Dewi Lestari', category: 'F&B' },
  { id: 'm17', name: 'Toko Handphone', lat: -6.1578, lng: 106.8223, status: 'potential', casa: 0, rm: null, category: 'Electronics' },
  { id: 'm18', name: 'Barbershop Modern', lat: -6.1609, lng: 106.8256, status: 'acquired', casa: 18, rm: 'Budi Santoso', category: 'Services' },
  
  // Kemayoran Area
  { id: 'm19', name: 'Toko Furniture', lat: -6.1678, lng: 106.8456, status: 'acquired', casa: 78, rm: 'Rina Kusuma', category: 'Furniture' },
  { id: 'm20', name: 'Cafe Kekinian', lat: -6.1689, lng: 106.8467, status: 'acquired', casa: 41, rm: 'Sari Wulandari', category: 'F&B' },
  { id: 'm21', name: 'Gym Fitness', lat: -6.1667, lng: 106.8445, status: 'potential', casa: 0, rm: null, category: 'Sports' },
  { id: 'm22', name: 'Pet Shop', lat: -6.1700, lng: 106.8478, status: 'potential', casa: 0, rm: null, category: 'Retail' },
  
  // Senen Area
  { id: 'm23', name: 'Toko Komputer', lat: -6.1734, lng: 106.8512, status: 'acquired', casa: 62, rm: 'Ahmad Hidayat', category: 'Electronics' },
  { id: 'm24', name: 'Warung Soto', lat: -6.1745, lng: 106.8523, status: 'acquired', casa: 27, rm: 'Dewi Lestari', category: 'F&B' },
  { id: 'm25', name: 'Toko Mainan', lat: -6.1723, lng: 106.8501, status: 'potential', casa: 0, rm: null, category: 'Toys' },
  
  // Cempaka Putih Area
  { id: 'm26', name: 'Supermarket Mini', lat: -6.1823, lng: 106.8678, status: 'acquired', casa: 71, rm: 'Rina Kusuma', category: 'Retail' },
  { id: 'm27', name: 'Klinik Kesehatan', lat: -6.1834, lng: 106.8689, status: 'acquired', casa: 95, rm: 'Sari Wulandari', category: 'Healthcare' },
  { id: 'm28', name: 'Toko Obat', lat: -6.1812, lng: 106.8667, status: 'potential', casa: 0, rm: null, category: 'Healthcare' },
  
  // Johar Baru Area
  { id: 'm29', name: 'Toko Pakaian', lat: -6.1912, lng: 106.8589, status: 'acquired', casa: 48, rm: 'Ahmad Hidayat', category: 'Fashion' },
  { id: 'm30', name: 'Bakery Fresh', lat: -6.1923, lng: 106.8600, status: 'acquired', casa: 33, rm: 'Dewi Lestari', category: 'F&B' },
  { id: 'm31', name: 'Toko Aksesoris', lat: -6.1901, lng: 106.8578, status: 'potential', casa: 0, rm: null, category: 'Fashion' },
];

// POI (Points of Interest)
export const MOCK_POIS = [
  { id: 'poi1', name: 'Pasar Tanah Abang', lat: -6.1856, lng: 106.8145, category: 'Traditional Market', traffic: 'Very High' },
  { id: 'poi2', name: 'Plaza Indonesia', lat: -6.1944, lng: 106.8294, category: 'Mall', traffic: 'High' },
  { id: 'poi3', name: 'Pasar Senen', lat: -6.1734, lng: 106.8512, category: 'Traditional Market', traffic: 'High' },
  { id: 'poi4', name: 'Sarinah Mall', lat: -6.1856, lng: 106.8234, category: 'Mall', traffic: 'Medium' },
  { id: 'poi5', name: 'Pasar Baru', lat: -6.1589, lng: 106.8234, category: 'Traditional Market', traffic: 'High' },
];

// Competitor locations
export const MOCK_COMPETITORS = [
  { id: 'comp1', name: 'Bank Mandiri', lat: -6.1950, lng: 106.8300, type: 'Branch' },
  { id: 'comp2', name: 'BCA', lat: -6.1860, lng: 106.8150, type: 'Branch' },
  { id: 'comp3', name: 'BNI', lat: -6.1760, lng: 106.8270, type: 'Branch' },
  { id: 'comp4', name: 'Bank Mandiri ATM', lat: -6.1680, lng: 106.8460, type: 'ATM' },
  { id: 'comp5', name: 'BCA ATM', lat: -6.1830, lng: 106.8680, type: 'ATM' },
];

// BRI Branch
export const BRI_BRANCH = {
  id: 'bri1',
  name: 'BRI Jakarta Pusat Main',
  lat: -6.1812,
  lng: 106.8378
};

// Trend data for growth chart
export const MOCK_TREND_DATA = [
  { month: 'Jan', casa: 0.95, merchants: 2450, target: 1.0 },
  { month: 'Feb', casa: 1.02, merchants: 2580, target: 1.05 },
  { month: 'Mar', casa: 1.08, merchants: 2690, target: 1.1 },
  { month: 'Apr', casa: 1.15, merchants: 2750, target: 1.15 },
  { month: 'May', casa: 1.18, merchants: 2820, target: 1.2 },
  { month: 'Jun', casa: 1.20, merchants: 2847, target: 1.25 },
];

// Category distribution
export const MOCK_CATEGORY_DATA = [
  { name: 'F&B', value: 8, color: '#4f46e5' },
  { name: 'Retail', value: 7, color: '#06b6d4' },
  { name: 'Electronics', value: 3, color: '#8b5cf6' },
  { name: 'Healthcare', value: 3, color: '#10b981' },
  { name: 'Services', value: 3, color: '#f59e0b' },
  { name: 'Fashion', value: 3, color: '#ec4899' },
  { name: 'Others', value: 4, color: '#64748b' },
];

// Acquisition funnel
export const MOCK_FUNNEL_DATA = [
  { name: 'Total Leads', value: 520, color: '#4f46e5' },
  { name: 'Qualified', value: 410, color: '#8b5cf6' },
  { name: 'Contacted', value: 350, color: '#06b6d4' },
  { name: 'Negotiating', value: 280, color: '#10b981' },
  { name: 'Acquired', value: 220, color: '#22c55e' },
];

// RM Leaderboard
export const MOCK_RM_LEADERBOARD = [
  { rank: 1, name: 'Arief Wicaksono', acquired: 101, conversion: 84, casa: 3.2, trend: 'up' as const, phone: '+62 812-3456-7890', email: 'arief.wicaksono@bri.co.id', territory: 'Jakarta Pusat Territory' },
  { rank: 2, name: 'Fajar Ramadhan', acquired: 95, conversion: 83, casa: 2.9, trend: 'up' as const, phone: '+62 813-4567-8901', email: 'fajar.ramadhan@bri.co.id', territory: 'Menteng District' },
  { rank: 3, name: 'Kartika Sari', acquired: 78, conversion: 71, casa: 2.5, trend: 'stable' as const, phone: '+62 814-5678-9012', email: 'kartika.sari@bri.co.id', territory: 'Tanah Abang District' },
  { rank: 4, name: 'Indah Permata', acquired: 68, conversion: 65, casa: 2.1, trend: 'up' as const, phone: '+62 815-6789-0123', email: 'indah.permata@bri.co.id', territory: 'Gambir District' },
  { rank: 5, name: 'Nurul Hidayati', acquired: 62, conversion: 58, casa: 1.9, trend: 'stable' as const, phone: '+62 816-7890-1234', email: 'nurul.hidayati@bri.co.id', territory: 'Sawah Besar District' },
  { rank: 6, name: 'Bayu Setiawan', acquired: 55, conversion: 52, casa: 1.7, trend: 'down' as const, phone: '+62 817-8901-2345', email: 'bayu.setiawan@bri.co.id', territory: 'Kemayoran District' },
  { rank: 7, name: 'Putri Maharani', acquired: 48, conversion: 45, casa: 1.5, trend: 'down' as const, phone: '+62 818-9012-3456', email: 'putri.maharani@bri.co.id', territory: 'Cempaka Putih District' },
  { rank: 8, name: 'Eko Prasetyo', acquired: 42, conversion: 40, casa: 1.4, trend: 'stable' as const, phone: '+62 819-0123-4567', email: 'eko.prasetyo@bri.co.id', territory: 'Johar Baru District' },
  { rank: 9, name: 'Dimas Prasetya', acquired: 38, conversion: 38, casa: 1.8, trend: 'down' as const, phone: '+62 820-1234-5678', email: 'dimas.prasetya@bri.co.id', territory: 'Senen District' },
  { rank: 10, name: 'Rizki Firmansyah', acquired: 25, conversion: 26, casa: 1.2, trend: 'down' as const, phone: '+62 821-2345-6789', email: 'rizki.firmansyah@bri.co.id', territory: 'Pasar Baru District' },
];

// Competitive analysis
export const MOCK_COMPETITIVE_DATA = [
  { district: 'Menteng', bri: 45, mandiri: 32, bca: 28, bni: 18 },
  { district: 'Tanah Abang', bri: 38, mandiri: 35, bca: 25, bni: 20 },
  { district: 'Gambir', bri: 42, mandiri: 30, bca: 22, bni: 15 },
  { district: 'Sawah Besar', bri: 35, mandiri: 28, bca: 20, bni: 12 },
  { district: 'Kemayoran', bri: 30, mandiri: 25, bca: 18, bni: 10 },
];

// Campaign & Activation mock data
export const MOCK_PRIORITY_REGIONS = [
  { regionId: '1', regionName: 'Jakarta Selatan', opportunityScore: 92, potentialRevenue: 45200000000, merchantCount: 1247, rank: 1 },
  { regionId: '2', regionName: 'Tangerang', opportunityScore: 88, potentialRevenue: 38700000000, merchantCount: 1089, rank: 2 },
  { regionId: '3', regionName: 'Bekasi', opportunityScore: 85, potentialRevenue: 35400000000, merchantCount: 982, rank: 3 },
  { regionId: '4', regionName: 'Bandung', opportunityScore: 82, potentialRevenue: 32100000000, merchantCount: 876, rank: 4 },
  { regionId: '5', regionName: 'Surabaya', opportunityScore: 79, potentialRevenue: 29800000000, merchantCount: 823, rank: 5 },
  { regionId: '6', regionName: 'Depok', opportunityScore: 76, potentialRevenue: 24500000000, merchantCount: 745, rank: 6 },
  { regionId: '7', regionName: 'Bogor', opportunityScore: 73, potentialRevenue: 21300000000, merchantCount: 687, rank: 7 },
  { regionId: '8', regionName: 'Semarang', opportunityScore: 70, potentialRevenue: 19700000000, merchantCount: 634, rank: 8 },
  { regionId: '9', regionName: 'Medan', opportunityScore: 68, potentialRevenue: 18200000000, merchantCount: 598, rank: 9 },
  { regionId: '10', regionName: 'Makassar', opportunityScore: 65, potentialRevenue: 16800000000, merchantCount: 567, rank: 10 }
];

export const MOCK_DORMANT_MERCHANTS = [
  {
    id: 'M001',
    name: 'Warung Makan Sederhana',
    location: { lat: -6.2088, lng: 106.8456 },
    lastActivityDate: new Date('2024-09-15'),
    daysSinceActivity: 95,
    historicalValue: 45000000,
    assignedRM: 'Ahmad Fauzi',
    priority: 'high' as const
  },
  {
    id: 'M002',
    name: 'Toko Elektronik Jaya',
    location: { lat: -6.2297, lng: 106.8467 },
    lastActivityDate: new Date('2024-10-20'),
    daysSinceActivity: 60,
    historicalValue: 78000000,
    assignedRM: 'Siti Nurhaliza',
    priority: 'high' as const
  },
  {
    id: 'M003',
    name: 'Apotek Sehat Sentosa',
    location: { lat: -6.2115, lng: 106.8452 },
    lastActivityDate: new Date('2024-11-01'),
    daysSinceActivity: 48,
    historicalValue: 32000000,
    assignedRM: 'Budi Santoso',
    priority: 'medium' as const
  },
  {
    id: 'M004',
    name: 'Bengkel Motor Cepat',
    location: { lat: -6.2088, lng: 106.8489 },
    lastActivityDate: new Date('2024-08-10'),
    daysSinceActivity: 131,
    historicalValue: 56000000,
    assignedRM: 'Ahmad Fauzi',
    priority: 'high' as const
  },
  {
    id: 'M005',
    name: 'Salon Kecantikan Indah',
    location: { lat: -6.2134, lng: 106.8423 },
    lastActivityDate: new Date('2024-11-15'),
    daysSinceActivity: 34,
    historicalValue: 28000000,
    assignedRM: 'Siti Nurhaliza',
    priority: 'low' as const
  },
  {
    id: 'M006',
    name: 'Minimarket 24 Jam',
    location: { lat: -6.2156, lng: 106.8478 },
    lastActivityDate: new Date('2024-09-28'),
    daysSinceActivity: 82,
    historicalValue: 92000000,
    assignedRM: 'Budi Santoso',
    priority: 'high' as const
  },
  {
    id: 'M007',
    name: 'Restoran Padang Sedap',
    location: { lat: -6.2098, lng: 106.8501 },
    lastActivityDate: new Date('2024-10-05'),
    daysSinceActivity: 75,
    historicalValue: 64000000,
    assignedRM: 'Ahmad Fauzi',
    priority: 'medium' as const
  },
  {
    id: 'M008',
    name: 'Toko Bangunan Makmur',
    location: { lat: -6.2187, lng: 106.8434 },
    lastActivityDate: new Date('2024-11-20'),
    daysSinceActivity: 29,
    historicalValue: 38000000,
    priority: 'low' as const
  },
  {
    id: 'M009',
    name: 'Laundry Express',
    location: { lat: -6.2145, lng: 106.8512 },
    lastActivityDate: new Date('2024-09-05'),
    daysSinceActivity: 105,
    historicalValue: 41000000,
    assignedRM: 'Siti Nurhaliza',
    priority: 'high' as const
  },
  {
    id: 'M010',
    name: 'Kafe Kopi Nusantara',
    location: { lat: -6.2076, lng: 106.8445 },
    lastActivityDate: new Date('2024-10-30'),
    daysSinceActivity: 50,
    historicalValue: 52000000,
    assignedRM: 'Budi Santoso',
    priority: 'medium' as const
  }
];

export const MOCK_ACTIVE_CAMPAIGNS = [
  {
    id: 'C001',
    name: 'Q4 Merchant Reactivation Drive',
    type: 'reactivation' as const,
    status: 'active' as const,
    targetRegions: ['Jakarta Selatan', 'Tangerang', 'Bekasi'],
    targetMerchants: ['M001', 'M002', 'M004', 'M006', 'M009'],
    assignedRMs: ['Ahmad Fauzi', 'Siti Nurhaliza', 'Budi Santoso'],
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-12-31'),
    metrics: {
      targetCount: 150,
      contacted: 98,
      converted: 42,
      conversionRate: 42.9,
      revenue: 12300000000
    }
  },
  {
    id: 'C002',
    name: 'New Year QRIS Activation',
    type: 'acquisition' as const,
    status: 'active' as const,
    targetRegions: ['Bandung', 'Surabaya'],
    targetMerchants: [],
    assignedRMs: ['Ahmad Fauzi', 'Budi Santoso'],
    startDate: new Date('2024-11-15'),
    endDate: new Date('2025-01-31'),
    metrics: {
      targetCount: 200,
      contacted: 67,
      converted: 28,
      conversionRate: 41.8,
      revenue: 8500000000
    }
  },
  {
    id: 'C003',
    name: 'High-Value Merchant Retention',
    type: 'retention' as const,
    status: 'active' as const,
    targetRegions: ['Jakarta Selatan', 'Depok'],
    targetMerchants: ['M002', 'M006'],
    assignedRMs: ['Siti Nurhaliza'],
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-02-28'),
    metrics: {
      targetCount: 85,
      contacted: 72,
      converted: 58,
      conversionRate: 80.6,
      revenue: 24500000000
    }
  }
];
