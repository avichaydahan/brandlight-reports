import { z } from 'zod';

/**
 * Brandlight API Types
 * Based on the API documentation provided
 */

// ============================================================================
// Task/Download Types
// ============================================================================

// Download Manager statuses (from client)
export const DOWNLOAD_STATUS = {
  IN_PROGRESS: 'IN-PROGRESS',
  DONE: 'DONE',
  PENDING: 'PENDING',
  READY_FOR_DOWNLOAD: 'READY-FOR-DOWNLOAD',
  ERROR: 'ERROR',
} as const;

export const DownloadStatusSchema = z.enum([
  'PENDING',
  'IN-PROGRESS',
  'DONE',
  'READY-FOR-DOWNLOAD',
  'ERROR',
]);

export type DownloadStatus = z.infer<typeof DownloadStatusSchema>;

// Report Types
export const REPORT_TYPE = {
  JSON_EXPORT: 'json-export',
  PARTNERSHIP: 'partnership',
  SINGLE_DOMAIN: 'single-domain',
} as const;

export const ReportTypeSchema = z.enum([
  'json-export',
  'partnership',
  'single-domain',
]);

export type ReportType = z.infer<typeof ReportTypeSchema>;

export const DownloadTypeSchema = z.enum([
  'QUERIES',
  'REPORT',
  'EXPORT',
]);

export type DownloadType = z.infer<typeof DownloadTypeSchema>;

// Create Download Request
export const CreateDownloadRequestSchema = z.object({
  tenantId: z.string(),
  brandId: z.string(),
  downloadType: DownloadTypeSchema,
});

export type CreateDownloadRequest = z.infer<typeof CreateDownloadRequestSchema>;

// Create Download Response
export const CreateDownloadResponseSchema = z.object({
  id: z.string().uuid(),
  tenantId: z.string(),
  brandId: z.string(),
  downloadType: DownloadTypeSchema,
  status: DownloadStatusSchema,
  createdAt: z.string().optional(),
});

export type CreateDownloadResponse = z.infer<typeof CreateDownloadResponseSchema>;

// Update Download Status Request
export const UpdateDownloadStatusRequestSchema = z.object({
  tenantId: z.string(),
  brandId: z.string(),
  status: DownloadStatusSchema,
  path: z.string().optional(),
  error: z.string().optional(),
});

export type UpdateDownloadStatusRequest = z.infer<typeof UpdateDownloadStatusRequestSchema>;

// ============================================================================
// Filter Types (for queries export)
// ============================================================================

export const FilterOperatorSchema = z.enum(['is', 'is_not', 'contains', 'not_contains']);

export type FilterOperator = z.infer<typeof FilterOperatorSchema>;

export const FilterSchema = z.object({
  field: z.enum(['engine', 'category', 'location', 'persona']),
  operator: FilterOperatorSchema,
  value: z.array(z.string()),
});

export type Filter = z.infer<typeof FilterSchema>;

export const FiltersSchema = z.object({
  logic: z.array(z.enum(['AND', 'OR'])),
  filters: z.array(FilterSchema),
});

export type Filters = z.infer<typeof FiltersSchema>;

// ============================================================================
// View State (user selections in UI)
// ============================================================================

export const ViewStateSchema = z.object({
  selectedEngines: z.array(z.string()),
  selectedCategories: z.array(z.string()),
  selectedPersonas: z.array(z.string()),
  selectedLocations: z.array(z.string()),
});

export type ViewState = z.infer<typeof ViewStateSchema>;

// ============================================================================
// Selected Fields Types
// ============================================================================

export type QueryFieldName =
  | 'query'
  | 'queryType'
  | 'estimatedSearchVolume'
  | 'queryImportanceRanking'
  | 'persona'
  | 'associatedCategory'
  | 'stageInFunnel'
  | 'searchQueries';

export interface SelectedFields {
  answers?: boolean;
  citations?: boolean;
  queries?: QueryFieldName[];
}

// ============================================================================
// Export Request (for fetching data)
// ============================================================================

export const ExportRequestSchema = z.object({
  viewState: ViewStateSchema.optional(),
  tenantId: z.string(),
  brandId: z.string(),
  engineIds: z.array(z.string()),
  categoryIds: z.array(z.string()),
  personaIds: z.array(z.string()),
  locationIds: z.array(z.string()),
  start: z.number().default(0),
  amount: z.number().default(100),
  filters: FiltersSchema.optional(),
  viewId: z.string().nullable().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  selectedFields: z.object({
    answers: z.boolean().optional(),
    citations: z.boolean().optional(),
    queries: z.array(z.enum([
      'query',
      'queryType',
      'estimatedSearchVolume',
      'queryImportanceRanking',
      'persona',
      'associatedCategory',
      'stageInFunnel',
      'searchQueries',
    ])).optional(),
  }).optional(),
});

export type ExportRequest = z.infer<typeof ExportRequestSchema>;

// ============================================================================
// Query/Report Data Types (from Brandlight API responses)
// ============================================================================

// Engine data
export const EngineSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string().optional(),
});

export type Engine = z.infer<typeof EngineSchema>;

// Category data
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string(),
  parentId: z.string().nullable().optional(),
});

export type Category = z.infer<typeof CategorySchema>;

// Persona data
export const PersonaSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
});

export type Persona = z.infer<typeof PersonaSchema>;

// Location data
export const LocationSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
});

export type Location = z.infer<typeof LocationSchema>;

// Query result item
export const QueryResultItemSchema = z.object({
  id: z.string(),
  query: z.string(),
  engineId: z.string(),
  categoryId: z.string(),
  personaId: z.string().optional(),
  locationId: z.string().optional(),
  brandMentioned: z.boolean(),
  sentiment: z.enum(['positive', 'neutral', 'negative']).optional(),
  rank: z.number().optional(),
  url: z.string().optional(),
  snippet: z.string().optional(),
  createdAt: z.string().optional(),
});

export type QueryResultItem = z.infer<typeof QueryResultItemSchema>;

// Export response (full data from /export endpoint)
export const ExportResponseSchema = z.object({
  queries: z.array(QueryResultItemSchema).optional(),
  engines: z.array(EngineSchema).optional(),
  categories: z.array(CategorySchema).optional(),
  personas: z.array(PersonaSchema).optional(),
  locations: z.array(LocationSchema).optional(),
  totalCount: z.number().optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type ExportResponse = z.infer<typeof ExportResponseSchema>;

// ============================================================================
// Report Generation Request (incoming from Brandlight)
// ============================================================================

export const GenerateReportRequestSchema = z.object({
  tenantId: z.string(),
  brandId: z.string(),
  downloadId: z.string(), // Can be UUID or custom identifier
  downloadType: DownloadTypeSchema.optional(),
  // Required report type: 'json-export', 'partnership', or 'single-domain'
  reportType: ReportTypeSchema,
  // Export parameters for fetching data (required for json-export type)
  exportParams: ExportRequestSchema.optional(),
  // Optional metadata
  metadata: z.object({
    brandName: z.string().optional(),
    reportTitle: z.string().optional(),
    timePeriod: z.string().optional(),
    requestedBy: z.string().optional(),
  }).optional(),
});

export type GenerateReportRequest = z.infer<typeof GenerateReportRequestSchema>;

// Paginated export response for JSON export
export interface PaginatedExportData {
  items: unknown[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================================================
// Brandlight API Configuration
// ============================================================================

export interface BrandlightApiConfig {
  baseUrl: string;
  accessKey: string;
  timeout?: number;
}

// ============================================================================
// API Error Types
// ============================================================================

export class BrandlightApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'BrandlightApiError';
  }
}
