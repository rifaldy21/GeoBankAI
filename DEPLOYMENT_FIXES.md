# Deployment Fixes for Vercel

## Issues Fixed

### 1. Map Component Error: `t.markerClusterGroup is not a function` & `addLayers is not a function`

**Problem:**
- Leaflet MarkerCluster plugin not properly loaded in production build
- Plugin may load after component tries to use it
- Regular LayerGroup doesn't have `addLayers` method (only `addLayer`)
- TypeScript types not properly declared

**Solution Applied:**
1. **Added helper function with fallback** in `src/components/LeafletMap.tsx`:
   ```typescript
   const createMarkerClusterGroup = (options: any): L.LayerGroup => {
     try {
       if (typeof (L as any).markerClusterGroup === 'function') {
         return (L as any).markerClusterGroup(options);
       }
     } catch (error) {
       console.error('Error creating marker cluster group:', error);
     }
     // Fallback to regular layer group
     return L.layerGroup();
   };
   ```

2. **Fixed addLayers method call** (line ~322):
   ```typescript
   // Check if addLayers method exists (MarkerClusterGroup)
   if (markerClusterGroupRef.current && typeof (markerClusterGroupRef.current as any).addLayers === 'function') {
     (markerClusterGroupRef.current as any).addLayers(markers);
   } else if (markerClusterGroupRef.current) {
     // Fallback for regular LayerGroup - add markers one by one
     markers.forEach(marker => markerClusterGroupRef.current!.addLayer(marker));
   }
   ```

3. **Added Suspense and ErrorBoundary** in `src/pages/DashboardPage.tsx`:
   - Lazy load LeafletMap component
   - Wrap with Suspense for loading state
   - Wrap with ErrorBoundary for error handling

4. **Ensured proper import order**:
   ```typescript
   import L from 'leaflet';
   import 'leaflet/dist/leaflet.css';
   import 'leaflet.markercluster';
   import 'leaflet.markercluster/dist/MarkerCluster.css';
   import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
   ```

**Files Modified:**
- `src/components/LeafletMap.tsx` - Added helper function with fallback and fixed addLayers call
- `src/pages/DashboardPage.tsx` - Added Suspense and ErrorBoundary

**How It Works:**
- If markerClusterGroup plugin loads successfully, it will be used for clustering with `addLayers()` batch method
- If plugin fails to load or is not available, falls back to regular LayerGroup with individual `addLayer()` calls
- Map will still work, just without clustering functionality
- No more crashes or "function not found" errors

### 2. 404 Error on Page Refresh

**Problem:**
- Vercel serves static files by default
- Client-side routing (React Router) requires all routes to serve `index.html`
- Refreshing on routes like `/dashboard` or `/campaign` returns 404

**Solution:**
- Created `vercel.json` configuration file
- Added rewrite rule to redirect all routes to `index.html`

**File Created: `vercel.json`**
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Deployment Checklist

Before deploying to Vercel:

1. ✅ Ensure `vercel.json` is in project root
2. ✅ Verify all Leaflet imports are correct
3. ✅ Test build locally: `npm run build`
4. ✅ Test preview locally: `npm run preview`
5. ✅ Check all routes work after refresh
6. ✅ Verify map components load correctly

## Testing After Deployment

1. **Test Routing:**
   - Navigate to different pages
   - Refresh browser (F5) on each page
   - Verify no 404 errors

2. **Test Map Components:**
   - Dashboard page (national heatmap)
   - Interactive Map View (territorial menu)
   - Geospatial Data View (data menu)
   - Verify markers cluster correctly
   - Check layer toggles work

3. **Test Performance:**
   - Check map loads within 2 seconds
   - Verify layer toggles respond within 500ms
   - Test with different zoom levels

## Common Issues

### Issue: Map still shows error after deployment
**Solution:** Clear Vercel build cache and redeploy
```bash
# In Vercel dashboard:
# Settings > General > Clear Build Cache
```

### Issue: Routes work but map doesn't load
**Solution:** Check browser console for specific errors
- Verify CDN links for Leaflet CSS/JS are accessible
- Check if markercluster plugin loaded correctly

### Issue: 404 on specific routes only
**Solution:** Verify `vercel.json` is committed to repository
```bash
git add vercel.json
git commit -m "Add Vercel routing configuration"
git push
```

## Environment Variables

If using environment variables, ensure they are set in Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Settings > Environment Variables
4. Add variables from `.env.example`

## Build Configuration

Default Vite build settings work with Vercel:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

No additional configuration needed.
