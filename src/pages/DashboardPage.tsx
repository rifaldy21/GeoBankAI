import { FC, useMemo, useState, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, TrendingUp, AlertTriangle, ChevronRight, Filter } from 'lucide-react';
import { motion } from 'motion/react';
import PageLayout from '../components/PageLayout';
import FilterSheet from '../components/FilterSheet';
import StatCard from '../components/StatCard';
import TrendChart from '../components/TrendChart';
import ErrorBoundary from '../components/ErrorBoundary';
import { useFilters } from '../contexts/FilterContext';
import { useAuth } from '../contexts/AuthContext';
import { filterDataByRole } from '../services/auth/roleFilters';
import { Stat } from '../types';
import { MOCK_TREND_DATA } from '../mockData';

// Lazy load LeafletMap to ensure proper initialization
const LeafletMap = lazy(() => import('../components/LeafletMap'));

/**
 * DashboardPage Component
 * Executive overview page with KPIs, national heatmap, and insights
 * 
 * Features:
 * - 6 KPI cards (Total Nasabah, Total Merchant, CASA Growth, QRIS Penetration, TAM Coverage, Active Merchant Rate)
 * - National heatmap visualization using LeafletMap
 * - Top 10 regions by opportunity gap
 * - Growth trend charts (MoM, YoY)
 * - AI-generated alerts section
 * - Quick query chatbot interface link
 * - Filter sheet for filtering data
 * - Connected to FilterContext for time period filtering
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7
 */
const DashboardPage: FC = () => {
  const { filters } = useFilters();
  const { user } = useAuth();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return filters.territory.length + filters.branch.length + filters.product.length;
  }, [filters]);

  // KPI data - would be fetched from API based on filters
  const kpiStats: Stat[] = useMemo(() => [
    {
      label: 'Total Nasabah',
      value: '12,450',
      change: '+8.2% from last month',
      trend: 'up',
      icon: 'Users',
      color: 'bg-indigo-600'
    },
    {
      label: 'Total Merchant',
      value: '3,280',
      change: '+12.5% from last month',
      trend: 'up',
      icon: 'Store',
      color: 'bg-purple-600'
    },
    {
      label: 'CASA Growth',
      value: '15.8%',
      change: '+2.3% from last quarter',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'bg-emerald-600'
    },
    {
      label: 'QRIS Penetration Rate',
      value: '68.4%',
      change: '+5.1% from last month',
      trend: 'up',
      icon: 'Wallet',
      color: 'bg-amber-600'
    },
    {
      label: 'TAM Coverage',
      value: '42.3%',
      change: '+3.2% from last month',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'bg-indigo-600'
    },
    {
      label: 'Active Merchant Rate',
      value: '87.6%',
      change: '-1.2% from last month',
      trend: 'down',
      icon: 'Store',
      color: 'bg-purple-600'
    }
  ], []);

  // Top 10 regions by opportunity gap - would be fetched from API
  const topRegions = useMemo(() => {
    const allRegions = [
      { rank: 1, name: 'Jakarta Selatan', opportunityGap: 'Rp 45.2B', penetration: '38.5%', potential: 'Rp 117.3B', regionId: 'region-jakarta' },
      { rank: 2, name: 'Tangerang', opportunityGap: 'Rp 38.7B', penetration: '42.1%', potential: 'Rp 91.9B', regionId: 'region-jakarta' },
      { rank: 3, name: 'Bekasi', opportunityGap: 'Rp 35.4B', penetration: '40.3%', potential: 'Rp 87.8B', regionId: 'region-jakarta' },
      { rank: 4, name: 'Bandung', opportunityGap: 'Rp 32.1B', penetration: '45.2%', potential: 'Rp 71.0B', regionId: 'region-bandung' },
      { rank: 5, name: 'Surabaya', opportunityGap: 'Rp 29.8B', penetration: '48.7%', potential: 'Rp 61.2B', regionId: 'region-surabaya' },
      { rank: 6, name: 'Depok', opportunityGap: 'Rp 24.5B', penetration: '43.8%', potential: 'Rp 55.9B', regionId: 'region-jakarta' },
      { rank: 7, name: 'Bogor', opportunityGap: 'Rp 21.3B', penetration: '46.1%', potential: 'Rp 46.2B', regionId: 'region-jakarta' },
      { rank: 8, name: 'Semarang', opportunityGap: 'Rp 19.7B', penetration: '49.3%', potential: 'Rp 39.9B', regionId: 'region-semarang' },
      { rank: 9, name: 'Medan', opportunityGap: 'Rp 18.2B', penetration: '47.5%', potential: 'Rp 38.3B', regionId: 'region-medan' },
      { rank: 10, name: 'Makassar', opportunityGap: 'Rp 16.8B', penetration: '50.2%', potential: 'Rp 33.7B', regionId: 'region-makassar' }
    ];
    
    // Apply role-based filtering
    const filteredRegions = filterDataByRole(allRegions, user);
    
    // Re-rank after filtering
    return filteredRegions.map((region, index) => ({
      ...region,
      rank: index + 1
    }));
  }, [user]);

  // AI-generated alerts - would be fetched from API
  const aiAlerts = useMemo(() => [
    {
      id: 1,
      type: 'opportunity',
      title: 'High Potential in Jakarta Selatan',
      message: 'Detected 127 high-value merchants with low engagement. Estimated revenue opportunity: Rp 12.3B',
      priority: 'high',
      timestamp: new Date()
    },
    {
      id: 2,
      type: 'warning',
      title: 'Declining Active Merchant Rate',
      message: 'Active merchant rate dropped 1.2% in Tangerang region. 45 merchants showing reduced transaction activity.',
      priority: 'medium',
      timestamp: new Date()
    },
    {
      id: 3,
      type: 'insight',
      title: 'QRIS Adoption Surge',
      message: 'QRIS penetration increased 5.1% MoM. F&B and Retail sectors leading adoption with 78% activation rate.',
      priority: 'low',
      timestamp: new Date()
    }
  ], []);

  return (
    <>
      <PageLayout
        title="Dashboard"
        subtitle="Executive overview of territorial intelligence and performance metrics"
        filterButton={
          <button
            onClick={() => setIsFilterSheetOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
        }
      >
      {/* KPI Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* National Heatmap and Top Regions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* National Heatmap */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">National Coverage Heatmap</h3>
                <p className="text-sm text-slate-500">Geographical distribution of merchants and opportunities</p>
              </div>
            </div>
            <div className="h-[400px]">
              <ErrorBoundary>
                <Suspense fallback={
                  <div className="w-full h-full flex items-center justify-center bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
                      <p className="text-sm text-slate-600">Loading map...</p>
                    </div>
                  </div>
                }>
                  <LeafletMap />
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>

        {/* Top 10 Regions by Opportunity Gap */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Top Opportunities</h3>
              <p className="text-sm text-slate-500">Regions ranked by gap</p>
            </div>
          </div>
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {topRegions.map((region) => (
              <motion.div
                key={region.rank}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: region.rank * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm shrink-0">
                  {region.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-slate-900 truncate">{region.name}</p>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>Gap: <span className="font-bold text-slate-700">{region.opportunityGap}</span></span>
                    <span>•</span>
                    <span>{region.penetration}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Growth Trend Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TrendChart data={MOCK_TREND_DATA} />
        
        {/* YoY Comparison Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Year-over-Year Growth</h3>
                <p className="text-sm text-slate-500">Annual performance comparison</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {[
              { metric: 'Total Nasabah', current: 12450, previous: 10230, growth: 21.7 },
              { metric: 'Total Merchant', current: 3280, previous: 2650, growth: 23.8 },
              { metric: 'CASA Value', current: 1.24, previous: 0.98, growth: 26.5, unit: 'T' },
              { metric: 'QRIS Activation', current: 2245, previous: 1580, growth: 42.1 }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.metric}</p>
                  <p className="text-xs text-slate-500">
                    {item.current.toLocaleString()}{item.unit || ''} vs {item.previous.toLocaleString()}{item.unit || ''}
                  </p>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="text-xs font-bold text-emerald-700">+{item.growth}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI-Generated Alerts and Quick Query */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* AI Alerts */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">AI-Generated Alerts</h3>
                <p className="text-sm text-slate-500">Insights and recommendations from Intelligence Assistant</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {aiAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: alert.id * 0.1 }}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.priority === 'high' 
                    ? 'bg-red-50 border-red-500' 
                    : alert.priority === 'medium'
                    ? 'bg-amber-50 border-amber-500'
                    : 'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{alert.title}</h4>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                    alert.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : alert.priority === 'medium'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {alert.priority.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{alert.message}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Query Chatbot Interface */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-sm p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Intelligence Assistant</h3>
              <p className="text-sm text-indigo-100">Ask anything about your data</p>
            </div>
          </div>
          
          <div className="space-y-3 mb-6">
            <p className="text-sm text-indigo-100">Quick queries:</p>
            {[
              'Show top performing RMs',
              'Analyze CASA growth trends',
              'Find high-potential regions'
            ].map((query, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
              >
                {query}
              </button>
            ))}
          </div>

          <Link
            to="/intelligence-assistant"
            className="block w-full px-4 py-3 rounded-xl bg-white text-indigo-600 font-bold text-center hover:bg-indigo-50 transition-colors"
          >
            Open Intelligence Assistant
          </Link>
        </div>
      </div>
    </PageLayout>

    {/* Filter Sheet */}
    <FilterSheet
      isOpen={isFilterSheetOpen}
      onClose={() => setIsFilterSheetOpen(false)}
    />
    </>
  );
};

export default DashboardPage;
