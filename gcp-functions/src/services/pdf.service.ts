import puppeteer, { Browser } from 'puppeteer';
import { PDFDocument } from 'pdf-lib';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('PDFService');

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PDFOptions {
  format?: 'A4' | 'A3' | 'Letter';
}

export class PDFService {
  private browser: Browser | null = null;

  private async initialize(): Promise<void> {
    try {
      logger.info('Initializing PDF service');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-first-run',
          '--no-zygote',
          '--disable-extensions',
        ],
      });
      logger.info('PDF service initialized successfully');
    } catch (error) {
      logger.error('Failed to initialize PDF service', error as Error);
      throw error;
    }
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('PDF service cleaned up');
    }
  }

  /**
   * Generate a test PDF with cover page (no header/footer) + main content (with header/footer)
   */
  async generateTestPDF(options: PDFOptions = {}): Promise<Buffer> {
    try {
      logger.info('Generating test PDF with cover page');

      if (!this.browser) {
        await this.initialize();
      }

      const [template, { mockPartnershipData }, { Cover }] = await Promise.all([
        import(path.join(__dirname, '..', 'templates', 'templateTestPartnership.js')),
        import(path.join(__dirname, '..', 'dev', 'mockData.js')),
        import(path.join(__dirname, '..', 'components', 'cover.js')),
      ]);

      const [coverPdf, mainPdf] = await Promise.all([
        this.generateCoverPDF(Cover, mockPartnershipData, options),
        this.generatePartnershipMainContentPDF(template.generateTemplate(mockPartnershipData), options),
      ]);

      const mergedPdf = await this.mergePDFs(coverPdf, mainPdf, 'Partnership Domains Report');

      logger.info('Test PDF generated successfully');
      return mergedPdf;
    } catch (error) {
      logger.error('Failed to generate test PDF', error as Error);
      throw error;
    }
  }

  /**
   * Generate a test PDF for Single Domain with cover page (no header/footer) + main content (with header/footer)
   */
  async generateTestSingleDomainPDF(options: PDFOptions = {}): Promise<Buffer> {
    try {
      logger.info('Generating test Single Domain PDF with cover page');

      if (!this.browser) {
        await this.initialize();
      }

      const [template, { mockSingleDomainData }, { Cover }] = await Promise.all([
        import(path.join(__dirname, '..', 'templates', 'templateTestSingleDomain.js')),
        import(path.join(__dirname, '..', 'dev', 'mockData.js')),
        import(path.join(__dirname, '..', 'components', 'cover.js')),
      ]);

      const [coverPdf, mainPdf] = await Promise.all([
        this.generateCoverPDF(Cover, mockSingleDomainData, options),
        this.generateSingleDomainMainContentPDF(template.generateTemplate(mockSingleDomainData), mockSingleDomainData, options),
      ]);

      const mergedPdf = await this.mergePDFs(coverPdf, mainPdf, 'Single Domain Influence Report');

      logger.info('Test Single Domain PDF generated successfully');
      return mergedPdf;
    } catch (error) {
      logger.error('Failed to generate test Single Domain PDF', error as Error);
      throw error;
    }
  }

  /**
   * Generate a JSON Export PDF - renders JSON data as formatted text
   */
  async generateJsonExportPDF(
    data: unknown[],
    metadata?: {
      title?: string;
      tenantId?: string;
      brandId?: string;
      generatedAt?: string;
      totalItems?: number;
      startDate?: string;
      endDate?: string;
    },
    options: PDFOptions = {}
  ): Promise<Buffer> {
    try {
      logger.info('Generating JSON Export PDF', {
        itemCount: data.length,
        metadata,
      });

      if (!this.browser) {
        await this.initialize();
      }

      const html = this.generateJsonExportHTML(data, metadata);
      const pdfBuffer = await this.generateJsonExportContentPDF(html, metadata, options);

      logger.info('JSON Export PDF generated successfully');
      return pdfBuffer;
    } catch (error) {
      logger.error('Failed to generate JSON Export PDF', error as Error);
      throw error;
    }
  }

  private generateJsonExportHTML(
    data: unknown[],
    metadata?: {
      title?: string;
      tenantId?: string;
      brandId?: string;
      generatedAt?: string;
      totalItems?: number;
      startDate?: string;
      endDate?: string;
    }
  ): string {
    const itemsHtml = data.map((item) => `
      <div class="json-item">
        <pre class="json-content">${this.escapeHtml(JSON.stringify(item, null, 2))}</pre>
      </div>
    `).join('');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 12px;
      line-height: 1.5;
      color: #333;
      background: #fff;
    }
    .container { padding: 20px 0; }
    .json-item {
      background: #fafbfc;
      border: 1px solid #e1e4e8;
      border-radius: 8px;
      margin-bottom: 16px;
      overflow: hidden;
      page-break-inside: avoid;
    }
    .json-content {
      font-family: 'JetBrains Mono', 'Courier New', monospace;
      font-size: 10px;
      line-height: 1.6;
      padding: 16px;
      overflow-x: auto;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: #24292e;
      background: #fff;
    }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="items-section">${itemsHtml}</div>
  </div>
</body>
</html>`;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char] || char);
  }

  private async generateJsonExportContentPDF(
    html: string,
    metadata?: {
      title?: string;
      startDate?: string;
      endDate?: string;
    },
    options: PDFOptions = {}
  ): Promise<Buffer> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: false,
        margin: {
          top: '140px',
          right: '40px',
          bottom: '84px',
          left: '40px',
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  private async generateCoverPDF(
    Cover: (props: { timeperiod: string; dateIssued?: string }) => string,
    data: { timeperiod?: string; timePeriod?: string },
    options: PDFOptions
  ): Promise<Buffer> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();

    try {
      const dateIssued = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const timeperiod = data.timeperiod || data.timePeriod || 'Jul 30, 2025 - Aug 30, 2025';

      const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; }
    @page { size: A4; margin: 0; }
  </style>
</head>
<body>${Cover({ timeperiod, dateIssued })}</body>
</html>`;

      await page.setContent(html, { waitUntil: 'networkidle0' });
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        margin: { top: '0', right: '0', bottom: '0', left: '0' },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  private async generatePartnershipMainContentPDF(
    html: string,
    options: PDFOptions
  ): Promise<Buffer> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: true,
        headerTemplate: this.getPartnershipHeaderTemplate(),
        footerTemplate: this.getFooterTemplate(),
        margin: {
          top: '148px',
          right: '40px',
          bottom: '64px',
          left: '40px',
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  private async generateSingleDomainMainContentPDF(
    html: string,
    data: { domainName?: string; timePeriod?: string; category?: string },
    options: PDFOptions
  ): Promise<Buffer> {
    if (!this.browser) throw new Error('Browser not initialized');

    const page = await this.browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        preferCSSPageSize: false,
        displayHeaderFooter: true,
        headerTemplate: this.getSingleDomainHeaderTemplate(data),
        footerTemplate: this.getFooterTemplate(),
        margin: {
          top: '132px',
          right: '40px',
          bottom: '64px',
          left: '40px',
        },
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await page.close();
    }
  }

  private async mergePDFs(coverPdf: Buffer, mainPdf: Buffer, title: string): Promise<Buffer> {
    const [coverDoc, mainDoc] = await Promise.all([
      PDFDocument.load(coverPdf),
      PDFDocument.load(mainPdf),
    ]);

    const mergedDoc = await PDFDocument.create();

    const [coverPages, mainPages] = await Promise.all([
      mergedDoc.copyPages(coverDoc, coverDoc.getPageIndices()),
      mergedDoc.copyPages(mainDoc, mainDoc.getPageIndices()),
    ]);

    coverPages.forEach((page) => mergedDoc.addPage(page));
    mainPages.forEach((page) => mergedDoc.addPage(page));

    mergedDoc.setTitle(title);
    mergedDoc.setCreator('BrandLight PDF Generator - GCP');
    mergedDoc.setProducer('Advanced PDF Service');
    mergedDoc.setCreationDate(new Date());

    return Buffer.from(await mergedDoc.save());
  }

  private getPartnershipHeaderTemplate(): string {
    return `
      <style>
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      </style>
      <div style="position: absolute; top: 0; left: 0; z-index: 999; width: 100%; padding: 24px 40px; background-color: #ffffff !important; font-family: 'DM Sans', sans-serif;">
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p style="font-size: 20px; font-weight: 700; color: #333643 !important; margin: 0;">Partnership domains report</p>
            <span style="font-size: 10px; color: #666666 !important;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 0;">
            <div style="padding: 2px 10px; border-radius: 100px; background-color: #f5f5f8 !important;">
              <p style="font-size: 14px; color: rgba(0,0,0,0.87) !important; margin: 0;">Time period: Jul 30, 2025 - Aug 30, 2025</p>
            </div>
            <div style="padding: 2px 10px; border-radius: 100px; background-color: #f5f5f8 !important;">
              <p style="font-size: 14px; color: rgba(0,0,0,0.87) !important; margin: 0;">Engines: Google, Bing, Claude, Perplexity</p>
            </div>
            <div style="padding: 2px 10px; border-radius: 100px; background-color: #f5f5f8 !important;">
              <p style="font-size: 14px; color: rgba(0,0,0,0.87) !important; margin: 0;">Category: Technology & SaaS</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getSingleDomainHeaderTemplate(data: { domainName?: string; timePeriod?: string; category?: string }): string {
    const domainName = data.domainName || 'Single Domain';
    const timePeriod = data.timePeriod || 'Jul 30, 2025 - Aug 30, 2025';
    const category = data.category || 'General';

    return `
      <style>
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      </style>
      <div style="position: absolute; top: 0; left: 0; z-index: 999; width: 100%; padding: 24px 40px; background-color: #ffffff !important; font-family: 'DM Sans', sans-serif;">
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <p style="font-size: 20px; font-weight: 700; color: #333643 !important; margin: 0;">${domainName} Influence Report</p>
            <span style="font-size: 10px; color: #666666 !important;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
          </div>
          <div style="display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 0;">
            <div style="padding: 2px 10px; border-radius: 100px; background-color: #f5f5f8 !important;">
              <p style="font-size: 14px; color: rgba(0,0,0,0.87) !important; margin: 0;">Time period: ${timePeriod}</p>
            </div>
            <div style="padding: 2px 10px; border-radius: 100px; background-color: #f5f5f8 !important;">
              <p style="font-size: 14px; color: rgba(0,0,0,0.87) !important; margin: 0;">Category: ${category}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getFooterTemplate(): string {
    return `
      <style>
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      </style>
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; background-color: #05041d !important; font-family: 'DM Sans', sans-serif;">
        <svg style="height: 16px; width: auto;" width="94" height="16" viewBox="0 0 94 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M21.3052 12.8214V3.68076H24.2244C24.6639 3.68495 25.074 3.73517 25.4549 3.83143C25.8399 3.92769 26.1747 4.07627 26.4593 4.27716C26.7481 4.47805 26.9741 4.73545 27.1373 5.04934C27.3006 5.35905 27.3801 5.72736 27.3759 6.15425C27.3717 6.60626 27.2462 6.9934 26.9992 7.31566C26.7523 7.63375 26.4196 7.88068 26.001 8.05646C26.2563 8.12761 26.4824 8.23015 26.6791 8.36407C26.88 8.49382 27.0474 8.65077 27.1813 8.83492C27.3152 9.01907 27.4178 9.22415 27.4889 9.45015C27.5601 9.67197 27.5956 9.90844 27.5956 10.1596C27.5956 10.5948 27.5161 10.9778 27.3571 11.3084C27.198 11.639 26.9762 11.9153 26.6916 12.1371C26.4112 12.3589 26.0764 12.5284 25.6872 12.6456C25.3021 12.7586 24.8857 12.8172 24.4378 12.8214H21.3052Z" fill="white"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.63337 0.0980835C8.85527 0.0980835 9.03516 0.277969 9.03516 0.499869V5.39805L11.2799 3.19271C11.4382 3.0372 11.6925 3.03945 11.8481 3.19774C12.0036 3.35603 12.0013 3.61042 11.843 3.76593L8.91495 6.64264C8.75864 6.79621 8.5081 6.79621 8.35179 6.64264L5.42371 3.76593C5.26542 3.61042 5.26317 3.35603 5.41868 3.19774C5.57419 3.03945 5.82858 3.0372 5.98687 3.19271L8.23158 5.39805V0.499869C8.23158 0.277969 8.41147 0.0980835 8.63337 0.0980835Z" fill="white"></path>
        </svg>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="color: #ffffff !important; font-size: 12px;">© All rights reserved to Brandlight</span>
        </div>
      </div>
    `;
  }
}
