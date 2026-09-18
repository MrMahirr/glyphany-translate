export type FormalityLevel = "academic" | "technical" | "commercial";
export type TranslationEngine = "auto" | "deepl" | "claude";

export interface UserPreferences {
  targetLanguage: string;
  formality: FormalityLevel;
  autoDetectLanguage: boolean;
  engine: TranslationEngine;
  bilingualDiagrams: boolean;
  preserveLatex: boolean;
  autoGlossary: boolean;
}
