import { initializeApp, getApps } from 'firebase-admin/app';
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2';
import { StorageService } from './services/storage.service.js';
import { PDFService } from './services/pdf.service.js';
import { createLogger } from './utils/logger.js';
import { config } from './config/index.js';

// Export Brandlight integration endpoints
export { generateReport, brandlightHealthCheck } from './tasks/index.js';

const logger = createLogger('HTTPFunctions');

// Set global options for all functions
setGlobalOptions({
  region: config.functions.region,
  memory: config.functions.memory,
  timeoutSeconds: config.functions.timeout,
});

// Initialize Firebase Admin
if (!getApps().length) {
  initializeApp();
}

// Initialize services
const storageService = new StorageService();
const pdfService = new PDFService();

/**
 * Test function to generate a clean PDF with Puppeteer's default header/footer
 * This is for testing margins and page breaks
 */
export const demoTestReport = onRequest(
  {
    memory: '1GiB',
    timeoutSeconds: 60,
    cors: true,
  },
  async (req, res) => {
    try {
      logger.info('Generating clean test PDF report');

      // Generate clean test PDF
      const pdfBuffer = await pdfService.generateTestPDF({
        format: 'A4',
      });

      // Upload PDF to Firebase Storage
      const fileName = `test-report-${Date.now()}.pdf`;
      const downloadUrl = await storageService.uploadPDF(pdfBuffer, fileName, {
        reportType: 'Test',
        generatedAt: new Date().toISOString(),
        isDemo: 'true',
      });

      // Return the download URL
      res.json({
        success: true,
        reportType: 'Test',
        downloadUrl,
        fileName,
        message: 'Clean test PDF generated successfully with Puppeteer header/footer and margins',
      });

      logger.info('Test report uploaded successfully', {
        fileName,
        downloadUrl,
      });
    } catch (error) {
      logger.error('Failed to generate test report', error as Error);
      res.status(500).json({
        error: 'Failed to generate test report',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

/**
 * Test function to generate a clean Single Domain PDF with Puppeteer's default header/footer
 * This is for testing margins and page breaks for single domain reports
 */
export const demoTestSingleDomainReport = onRequest(
  {
    memory: '1GiB',
    timeoutSeconds: 60,
    cors: true,
  },
  async (req, res) => {
    try {
      logger.info('Generating clean test Single Domain PDF report');

      // Generate clean test Single Domain PDF
      const pdfBuffer = await pdfService.generateTestSingleDomainPDF({
        format: 'A4',
      });

      // Upload PDF to Firebase Storage
      const fileName = `test-single-domain-report-${Date.now()}.pdf`;
      const downloadUrl = await storageService.uploadPDF(pdfBuffer, fileName, {
        reportType: 'TestSingleDomain',
        generatedAt: new Date().toISOString(),
        isDemo: 'true',
      });

      // Return the download URL
      res.json({
        success: true,
        reportType: 'TestSingleDomain',
        downloadUrl,
        fileName,
        message: 'Clean test Single Domain PDF generated successfully with Puppeteer header/footer and margins',
      });

      logger.info('Test Single Domain report uploaded successfully', {
        fileName,
        downloadUrl,
      });
    } catch (error) {
      logger.error('Failed to generate test Single Domain report', error as Error);
      res.status(500).json({
        error: 'Failed to generate test Single Domain report',
        details: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);
