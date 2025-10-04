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
    bucket: process.env.STORAGE_BUCKET || 'your-project-reports',
    reportPath: 'reports/',
    tempPath: 'temp/',
  },
  firestore: {
    collections: {
      jobs: 'report_jobs',
      templates: 'report_templates',
      users: 'users',
    },
  },
  functions: {
    timeout: 540, // 9 minutes for long-running reports
    memory: '2GiB' as const,
    region: 'us-central1',
  },
} as const;

export type Config = typeof config;
