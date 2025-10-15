import { onTaskDispatched } from 'firebase-functions/v2/tasks';
import { onRequest } from 'firebase-functions/v2/https';
import { FirestoreService } from './services/firestore.service.js';
import { StorageService } from './services/storage.service.js';
import { PDFService } from './services/pdf.service.js';
import { ReportData } from './types/index.js';
import { createLogger } from './utils/logger.js';
import { config } from './config/index.js';
import { generateMockData } from './data.js';

const logger = createLogger('BackgroundTasks');

// Initialize services
const firestoreService = new FirestoreService();
const storageService = new StorageService();
const pdfService = new PDFService();

/**
 * Background task function for processing PDF report generation
 * This runs as an HTTP function that can be called for background processing
 */
export const processReportJob = onRequest(
  {
    memory: '4GiB',
    timeoutSeconds: 540, // 9 minutes for long-running reports
    region: config.functions.region,
  },
  async (req, res) => {
    try {
      // Validate request
      if (req.method !== 'POST') {
        res.status(405).json({ error: 'POST method required' });
        return;
      }

      const { jobId, request } = req.body;

      if (!jobId || !request) {
        logger.error('Missing jobId or request in task data');
        res.status(400).json({ error: 'Missing jobId or request data' });
        return;
      }

      logger.info('Starting background report processing', {
        jobId,
        reportType: request.reportType,
      });

      // Update job status to processing
      await firestoreService.updateJob(jobId, {
        status: 'processing',
        progress: 0,
      });

      // Initialize PDF service
      await pdfService.initialize();

      // Generate report data (use provided data or generate mock data)
      const reportData: ReportData =
        request.data || (await generateMockReportData(request.reportType));

      // Update progress
      await firestoreService.updateJob(jobId, { progress: 25 });

      // Generate PDF
      const pdfBuffer = await pdfService.generateReportPDF(
        request.reportType,
        reportData,
        {
          format: request.options?.format,
          orientation: request.options?.orientation,
          quality: request.options?.quality,
          includeCharts: true,
          watermark: 'BRANDLIGHT REPORT',
        }
      );

      // Update progress
      await firestoreService.updateJob(jobId, { progress: 75 });

      // Upload to Storage
      const fileName = storageService.generateFileName(
        jobId,
        request.reportType
      );
      const downloadUrl = await storageService.uploadPDF(pdfBuffer, fileName, {
        jobId,
        reportType: request.reportType,
        generatedAt: new Date().toISOString(),
      });

      // Update progress
      await firestoreService.updateJob(jobId, { progress: 90 });

      // Mark job as completed
      await firestoreService.updateJob(jobId, {
        status: 'completed',
        progress: 100,
        downloadUrl,
      });

      // Cleanup PDF service
      await pdfService.cleanup();

      logger.info('Background report processing completed successfully', {
        jobId,
        downloadUrl,
      });

      res.status(200).json({
        success: true,
        jobId,
        downloadUrl,
        message: 'Report generated successfully',
      });
    } catch (error) {
      logger.error('Background report processing failed', error as Error);

      // Try to update job status to failed
      try {
        const { jobId } = req.body;
        if (jobId) {
          await firestoreService.updateJob(jobId, {
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      } catch (updateError) {
        logger.error(
          'Failed to update job status after error',
          updateError as Error
        );
      }

      // Cleanup PDF service
      try {
        await pdfService.cleanup();
      } catch (cleanupError) {
        logger.error('Failed to cleanup PDF service', cleanupError as Error);
      }

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * Alternative task function using Firebase Tasks (for future use)
 */
export const processReportTaskQueue = onTaskDispatched(
  {
    memory: '4GiB',
    timeoutSeconds: 540,
    region: config.functions.region,
  },
  async (req) => {
    // This can be used when Firebase Tasks are preferred over HTTP functions
    // Implementation would be similar to the HTTP version above
    logger.info('Processing task from queue', { data: req.data });

    // For now, we'll use the HTTP approach for better error handling and monitoring
    throw new Error(
      'Task queue processing not implemented yet. Use HTTP endpoint instead.'
    );
  }
);

// Helper functions

async function generateMockReportData(reportType: string): Promise<ReportData> {
  const mockData = await generateMockData(
    reportType as 'A' | 'B' | 'C' | 'D' | 'Content' | 'Partnership'
  );

  return {
    title: `Professional ${reportType} Report`,
    subtitle: 'Generated by BrandLight Advanced PDF Service',
    author: 'System Administrator',
    date: new Date().toISOString(),
    data: mockData,
  };
}
