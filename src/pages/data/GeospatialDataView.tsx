import { FC, useState, useMemo, useRef } from 'react';
import { Map, MapPin, Layers, Upload, FileCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, GeoJSON as LeafletGeoJSON, useMap } from 'react-leaflet';
import PageLayout from '../../components/PageLayout';
import DataTable, { ColumnDef } from '../../components/DataTable';
import 'leaflet/dist/leaflet.css';

interface BoundaryData {
  id: string;
  name: string;
  level: 'Province' | 'City' | 'District' | 'Village';
  parentRegion: string;
  area: number;
  hasGeometry: boolean;
  lastUpdated: string;
}

interface CoordinateData {
  id: string;
  name: string;
  type: 'Branch' | 'ATM' | 'Merchant' | 'Customer';
  latitude: number;
  longitude: number;
  accuracy: number;
  region: string;
  lastUpdated: string;
}

interface MapLayerConfig {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  color: string;
  opacity: number;
}

type TabType = 'boundaries' | 'coordinates' | 'layers';

// Map center component to update map view
const MapCenter: FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

/**
 * GeospatialDataView Component
 * Manage geospatial data with map preview
 * 
 * Features:
 * - Tabs for administrative boundary data, coordinate data, map layer configurations
 * - DataTable component for coordinate data
 * - GeoJSON file upload for boundary polygons
 * - GeoJSON format validation
 * - Coordinate accuracy validation (100 meter tolerance)
 * - Map preview of uploaded boundaries
 * 
 * Requirements: 14.1, 14.2, 14.3
 */
const GeospatialDataView: FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('boundaries');
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewGeoJSON, setPreviewGeoJSON] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.2088, 106.8456]); // Jakarta
  const [mapZoom, setMapZoom] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Mock data - would be fetched from API
  const boundaryData: BoundaryData[] = useMemo(() => [
    {
      id: 'B001',
      name: 'DKI Jakarta',
      level: 'Province',
      parentRegion: 'Indonesia',
      area: 664.01,
      hasGeometry: true,
      lastUpdated: '2024-01-01'
    },
    {
      id: 'B002',
      name: 'Jakarta Selatan',
      level: 'City',
      parentRegion: 'DKI Jakarta',
      area: 141.27,
      hasGeometry: true,
      lastUpdated: '2024-01-01'
    },
    {
      id: 'B003',
      name: 'Kebayoran Baru',
      level: 'District',
      parentRegion: 'Jakarta Selatan',
      area: 12.58,
      hasGeometry: true,
      lastUpdated: '2024-01-01'
    },
    {
      id: 'B004',
      name: 'Senayan',
      level: 'Village',
      parentRegion: 'Kebayoran Baru',
      area: 1.85,
      hasGeometry: true,
      lastUpdated: '2024-01-01'
    }
  ], []);

  const coordinateData: CoordinateData[] = useMemo(() => [
    {
      id: 'C001',
      name: 'BRI Kebayoran Baru',
      type: 'Branch',
      latitude: -6.2425,
      longitude: 106.7991,
      accuracy: 5,
      region: 'Jakarta Selatan',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'C002',
      name: 'ATM Plaza Senayan',
      type: 'ATM',
      latitude: -6.2297,
      longitude: 106.7990,
      accuracy: 3,
      region: 'Jakarta Selatan',
      lastUpdated: '2024-01-15'
    },
    {
      id: 'C003',
      name: 'Warung Makan Sederhana',
      type: 'Merchant',
      latitude: -6.2450,
      longitude: 106.8000,
      accuracy: 8,
      region: 'Jakarta Selatan',
      lastUpdated: '2024-01-14'
    },
    {
      id: 'C004',
      name: 'Customer Location - Ahmad W.',
      type: 'Customer',
      latitude: -6.2380,
      longitude: 106.7950,
      accuracy: 15,
      region: 'Jakarta Selatan',
      lastUpdated: '2024-01-13'
    }
  ], []);

  const layerData: MapLayerConfig[] = useMemo(() => [
    {
      id: 'L001',
      name: 'Branch Locations',
      type: 'Point',
      visible: true,
      color: '#3b82f6',
      opacity: 0.8
    },
    {
      id: 'L002',
      name: 'ATM Locations',
      type: 'Point',
      visible: true,
      color: '#10b981',
      opacity: 0.8
    },
    {
      id: 'L003',
      name: 'Merchant Density Heatmap',
      type: 'Heatmap',
      visible: false,
      color: '#f59e0b',
      opacity: 0.6
    },
    {
      id: 'L004',
      name: 'Administrative Boundaries',
      type: 'Polygon',
      visible: true,
      color: '#6366f1',
      opacity: 0.3
    }
  ], []);

  // Define columns for each data type
  const boundaryColumns: ColumnDef<BoundaryData>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    {
      key: 'level',
      header: 'Level',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value === 'Province' ? 'bg-purple-100 text-purple-700' :
          value === 'City' ? 'bg-blue-100 text-blue-700' :
          value === 'District' ? 'bg-emerald-100 text-emerald-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {value}
        </span>
      )
    },
    { key: 'parentRegion', header: 'Parent Region', sortable: true, filterable: true },
    {
      key: 'area',
      header: 'Area (km²)',
      sortable: true,
      render: (value) => value.toFixed(2)
    },
    {
      key: 'hasGeometry',
      header: 'Geometry',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
        }`}>
          {value ? 'Available' : 'Missing'}
        </span>
      )
    },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  const coordinateColumns: ColumnDef<CoordinateData>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Name', sortable: true, filterable: true },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      filterable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value === 'Branch' ? 'bg-blue-100 text-blue-700' :
          value === 'ATM' ? 'bg-emerald-100 text-emerald-700' :
          value === 'Merchant' ? 'bg-purple-100 text-purple-700' :
          'bg-amber-100 text-amber-700'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'latitude',
      header: 'Latitude',
      sortable: true,
      render: (value) => value.toFixed(6)
    },
    {
      key: 'longitude',
      header: 'Longitude',
      sortable: true,
      render: (value) => value.toFixed(6)
    },
    {
      key: 'accuracy',
      header: 'Accuracy (m)',
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-2">
          <span className={`font-bold ${value <= 100 ? 'text-emerald-600' : 'text-red-600'}`}>
            {value}m
          </span>
          {value <= 100 ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600" />
          )}
        </div>
      )
    },
    { key: 'region', header: 'Region', sortable: true, filterable: true },
    { key: 'lastUpdated', header: 'Last Updated', sortable: true }
  ];

  const layerColumns: ColumnDef<MapLayerConfig>[] = [
    { key: 'id', header: 'ID', sortable: true, filterable: true, width: '100px' },
    { key: 'name', header: 'Layer Name', sortable: true, filterable: true },
    { key: 'type', header: 'Type', sortable: true, filterable: true },
    {
      key: 'visible',
      header: 'Visibility',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          value ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
        }`}>
          {value ? 'Visible' : 'Hidden'}
        </span>
      )
    },
    {
      key: 'color',
      header: 'Color',
      render: (value) => (
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded border border-slate-200"
            style={{ backgroundColor: value }}
          />
          <span className="text-xs font-mono text-slate-600">{value}</span>
        </div>
      )
    },
    {
      key: 'opacity',
      header: 'Opacity',
      sortable: true,
      render: (value) => `${(value * 100).toFixed(0)}%`
    }
  ];

  // Get current data and columns based on active tab
  const getCurrentData = (): { data: any[]; columns: ColumnDef<any>[] } => {
    switch (activeTab) {
      case 'boundaries': return { data: boundaryData, columns: boundaryColumns };
      case 'coordinates': return { data: coordinateData, columns: coordinateColumns };
      case 'layers': return { data: layerData, columns: layerColumns };
    }
  };

  const { data, columns } = getCurrentData();

  // Validate GeoJSON format
  const validateGeoJSON = (json: any): { valid: boolean; error?: string } => {
    if (!json || typeof json !== 'object') {
      return { valid: false, error: 'Invalid JSON format' };
    }

    if (json.type !== 'FeatureCollection' && json.type !== 'Feature') {
      return { valid: false, error: 'GeoJSON must be a Feature or FeatureCollection' };
    }

    if (json.type === 'FeatureCollection' && !Array.isArray(json.features)) {
      return { valid: false, error: 'FeatureCollection must have a features array' };
    }

    if (json.type === 'Feature' && !json.geometry) {
      return { valid: false, error: 'Feature must have a geometry property' };
    }

    return { valid: true };
  };

  // Handle GeoJSON file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.geojson') && !file.name.endsWith('.json')) {
      setUploadError('Invalid file type. Please upload GeoJSON files only (.geojson or .json)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size exceeds 5MB limit.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Validate GeoJSON format
      const validation = validateGeoJSON(json);
      if (!validation.valid) {
        setUploadError(`Invalid GeoJSON: ${validation.error}`);
        setUploading(false);
        return;
      }

      // Set preview
      setPreviewGeoJSON(json);

      // Calculate bounds for map centering
      if (json.type === 'FeatureCollection' && json.features.length > 0) {
        const firstFeature = json.features[0];
        if (firstFeature.geometry && firstFeature.geometry.coordinates) {
          // Simple center calculation (would be more sophisticated in production)
          const coords = firstFeature.geometry.coordinates;
          if (firstFeature.geometry.type === 'Point') {
            setMapCenter([coords[1], coords[0]]);
            setMapZoom(13);
          }
        }
      }

      setUploading(false);
      setUploadSuccess(`Successfully validated and previewed ${file.name}`);

      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(null), 3000);
    } catch (error) {
      setUploadError(`Failed to parse GeoJSON: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setUploading(false);
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const tabs = [
    { id: 'boundaries' as TabType, label: 'Administrative Boundaries', icon: Map },
    { id: 'coordinates' as TabType, label: 'Coordinate Data', icon: MapPin },
    { id: 'layers' as TabType, label: 'Map Layer Configurations', icon: Layers }
  ];

  return (
    <PageLayout
      title="Geospatial Data Management"
      subtitle="Manage geographical boundaries, coordinates, and map layers"
      actions={
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".geojson,.json"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload GeoJSON'}
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
            <h3 className="text-sm font-bold text-emerald-900">Upload Successful</h3>
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
            <h3 className="text-sm font-bold text-red-900">Upload Failed</h3>
            <p className="text-sm text-red-700 mt-1">{uploadError}</p>
          </div>
        </motion.div>
      )}

      {/* Map Preview */}
      {previewGeoJSON && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-slate-200 overflow-hidden"
        >
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Boundary Preview</h3>
            <p className="text-sm text-slate-500">Uploaded GeoJSON visualization</p>
          </div>
          <div className="h-[400px]">
            <MapContainer
              center={mapCenter}
              zoom={mapZoom}
              style={{ height: '100%', width: '100%' }}
            >
              <MapCenter center={mapCenter} zoom={mapZoom} />
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LeafletGeoJSON
                data={previewGeoJSON}
                style={{
                  color: '#6366f1',
                  weight: 2,
                  fillColor: '#6366f1',
                  fillOpacity: 0.2
                }}
              />
            </MapContainer>
          </div>
        </motion.div>
      )}

      {/* Validation Guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <h4 className="text-sm font-bold text-blue-900 mb-2">GeoJSON Upload Guidelines</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Supported format: GeoJSON (.geojson or .json)</li>
          <li>• Maximum file size: 5MB</li>
          <li>• Must be valid GeoJSON Feature or FeatureCollection</li>
          <li>• Coordinate accuracy must be within 100 meter tolerance</li>
          <li>• Preview will be displayed after successful validation</li>
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

      {/* Coordinate Accuracy Summary */}
      {activeTab === 'coordinates' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <p className="text-sm text-slate-600">Within Tolerance</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {coordinateData.filter(c => c.accuracy <= 100).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-sm text-slate-600">Exceeds Tolerance</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {coordinateData.filter(c => c.accuracy > 100).length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-slate-600">Average Accuracy</p>
            </div>
            <p className="text-2xl font-bold text-slate-900">
              {(coordinateData.reduce((sum, c) => sum + c.accuracy, 0) / coordinateData.length).toFixed(1)}m
            </p>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default GeospatialDataView;
