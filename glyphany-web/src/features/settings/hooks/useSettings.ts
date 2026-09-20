"use client";

import { useState, useEffect } from "react";
import type { UserPreferences } from "@/entities/settings/settingsDomains";
import { apiClient } from "@/lib/http";
import { SettingsApiMethod } from "@/constant/MethodNames";
import { toast } from "react-hot-toast";

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
  const [originalPreferences, setOriginalPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await apiClient.get(SettingsApiMethod.GET);
        const data = response.data as any;
        const mappedPrefs: UserPreferences = {
          targetLanguage: data.defaultTargetLang || "es-ES",
          formality: data.formality || "academic",
          autoDetectLanguage: data.autoDetectLang ?? true,
          engine: data.defaultEngine || "auto",
          bilingualDiagrams: data.bilingualDiagrams ?? true,
          preserveLatex: data.latexRendering ?? true,
          autoGlossary: data.glossaryExtraction ?? true,
        };
        setPreferences(mappedPrefs);
        setOriginalPreferences(mappedPrefs);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updatePreference = <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setIsSaved(false);
    
    try {
      const payload = {
        defaultTargetLang: preferences.targetLanguage,
        formality: preferences.formality,
        autoDetectLang: preferences.autoDetectLanguage,
        defaultEngine: preferences.engine,
        bilingualDiagrams: preferences.bilingualDiagrams,
        latexRendering: preferences.preserveLatex,
        glossaryExtraction: preferences.autoGlossary,
      };
      
      await apiClient.patch(SettingsApiMethod.UPDATE, payload);
      setOriginalPreferences(preferences);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
      toast.success("Settings saved successfully.");
    } catch (err) {
      console.error("Failed to save settings:", err);
      toast.error("Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  const discardChanges = () => {
    setPreferences(originalPreferences);
  };

  return {
    preferences,
    updatePreference,
    savePreferences,
    discardChanges,
    isSaving,
    isSaved,
    isLoading
  };
}
