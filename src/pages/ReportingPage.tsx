import { FC, useState, useMemo } from 'react';
import { Download, FileSpreadsheet, FileText, Calendar, MapPin, Package, TrendingUp } from 'lucide-react';
import { motion } from 'motion/react';
import PageLayout from '../components/PageLayout';
import DataTable, { ColumnDef } from '../components/DataTable';
import TrendChart from '../components/TrendChart';
import { useFilters } from '../contexts/FilterContext';
import { useAuth } from '../contexts/AuthContext';
import { filterDataByRole } from '../services/auth/roleFilters';

// Dynamic imports for large export libraries - only loaded when needed
const loadXLSX = () => import('xlsx');
const loadJsPDF = async () => {
  const jsPDF = await import('jspdf');
  await import('jspdf-autotable');
  return jsPDF;
};

// Extend jsPDF type for autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface PivotData {
  region: string;
  province: string;
  city: string;
  district: string;
  totalCustomers: number;
  totalMerchants: number;
  casaValue: number;
  qrisPenetration: number;
  transactionVolume: number;
  growth: number;
  regionId?: string;
}

/**
 * ReportingPage Component
 * Advanced reporting and analytics with pivot tables and exports
 * 
 * Features:
 * - Pivot table functionality using DataTable component
 * - Multi-level geographical filters (Province, City, District, Village)
 * - Time series analysis controls with date range picker
 * - Product segmentation analysis filters
 * - Excel export functionality using xlsx library
 * - PDF export functionality using jsPDF library
 * - Chart visualizations for trend analysis
 * 
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
const ReportingPage: FC = () => {
  const { filters } = useFilters();
  const { user } = useAuth();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['totalCustomers', 'totalMerchants', 'casaValue']);
  const [groupBy, setGroupBy] = useState<'province' | 'city' | 'district' | 'village'>('city');
  const [analysisType, setAnalysisType] = useState<'summary' | 'trend' | 'comparison'>('summary');

  // Mock pivot data - would be fetched from API based on filters
  const allPivotData: PivotData[] = useMemo(() => [
    {
      region: 'Jakarta',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      district: 'Kebayoran Baru',
      totalCustomers: 2450,
      totalMerchants: 680,
      casaValue: 125.4,
      qrisPenetration: 72.5,
      transactionVolume: 8450,
      growth: 12.3,
      regionId: 'region-jakarta'
    },
    {
      region: 'Jakarta',
      province: 'DKI Jakarta',
      city: 'Jakarta Pusat',
      district: 'Menteng',
      totalCustomers: 2180,
      totalMerchants: 590,
      casaValue: 108.7,
      qrisPenetration: 68.2,
      transactionVolume: 7320,
      growth: 10.5,
      regionId: 'region-jakarta'
    },
    {
      region: 'Jakarta',
      province: 'DKI Jakarta',
      city: 'Jakarta Utara',
      district: 'Kelapa Gading',
      totalCustomers: 1920,
      totalMerchants: 520,
      casaValue: 95.3,
      qrisPenetration: 65.8,
      transactionVolume: 6540,
      growth: 8.7,
      regionId: 'region-jakarta'
    },
    {
      region: 'Jawa Barat',
      province: 'Jawa Barat',
      city: 'Bandung',
      district: 'Bandung Wetan',
      totalCustomers: 1850,
      totalMerchants: 480,
      casaValue: 89.2,
      qrisPenetration: 62.4,
      transactionVolume: 5980,
      growth: 15.2,
      regionId: 'region-bandung'
    },
    {
      region: 'Jawa Barat',
      province: 'Jawa Barat',
      city: 'Bekasi',
      district: 'Bekasi Selatan',
      totalCustomers: 1680,
      totalMerchants: 450,
      casaValue: 82.5,
      qrisPenetration: 59.7,
      transactionVolume: 5420,
      growth: 13.8,
      regionId: 'region-bekasi'
    },
    {
      region: 'Jawa Timur',
      province: 'Jawa Timur',
      city: 'Surabaya',
      district: 'Gubeng',
      totalCustomers: 2120,
      totalMerchants: 560,
      casaValue: 102.8,
      qrisPenetration: 66.3,
      transactionVolume: 6890,
      growth: 11.4,
      regionId: 'region-surabaya'
    }
  ], []);

  // Apply role-based filtering
  const pivotData = useMemo(() => {
    return filterDataByRole(allPivotData, user);
  }, [allPivotData, user]);

  // Define table columns based on selected metrics
  const columns: ColumnDef<PivotData>[] = useMemo(() => {
    const baseColumns: ColumnDef<PivotData>[] = [
      {
        key: groupBy === 'province' ? 'province' : groupBy === 'city' ? 'city' : groupBy === 'district' ? 'district' : 'region',
        header: groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
        sortable: true,
        filterable: true,
        width: '200px'
      }
    ];

    const metricColumns: ColumnDef<PivotData>[] = [];

    if (selectedMetrics.includes('totalCustomers')) {
      metricColumns.push({
        key: 'totalCustomers',
        header: 'Total Customers',
        sortable: true,
        render: (value) => value.toLocaleString()
      });
    }

    if (selectedMetrics.includes('totalMerchants')) {
      metricColumns.push({
        key: 'totalMerchants',
        header: 'Total Merchants',
        sortable: true,
        render: (value) => value.toLocaleString()
      });
    }

    if (selectedMetrics.includes('casaValue')) {
      metricColumns.push({
        key: 'casaValue',
        header: 'CASA Value (B)',
        sortable: true,
        render: (value) => `Rp ${value.toFixed(1)}B`
      });
    }

    if (selectedMetrics.includes('qrisPenetration')) {
      metricColumns.push({
        key: 'qrisPenetration',
        header: 'QRIS Penetration',
        sortable: true,
        render: (value) => `${value.toFixed(1)}%`
      });
    }

    if (selectedMetrics.includes('transactionVolume')) {
      metricColumns.push({
        key: 'transactionVolume',
        header: 'Transaction Volume',
        sortable: true,
        render: (value) => value.toLocaleString()
      });
    }

    if (selectedMetrics.includes('growth')) {
      metricColumns.push({
        key: 'growth',
        header: 'Growth (%)',
        sortable: true,
        render: (value) => (
          <span className={value >= 0 ? 'text-emerald-600 font-bold' : 'text-red-600 font-bold'}>
            {value >= 0 ? '+' : ''}{value.toFixed(1)}%
          </span>
        )
      });
    }

    return [...baseColumns, ...metricColumns];
  }, [selectedMetrics, groupBy]);

  // Export to Excel
  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(pivotData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Report');
    
    // Add metadata
    const metadata = [
      ['Report Generated:', new Date().toLocaleString()],
      ['Date Range:', `${filters.dateRange.startDate.toLocaleDateString()} - ${filters.dateRange.endDate.toLocaleDateString()}`],
      ['Filters:', filters.territory.join(', ') || 'All Territories'],
      []
    ];
    
    XLSX.utils.sheet_add_aoa(worksheet, metadata, { origin: 'A1' });
    XLSX.writeFile(workbook, `report-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  // Export to PDF
  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Territorial Intelligence Report', 14, 20);
    
    // Add metadata
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Date Range: ${filters.dateRange.startDate.toLocaleDateString()} - ${filters.dateRange.endDate.toLocaleDateString()}`, 14, 36);
    doc.text(`Filters: ${filters.territory.join(', ') || 'All Territories'}`, 14, 42);
    
    // Add table
    const tableData = pivotData.map(row => [
      row[groupBy === 'province' ? 'province' : groupBy === 'city' ? 'city' : groupBy === 'district' ? 'district' : 'region'],
      ...selectedMetrics.map(metric => {
        const value = row[metric as keyof PivotData];
        if (metric === 'casaValue') return `Rp ${value}B`;
        if (metric === 'qrisPenetration' || metric === 'growth') return `${value}%`;
        return value.toLocaleString();
      })
    ]);

    const tableHeaders = [
      groupBy.charAt(0).toUpperCase() + groupBy.slice(1),
      ...selectedMetrics.map(m => {
        if (m === 'totalCustomers') return 'Customers';
        if (m === 'totalMerchants') return 'Merchants';
        if (m === 'casaValue') return 'CASA (B)';
        if (m === 'qrisPenetration') return 'QRIS %';
        if (m === 'transactionVolume') return 'Transactions';
        if (m === 'growth') return 'Growth %';
        return m;
      })
    ];

    doc.autoTable({
      head: [tableHeaders],
      body: tableData,
      startY: 50,
      theme: 'grid',
      styles: { fontSize: 8 }
    });
    
    doc.save(`report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Toggle metric selection
  const toggleMetric = (metric: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metric) 
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  // Mock trend data for time series analysis
  const trendData = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i, 1).toLocaleDateString('en-US', { month: 'short' }),
      customers: 10000 + Math.random() * 5000,
      merchants: 2500 + Math.random() * 1000,
      casa: 80 + Math.random() * 40
    }));
  }, []);

  return (
    <PageLayout
      title="Reporting & Analytics"
      subtitle="Advanced pivot analysis and custom reporting with multi-dimensional filtering"
      actions={
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-bold"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Export Excel
          </button>
          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-bold"
          >
            <FileText className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      }
    >
      {/* Analysis Controls */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Analysis Configuration</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Analysis Type */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <TrendingUp className="w-4 h-4" />
              Analysis Type
            </label>
            <div className="flex flex-col gap-2">
              {['summary', 'trend', 'comparison'].map(type => (
                <button
                  key={type}
                  onClick={() => setAnalysisType(type as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors text-left ${
                    analysisType === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} Analysis
                </button>
              ))}
            </div>
          </div>

          {/* Group By (Geographical Level) */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <MapPin className="w-4 h-4" />
              Group By
            </label>
            <div className="flex flex-col gap-2">
              {['province', 'city', 'district', 'village'].map(level => (
                <button
                  key={level}
                  onClick={() => setGroupBy(level as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors text-left ${
                    groupBy === level
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              <Package className="w-4 h-4" />
              Metrics
            </label>
            <div className="flex flex-col gap-2">
              {[
                { key: 'totalCustomers', label: 'Total Customers' },
                { key: 'totalMerchants', label: 'Total Merchants' },
                { key: 'casaValue', label: 'CASA Value' },
                { key: 'qrisPenetration', label: 'QRIS Penetration' },
                { key: 'transactionVolume', label: 'Transaction Volume' },
                { key: 'growth', label: 'Growth Rate' }
              ].map(metric => (
                <button
                  key={metric.key}
                  onClick={() => toggleMetric(metric.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors text-left ${
                    selectedMetrics.includes(metric.key)
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {metric.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Time Series Analysis */}
      {analysisType === 'trend' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Time Series Analysis</h3>
              <p className="text-sm text-slate-500">Trend analysis over selected date range</p>
            </div>
          </div>
          <TrendChart data={trendData} />
        </motion.div>
      )}

      {/* Pivot Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DataTable
          data={pivotData}
          columns={columns}
          sortable={true}
          filterable={true}
          exportable={false}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50, 100]
          }}
        />
      </motion.div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Total Customers',
            value: pivotData.reduce((sum, row) => sum + row.totalCustomers, 0).toLocaleString(),
            icon: '👥',
            color: 'bg-blue-100 text-blue-600'
          },
          {
            label: 'Total Merchants',
            value: pivotData.reduce((sum, row) => sum + row.totalMerchants, 0).toLocaleString(),
            icon: '🏪',
            color: 'bg-purple-100 text-purple-600'
          },
          {
            label: 'Total CASA',
            value: `Rp ${pivotData.reduce((sum, row) => sum + row.casaValue, 0).toFixed(1)}B`,
            icon: '💰',
            color: 'bg-emerald-100 text-emerald-600'
          },
          {
            label: 'Avg Growth',
            value: `${(pivotData.reduce((sum, row) => sum + row.growth, 0) / pivotData.length).toFixed(1)}%`,
            icon: '📈',
            color: 'bg-amber-100 text-amber-600'
          }
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl mb-3`}>
              {stat.icon}
            </div>
            <p className="text-sm text-slate-600 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>
    </PageLayout>
  );
};

export default ReportingPage;
