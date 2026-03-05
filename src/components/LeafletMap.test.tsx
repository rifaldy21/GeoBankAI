import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import LeafletMap from './LeafletMap';

// Mock Leaflet
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
      addLayers: vi.fn(),
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

// Mock leaflet.markercluster
vi.mock('leaflet.markercluster', () => ({}));

// Mock motion
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('LeafletMap Performance Optimizations', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should render the map component', () => {
    render(<LeafletMap />);
    expect(document.querySelector('.bg-white.rounded-2xl')).toBeInTheDocument();
  });

  it('should initialize with marker clustering enabled', async () => {
    const L = await import('leaflet');
    render(<LeafletMap />);
    
    await waitFor(() => {
      expect(L.default.markerClusterGroup).toHaveBeenCalled();
    });
  });

  it('should use canvas renderer for heatmap circles', async () => {
    const L = await import('leaflet');
    render(<LeafletMap />);
    
    await waitFor(() => {
      expect(L.default.canvas).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should have layer controls', () => {
    render(<LeafletMap />);
    // The layer button has an icon but no text, so we check for the button with the Layers icon
    const buttons = document.querySelectorAll('button');
    const layerButton = Array.from(buttons).find(btn => 
      btn.querySelector('.lucide-layers')
    );
    expect(layerButton).toBeInTheDocument();
  });

  it('should have zoom controls', () => {
    render(<LeafletMap />);
    const zoomButtons = document.querySelectorAll('button');
    expect(zoomButtons.length).toBeGreaterThan(0);
  });

  it('should have search functionality', () => {
    render(<LeafletMap />);
    const searchInput = screen.getByPlaceholderText(/search merchant/i);
    expect(searchInput).toBeInTheDocument();
  });
});
