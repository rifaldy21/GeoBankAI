import { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, MapPin } from 'lucide-react';
import PageLayout from '../../components/PageLayout';

// Mock data for cluster analysis
const performanceClusters = [
  { 
    level: 'High Performance', 
    regions: ['Menteng', 'Gambir', 'Sawah Besar'],
    count: 3,
    avgPenetration: 74.3,
    avgCoverage: 82.5,
    color: '#22c55e'
  },
  { 
    level: 'Medium Performance', 
    regions: ['Kemayoran', 'Senen', 'Cempaka Putih', 'Johar Baru'],
    count: 4,
    avgPenetration: 66.3,
    avgCoverage: 68.2,
    color: '#eab308'
  },
  { 
    level: 'Low Performance', 
    regions: ['Tanah Abang'],
    count: 1,
    avgPenetration: 53.8,
    avgCoverage: 55.0,
    color: '#ef4444'
  },
];

const tamGapAnalysis = [
  { region: 'Menteng', tam: 450, realization: 320, gap: 130, marketShare: 28.5 },
  { region: 'Tanah Abang', tam: 520, realization: 280, gap: 240, marketShare: 22.1 },
  { region: 'Gambir', tam: 380, realization: 290, gap: 90, marketShare: 31.2 },
  { region: 'Sawah Besar', tam: 410, realization: 310, gap: 100, marketShare: 29.8 },
  { region: 'Kemayoran', tam: 390, realization: 250, gap: 140, marketShare: 24.3 },
  { region: 'Senen', tam: 360, realization: 240, gap: 120, marketShare: 23.5 },
  { region: 'Cempaka Putih', tam: 340, realization: 220, gap: 120, marketShare: 21.8 },
  { region: 'Johar Baru', tam: 370, realization: 257, gap: 113, marketShare: 25.2 },
];

const coverageRatios = [
  { region: 'Menteng', coverage: 71.1, target: 75, status: 'on-track' },
  { region: 'Gambir', coverage: 76.3, target: 75, status: 'exceeds' },
  { region: 'Sawah Besar', coverage: 75.6, target: 75, status: 'exceeds' },
  { region: 'Johar Baru', coverage: 69.5, target: 75, status: 'on-track' },
  { region: 'Senen', coverage: 66.7, target: 75, status: 'below' },
  { region: 'Kemayoran', coverage: 64.1, target: 75, status: 'below' },
  { region: 'Cempaka Putih', coverage: 64.7, target: 75, status: 'below' },
  { region: 'Tanah Abang', coverage: 53.8, target: 75, status: 'critical' },
];

const ClusterAnalysisView: FC = () => {
  return (
    <PageLayout
      title="Cluster & Area Analysis"
      subtitle="Regional performance categorization and market analysis"
    >
      <div className="space-y-6">
        {/* Performance Clusters */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Performance Clusters</h3>
              <p className="text-sm text-slate-500">Regions categorized by performance level</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {performanceClusters.map((cluster) => (
              <div 
                key={cluster.level}
                className="border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: cluster.color }}
                    />
                    <h4 className="text-sm font-bold text-slate-900">{cluster.level}</h4>
                  </div>
                  <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {cluster.count} regions
                  </span>
                </div>
                
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Avg Penetration:</span>
                    <span className="font-bold text-slate-900">{cluster.avgPenetration}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-600">Avg Coverage:</span>
                    <span className="font-bold text-slate-900">{cluster.avgCoverage}%</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <p className="text-xs text-slate-500 mb-1">Regions:</p>
                  <div className="flex flex-wrap gap-1">
                    {cluster.regions.map((region) => (
                      <span 
                        key={region}
                        className="text-xs bg-slate-50 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {region}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TAM vs Realization Gap Analysis */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">TAM vs Realization Gap</h3>
              <p className="text-sm text-slate-500">Market potential versus actual achievement per region</p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tamGapAnalysis}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="region" 
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
                />
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '12px', fontWeight: 600 }}
                  iconType="circle"
                />
                <Bar dataKey="tam" fill="#94a3b8" name="TAM (Total Addressable Market)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="realization" fill="#4f46e5" name="Realization" radius={[4, 4, 0, 0]} />
                <Bar dataKey="gap" fill="#ef4444" name="Gap" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Market Share & Coverage Ratio */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Share Estimation */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Market Share by Region</h3>
                <p className="text-sm text-slate-500">Estimated market share percentage</p>
              </div>
            </div>

            <div className="space-y-3">
              {tamGapAnalysis
                .sort((a, b) => b.marketShare - a.marketShare)
                .map((region) => (
                  <div key={region.region} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-bold text-slate-700">{region.region}</span>
                        <span className="text-xs font-bold text-indigo-600">{region.marketShare}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                          style={{ width: `${region.marketShare * 3}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Coverage Ratio Metrics */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Coverage Ratio Metrics</h3>
                <p className="text-sm text-slate-500">Coverage vs target per region</p>
              </div>
            </div>

            <div className="space-y-3">
              {coverageRatios
                .sort((a, b) => b.coverage - a.coverage)
                .map((region) => {
                  const statusColors = {
                    'exceeds': 'text-emerald-600 bg-emerald-50',
                    'on-track': 'text-blue-600 bg-blue-50',
                    'below': 'text-orange-600 bg-orange-50',
                    'critical': 'text-red-600 bg-red-50'
                  };
                  
                  return (
                    <div key={region.region} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs font-bold text-slate-700">{region.region}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{region.coverage}%</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusColors[region.status]}`}>
                              {region.status}
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              region.status === 'exceeds' ? 'bg-emerald-600' :
                              region.status === 'on-track' ? 'bg-blue-600' :
                              region.status === 'below' ? 'bg-orange-600' :
                              'bg-red-600'
                            }`}
                            style={{ width: `${(region.coverage / region.target) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ClusterAnalysisView;
