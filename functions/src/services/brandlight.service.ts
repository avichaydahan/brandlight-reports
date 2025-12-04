import fetch, { Response } from 'node-fetch';
import DescopeClient from '@descope/node-sdk';
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
 * Uses Descope for authentication - exchanges access key for JWT
 */
export class BrandlightApiService {
  private baseUrl: string;
  private accessKey: string;
  private descopeProjectId: string;
  private jwt: string | null = null;
  private jwtExpiry: number | null = null;
  private timeout: number;
  private descopeClient: ReturnType<typeof DescopeClient> | null = null;

  constructor() {
    this.baseUrl = brandlightConfig.apiBaseUrl;
    this.accessKey = brandlightConfig.accessKey;
    this.descopeProjectId = brandlightConfig.descopeProjectId;
    this.timeout = brandlightConfig.timeout;
    
    // Initialize Descope client if project ID is configured
    if (this.descopeProjectId) {
      try {
        this.descopeClient = DescopeClient({ projectId: this.descopeProjectId });
        logger.info('Descope client initialized', { projectId: this.descopeProjectId });
      } catch (error) {
        logger.error('Failed to initialize Descope client', error as Error);
      }
    }
  }

  /**
   * Get or refresh JWT token using Descope
   * Exchanges the access key for a fresh JWT token
   */
  private async getAuthToken(): Promise<string> {
    // Check if we have a valid JWT (with 1 minute buffer)
    if (this.jwt && this.jwtExpiry && Date.now() < this.jwtExpiry - 60000) {
      logger.info('Using cached JWT token', { 
        expiresAt: new Date(this.jwtExpiry).toISOString() 
      });
      return this.jwt;
    }

    // Exchange access key for JWT using Descope
    if (this.descopeClient && this.accessKey) {
      try {
        logger.info('Exchanging access key for JWT via Descope');
        const authInfo = await this.descopeClient.exchangeAccessKey(this.accessKey);
        
        // authInfo contains: jwt, token (parsed), cookies
        if (authInfo && authInfo.jwt) {
          this.jwt = authInfo.jwt;
          
          // Get expiry from parsed token
          if (authInfo.token?.exp) {
            this.jwtExpiry = authInfo.token.exp * 1000;
            logger.info('JWT obtained successfully', { 
              expiresAt: new Date(this.jwtExpiry).toISOString() 
            });
          } else {
            // Default 10 minutes if no exp in token
            this.jwtExpiry = Date.now() + 10 * 60 * 1000;
          }
          
          return this.jwt;
        } else {
          throw new Error('Descope exchange returned no JWT');
        }
      } catch (error) {
        logger.error('Failed to exchange access key for JWT', error as Error);
        throw new BrandlightApiError(
          `Authentication failed: ${(error as Error).message}`,
          401
        );
      }
    }

    // Fallback: If access key looks like a JWT, use it directly
    if (this.accessKey && this.accessKey.split('.').length === 3) {
      logger.warn('Using access key directly as JWT (no Descope client)');
      this.jwt = this.accessKey;
      
      // Parse expiry
      try {
        const parts = this.accessKey.split('.');
        const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        if (payload.exp) {
          this.jwtExpiry = payload.exp * 1000;
        }
      } catch {
        this.jwtExpiry = Date.now() + 10 * 60 * 1000; // Default 10 minutes
      }
      
      return this.jwt;
    }

    throw new BrandlightApiError('No valid authentication method available', 401);
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

    logger.info(`Making ${method} request to ${endpoint}`);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response: Response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'BrandlightReports/1.0',
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
   * GET /api/v1/tenant/{tenantId}/queries/{brandId}/export
   */
  async getExportData(
    tenantId: string,
    brandId: string,
    params?: Partial<ExportRequest>
  ): Promise<ExportResponse> {
    // Build query string from params if provided
    let endpoint = `/api/v1/tenant/${tenantId}/queries/${brandId}/export`;
    
    if (params) {
      const queryParams = new URLSearchParams();
      
      if (params.start !== undefined) {
        queryParams.append('start', params.start.toString());
      }
      if (params.amount !== undefined) {
        queryParams.append('amount', params.amount.toString());
      }
      if (params.engineIds?.length) {
        queryParams.append('engineIds', params.engineIds.join(','));
      }
      if (params.categoryIds?.length) {
        queryParams.append('categoryIds', params.categoryIds.join(','));
      }
      if (params.personaIds?.length) {
        queryParams.append('personaIds', params.personaIds.join(','));
      }
      if (params.locationIds?.length) {
        queryParams.append('locationIds', params.locationIds.join(','));
      }

      const queryString = queryParams.toString();
      if (queryString) {
        endpoint += `?${queryString}`;
      }
    }

    return this.request<ExportResponse>('GET', endpoint);
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
    return this.request<ExportResponse>(
      'POST',
      `/api/v1/tenant/${tenantId}/queries/${brandId}/export`,
      request
    );
  }

  // ============================================================================
  // Utility Methods
  // ============================================================================

  /**
   * Check if the API is properly configured and reachable
   */
  async healthCheck(): Promise<{ isHealthy: boolean; error?: string; debug?: any }> {
    const accessKeyPreview = this.accessKey 
      ? `${this.accessKey.substring(0, 20)}... (length: ${this.accessKey.length})`
      : 'EMPTY';
    
    logger.info('Health check starting', { 
      accessKeyPreview,
      hasDescopeClient: !!this.descopeClient,
      descopeProjectId: this.descopeProjectId || 'NOT SET'
    });

    // Check if access key is configured
    if (!this.accessKey) {
      return { 
        isHealthy: false, 
        error: 'BRANDLIGHT_ACCESS_KEY is not configured',
        debug: { accessKeyPreview, hasDescopeClient: !!this.descopeClient }
      };
    }

    // Check if Descope is configured
    if (!this.descopeClient) {
      return { 
        isHealthy: false, 
        error: 'DESCOPE_PROJECT_ID is not configured - cannot exchange access key for JWT',
        debug: { accessKeyPreview, descopeProjectId: this.descopeProjectId || 'NOT SET' }
      };
    }

    // Try to exchange access key for JWT
    try {
      const token = await this.getAuthToken();
      
      return { 
        isHealthy: true, 
        debug: { 
          accessKeyPreview,
          hasDescopeClient: true,
          jwtObtained: !!token,
          tokenExpiry: this.jwtExpiry ? new Date(this.jwtExpiry).toISOString() : null
        } 
      };
    } catch (error) {
      return { 
        isHealthy: false, 
        error: `Failed to obtain JWT: ${(error as Error).message}`,
        debug: { accessKeyPreview, hasDescopeClient: !!this.descopeClient }
      };
    }
  }

  /**
   * Check if access key is configured
   */
  isConfigured(): boolean {
    return !!this.accessKey && this.accessKey.length > 0;
  }

  /**
   * Check if the current JWT is still valid
   */
  isTokenValid(): boolean {
    if (!this.jwt || !this.jwtExpiry) {
      return false;
    }
    return Date.now() < this.jwtExpiry - 60000; // 1 minute buffer
  }

  /**
   * Get token expiry time
   */
  getTokenExpiry(): Date | null {
    return this.jwtExpiry ? new Date(this.jwtExpiry) : null;
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
