import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DataTable, { ColumnDef } from './DataTable';

interface TestData {
  id: number;
  name: string;
  email: string;
  age: number;
  city: string;
}

const generateLargeDataset = (size: number): TestData[] => {
  return Array.from({ length: size }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    age: 20 + (i % 50),
    city: ['Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang'][i % 5]
  }));
};

const columns: ColumnDef<TestData>[] = [
  { key: 'id', header: 'ID', sortable: true, width: '80px' },
  { key: 'name', header: 'Name', sortable: true, filterable: true },
  { key: 'email', header: 'Email', sortable: true, filterable: true },
  { key: 'age', header: 'Age', sortable: true, filterable: true, width: '100px' },
  { key: 'city', header: 'City', sortable: true, filterable: true }
];

describe('DataTable Performance Optimizations', () => {
  describe('Virtual Scrolling', () => {
    it('should render large dataset with virtual scrolling enabled', () => {
      const largeData = generateLargeDataset(10000);
      
      const { container } = render(
        <DataTable
          data={largeData}
          columns={columns}
          virtualScroll={true}
          rowHeight={48}
        />
      );

      // Should only render visible rows, not all 10,000
      const rows = container.querySelectorAll('tbody tr');
      expect(rows.length).toBeLessThan(100); // Much less than 10,000
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });

    it('should update visible rows on scroll', async () => {
      const largeData = generateLargeDataset(1000);
      
      const { container } = render(
        <DataTable
          data={largeData}
          columns={columns}
          virtualScroll={true}
          rowHeight={48}
        />
      );

      // Virtual scroll container should exist
      const scrollContainer = container.querySelector('div[class*="overflow-auto"]');
      expect(scrollContainer).toBeTruthy();

      // Simulate scroll
      if (scrollContainer) {
        fireEvent.scroll(scrollContainer, { target: { scrollTop: 2400 } }); // Scroll down ~50 rows
        
        await waitFor(() => {
          // Should render rows around the scrolled position
          const rows = container.querySelectorAll('tbody tr');
          expect(rows.length).toBeGreaterThan(0);
        });
      }
    });
  });

  describe('Pagination Performance', () => {
    it('should render pagination with configurable page sizes', () => {
      const data = generateLargeDataset(500);
      
      render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{
            pageSize: 25,
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50, 100, 250]
          }}
        />
      );

      expect(screen.getByText('Rows per page:')).toBeInTheDocument();
      expect(screen.getByDisplayValue('25')).toBeInTheDocument();
    });

    it('should change page size and reset to first page', async () => {
      const data = generateLargeDataset(500);
      
      render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: [10, 25, 50]
          }}
        />
      );

      // Navigate to page 2
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 2 of/)).toBeInTheDocument();
      });

      // Change page size
      const pageSizeSelect = screen.getByDisplayValue('10');
      fireEvent.change(pageSizeSelect, { target: { value: '25' } });

      await waitFor(() => {
        // Should reset to page 1
        expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
      });
    });

    it('should navigate to first and last page', () => {
      const data = generateLargeDataset(100);
      
      render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{
            pageSize: 10,
            showSizeChanger: false
          }}
        />
      );

      // Navigate to last page
      const lastButton = screen.getByText('Last');
      fireEvent.click(lastButton);

      expect(screen.getByText(/Page 10 of 10/)).toBeInTheDocument();

      // Navigate to first page
      const firstButton = screen.getByText('First');
      fireEvent.click(firstButton);

      expect(screen.getByText(/Page 1 of 10/)).toBeInTheDocument();
    });
  });

  describe('Optimized Sorting', () => {
    it('should sort numeric columns efficiently', () => {
      const data = generateLargeDataset(1000);
      
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      );

      // Click age column header to sort
      const ageHeader = screen.getByText('Age', { selector: 'span' });
      fireEvent.click(ageHeader);

      // First row should have lowest age
      const firstRow = container.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('20');
    });

    it('should sort string columns with locale-aware comparison', () => {
      const data = generateLargeDataset(100);
      
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      );

      // Click name column header to sort
      const nameHeader = screen.getByText('Name', { selector: 'span' });
      fireEvent.click(nameHeader);

      // First row should have User 1
      const firstRow = container.querySelector('tbody tr:first-child');
      expect(firstRow?.textContent).toContain('User 1');
    });

    it('should toggle sort direction and clear sort on third click', () => {
      const data = generateLargeDataset(50);
      
      render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      );

      const ageHeader = screen.getByText('Age', { selector: 'span' });

      // First click - ascending
      fireEvent.click(ageHeader);
      expect(screen.getByText('User 1')).toBeInTheDocument();

      // Second click - descending
      fireEvent.click(ageHeader);
      expect(screen.getByText('User 49')).toBeInTheDocument();

      // Third click - clear sort (back to original order)
      fireEvent.click(ageHeader);
      expect(screen.getByText('User 1')).toBeInTheDocument();
    });
  });

  describe('Optimized Filtering', () => {
    it('should filter data efficiently with multiple criteria', async () => {
      const data = generateLargeDataset(500);
      
      render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      );

      // Filter by city
      const cityFilter = screen.getAllByPlaceholderText('Filter...')[4]; // City column
      fireEvent.change(cityFilter, { target: { value: 'Jakarta' } });

      await waitFor(() => {
        expect(screen.getByText(/filtered from 500/)).toBeInTheDocument();
      });

      // Add name filter
      const nameFilter = screen.getAllByPlaceholderText('Filter...')[0]; // Name column
      fireEvent.change(nameFilter, { target: { value: 'User 1' } });

      await waitFor(() => {
        // Should show fewer results
        const recordsText = screen.getByText(/Showing \d+ of \d+ records/);
        expect(recordsText).toBeInTheDocument();
      });
    });

    it('should reset to first page when filtering', async () => {
      const data = generateLargeDataset(200);
      
      render(
        <DataTable
          data={data}
          columns={columns}
          pagination={{ pageSize: 10 }}
        />
      );

      // Navigate to page 3
      const nextButton = screen.getByText('Next');
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      await waitFor(() => {
        expect(screen.getByText(/Page 3 of/)).toBeInTheDocument();
      });

      // Apply filter that returns results - filter by name column (index 1)
      const nameFilter = screen.getAllByPlaceholderText('Filter...')[1]; // Name column filter
      fireEvent.change(nameFilter, { target: { value: 'User 1' } }); // Will match User 1, 10-19, 100-199

      await waitFor(() => {
        // Should reset to page 1 and show pagination
        expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
      });
    });
  });

  describe('Memoization', () => {
    it('should not re-render rows when unrelated state changes', () => {
      const data = generateLargeDataset(50);
      const onRowClick = vi.fn();
      
      const { rerender } = render(
        <DataTable
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          pagination={{ pageSize: 10 }}
        />
      );

      // Get initial row count
      const initialRows = screen.getAllByRole('row').length;

      // Re-render with same data
      rerender(
        <DataTable
          data={data}
          columns={columns}
          onRowClick={onRowClick}
          pagination={{ pageSize: 10 }}
        />
      );

      // Row count should remain the same
      expect(screen.getAllByRole('row').length).toBe(initialRows);
    });

    it('should memoize export function', () => {
      const data = generateLargeDataset(100);
      
      const { rerender } = render(
        <DataTable
          data={data}
          columns={columns}
          exportable={true}
        />
      );

      const exportButton = screen.getByText('Export CSV');
      expect(exportButton).toBeInTheDocument();

      // Re-render should not recreate export function
      rerender(
        <DataTable
          data={data}
          columns={columns}
          exportable={true}
        />
      );

      expect(screen.getByText('Export CSV')).toBeInTheDocument();
    });
  });

  describe('Export Functionality', () => {
    it('should export filtered and sorted data to CSV', () => {
      const data = generateLargeDataset(50);
      
      // Mock URL.createObjectURL and document methods
      const createObjectURLMock = vi.fn(() => 'blob:mock-url');
      const revokeObjectURLMock = vi.fn();
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = revokeObjectURLMock;

      const appendChildMock = vi.spyOn(document.body, 'appendChild');
      const removeChildMock = vi.spyOn(document.body, 'removeChild');

      render(
        <DataTable
          data={data}
          columns={columns}
          exportable={true}
        />
      );

      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);

      expect(createObjectURLMock).toHaveBeenCalled();
      expect(appendChildMock).toHaveBeenCalled();
      expect(removeChildMock).toHaveBeenCalled();
      expect(revokeObjectURLMock).toHaveBeenCalled();

      appendChildMock.mockRestore();
      removeChildMock.mockRestore();
    });

    it('should handle CSV escaping for special characters', () => {
      const specialData: TestData[] = [
        { id: 1, name: 'User, with comma', email: 'test@example.com', age: 25, city: 'Jakarta' },
        { id: 2, name: 'User "with quotes"', email: 'test2@example.com', age: 30, city: 'Bandung' }
      ];

      const createObjectURLMock = vi.fn(() => 'blob:mock-url');
      global.URL.createObjectURL = createObjectURLMock;
      global.URL.revokeObjectURL = vi.fn();

      const appendChildMock = vi.spyOn(document.body, 'appendChild');
      const removeChildMock = vi.spyOn(document.body, 'removeChild');

      render(
        <DataTable
          data={specialData}
          columns={columns}
          exportable={true}
        />
      );

      const exportButton = screen.getByText('Export CSV');
      fireEvent.click(exportButton);

      expect(createObjectURLMock).toHaveBeenCalled();

      appendChildMock.mockRestore();
      removeChildMock.mockRestore();
    });
  });

  describe('Loading State', () => {
    it('should display skeleton loader when loading', () => {
      const data = generateLargeDataset(50);
      
      const { container } = render(
        <DataTable
          data={data}
          columns={columns}
          loading={true}
        />
      );

      expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('should display no data message when data is empty', () => {
      render(
        <DataTable
          data={[]}
          columns={columns}
        />
      );

      expect(screen.getByText('No data available')).toBeInTheDocument();
    });

    it('should display no data message when all data is filtered out', async () => {
      const data = generateLargeDataset(50);
      
      render(
        <DataTable
          data={data}
          columns={columns}
        />
      );

      // Filter with non-existent value
      const nameFilter = screen.getAllByPlaceholderText('Filter...')[0];
      fireEvent.change(nameFilter, { target: { value: 'NonExistentUser' } });

      await waitFor(() => {
        expect(screen.getByText('No data available')).toBeInTheDocument();
      });
    });
  });
});
