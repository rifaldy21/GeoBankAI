import React from 'react';
import { ChartRenderer } from './ChartRenderer';
import { TableRenderer } from './TableRenderer';
import { MapRenderer } from './MapRenderer';
import { VisualOutput, ChartConfig, TableConfig, MapConfig } from './types';

interface VisualOutputRendererProps {
  output: VisualOutput;
}

export const VisualOutputRenderer: React.FC<VisualOutputRendererProps> = ({ output }) => {
  if (!output || !output.data) {
    return null;
  }

  switch (output.type) {
    case 'chart':
      return (
        <ChartRenderer 
          data={output.data} 
          config={output.config as ChartConfig} 
        />
      );
    
    case 'table':
      return (
        <TableRenderer 
          data={output.data} 
          config={output.config as TableConfig} 
        />
      );
    
    case 'map':
      return (
        <MapRenderer 
          data={output.data} 
          config={output.config as MapConfig} 
        />
      );
    
    default:
      return (
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 text-sm text-slate-500">
          Unsupported visualization type
        </div>
      );
  }
};
