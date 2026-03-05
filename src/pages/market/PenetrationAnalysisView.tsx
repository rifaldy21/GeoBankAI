import { FC, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TrendingUp, Target, AlertCircle, Award, ArrowUpDown } from 'lucide-react';
import PageLayout from '../../components/PageLayout';

// Mock data for penetration analysis
const penetrationData = [
  {
    regionId: 'menteng',
    regionName: 'Menteng',
    overallPenetration: 28.5,
    gapVsPotential: 71.5,
    priorityScore: 78,
    productCategories: [
      { product: 'CASA', penetrationRate: 32.5, potential: 85, gap: 52.5 },
      { product: 'Credit', penetrationRate: 28.3, potential: 75, gap: 46.7 },
      { product: 'QRIS', penetrationRate: 35.2, potential: 90, gap: 54.8 },
      { product: 'Savings', penetrationRate: 18.0, potential: 70, gap: 52.0 },
    ]
  },
  {
    regionId: 'tanah-abang',
    regionName: 'Tanah Abang',
    overallPenetration: 22.1,
    gapVsPotential: 77.9,
    priorityScore: 88,
    productCategories: [
      { product: 'CASA', penetrationRate: 25.8, potential: 85, gap: 59.2 },
      { product: 'Credit', penetrationRate: 20.5, potential: 75, gap: 54.5 },
      { product: 'QRIS', penetrationRate: 28.3, potential: 90, gap: 61.7 },
      { product: 'Savings', penetrationRate: 13.8, potential: 70, gap: 56.2 },
    ]
  },
  {
    regionId: 'gambir',
    regionName: 'Gambir',
    overallPenetration: 31.2,
    gapVsPotential: 68.8,
    priorityScore: 74,
    productCategories: [
      { product: 'CASA', penetrationRate: 35.2, potential: 85, gap: 49.8 },
      { product: 'Credit', penetrationRate: 30.8, potential: 75, gap: 44.2 },
      { product: 'QRIS', penetrationRate: 38.5, potential: 90, gap: 51.5 },
      { product: 'Savings', penetrationRate: 20.3, potential: 70, gap: 49.7 },
    ]
  },
  {
    regionId: 'sawah-besar',
    regionName: 'Sawah Besar',
    overallPenetration: 29.8,
    gapVsPotential: 70.2,
    priorityScore: 76,
    productCategories: [
      { product: 'CASA', penetrationRate: 33.5, potential: 85, gap: 51.5 },
      { product: 'Credit', penetrationRate: 29.2, potential: 75, gap: 45.8 },
      { product: 'QRIS', penetrationRate: 36.8, potential: 90, gap: 53.2 },
      { product: 'Savings', penetrationRate: 19.7, potential: 70, gap: 50.3 },
    ]
  },
  {
    regionId: 'kemayoran',
    regionName: 'Kemayoran',
    overallPenetration: 24.3,
    gapVsPotential: 75.7,
    priorityScore: 81,
    productCategories: [
      { product: 'CASA', penetrationRate: 27.8, potential: 85, gap: 57.2 },
      { product: 'Credit', penetrationRate: 23.5, potential: 75, gap: 51.5 },
      { product: 'QRIS', penetrationRate: 30.2, potential: 90, gap: 59.8 },
      { product: 'Savings', penetrationRate: 15.7, potential: 70, gap: 54.3 },
    ]
  },
  {
    regionId: 'senen',
    regionName: 'Senen',
    overallPenetration: 23.5,
    gapVsPotential: 76.5,
    priorityScore: 79,
    productCategories: [
      { product: 'CASA', penetrationRate: 26.8, potential: 85, gap: 58.2 },
      { product: 'Credit', penetrationRate: 22.3, potential: 75, gap: 52.7 },
      { product: 'QRIS', penetrationRate: 29.5, potential: 90, gap: 60.5 },
      { product: 'Savings', penetrationRate: 15.3, potential: 70, gap: 54.7 },
    ]
  },
  {
    regionId: 'cempaka-putih',
    regionName: 'Cempaka Putih',
    overallPenetration: 21.8,
    gapVsPotential: 78.2,
    priorityScore: 77,
    productCategories: [
      { product: 'CASA', penetrationRate: 24.8, potential: 85, gap: 60.2 },
      { product: 'Credit', penetrationRate: 20.8, potential: 75, gap: 54.2 },
      { product: 'QRIS', penetrationRate: 27.5, potential: 90, gap: 62.5 },
      { product: 'Savings', penetrationRate: 14.0, potential: 70, gap: 56.0 },
    ]
  },
  {
    regionId: 'johar-baru',
    regionName: 'Johar Baru',
    overallPenetration: 25.2,
    gapVsPotential: 74.8,
    priorityScore: 80,
    productCategories: [
      { product: 'CASA', penetrationRate: 28.5, potential: 85, gap: 56.5 },
      { product: 'Credit', penetrationRate: 24.2, potential: 75, gap: 50.8 },
      { product: 'QRIS', penetrationRate: 31.3, potential: 90, gap: 58.7 },
      { product: 'Savings', penetrationRate: 16.8, potential: 70, gap: 53.2 },
    ]
  },
];

type SortField = 'regionName' | 'overallPenetration' | 'gapVsPotential' | 'priorityScore';
type SortOrder = 'asc' | 'desc';

const PenetrationAnalysisView: FC = () => {
  const [selectedRegion, setSelectedRegion] = useState(penetrationData[0]);
  const [sortField, setSortField] = useState<SortField>('priorityScore');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const sortedData = [...penetrationData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const avgPenetration = penetrationData.reduce((sum, item) => sum + item.overallPenetration, 0) / penetrationData.length;
  const avgGap = penetrationData.reduce((sum, item) => sum + item.gapVsPotential, 0) / penetrationData.length;

  const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b'];
  const PRIORITY_COLORS = {
    high: 'text-red-600 bg-red-50',
    medium: 'text-orange-600 bg-orange-50',
    low: 'text-emerald-600 bg-emerald-50'
  };

  const getPriorityLevel = (score: number): 'high' | 'medium' | 'low' => {
    if (score >= 80) return 'high';
    if (score >= 70) return 'medium';
    return 'low';
  };

  return (
    <PageLayout
      title="Penetration & Gap Analysis"
      subtitle="Product penetration rates and market gap analysis by region"
    >
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Average Penetration</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {avgPenetration.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Average Gap vs Potential</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {avgGap.toFixed(1)}%
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">High Priority Regions</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {penetrationData.filter(r => r.priorityScore >= 80).length}
            </p>
          </div>
        </div>

        {/* Penetration Rates by Product Category */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Penetration Rates by Product Category</h3>
              <p className="text-sm text-slate-500">Current penetration across all regions</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bar Chart */}
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={selectedRegion.productCategories}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="product"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px',
                      border: 'none',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      padding: '12px'
                    }}
                    formatter={(value: number) => [`${value}%`, '']}
                  />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                    iconType="circle"
                  />
                  <Bar dataKey="penetrationRate" fill="#4f46e5" name="Current Penetration" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="potential" fill="#94a3b8" name="Potential" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Region Selector & Radar Chart */}
            <div>
              <div className="mb-4">
                <label className="text-xs font-bold text-slate-700 mb-2 block">Select Region:</label>
                <select
                  value={selectedRegion.regionId}
                  onChange={(e) => setSelectedRegion(penetrationData.find(r => r.regionId === e.target.value)!)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {penetrationData.map((region) => (
                    <option key={region.regionId} value={region.regionId}>
                      {region.regionName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={selectedRegion.productCategories}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis
                      dataKey="product"
                      tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                    />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={{ fill: '#64748b', fontSize: 10 }}
                    />
                    <Radar
                      name="Penetration Rate"
                      dataKey="penetrationRate"
                      stroke="#4f46e5"
                      fill="#4f46e5"
                      fillOpacity={0.6}
                    />
                    <Radar
                      name="Potential"
                      dataKey="potential"
                      stroke="#94a3b8"
                      fill="#94a3b8"
                      fillOpacity={0.3}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', fontWeight: 600 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Gap Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Gap Metrics by Region</h3>
              <p className="text-sm text-slate-500">Comparison of actual penetration vs market potential</p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedData}
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
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                  formatter={(value: number) => [`${value}%`, '']}
                />
                <Legend
                  wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                  iconType="circle"
                />
                <Bar dataKey="overallPenetration" fill="#10b981" name="Current Penetration" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gapVsPotential" fill="#ef4444" name="Gap vs Potential" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Regions Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Priority Regions for Expansion</h3>
              <p className="text-sm text-slate-500">Ranked by priority score based on gap analysis</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-700">Rank</th>
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
                      onClick={() => handleSort('overallPenetration')}
                      className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      Current Penetration
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => handleSort('gapVsPotential')}
                      className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      Gap vs Potential
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-right py-3 px-4">
                    <button
                      onClick={() => handleSort('priorityScore')}
                      className="flex items-center justify-end gap-1 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors ml-auto"
                    >
                      Priority Score
                      <ArrowUpDown className="w-3 h-3" />
                    </button>
                  </th>
                  <th className="text-center py-3 px-4 text-xs font-bold text-slate-700">Priority Level</th>
                </tr>
              </thead>
              <tbody>
                {sortedData.map((region, index) => {
                  const priorityLevel = getPriorityLevel(region.priorityScore);
                  return (
                    <tr key={region.regionId} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-sm font-bold text-slate-500">#{index + 1}</td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900">{region.regionName}</td>
                      <td className="py-3 px-4 text-sm text-slate-700 text-right">
                        {region.overallPenetration.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-sm text-red-600 font-bold text-right">
                        {region.gapVsPotential.toFixed(1)}%
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-indigo-600 text-right">
                        {region.priorityScore}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${PRIORITY_COLORS[priorityLevel]}`}>
                          {priorityLevel.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Product Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Product Category Distribution</h3>
              <p className="text-sm text-slate-500">Average penetration by product type</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['CASA', 'Credit', 'QRIS', 'Savings'].map((product, index) => {
              const avgPenetrationRate = penetrationData.reduce((sum, region) => {
                const category = region.productCategories.find(c => c.product === product);
                return sum + (category?.penetrationRate || 0);
              }, 0) / penetrationData.length;

              const avgGapRate = penetrationData.reduce((sum, region) => {
                const category = region.productCategories.find(c => c.product === product);
                return sum + (category?.gap || 0);
              }, 0) / penetrationData.length;

              return (
                <div key={product} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <h4 className="text-sm font-bold text-slate-900">{product}</h4>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">Avg Penetration:</span>
                        <span className="font-bold text-slate-900">{avgPenetrationRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${avgPenetrationRate}%`,
                            backgroundColor: COLORS[index]
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">Avg Gap:</span>
                        <span className="font-bold text-red-600">{avgGapRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full transition-all duration-500"
                          style={{ width: `${avgGapRate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default PenetrationAnalysisView;
