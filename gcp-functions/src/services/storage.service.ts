import { Storage } from '@google-cloud/storage';
import { config } from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('StorageService');

export class StorageService {
  private storage: Storage;
  private bucket;

  constructor() {
    // Initialize Google Cloud Storage
    // When running on GCP, credentials are automatically handled
    // For local development, set GOOGLE_APPLICATION_CREDENTIALS env variable
    this.storage = new Storage({
      projectId: config.gcp.projectId,
    });
    this.bucket = this.storage.bucket(config.storage.bucket);
  }

  async uploadPDF(
    buffer: Buffer,
    fileName: string,
    tenantId: string,
    metadata?: Record<string, string>
  ): Promise<{ url: string; path: string }> {
    try {
      const filePath = `${tenantId}/QUERIES/${fileName}`;
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

      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filePath}`;

      logger.info(`PDF uploaded successfully: ${publicUrl}`);
      return { url: publicUrl, path: filePath };
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

  generateJsonFileName(jobId: string, reportType: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `export_${reportType}_${jobId}_${timestamp}.json`;
  }

  async uploadJSON(
    data: unknown,
    fileName: string,
    tenantId: string,
    metadata?: Record<string, string>
  ): Promise<{ url: string; path: string }> {
    try {
      const filePath = `${tenantId}/QUERIES/${fileName}`;
      const file = this.bucket.file(filePath);
      const jsonString = JSON.stringify(data, null, 2);

      logger.info(`Uploading JSON to: ${filePath}`);

      await file.save(jsonString, {
        metadata: {
          contentType: 'application/json',
          cacheControl: 'public, max-age=86400', // 1 day cache
          metadata: {
            uploadedAt: new Date().toISOString(),
            ...metadata,
          },
        },
        resumable: false,
      });

      const publicUrl = `https://storage.googleapis.com/${this.bucket.name}/${filePath}`;

      logger.info(`JSON uploaded successfully: ${publicUrl}`);
      return { url: publicUrl, path: filePath };
    } catch (error) {
      logger.error(`Failed to upload JSON: ${fileName}`, error as Error);
      throw error;
    }
  }

  async deleteFile(fileName: string): Promise<void> {
    try {
      const filePath = `${config.storage.reportPath}${fileName}`;
      const file = this.bucket.file(filePath);

      await file.delete();
      logger.info(`File deleted successfully: ${filePath}`);
    } catch (error) {
      logger.error(`Failed to delete file: ${fileName}`, error as Error);
      throw error;
    }
  }

  async listFiles(prefix?: string): Promise<string[]> {
    try {
      const [files] = await this.bucket.getFiles({
        prefix: prefix || config.storage.reportPath,
      });

      return files.map(file => file.name);
    } catch (error) {
      logger.error('Failed to list files', error as Error);
      throw error;
    }
  }
}
