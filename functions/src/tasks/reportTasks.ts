import { onRequest } from 'firebase-functions/v2/https';
import { createLogger } from '../utils/logger.js';
import { getBrandlightApiService } from '../services/brandlight.service.js';
import { StorageService } from '../services/storage.service.js';
import { PDFService } from '../services/pdf.service.js';
import {
  GenerateReportRequestSchema,
  GenerateReportRequest,
  BrandlightApiError,
  ExportResponse,
} from '../types/brandlight.js';
import { mockSingleDomainData } from '../dev/mockData.js';

const logger = createLogger('ReportTasks');

/**
 * Generate Report Endpoint
 * 
 * This endpoint is called by Brandlight's server when a user requests a report.
 * 
 * Flow:
 * 1. Receive request with tenantId, brandId, downloadId
 * 2. Fetch report data from Brandlight's export API
 * 3. Generate PDF report
 * 4. Upload to Firebase Storage
 * 5. Update Brandlight with READY-FOR-DOWNLOAD status and download URL
 * 
 * Request body:
 * {
 *   "tenantId": "T2qIKkwHMJCRhvZ3MfvTYyJ3sHRv",
 *   "brandId": "f1882611-750b-4b0d-a1bd-ac780680a1ce",
 *   "downloadId": "f59a1d5e-bf42-43c4-b1c5-ee2e254bc658",
 *   "downloadType": "QUERIES",
 *   "exportParams": { ... optional filter parameters ... },
 *   "metadata": { ... optional metadata ... }
 * }
 */
export const generateReport = onRequest(
  {
    memory: '2GiB',
    timeoutSeconds: 540, // 9 minutes for long reports
    cors: true,
  },
  async (req, res) => {
    const brandlightApi = getBrandlightApiService();
    const storageService = new StorageService();
    const pdfService = new PDFService();

    // Only accept POST requests
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }

    let requestData: GenerateReportRequest;

    try {
      // Validate request body
      const parseResult = GenerateReportRequestSchema.safeParse(req.body);
      
      if (!parseResult.success) {
        logger.error('Invalid request body', undefined, { errors: parseResult.error.errors });
        res.status(400).json({
          error: 'Invalid request body',
          details: parseResult.error.errors,
        });
        return;
      }

      requestData = parseResult.data;
      
      logger.info('Received report generation request', {
        tenantId: requestData.tenantId,
        brandId: requestData.brandId,
        downloadId: requestData.downloadId,
      });

    } catch (err) {
      const error = err as Error;
      logger.error('Failed to parse request', error);
      res.status(400).json({
        error: 'Failed to parse request',
        details: error.message || 'Unknown error',
      });
      return;
    }

    try {
      // Step 1: Update status to PROCESSING
      logger.info('Updating status to PROCESSING');
      await brandlightApi.updateDownload(
        requestData.tenantId,
        requestData.downloadId,
        {
          tenantId: requestData.tenantId,
          brandId: requestData.brandId,
          status: 'PROCESSING',
        }
      );

      // Step 2: Fetch data from Brandlight API
      logger.info('Fetching export data from Brandlight API');
      let reportData: ExportResponse | null = null;
      
      try {
        if (requestData.exportParams) {
          reportData = await brandlightApi.getExportDataWithBody(
            requestData.tenantId,
            requestData.brandId,
            requestData.exportParams
          );
        } else {
          reportData = await brandlightApi.getExportData(
            requestData.tenantId,
            requestData.brandId
          );
        }
        
        logger.info('Export data fetched successfully', {
          hasQueries: !!reportData.queries,
          queryCount: reportData.queries?.length || 0,
        });
      } catch (apiError) {
        logger.warn('Failed to fetch export data, using mock data for now', apiError as Error);
        // For now, we'll use mock data if the API fails
        // TODO: Remove this once the API is fully integrated
        reportData = null;
      }

      // Step 3: Transform data and generate PDF
      logger.info('Generating PDF report');
      
      // TODO: Transform Brandlight data to our report format
      // For now, we use mock data until we know the exact data structure
      const transformedData = reportData 
        ? transformBrandlightData(reportData, requestData.metadata)
        : mockSingleDomainData;

      const pdfBuffer = await pdfService.generateTestSingleDomainPDF({
        format: 'A4',
      });

      // Step 4: Upload PDF to Firebase Storage
      const fileName = `reports/${requestData.tenantId}/${requestData.brandId}/${requestData.downloadId}.pdf`;
      logger.info('Uploading PDF to storage', { fileName });
      
      const downloadUrl = await storageService.uploadPDF(pdfBuffer, fileName, {
        tenantId: requestData.tenantId,
        brandId: requestData.brandId,
        downloadId: requestData.downloadId,
        reportType: requestData.downloadType || 'QUERIES',
        generatedAt: new Date().toISOString(),
      });

      // Step 5: Update Brandlight with READY-FOR-DOWNLOAD status
      logger.info('Updating status to READY-FOR-DOWNLOAD');
      await brandlightApi.updateDownload(
        requestData.tenantId,
        requestData.downloadId,
        {
          tenantId: requestData.tenantId,
          brandId: requestData.brandId,
          status: 'READY-FOR-DOWNLOAD',
          downloadUrl,
        }
      );

      // Return success response
      res.json({
        success: true,
        downloadId: requestData.downloadId,
        downloadUrl,
        message: 'Report generated successfully',
      });

      logger.info('Report generation completed successfully', {
        downloadId: requestData.downloadId,
        downloadUrl,
      });

    } catch (err) {
      const error = err as Error;
      logger.error('Failed to generate report', error);

      // Try to update status to FAILED
      try {
        await brandlightApi.updateDownload(
          requestData.tenantId,
          requestData.downloadId,
          {
            tenantId: requestData.tenantId,
            brandId: requestData.brandId,
            status: 'FAILED',
            error: error.message || 'Unknown error',
          }
        );
      } catch (updateError) {
        logger.error('Failed to update status to FAILED', updateError as Error);
      }

      // Return error response
      const statusCode = error instanceof BrandlightApiError ? (error as BrandlightApiError).statusCode || 500 : 500;
      res.status(statusCode).json({
        error: 'Failed to generate report',
        details: error.message || 'Unknown error',
      });
    }
  }
);

/**
 * Transform Brandlight export data to our report format
 * This is a placeholder - needs to be updated based on actual data structure
 */
function transformBrandlightData(
  exportData: ExportResponse,
  metadata?: GenerateReportRequest['metadata']
) {
  // TODO: Implement actual transformation once we know the data structure
  // For now, return mock data structure
  
  logger.info('Transforming Brandlight data', {
    hasQueries: !!exportData.queries,
    hasEngines: !!exportData.engines,
    hasCategories: !!exportData.categories,
    metadata,
  });

  // Return the mock data for now
  // This will be replaced with actual transformation logic
  return mockSingleDomainData;
}

/**
 * Health check endpoint for Brandlight integration
 */
export const brandlightHealthCheck = onRequest(
  {
    memory: '256MiB',
    timeoutSeconds: 30,
    cors: true,
  },
  async (req, res) => {
    const brandlightApi = getBrandlightApiService();

    try {
      const healthResult = await brandlightApi.healthCheck();
      const tokenExpiry = brandlightApi.getTokenExpiry();
      
      logger.info('Brandlight API health check', { 
        isHealthy: healthResult.isHealthy, 
        error: healthResult.error,
        tokenExpiry: tokenExpiry?.toISOString(),
        isConfigured: brandlightApi.isConfigured(),
      });

      if (!healthResult.isHealthy) {
        res.status(503).json({
          status: 'unhealthy',
          service: 'brandlight-reports',
          error: healthResult.error,
          debug: healthResult.debug,
          brandlightApi: {
            configured: brandlightApi.isConfigured(),
            connected: false,
            tokenValid: false,
            tokenExpiry: null,
          },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      res.json({
        status: 'healthy',
        service: 'brandlight-reports',
        brandlightApi: {
          configured: brandlightApi.isConfigured(),
          connected: true,
          tokenValid: brandlightApi.isTokenValid(),
          tokenExpiry: tokenExpiry?.toISOString() || null,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      const error = err as Error;
      logger.error('Health check failed', error);
      res.status(503).json({
        status: 'unhealthy',
        error: error.message || 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }
);
