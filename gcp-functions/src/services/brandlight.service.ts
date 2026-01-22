import fetch, { Response } from 'node-fetch';
import { createLogger } from '../utils/logger.js';
import { brandlightConfig } from '../config/index.js';
import {
  BrandlightApiError,
  CreateDownloadRequest,
  CreateDownloadResponse,
  UpdateDownloadStatusRequest,
  ExportRequest,
  ExportResponse,
  DownloadStatus,
} from '../types/brandlight.js';

const logger = createLogger('BrandlightApiService');

/**
 * Brandlight API Service
 * Handles all communication with the Brandlight API
 * Authentication is done by passing the Authorization header from incoming requests
 */
export class BrandlightApiService {
  private baseUrl: string;
  private timeout: number;
  private externalAuthToken: string | null = null;

  constructor() {
    this.baseUrl = brandlightConfig.apiBaseUrl;
    this.timeout = brandlightConfig.timeout;
  }

  /**
   * Set external auth token from incoming request
   * When set, this token will be used instead of exchanging access key
   */
  setExternalAuthToken(token: string | null): void {
    this.externalAuthToken = token;
    if (token) {
      logger.info('External auth token set - will use for API requests');
    }
  }

  /**
   * Get auth token from external request
   * Uses the Authorization header passed from the incoming request
   */
  private async getAuthToken(): Promise<string> {
    if (!this.externalAuthToken) {
      throw new BrandlightApiError(
        'No authorization token provided. Authorization header is required.',
        401
      );
    }

    const tokenPreview = this.externalAuthToken.substring(0, 50) + '...';
    logger.info('Using external auth token from incoming request', { tokenPreview });
    return this.externalAuthToken;
  }

  /**
   * Make an authenticated request to the Brandlight API
   */
  private async request<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    endpoint: string,
    body?: unknown
  ): Promise<T> {
    const token = await this.getAuthToken();
    const url = `${this.baseUrl}${endpoint}`;
    const tokenPreview = token.substring(0, 30) + '...';

    logger.info(`Making ${method} request to ${url}`, { 
      tokenPreview,
      body: body ? JSON.stringify(body) : undefined 
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response: Response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'BrandlightReports-GCP/1.0',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorBody = await response.text();
        logger.error('API request failed', undefined, {
          statusCode: response.status,
          statusText: response.statusText,
          body: errorBody,
        });
        throw new BrandlightApiError(
          `API request failed: ${response.statusText}`,
          response.status,
          errorBody
        );
      }

      const data = await response.json() as T;
      logger.info(`Request to ${endpoint} successful`);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof BrandlightApiError) {
        throw error;
      }
      
      if ((error as Error).name === 'AbortError') {
        throw new BrandlightApiError('Request timeout', 408);
      }
      
      throw new BrandlightApiError(
        `Request failed: ${(error as Error).message}`,
        undefined,
        error
      );
    }
  }

  // ============================================================================
  // Download/Task Management
  // ============================================================================

  /**
   * Create a new download task
   * POST /api/v1/tenant/{tenantId}/download
   */
  async createDownload(
    tenantId: string,
    request: CreateDownloadRequest
  ): Promise<CreateDownloadResponse> {
    return this.request<CreateDownloadResponse>(
      'POST',
      `/api/v1/tenant/${tenantId}/download`,
      request
    );
  }

  /**
   * Update download task status
   * PUT /api/v1/tenant/{tenantId}/download/{downloadId}
   */
  async updateDownloadStatus(
    tenantId: string,
    downloadId: string,
    status: DownloadStatus,
    downloadUrl?: string,
    error?: string
  ): Promise<void> {
    const request: UpdateDownloadStatusRequest = {
      tenantId,
      brandId: '', // Will be filled by the API or we need to track it
      status,
      ...(downloadUrl && { downloadUrl }),
      ...(error && { error }),
    };

    await this.request<void>(
      'PUT',
      `/api/v1/tenant/${tenantId}/download/${downloadId}`,
      request
    );

    logger.info('Download status updated', { tenantId, downloadId, status });
  }

  /**
   * Update download with full request body
   * PUT /api/v1/tenant/{tenantId}/download/{downloadId}
   */
  async updateDownload(
    tenantId: string,
    downloadId: string,
    request: UpdateDownloadStatusRequest
  ): Promise<void> {
    await this.request<void>(
      'PUT',
      `/api/v1/tenant/${tenantId}/download/${downloadId}`,
      request
    );

    logger.info('Download updated', { tenantId, downloadId, status: request.status });
  }

  // ============================================================================
  // Data Export
  // ============================================================================

  /**
   * Fetch queries/report data for export
   * POST /api/v1/tenant/{tenantId}/queries/{brandId}/export
   * Note: Using POST with body because API requires tenantId in request body
   */
  async getExportData(
    tenantId: string,
    brandId: string,
    params?: Partial<ExportRequest>
  ): Promise<ExportResponse> {
    const endpoint = `/api/v1/tenant/${tenantId}/queries/${brandId}/export`;
    
    // Build request body with required tenantId and brandId
    const requestBody: Partial<ExportRequest> = {
      tenantId,
      brandId,
      engineIds: params?.engineIds || [],
      categoryIds: params?.categoryIds || [],
      personaIds: params?.personaIds || [],
      locationIds: params?.locationIds || [],
      start: params?.start ?? 0,
      amount: params?.amount ?? 100,
      ...params,
    };

    return this.request<ExportResponse>('POST', endpoint, requestBody);
  }

  /**
   * Fetch all export data with pagination (PARALLEL)
   * Handles large datasets by calculating all pages upfront and fetching them in parallel
   * Much faster than sequential fetching for large datasets
   */
  async getExportDataPaginated(
    tenantId: string,
    brandId: string,
    request: ExportRequest
  ): Promise<{ data: unknown[]; totalFetched: number; pages: number }> {
    const startOffset = request.start || 0;
    const totalAmount = request.amount || 100;
    const pageSize = 100;
    
    // Calculate number of pages needed
    const totalPages = Math.ceil(totalAmount / pageSize);

    logger.info('Starting PARALLEL paginated export', {
      tenantId,
      brandId,
      startOffset,
      totalAmount,
      pageSize,
      totalPages,
    });

    // Build all page request configurations (NOT promises - to defer execution)
    const pageConfigs: { pageIndex: number; request: ExportRequest }[] = [];
    
    for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
      const currentStart = startOffset + (pageIndex * pageSize);
      const remaining = totalAmount - (pageIndex * pageSize);
      const fetchAmount = Math.min(pageSize, remaining);
      
      const pageRequest: ExportRequest = {
        ...request,
        tenantId,
        brandId,
        start: currentStart,
        amount: fetchAmount,
      };

      logger.info(`Queuing page ${pageIndex + 1}/${totalPages}`, {
        start: currentStart,
        amount: fetchAmount,
      });

      pageConfigs.push({ pageIndex, request: pageRequest });
    }

    // Execute requests in batches of 15 to avoid overwhelming the server
    const BATCH_SIZE = 15;
    const totalBatches = Math.ceil(pageConfigs.length / BATCH_SIZE);
    
    logger.info(`Executing ${totalPages} pages in ${totalBatches} batches of ${BATCH_SIZE}...`);

    const allResults: { pageIndex: number; data: unknown[] }[] = [];
    
    for (let batchIndex = 0; batchIndex < totalBatches; batchIndex++) {
      const batchStart = batchIndex * BATCH_SIZE;
      const batchEnd = Math.min(batchStart + BATCH_SIZE, pageConfigs.length);
      const batchConfigs = pageConfigs.slice(batchStart, batchEnd);
      
      logger.info(`Processing batch ${batchIndex + 1}/${totalBatches} (${batchConfigs.length} requests)`);
      
      // Create and execute promises only now (deferred execution)
      const batchPromises = batchConfigs.map(({ pageIndex, request: pageRequest }) =>
        this.request<ExportResponse>(
          'POST',
          `/api/v1/tenant/${tenantId}/queries/${brandId}/export`,
          pageRequest
        ).then(response => {
          const pageData = response.data || response;
          logger.info(`Page ${pageIndex + 1} completed`, {
            itemsReceived: Array.isArray(pageData) ? pageData.length : 1,
          });
          return {
            pageIndex,
            data: Array.isArray(pageData) ? pageData : [pageData],
          };
        })
      );
      
      const batchResults = await Promise.all(batchPromises);
      allResults.push(...batchResults);
      
      logger.info(`Batch ${batchIndex + 1}/${totalBatches} completed`);
    }

    // Sort by page index to maintain order and combine data
    allResults.sort((a, b) => a.pageIndex - b.pageIndex);
    const allData: unknown[] = [];
    for (const result of allResults) {
      allData.push(...result.data);
    }

    logger.info('Batched parallel export complete', {
      totalFetched: allData.length,
      pages: totalPages,
      batches: totalBatches,
    });

    return {
      data: allData,
      totalFetched: allData.length,
      pages: totalPages,
    };
  }

  /**
   * Fetch queries/report data with POST body (for complex filters)
   * POST /api/v1/tenant/{tenantId}/queries/{brandId}/export
   */
  async getExportDataWithBody(
    tenantId: string,
    brandId: string,
    request: ExportRequest
  ): Promise<ExportResponse> {
    // Ensure tenantId and brandId are in the request body
    const requestBody: ExportRequest = {
      ...request,
      tenantId,
      brandId,
    };

    console.log('getExportDataWithBody', requestBody);

    return this.request<ExportResponse>(
      'POST',
      `/api/v1/tenant/${tenantId}/queries/${brandId}/export`,
      requestBody
    );
  }
}

// Singleton instance
let brandlightApiServiceInstance: BrandlightApiService | null = null;

export function getBrandlightApiService(): BrandlightApiService {
  if (!brandlightApiServiceInstance) {
    brandlightApiServiceInstance = new BrandlightApiService();
  }
  return brandlightApiServiceInstance;
}
