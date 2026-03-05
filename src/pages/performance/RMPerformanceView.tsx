import { FC, useState, useMemo } from 'react';
import { Users, TrendingUp, Award, Filter } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import RMPerformanceCard from '../../components/RMPerformanceCard';
import RMLeaderboard from '../../components/RMLeaderboard';
import { RMPerformance } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { filterRMs } from '../../services/auth/roleFilters';

// Mock data for RM performance
const mockRMData: RMPerformance[] = [
  {
    id: 'rm-001',
    name: 'Ahmad Fauzi',
    targetLeads: 150,
    acquired: 142,
    conversion: 94.7,
    status: 'Top Performer',
    portfolio: 12.5,
    phone: '+62 812-3456-7890',
    email: 'ahmad.fauzi@bri.co.id',
    territory: 'Menteng',
    branch: 'Jakarta Pusat'
  },
  {
    id: 'rm-002',
    name: 'Siti Nurhaliza',
    targetLeads: 140,
    acquired: 128,
    conversion: 91.4,
    status: 'Top Performer',
    portfolio: 11.8,
    phone: '+62 813-4567-8901',
    email: 'siti.nurhaliza@bri.co.id',
    territory: 'Tanah Abang',
    branch: 'Jakarta Pusat'
  },
  {
    id: 'rm-003',
    name: 'Budi Santoso',
    targetLeads: 135,
    acquired: 118,
    conversion: 87.4,
    status: 'Top Performer',
    portfolio: 10.2,
    phone: '+62 814-5678-9012',
    email: 'budi.santoso@bri.co.id',
    territory: 'Gambir',
    branch: 'Jakarta Pusat'
  },
  {
    id: 'rm-004',
    name: 'Dewi Lestari',
    targetLeads: 145,
    acquired: 119,
    conversion: 82.1,
    status: 'On Track',
    portfolio: 9.8,
    phone: '+62 815-6789-0123',
    email: 'dewi.lestari@bri.co.id',
    territory: 'Sawah Besar',
    branch: 'Jakarta Pusat'
  },
  {
    id: 'rm-005',
    name: 'Eko Prasetyo',
    targetLeads: 130,
    acquired: 104,
    conversion: 80.0,
    status: 'On Track',
    portfolio: 9.1,
    phone: '+62 816-7890-1234',
    email: 'eko.prasetyo@bri.co.id',
    territory: 'Kemayoran',
    branch: 'Jakarta Utara'
  },
  {
    id: 'rm-006',
    name: 'Fitri Handayani',
    targetLeads: 125,
    acquired: 96,
    conversion: 76.8,
    status: 'On Track',
    portfolio: 8.5,
    phone: '+62 817-8901-2345',
    email: 'fitri.handayani@bri.co.id',
    territory: 'Senen',
    branch: 'Jakarta Pusat'
  },
  {
    id: 'rm-007',
    name: 'Gunawan Wijaya',
    targetLeads: 120,
    acquired: 87,
    conversion: 72.5,
    status: 'On Track',
    portfolio: 7.9,
    phone: '+62 818-9012-3456',
    email: 'gunawan.wijaya@bri.co.id',
    territory: 'Cempaka Putih',
    branch: 'Jakarta Pusat'
  },
  {
    id: 'rm-008',
    name: 'Hendra Kusuma',
    targetLeads: 115,
    acquired: 78,
    conversion: 67.8,
    status: 'Needs Improvement',
    portfolio: 7.2,
    phone: '+62 819-0123-4567',
    email: 'hendra.kusuma@bri.co.id',
    territory: 'Johar Baru',
    branch: 'Jakarta Pusat'
  },
  {
    id: 'rm-009',
    name: 'Indah Permata',
    targetLeads: 110,
    acquired: 71,
    conversion: 64.5,
    status: 'Needs Improvement',
    portfolio: 6.8,
    phone: '+62 820-1234-5678',
    email: 'indah.permata@bri.co.id',
    territory: 'Matraman',
    branch: 'Jakarta Timur'
  },
  {
    id: 'rm-010',
    name: 'Joko Widodo',
    targetLeads: 105,
    acquired: 63,
    conversion: 60.0,
    status: 'Needs Improvement',
    portfolio: 6.1,
    phone: '+62 821-2345-6789',
    email: 'joko.widodo@bri.co.id',
    territory: 'Pulo Gadung',
    branch: 'Jakarta Timur'
  }
];

// Extended data for leaderboard
const leaderboardData = mockRMData.map((rm, index) => ({
  rank: index + 1,
  name: rm.name,
  acquired: rm.acquired,
  conversion: rm.conversion,
  casa: rm.portfolio,
  trend: (rm.conversion >= 85 ? 'up' : rm.conversion >= 70 ? 'stable' : 'down') as 'up' | 'down' | 'stable',
  phone: rm.phone,
  email: rm.email,
  territory: rm.territory
}));

const RMPerformanceView: FC = () => {
  const { user } = useAuth();
  const [territoryFilter, setTerritoryFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Apply role-based filtering first
  const roleFilteredData = useMemo(() => {
    return filterRMs(mockRMData, user);
  }, [user]);

  // Get unique territories and branches from role-filtered data
  const territories = Array.from(new Set(roleFilteredData.map(rm => rm.territory)));
  const branches = Array.from(new Set(roleFilteredData.map(rm => rm.branch)));

  // Apply additional filters
  const filteredData = roleFilteredData.filter(rm => {
    if (territoryFilter !== 'all' && rm.territory !== territoryFilter) return false;
    if (branchFilter !== 'all' && rm.branch !== branchFilter) return false;
    if (statusFilter !== 'all' && rm.status !== statusFilter) return false;
    return true;
  });

  // Calculate summary metrics
  const totalRMs = filteredData.length;
  const totalAcquired = filteredData.reduce((sum, rm) => sum + rm.acquired, 0);
  const avgConversion = filteredData.reduce((sum, rm) => sum + rm.conversion, 0) / totalRMs;
  const totalPortfolio = filteredData.reduce((sum, rm) => sum + rm.portfolio, 0);
  const topPerformers = filteredData.filter(rm => rm.status === 'Top Performer').length;

  return (
    <PageLayout
      title="RM Performance"
      subtitle="Relationship Manager performance tracking and portfolio summaries"
      filters={
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <label className="text-sm font-bold text-slate-700">Territory:</label>
            <select
              value={territoryFilter}
              onChange={(e) => setTerritoryFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Territories</option>
              {territories.map(territory => (
                <option key={territory} value={territory}>{territory}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700">Branch:</label>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="Top Performer">Top Performer</option>
              <option value="On Track">On Track</option>
              <option value="Needs Improvement">Needs Improvement</option>
            </select>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total RMs</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalRMs}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Acquired</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalAcquired}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Avg Conversion</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{avgConversion.toFixed(1)}%</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Portfolio</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">Rp {totalPortfolio.toFixed(1)}B</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Top Performers</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{topPerformers}</p>
          </div>
        </div>

        {/* RM Leaderboard */}
        <RMLeaderboard data={leaderboardData} />

        {/* RM Performance Cards Grid */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">RM Portfolio Summaries</h3>
              <p className="text-sm text-slate-500">Detailed performance metrics per RM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map(rm => (
              <RMPerformanceCard key={rm.id} rm={rm} />
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default RMPerformanceView;
