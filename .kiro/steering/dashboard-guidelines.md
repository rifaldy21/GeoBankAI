---
inclusion: auto
---

# Panduan Dashboard Analytics

## Komponen Dashboard yang Ada

### Data Visualization
- `StatCard` - Kartu statistik dengan nilai dan perubahan
- `TrendChart` - Line chart untuk trend data
- `CategoryPieChart` - Pie chart untuk distribusi kategori
- `DistrictChart` - Bar chart untuk data per distrik
- `AcquisitionFunnel` - Funnel chart untuk conversion
- `CompetitiveAnalysis` - Radar chart untuk analisis kompetitif

### Map Components
- `GeoMap` - Peta geografis dengan markers
- `LeafletMap` - Implementasi Leaflet map
- `SimpleLeafletMap` - Versi sederhana dari Leaflet map

### Performance Tracking
- `RMPerformanceCard` - Kartu performa Relationship Manager
- `RMLeaderboard` - Leaderboard untuk ranking RM

### UI Components
- `Sidebar` - Navigasi sidebar
- `FilterPanel` - Panel filter untuk data
- `Chatbot` - Chatbot interface dengan Gemini AI

## Data Structure

### Mock Data (`src/mockData.ts`)
- `mockBranches` - Data cabang bank
- `mockRMPerformance` - Data performa RM
- `mockTrendData` - Data trend historis
- `mockCategoryData` - Data kategori produk
- `mockDistrictData` - Data per distrik
- `mockFunnelData` - Data funnel akuisisi
- `mockCompetitiveData` - Data analisis kompetitif

### Types (`src/types.ts`)
- Definisi types untuk semua data structures
- Interface untuk props komponen
- Enum untuk constants

## Design System

### Colors
- Primary: Blue (blue-500, blue-600)
- Success: Green (green-500, green-600)
- Warning: Yellow (yellow-500, yellow-600)
- Danger: Red (red-500, red-600)
- Neutral: Gray (gray-100 sampai gray-900)

### Typography
- Headings: font-semibold atau font-bold
- Body: font-normal
- Small text: text-sm atau text-xs
- Muted text: text-gray-500 atau text-gray-600

### Spacing
- Card padding: p-6
- Section gaps: gap-4 atau gap-6
- Grid gaps: gap-4
- Margin between sections: mb-6 atau mb-8

### Shadows & Borders
- Cards: shadow atau shadow-md
- Hover effects: hover:shadow-lg
- Borders: border border-gray-200
- Rounded corners: rounded-lg

## Layout Patterns

### Grid Layouts
```tsx
// 3 kolom responsive
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// 2 kolom dengan sidebar
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
  <div className="lg:col-span-3">{/* Main content */}</div>
  <div>{/* Sidebar */}</div>
</div>
```

### Flex Layouts
```tsx
// Header dengan title dan actions
<div className="flex items-center justify-between mb-6">
  <h2 className="text-2xl font-bold">Title</h2>
  <button>Action</button>
</div>
```

## Chart Configuration

### Recharts Best Practices
- Gunakan `ResponsiveContainer` dengan width="100%" height={300-400}
- Consistent colors untuk data series
- Tooltip untuk interaktivitas
- Legend jika ada multiple series
- Grid untuk readability

### Map Configuration
- Default center: Jakarta coordinates
- Zoom level: 11-13 untuk city view
- Markers dengan custom icons
- Popup untuk detail informasi
- Tile layer dari OpenStreetMap

## Performance Optimization

### Data Loading
- Mock data untuk development
- Lazy load komponen berat (maps, charts)
- Pagination untuk data besar
- Debounce untuk search/filter

### Rendering
- Memoize expensive calculations
- Avoid unnecessary re-renders
- Optimize chart re-renders
- Virtual scrolling untuk list panjang

## Interactivity

### Filters
- Date range picker
- Dropdown untuk kategori
- Search input untuk text search
- Multi-select untuk multiple options
- Clear all filters button

### Actions
- Export data (CSV, PDF)
- Refresh data
- Drill-down untuk detail
- Tooltips untuk informasi tambahan

## Responsive Design

### Breakpoints
- Mobile: < 768px (1 kolom)
- Tablet: 768px - 1024px (2 kolom)
- Desktop: > 1024px (3-4 kolom)

### Mobile Considerations
- Stack cards vertically
- Collapsible sidebar
- Touch-friendly buttons (min 44px)
- Simplified charts untuk mobile
- Horizontal scroll untuk tables

## Accessibility

### ARIA Labels
- Descriptive labels untuk charts
- Button labels yang jelas
- Form labels yang proper
- Alt text untuk images

### Keyboard Navigation
- Tab order yang logical
- Focus indicators yang visible
- Keyboard shortcuts untuk actions
- Skip links untuk navigation

## Documentation References
- Lihat `DASHBOARD_LAYOUT_IMPROVEMENTS.md` untuk layout improvements
- Lihat `NEW_CHARTS_DOCUMENTATION.md` untuk chart documentation
- Lihat `MAP_TROUBLESHOOTING.md` untuk map issues
- Lihat `UI_IMPROVEMENTS.md` untuk UI enhancements
