/**
 * Job Domain Types.
 * Çeviri işlemi durumunu (job) temsil eden modeller.
 */

export type JobStatus = 
  | "pending" 
  | "detecting_language" 
  | "analyzing_layout" 
  | "translating" 
  | "finalizing" 
  | "completed" 
  | "failed" 
  | "canceled";

export interface JobProgress {
  status: JobStatus;
  percentage: number; // 0-100
  estimatedTimeRemainingSec?: number;
  currentPage?: number;
  totalPages?: number;
  currentSpeedPagesPerSec?: number;
}

export interface JobMetadata {
  fileName: string;
  fileSize: number;
  pageCount: number;
  sourceLang: string;
  targetLang: string;
  engineVersion: string;
}

export interface JobStatusResponse {
  id: string;
  progress: JobProgress;
  metadata: JobMetadata;
  createdAt: string;
  updatedAt: string;
}
