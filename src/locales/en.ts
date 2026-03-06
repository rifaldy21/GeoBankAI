/**
 * English Translations
 * English translations for BRI Intelligence Dashboard
 */

export const en = {
  // Common
  common: {
    loading: 'Loading',
    error: 'Error Occurred',
    search: 'Search',
    filter: 'Filter',
    filters: 'Filters',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    submit: 'Submit',
    reset: 'Reset',
    apply: 'Apply',
    download: 'Download',
    upload: 'Upload',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    logout: 'Logout',
    profile: 'My Profile',
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    territorialIntelligence: 'Territorial Intelligence',
    marketIntelligence: 'Market Intelligence',
    performance: 'Performance',
    intelligenceAssistant: 'Intelligence Assistant',
    reporting: 'Reporting',
    dataManagement: 'Data Management',
    campaign: 'Campaign & Activation',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Executive overview of territorial intelligence and performance metrics',
    kpi: {
      totalCustomers: 'Total Customers',
      totalMerchants: 'Total Merchants',
      casaGrowth: 'CASA Growth',
      qrisPenetration: 'QRIS Penetration Rate',
      tamCoverage: 'TAM Coverage',
      activeMerchantRate: 'Active Merchant Rate',
    },
    map: {
      title: 'National Coverage Heatmap',
      subtitle: 'Geographical distribution of merchants and opportunities',
      loading: 'Loading map...',
    },
    topOpportunities: {
      title: 'Top Opportunities',
      subtitle: 'Regions ranked by gap',
      gap: 'Gap',
    },
    trends: {
      title: 'Growth Trends',
      yoy: 'Year-over-Year Growth',
      yoySubtitle: 'Annual performance comparison',
      totalCustomers: 'Total Customers',
      totalMerchants: 'Total Merchants',
      casaValue: 'CASA Value',
      qrisActivation: 'QRIS Activation',
      vs: 'vs',
    },
    alerts: {
      title: 'AI-Generated Alerts',
      subtitle: 'Insights and recommendations from Intelligence Assistant',
      high: 'HIGH',
      medium: 'MEDIUM',
      low: 'LOW',
    },
    assistant: {
      title: 'Intelligence Assistant',
      subtitle: 'Ask anything about your data',
      quickQueries: 'Quick queries:',
      query1: 'Show top performing RMs',
      query2: 'Analyze CASA growth trends',
      query3: 'Find high-potential regions',
      openButton: 'Open Intelligence Assistant',
    },
  },

  // Campaign
  campaign: {
    title: 'Campaign & Activation',
    subtitle: 'Manage campaigns and merchant reactivation initiatives',
    stats: {
      activeCampaigns: 'Active Campaigns',
      dormantMerchants: 'Dormant Merchants',
      avgActivationRate: 'Avg Activation Rate',
      totalRevenueImpact: 'Total Revenue Impact',
    },
    priorityRegions: {
      title: 'Priority Regions',
      subtitle: 'Ranked by opportunity score (descending)',
      rank: 'Rank',
      region: 'Region',
      opportunityScore: 'Opportunity Score',
      potentialRevenue: 'Potential Revenue',
      merchants: 'Merchants',
    },
    dormantMerchants: {
      title: 'Dormant Merchants',
      subtitle: 'Merchants requiring reactivation',
      merchantName: 'Merchant Name',
      lastActivity: 'Last Activity',
      daysInactive: 'Days Inactive',
      historicalValue: 'Historical Value',
      priority: 'Priority',
      assignedRM: 'Assigned RM',
      unassigned: 'Unassigned',
      days: 'days',
    },
    activationTrend: {
      title: 'Activation Trend',
      subtitle: 'Monthly performance',
      activations: 'Activations',
      target: 'Target',
    },
    activeCampaigns: {
      title: 'Active Campaigns',
      subtitle: 'Currently running campaigns',
      noCampaigns: 'No active campaigns',
      createFirst: 'Create Your First Campaign',
      target: 'Target',
      contacted: 'Contacted',
      converted: 'Converted',
      rate: 'Rate',
      revenue: 'Revenue',
      regions: 'regions',
      rms: 'RMs',
    },
    rmFollowUp: {
      title: 'RM Follow-up Actions',
      subtitle: 'Recommended actions for relationship managers',
      actions: 'ACTIONS',
    },
    buttons: {
      createCampaign: 'Create Campaign',
      downloadTargetList: 'Download Target List',
    },
  },

  // Territorial Intelligence
  territorial: {
    interactiveMap: {
      title: 'Interactive Map',
      subtitle: 'Geographical visualization with layer controls',
    },
    drillDown: {
      title: 'Regional Drill-Down',
      subtitle: 'Hierarchical analysis from province to district',
    },
    clusterAnalysis: {
      title: 'Cluster & Area Analysis',
      subtitle: 'Regional performance categorization and market analysis',
      performanceClusters: 'Performance Clusters',
      highPerformance: 'High Performance',
      mediumPerformance: 'Medium Performance',
      lowPerformance: 'Low Performance',
      avgPenetration: 'Avg Penetration',
      avgCoverage: 'Avg Coverage',
      regions: 'regions',
      tamGap: 'TAM vs Realization Gap',
      tamGapSubtitle: 'Market potential versus actual achievement per region',
      marketShare: 'Market Share by Region',
      marketShareSubtitle: 'Estimated market share percentage',
      coverageRatio: 'Coverage Ratio Metrics',
      coverageRatioSubtitle: 'Coverage vs target per region',
      status: {
        exceeds: 'exceeds',
        onTrack: 'on-track',
        below: 'below',
        critical: 'critical',
      },
    },
  },

  // Market Intelligence
  market: {
    tamEstimation: {
      title: 'TAM Estimation',
      subtitle: 'Total Addressable Market per region',
    },
    penetrationAnalysis: {
      title: 'Penetration Analysis',
      subtitle: 'Market penetration rate and opportunities',
    },
  },

  // Performance
  performance: {
    rmPerformance: {
      title: 'RM Performance',
      subtitle: 'Relationship manager performance metrics',
    },
    branchPerformance: {
      title: 'Branch Performance',
      subtitle: 'Branch-level performance analysis',
    },
  },

  // Data Management
  data: {
    internal: {
      title: 'Internal Data',
      subtitle: 'BRI internal data management',
    },
    external: {
      title: 'External Data',
      subtitle: 'Integration with external data sources',
    },
    geospatial: {
      title: 'Geospatial Data',
      subtitle: 'Geographic and map data management',
    },
  },

  // Intelligence Assistant
  assistant: {
    title: 'Intelligence Assistant',
    subtitle: 'AI assistant for analysis and insights',
    placeholder: 'Ask something...',
    send: 'Send',
  },

  // Reporting
  reporting: {
    title: 'Reporting',
    subtitle: 'Create and manage reports',
  },

  // Filters
  filters: {
    title: 'Filters',
    dateRange: 'Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    territory: 'Territory',
    region: 'Region',
    branch: 'Branch',
    rm: 'Relationship Manager',
    product: 'Product',
    all: 'All',
    apply: 'Apply',
    reset: 'Reset',
    activeFilters: 'Active Filters',
  },

  // Error Messages
  errors: {
    pageNotFound: 'Page Not Found',
    pageNotFoundDesc: 'Sorry, the page you are looking for could not be found.',
    somethingWentWrong: 'Something Went Wrong',
    somethingWentWrongDesc: 'Sorry, an unexpected error occurred.',
    tryAgain: 'Try Again',
    goHome: 'Go Home',
    goBack: 'Go Back',
    reload: 'Reload',
    errorDetails: 'Error Details',
  },

  // Trends
  trends: {
    up: 'up',
    down: 'down',
    neutral: 'stable',
    fromLastMonth: 'from last month',
    fromLastQuarter: 'from last quarter',
    fromLastYear: 'from last year',
  },

  // Time
  time: {
    today: 'Today',
    yesterday: 'Yesterday',
    thisWeek: 'This Week',
    lastWeek: 'Last Week',
    thisMonth: 'This Month',
    lastMonth: 'Last Month',
    thisQuarter: 'This Quarter',
    lastQuarter: 'Last Quarter',
    thisYear: 'This Year',
    lastYear: 'Last Year',
    custom: 'Custom',
  },

  // Status
  status: {
    active: 'Active',
    inactive: 'Inactive',
    pending: 'Pending',
    completed: 'Completed',
    draft: 'Draft',
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  },
};

export type TranslationKeys = typeof en;
