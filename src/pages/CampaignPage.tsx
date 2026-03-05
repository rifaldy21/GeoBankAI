import { FC, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Download, Plus, Target, TrendingUp, Users, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import PageLayout from '../components/PageLayout';
import PageFilters from '../components/PageFilters';
import StatCard from '../components/StatCard';
import DataTable from '../components/DataTable';
import {
  selectPriorityRegions,
  selectDormantMerchants,
  selectActiveCampaigns,
  setSelectedRegionId,
  selectCampaignLoading,
  selectCampaignError,
  setPriorityRegions,
  setDormantMerchants,
  setCampaigns
} from '../store/slices/campaignSlice';
import { useFilters } from '../contexts/FilterContext';
import { useAuth } from '../contexts/AuthContext';
import { filterDataByRole, filterMerchants, filterCampaigns } from '../services/auth/roleFilters';
import { Stat } from '../types';
import { MOCK_PRIORITY_REGIONS, MOCK_DORMANT_MERCHANTS, MOCK_ACTIVE_CAMPAIGNS } from '../mockData';

/**
 * CampaignPage Component
 * Campaign and activation management page
 * 
 * Features:
 * - Display priority regions ranked by opportunity score
 * - Display dormant merchants list with last activity date
 * - Generate follow-up action lists for RMs
 * - Track activation success rates per campaign
 * - Region selection with downloadable merchant target list
 * - Campaign creation and management interface
 * - Use existing chart components for metrics visualization
 * 
 * Requirements: 15.1, 15.2, 15.3, 15.4, 15.5
 */
const CampaignPage: FC = () => {
  const dispatch = useDispatch();
  const { filters } = useFilters();
  const { user } = useAuth();
  
  // Redux state
  const priorityRegions = useSelector(selectPriorityRegions);
  const dormantMerchants = useSelector(selectDormantMerchants);
  const activeCampaigns = useSelector(selectActiveCampaigns);
  const loading = useSelector(selectCampaignLoading);
  const error = useSelector(selectCampaignError);

  // Apply role-based filtering
  const filteredPriorityRegions = useMemo(() => filterDataByRole(priorityRegions, user), [priorityRegions, user]);
  const filteredDormantMerchants = useMemo(() => filterMerchants(dormantMerchants, user), [dormantMerchants, user]);
  const filteredActiveCampaigns = useMemo(() => filterCampaigns(activeCampaigns, user), [activeCampaigns, user]);

  // Local state
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);

  // Initialize mock data on component mount
  useEffect(() => {
    dispatch(setPriorityRegions(MOCK_PRIORITY_REGIONS));
    dispatch(setDormantMerchants(MOCK_DORMANT_MERCHANTS));
    dispatch(setCampaigns(MOCK_ACTIVE_CAMPAIGNS));
  }, [dispatch]);

  // Campaign KPI stats
  const campaignStats: Stat[] = useMemo(() => [
    {
      label: 'Active Campaigns',
      value: filteredActiveCampaigns.length.toString(),
      change: '+3 from last month',
      trend: 'up',
      icon: 'Target',
      color: 'bg-indigo-600'
    },
    {
      label: 'Dormant Merchants',
      value: filteredDormantMerchants.length.toString(),
      change: '-12% from last month',
      trend: 'down',
      icon: 'Store',
      color: 'bg-amber-600'
    },
    {
      label: 'Avg Activation Rate',
      value: '68.4%',
      change: '+5.2% from last month',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'bg-emerald-600'
    },
    {
      label: 'Total Revenue Impact',
      value: 'Rp 45.2B',
      change: '+18.3% from last month',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'bg-purple-600'
    }
  ], [filteredActiveCampaigns.length, filteredDormantMerchants.length]);

  // Priority regions table columns
  const priorityRegionColumns = useMemo(() => [
    {
      key: 'rank' as const,
      header: 'Rank',
      sortable: true,
      width: '80px',
      render: (value: number) => (
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 font-bold text-sm">
          {value}
        </div>
      )
    },
    {
      key: 'regionName' as const,
      header: 'Region',
      sortable: true,
      render: (value: string) => (
        <span className="font-bold text-slate-900">{value}</span>
      )
    },
    {
      key: 'opportunityScore' as const,
      header: 'Opportunity Score',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-sm font-bold text-slate-700">{value}</span>
        </div>
      )
    },
    {
      key: 'potentialRevenue' as const,
      header: 'Potential Revenue',
      sortable: true,
      render: (value: number) => (
        <span className="font-bold text-emerald-600">
          Rp {(value / 1000000000).toFixed(1)}B
        </span>
      )
    },
    {
      key: 'merchantCount' as const,
      header: 'Merchants',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm text-slate-600">{value.toLocaleString()}</span>
      )
    }
  ], []);

  // Dormant merchants table columns
  const dormantMerchantColumns = useMemo(() => [
    {
      key: 'name' as const,
      header: 'Merchant Name',
      sortable: true,
      render: (value: string) => (
        <span className="font-bold text-slate-900">{value}</span>
      )
    },
    {
      key: 'lastActivityDate' as const,
      header: 'Last Activity',
      sortable: true,
      render: (value: Date) => (
        <span className="text-sm text-slate-600">
          {new Date(value).toLocaleDateString('id-ID')}
        </span>
      )
    },
    {
      key: 'daysSinceActivity' as const,
      header: 'Days Inactive',
      sortable: true,
      render: (value: number) => (
        <span className={`text-sm font-bold ${
          value > 90 ? 'text-red-600' : value > 60 ? 'text-amber-600' : 'text-slate-600'
        }`}>
          {value} days
        </span>
      )
    },
    {
      key: 'historicalValue' as const,
      header: 'Historical Value',
      sortable: true,
      render: (value: number) => (
        <span className="text-sm font-bold text-slate-700">
          Rp {(value / 1000000).toFixed(1)}M
        </span>
      )
    },
    {
      key: 'priority' as const,
      header: 'Priority',
      sortable: true,
      filterable: true,
      render: (value: string) => (
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          value === 'high' 
            ? 'bg-red-100 text-red-700' 
            : value === 'medium'
            ? 'bg-amber-100 text-amber-700'
            : 'bg-slate-100 text-slate-700'
        }`}>
          {value.toUpperCase()}
        </span>
      )
    },
    {
      key: 'assignedRM' as const,
      header: 'Assigned RM',
      sortable: true,
      render: (value: string | undefined) => (
        <span className="text-sm text-slate-600">{value || 'Unassigned'}</span>
      )
    }
  ], []);

  // Handle region selection for merchant list download
  const handleRegionSelect = (regionId: string) => {
    setSelectedRegion(regionId);
    dispatch(setSelectedRegionId(regionId));
  };

  // Handle merchant list download
  const handleDownloadMerchantList = () => {
    if (!selectedRegion) return;
    
    // Generate CSV content
    const region = priorityRegions.find(r => r.regionId === selectedRegion);
    const merchants = dormantMerchants; // In real app, filter by region
    
    const csvContent = [
      ['Merchant Name', 'Last Activity', 'Days Inactive', 'Historical Value', 'Priority', 'Assigned RM'],
      ...merchants.map(m => [
        m.name,
        new Date(m.lastActivityDate).toLocaleDateString('id-ID'),
        m.daysSinceActivity.toString(),
        `Rp ${(m.historicalValue / 1000000).toFixed(1)}M`,
        m.priority,
        m.assignedRM || 'Unassigned'
      ])
    ].map(row => row.join(',')).join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `merchant-target-list-${region?.regionName || 'region'}-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // Mock campaign activation trend data
  const activationTrendData = useMemo(() => [
    { month: 'Jan', activations: 45, target: 50 },
    { month: 'Feb', activations: 52, target: 55 },
    { month: 'Mar', activations: 61, target: 60 },
    { month: 'Apr', activations: 58, target: 65 },
    { month: 'May', activations: 72, target: 70 },
    { month: 'Jun', activations: 68, target: 75 }
  ], []);

  // Action buttons
  const actions = (
    <>
      <button
        onClick={() => setShowCreateCampaign(true)}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Create Campaign
      </button>
      <button
        onClick={handleDownloadMerchantList}
        disabled={!selectedRegion}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download className="w-4 h-4" />
        Download Target List
      </button>
    </>
  );

  return (
    <PageLayout
      title="Campaign & Activation"
      subtitle="Manage campaigns and merchant reactivation initiatives"
      filters={<PageFilters />}
      actions={actions}
      loading={loading}
      error={error || undefined}
    >
      {/* Campaign KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {campaignStats.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Priority Regions Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Priority Regions</h3>
              <p className="text-sm text-slate-500">Ranked by opportunity score (descending)</p>
            </div>
          </div>
        </div>
        
        <DataTable
          data={filteredPriorityRegions}
          columns={priorityRegionColumns}
          sortable={true}
          pagination={{ pageSize: 10 }}
          onRowClick={(row) => handleRegionSelect(row.regionId)}
        />
      </div>

      {/* Dormant Merchants and Campaign Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dormant Merchants List */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Dormant Merchants</h3>
                <p className="text-sm text-slate-500">Merchants requiring reactivation</p>
              </div>
            </div>
          </div>
          
          <DataTable
            data={filteredDormantMerchants}
            columns={dormantMerchantColumns}
            sortable={true}
            filterable={true}
            pagination={{ pageSize: 10 }}
          />
        </div>

        {/* Campaign Activation Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Activation Trend</h3>
              <p className="text-sm text-slate-500">Monthly performance</p>
            </div>
          </div>
          
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activationTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  dy={10}
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
                <Line 
                  type="monotone" 
                  dataKey="activations" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 4 }}
                  name="Activations"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#94a3b8" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Target"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Active Campaigns Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Active Campaigns</h3>
              <p className="text-sm text-slate-500">Currently running campaigns</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredActiveCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm text-slate-500">No active campaigns</p>
              <button
                onClick={() => setShowCreateCampaign(true)}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
              >
                Create Your First Campaign
              </button>
            </div>
          ) : (
            filteredActiveCampaigns.map((campaign, index) => (
              <motion.div
                key={campaign.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{campaign.name}</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} Campaign
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    campaign.status === 'active'
                      ? 'bg-emerald-100 text-emerald-700'
                      : campaign.status === 'draft'
                      ? 'bg-slate-100 text-slate-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {campaign.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-3">
                  <div>
                    <p className="text-xs text-slate-500">Target</p>
                    <p className="text-sm font-bold text-slate-900">{campaign.metrics.targetCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Contacted</p>
                    <p className="text-sm font-bold text-slate-900">{campaign.metrics.contacted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Converted</p>
                    <p className="text-sm font-bold text-emerald-600">{campaign.metrics.converted}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Rate</p>
                    <p className="text-sm font-bold text-indigo-600">{campaign.metrics.conversionRate}%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>{campaign.targetRegions.length} regions • {campaign.assignedRMs.length} RMs</span>
                  <span>Revenue: Rp {(campaign.metrics.revenue / 1000000000).toFixed(1)}B</span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* RM Follow-up Actions Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">RM Follow-up Actions</h3>
            <p className="text-sm text-slate-500">Recommended actions for relationship managers</p>
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              rm: 'Ahmad Fauzi',
              actions: 12,
              priority: 'high',
              region: 'Jakarta Selatan',
              description: '8 high-priority dormant merchants requiring immediate contact'
            },
            {
              rm: 'Siti Nurhaliza',
              actions: 8,
              priority: 'medium',
              region: 'Tangerang',
              description: '5 medium-priority merchants for reactivation campaign'
            },
            {
              rm: 'Budi Santoso',
              actions: 15,
              priority: 'high',
              region: 'Bekasi',
              description: '10 high-value merchants with declining activity'
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-slate-50 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{item.rm}</h4>
                  <p className="text-xs text-slate-500">{item.region}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    item.priority === 'high'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {item.actions} ACTIONS
                  </span>
                </div>
              </div>
              <p className="text-sm text-slate-600">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default CampaignPage;
