/**
 * Indonesian (Bahasa Indonesia) Translations
 * Terjemahan Bahasa Indonesia untuk BRI Intelligence Dashboard
 */

export const id = {
  // Common
  common: {
    loading: 'Memuat',
    error: 'Terjadi Kesalahan',
    search: 'Cari',
    filter: 'Filter',
    filters: 'Filter',
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Ubah',
    add: 'Tambah',
    close: 'Tutup',
    back: 'Kembali',
    next: 'Lanjut',
    previous: 'Sebelumnya',
    submit: 'Kirim',
    reset: 'Reset',
    apply: 'Terapkan',
    download: 'Unduh',
    upload: 'Unggah',
    export: 'Ekspor',
    import: 'Impor',
    refresh: 'Muat Ulang',
    logout: 'Keluar',
    profile: 'Profil Saya',
  },

  // Navigation
  nav: {
    dashboard: 'Dashboard',
    territorialIntelligence: 'Territorial Intelligence',
    marketIntelligence: 'Market Intelligence',
    performance: 'Kinerja',
    intelligenceAssistant: 'Intelligence Assistant',
    reporting: 'Pelaporan',
    dataManagement: 'Manajemen Data',
    campaign: 'Campaign & Activation',
  },

  // Dashboard
  dashboard: {
    title: 'Dashboard',
    subtitle: 'Ringkasan eksekutif dari territorial intelligence dan metrik kinerja',
    kpi: {
      totalCustomers: 'Total Nasabah',
      totalMerchants: 'Total Merchant',
      casaGrowth: 'Pertumbuhan CASA',
      qrisPenetration: 'Tingkat Penetrasi QRIS',
      tamCoverage: 'Cakupan TAM',
      activeMerchantRate: 'Tingkat Merchant Aktif',
    },
    map: {
      title: 'Peta Cakupan Nasional',
      subtitle: 'Distribusi geografis merchant dan peluang',
      loading: 'Memuat peta...',
    },
    topOpportunities: {
      title: 'Peluang Teratas',
      subtitle: 'Wilayah berdasarkan gap',
      gap: 'Gap',
    },
    trends: {
      title: 'Tren Pertumbuhan',
      yoy: 'Pertumbuhan Year-over-Year',
      yoySubtitle: 'Perbandingan kinerja tahunan',
      totalCustomers: 'Total Nasabah',
      totalMerchants: 'Total Merchant',
      casaValue: 'Nilai CASA',
      qrisActivation: 'Aktivasi QRIS',
      vs: 'vs',
    },
    alerts: {
      title: 'Peringatan yang Dihasilkan AI',
      subtitle: 'Insight dan rekomendasi dari Intelligence Assistant',
      high: 'TINGGI',
      medium: 'SEDANG',
      low: 'RENDAH',
    },
    assistant: {
      title: 'Intelligence Assistant',
      subtitle: 'Tanyakan apa saja tentang data Anda',
      quickQueries: 'Pertanyaan cepat:',
      query1: 'Tampilkan RM dengan kinerja terbaik',
      query2: 'Analisis tren pertumbuhan CASA',
      query3: 'Temukan wilayah dengan potensi tinggi',
      openButton: 'Buka Intelligence Assistant',
    },
  },

  // Campaign
  campaign: {
    title: 'Campaign & Activation',
    subtitle: 'Kelola campaign dan inisiatif reaktivasi merchant',
    stats: {
      activeCampaigns: 'Campaign Aktif',
      dormantMerchants: 'Merchant Tidak Aktif',
      avgActivationRate: 'Rata-rata Tingkat Aktivasi',
      totalRevenueImpact: 'Total Dampak Pendapatan',
    },
    priorityRegions: {
      title: 'Wilayah Prioritas',
      subtitle: 'Diurutkan berdasarkan skor peluang (menurun)',
      rank: 'Peringkat',
      region: 'Wilayah',
      opportunityScore: 'Skor Peluang',
      potentialRevenue: 'Potensi Pendapatan',
      merchants: 'Merchant',
    },
    dormantMerchants: {
      title: 'Merchant Tidak Aktif',
      subtitle: 'Merchant yang memerlukan reaktivasi',
      merchantName: 'Nama Merchant',
      lastActivity: 'Aktivitas Terakhir',
      daysInactive: 'Hari Tidak Aktif',
      historicalValue: 'Nilai Historis',
      priority: 'Prioritas',
      assignedRM: 'RM yang Ditugaskan',
      unassigned: 'Belum Ditugaskan',
      days: 'hari',
    },
    activationTrend: {
      title: 'Tren Aktivasi',
      subtitle: 'Kinerja bulanan',
      activations: 'Aktivasi',
      target: 'Target',
    },
    activeCampaigns: {
      title: 'Campaign Aktif',
      subtitle: 'Campaign yang sedang berjalan',
      noCampaigns: 'Tidak ada campaign aktif',
      createFirst: 'Buat Campaign Pertama Anda',
      target: 'Target',
      contacted: 'Dihubungi',
      converted: 'Terkonversi',
      rate: 'Tingkat',
      revenue: 'Pendapatan',
      regions: 'wilayah',
      rms: 'RM',
    },
    rmFollowUp: {
      title: 'Tindak Lanjut RM',
      subtitle: 'Tindakan yang direkomendasikan untuk relationship manager',
      actions: 'TINDAKAN',
    },
    buttons: {
      createCampaign: 'Buat Campaign',
      downloadTargetList: 'Unduh Daftar Target',
    },
  },

  // Territorial Intelligence
  territorial: {
    interactiveMap: {
      title: 'Peta Interaktif',
      subtitle: 'Visualisasi geografis dengan kontrol layer',
    },
    drillDown: {
      title: 'Drill-Down Wilayah',
      subtitle: 'Analisis hierarki dari provinsi ke kecamatan',
    },
    clusterAnalysis: {
      title: 'Cluster & Area Analysis',
      subtitle: 'Kategorisasi kinerja wilayah dan analisis pasar',
      performanceClusters: 'Cluster Kinerja',
      highPerformance: 'Kinerja Tinggi',
      mediumPerformance: 'Kinerja Sedang',
      lowPerformance: 'Kinerja Rendah',
      avgPenetration: 'Rata-rata Penetrasi',
      avgCoverage: 'Rata-rata Cakupan',
      regions: 'wilayah',
      tamGap: 'Gap TAM vs Realisasi',
      tamGapSubtitle: 'Potensi pasar versus pencapaian aktual per wilayah',
      marketShare: 'Pangsa Pasar per Wilayah',
      marketShareSubtitle: 'Estimasi persentase pangsa pasar',
      coverageRatio: 'Metrik Rasio Cakupan',
      coverageRatioSubtitle: 'Cakupan vs target per wilayah',
      status: {
        exceeds: 'melebihi',
        onTrack: 'sesuai target',
        below: 'di bawah',
        critical: 'kritis',
      },
    },
  },

  // Market Intelligence
  market: {
    tamEstimation: {
      title: 'Estimasi TAM',
      subtitle: 'Total Addressable Market per wilayah',
    },
    penetrationAnalysis: {
      title: 'Analisis Penetrasi',
      subtitle: 'Tingkat penetrasi pasar dan peluang',
    },
  },

  // Performance
  performance: {
    rmPerformance: {
      title: 'Kinerja RM',
      subtitle: 'Metrik kinerja relationship manager',
    },
    branchPerformance: {
      title: 'Kinerja Cabang',
      subtitle: 'Analisis kinerja per cabang',
    },
  },

  // Data Management
  data: {
    internal: {
      title: 'Data Internal',
      subtitle: 'Manajemen data internal BRI',
    },
    external: {
      title: 'Data Eksternal',
      subtitle: 'Integrasi data dari sumber eksternal',
    },
    geospatial: {
      title: 'Data Geospasial',
      subtitle: 'Manajemen data geografis dan peta',
    },
  },

  // Intelligence Assistant
  assistant: {
    title: 'Intelligence Assistant',
    subtitle: 'Asisten AI untuk analisis dan insight',
    placeholder: 'Tanyakan sesuatu...',
    send: 'Kirim',
  },

  // Reporting
  reporting: {
    title: 'Pelaporan',
    subtitle: 'Buat dan kelola laporan',
  },

  // Filters
  filters: {
    title: 'Filter',
    dateRange: 'Periode Tanggal',
    startDate: 'Tanggal Mulai',
    endDate: 'Tanggal Akhir',
    territory: 'Wilayah',
    region: 'Wilayah',
    branch: 'Cabang',
    rm: 'Relationship Manager',
    product: 'Produk',
    all: 'Semua',
    apply: 'Terapkan',
    reset: 'Reset',
    activeFilters: 'Filter Aktif',
  },

  // Error Messages
  errors: {
    pageNotFound: 'Halaman Tidak Ditemukan',
    pageNotFoundDesc: 'Maaf, halaman yang Anda cari tidak dapat ditemukan.',
    somethingWentWrong: 'Terjadi Kesalahan',
    somethingWentWrongDesc: 'Maaf, terjadi kesalahan yang tidak terduga.',
    tryAgain: 'Coba Lagi',
    goHome: 'Ke Beranda',
    goBack: 'Kembali',
    reload: 'Muat Ulang',
    errorDetails: 'Detail Error',
  },

  // Trends
  trends: {
    up: 'naik',
    down: 'turun',
    neutral: 'stabil',
    fromLastMonth: 'dari bulan lalu',
    fromLastQuarter: 'dari kuartal lalu',
    fromLastYear: 'dari tahun lalu',
  },

  // Time
  time: {
    today: 'Hari Ini',
    yesterday: 'Kemarin',
    thisWeek: 'Minggu Ini',
    lastWeek: 'Minggu Lalu',
    thisMonth: 'Bulan Ini',
    lastMonth: 'Bulan Lalu',
    thisQuarter: 'Kuartal Ini',
    lastQuarter: 'Kuartal Lalu',
    thisYear: 'Tahun Ini',
    lastYear: 'Tahun Lalu',
    custom: 'Kustom',
  },

  // Status
  status: {
    active: 'Aktif',
    inactive: 'Tidak Aktif',
    pending: 'Menunggu',
    completed: 'Selesai',
    draft: 'Draft',
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
  },
};

export type TranslationKeys = typeof id;
