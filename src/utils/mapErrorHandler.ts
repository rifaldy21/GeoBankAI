/**
 * Map and Visualization Error Handler
 * 
 * Handles errors specific to map rendering and data visualizations:
 * - Map tile loading failures
 * - GeoJSON validation errors
 * - Chart rendering errors
 * - Fallback UI strategies
 */

import { FeatureCollection, Geometry } from 'geojson';

export interface MapError {
  type: 'tile_load' | 'geojson_invalid' | 'marker_render' | 'layer_error';
  message: string;
  details?: any;
  recoverable: boolean;
}

export interface GeoJSONValidationError {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface ChartError {
  type: 'data_invalid' | 'render_error' | 'config_error';
  message: string;
  fallbackAvailable: boolean;
}

/**
 * Validate GeoJSON structure
 */
export function validateGeoJSON(data: any): GeoJSONValidationError {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check if data exists
  if (!data) {
    errors.push('GeoJSON data is null or undefined');
    return { valid: false, errors, warnings };
  }

  // Check type
  if (!data.type) {
    errors.push('Missing required "type" property');
  } else if (!['FeatureCollection', 'Feature', 'Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'GeometryCollection'].includes(data.type)) {
    errors.push(`Invalid GeoJSON type: "${data.type}"`);
  }

  // Validate FeatureCollection
  if (data.type === 'FeatureCollection') {
    if (!Array.isArray(data.features)) {
      errors.push('FeatureCollection must have a "features" array');
    } else {
      // Validate each feature
      data.features.forEach((feature: any, index: number) => {
        if (!feature.type || feature.type !== 'Feature') {
          errors.push(`Feature at index ${index} has invalid type`);
        }
        
        if (!feature.geometry) {
          errors.push(`Feature at index ${index} is missing geometry`);
        } else {
          const geometryErrors = validateGeometry(feature.geometry, index);
          errors.push(...geometryErrors);
        }

        if (!feature.properties) {
          warnings.push(`Feature at index ${index} is missing properties`);
        }
      });

      // Check for empty features
      if (data.features.length === 0) {
        warnings.push('FeatureCollection has no features');
      }
    }
  }

  // Validate Feature
  if (data.type === 'Feature') {
    if (!data.geometry) {
      errors.push('Feature is missing geometry');
    } else {
      const geometryErrors = validateGeometry(data.geometry);
      errors.push(...geometryErrors);
    }

    if (!data.properties) {
      warnings.push('Feature is missing properties');
    }
  }

  // Validate Geometry types
  if (['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'].includes(data.type)) {
    const geometryErrors = validateGeometry(data);
    errors.push(...geometryErrors);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate geometry object
 */
function validateGeometry(geometry: any, featureIndex?: number): string[] {
  const errors: string[] = [];
  const prefix = featureIndex !== undefined ? `Feature ${featureIndex}: ` : '';

  if (!geometry.type) {
    errors.push(`${prefix}Geometry is missing type`);
    return errors;
  }

  if (!geometry.coordinates) {
    errors.push(`${prefix}Geometry is missing coordinates`);
    return errors;
  }

  // Validate coordinates based on geometry type
  switch (geometry.type) {
    case 'Point':
      if (!validatePoint(geometry.coordinates)) {
        errors.push(`${prefix}Invalid Point coordinates`);
      }
      break;

    case 'LineString':
      if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length < 2) {
        errors.push(`${prefix}LineString must have at least 2 points`);
      } else if (!geometry.coordinates.every(validatePoint)) {
        errors.push(`${prefix}Invalid LineString coordinates`);
      }
      break;

    case 'Polygon':
      if (!Array.isArray(geometry.coordinates) || geometry.coordinates.length === 0) {
        errors.push(`${prefix}Polygon must have at least one ring`);
      } else {
        geometry.coordinates.forEach((ring: any, ringIndex: number) => {
          if (!Array.isArray(ring) || ring.length < 4) {
            errors.push(`${prefix}Polygon ring ${ringIndex} must have at least 4 points`);
          } else if (!ring.every(validatePoint)) {
            errors.push(`${prefix}Invalid coordinates in Polygon ring ${ringIndex}`);
          } else {
            // Check if ring is closed
            const first = ring[0];
            const last = ring[ring.length - 1];
            if (first[0] !== last[0] || first[1] !== last[1]) {
              errors.push(`${prefix}Polygon ring ${ringIndex} is not closed`);
            }
          }
        });
      }
      break;

    case 'MultiPoint':
      if (!Array.isArray(geometry.coordinates) || !geometry.coordinates.every(validatePoint)) {
        errors.push(`${prefix}Invalid MultiPoint coordinates`);
      }
      break;

    case 'MultiLineString':
      if (!Array.isArray(geometry.coordinates)) {
        errors.push(`${prefix}Invalid MultiLineString coordinates`);
      } else {
        geometry.coordinates.forEach((lineString: any, index: number) => {
          if (!Array.isArray(lineString) || lineString.length < 2) {
            errors.push(`${prefix}MultiLineString line ${index} must have at least 2 points`);
          }
        });
      }
      break;

    case 'MultiPolygon':
      if (!Array.isArray(geometry.coordinates)) {
        errors.push(`${prefix}Invalid MultiPolygon coordinates`);
      }
      break;
  }

  return errors;
}

/**
 * Validate a single point coordinate
 */
function validatePoint(coord: any): boolean {
  if (!Array.isArray(coord) || coord.length < 2) {
    return false;
  }

  const [lng, lat] = coord;

  // Check if coordinates are numbers
  if (typeof lng !== 'number' || typeof lat !== 'number') {
    return false;
  }

  // Check if coordinates are in valid range
  if (lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    return false;
  }

  // Check for NaN or Infinity
  if (!isFinite(lng) || !isFinite(lat)) {
    return false;
  }

  return true;
}

/**
 * Validate coordinate accuracy (within 100 meter tolerance)
 */
export function validateCoordinateAccuracy(
  coord: [number, number],
  referenceCoord: [number, number],
  toleranceMeters: number = 100
): boolean {
  const [lng1, lat1] = coord;
  const [lng2, lat2] = referenceCoord;

  // Calculate distance using Haversine formula
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= toleranceMeters;
}

/**
 * Create map error object
 */
export function createMapError(
  type: MapError['type'],
  message: string,
  details?: any
): MapError {
  return {
    type,
    message,
    details,
    recoverable: type !== 'geojson_invalid',
  };
}

/**
 * Handle map tile loading error
 */
export function handleTileLoadError(error: any): MapError {
  return createMapError(
    'tile_load',
    'Failed to load map tiles. Using fallback view.',
    error
  );
}

/**
 * Handle GeoJSON validation error
 */
export function handleGeoJSONError(validation: GeoJSONValidationError): MapError {
  const errorMessage = validation.errors.length > 0
    ? `Invalid GeoJSON: ${validation.errors.join(', ')}`
    : 'Invalid GeoJSON format';

  return createMapError(
    'geojson_invalid',
    errorMessage,
    { errors: validation.errors, warnings: validation.warnings }
  );
}

/**
 * Handle marker rendering error
 */
export function handleMarkerError(error: any, markerId?: string): MapError {
  const message = markerId
    ? `Failed to render marker: ${markerId}`
    : 'Failed to render map markers';

  return createMapError('marker_render', message, error);
}

/**
 * Handle layer error
 */
export function handleLayerError(error: any, layerId?: string): MapError {
  const message = layerId
    ? `Failed to load layer: ${layerId}`
    : 'Failed to load map layer';

  return createMapError('layer_error', message, error);
}

/**
 * Validate chart data
 */
export function validateChartData(data: any[]): ChartError | null {
  if (!Array.isArray(data)) {
    return {
      type: 'data_invalid',
      message: 'Chart data must be an array',
      fallbackAvailable: true,
    };
  }

  if (data.length === 0) {
    return {
      type: 'data_invalid',
      message: 'Chart data is empty',
      fallbackAvailable: true,
    };
  }

  // Check if data has required properties
  const firstItem = data[0];
  if (typeof firstItem !== 'object' || firstItem === null) {
    return {
      type: 'data_invalid',
      message: 'Chart data items must be objects',
      fallbackAvailable: true,
    };
  }

  return null;
}

/**
 * Handle chart rendering error
 */
export function handleChartError(error: any): ChartError {
  return {
    type: 'render_error',
    message: 'Failed to render chart. Showing data in table format.',
    fallbackAvailable: true,
  };
}

/**
 * Get user-friendly map error message
 */
export function getMapErrorMessage(error: MapError): string {
  switch (error.type) {
    case 'tile_load':
      return 'Unable to load map tiles. Showing simplified view.';
    
    case 'geojson_invalid':
      return error.message;
    
    case 'marker_render':
      return 'Some map markers could not be displayed.';
    
    case 'layer_error':
      return 'Failed to load map layer. Try refreshing the page.';
    
    default:
      return 'An error occurred while loading the map.';
  }
}

/**
 * Get user-friendly chart error message
 */
export function getChartErrorMessage(error: ChartError): string {
  switch (error.type) {
    case 'data_invalid':
      return error.message;
    
    case 'render_error':
      return 'Unable to display chart. Showing data in table format instead.';
    
    case 'config_error':
      return 'Chart configuration error. Please contact support.';
    
    default:
      return 'An error occurred while rendering the chart.';
  }
}

/**
 * Format GeoJSON validation errors for display
 */
export function formatGeoJSONErrors(validation: GeoJSONValidationError): string {
  const parts: string[] = [];

  if (validation.errors.length > 0) {
    parts.push('Errors:');
    validation.errors.forEach(error => {
      parts.push(`  • ${error}`);
    });
  }

  if (validation.warnings.length > 0) {
    parts.push('Warnings:');
    validation.warnings.forEach(warning => {
      parts.push(`  • ${warning}`);
    });
  }

  return parts.join('\n');
}

export default {
  validateGeoJSON,
  validateCoordinateAccuracy,
  createMapError,
  handleTileLoadError,
  handleGeoJSONError,
  handleMarkerError,
  handleLayerError,
  validateChartData,
  handleChartError,
  getMapErrorMessage,
  getChartErrorMessage,
  formatGeoJSONErrors,
};
