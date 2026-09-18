"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";
import type { UserPreferences, FormalityLevel, TranslationEngine } from "@/entities/settings/settingsDomains";

interface PreferencesFormProps {
  preferences: UserPreferences;
  onUpdate: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  onSave: () => void;
  onDiscard: () => void;
  isSaving: boolean;
  isSaved: boolean;
}

export function PreferencesForm({
  preferences,
  onUpdate,
  onSave,
  onDiscard,
  isSaving,
  isSaved,
}: PreferencesFormProps) {
  return (
    <section className="flex flex-col gap-space-lg">
      
      {/* Section Title & Lead */}
      <div className="flex flex-col gap-1">
        <h3 className="font-headline-lg text-headline-lg text-on-surface font-bold">Translation &amp; Reading Preferences</h3>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
          Configure how TransDoc processes, renders, and translates your technical publications and documents by default.
        </p>
      </div>

      {/* CARD 1: Default Target Language */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex items-start justify-between gap-space-md">
          <div className="flex flex-col gap-1 max-w-xl">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
                <Icon name="translate" size={18} />
              </span>
              <label htmlFor="target-language-select" className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Default target language
              </label>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              New translation jobs will automatically select this locale as default.
            </p>
          </div>
        </div>

        {/* Dropdown Select & Secondary Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md pt-space-xs">
          
          <div className="flex flex-col gap-1.5">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Primary Output Locale</span>
            <div className="relative w-full">
              <select 
                id="target-language-select"
                value={preferences.targetLanguage}
                onChange={(e) => onUpdate("targetLanguage", e.target.value)}
                className="w-full h-[42px] px-3.5 pr-10 bg-surface text-on-surface rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer font-body-md text-body-md"
              >
                <option value="es-ES">🇪🇸 Spanish (Español) - es-ES</option>
                <option value="de-DE">🇩🇪 German (Deutsch) - de-DE</option>
                <option value="ja-JP">🇯🇵 Japanese (日本語) - ja-JP</option>
                <option value="fr-FR">🇫🇷 French (Français) - fr-FR</option>
                <option value="zh-CN">🇨🇳 Simplified Chinese (简体中文) - zh-CN</option>
                <option value="pt-BR">🇧🇷 Portuguese (Português) - pt-BR</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-on-surface-variant">
                <Icon name="expand_more" size={20} />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant">Localization Formality</span>
            <div className="relative w-full">
              <select 
                value={preferences.formality}
                onChange={(e) => onUpdate("formality", e.target.value as FormalityLevel)}
                className="w-full h-[42px] px-3.5 pr-10 bg-surface text-on-surface rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer font-body-md text-body-md"
              >
                <option value="academic">Academic &amp; Formal (ISO standard)</option>
                <option value="technical">Technical Direct (Literal math/code)</option>
                <option value="commercial">Commercial Standard (Executive brief)</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-on-surface-variant">
                <Icon name="expand_more" size={20} />
              </div>
            </div>
          </div>

        </div>

        {/* Auto-detect toggle inside Card 1 */}
        <div className="flex items-center justify-between pt-space-sm mt-space-xs bg-surface-container-low p-space-sm rounded-lg">
          <div className="flex flex-col pr-space-md">
            <span className="font-label-lg text-label-lg text-on-surface">Auto-detect source document language</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">Inspects embedded text layers and character encoding automatically prior to rendering.</span>
          </div>
          <label htmlFor="autodetect-toggle" className="relative inline-flex items-center cursor-pointer flex-shrink-0">
            <input 
              type="checkbox" 
              id="autodetect-toggle" 
              className="sr-only peer" 
              checked={preferences.autoDetectLanguage}
              onChange={(e) => onUpdate("autoDetectLanguage", e.target.checked)}
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary-container after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
          </label>
        </div>
      </div>

      {/* CARD 2: Preferred Translation Engine */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col gap-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <Icon name="neurology" size={18} />
            </span>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Preferred translation engine</h4>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Select which neural foundation model executes your technical document translations.
          </p>
        </div>

        {/* Engine Selection Options (Radio Cards) */}
        <div role="radiogroup" aria-label="Preferred translation engine" className="grid grid-cols-1 gap-space-sm pt-space-xs">
          
          <label className={cn(
            "relative flex items-start gap-space-md p-space-md rounded-xl cursor-pointer transition-all shadow-sm",
            preferences.engine === "auto" ? "bg-surface-container-low" : "bg-surface hover:bg-surface-container-low"
          )}>
            <div className="flex items-center h-5 mt-1">
              <input 
                type="radio" 
                name="engine-selection" 
                value="auto" 
                checked={preferences.engine === "auto"}
                onChange={() => onUpdate("engine", "auto")}
                className="w-4 h-4 text-primary bg-surface focus:ring-primary focus:ring-2" 
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Auto (Recommended)</span>
                  <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps">Recommended</span>
                </div>
                {preferences.engine === "auto" && (
                  <span className="font-label-md text-label-md text-on-surface-variant flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Active • v4.2 Pipeline
                  </span>
                )}
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Dynamically selects optimal engine based on domain (LaTeX, tables, biomedical, or legal). Currently routing via Neural v4.2.
              </p>
            </div>
          </label>

          <label className={cn(
            "relative flex items-start gap-space-md p-space-md rounded-xl cursor-pointer transition-all",
            preferences.engine === "deepl" ? "bg-surface-container-low shadow-sm" : "bg-surface hover:bg-surface-container-low"
          )}>
            <div className="flex items-center h-5 mt-1">
              <input 
                type="radio" 
                name="engine-selection" 
                value="deepl" 
                checked={preferences.engine === "deepl"}
                onChange={() => onUpdate("engine", "deepl")}
                className="w-4 h-4 text-primary bg-surface focus:ring-primary focus:ring-2" 
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">DeepL Pro</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">High Fidelity</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Optimized for natural conversational syntax and high European language fidelity. Best for standard business and patent documents.
              </p>
            </div>
          </label>

          <label className={cn(
            "relative flex items-start gap-space-md p-space-md rounded-xl cursor-pointer transition-all",
            preferences.engine === "claude" ? "bg-surface-container-low shadow-sm" : "bg-surface hover:bg-surface-container-low"
          )}>
            <div className="flex items-center h-5 mt-1">
              <input 
                type="radio" 
                name="engine-selection" 
                value="claude"
                checked={preferences.engine === "claude"}
                onChange={() => onUpdate("engine", "claude")}
                className="w-4 h-4 text-primary bg-surface focus:ring-primary focus:ring-2" 
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Claude 3.5 Sonnet</span>
                <span className="px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">Advanced STEM</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Highest benchmark for scientific papers, complex LaTeX proofs, and nuanced academic jargon with structural preservation.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* CARD 3: Document Layout & Diagram Handling */}
      <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-col gap-1 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <Icon name="schema" size={18} />
            </span>
            <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">Document Layout &amp; Diagram Handling</h4>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Control vector diagram preservation, math syntax engines, and multi-lingual overlays.
          </p>
        </div>

        {/* Toggles List */}
        <div className="flex flex-col gap-space-sm pt-space-xs">
          
          <div className="flex items-center justify-between p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-all">
            <div className="flex flex-col pr-space-md">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-bold">Always show bilingual diagrams</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps">Visual Dual-Layer</span>
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Keep source and translated callout annotations simultaneously visible beside vector diagrams, charts, and equations.
              </span>
            </div>
            <label htmlFor="bilingual-toggle" className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input 
                type="checkbox" 
                id="bilingual-toggle" 
                className="sr-only peer"
                checked={preferences.bilingualDiagrams}
                onChange={(e) => onUpdate("bilingualDiagrams", e.target.checked)}
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary-container after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-all">
            <div className="flex flex-col pr-space-md">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Preserve Vector LaTeX Formulas intact</span>
                <Icon name="functions" size={16} className="text-on-surface-variant" />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Equations, matrices, and tensor notations bypass translation to guarantee numerical precision and avoid symbol disruption.
              </span>
            </div>
            <label htmlFor="latex-toggle" className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input 
                type="checkbox" 
                id="latex-toggle" 
                className="sr-only peer"
                checked={preferences.preserveLatex}
                onChange={(e) => onUpdate("preserveLatex", e.target.checked)}
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary-container after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-space-md rounded-xl bg-surface hover:bg-surface-container-low transition-all">
            <div className="flex flex-col pr-space-md">
              <div className="flex items-center gap-2">
                <span className="font-label-lg text-label-lg text-on-surface font-semibold">Automatic Glossary Extraction</span>
                <Icon name="menu_book" size={16} className="text-on-surface-variant" />
              </div>
              <span className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                Extract acronyms, defined terms, and specialized terminology during ingestion to enforce naming consistency across sections.
              </span>
            </div>
            <label htmlFor="glossary-toggle" className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input 
                type="checkbox" 
                id="glossary-toggle" 
                className="sr-only peer"
                checked={preferences.autoGlossary}
                onChange={(e) => onUpdate("autoGlossary", e.target.checked)}
              />
              <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface peer-checked:bg-primary-container after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-surface after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
            </label>
          </div>
        </div>
      </div>

      {/* FOOTER ACTION BAR */}
      <div className="sticky bottom-4 z-40 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl p-space-md shadow-md flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-2">
          <Icon name="sync" size={18} className="text-primary" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            All preferences automatically sync across desktop sessions &amp; web extensions.
          </span>
        </div>
        <div className="flex items-center gap-space-sm ml-auto">
          <button 
            type="button" 
            onClick={onDiscard}
            disabled={isSaving}
            className="px-4 py-2 text-on-surface hover:bg-surface-container-high rounded-lg font-label-lg text-label-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            Discard Changes
          </button>
          
          <button 
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className={cn(
              "inline-flex items-center gap-1.5 px-6 py-2 rounded-lg font-label-lg text-label-lg transition-all shadow-sm cursor-pointer",
              isSaved ? "bg-emerald-600 text-white" : "bg-primary-container hover:bg-primary text-on-primary",
              isSaving && "opacity-75 cursor-wait"
            )}
          >
            {isSaving ? (
              <>
                <Icon name="progress_activity" size={18} className="animate-spin" />
                <span>Saving...</span>
              </>
            ) : isSaved ? (
              <>
                <Icon name="done_all" size={18} />
                <span>Preferences Saved</span>
              </>
            ) : (
              <>
                <Icon name="check" size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
