"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";

export interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const LANGUAGES = [
  { code: "es", label: "Spanish (Español)" },
  { code: "de", label: "German (Deutsch)" },
  { code: "ja", label: "Japanese (日本語)" },
  { code: "fr", label: "French (Français)" },
  { code: "zh", label: "Chinese (Simplified)" },
  { code: "pt", label: "Portuguese (Português)" },
  { code: "it", label: "Italian (Italiano)" },
  { code: "ko", label: "Korean (한국어)" },
  { code: "tr", label: "Turkish (Türkçe)" },
];

/**
 * Language selection dropdown styled perfectly to match the landing page.
 */
export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex-1 flex flex-col gap-1">
      <label
        htmlFor="lang-select"
        className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1"
      >
        <Icon name="language" size={16} className="text-primary" />
        Translate to
      </label>
      <div className="relative w-full">
        <select
          id="lang-select"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-11 pl-3 pr-9 rounded-lg bg-surface-container-low text-on-surface font-body-md text-body-md appearance-none focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer shadow-inner"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <Icon
          name="expand_more"
          size={18}
          className="text-on-surface-variant absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        />
      </div>
    </div>
  );
}
