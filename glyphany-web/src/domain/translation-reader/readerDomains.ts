export type ReaderViewMode = "split" | "source" | "target";

export interface DocumentNode {
  id: string;
  type: "paragraph" | "heading" | "equation" | "diagram" | "note";
  content: string; // HTML string or plain text
  originalContent?: string; // For source text in the target pane, or vice-versa
  metadata?: any;
}

export interface DocumentPage {
  pageNumber: number;
  sourceNodes: DocumentNode[];
  targetNodes: DocumentNode[];
}

export interface ReaderDocument {
  id: string;
  title: string;
  totalPages: number;
  sourceLang: string;
  targetLang: string;
  pages: DocumentPage[];
}
