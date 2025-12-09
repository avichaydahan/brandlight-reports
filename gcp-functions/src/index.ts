import { http } from '@google-cloud/functions-framework';
import { Request, Response } from 'express';
import { StorageService } from './services/storage.service.js';
import { PDFService } from './services/pdf.service.js';
import { createLogger } from './utils/logger.js';
import { generateReport, brandlightHealthCheck } from './tasks/index.js';

const logger = createLogger('HTTPFunctions');

// Initialize services
const storageService = new StorageService();
const pdfService = new PDFService();

/**
 * Test function to generate a clean PDF with Puppeteer's default header/footer
 * This is for testing margins and page breaks
 */
http('demoTestReport', async (req: Request, res: Response) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    logger.info('Generating clean test PDF report');

    // Generate clean test PDF
    const pdfBuffer = await pdfService.generateTestPDF({
      format: 'A4',
    });

    // Upload PDF to Google Cloud Storage
    const fileName = `test-report-${Date.now()}.pdf`;
    const downloadUrl = await storageService.uploadPDF(pdfBuffer, fileName, {
      reportType: 'Test',
      generatedAt: new Date().toISOString(),
      isDemo: 'true',
    });

    // Cleanup PDF service
    await pdfService.cleanup();

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
});

/**
 * Test function to generate a clean Single Domain PDF with Puppeteer's default header/footer
 * This is for testing margins and page breaks for single domain reports
 */
http('demoTestSingleDomainReport', async (req: Request, res: Response) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  try {
    logger.info('Generating clean test Single Domain PDF report');

    // Generate clean test Single Domain PDF
    const pdfBuffer = await pdfService.generateTestSingleDomainPDF({
      format: 'A4',
    });

    // Upload PDF to Google Cloud Storage
    const fileName = `test-single-domain-report-${Date.now()}.pdf`;
    const downloadUrl = await storageService.uploadPDF(pdfBuffer, fileName, {
      reportType: 'TestSingleDomain',
      generatedAt: new Date().toISOString(),
      isDemo: 'true',
    });

    // Cleanup PDF service
    await pdfService.cleanup();

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
});

/**
 * Generate Report - Main endpoint called by Brandlight
 */
http('generateReport', async (req: Request, res: Response) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  await generateReport(req, res);
});

/**
 * Health Check endpoint
 */
http('brandlightHealthCheck', async (req: Request, res: Response) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  await brandlightHealthCheck(req, res);
});
