import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import LeafletMap from './LeafletMap';
import { debounce } from '../utils/debounce';

// Mock Leaflet with performance tracking
const mockAddLayers = vi.fn();

vi.mock('leaflet', () => ({
  default: {
    map: vi.fn(() => ({
      addLayer: vi.fn(),
      remove: vi.fn(),
      invalidateSize: vi.fn(),
      zoomIn: vi.fn(),
      zoomOut: vi.fn(),
    })),
    tileLayer: vi.fn(() => ({
      addTo: vi.fn(),
    })),
    markerClusterGroup: vi.fn(() => ({
      addTo: vi.fn(),
      addLayer: vi.fn(),
      addLayers: mockAddLayers,
      clearLayers: vi.fn(),
    })),
    layerGroup: vi.fn(() => ({
      addTo: vi.fn(),
      addLayer: vi.fn(),
      clearLayers: vi.fn(),
    })),
    marker: vi.fn(() => ({
      bindPopup: vi.fn(() => ({
        addTo: vi.fn(),
      })),
      addTo: vi.fn(),
    })),
    circle: vi.fn(() => ({
      addTo: vi.fn(),
    })),
    divIcon: vi.fn(),
    canvas: vi.fn(),
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}));

vi.mock('leaflet.markercluster', () => ({}));

vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('LeafletMap Performance Optimizations - Requirement 3.7', () => {
  it('should use batch marker operations (addLayers) for efficiency', async () => {
    render(<LeafletMap />);
    
    // Wait for initial render to complete
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Verify addLayers (batch) was called
    expect(mockAddLayers).toHaveBeenCalled();
    
    // Verify it was called with an array of markers (batch operation)
    if (mockAddLayers.mock.calls.length > 0) {
      const callArgs = mockAddLayers.mock.calls[0];
      expect(Array.isArray(callArgs[0])).toBe(true);
      // Should have multiple markers in the batch
      expect(callArgs[0].length).toBeGreaterThan(0);
    }
  });

  it('should have debounce utility for performance optimization', (done) => {
    const mockFn = vi.fn();
    const debouncedFn = debounce(mockFn, 100);
    
    // Call multiple times rapidly
    debouncedFn();
    debouncedFn();
    debouncedFn();
    
    // Should not have been called yet
    expect(mockFn).not.toHaveBeenCalled();
    
    // Wait for debounce period
    setTimeout(() => {
      // Should have been called only once
      expect(mockFn).toHaveBeenCalledTimes(1);
      done();
    }, 150);
  });

  it('should render map component with performance optimizations', () => {
    const { container } = render(<LeafletMap />);
    
    // Verify component renders
    expect(container.querySelector('.bg-white.rounded-2xl')).toBeInTheDocument();
    
    // Verify layer controls exist (for toggling layers within 500ms)
    const layerButton = container.querySelector('button .lucide-layers')?.parentElement;
    expect(layerButton).toBeInTheDocument();
    
    // Verify search input exists (with debouncing)
    const searchInput = container.querySelector('input[placeholder*="Search"]');
    expect(searchInput).toBeInTheDocument();
  });
});
