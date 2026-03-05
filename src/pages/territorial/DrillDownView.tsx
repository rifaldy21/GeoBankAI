import { FC, useState, useMemo } from 'react';
import { ChevronRight, Home, MapPin, Users, Store, TrendingUp, Target, Award } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import SimpleLeafletMap from '../../components/SimpleLeafletMap';
import { useAuth } from '../../contexts/AuthContext';
import { filterRegions } from '../../services/auth/roleFilters';

interface Region {
  id: string;
  name: string;
  level: 'province' | 'city' | 'district' | 'village';
  parentId?: string;
  metrics: {
    totalCustomers: number;
    totalMerchants: number;
    transactionVolume: number;
    assignedRMs: number;
    targetRealization: number;
    opportunityScore: number;
  };
  children?: Region[];
}

// Mock hierarchical data
const mockRegions: Region = {
  id: 'dki-jakarta',
  name: 'DKI Jakarta',
  level: 'province',
  metrics: {
    totalCustomers: 45280,
    totalMerchants: 12847,
    transactionVolume: 8.5,
    assignedRMs: 156,
    targetRealization: 78.5,
    opportunityScore: 85,
  },
  children: [
    {
      id: 'jakarta-pusat',
      name: 'Jakarta Pusat',
      level: 'city',
      parentId: 'dki-jakarta',
      metrics: {
        totalCustomers: 8520,
        totalMerchants: 2847,
        transactionVolume: 1.8,
        assignedRMs: 24,
        targetRealization: 72.3,
        opportunityScore: 82,
      },
      children: [
        {
          id: 'menteng',
          name: 'Menteng',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 1250,
            totalMerchants: 320,
            transactionVolume: 0.45,
            assignedRMs: 3,
            targetRealization: 71.1,
            opportunityScore: 78,
          },
          children: [
            {
              id: 'menteng-village-1',
              name: 'Menteng Village 1',
              level: 'village',
              parentId: 'menteng',
              metrics: {
                totalCustomers: 420,
                totalMerchants: 105,
                transactionVolume: 0.15,
                assignedRMs: 1,
                targetRealization: 68.5,
                opportunityScore: 75,
              },
            },
            {
              id: 'menteng-village-2',
              name: 'Menteng Village 2',
              level: 'village',
              parentId: 'menteng',
              metrics: {
                totalCustomers: 380,
                totalMerchants: 95,
                transactionVolume: 0.13,
                assignedRMs: 1,
                targetRealization: 72.8,
                opportunityScore: 76,
              },
            },
            {
              id: 'menteng-village-3',
              name: 'Menteng Village 3',
              level: 'village',
              parentId: 'menteng',
              metrics: {
                totalCustomers: 450,
                totalMerchants: 120,
                transactionVolume: 0.17,
                assignedRMs: 1,
                targetRealization: 73.2,
                opportunityScore: 80,
              },
            },
          ],
        },
        {
          id: 'tanah-abang',
          name: 'Tanah Abang',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 1580,
            totalMerchants: 280,
            transactionVolume: 0.38,
            assignedRMs: 4,
            targetRealization: 53.8,
            opportunityScore: 88,
          },
        },
        {
          id: 'gambir',
          name: 'Gambir',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 1120,
            totalMerchants: 290,
            transactionVolume: 0.42,
            assignedRMs: 3,
            targetRealization: 76.3,
            opportunityScore: 74,
          },
        },
        {
          id: 'sawah-besar',
          name: 'Sawah Besar',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 1340,
            totalMerchants: 310,
            transactionVolume: 0.48,
            assignedRMs: 3,
            targetRealization: 75.6,
            opportunityScore: 76,
          },
        },
        {
          id: 'kemayoran',
          name: 'Kemayoran',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 980,
            totalMerchants: 250,
            transactionVolume: 0.35,
            assignedRMs: 3,
            targetRealization: 64.1,
            opportunityScore: 81,
          },
        },
        {
          id: 'senen',
          name: 'Senen',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 890,
            totalMerchants: 240,
            transactionVolume: 0.32,
            assignedRMs: 2,
            targetRealization: 66.7,
            opportunityScore: 79,
          },
        },
        {
          id: 'cempaka-putih',
          name: 'Cempaka Putih',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 820,
            totalMerchants: 220,
            transactionVolume: 0.28,
            assignedRMs: 2,
            targetRealization: 64.7,
            opportunityScore: 77,
          },
        },
        {
          id: 'johar-baru',
          name: 'Johar Baru',
          level: 'district',
          parentId: 'jakarta-pusat',
          metrics: {
            totalCustomers: 940,
            totalMerchants: 257,
            transactionVolume: 0.34,
            assignedRMs: 2,
            targetRealization: 69.5,
            opportunityScore: 80,
          },
        },
      ],
    },
  ],
};

const DrillDownView: FC = () => {
  const { user } = useAuth();
  const [drillDownHistory, setDrillDownHistory] = useState<Region[]>([mockRegions]);
  const currentRegion = drillDownHistory[drillDownHistory.length - 1];

  // Filter sub-regions based on user role
  const filteredChildren = useMemo(() => {
    if (!currentRegion.children) return [];
    return filterRegions(currentRegion.children, user);
  }, [currentRegion.children, user]);

  const handleRegionClick = (region: Region) => {
    if (region.children && region.children.length > 0) {
      setDrillDownHistory([...drillDownHistory, region]);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    setDrillDownHistory(drillDownHistory.slice(0, index + 1));
  };

  const getLevelLabel = (level: string) => {
    const labels = {
      province: 'Province',
      city: 'City',
      district: 'District',
      village: 'Village',
    };
    return labels[level as keyof typeof labels] || level;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <PageLayout
      title="Drill-down Capability"
      subtitle="Hierarchical regional analysis with detailed metrics"
    >
      <div className="space-y-6">
        {/* Breadcrumb Trail */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Home className="w-4 h-4 text-slate-400" />
            {drillDownHistory.map((region, index) => (
              <div key={region.id} className="flex items-center gap-2">
                {index > 0 && <ChevronRight className="w-3 h-3 text-slate-300" />}
                <button
                  onClick={() => handleBreadcrumbClick(index)}
                  className={`text-sm font-bold transition-colors ${
                    index === drillDownHistory.length - 1
                      ? 'text-indigo-600'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {region.name}
                </button>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                  {getLevelLabel(region.level)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Current Region Metrics */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{currentRegion.name}</h3>
              <p className="text-sm text-slate-500">
                {getLevelLabel(currentRegion.level)} Level Metrics
              </p>
            </div>
            <div className={`px-4 py-2 rounded-xl text-sm font-bold ${getScoreColor(currentRegion.metrics.opportunityScore)}`}>
              Opportunity Score: {currentRegion.metrics.opportunityScore}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-bold text-slate-500">Total Customers</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {currentRegion.metrics.totalCustomers.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Store className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-bold text-slate-500">Total Merchants</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {currentRegion.metrics.totalMerchants.toLocaleString()}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold text-slate-500">Transaction Volume</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                Rp {currentRegion.metrics.transactionVolume}B
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-orange-600" />
                <span className="text-xs font-bold text-slate-500">Assigned RMs</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {currentRegion.metrics.assignedRMs}
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-500">Target vs Realization</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {currentRegion.metrics.targetRealization}%
              </p>
            </div>

            <div className="bg-slate-50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-cyan-600" />
                <span className="text-xs font-bold text-slate-500">Opportunity Score</span>
              </div>
              <p className="text-2xl font-bold text-slate-900">
                {currentRegion.metrics.opportunityScore}
              </p>
            </div>
          </div>
        </div>

        {/* Map View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Regional Map View</h3>
          <div className="h-96">
            <SimpleLeafletMap />
          </div>
        </div>

        {/* Sub-regions List */}
        {filteredChildren.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">
              Sub-regions ({filteredChildren.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredChildren.map((region) => (
                <button
                  key={region.id}
                  onClick={() => handleRegionClick(region)}
                  className="text-left border border-slate-200 rounded-xl p-4 hover:border-indigo-500 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-indigo-600" />
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {region.name}
                      </h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Customers:</span>
                      <span className="font-bold text-slate-900">
                        {region.metrics.totalCustomers.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Merchants:</span>
                      <span className="font-bold text-slate-900">
                        {region.metrics.totalMerchants.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Target Realization:</span>
                      <span className="font-bold text-slate-900">
                        {region.metrics.targetRealization}%
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600">Opportunity:</span>
                      <span className={`font-bold px-2 py-0.5 rounded ${getScoreColor(region.metrics.opportunityScore)}`}>
                        {region.metrics.opportunityScore}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* End of drill-down message */}
        {filteredChildren.length === 0 && (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 text-center">
            <MapPin className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-600">
              You've reached the lowest level ({getLevelLabel(currentRegion.level)})
            </p>
            <p className="text-xs text-slate-500 mt-1">
              No further drill-down available for this region
            </p>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DrillDownView;
