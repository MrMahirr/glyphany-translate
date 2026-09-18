"use client";

import { useState } from "react";
import type { UserPreferences } from "@/entities/settings/settingsDomains";

const defaultPreferences: UserPreferences = {
  targetLanguage: "es-ES",
  formality: "academic",
  autoDetectLanguage: true,
  engine: "auto",
  bilingualDiagrams: true,
  preserveLatex: true,
  autoGlossary: true,
};

export function useSettings() {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setIsSaved(false);
    
    // Simulate API call latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSaving(false);
    setIsSaved(true);
    
    // Reset the success state after a delay
    setTimeout(() => setIsSaved(false), 2000);
  };

  const discardChanges = () => {
    setPreferences(defaultPreferences);
  };

  return {
    preferences,
    updatePreference,
    savePreferences,
    discardChanges,
    isSaving,
    isSaved,
  };
}
