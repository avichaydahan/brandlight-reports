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
   * Generate cover page PDF without header/footer (full-bleed design)
   */
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

  /**
   * Generate main content PDF for Partnership with header/footer
   */
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

  /**
   * Generate main content PDF for Single Domain with header/footer
   */
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

  /**
   * Merge cover and main PDFs into one
   */
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
    mergedDoc.setCreator('BrandLight PDF Generator');
    mergedDoc.setProducer('Advanced PDF Service');
    mergedDoc.setCreationDate(new Date());

    return Buffer.from(await mergedDoc.save());
  }

  private getPartnershipHeaderTemplate(): string {
    return `
      <style>
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      </style>
      <div style="position: absolute; top: 0; left: 0; z-index: 999; width: 100%; padding: 24px 40px; background-color: #ffffff !important; -webkit-print-color-adjust: exact; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 14px;">
          <div style="display: flex; justify-content: flex-start; align-items: flex-start; width: 100%; height: 20px; position: relative; gap: 8px;">
            <p style="flex-grow: 1; width: 100%; font-size: 20px; font-weight: 700; text-align: left; color: #333643 !important; margin: 0;">
              Partnership domains report
            </p>
            <span style="font-size: 10px; color: #666666 !important; white-space: nowrap;">
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </span>
          </div>
          <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; width: 100%; gap: 8px;">
            <div style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; gap: 10px;">
              <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: center; flex-grow: 1; gap: 6px; padding-top: 8px; padding-bottom: 8px; background-color: #ffffff !important; -webkit-print-color-adjust: exact;">
                <div style="display: flex; justify-content: flex-start; align-items: center; overflow: hidden; padding: 2px 4px; border-radius: 100px; background-color: #f5f5f8 !important; -webkit-print-color-adjust: exact;">
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; position: relative; padding: 0 6px;">
                    <p style="font-size: 14px; text-align: left; color: rgba(0,0,0,0.87) !important; margin: 0;">
                      Time period: Jul 30, 2025 - Aug 30, 2025
                    </p>
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-start; align-items: center; overflow: hidden; padding: 2px 4px; border-radius: 100px; background-color: #f5f5f8 !important; -webkit-print-color-adjust: exact;">
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; position: relative; padding: 0 6px;">
                    <p style="font-size: 14px; text-align: left; color: rgba(0,0,0,0.87) !important; margin: 0;">
                      Engines: Google, Bing, Claude, Perplexity
                    </p>
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-start; align-items: center; overflow: hidden; padding: 2px 4px; border-radius: 100px; background-color: #f5f5f8 !important; -webkit-print-color-adjust: exact;">
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; position: relative; padding: 0 6px;">
                    <p style="font-size: 14px; text-align: left; color: rgba(0,0,0,0.87) !important; margin: 0;">
                      Category: Technology & SaaS
                    </p>
                  </div>
                </div>
              </div>
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
      <div style="position: absolute; top: 0; left: 0; z-index: 999; width: 100%; padding: 24px 40px; background-color: #ffffff !important; -webkit-print-color-adjust: exact; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; gap: 14px;">
          <div style="display: flex; justify-content: flex-start; align-items: flex-start; width: 100%; height: 20px; position: relative; gap: 8px;">
            <p style="flex-grow: 1; width: 100%; font-size: 20px; font-weight: 700; text-align: left; color: #333643 !important; margin: 0;">
              ${domainName} Influence Report
            </p>
            <span style="font-size: 10px; color: #666666 !important; white-space: nowrap;">
              Page <span class="pageNumber"></span> of <span class="totalPages"></span>
            </span>
          </div>
          <div style="display: flex; flex-direction: column; justify-content: flex-start; align-items: flex-start; width: 100%; gap: 8px;">
            <div style="display: flex; justify-content: flex-start; align-items: flex-start; align-self: stretch; gap: 10px;">
              <div style="display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: center; flex-grow: 1; gap: 6px; padding-top: 8px; padding-bottom: 8px; background-color: #ffffff !important; -webkit-print-color-adjust: exact;">
                <div style="display: flex; justify-content: flex-start; align-items: center; overflow: hidden; padding: 2px 4px; border-radius: 100px; background-color: #f5f5f8 !important; -webkit-print-color-adjust: exact;">
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; position: relative; padding: 0 6px;">
                    <p style="font-size: 14px; text-align: left; color: rgba(0,0,0,0.87) !important; margin: 0;">
                      Time period: ${timePeriod}
                    </p>
                  </div>
                </div>
                <div style="display: flex; justify-content: flex-start; align-items: center; overflow: hidden; padding: 2px 4px; border-radius: 100px; background-color: #f5f5f8 !important; -webkit-print-color-adjust: exact;">
                  <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-start; position: relative; padding: 0 6px;">
                    <p style="font-size: 14px; text-align: left; color: rgba(0,0,0,0.87) !important; margin: 0;">
                      Category: ${category}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  private getFooterTemplate(): string {
    return `
      <style>
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; box-sizing: border-box; }
      </style>
      <div style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 15px 40px; display: flex; justify-content: space-between; align-items: center; background-color: #05041d !important; -webkit-print-color-adjust: exact; box-sizing: border-box; font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
        <svg style="height: 16px; width: auto;" width="94" height="16" viewBox="0 0 94 16" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
          <path d="M21.3052 12.8214V3.68076H24.2244C24.6639 3.68495 25.074 3.73517 25.4549 3.83143C25.8399 3.92769 26.1747 4.07627 26.4593 4.27716C26.7481 4.47805 26.9741 4.73545 27.1373 5.04934C27.3006 5.35905 27.3801 5.72736 27.3759 6.15425C27.3717 6.60626 27.2462 6.9934 26.9992 7.31566C26.7523 7.63375 26.4196 7.88068 26.001 8.05646C26.2563 8.12761 26.4824 8.23015 26.6791 8.36407C26.88 8.49382 27.0474 8.65077 27.1813 8.83492C27.3152 9.01907 27.4178 9.22415 27.4889 9.45015C27.5601 9.67197 27.5956 9.90844 27.5956 10.1596C27.5956 10.5948 27.5161 10.9778 27.3571 11.3084C27.198 11.639 26.9762 11.9153 26.6916 12.1371C26.4112 12.3589 26.0764 12.5284 25.6872 12.6456C25.3021 12.7586 24.8857 12.8172 24.4378 12.8214H21.3052ZM22.8182 8.67797V11.5909H24.463C24.7015 11.5867 24.9192 11.5512 25.1159 11.4842C25.3126 11.413 25.4821 11.3168 25.6244 11.1954C25.7667 11.074 25.8776 10.9255 25.9571 10.7497C26.0408 10.5739 26.0827 10.3772 26.0827 10.1596C26.0827 9.92936 26.0471 9.72429 25.9759 9.54432C25.9048 9.36017 25.8022 9.20531 25.6683 9.07976C25.5344 8.9542 25.3712 8.85794 25.1786 8.79097C24.9861 8.71982 24.7706 8.68215 24.532 8.67797H22.8182ZM22.8182 7.52911H24.2621C24.4881 7.52493 24.6973 7.49563 24.8899 7.44122C25.0866 7.38263 25.2561 7.29892 25.3984 7.19011C25.5407 7.0771 25.6537 6.94108 25.7374 6.78204C25.8211 6.61882 25.8629 6.43257 25.8629 6.22331C25.8629 5.99312 25.8232 5.79641 25.7437 5.63319C25.6641 5.46996 25.5511 5.33603 25.4046 5.2314C25.2623 5.12677 25.0928 5.05144 24.8961 5.0054C24.6994 4.95517 24.4839 4.92797 24.2495 4.92378H22.8182V7.52911Z" fill="white"></path>
          <path d="M33.3497 5.90314C33.4711 5.90314 33.5925 5.90732 33.7138 5.91569C33.8352 5.92406 33.9503 5.93662 34.0591 5.95336C34.1721 5.9701 34.2747 5.98893 34.3667 6.00986C34.4588 6.0266 34.5362 6.04753 34.599 6.07264L34.3856 7.54795C33.9252 7.44332 33.4711 7.391 33.0233 7.391C32.521 7.391 32.1151 7.49563 31.8053 7.7049C31.4998 7.91416 31.2738 8.20503 31.1273 8.57752V12.8214H29.6269V6.0287H31.0332L31.1022 7.08966C31.3784 6.72136 31.7049 6.43257 32.0816 6.22331C32.4624 6.00986 32.8851 5.90314 33.3497 5.90314Z" fill="white"></path>
          <path d="M40.3531 12.8214C40.3112 12.7377 40.2757 12.6393 40.2464 12.5263C40.2212 12.4133 40.1982 12.2919 40.1773 12.1622C40.0727 12.271 39.9534 12.3736 39.8195 12.4698C39.6897 12.5619 39.5432 12.6435 39.38 12.7147C39.221 12.7858 39.0473 12.8423 38.8589 12.8842C38.6748 12.926 38.476 12.9469 38.2625 12.9469C37.9026 12.9469 37.5762 12.8967 37.2832 12.7963C36.9944 12.6916 36.7454 12.5493 36.5361 12.3694C36.331 12.1852 36.172 11.9697 36.059 11.7228C35.946 11.4758 35.8895 11.208 35.8895 10.9192C35.8895 10.1909 36.1594 9.6343 36.6993 9.24926C37.2434 8.86421 38.0219 8.67169 39.0347 8.67169H40.1334V8.22596C40.1334 7.86603 40.012 7.58143 39.7692 7.37217C39.5265 7.15872 39.1833 7.05199 38.7397 7.05199C38.5388 7.05199 38.363 7.0771 38.2123 7.12733C38.0616 7.17337 37.9361 7.23824 37.8356 7.32194C37.7352 7.40565 37.6599 7.504 37.6096 7.617C37.5594 7.73001 37.5343 7.85138 37.5343 7.98112H36.0339C36.0339 7.71745 36.0946 7.46215 36.2159 7.21522C36.3415 6.9641 36.5236 6.74228 36.7621 6.54976C37.0007 6.35305 37.2916 6.19611 37.6348 6.07892C37.9821 5.96173 38.3776 5.90314 38.8213 5.90314C39.2231 5.90314 39.5956 5.95336 39.9387 6.05381C40.2819 6.15007 40.5791 6.29655 40.8302 6.49326C41.0813 6.68578 41.278 6.92853 41.4203 7.2215C41.5626 7.51028 41.6338 7.84929 41.6338 8.23852V11.2645C41.6338 11.5616 41.6547 11.8337 41.6966 12.0806C41.7426 12.3233 41.8075 12.5347 41.8912 12.7147V12.8214H40.3531ZM38.545 11.7353C38.7376 11.7353 38.9175 11.7123 39.0849 11.6663C39.2565 11.616 39.4093 11.5532 39.5432 11.4779C39.6813 11.3984 39.7985 11.3084 39.8948 11.208C39.9952 11.1075 40.0748 11.005 40.1334 10.9003V9.62593H39.1791C38.5681 9.62593 38.1161 9.72429 37.8231 9.92099C37.5343 10.1177 37.3899 10.3981 37.3899 10.7622C37.3899 10.9003 37.4129 11.0301 37.459 11.1515C37.505 11.2687 37.5741 11.3712 37.6661 11.4591C37.7624 11.5428 37.8817 11.6097 38.024 11.66C38.1705 11.7102 38.3442 11.7353 38.545 11.7353Z" fill="white"></path>
          <path d="M44.7135 6.0287L44.8076 6.97038C45.0546 6.63137 45.3517 6.36979 45.6991 6.18564C46.0507 5.99731 46.4399 5.90314 46.8668 5.90314C47.2142 5.90314 47.5301 5.95336 47.8147 6.05381C48.1035 6.15425 48.3505 6.3112 48.5555 6.52465C48.7648 6.7381 48.9259 7.01433 49.0389 7.35333C49.1561 7.69234 49.2147 8.1004 49.2147 8.57752V12.8214H47.7143V8.60263C47.7143 8.32222 47.6808 8.08785 47.6139 7.89951C47.5511 7.71117 47.459 7.5605 47.3376 7.4475C47.2204 7.3345 47.076 7.25498 46.9045 7.20894C46.7329 7.15872 46.5382 7.13361 46.3206 7.13361C45.99 7.13361 45.7012 7.20685 45.4543 7.35333C45.2115 7.49982 45.0148 7.69862 44.8641 7.94973V12.8214H43.3574V6.0287H44.7135Z" fill="white"></path>
          <path d="M50.4926 9.37482C50.4926 8.86003 50.5554 8.38919 50.681 7.96229C50.8065 7.53539 50.9865 7.16918 51.2209 6.86366C51.4553 6.55813 51.7378 6.32166 52.0684 6.15425C52.4032 5.98684 52.7778 5.90314 53.1921 5.90314C53.5646 5.90314 53.8932 5.96801 54.1778 6.09775C54.4624 6.22331 54.7114 6.40537 54.9249 6.64393V3.17853H56.4315V12.8214H55.0692L54.9939 12.1308C54.7805 12.3945 54.5231 12.5975 54.2217 12.7398C53.9246 12.8779 53.5772 12.9469 53.1796 12.9469C52.7694 12.9469 52.399 12.8611 52.0684 12.6895C51.7378 12.5138 51.4553 12.2731 51.2209 11.9676C50.9907 11.6621 50.8107 11.3 50.681 10.8815C50.5554 10.4588 50.4926 10.0005 50.4926 9.50665V9.37482ZM51.9931 9.50665C51.9931 9.81218 52.0224 10.0989 52.081 10.3667C52.1396 10.6346 52.2316 10.869 52.3572 11.0698C52.4869 11.2707 52.6502 11.4298 52.8469 11.547C53.0478 11.66 53.2863 11.7165 53.5625 11.7165C53.9057 11.7165 54.1861 11.6432 54.4038 11.4967C54.6214 11.3461 54.7951 11.1452 54.9249 10.8941V7.94346C54.7951 7.69652 54.6193 7.49982 54.3975 7.35333C54.1799 7.20685 53.9057 7.13361 53.5751 7.13361C53.2947 7.13361 53.054 7.1922 52.8531 7.30939C52.6564 7.42657 52.4932 7.58771 52.3635 7.79279C52.2379 7.99786 52.1437 8.23642 52.081 8.50847C52.0224 8.78051 51.9931 9.06929 51.9931 9.37482V9.50665Z" fill="white"></path>
          <path d="M58.3059 3.17853H61.9785V11.5784H64.0502V12.8214H58.3059V11.5784H60.4655V4.42783H58.3059V3.17853Z" fill="white"></path>
          <path d="M65.6922 6.0287H69.3146V11.5784H71.3298V12.8214H65.6922V11.5784H67.8016V7.278H65.6922V6.0287ZM67.676 4.27088C67.676 4.03651 67.7514 3.84399 67.902 3.69332C68.0527 3.53846 68.2641 3.46103 68.5361 3.46103C68.8123 3.46103 69.0258 3.53846 69.1764 3.69332C69.3313 3.84399 69.4087 4.03651 69.4087 4.27088C69.4087 4.50526 69.3313 4.69987 69.1764 4.85473C69.0258 5.0054 68.8123 5.08073 68.5361 5.08073C68.2641 5.08073 68.0527 5.0054 67.902 4.85473C67.7514 4.69987 67.676 4.50526 67.676 4.27088Z" fill="white"></path>
          <path d="M72.5072 9.37482C72.5072 8.86003 72.57 8.38919 72.6956 7.96229C72.8253 7.53539 73.0095 7.16918 73.248 6.86366C73.4866 6.55813 73.7733 6.32166 74.1081 6.15425C74.4471 5.98684 74.8259 5.90314 75.2444 5.90314C75.6504 5.90314 76.0019 5.97219 76.2991 6.11031C76.5963 6.24842 76.8516 6.44722 77.065 6.70671L77.1278 6.0287H78.4901V12.6393C78.4901 13.0955 78.4147 13.4994 78.2641 13.851C78.1134 14.2067 77.9021 14.506 77.63 14.7487C77.3622 14.9914 77.0399 15.1756 76.6632 15.3012C76.2865 15.4309 75.8722 15.4958 75.4202 15.4958C75.236 15.4958 75.0268 15.4748 74.7924 15.433C74.5622 15.3953 74.3299 15.3305 74.0956 15.2384C73.8612 15.1505 73.6373 15.0333 73.4238 14.8868C73.2104 14.7445 73.0283 14.5708 72.8776 14.3657L73.5933 13.468C73.8486 13.7693 74.1228 13.9849 74.4157 14.1146C74.7129 14.2444 75.0184 14.3092 75.3323 14.3092C75.5834 14.3092 75.8115 14.2737 76.0166 14.2025C76.2217 14.1314 76.3954 14.0267 76.5377 13.8886C76.68 13.7505 76.7888 13.5789 76.8641 13.3738C76.9436 13.1729 76.9834 12.9407 76.9834 12.677V12.2187C76.7699 12.4531 76.5188 12.633 76.23 12.7586C75.9454 12.8842 75.6127 12.9469 75.2319 12.9469C74.8175 12.9469 74.4429 12.8611 74.1081 12.6895C73.7733 12.5138 73.4866 12.2731 73.248 11.9676C73.0095 11.6621 72.8253 11.3 72.6956 10.8815C72.57 10.4588 72.5072 10.0005 72.5072 9.50665V9.37482ZM74.0139 9.50665C74.0139 9.81218 74.0453 10.0989 74.1081 10.3667C74.1709 10.6346 74.2672 10.869 74.3969 11.0698C74.5266 11.2707 74.692 11.4298 74.8928 11.547C75.0979 11.66 75.3386 11.7165 75.6148 11.7165C75.9622 11.7165 76.2447 11.6453 76.4623 11.503C76.68 11.3565 76.8536 11.1619 76.9834 10.9192V7.91834C76.8495 7.67978 76.6737 7.48935 76.456 7.34705C76.2384 7.20476 75.9622 7.13361 75.6274 7.13361C75.3511 7.13361 75.1105 7.1922 74.9054 7.30939C74.7045 7.42657 74.5371 7.58771 74.4032 7.79279C74.2734 7.99786 74.1751 8.23642 74.1081 8.50847C74.0453 8.78051 74.0139 9.06929 74.0139 9.37482V9.50665Z" fill="white"></path>
          <path d="M81.5384 6.97038C81.7728 6.63556 82.0574 6.37398 82.3922 6.18564C82.7312 5.99731 83.1079 5.90314 83.5222 5.90314C83.8738 5.90314 84.196 5.95545 84.489 6.06008C84.7862 6.16472 85.0394 6.32794 85.2486 6.54976C85.4579 6.7674 85.6211 7.0499 85.7383 7.39728C85.8555 7.74047 85.9141 8.15272 85.9141 8.63402V12.8214H84.4137V8.62147C84.4137 8.36198 84.3802 8.14016 84.3132 7.95601C84.2504 7.76767 84.1584 7.61282 84.037 7.49145C83.9198 7.37007 83.7754 7.28009 83.6038 7.2215C83.4322 7.1629 83.2376 7.13361 83.02 7.13361C82.6935 7.13361 82.4047 7.20266 82.1536 7.34078C81.9025 7.47471 81.6974 7.65676 81.5384 7.88695V12.8214H80.038V3.17853H81.5384V6.97038Z" fill="white"></path>
          <path d="M90.3812 4.38388V6.0287H92.9488V7.14616H90.3812V10.4044C90.3812 10.6597 90.4105 10.871 90.4691 11.0385C90.5319 11.2059 90.6176 11.3398 90.7265 11.4402C90.8353 11.5407 90.9629 11.6118 91.1094 11.6537C91.2559 11.6914 91.417 11.7102 91.5928 11.7102C91.7226 11.7102 91.8565 11.7039 91.9946 11.6914C92.1369 11.6746 92.2729 11.6579 92.4027 11.6411C92.5366 11.6202 92.658 11.5993 92.7668 11.5784C92.8798 11.5532 92.974 11.5302 93.0493 11.5093L93.2188 12.5452C93.11 12.6079 92.9781 12.6665 92.8233 12.7209C92.6726 12.7712 92.5073 12.813 92.3273 12.8465C92.1474 12.88 91.959 12.9051 91.7623 12.9218C91.5698 12.9428 91.3794 12.9532 91.191 12.9532C90.852 12.9532 90.5402 12.9072 90.2556 12.8151C89.9752 12.7188 89.7325 12.5724 89.5274 12.3757C89.3265 12.1748 89.1675 11.9195 89.0503 11.6097C88.9373 11.2959 88.8808 10.9213 88.8808 10.486V7.14616H87.2234V6.0287H88.8808V4.38388H90.3812Z" fill="white"></path>
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8.63337 0.0980835C8.85527 0.0980835 9.03516 0.277969 9.03516 0.499869V5.39805L11.2799 3.19271C11.4382 3.0372 11.6925 3.03945 11.8481 3.19774C12.0036 3.35603 12.0013 3.61042 11.843 3.76593L8.91495 6.64264C8.75864 6.79621 8.5081 6.79621 8.35179 6.64264L5.42371 3.76593C5.26542 3.61042 5.26317 3.35603 5.41868 3.19774C5.57419 3.03945 5.82858 3.0372 5.98687 3.19271L8.23158 5.39805V0.499869C8.23158 0.277969 8.41147 0.0980835 8.63337 0.0980835ZM3.74549 4.84158C3.901 4.68329 4.15539 4.68104 4.31368 4.83655L7.24176 7.71326C7.31865 7.7888 7.36197 7.89208 7.36197 7.99987C7.36197 8.10766 7.31865 8.21093 7.24176 8.28648L4.31368 11.1632C4.15539 11.3187 3.901 11.3165 3.74549 11.1582C3.58998 10.9999 3.59223 10.7455 3.75052 10.59L5.97791 8.40165H0.999442C0.777542 8.40165 0.597656 8.22177 0.597656 7.99987C0.597656 7.77797 0.777542 7.59808 0.999442 7.59808H5.97791L3.75052 5.40977C3.59223 5.25425 3.58998 4.99987 3.74549 4.84158ZM13.5213 4.84158C13.6768 4.99987 13.6745 5.25425 13.5162 5.40977L11.2888 7.59808L16.2673 7.59808C16.4892 7.59808 16.6691 7.77797 16.6691 7.99987C16.6691 8.22177 16.4892 8.40166 16.2673 8.40166L11.2888 8.40166L13.5162 10.59C13.6745 10.7455 13.6768 10.9999 13.5213 11.1582C13.3657 11.3165 13.1114 11.3187 12.9531 11.1632L10.025 8.28648C9.94809 8.21093 9.90477 8.10766 9.90477 7.99987C9.90477 7.89208 9.94809 7.7888 10.025 7.71326L12.9531 4.83655C13.1114 4.68104 13.3657 4.68329 13.5213 4.84158ZM5.42371 12.2338L8.35179 9.3571C8.5081 9.20353 8.75864 9.20353 8.91495 9.3571L11.843 12.2338C12.0013 12.3893 12.0036 12.6437 11.8481 12.802C11.6925 12.9603 11.4382 12.9625 11.2799 12.807L9.03516 10.6017V15.4999C9.03516 15.7218 8.85527 15.9017 8.63337 15.9017C8.41147 15.9017 8.23158 15.7218 8.23158 15.4999V10.6017L5.98687 12.807C5.82858 12.9625 5.57419 12.9603 5.41868 12.802C5.26317 12.6437 5.26542 12.3893 5.42371 12.2338Z" fill="white"></path>
        </svg>
        <div style="display: flex; align-items: center; gap: 4px;">
          <span style="color: #ffffff !important; font-size: 12px;">©</span>
          <span style="color: #ffffff !important; font-size: 12px;">All rights reserved to Brandlight</span>
        </div>
      </div>
    `;
  }
}
