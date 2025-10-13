import { getStorage } from 'firebase-admin/storage';
import { config } from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('StorageService');

export class StorageService {
  private bucket = getStorage().bucket();

  async uploadPDF(
    buffer: Buffer,
    fileName: string,
    metadata?: Record<string, string>
  ): Promise<string> {
    try {
      const filePath = `${config.storage.reportPath}${fileName}`;
      const file = this.bucket.file(filePath);

      logger.info(`Uploading PDF to: ${filePath}`);

      await file.save(buffer, {
        metadata: {
          contentType: 'application/pdf',
          cacheControl: 'public, max-age=86400', // 1 day cache
          metadata: {
            uploadedAt: new Date().toISOString(),
            ...metadata,
          },
        },
        resumable: false,
      });

      // Make the file publicly accessible
      await file.makePublic();

      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filePath}`;

      logger.info(`PDF uploaded successfully: ${publicUrl}`);
      return publicUrl;
    } catch (error) {
      logger.error(`Failed to upload PDF: ${fileName}`, error as Error);
      throw error;
    }
  }

  async getSignedUrl(fileName: string, expiresInMinutes = 60): Promise<string> {
    try {
      const filePath = `${config.storage.reportPath}${fileName}`;
      const file = this.bucket.file(filePath);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + expiresInMinutes * 60 * 1000,
      });

      logger.info(`Generated signed URL for: ${filePath}`);
      return url;
    } catch (error) {
      logger.error(
        `Failed to generate signed URL: ${fileName}`,
        error as Error
      );
      throw error;
    }
  }

  generateFileName(jobId: string, reportType: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `report_${reportType}_${jobId}_${timestamp}.pdf`;
  }
}
