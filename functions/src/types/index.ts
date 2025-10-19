import { z } from 'zod';

// Base job schema
export const JobSchema = z.object({
  id: z.string(),
  type: z.enum(['A', 'B', 'C', 'D', 'Content', 'Partnership', 'SingleDomain']),
  status: z.enum(['pending', 'processing', 'completed', 'failed']),
  createdAt: z.date(),
  updatedAt: z.date(),
  progress: z.number().min(0).max(100),
  metadata: z.record(z.unknown()).optional(),
  error: z.string().optional(),
  downloadUrl: z.string().optional(),
});

// Report data schemas
export const ReportDataSchema = z.object({
  title: z.string(),
  subtitle: z.string().optional(),
  author: z.string().optional(),
  date: z.string(),
  data: z.record(z.unknown()),
});

// API request schemas
export const CreateJobRequestSchema = z.object({
  reportType: z.enum([
    'A',
    'B',
    'C',
    'D',
    'Content',
    'Partnership',
    'SingleDomain',
  ]),
  data: ReportDataSchema.optional(),
  options: z
    .object({
      format: z.enum(['A4', 'A3', 'Letter']).default('A4'),
      orientation: z.enum(['portrait', 'landscape']).default('portrait'),
      quality: z.number().min(1).max(100).default(100),
    })
    .optional(),
});

export const JobStatusResponseSchema = z.object({
  job: JobSchema,
  message: z.string().optional(),
});

// Type exports
export type Job = z.infer<typeof JobSchema>;
export type ReportData = z.infer<typeof ReportDataSchema>;
export type CreateJobRequest = z.infer<typeof CreateJobRequestSchema>;
export type JobStatusResponse = z.infer<typeof JobStatusResponseSchema>;

// Chart data schemas for advanced visualizations
export const ChartDataSchema = z.object({
  type: z.enum(['line', 'bar', 'pie', 'scatter', 'area', 'radar', 'worldMap']),
  data: z.array(
    z.object({
      label: z.string(),
      value: z.number(),
      metadata: z.record(z.unknown()).optional(),
    })
  ),
  options: z
    .object({
      title: z.string().optional(),
      colors: z.array(z.string()).optional(),
      width: z.number().default(800),
      height: z.number().default(600),
    })
    .optional(),
});

export type ChartData = z.infer<typeof ChartDataSchema>;
