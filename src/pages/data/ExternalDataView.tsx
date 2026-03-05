import { FC, useState, useMemo, useRef } from 'react';
import { Users, TrendingUp, MapPin, Store, Upload, FileCheck, AlertCircle, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import PageLayout from '../../components/PageLayout';
import DataTable, { ColumnDef } from '../../components/DataTable';

interface DemographicData {
  id: string;
  region: string;
  population: number;
  productiveAge: number;
  averageIncome: number;
  urbanization: number;
  lastUpdated: string;
}

interface GDPData {
  id: string;
  region: string;
  gdp: number;
  gdpPerCapita: number;
  growthRate: number;
  sector: string;
  year: number;
  lastUpdated: string;
}

interface POIData {
  id: string;
  name: string;
  category: string;
  region: string;
  latitude: number;
  longitude: number;
  lastUpdated: string;
}

interface MerchantDirectory {
  id: string;
  name: string;
  category: string;
  region: string;
  address: string;
  phone: string;
  lastUpdated: string;
}

type TabType = 'demographic' | 'gdp' | 'poi' | 'directory';

/**
 * ExternalDataView Component
 * Manage external data sources with import functionality
 * 
 * Features:
 * - Tabs for demographic data, regional GDP data, POI data, merchant directory data
 * - DataTable component for each data type
 * - Data source information with last update timestamp
 * - File import functionality for external data
 * - File upload component with validation
 * 
 * Requirements: 13.1, 13.2, 13.3
 */
const ExternalDataView: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('demographic');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - would be fetched from API
  const demographicData: DemographicData[] = useMemo(() => [
    {
      id: 'D001',
      region: 'Jakarta Selatan',
      population: 2185000,
      productiveAge: 1450000,
      averageIncome: 8500000,
      urbanization: 98.5,
      lastUpdated: '2024-01-01'
    },
    {
      id: 'D002',
      region: 'Jakarta Pusat',
      population: 928000,
      productiveAge: 620000,
      averageIncome: 9200000,
      urbanization: 99.2,
      lastUpdated: '2024-01-01'
    },
    {
      id: 'D003',
      region: 'Bandung',
      population: 2500000,
      productiveAge: 1650000,
      averageIncome: 6800000,
      urbanization: 92.3,
      lastUpdated: '2024-01-01'
    }
  ], []);

  const gdpData: GDPData[] = useMemo(() => [
    {
      id: 'G001',
      region: 'DKI Jakarta',
      gdp: 2840.5,
      gdpPerCapita: 265.8,
      growthRate: 5.8,
      sector: 'Services',
      year: 2023,
      lastUpdated: '2024-01-01'
    },
    {
      id: 'G002',
      region: 'Jawa Barat',
      gdp: 2165.8,
      gdpPerCapita: 45.2,
      growthRate: 5.2,
      sector: 'Manufacturing',
      year: 2023,
      lastUpdated: '2024-01-01'
    },
    {
      id: 'G003',
      region: 'Jawa Timur',
      gdp: 2150.3,
      gdpPerCapita: 54.8,
      growthRate: 5.5,
      sector: 'Agriculture',
      year: 2023,
      lastUpdated: '2024-01-01'
    }
  ], []);

  const poiData: POIData[] = useMemo(() => [
    {
      id: 'P001',
      name: 'Plaza Senayan',
      category: 'Shopping Mall',
      region: 'Jakarta Selatan',
      latitude: -6.2297,
      longitude: 106.7990,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'P002',
      name: 'Grand Indonesia',
      category: 'Shopping Mall',
      region: 'Jakarta Pusat',
      latitude: -6.1953,
      longitude: 106.8230,
      lastUpdated: '2024-01-10'
    },
    {
      id: 'P003',
      name: 'Paris Van Java',
      category: 'Shopping Mall',
      region: 'Bandung',
      latitude: -6.8942,
      longitude: 107.5794,
      lastUpdated: '2024-01-10'
    }
  ], []);

  const directoryData: MerchantDirectory[] = useMemo(() => [
    {
      id: 'MD001',
      name: 'Restoran Padang Sederhana',
      category: 'F&B',
      region: 'Jakarta Selatan',
      address: 'Jl. Senopati No. 45',
      phone: '+62215551234',
      lastUpdated: '2024-01-12'
    },
    {
      id: 'MD002',
      name: 'Toko Buku Gramedia',
      category: 'Retail',
      region: 'Jakarta Pusat',
      address: 'Jl. Thamrin No. 11',
      phone: '+62215552345',
      lastUpdated: '2024-01-12'
    },
    {
      id: 'MD003',
      name: 'Apotek Kimia Farma',
      category: 'Healthcare',
      region: 'Bandung',
      address: 'Jl. Asia Afrika No. 88',
      phone: '+62225553456',
      lastUpdated: '2024-01-12'
    }
  ], []);

  // Define columns for each data type
  const demographicColumns: ColumnDef<DemographicData>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'region', header: 'Region', sortable: true, filterable: true },
    {
      key: 'population',
      header: 'Population',
      sortable: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'productiveAge',
      header: 'Productive Age',
      sortable: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'averageIncome',
      header: 'Avg Income',
      sortable: true,
      render: (value) => `Rp ${(value / 1000000).toFixed(1)}M`
    },
    {
      key: 'urbanization',
      header: 'Urbanization',
      sortable: true,
      render: (value) => `${value.toFixed(1)}%`
    },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  const gdpColumns: ColumnDef<GDPData>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'region', header: 'Region', sortable: true, filterable: true },
    {
      key: 'gdp',
      header: 'GDP (T)',
      sortable: true,
      render: (value) => `Rp ${value.toFixed(1)}T`
    },
    {
      key: 'gdpPerCapita',
      header: 'GDP per Capita (M)',
      sortable: true,
      render: (value) => `Rp ${value.toFixed(1)}M`
    },
    {
      key: 'growthRate',
      header: 'Growth Rate',
      sortable: true,
      render: (value) => (
        <span className="text-emerald-600 font-bold">+{value.toFixed(1)}%</span>
      )
    },
    { key: 'sector', header: 'Main Sector', sortable: true, filterable: true },
    { key: 'year', header: 'Year', sortable: true },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  const poiColumns: ColumnDef<POIData>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'category', header: 'Category', sortable: true, filterable: true },
    { key: 'region', header: 'Region', sortable: true, filterable: true },
    {
      key: 'latitude',
      header: 'Latitude',
      sortable: true,
      render: (value) => value.toFixed(4)
    },
    {
      key: 'longitude',
      header: 'Longitude',
      sortable: true,
      render: (value) => value.toFixed(4)
    },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  const directoryColumns: ColumnDef<MerchantDirectory>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'category', header: 'Category', sortable: true, filterable: true },
    { key: 'region', header: 'Region', sortable: true, filterable: true },
    { key: 'address', header: 'Address', sortable: true, filterable: true },
    { key: 'phone', header: 'Phone', sortable: true },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  // Get current data and columns based on active tab
  const getCurrentData = (): { data: any[]; columns: ColumnDef<any>[]; source: string } => {
    switch (activeTab) {
      case 'demographic': return { data: demographicData, columns: demographicColumns, source: 'BPS (Statistics Indonesia)' };
      case 'gdp': return { data: gdpData, columns: gdpColumns, source: 'Bank Indonesia' };
      case 'poi': return { data: poiData, columns: poiColumns, source: 'OpenStreetMap' };
      case 'directory': return { data: directoryData, columns: directoryColumns, source: 'Merchant Registry' };
    }
  };

  const { data, columns, source } = getCurrentData();

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    if (!validTypes.includes(file.type) && !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
      setUploadError('Invalid file type. Please upload CSV or Excel files only.');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    // Simulate upload - in production, this would be an API call
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(`Successfully imported ${file.name}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(null), 3000);
    }, 2000);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const tabs = [
    { id: 'demographic' as TabType, label: 'Demographic Data', icon: Users },
    { id: 'gdp' as TabType, label: 'Regional GDP', icon: TrendingUp },
    { id: 'poi' as TabType, label: 'POI Data', icon: MapPin },
    { id: 'directory' as TabType, label: 'Merchant Directory', icon: Store }
  ];

  return (
    <PageLayout
      title="External Data Management"
      subtitle="Manage external data sources and import new datasets"
      actions={
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Import Data'}
          </button>
        </div>
      }
    >
      {/* Upload Status Messages */}
      {uploadSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3"
        >
          <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-emerald-900">Import Successful</h3>
            <p className="text-sm text-emerald-700 mt-1">{uploadSuccess}</p>
          </div>
        </motion.div>
      )}

      {uploadError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-red-900">Import Failed</h3>
            <p className="text-sm text-red-700 mt-1">{uploadError}</p>
          </div>
        </motion.div>
      )}

      {/* Data Source Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Data Source Information</h3>
              <p className="text-sm text-slate-600 mt-1">
                Source: <span className="font-bold text-slate-900">{source}</span>
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Last updated: {data[0]?.lastUpdated ? new Date(data[0].lastUpdated).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-600">Total Records</p>
            <p className="text-2xl font-bold text-slate-900">{data.length}</p>
          </div>
        </div>
      </div>

      {/* Import Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-blue-900 mb-2">Import Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
          <li>• Maximum file size: 10MB</li>
          <li>• Ensure column headers match the expected format</li>
          <li>• Data will be validated before import</li>
        </ul>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <DataTable
              data={data}
              columns={columns}
              sortable={true}
              filterable={true}
              exportable={true}
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: [10, 25, 50]
              }}
            />
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ExternalDataView;
