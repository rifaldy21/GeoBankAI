import { FC, useState, useMemo } from 'react';
import { Users, Store, CreditCard, UserCheck, Building2, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import PageLayout from '../../components/PageLayout';
import DataTable, { ColumnDef } from '../../components/DataTable';
import { useAuth } from '../../contexts/AuthContext';
import { filterCustomers, filterMerchants, filterRMs, filterBranches, filterDataByRole } from '../../services/auth/roleFilters';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  territory: string;
  branch: string;
  casaBalance: number;
  status: 'Active' | 'Inactive';
  lastActivity: string;
  regionId?: string;
  branchId?: string;
}

interface Merchant {
  id: string;
  name: string;
  category: string;
  territory: string;
  branch: string;
  qrisActive: boolean;
  monthlyVolume: number;
  status: 'Active' | 'Dormant';
  regionId?: string;
  branchId?: string;
}

interface Transaction {
  id: string;
  date: string;
  type: string;
  amount: number;
  merchant: string;
  customer: string;
  status: 'Completed' | 'Pending' | 'Failed';
  regionId?: string;
  branchId?: string;
}

interface RM {
  id: string;
  name: string;
  email: string;
  territory: string;
  branch: string;
  portfolio: number;
  performance: number;
  regionId?: string;
  branchId?: string;
}

interface Branch {
  id: string;
  name: string;
  code: string;
  territory: string;
  rmCount: number;
  customerCount: number;
  merchantCount: number;
  regionId?: string;
  branchId?: string;
}

type TabType = 'customers' | 'merchants' | 'transactions' | 'rms' | 'branches';

/**
 * InternalDataView Component
 * Manage internal bank data with quality metrics
 * 
 * Features:
 * - Tabs for customer data, merchant data, transaction data, RM data, branch data
 * - DataTable component for each data type
 * - Data quality metrics (completeness, accuracy indicators)
 * - Filtering by multiple criteria
 * - Data refresh functionality
 * 
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5
 */
const InternalDataView: FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('customers');
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Mock data - would be fetched from API
  const customerData: Customer[] = useMemo(() => [
    {
      id: 'C001',
      name: 'Ahmad Wijaya',
      email: 'ahmad.w@email.com',
      phone: '+62812345678',
      territory: 'Jakarta Selatan',
      branch: 'Kebayoran Baru',
      casaBalance: 125000000,
      status: 'Active',
      lastActivity: '2024-01-15'
    },
    {
      id: 'C002',
      name: 'Siti Nurhaliza',
      email: 'siti.n@email.com',
      phone: '+62823456789',
      territory: 'Jakarta Pusat',
      branch: 'Menteng',
      casaBalance: 98000000,
      status: 'Active',
      lastActivity: '2024-01-14'
    },
    {
      id: 'C003',
      name: 'Budi Santoso',
      email: 'budi.s@email.com',
      phone: '+62834567890',
      territory: 'Bandung',
      branch: 'Bandung Wetan',
      casaBalance: 75000000,
      status: 'Inactive',
      lastActivity: '2023-12-20'
    }
  ], []);

  const merchantData: Merchant[] = useMemo(() => [
    {
      id: 'M001',
      name: 'Warung Makan Sederhana',
      category: 'F&B',
      territory: 'Jakarta Selatan',
      branch: 'Kebayoran Baru',
      qrisActive: true,
      monthlyVolume: 45000000,
      status: 'Active'
    },
    {
      id: 'M002',
      name: 'Toko Elektronik Jaya',
      category: 'Retail',
      territory: 'Jakarta Pusat',
      branch: 'Menteng',
      qrisActive: true,
      monthlyVolume: 120000000,
      status: 'Active'
    },
    {
      id: 'M003',
      name: 'Salon Cantik',
      category: 'Services',
      territory: 'Bandung',
      branch: 'Bandung Wetan',
      qrisActive: false,
      monthlyVolume: 15000000,
      status: 'Dormant'
    }
  ], []);

  const transactionData: Transaction[] = useMemo(() => [
    {
      id: 'T001',
      date: '2024-01-15',
      type: 'QRIS Payment',
      amount: 250000,
      merchant: 'Warung Makan Sederhana',
      customer: 'Ahmad Wijaya',
      status: 'Completed'
    },
    {
      id: 'T002',
      date: '2024-01-15',
      type: 'Transfer',
      amount: 5000000,
      merchant: '-',
      customer: 'Siti Nurhaliza',
      status: 'Completed'
    },
    {
      id: 'T003',
      date: '2024-01-14',
      type: 'QRIS Payment',
      amount: 1200000,
      merchant: 'Toko Elektronik Jaya',
      customer: 'Ahmad Wijaya',
      status: 'Pending'
    }
  ], []);

  const rmData: RM[] = useMemo(() => [
    {
      id: 'RM001',
      name: 'Andi Prasetyo',
      email: 'andi.p@bri.co.id',
      territory: 'Jakarta Selatan',
      branch: 'Kebayoran Baru',
      portfolio: 125,
      performance: 92.5
    },
    {
      id: 'RM002',
      name: 'Dewi Lestari',
      email: 'dewi.l@bri.co.id',
      territory: 'Jakarta Pusat',
      branch: 'Menteng',
      portfolio: 108,
      performance: 88.3
    },
    {
      id: 'RM003',
      name: 'Rudi Hartono',
      email: 'rudi.h@bri.co.id',
      territory: 'Bandung',
      branch: 'Bandung Wetan',
      portfolio: 95,
      performance: 85.7
    }
  ], []);

  const branchData: Branch[] = useMemo(() => [
    {
      id: 'B001',
      name: 'BRI Kebayoran Baru',
      code: 'KBY001',
      territory: 'Jakarta Selatan',
      rmCount: 8,
      customerCount: 2450,
      merchantCount: 680
    },
    {
      id: 'B002',
      name: 'BRI Menteng',
      code: 'MTG001',
      territory: 'Jakarta Pusat',
      rmCount: 6,
      customerCount: 2180,
      merchantCount: 590
    },
    {
      id: 'B003',
      name: 'BRI Bandung Wetan',
      code: 'BDG001',
      territory: 'Bandung',
      rmCount: 7,
      customerCount: 1850,
      merchantCount: 480
    }
  ], []);

  // Apply role-based filtering to all data
  const filteredCustomerData = useMemo(() => filterCustomers(customerData, user), [customerData, user]);
  const filteredMerchantData = useMemo(() => filterMerchants(merchantData, user), [merchantData, user]);
  const filteredTransactionData = useMemo(() => filterDataByRole(transactionData, user), [transactionData, user]);
  const filteredRMData = useMemo(() => filterRMs(rmData, user), [rmData, user]);
  const filteredBranchData = useMemo(() => filterBranches(branchData, user), [branchData, user]);

  // Data quality metrics
  const qualityMetrics = useMemo(() => {
    const metrics: Record<TabType, { completeness: number; accuracy: number; recordCount: number }> = {
      customers: { completeness: 98.5, accuracy: 99.2, recordCount: filteredCustomerData.length },
      merchants: { completeness: 96.8, accuracy: 97.5, recordCount: filteredMerchantData.length },
      transactions: { completeness: 99.8, accuracy: 99.9, recordCount: filteredTransactionData.length },
      rms: { completeness: 100, accuracy: 100, recordCount: filteredRMData.length },
      branches: { completeness: 100, accuracy: 100, recordCount: filteredBranchData.length }
    };
    return metrics[activeTab];
  }, [activeTab, customerData.length, merchantData.length, transactionData.length, rmData.length, branchData.length]);

  // Define columns for each data type
  const customerColumns: ColumnDef<Customer>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'territory', header: 'Territory', sortable: true, filterable: true },
    { key: 'branch', header: 'Branch', sortable: true, filterable: true },
    {
      key: 'casaBalance',
      header: 'CASA Balance',
      sortable: true,
      render: (value) => `Rp ${(value / 1000000).toFixed(1)}M`
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'lastActivity', header: 'Last Activity', sortable: true }
  ];

  const merchantColumns: ColumnDef<Merchant>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'category', header: 'Category', sortable: true, filterable: true },
    { key: 'territory', header: 'Territory', sortable: true, filterable: true },
    {
      key: 'qrisActive',
      header: 'QRIS',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'monthlyVolume',
      header: 'Monthly Volume',
      sortable: true,
      render: (value) => `Rp ${(value / 1000000).toFixed(1)}M`
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const transactionColumns: ColumnDef<Transaction>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'date', header: 'Date', sortable: true },
    { key: 'type', header: 'Type', sortable: true, filterable: true },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (value) => `Rp ${value.toLocaleString()}`
    },
    { key: 'merchant', header: 'Merchant', sortable: true, filterable: true },
    { key: 'customer', header: 'Customer', sortable: true, filterable: true },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
          value === 'Pending' ? 'bg-amber-100 text-amber-700' :
          'bg-red-100 text-red-700'
        }`}>
          {value}
        </span>
      )
    }
  ];

  const rmColumns: ColumnDef<RM>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'email', header: 'Email', sortable: true, filterable: true },
    { key: 'territory', header: 'Territory', sortable: true, filterable: true },
    { key: 'branch', header: 'Branch', sortable: true, filterable: true },
    { key: 'portfolio', header: 'Portfolio Size', sortable: true },
    {
      key: 'performance',
      header: 'Performance',
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-slate-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-700">{value.toFixed(1)}%</span>
        </div>
      )
    }
  ];

  const branchColumns: ColumnDef<Branch>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    { key: 'code', header: 'Code', sortable: true, filterable: true },
    { key: 'territory', header: 'Territory', sortable: true, filterable: true },
    { key: 'rmCount', header: 'RMs', sortable: true },
    { key: 'customerCount', header: 'Customers', sortable: true, render: (value) => value.toLocaleString() },
    { key: 'merchantCount', header: 'Merchants', sortable: true, render: (value) => value.toLocaleString() }
  ];

  // Get current data and columns based on active tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'customers': return { data: filteredCustomerData, columns: customerColumns };
      case 'merchants': return { data: filteredMerchantData, columns: merchantColumns };
      case 'transactions': return { data: filteredTransactionData, columns: transactionColumns };
      case 'rms': return { data: filteredRMData, columns: rmColumns };
      case 'branches': return { data: filteredBranchData, columns: branchColumns };
    }
  };

  const { data, columns } = getCurrentData();

  const handleRefresh = () => {
    setLastRefresh(new Date());
    // In production, this would trigger API refetch
  };

  const tabs = [
    { id: 'customers' as TabType, label: 'Customer Data', icon: Users },
    { id: 'merchants' as TabType, label: 'Merchant Data', icon: Store },
    { id: 'transactions' as TabType, label: 'Transaction Data', icon: CreditCard },
    { id: 'rms' as TabType, label: 'RM Data', icon: UserCheck },
    { id: 'branches' as TabType, label: 'Branch Data', icon: Building2 }
  ];

  return (
    <PageLayout
      title="Internal Data Management"
      subtitle="Manage and monitor internal bank data with quality metrics"
      actions={
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-bold"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh Data
        </button>
      }
    >
      {/* Data Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Data Completeness</p>
              <p className="text-2xl font-bold text-slate-900">{qualityMetrics.completeness}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full"
              style={{ width: `${qualityMetrics.completeness}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Data Accuracy</p>
              <p className="text-2xl font-bold text-slate-900">{qualityMetrics.accuracy}%</p>
            </div>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${qualityMetrics.accuracy}%` }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-slate-200 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Records</p>
              <p className="text-2xl font-bold text-slate-900">{qualityMetrics.recordCount.toLocaleString()}</p>
            </div>
          </div>
          <p className="text-xs text-slate-500">Last updated: {lastRefresh.toLocaleString()}</p>
        </motion.div>
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

export default InternalDataView;
