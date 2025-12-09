import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  pdf: {
    defaultFormat: 'A4' as const,
    defaultMargin: {
      top: '20mm',
      right: '15mm',
      bottom: '20mm',
      left: '15mm',
    },
    timeout: 30000,
    quality: 100,
  },
  storage: {
    bucket: process.env.GCS_BUCKET_NAME || 'your-project-reports',
    reportPath: 'reports/',
    tempPath: 'temp/',
  },
  functions: {
    timeout: 540, // 9 minutes for long-running reports
    memory: '2GiB' as const,
    region: process.env.GCP_REGION || 'us-central1',
  },
  gcp: {
    projectId: process.env.GCP_PROJECT_ID || 'your-project-id',
    region: process.env.GCP_REGION || 'us-central1',
  },
} as const;

export type Config = typeof config;

/**
 * Brandlight API Configuration
 * Access key is used for authentication with Brandlight's API via Descope
 */
export const brandlightConfig = {
  // API Base URL - using dev environment
  apiBaseUrl: process.env.BRANDLIGHT_API_URL || 'https://api.dev.brandlight.ai',
  
  // Descope Project ID for authentication
  descopeProjectId: process.env.DESCOPE_PROJECT_ID || 'P2pnyVnSm5HjzBd1QkGaEQbbzqzc',
  
  // Access Key for authentication (exchanged for JWT via Descope)
  // This key should be stored securely in environment variables or GCP Secret Manager
  accessKey: process.env.BRANDLIGHT_ACCESS_KEY || 'K36EtVM4ZoPUt6OSsyWpr9z1s1VtoK9iRV6DQ9OBKC0JIgWzR08kMSiDMpONbU0McU5z8Mp',
  
  // Request timeout in milliseconds
  timeout: parseInt(process.env.BRANDLIGHT_API_TIMEOUT || '30000', 10),
  
  // Retry configuration
  retry: {
    maxRetries: 3,
    initialDelayMs: 1000,
    maxDelayMs: 10000,
  },
} as const;

export type BrandlightConfig = typeof brandlightConfig;
