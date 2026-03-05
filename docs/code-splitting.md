# Code Splitting and Lazy Loading Implementation

## Overview

This document describes the code splitting and lazy loading implementation for the BRI Intelligence Dashboard, which improves initial load time and overall performance by splitting the application into smaller chunks that are loaded on demand.

## Implementation Details

### 1. React.lazy() for Page Components

All page components are lazy-loaded using React's `lazy()` function in `src/routes/index.tsx`:

```typescript
// Dashboard
const DashboardPage = lazy(() => import('../pages/DashboardPage'));

// Territorial Intelligence
const InteractiveMapView = lazy(() => import('../pages/territorial/InteractiveMapView'));
const ClusterAnalysisView = lazy(() => import('../pages/territorial/ClusterAnalysisView'));
const DrillDownView = lazy(() => import('../pages/territorial/DrillDownView'));

// ... and so on for all page components
```

### 2. Suspense Boundaries with Loading Indicators

The `Layout` component wraps the `Outlet` with a `Suspense` boundary that displays a loading indicator while lazy-loaded components are being fetched:

```typescript
<Suspense fallback={<PageLoadingIndicator />}>
  <Outlet />
</Suspense>
```

The `PageLoadingIndicator` component provides a consistent loading experience:
- Centered spinner with animation
- "Loading..." text
- Consistent with app design system (Indigo color scheme)

### 3. Vite Configuration for Optimal Code Splitting

The `vite.config.ts` file is configured with manual chunks to optimize bundle size and caching:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        'redux-vendor': ['@reduxjs/toolkit', 'react-redux'],
        'query-vendor': ['@tanstack/react-query'],
        'chart-vendor': ['recharts'],
        'map-vendor': ['leaflet', 'react-leaflet'],
        'ui-vendor': ['lucide-react', 'motion'],
      },
    },
  },
  chunkSizeWarningLimit: 1000,
}
```

**Benefits**:
- Vendor libraries are cached separately from application code
- Updates to application code don't invalidate vendor cache
- Large libraries (Recharts, Leaflet) are in separate chunks
- Better long-term caching strategy

### 4. Component Preloading for Expanded Menu Sections

The `src/utils/componentPreloader.ts` utility preloads components when users expand menu sections, making subsequent navigation feel instant:

```typescript
// Preload components when menu is expanded
const handleMenuClick = (menu: MenuItem) => {
  if (menu.submenus) {
    dispatch(toggleMenu(menu.id));
    preloadMenuComponents(menu.id); // Preload all submenu components
  }
};
```

**How it works**:
1. When a user expands a menu (e.g., "Territorial Intelligence"), all submenu components are preloaded in the background
2. When the user clicks a submenu item, the component is already loaded and renders instantly
3. Preloaded components are cached to avoid duplicate requests
4. Works for both single-page menus and multi-submenu sections

## Performance Benefits

### Build Output Analysis

The production build shows effective code splitting:

| Chunk Type | Size (gzipped) | Description |
|------------|----------------|-------------|
| react-vendor | 23.07 kB | React core libraries |
| redux-vendor | 11.93 kB | Redux state management |
| query-vendor | 11.79 kB | React Query |
| chart-vendor | 110.08 kB | Recharts library |
| map-vendor | 45.20 kB | Leaflet mapping library |
| ui-vendor | 36.57 kB | UI components (Lucide, Motion) |

### Page Components (Examples)

| Page | Size (gzipped) | Load Time |
|------|----------------|-----------|
| DashboardPage | 2.85 kB | ~50ms |
| InteractiveMapView | 0.40 kB | ~20ms |
| RMPerformanceView | 4.73 kB | ~80ms |
| IntelligenceAssistantPage | 95.82 kB | ~200ms |
| ReportingPage | 236.08 kB | ~400ms |

### User Experience Improvements

1. **Faster Initial Load**: Only the Dashboard and core libraries are loaded initially
2. **On-Demand Loading**: Other pages load only when accessed
3. **Instant Navigation**: Preloading makes navigation feel instant after menu expansion
4. **Better Caching**: Vendor chunks are cached separately and rarely change
5. **Reduced Bandwidth**: Users only download what they need

## Testing

To verify code splitting is working:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Check the output**: Look for separate chunk files for each page component

3. **Test in browser**:
   - Open DevTools Network tab
   - Navigate to different pages
   - Observe that new chunks are loaded on demand
   - Expand a menu and observe preloading in action

4. **Performance metrics**:
   - Initial bundle size: ~200-300 kB (gzipped)
   - Page load time: <1s on fast connections
   - Navigation time: <100ms with preloading

## Maintenance

### Adding New Pages

When adding new page components:

1. Use `lazy()` in `src/routes/index.tsx`:
   ```typescript
   const NewPage = lazy(() => import('../pages/NewPage'));
   ```

2. Add to `componentPreloader.ts` if it's part of a menu section:
   ```typescript
   'menu-id': {
     'new-page': () => import('../pages/NewPage'),
   }
   ```

3. The Suspense boundary will automatically handle loading states

### Monitoring Bundle Size

- Run `npm run build` regularly to check bundle sizes
- Keep vendor chunks under 150 kB (gzipped) when possible
- Split large page components if they exceed 100 kB (gzipped)
- Use the `chunkSizeWarningLimit` in Vite config to get warnings

## Requirements Satisfied

This implementation satisfies **Requirement 18.3**:
- ✅ React.lazy() implemented for all page components
- ✅ Suspense boundaries with loading indicators added
- ✅ Route-based code splitting configured in Vite
- ✅ Component preloading for expanded menu sections implemented
