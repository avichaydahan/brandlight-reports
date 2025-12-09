import { onRequest } from 'firebase-functions/v2/https';
import { createLogger } from '../utils/logger.js';
import { getBrandlightApiService } from '../services/brandlight.service.js';
import { StorageService } from '../services/storage.service.js';
import { PDFService } from '../services/pdf.service.js';
import {
  GenerateReportRequestSchema,
  GenerateReportRequest,
  BrandlightApiError,
  DOWNLOAD_STATUS,
  REPORT_TYPE,
} from '../types/brandlight.js';

const logger = createLogger('ReportTasks');

/**
 * Generate Report Endpoint
 * 
 * This endpoint is called by Brandlight's server when a user requests a report.
 * 
 * Flow:
 * 1. Receive request with tenantId, brandId, downloadId, and required reportType
 * 2. Fetch report data from Brandlight's export API (with pagination for large datasets)
 * 3. Generate PDF report based on reportType
 * 4. Upload to Firebase Storage
 * 5. Update Brandlight with READY-FOR-DOWNLOAD status and download URL
 * 
 * Request body:
 * {
 *   "tenantId": "T2qIKkwHMJCRhvZ3MfvTYyJ3sHRv",
 *   "brandId": "f1882611-750b-4b0d-a1bd-ac780680a1ce",
 *   "downloadId": "f59a1d5e-bf42-43c4-b1c5-ee2e254bc658",
 *   "reportType": "json-export" | "partnership" | "single-domain", // REQUIRED
 *   "downloadType": "QUERIES", // optional
 *   "exportParams": { ... export parameters with pagination ... },
 *   "metadata": { ... optional metadata ... }
 * }
 * 
 * Report Types:
 * - "json-export": Renders raw JSON data as formatted text in PDF
 * - "partnership": Partnership domains report with charts and visualizations
 * - "single-domain": Single domain influence report
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
        
        // Check specifically for missing reportType
        const reportTypeError = parseResult.error.errors.find(e => e.path.includes('reportType'));
        if (reportTypeError) {
          res.status(400).json({
            error: 'Missing required field: reportType',
            message: `reportType is required. Valid values: ${Object.values(REPORT_TYPE).join(', ')}`,
            details: parseResult.error.errors,
          });
          return;
        }
        
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
        reportType: requestData.reportType,
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
      // Step 1: Update status to IN-PROGRESS
      logger.info('Updating status to IN-PROGRESS');
      // await brandlightApi.updateDownload(
      //   requestData.tenantId,
      //   requestData.downloadId,
      //   {
      //     tenantId: requestData.tenantId,
      //     brandId: requestData.brandId,
      //     status: DOWNLOAD_STATUS.IN_PROGRESS,
      //   }
      // );

      let pdfBuffer: Buffer;

      // Step 2 & 3: Fetch data and generate PDF based on report type
      switch (requestData.reportType) {
        case REPORT_TYPE.JSON_EXPORT: {
          // JSON Export: Fetch data with pagination and render as text
          if (!requestData.exportParams) {
            throw new Error('exportParams is required for json-export report type');
          }

          logger.info('Generating JSON Export report with pagination');
          
          const { data, totalFetched, pages } = await brandlightApi.getExportDataPaginated(
            requestData.tenantId,
            requestData.brandId,
            requestData.exportParams
          );

          logger.info('Export data fetched successfully', {
            totalFetched,
            pages,
          });

          // Generate JSON Export PDF
          pdfBuffer = await pdfService.generateJsonExportPDF(
            data,
            {
              title: requestData.metadata?.reportTitle || 'Data Export',
              tenantId: requestData.tenantId,
              brandId: requestData.brandId,
              generatedAt: new Date().toISOString(),
              totalItems: totalFetched,
              startDate: requestData.exportParams.startDate,
              endDate: requestData.exportParams.endDate,
            },
            { format: 'A4' }
          );
          break;
        }

        case REPORT_TYPE.PARTNERSHIP: {
          // Partnership Report: Use existing template with visualizations
          logger.info('Generating Partnership report');
          
          // Fetch data if exportParams provided, otherwise use defaults
          if (requestData.exportParams) {
            const reportData = await brandlightApi.getExportDataWithBody(
              requestData.tenantId,
              requestData.brandId,
              requestData.exportParams
            );
            logger.info('Partnership data fetched', {
              hasQueries: !!reportData.queries,
              queryCount: reportData.queries?.length || 0,
            });
          }

          // Generate Partnership PDF (currently uses mock data)
          pdfBuffer = await pdfService.generateTestPDF({ format: 'A4' });
          break;
        }

        case REPORT_TYPE.SINGLE_DOMAIN: {
          // Single Domain Report: Use existing template with domain-specific data
          logger.info('Generating Single Domain report');
          
          // Fetch data if exportParams provided
          if (requestData.exportParams) {
            const reportData = await brandlightApi.getExportDataWithBody(
              requestData.tenantId,
              requestData.brandId,
              requestData.exportParams
            );
            logger.info('Single Domain data fetched', {
              hasQueries: !!reportData.queries,
              queryCount: reportData.queries?.length || 0,
            });
          }

          // Generate Single Domain PDF (currently uses mock data)
          pdfBuffer = await pdfService.generateTestSingleDomainPDF({ format: 'A4' });
          break;
        }

        default: {
          throw new Error(`Unknown report type: ${requestData.reportType}. Valid types: ${Object.values(REPORT_TYPE).join(', ')}`);
        }
      }

      // Step 4: Upload PDF to Firebase Storage
      const fileName = `reports/${requestData.tenantId}/${requestData.brandId}/${requestData.downloadId}.pdf`;
      logger.info('Uploading PDF to storage', { fileName });
      
      const downloadUrl = await storageService.uploadPDF(pdfBuffer, fileName, {
        tenantId: requestData.tenantId,
        brandId: requestData.brandId,
        downloadId: requestData.downloadId,
        reportType: requestData.reportType,
        downloadType: requestData.downloadType || 'EXPORT',
        generatedAt: new Date().toISOString(),
      });

      // Step 5: Update Brandlight with READY-FOR-DOWNLOAD status
      logger.info('Updating status to READY-FOR-DOWNLOAD');
      // await brandlightApi.updateDownload(
      //   requestData.tenantId,
      //   requestData.downloadId,
      //   {
      //     tenantId: requestData.tenantId,
      //     brandId: requestData.brandId,
      //     status: DOWNLOAD_STATUS.READY_FOR_DOWNLOAD,
      //     downloadUrl,
      //   }
      // );

      // Return success response
      res.json({
        success: true,
        downloadId: requestData.downloadId,
        reportType: requestData.reportType,
        downloadUrl,
        message: 'Report generated successfully',
      });

      logger.info('Report generation completed successfully', {
        downloadId: requestData.downloadId,
        reportType: requestData.reportType,
        downloadUrl,
      });

    } catch (err) {
      const error = err as Error;
      logger.error('Failed to generate report', error);

      // Try to update status to ERROR
      try {
        // await brandlightApi.updateDownload(
        //   requestData.tenantId,
        //   requestData.downloadId,
        //   {
        //     tenantId: requestData.tenantId,
        //     brandId: requestData.brandId,
        //     status: DOWNLOAD_STATUS.ERROR,
        //     error: error.message || 'Unknown error',
        //   }
        // );
      } catch (updateError) {
        logger.error('Failed to update status to ERROR', updateError as Error);
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
