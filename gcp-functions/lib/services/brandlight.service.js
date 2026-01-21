import fetch from 'node-fetch';
import { createLogger } from '../utils/logger.js';
import { brandlightConfig } from '../config/index.js';
import { BrandlightApiError, } from '../types/brandlight.js';
const logger = createLogger('BrandlightApiService');
/**
 * Brandlight API Service
 * Handles all communication with the Brandlight API
 * Authentication is done by passing the Authorization header from incoming requests
 */
export class BrandlightApiService {
    baseUrl;
    timeout;
    externalAuthToken = null;
    constructor() {
        this.baseUrl = brandlightConfig.apiBaseUrl;
        this.timeout = brandlightConfig.timeout;
    }
    /**
     * Set external auth token from incoming request
     * When set, this token will be used instead of exchanging access key
     */
    setExternalAuthToken(token) {
        this.externalAuthToken = token;
        if (token) {
            logger.info('External auth token set - will use for API requests');
        }
    }
    /**
     * Get auth token from external request
     * Uses the Authorization header passed from the incoming request
     */
    async getAuthToken() {
        if (!this.externalAuthToken) {
            throw new BrandlightApiError('No authorization token provided. Authorization header is required.', 401);
        }
        const tokenPreview = this.externalAuthToken.substring(0, 50) + '...';
        logger.info('Using external auth token from incoming request', { tokenPreview });
        return this.externalAuthToken;
    }
    /**
     * Make an authenticated request to the Brandlight API
     */
    async request(method, endpoint, body) {
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
            const response = await fetch(url, {
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
                throw new BrandlightApiError(`API request failed: ${response.statusText}`, response.status, errorBody);
            }
            const data = await response.json();
            logger.info(`Request to ${endpoint} successful`);
            return data;
        }
        catch (error) {
            clearTimeout(timeoutId);
            if (error instanceof BrandlightApiError) {
                throw error;
            }
            if (error.name === 'AbortError') {
                throw new BrandlightApiError('Request timeout', 408);
            }
            throw new BrandlightApiError(`Request failed: ${error.message}`, undefined, error);
        }
    }
    // ============================================================================
    // Download/Task Management
    // ============================================================================
    /**
     * Create a new download task
     * POST /api/v1/tenant/{tenantId}/download
     */
    async createDownload(tenantId, request) {
        return this.request('POST', `/api/v1/tenant/${tenantId}/download`, request);
    }
    /**
     * Update download task status
     * PUT /api/v1/tenant/{tenantId}/download/{downloadId}
     */
    async updateDownloadStatus(tenantId, downloadId, status, downloadUrl, error) {
        const request = {
            tenantId,
            brandId: '', // Will be filled by the API or we need to track it
            status,
            ...(downloadUrl && { downloadUrl }),
            ...(error && { error }),
        };
        await this.request('PUT', `/api/v1/tenant/${tenantId}/download/${downloadId}`, request);
        logger.info('Download status updated', { tenantId, downloadId, status });
    }
    /**
     * Update download with full request body
     * PUT /api/v1/tenant/{tenantId}/download/{downloadId}
     */
    async updateDownload(tenantId, downloadId, request) {
        await this.request('PUT', `/api/v1/tenant/${tenantId}/download/${downloadId}`, request);
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
    async getExportData(tenantId, brandId, params) {
        const endpoint = `/api/v1/tenant/${tenantId}/queries/${brandId}/export`;
        // Build request body with required tenantId and brandId
        const requestBody = {
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
        return this.request('POST', endpoint, requestBody);
    }
    /**
     * Fetch all export data with pagination (PARALLEL)
     * Handles large datasets by calculating all pages upfront and fetching them in parallel
     * Much faster than sequential fetching for large datasets
     */
    async getExportDataPaginated(tenantId, brandId, request) {
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
        // Build all page requests
        const pageRequests = [];
        for (let pageIndex = 0; pageIndex < totalPages; pageIndex++) {
            const currentStart = startOffset + (pageIndex * pageSize);
            const remaining = totalAmount - (pageIndex * pageSize);
            const fetchAmount = Math.min(pageSize, remaining);
            const pageRequest = {
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
            // Create promise for this page
            const pagePromise = this.request('POST', `/api/v1/tenant/${tenantId}/queries/${brandId}/export`, pageRequest).then(response => {
                const pageData = response.data || response;
                logger.info(`Page ${pageIndex + 1} completed`, {
                    itemsReceived: Array.isArray(pageData) ? pageData.length : 1,
                });
                return {
                    pageIndex,
                    data: Array.isArray(pageData) ? pageData : [pageData],
                };
            });
            pageRequests.push(pagePromise);
        }
        logger.info(`Executing ${totalPages} pages in parallel...`);
        // Execute all requests in parallel
        const results = await Promise.all(pageRequests);
        // Sort by page index to maintain order and combine data
        results.sort((a, b) => a.pageIndex - b.pageIndex);
        const allData = [];
        for (const result of results) {
            allData.push(...result.data);
        }
        logger.info('Parallel paginated export complete', {
            totalFetched: allData.length,
            pages: totalPages,
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
    async getExportDataWithBody(tenantId, brandId, request) {
        // Ensure tenantId and brandId are in the request body
        const requestBody = {
            ...request,
            tenantId,
            brandId,
        };
        console.log('getExportDataWithBody', requestBody);
        return this.request('POST', `/api/v1/tenant/${tenantId}/queries/${brandId}/export`, requestBody);
    }
}
// Singleton instance
let brandlightApiServiceInstance = null;
export function getBrandlightApiService() {
    if (!brandlightApiServiceInstance) {
        brandlightApiServiceInstance = new BrandlightApiService();
    }
    return brandlightApiServiceInstance;
}
