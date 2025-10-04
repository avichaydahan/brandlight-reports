import {
  getFirestore,
  FieldValue,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { Job, JobSchema } from '../types/index.js';
import { config } from '../config/index.js';
import { createLogger } from '../utils/logger.js';

const logger = createLogger('FirestoreService');

export class FirestoreService {
  private db = getFirestore();

  async createJob(
    jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Job> {
    try {
      const docRef = this.db
        .collection(config.firestore.collections.jobs)
        .doc();
      const now = new Date();

      const job: Job = {
        id: docRef.id,
        createdAt: now,
        updatedAt: now,
        ...jobData,
      };

      // Validate data before saving
      const validatedJob = JobSchema.parse(job);

      await docRef.set({
        ...jobData,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      logger.info(`Job created successfully: ${job.id}`);
      return validatedJob;
    } catch (error) {
      logger.error('Failed to create job', error as Error);
      throw error;
    }
  }

  async updateJob(
    jobId: string,
    updates: Partial<Omit<Job, 'id' | 'createdAt'>>
  ): Promise<void> {
    try {
      const docRef = this.db
        .collection(config.firestore.collections.jobs)
        .doc(jobId);

      await docRef.update({
        ...updates,
        updatedAt: FieldValue.serverTimestamp(),
      });

      logger.info(`Job updated successfully: ${jobId}`);
    } catch (error) {
      logger.error(`Failed to update job: ${jobId}`, error as Error);
      throw error;
    }
  }

  async getJob(jobId: string): Promise<Job | null> {
    try {
      const doc = await this.db
        .collection(config.firestore.collections.jobs)
        .doc(jobId)
        .get();

      if (!doc.exists) {
        logger.warn(`Job not found: ${jobId}`);
        return null;
      }

      const data = doc.data();
      if (!data) {
        return null;
      }

      // Convert Firestore timestamps back to Date objects
      const job = {
        ...data,
        createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt),
        updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt),
      };

      // Validate the retrieved data
      return JobSchema.parse(job);
    } catch (error) {
      logger.error(`Failed to get job: ${jobId}`, error as Error);
      throw error;
    }
  }

  async deleteOldJobs(olderThanDays = 30): Promise<number> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

      const snapshot = await this.db
        .collection(config.firestore.collections.jobs)
        .where('createdAt', '<', cutoffDate)
        .get();

      const batch = this.db.batch();
      snapshot.docs.forEach((doc: QueryDocumentSnapshot) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      const deletedCount = snapshot.docs.length;

      logger.info(
        `Deleted ${deletedCount} old jobs older than ${olderThanDays} days`
      );
      return deletedCount;
    } catch (error) {
      logger.error('Failed to delete old jobs', error as Error);
      throw error;
    }
  }

  async getJobStats(): Promise<{
    total: number;
    pending: number;
    processing: number;
    completed: number;
    failed: number;
  }> {
    try {
      // Simplified stats for now due to Firestore limitations
      const snapshot = await this.db
        .collection(config.firestore.collections.jobs)
        .get();
      const jobs = snapshot.docs.map((doc: QueryDocumentSnapshot) =>
        doc.data()
      );

      const stats = {
        total: jobs.length,
        pending: jobs.filter((job: any) => job.status === 'pending').length,
        processing: jobs.filter((job: any) => job.status === 'processing')
          .length,
        completed: jobs.filter((job: any) => job.status === 'completed').length,
        failed: jobs.filter((job: any) => job.status === 'failed').length,
      };

      logger.info('Retrieved job statistics', stats);
      return stats;
    } catch (error) {
      logger.error('Failed to get job statistics', error as Error);
      throw error;
    }
  }
}
