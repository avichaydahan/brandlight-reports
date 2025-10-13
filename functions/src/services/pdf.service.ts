import puppeteer, { Browser, Page } from 'puppeteer';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { createLogger } from '../utils/logger.js';
import { ChartService } from './chart.service.js';
import { ReportData, ChartData } from '../types/index.js';
import { config } from '../config/index.js';
import { Footer } from '../components/footer.js';

const logger = createLogger('PDFService');

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface PDFOptions {
  format?: 'A4' | 'A3' | 'Letter';
  orientation?: 'portrait' | 'landscape';
  quality?: number;
  includeCharts?: boolean;
  watermark?: string;
}

export class PDFService {
  private browser: Browser | null = null;
  private chartService: ChartService;

  constructor() {
    this.chartService = new ChartService();
  }

  async initialize(): Promise<void> {
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

  async generateReportPDF(
    reportType: string,
    data: ReportData,
    options: PDFOptions = {}
  ): Promise<Buffer> {
    try {
      logger.info(`Generating PDF report of type ${reportType}`);

      if (!this.browser) {
        await this.initialize();
      }

      // Generate HTML content
      const html = await this.generateHTML(reportType, data, options);

      // Generate PDF from HTML using Puppeteer
      const pdfBuffer = await this.generatePDFFromHTML(html, options);

      // Post-process PDF if needed (watermarks, metadata, etc.)
      const finalPDF = await this.postProcessPDF(pdfBuffer, options);

      logger.info('PDF report generated successfully');
      return finalPDF;
    } catch (error) {
      logger.error('Failed to generate PDF report', error as Error);
      throw error;
    }
  }

  private async generateHTML(
    reportType: string,
    data: ReportData,
    options: PDFOptions
  ): Promise<string> {
    try {
      // Load template
      const templatePath = path.join(
        __dirname,
        '..',
        'templates',
        `template${reportType}.js`
      );
      const template = await import(templatePath);

      let html: string;

      // Different templates may have different export names
      if (template.generateTemplate) {
        html = template.generateTemplate(data.data);
      } else if (template.generateHTML) {
        html = template.generateHTML(data);
      } else {
        throw new Error(
          `Template ${reportType} does not export generateHTML or generateTemplate function`
        );
      }

      // Add charts if requested
      if (options.includeCharts && data.data.charts) {
        html = await this.embedCharts(html, data.data.charts as ChartData[]);
      }

      // Add CSS for professional styling
      html = this.addProfessionalStyling(html, options);

      return html;
    } catch (error) {
      logger.error('Failed to generate HTML', error as Error);
      throw error;
    }
  }

  private async embedCharts(
    html: string,
    charts: ChartData[]
  ): Promise<string> {
    try {
      let updatedHTML = html;

      for (let i = 0; i < charts.length; i++) {
        const chart = charts[i];
        const chartBuffer = await this.chartService.generateChart(chart);
        const base64Chart = chartBuffer.toString('base64');
        const chartHTML = `<img src="data:image/png;base64,${base64Chart}" alt="Chart ${
          i + 1
        }" style="max-width: 100%; height: auto; margin: 20px 0;" />`;

        // Replace placeholder or append to content
        const placeholder = `{{CHART_${i + 1}}}`;
        if (updatedHTML.includes(placeholder)) {
          updatedHTML = updatedHTML.replace(placeholder, chartHTML);
        } else {
          // Append before closing body tag
          updatedHTML = updatedHTML.replace('</body>', `${chartHTML}</body>`);
        }
      }

      return updatedHTML;
    } catch (error) {
      logger.error('Failed to embed charts', error as Error);
      throw error;
    }
  }

  private addProfessionalStyling(html: string, options: PDFOptions): string {
    const styles = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap');
        
        body {
          font-family: 'DM Sans', sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 40px;
          background: white;
        }
        
        .header {
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .footer {

        }
        
        h1 { color: #1e293b; font-weight: 700; font-size: 28px; margin: 0 0 10px 0; }
        h2 { color: #334155; font-weight: 600; font-size: 22px; margin: 30px 0 15px 0; }
        h3 { color: #475569; font-weight: 500; font-size: 18px; margin: 25px 0 10px 0; }
        
        .metric-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 0;
        }
        
        .metric-value {
          font-size: 32px;
          font-weight: 700;
          color: #059669;
        }
        
        .chart-container {
          margin: 30px 0;
          text-align: center;
          break-inside: avoid;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
          font-size: 14px;
        }
        
        th, td {
          border: 1px solid #e2e8f0;
          padding: 12px;
          text-align: left;
        }
        
        th {
          background: #f1f5f9;
          font-weight: 600;
          color: #334155;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        @page {
          size: ${options.format || 'A4'} ${options.orientation || 'portrait'};
          margin: ${config.pdf.defaultMargin.top} ${
      config.pdf.defaultMargin.right
    } ${config.pdf.defaultMargin.bottom} ${config.pdf.defaultMargin.left};
        }
        
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          color: rgba(0, 0, 0, 0.05);
          font-weight: bold;
          z-index: -1;
        }
      </style>
    `;

    // Insert styles after <head> or at the beginning if no <head>
    if (html.includes('<head>')) {
      return html.replace('<head>', `<head>${styles}`);
    } else {
      return `<!DOCTYPE html><html><head>${styles}</head><body>${html}</body></html>`;
    }
  }

  private async generatePDFFromHTML(
    html: string,
    options: PDFOptions
  ): Promise<Buffer> {
    if (!this.browser) {
      throw new Error('Browser not initialized');
    }

    const page = await this.browser.newPage();

    try {
      await page.setContent(html, { waitUntil: 'networkidle0' });

      const pdfBuffer = await page.pdf({
        format: options.format || 'A4',
        printBackground: true,
        preferCSSPageSize: true,
        displayHeaderFooter: false,
        headerTemplate: '<div></div>',
        footerTemplate: '<div></div>',
        waitForFonts: true,
        // margin: {
        //   top: '20mm',
        //   right: '15mm',
        //   bottom: '20mm',
        //   left: '15mm',
        // },
      });

      return Buffer.from(
        await this.addPageNumbersStartingFromSecond(pdfBuffer)
      );
    } finally {
      await page.close();
    }
  }

  private async addPageNumbersStartingFromSecond(
    pdfBytes: Uint8Array
  ): Promise<Uint8Array> {
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const totalPages = pages.length - 1; // exclude first page from count
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    pages.forEach((page, index) => {
      // Skip first page
      if (index === 0) return;

      const { width, height } = page.getSize();
      const pageNumber = index; // page 2 => 1, page 3 => 2, etc.

      const text = `Page ${pageNumber} of ${totalPages}`;
      page.drawText(text, {
        x: width - 84,
        y: height - 30,
        size: 10,
        font,
        color: rgb(51 / 255, 57 / 255, 67 / 255),
      });
    });

    return await pdfDoc.save();
  }

  private async postProcessPDF(
    pdfBuffer: Buffer,
    options: PDFOptions
  ): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      // Add metadata
      pdfDoc.setTitle('Professional Report');
      pdfDoc.setCreator('BrandLight PDF Generator');
      pdfDoc.setProducer('Advanced PDF Service');
      pdfDoc.setCreationDate(new Date());

      // Add watermark if specified
      if (options.watermark) {
        await this.addWatermark(pdfDoc, options.watermark);
      }

      return Buffer.from(await pdfDoc.save());
    } catch (error) {
      logger.error('Failed to post-process PDF', error as Error);
      return pdfBuffer; // Return original if post-processing fails
    }
  }

  private async addWatermark(
    pdfDoc: PDFDocument,
    watermarkText: string
  ): Promise<void> {
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const { width, height } = page.getSize();

      page.drawText(watermarkText, {
        x: width / 2 - 100,
        y: height / 2,
        size: 50,
        font: helveticaFont,
        color: rgb(0, 0, 0),
        opacity: 0.1,
        rotate: degrees(-45),
      });
    });
  }

  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('PDF service cleaned up');
    }
  }
}
