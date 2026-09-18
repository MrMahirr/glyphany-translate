/**
 * Translation Domain Types.
 * Çeviri işlemleri için domain tipleri ve request/response modelleri.
 */

/* ─── Request Payloads ─── */

export interface CreateTranslationPayload {
  file: File;
  targetLang: string;
}

export interface TranslationListParams {
  page?: number;
  limit?: number;
  status?: TranslationStatus;
  search?: string;
}

/* ─── Response Types ─── */

export interface TranslationResponse {
  id: string;
  originalFileName: string;
  targetLanguage: string;
  status: TranslationStatus;
  progress: number; // 0-100
  createdAt: string;
  completedAt?: string;
  downloadUrl?: string;
  pageCount?: number;
}

export interface TranslationListResponse {
  items: TranslationResponse[];
  totalCount: number;
  page: number;
  totalPages: number;
}

/* ─── Enums ─── */

export type TranslationStatus = 
  | "pending" 
  | "processing" 
  | "completed" 
  | "failed";
