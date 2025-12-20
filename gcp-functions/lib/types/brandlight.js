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
};
export const DownloadStatusSchema = z.enum([
    'PENDING',
    'IN-PROGRESS',
    'DONE',
    'READY-FOR-DOWNLOAD',
    'ERROR',
]);
// Report Types
export const REPORT_TYPE = {
    JSON_EXPORT: 'json-export',
    PARTNERSHIP: 'partnership',
    SINGLE_DOMAIN: 'single-domain',
};
export const ReportTypeSchema = z.enum([
    'json-export',
    'partnership',
    'single-domain',
]);
export const DownloadTypeSchema = z.enum([
    'QUERIES',
    'REPORT',
    'EXPORT',
]);
// Create Download Request
export const CreateDownloadRequestSchema = z.object({
    tenantId: z.string(),
    brandId: z.string(),
    downloadType: DownloadTypeSchema,
});
// Create Download Response
export const CreateDownloadResponseSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string(),
    brandId: z.string(),
    downloadType: DownloadTypeSchema,
    status: DownloadStatusSchema,
    createdAt: z.string().optional(),
});
// Update Download Status Request
export const UpdateDownloadStatusRequestSchema = z.object({
    tenantId: z.string(),
    brandId: z.string(),
    status: DownloadStatusSchema,
    downloadUrl: z.string().url().optional(),
    error: z.string().optional(),
});
// ============================================================================
// Filter Types (for queries export)
// ============================================================================
export const FilterOperatorSchema = z.enum(['is', 'is_not', 'contains', 'not_contains']);
export const FilterSchema = z.object({
    field: z.enum(['engine', 'category', 'location', 'persona']),
    operator: FilterOperatorSchema,
    value: z.array(z.string()),
});
export const FiltersSchema = z.object({
    logic: z.array(z.enum(['AND', 'OR'])),
    filters: z.array(FilterSchema),
});
// ============================================================================
// View State (user selections in UI)
// ============================================================================
export const ViewStateSchema = z.object({
    selectedEngines: z.array(z.string()),
    selectedCategories: z.array(z.string()),
    selectedPersonas: z.array(z.string()),
    selectedLocations: z.array(z.string()),
});
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
});
// ============================================================================
// Query/Report Data Types (from Brandlight API responses)
// ============================================================================
// Engine data
export const EngineSchema = z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string().optional(),
});
// Category data
export const CategorySchema = z.object({
    id: z.string(),
    name: z.string(),
    parentId: z.string().nullable().optional(),
});
// Persona data
export const PersonaSchema = z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().optional(),
});
// Location data
export const LocationSchema = z.object({
    id: z.string(),
    name: z.string(),
    code: z.string(),
});
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
// ============================================================================
// API Error Types
// ============================================================================
export class BrandlightApiError extends Error {
    statusCode;
    response;
    constructor(message, statusCode, response) {
        super(message);
        this.statusCode = statusCode;
        this.response = response;
        this.name = 'BrandlightApiError';
    }
}
