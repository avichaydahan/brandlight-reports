import { Request, Response } from 'express';
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
 * 4. Upload to Google Cloud Storage
 * 5. Update Brandlight with READY-FOR-DOWNLOAD status and download URL
 */
export async function generateReport(req: Request, res: Response): Promise<void> {
  const brandlightApi = getBrandlightApiService();
  const storageService = new StorageService();
  const pdfService = new PDFService();

  // Extract Authorization header and pass it to Brandlight API service
  const authHeader = req.headers.authorization;
  if (authHeader) {
    // Remove 'Bearer ' prefix if present, then set the token
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    brandlightApi.setExternalAuthToken(token);
    logger.info('Using Authorization header from incoming request');
  }

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
    await brandlightApi.updateDownload(
      requestData.tenantId,
      requestData.downloadId,
      {
        tenantId: requestData.tenantId,
        brandId: requestData.brandId,
        status: DOWNLOAD_STATUS.IN_PROGRESS,
      }
    );

    let fileBuffer: Buffer;
    let fileName: string;
    let isJsonExport = false;

    // Step 2 & 3: Fetch data and generate file based on report type
    switch (requestData.reportType) {
      case REPORT_TYPE.JSON_EXPORT: {
        // JSON Export: Fetch data with pagination and return as JSON file
        if (!requestData.exportParams) {
          throw new Error('exportParams is required for json-export report type');
        }

        logger.info('Generating JSON Export with pagination');
        isJsonExport = true;
        
        const { data, totalFetched, pages } = await brandlightApi.getExportDataPaginated(
          requestData.tenantId,
          requestData.brandId,
          requestData.exportParams
        );

        logger.info('Export data fetched successfully', {
          totalFetched,
          pages,
        });

        // Create JSON export object with metadata
        const jsonExport = {
          metadata: {
            title: requestData.metadata?.reportTitle || 'Data Export',
            tenantId: requestData.tenantId,
            brandId: requestData.brandId,
            generatedAt: new Date().toISOString(),
            totalItems: totalFetched,
            startDate: requestData.exportParams.startDate,
            endDate: requestData.exportParams.endDate,
          },
          data,
        };

        // Generate filename and upload JSON
        fileName = storageService.generateJsonFileName(
          requestData.downloadId,
          requestData.reportType
        );

        logger.info('Uploading JSON to GCS', { fileName });

        const { url: downloadUrl, path: storagePath } = await storageService.uploadJSON(jsonExport, fileName, requestData.tenantId, {
          tenantId: requestData.tenantId,
          brandId: requestData.brandId,
          reportType: requestData.reportType,
          downloadId: requestData.downloadId,
          generatedAt: new Date().toISOString(),
        });

        logger.info('JSON uploaded successfully', { downloadUrl, storagePath });

        // Update Brandlight with READY-FOR-DOWNLOAD status for JSON export
        logger.info('Updating status to READY-FOR-DOWNLOAD for JSON export');
        await brandlightApi.updateDownload(
          requestData.tenantId,
          requestData.downloadId,
          {
            tenantId: requestData.tenantId,
            brandId: requestData.brandId,
            status: DOWNLOAD_STATUS.READY_FOR_DOWNLOAD,
            path: storagePath,
          }
        );

        // Return success response for JSON export
        res.json({
          success: true,
          downloadId: requestData.downloadId,
          reportType: requestData.reportType,
          downloadUrl,
          fileName,
          status: DOWNLOAD_STATUS.READY_FOR_DOWNLOAD,
        });
        return;
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
        fileBuffer = await pdfService.generateTestPDF({ format: 'A4' });
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
        fileBuffer = await pdfService.generateTestSingleDomainPDF({ format: 'A4' });
        break;
      }

      default:
        throw new Error(`Unknown report type: ${requestData.reportType}`);
    }

    // Step 4: Upload PDF to Google Cloud Storage
    fileName = storageService.generateFileName(
      requestData.downloadId,
      requestData.reportType
    );
    
    logger.info('Uploading PDF to GCS', { fileName });
    
    const { url: downloadUrl, path: storagePath } = await storageService.uploadPDF(fileBuffer, fileName, requestData.tenantId, {
      tenantId: requestData.tenantId,
      brandId: requestData.brandId,
      reportType: requestData.reportType,
      downloadId: requestData.downloadId,
      generatedAt: new Date().toISOString(),
    });

    logger.info('PDF uploaded successfully', { downloadUrl, storagePath });

    // Step 5: Update Brandlight with READY-FOR-DOWNLOAD status
    logger.info('Updating status to READY-FOR-DOWNLOAD');
    await brandlightApi.updateDownload(
      requestData.tenantId,
      requestData.downloadId,
      {
        tenantId: requestData.tenantId,
        brandId: requestData.brandId,
        status: DOWNLOAD_STATUS.READY_FOR_DOWNLOAD,
        path: storagePath,
      }
    );

    // Return success response
    res.json({
      success: true,
      downloadId: requestData.downloadId,
      reportType: requestData.reportType,
      downloadUrl,
      fileName,
      status: DOWNLOAD_STATUS.READY_FOR_DOWNLOAD,
    });

    // Cleanup PDF service
    await pdfService.cleanup();

  } catch (err) {
    const error = err as Error;
    logger.error('Failed to generate report', error);

    // Try to update Brandlight with ERROR status
    if (requestData) {
      try {
        await brandlightApi.updateDownload(
          requestData.tenantId,
          requestData.downloadId,
          {
            tenantId: requestData.tenantId,
            brandId: requestData.brandId,
            status: DOWNLOAD_STATUS.ERROR,
            error: error.message,
          }
        );
      } catch (updateError) {
        logger.error('Failed to update error status', updateError as Error);
      }
    }

    res.status(500).json({
      error: 'Failed to generate report',
      details: error.message || 'Unknown error',
    });
  }
}
