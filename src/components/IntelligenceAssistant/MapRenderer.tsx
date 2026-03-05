import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapConfig } from './types';

interface MapRendererProps {
  data: any;
  config: MapConfig;
}

// Fix for default marker icon in React Leaflet
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const MapRenderer: React.FC<MapRendererProps> = ({ data, config }) => {
  const center = config.center || [-6.2088, 106.8456]; // Default to Jakarta
  const zoom = config.zoom || 12;

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
      {config.title && (
        <div className="px-4 py-3 border-b border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700">{config.title}</h4>
        </div>
      )}
      <div className="h-[400px] w-full">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {/* Render markers */}
          {config.markers?.map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              icon={defaultIcon}
            >
              <Popup>
                <div className="text-sm">
                  <div className="font-semibold text-slate-700">{marker.label}</div>
                  {marker.type && (
                    <div className="text-xs text-slate-500 mt-1">{marker.type}</div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Render heatmap points as circle markers */}
          {config.heatmap?.points.map((point, index) => {
            const intensity = config.heatmap?.intensity || 1;
            const radius = Math.max(5, point.value * intensity);
            const opacity = Math.min(0.8, point.value / 100);
            
            return (
              <CircleMarker
                key={`heatmap-${index}`}
                center={[point.lat, point.lng]}
                radius={radius}
                pathOptions={{
                  fillColor: '#4f46e5',
                  fillOpacity: opacity,
                  color: '#4f46e5',
                  weight: 1,
                  opacity: 0.5
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <div className="font-semibold text-slate-700">Value: {point.value}</div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
