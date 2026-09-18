"use client";

import { useState } from "react";
import type { TranslationListItem } from "@/entities/translation-page/translationPageDomains";

// Mock data strictly matching the design
const mockData: TranslationListItem[] = [
  {
    id: "tx-001",
    fileName: "Quantum_Computing_Principles_v3.pdf",
    category: "Academic Paper",
    badges: ["Vector SVG Preserved"],
    sourceLang: "English",
    targetLang: "Spanish",
    sourceLangCode: "EN",
    targetLangCode: "ES",
    pageCount: 48,
    fileSizeMb: 14.2,
    status: "completed",
    processedAt: "Today, 2:45 PM",
    durationText: "Duration: 18s"
  },
  {
    id: "tx-002",
    fileName: "Falcon_Heavy_Propulsion_Schematic.pdf",
    category: "CAD Technical Spec",
    badges: ["Extracting Vector Callouts"],
    sourceLang: "English",
    targetLang: "German",
    sourceLangCode: "EN",
    targetLangCode: "DE",
    pageCount: 112,
    fileSizeMb: 38.6,
    status: "processing",
    progressPercentage: 68,
    processedAt: "Today, 11:20 AM",
    durationText: "Est. ~45s left"
  },
  {
    id: "tx-003",
    fileName: "Global_Macroeconomic_Outlook_2025.pdf",
    category: "Financial Report",
    badges: ["Table Formulas Synced"],
    sourceLang: "French",
    targetLang: "English",
    sourceLangCode: "FR",
    targetLangCode: "EN",
    pageCount: 24,
    fileSizeMb: 6.8,
    status: "completed",
    processedAt: "Yesterday, 4:15 PM",
    durationText: "Duration: 9s"
  },
  {
    id: "tx-004",
    fileName: "Biochemical_Synthesis_Patents_Corrupted.pdf",
    category: "Scanned Document",
    badges: ["Password Protected / DRM"],
    sourceLang: "Japanese",
    targetLang: "English",
    sourceLangCode: "JA",
    targetLangCode: "EN",
    pageCount: 16,
    fileSizeMb: 5.1,
    status: "failed",
    errorMessage: "Aborted at 4%",
    processedAt: "Oct 24, 2024"
  },
  {
    id: "tx-005",
    fileName: "Robotics_Kinematics_Handbook_Ch4.pdf",
    category: "Textbook Chapter",
    badges: ["LaTeX Math Block Parsed"],
    sourceLang: "English",
    targetLang: "Chinese",
    sourceLangCode: "EN",
    targetLangCode: "ZH",
    pageCount: 64,
    fileSizeMb: 21.0,
    status: "completed",
    processedAt: "Oct 22, 2024",
    durationText: "Duration: 24s"
  }
];

export function useTranslationList() {
  const [data] = useState<TranslationListItem[]>(mockData);
  const [isEmpty, setIsEmpty] = useState(false);

  // In a real application, fetching logic and API integration goes here.
  // We provide a toggle function to easily demo the empty state during implementation.
  const toggleEmptyState = () => setIsEmpty(!isEmpty);

  return {
    data: isEmpty ? [] : data,
    isEmpty,
    toggleEmptyState,
    totalCount: isEmpty ? 0 : 14,
    storageUsedMb: 85.7,
    storageTotalMb: 1024,
  };
}
