import { FC, useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Store, DollarSign, Target, ArrowUpDown } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { useAuth } from '../../contexts/AuthContext';
import { filterDataByRole } from '../../services/auth/roleFilters';

// Mock data for TAM estimation
const tamEstimationData = [
  {
    regionId: 'menteng',
    regionName: 'Menteng',
    productivePopulation: 125000,
    potentialMerchants: 3200,
    purchasingPower: 4.5,
    marketSize: 5.8,
    currentPenetration: 28.5,
    estimatedGap: 4.15
  },
  {
    regionId: 'tanah-abang',
    regionName: 'Tanah Abang',
    productivePopulation: 158000,
    potentialMerchants: 5200,
    purchasingPower: 5.2,
    marketSize: 6.9,
    currentPenetration: 22.1,
    estimatedGap: 5.37
  },
  {
    regionId: 'gambir',
    regionName: 'Gambir',
    productivePopulation: 98000,
    potentialMerchants: 2900,
    purchasingPower: 3.8,
    marketSize: 4.9,
    currentPenetration: 31.2,
    estimatedGap: 3.37
  },
  {
    regionId: 'sawah-besar',
    regionName: 'Sawah Besar',
    productivePopulation: 112000,
    potentialMerchants: 3100,
    purchasingPower: 4.1,
    marketSize: 5.3,
    currentPenetration: 29.8,
    estimatedGap: 3.72
  },
  {
    regionId: 'kemayoran',
    regionName: 'Kemayoran',
    productivePopulation: 105000,
    potentialMerchants: 2500,
    purchasingPower: 3.9,
    marketSize: 5.1,
    currentPenetration: 24.3,
    estimatedGap: 3.86
  },
  {
    regionId: 'senen',
    regionName: 'Senen',
    productivePopulation: 92000,
    potentialMerchants: 2400,
    purchasingPower: 3.6,
    marketSize: 4.7,
    currentPenetration: 23.5,
    estimatedGap: 3.59
  },
  {
    regionId: 'cempaka-putih',
    regionName: 'Cempaka Putih',
    productivePopulation: 88000,
    potentialMerchants: 2200,
    purchasingPower: 3.4,
    marketSize: 4.4,
    currentPenetration: 21.8,
    estimatedGap: 3.44
  },
  {
    regionId: 'johar-baru',
    regionName: 'Johar Baru',
    productivePopulation: 95000,
    potentialMerchants: 2570,
    purchasingPower: 3.7,
    marketSize: 4.8,
    currentPenetration: 25.2,
    estimatedGap: 3.59
  },
];

type SortField = 'regionName' | 'productivePopulation' | 'potentialMerchants' | 'purchasingPower' | 'marketSize';
type SortOrder = 'asc' | 'desc';

const TAMEstimationView: FC = () => {
  const { user } = useAuth();
  const [sortField, setSortField] = useState<SortField>('marketSize');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filterMinMarketSize, setFilterMinMarketSize] = useState<number>(0);

  // Apply role-based filtering to TAM data
  const roleFilteredData = useMemo(() => {
    return filterDataByRole(tamEstimationData, user);
  }, [user]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const filteredAndSortedData = roleFilteredData
    .filter(item => item.marketSize >= filterMinMarketSize)
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const totalProductivePopulation = roleFilteredData.reduce((sum, item) => sum + item.productivePopulation, 0);
  const totalPotentialMerchants = roleFilteredData.reduce((sum, item) => sum + item.potentialMerchants, 0);
  const totalPurchasingPower = roleFilteredData.reduce((sum, item) => sum + item.purchasingPower, 0);
  const totalMarketSize = roleFilteredData.reduce((sum, item) => sum + item.marketSize, 0);

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <PageLayout
      title="TAM Estimation"
      subtitle="Total Addressable Market analysis by region"
      filters={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700">Min Market Size:</label>
            <select
              value={filterMinMarketSize}
              onChange={(e) => setFilterMinMarketSize(Number(e.target.value))}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>All</option>
              <option value={4}>≥ Rp 4B</option>
              <option value={5}>≥ Rp 5B</option>
              <option value={6}>≥ Rp 6B</option>
            </select>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Productive Population</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {totalProductivePopulation.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Potential Merchants</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {totalPotentialMerchants.toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Purchasing Power</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              Rp {totalPurchasingPower.toFixed(1)}B
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Market Size</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              Rp {totalMarketSize.toFixed(1)}B
            </p>
          </div>
        </div>

        {/* Productive Population by Region */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Productive Population by Region</h3>
              <p className="text-sm text-slate-500">Estimated working-age population per region</p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredAndSortedData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="regionName"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  formatter={(value: number) => [value.toLocaleString(), 'Population']}
                />
                <Bar dataKey="productivePopulation" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Potential Merchants & Market Size */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Potential Merchants Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Potential Merchants</h3>
                <p className="text-sm text-slate-500">Distribution by region</p>
              </div>
            </div>

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={filteredAndSortedData}
                    dataKey="potentialMerchants"
                    nameKey="regionName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry: any) => `${entry.regionName} ${(entry.percent * 100).toFixed(0)}%`}
                    labelLine={{ stroke: '#94a3b8', strokeWidth: 1 }}
                  >
                    {filteredAndSortedData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                    formatter={(value: number) => [value.toLocaleString(), 'Merchants']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Market Size Chart */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Market Size by Region</h3>
                <p className="text-sm text-slate-500">Estimated total market value</p>
              </div>
            </div>

            <div className="space-y-3">
              {filteredAndSortedData.map((region, index) => (
                <div key={region.regionId} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-slate-700">{region.regionName}</span>
                      <span className="text-xs font-bold text-indigo-600">Rp {region.marketSize.toFixed(1)}B</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(region.marketSize / totalMarketSize) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">TAM Estimation Details</h3>
              <p className="text-sm text-slate-500">Comprehensive market data by region</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4">
                    <button
                      onClick={() => handleSort('regionName')}
                      className="flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                    >
                      Region
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => handleSort('productivePopulation')}
                      className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      Productive Population
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => handleSort('potentialMerchants')}
                      className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      Potential Merchants
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => handleSort('purchasingPower')}
                      className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      Purchasing Power
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => handleSort('marketSize')}
                      className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      Market Size
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((region) => (
                  <tr key={region.regionId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-sm font-bold text-slate-900">{region.regionName}</td>
                    <td className="py-3 px-4 text-sm text-slate-700 text-right">
                      {region.productivePopulation.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-700 text-right">
                      {region.potentialMerchants.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-700 text-right">
                      Rp {region.purchasingPower.toFixed(1)}B
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-indigo-600 text-right">
                      Rp {region.marketSize.toFixed(1)}B
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default TAMEstimationView;
