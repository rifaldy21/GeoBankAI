/**
 * Data Management Error Handler
 * 
 * Handles errors specific to data management operations:
 * - File size validation (max 50MB)
 * - File format validation
 * - Progress indicators for uploads
 * - Validation errors with row/column references
 * - Partial import support
 */

export interface FileValidationError {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface DataValidationError {
  row: number;
  column: string;
  value: any;
  message: string;
  severity: 'error' | 'warning';
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  successfulRows: number;
  failedRows: number;
  errors: DataValidationError[];
  warnings: DataValidationError[];
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  status: 'uploading' | 'processing' | 'validating' | 'complete' | 'error';
  message?: string;
}

// File size limits
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB in bytes
const MAX_FILE_SIZE_MB = 50;

// Supported file formats
const SUPPORTED_FORMATS = {
  csv: ['text/csv', 'application/csv'],
  excel: [
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ],
  json: ['application/json'],
  geojson: ['application/geo+json', 'application/json'],
};

/**
 * Validate file size
 */
export function validateFileSize(file: File): FileValidationError {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    errors.push(
      `File size (${sizeMB}MB) exceeds maximum allowed size of ${MAX_FILE_SIZE_MB}MB`
    );
  }

  // Warning for large files (over 25MB)
  if (file.size > MAX_FILE_SIZE / 2 && file.size <= MAX_FILE_SIZE) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    warnings.push(
      `Large file detected (${sizeMB}MB). Upload may take longer.`
    );
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate file format
 */
export function validateFileFormat(
  file: File,
  expectedFormat: keyof typeof SUPPORTED_FORMATS
): FileValidationError {
  const errors: string[] = [];
  const warnings: string[] = [];

  const allowedTypes = SUPPORTED_FORMATS[expectedFormat];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  // Check MIME type
  if (!allowedTypes.includes(file.type)) {
    // Check file extension as fallback
    if (expectedFormat === 'csv' && fileExtension !== 'csv') {
      errors.push(
        `Invalid file format. Expected CSV file, got ${file.type || 'unknown'}`
      );
    } else if (
      expectedFormat === 'excel' &&
      !['xls', 'xlsx'].includes(fileExtension || '')
    ) {
      errors.push(
        `Invalid file format. Expected Excel file (.xls or .xlsx), got ${fileExtension || 'unknown'}`
      );
    } else if (
      expectedFormat === 'json' &&
      fileExtension !== 'json'
    ) {
      errors.push(
        `Invalid file format. Expected JSON file, got ${fileExtension || 'unknown'}`
      );
    } else if (
      expectedFormat === 'geojson' &&
      !['json', 'geojson'].includes(fileExtension || '')
    ) {
      errors.push(
        `Invalid file format. Expected GeoJSON file, got ${fileExtension || 'unknown'}`
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate file before upload
 */
export function validateFile(
  file: File,
  expectedFormat: keyof typeof SUPPORTED_FORMATS
): FileValidationError {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate file size
  const sizeValidation = validateFileSize(file);
  errors.push(...sizeValidation.errors);
  warnings.push(...sizeValidation.warnings);

  // Validate file format
  const formatValidation = validateFileFormat(file, expectedFormat);
  errors.push(...formatValidation.errors);
  warnings.push(...formatValidation.warnings);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Create upload progress tracker
 */
export function createProgressTracker(
  onProgress: (progress: UploadProgress) => void
): {
  update: (loaded: number, total: number) => void;
  setStatus: (status: UploadProgress['status'], message?: string) => void;
  complete: () => void;
  error: (message: string) => void;
} {
  return {
    update: (loaded: number, total: number) => {
      onProgress({
        loaded,
        total,
        percentage: Math.round((loaded / total) * 100),
        status: 'uploading',
      });
    },

    setStatus: (status: UploadProgress['status'], message?: string) => {
      onProgress({
        loaded: 0,
        total: 0,
        percentage: status === 'complete' ? 100 : 0,
        status,
        message,
      });
    },

    complete: () => {
      onProgress({
        loaded: 0,
        total: 0,
        percentage: 100,
        status: 'complete',
        message: 'Upload complete',
      });
    },

    error: (message: string) => {
      onProgress({
        loaded: 0,
        total: 0,
        percentage: 0,
        status: 'error',
        message,
      });
    },
  };
}

/**
 * Validate CSV data row
 */
export function validateDataRow(
  row: Record<string, any>,
  rowIndex: number,
  schema: Record<string, { required?: boolean; type?: string; validate?: (value: any) => boolean }>
): DataValidationError[] {
  const errors: DataValidationError[] = [];

  Object.entries(schema).forEach(([column, rules]) => {
    const value = row[column];

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({
        row: rowIndex,
        column,
        value,
        message: `Required field is missing`,
        severity: 'error',
      });
      return;
    }

    // Skip validation if value is empty and not required
    if (value === undefined || value === null || value === '') {
      return;
    }

    // Check type
    if (rules.type) {
      const actualType = typeof value;
      if (rules.type === 'number' && isNaN(Number(value))) {
        errors.push({
          row: rowIndex,
          column,
          value,
          message: `Expected number, got ${actualType}`,
          severity: 'error',
        });
      } else if (rules.type === 'string' && actualType !== 'string') {
        errors.push({
          row: rowIndex,
          column,
          value,
          message: `Expected string, got ${actualType}`,
          severity: 'error',
        });
      } else if (rules.type === 'boolean' && actualType !== 'boolean') {
        errors.push({
          row: rowIndex,
          column,
          value,
          message: `Expected boolean, got ${actualType}`,
          severity: 'error',
        });
      }
    }

    // Custom validation
    if (rules.validate && !rules.validate(value)) {
      errors.push({
        row: rowIndex,
        column,
        value,
        message: `Validation failed`,
        severity: 'error',
      });
    }
  });

  return errors;
}

/**
 * Validate entire dataset
 */
export function validateDataset(
  data: Record<string, any>[],
  schema: Record<string, { required?: boolean; type?: string; validate?: (value: any) => boolean }>
): ImportResult {
  const errors: DataValidationError[] = [];
  const warnings: DataValidationError[] = [];
  let successfulRows = 0;

  data.forEach((row, index) => {
    const rowErrors = validateDataRow(row, index + 1, schema);
    
    if (rowErrors.length > 0) {
      errors.push(...rowErrors);
    } else {
      successfulRows++;
    }
  });

  const failedRows = data.length - successfulRows;

  return {
    success: errors.length === 0,
    totalRows: data.length,
    successfulRows,
    failedRows,
    errors,
    warnings,
  };
}

/**
 * Format validation errors for display
 */
export function formatValidationErrors(errors: DataValidationError[]): string {
  if (errors.length === 0) {
    return 'No errors';
  }

  // Group errors by row
  const errorsByRow = errors.reduce((acc, error) => {
    if (!acc[error.row]) {
      acc[error.row] = [];
    }
    acc[error.row].push(error);
    return acc;
  }, {} as Record<number, DataValidationError[]>);

  // Format errors
  const lines: string[] = [];
  Object.entries(errorsByRow).forEach(([row, rowErrors]) => {
    lines.push(`Row ${row}:`);
    rowErrors.forEach(error => {
      lines.push(`  • ${error.column}: ${error.message}`);
    });
  });

  return lines.join('\n');
}

/**
 * Create import summary message
 */
export function createImportSummary(result: ImportResult): string {
  const parts: string[] = [];

  parts.push(`Total rows: ${result.totalRows}`);
  parts.push(`Successful: ${result.successfulRows}`);
  
  if (result.failedRows > 0) {
    parts.push(`Failed: ${result.failedRows}`);
  }

  if (result.errors.length > 0) {
    parts.push(`\nErrors: ${result.errors.length}`);
  }

  if (result.warnings.length > 0) {
    parts.push(`Warnings: ${result.warnings.length}`);
  }

  return parts.join('\n');
}

/**
 * Filter valid rows from dataset
 */
export function filterValidRows(
  data: Record<string, any>[],
  schema: Record<string, { required?: boolean; type?: string; validate?: (value: any) => boolean }>
): Record<string, any>[] {
  return data.filter((row, index) => {
    const errors = validateDataRow(row, index + 1, schema);
    return errors.length === 0;
  });
}

/**
 * Get error summary by column
 */
export function getErrorSummaryByColumn(
  errors: DataValidationError[]
): Record<string, number> {
  return errors.reduce((acc, error) => {
    acc[error.column] = (acc[error.column] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Get most common errors
 */
export function getMostCommonErrors(
  errors: DataValidationError[],
  limit: number = 5
): Array<{ message: string; count: number }> {
  const errorCounts = errors.reduce((acc, error) => {
    const key = `${error.column}: ${error.message}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(errorCounts)
    .map(([message, count]) => ({ message, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

/**
 * Check if partial import is allowed
 */
export function canPartialImport(result: ImportResult): boolean {
  return result.successfulRows > 0 && result.failedRows > 0;
}

/**
 * Get user-friendly file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
}

export default {
  validateFileSize,
  validateFileFormat,
  validateFile,
  createProgressTracker,
  validateDataRow,
  validateDataset,
  formatValidationErrors,
  createImportSummary,
  filterValidRows,
  getErrorSummaryByColumn,
  getMostCommonErrors,
  canPartialImport,
  formatFileSize,
  MAX_FILE_SIZE,
  MAX_FILE_SIZE_MB,
  SUPPORTED_FORMATS,
};
