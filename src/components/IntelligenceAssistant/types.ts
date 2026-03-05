/**
 * Type definitions for Intelligence Assistant visual outputs
 */

export interface VisualOutput {
  type: 'chart' | 'table' | 'map';
  data: any;
  config?: ChartConfig | TableConfig | MapConfig;
}

export interface ChartConfig {
  chartType: 'bar' | 'line' | 'pie' | 'area';
  xAxis?: string;
  yAxis?: string;
  title?: string;
  colors?: string[];
}

export interface TableConfig {
  columns: string[];
  sortable?: boolean;
  title?: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  markers?: MapMarker[];
  heatmap?: HeatmapData;
  title?: string;
}

export interface MapMarker {
  id: string;
  position: [number, number];
  label: string;
  type?: string;
}

export interface HeatmapData {
  points: HeatmapPoint[];
  intensity?: number;
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  value: number;
}
