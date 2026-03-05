/**
 * Map Error Handler Tests
 */

import { describe, it, expect } from 'vitest';
import {
  validateGeoJSON,
  validateCoordinateAccuracy,
  handleTileLoadError,
  handleGeoJSONError,
  validateChartData,
  handleChartError,
  getMapErrorMessage,
  getChartErrorMessage,
} from '../mapErrorHandler';

describe('Map Error Handler', () => {
  describe('validateGeoJSON', () => {
    it('should validate valid FeatureCollection', () => {
      const geojson = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [106.8456, -6.2088],
            },
            properties: { name: 'Test' },
          },
        ],
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should detect missing type', () => {
      const geojson = {
        features: [],
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing required "type" property');
    });

    it('should detect invalid type', () => {
      const geojson = {
        type: 'InvalidType',
        features: [],
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('Invalid GeoJSON type'))).toBe(true);
    });

    it('should detect missing features array', () => {
      const geojson = {
        type: 'FeatureCollection',
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('features'))).toBe(true);
    });

    it('should validate Point geometry', () => {
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [106.8456, -6.2088],
        },
        properties: {},
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(true);
    });

    it('should detect invalid Point coordinates', () => {
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [200, -100], // Invalid: out of range
        },
        properties: {},
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(false);
    });

    it('should validate Polygon geometry', () => {
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [106.8, -6.2],
              [106.9, -6.2],
              [106.9, -6.3],
              [106.8, -6.3],
              [106.8, -6.2], // Closed ring
            ],
          ],
        },
        properties: {},
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(true);
    });

    it('should detect unclosed Polygon ring', () => {
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [106.8, -6.2],
              [106.9, -6.2],
              [106.9, -6.3],
              [106.8, -6.3],
              // Missing closing point
            ],
          ],
        },
        properties: {},
      };

      const result = validateGeoJSON(geojson);
      expect(result.valid).toBe(false);
      expect(result.errors.some(e => e.includes('not closed'))).toBe(true);
    });

    it('should warn about missing properties', () => {
      const geojson = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [106.8456, -6.2088],
        },
      };

      const result = validateGeoJSON(geojson);
      expect(result.warnings.some(w => w.includes('properties'))).toBe(true);
    });
  });

  describe('validateCoordinateAccuracy', () => {
    it('should validate coordinates within tolerance', () => {
      const coord1: [number, number] = [106.8456, -6.2088];
      const coord2: [number, number] = [106.8457, -6.2089]; // ~15 meters away

      const result = validateCoordinateAccuracy(coord1, coord2, 100);
      expect(result).toBe(true);
    });

    it('should reject coordinates outside tolerance', () => {
      const coord1: [number, number] = [106.8456, -6.2088];
      const coord2: [number, number] = [106.8556, -6.2188]; // ~1.5 km away

      const result = validateCoordinateAccuracy(coord1, coord2, 100);
      expect(result).toBe(false);
    });

    it('should validate identical coordinates', () => {
      const coord: [number, number] = [106.8456, -6.2088];

      const result = validateCoordinateAccuracy(coord, coord, 100);
      expect(result).toBe(true);
    });
  });

  describe('handleTileLoadError', () => {
    it('should create tile load error', () => {
      const error = handleTileLoadError(new Error('Tile failed'));

      expect(error.type).toBe('tile_load');
      expect(error.message).toContain('Failed to load map tiles');
      expect(error.recoverable).toBe(true);
    });
  });

  describe('handleGeoJSONError', () => {
    it('should create GeoJSON error from validation', () => {
      const validation = {
        valid: false,
        errors: ['Missing type', 'Invalid coordinates'],
        warnings: [],
      };

      const error = handleGeoJSONError(validation);

      expect(error.type).toBe('geojson_invalid');
      expect(error.message).toContain('Invalid GeoJSON');
      expect(error.recoverable).toBe(false);
    });
  });

  describe('validateChartData', () => {
    it('should validate valid chart data', () => {
      const data = [
        { name: 'A', value: 10 },
        { name: 'B', value: 20 },
      ];

      const error = validateChartData(data);
      expect(error).toBeNull();
    });

    it('should detect non-array data', () => {
      const data = 'not an array';

      const error = validateChartData(data as any);
      expect(error).not.toBeNull();
      expect(error?.type).toBe('data_invalid');
    });

    it('should detect empty data', () => {
      const data: any[] = [];

      const error = validateChartData(data);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('empty');
    });

    it('should detect invalid data items', () => {
      const data = ['string', 'items'];

      const error = validateChartData(data as any);
      expect(error).not.toBeNull();
      expect(error?.message).toContain('objects');
    });
  });

  describe('handleChartError', () => {
    it('should create chart render error', () => {
      const error = handleChartError(new Error('Render failed'));

      expect(error.type).toBe('render_error');
      expect(error.fallbackAvailable).toBe(true);
    });
  });

  describe('getMapErrorMessage', () => {
    it('should return friendly message for tile load error', () => {
      const error = handleTileLoadError(new Error('Failed'));
      const message = getMapErrorMessage(error);

      expect(message).toContain('map tiles');
    });

    it('should return friendly message for GeoJSON error', () => {
      const validation = {
        valid: false,
        errors: ['Invalid format'],
        warnings: [],
      };
      const error = handleGeoJSONError(validation);
      const message = getMapErrorMessage(error);

      expect(message).toContain('Invalid GeoJSON');
    });
  });

  describe('getChartErrorMessage', () => {
    it('should return friendly message for data invalid error', () => {
      const error = {
        type: 'data_invalid' as const,
        message: 'Data is empty',
        fallbackAvailable: true,
      };

      const message = getChartErrorMessage(error);
      expect(message).toBe('Data is empty');
    });

    it('should return friendly message for render error', () => {
      const error = handleChartError(new Error('Failed'));
      const message = getChartErrorMessage(error);

      expect(message).toContain('table format');
    });
  });
});
