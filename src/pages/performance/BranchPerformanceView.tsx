import { FC, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Building2, Users, Store, TrendingUp, DollarSign, MapPin, Target, AlertCircle } from 'lucide-react';
import PageLayout from '../../components/PageLayout';
import { useAuth } from '../../contexts/AuthContext';
import { filterBranches } from '../../services/auth/roleFilters';
import 'leaflet/dist/leaflet.css';

// Mock data for branch performance
const branchData = [
  {
    id: 'branch-001',
    name: 'Jakarta Pusat',
    code: 'JKT-001',
    location: { lat: -6.1751, lng: 106.8650 },
    coverage: {
      area: 48.13,
      districts: ['Menteng', 'Tanah Abang', 'Gambir', 'Sawah Besar', 'Kemayoran', 'Senen', 'Cempaka Putih', 'Johar Baru'],
      villages: 44,
      radiusKm: 5
    },
    kpis: {
      totalCustomers: 12500,
      totalMerchants: 3200,
      casaTotal: 125.5,
      creditOutstanding: 89.2,
      productivity: 87.5,
      unaddressedOpportunities: 1850
    },
    rmCount: 8,
    territory: 'DKI Jakarta'
  },
  {
    id: 'branch-002',
    name: 'Jakarta Selatan',
    code: 'JKT-002',
    location: { lat: -6.2615, lng: 106.8106 },
    coverage: {
      area: 141.27,
      districts: ['Kebayoran Baru', 'Kebayoran Lama', 'Pesanggrahan', 'Cilandak', 'Pasar Minggu', 'Jagakarsa', 'Mampang Prapatan', 'Pancoran', 'Tebet', 'Setiabudi'],
      villages: 65,
      radiusKm: 7
    },
    kpis: {
      totalCustomers: 18200,
      totalMerchants: 4500,
      casaTotal: 185.3,
      creditOutstanding: 142.8,
      productivity: 92.3,
      unaddressedOpportunities: 2100
    },
    rmCount: 12,
    territory: 'DKI Jakarta'
  },
  {
    id: 'branch-003',
    name: 'Jakarta Utara',
    code: 'JKT-003',
    location: { lat: -6.1385, lng: 106.8631 },
    coverage: {
      area: 146.66,
      districts: ['Penjaringan', 'Pademangan', 'Tanjung Priok', 'Koja', 'Kelapa Gading', 'Cilincing'],
      villages: 31,
      radiusKm: 6
    },
    kpis: {
      totalCustomers: 15800,
      totalMerchants: 3900,
      casaTotal: 158.7,
      creditOutstanding: 112.5,
      productivity: 85.2,
      unaddressedOpportunities: 2350
    },
    rmCount: 10,
    territory: 'DKI Jakarta'
  },
  {
    id: 'branch-004',
    name: 'Jakarta Timur',
    code: 'JKT-004',
    location: { lat: -6.2250, lng: 106.9004 },
    coverage: {
      area: 188.03,
      districts: ['Matraman', 'Pulo Gadung', 'Jatinegara', 'Kramat Jati', 'Pasar Rebo', 'Cakung', 'Duren Sawit', 'Makasar', 'Ciracas', 'Cipayung'],
      villages: 65,
      radiusKm: 8
    },
    kpis: {
      totalCustomers: 16500,
      totalMerchants: 4100,
      casaTotal: 165.2,
      creditOutstanding: 118.9,
      productivity: 88.7,
      unaddressedOpportunities: 2580
    },
    rmCount: 11,
    territory: 'DKI Jakarta'
  },
  {
    id: 'branch-005',
    name: 'Jakarta Barat',
    code: 'JKT-005',
    location: { lat: -6.1668, lng: 106.7594 },
    coverage: {
      area: 129.54,
      districts: ['Cengkareng', 'Grogol Petamburan', 'Taman Sari', 'Tambora', 'Kebon Jeruk', 'Kalideres', 'Palmerah', 'Kembangan'],
      villages: 56,
      radiusKm: 6
    },
    kpis: {
      totalCustomers: 14200,
      totalMerchants: 3600,
      casaTotal: 142.8,
      creditOutstanding: 98.5,
      productivity: 83.9,
      unaddressedOpportunities: 2200
    },
    rmCount: 9,
    territory: 'DKI Jakarta'
  }
];

// Productivity trend data
const productivityTrendData = [
  { month: 'Jan', 'Jakarta Pusat': 82, 'Jakarta Selatan': 88, 'Jakarta Utara': 80, 'Jakarta Timur': 84, 'Jakarta Barat': 79 },
  { month: 'Feb', 'Jakarta Pusat': 84, 'Jakarta Selatan': 89, 'Jakarta Utara': 82, 'Jakarta Timur': 85, 'Jakarta Barat': 81 },
  { month: 'Mar', 'Jakarta Pusat': 85, 'Jakarta Selatan': 90, 'Jakarta Utara': 83, 'Jakarta Timur': 86, 'Jakarta Barat': 82 },
  { month: 'Apr', 'Jakarta Pusat': 86, 'Jakarta Selatan': 91, 'Jakarta Utara': 84, 'Jakarta Timur': 87, 'Jakarta Barat': 83 },
  { month: 'May', 'Jakarta Pusat': 87, 'Jakarta Selatan': 92, 'Jakarta Utara': 85, 'Jakarta Timur': 88, 'Jakarta Barat': 84 },
  { month: 'Jun', 'Jakarta Pusat': 87.5, 'Jakarta Selatan': 92.3, 'Jakarta Utara': 85.2, 'Jakarta Timur': 88.7, 'Jakarta Barat': 83.9 }
];

const BranchPerformanceView: FC = () => {
  const { user } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<string | null>(null);
  const [territoryFilter, setTerritoryFilter] = useState<string>('all');

  // Apply role-based filtering first
  const roleFilteredData = useMemo(() => {
    return filterBranches(branchData, user);
  }, [user]);

  // Apply additional filters
  const filteredData = roleFilteredData.filter(branch => {
    if (territoryFilter !== 'all' && branch.territory !== territoryFilter) return false;
    return true;
  });

  // Calculate summary metrics
  const totalCustomers = filteredData.reduce((sum, branch) => sum + branch.kpis.totalCustomers, 0);
  const totalMerchants = filteredData.reduce((sum, branch) => sum + branch.kpis.totalMerchants, 0);
  const totalCASA = filteredData.reduce((sum, branch) => sum + branch.kpis.casaTotal, 0);
  const totalCredit = filteredData.reduce((sum, branch) => sum + branch.kpis.creditOutstanding, 0);
  const avgProductivity = filteredData.reduce((sum, branch) => sum + branch.kpis.productivity, 0) / filteredData.length;

  const selectedBranchData = selectedBranch ? branchData.find(b => b.id === selectedBranch) : null;

  return (
    <PageLayout
      title="Branch Performance"
      subtitle="Branch-level KPIs, coverage metrics, and territorial productivity"
      filters={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-bold text-slate-700">Territory:</label>
            <select
              value={territoryFilter}
              onChange={(e) => setTerritoryFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="all">All Territories</option>
              <option value="DKI Jakarta">DKI Jakarta</option>
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
                <p className="text-xs font-bold text-slate-500">Total Customers</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalCustomers.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total Merchants</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{totalMerchants.toLocaleString()}</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Total CASA</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">Rp {totalCASA.toFixed(1)}B</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Credit Outstanding</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">Rp {totalCredit.toFixed(1)}B</p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-rose-100 text-rose-600 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-500">Avg Productivity</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{avgProductivity.toFixed(1)}%</p>
          </div>
        </div>

        {/* Map View */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Branch Locations & Coverage Areas</h3>
              <p className="text-sm text-slate-500">Interactive map showing branch locations and service radius</p>
            </div>
          </div>

          <div className="h-96 rounded-xl overflow-hidden border border-slate-200">
            <MapContainer
              center={[-6.2088, 106.8456]}
              zoom={11}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {filteredData.map(branch => (
                <div key={branch.id}>
                  <Circle
                    center={[branch.location.lat, branch.location.lng]}
                    radius={branch.coverage.radiusKm * 1000}
                    pathOptions={{
                      color: '#4f46e5',
                      fillColor: '#4f46e5',
                      fillOpacity: 0.1
                    }}
                  />
                  <Marker
                    position={[branch.location.lat, branch.location.lng]}
                    eventHandlers={{
                      click: () => setSelectedBranch(branch.id)
                    }}
                  >
                    <Popup>
                      <div className="p-2">
                        <h4 className="font-bold text-slate-900 mb-1">{branch.name}</h4>
                        <p className="text-xs text-slate-600 mb-2">{branch.code}</p>
                        <div className="space-y-1 text-xs">
                          <p><span className="font-bold">Customers:</span> {branch.kpis.totalCustomers.toLocaleString()}</p>
                          <p><span className="font-bold">Merchants:</span> {branch.kpis.totalMerchants.toLocaleString()}</p>
                          <p><span className="font-bold">CASA:</span> Rp {branch.kpis.casaTotal}B</p>
                          <p><span className="font-bold">Productivity:</span> {branch.kpis.productivity}%</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                </div>
              ))}
            </MapContainer>
          </div>
        </div>

        {/* Productivity Trend */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Productivity Metrics per Branch Territory</h3>
              <p className="text-sm text-slate-500">6-month productivity trend comparison</p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={productivityTrendData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  domain={[70, 100]}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '12px'
                  }}
                />
                <Line type="monotone" dataKey="Jakarta Pusat" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Jakarta Selatan" stroke="#06b6d4" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Jakarta Utara" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Jakarta Timur" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="Jakarta Barat" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch KPIs Comparison */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Branch KPI Comparison</h3>
              <p className="text-sm text-slate-500">Customer and merchant counts by branch</p>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
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
                  formatter={(value: number) => [value.toLocaleString(), '']}
                />
                <Bar dataKey="kpis.totalCustomers" fill="#4f46e5" radius={[4, 4, 0, 0]} name="Customers" />
                <Bar dataKey="kpis.totalMerchants" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Merchants" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Branch Details Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Unaddressed Opportunities per Branch</h3>
              <p className="text-sm text-slate-500">Detailed branch metrics and coverage information</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 text-xs font-bold text-slate-700">Branch</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-slate-700">Coverage Area</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-slate-700">Districts</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-slate-700">RMs</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-slate-700">Productivity</th>
                  <th className="text-right py-3 px-4 text-xs font-bold text-slate-700">Opportunities</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((branch) => (
                  <tr
                    key={branch.id}
                    className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedBranch(branch.id === selectedBranch ? null : branch.id)}
                  >
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{branch.name}</p>
                        <p className="text-xs text-slate-500">{branch.code}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-700 text-right">
                      {branch.coverage.area.toFixed(2)} km²
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-700 text-right">
                      {branch.coverage.districts.length}
                    </td>
                    <td className="py-3 px-4 text-sm text-slate-700 text-right">
                      {branch.rmCount}
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-right">
                      <span className={
                        branch.kpis.productivity >= 90 ? 'text-emerald-600' :
                        branch.kpis.productivity >= 80 ? 'text-indigo-600' :
                        'text-amber-600'
                      }>
                        {branch.kpis.productivity}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-bold text-red-600 text-right">
                      {branch.kpis.unaddressedOpportunities.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Branch Details */}
        {selectedBranchData && (
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-600 text-white rounded-lg">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{selectedBranchData.name}</h3>
                  <p className="text-sm text-slate-600">{selectedBranchData.code}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedBranch(null)}
                className="px-4 py-2 bg-white text-slate-700 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 mb-2">Coverage Area</p>
                <p className="text-2xl font-bold text-slate-900">{selectedBranchData.coverage.area} km²</p>
                <p className="text-xs text-slate-600 mt-1">{selectedBranchData.coverage.villages} villages</p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 mb-2">Total Customers</p>
                <p className="text-2xl font-bold text-slate-900">{selectedBranchData.kpis.totalCustomers.toLocaleString()}</p>
                <p className="text-xs text-slate-600 mt-1">{selectedBranchData.kpis.totalMerchants.toLocaleString()} merchants</p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 mb-2">CASA Total</p>
                <p className="text-2xl font-bold text-slate-900">Rp {selectedBranchData.kpis.casaTotal}B</p>
                <p className="text-xs text-slate-600 mt-1">Rp {selectedBranchData.kpis.creditOutstanding}B credit</p>
              </div>

              <div className="bg-white rounded-xl p-4">
                <p className="text-xs font-bold text-slate-500 mb-2">Productivity</p>
                <p className="text-2xl font-bold text-emerald-600">{selectedBranchData.kpis.productivity}%</p>
                <p className="text-xs text-slate-600 mt-1">{selectedBranchData.rmCount} RMs</p>
              </div>
            </div>

            <div className="mt-4 bg-white rounded-xl p-4">
              <p className="text-xs font-bold text-slate-700 mb-2">Coverage Districts</p>
              <div className="flex flex-wrap gap-2">
                {selectedBranchData.coverage.districts.map(district => (
                  <span
                    key={district}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold"
                  >
                    {district}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default BranchPerformanceView;
