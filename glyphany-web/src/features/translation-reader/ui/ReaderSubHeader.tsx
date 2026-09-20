"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";
import type { ReaderViewMode } from "@/domain/translation-reader/readerDomains";

interface ReaderSubHeaderProps {
  viewMode: ReaderViewMode;
  onViewModeChange: (mode: ReaderViewMode) => void;
  downloadUrl?: string;
  hasUnsavedChanges?: boolean;
  onRegenerate?: () => void;
  isRegenerating?: boolean;
}

export function ReaderSubHeader({ viewMode, onViewModeChange, downloadUrl, hasUnsavedChanges, onRegenerate, isRegenerating }: ReaderSubHeaderProps) {
  return (
    <section className="sticky top-16 z-30 w-full bg-surface-container-lowest/95 backdrop-blur-md shadow-sm px-gutter py-2.5">
      <div className="max-w-[1720px] mx-auto flex flex-wrap items-center justify-between gap-space-sm">
        
        {/* Left: File status & lineage badges */}
        <div className="flex items-center gap-space-sm">
          <Link href="/translations" className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors flex items-center justify-center">
            <Icon name="arrow_back" size={20} />
          </Link>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-surface-container font-label-caps text-label-caps text-primary tracking-wider uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              100% Translated
            </span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps">
              Neural v4.2 Vector
            </span>
          </div>
        </div>

        {/* Center: Split Mode View Toggles */}
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl shadow-inner">
          <button 
            type="button"
            onClick={() => onViewModeChange("split")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer",
              viewMode === "split" 
                ? "bg-surface-container-lowest text-primary shadow-sm" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Icon name="vertical_split" size={17} />
            <span>Dual Split View</span>
          </button>
          <button 
            type="button"
            onClick={() => onViewModeChange("source")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer",
              viewMode === "source" 
                ? "bg-surface-container-lowest text-primary shadow-sm" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Icon name="article" size={17} />
            <span>Original Only</span>
          </button>
          <button 
            type="button"
            onClick={() => onViewModeChange("target")}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-md text-label-md transition-all cursor-pointer",
              viewMode === "target" 
                ? "bg-surface-container-lowest text-primary shadow-sm" 
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Icon name="translate" size={17} />
            <span>Target Flow</span>
          </button>
        </div>

        {/* Right: Sync Scrolling State & Fast Action Tools */}
        <div className="flex items-center gap-space-sm">
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant font-label-caps text-label-caps">
            <Icon name="sync" size={15} className="text-primary" />
            <span>Synced Scrolling Active</span>
          </div>
          
          <div className="h-4 w-px bg-surface-container-high hidden md:block"></div>
          
          <div className="flex items-center gap-1">
            <button type="button" title="Terminology Glossary Inspector" className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
              <Icon name="dictionary" size={19} />
            </button>
            <button type="button" title="Full Screen View" className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-primary transition-colors flex items-center justify-center cursor-pointer">
              <Icon name="fullscreen" size={19} />
            </button>

            {/* Regenerate PDF Button - visible when user has edited blocks */}
            {hasUnsavedChanges && (
              <button
                type="button"
                onClick={onRegenerate}
                disabled={isRegenerating}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-label-lg text-label-lg shadow-sm transition-all cursor-pointer",
                  isRegenerating
                    ? "bg-surface-container-high text-on-surface-variant opacity-60 cursor-wait"
                    : "bg-tertiary text-on-tertiary hover:opacity-90 animate-pulse"
                )}
              >
                <Icon name="refresh" size={18} className={isRegenerating ? "animate-spin" : ""} />
                <span className="hidden md:inline">{isRegenerating ? "Rebuilding..." : "Regenerate PDF"}</span>
              </button>
            )}

            {downloadUrl ? (
              <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 bg-primary-container text-on-primary px-3 py-1.5 rounded-lg font-label-lg text-label-lg hover:bg-primary shadow-sm transition-all cursor-pointer">
                <Icon name="picture_as_pdf" size={18} />
                <span className="hidden md:inline">Download Translated</span>
              </a>
            ) : (
              <button type="button" disabled className="flex items-center gap-1.5 bg-surface-container-high text-on-surface-variant px-3 py-1.5 rounded-lg font-label-lg text-label-lg opacity-50 cursor-not-allowed">
                <Icon name="picture_as_pdf" size={18} />
                <span className="hidden md:inline">Download Translated</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
