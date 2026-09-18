export type TranslationStatus = "completed" | "processing" | "failed";
export type DocumentCategory = "Academic Paper" | "Financial Report" | "CAD Technical Spec" | "Scanned Document" | "Textbook Chapter" | "General";

export interface TranslationListItem {
  id: string;
  fileName: string;
  category: DocumentCategory;
  badges: string[]; // e.g. "Vector SVG Preserved", "Extracting Vector Callouts"
  sourceLang: string;
  targetLang: string;
  sourceLangCode: string;
  targetLangCode: string;
  pageCount: number;
  fileSizeMb: number;
  status: TranslationStatus;
  progressPercentage?: number;
  errorMessage?: string;
  processedAt: string; // "Today, 2:45 PM"
  durationText?: string;
}
