"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";
import type { TranslationListItem } from "@/entities/translation-page/translationPageDomains";

interface TranslationTableRowProps {
  item: TranslationListItem;
}

export function TranslationTableRow({ item }: TranslationTableRowProps) {
  
  // Render the Document Preview Icon based on category or status
  const renderPreviewIcon = () => {
    if (item.status === "failed") {
      return (
        <div className="relative w-11 h-14 rounded-md bg-rose-50 flex-shrink-0 flex flex-col items-center justify-between p-1.5 shadow-sm overflow-hidden">
          <div className="w-full flex items-center justify-between">
            <span className="bg-rose-500 text-white text-[8px] font-extrabold px-1 rounded-sm leading-tight">PDF</span>
            <Icon name="lock" size={12} className="text-error" />
          </div>
          <div className="w-full text-center">
            <Icon name="warning" size={14} className="text-error" />
          </div>
          <div className="w-full h-1 bg-rose-200 rounded"></div>
        </div>
      );
    }
    
    if (item.status === "processing") {
      return (
        <div className="relative w-11 h-14 rounded-md bg-surface-container flex-shrink-0 flex flex-col items-center justify-between p-1.5 shadow-sm overflow-hidden">
          <div className="w-full flex items-center justify-between">
            <span className="bg-rose-500 text-white text-[8px] font-extrabold px-1 rounded-sm leading-tight">PDF</span>
            <Icon name="architecture" size={10} className="text-primary" />
          </div>
          <div className="w-full h-4 border-dashed border-primary/40 rounded flex items-center justify-center">
            <Icon name="hub" size={10} className="text-primary/60" />
          </div>
          <div className="w-full bg-primary/20 h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-2/3 animate-pulse"></div>
          </div>
        </div>
      );
    }

    // Default Completed Preview (e.g., Financial Report / Academic Paper)
    return (
      <div className="relative w-11 h-14 rounded-md bg-surface-container flex-shrink-0 flex flex-col items-center justify-between p-1.5 shadow-sm overflow-hidden group-hover:shadow-md transition-shadow">
        <div className="w-full flex items-center justify-between">
          <span className="bg-rose-500 text-white text-[8px] font-extrabold px-1 rounded-sm leading-tight">PDF</span>
          <Icon name="schema" size={10} className="text-primary" />
        </div>
        <div className="w-full space-y-1">
          <div className="h-1 w-full bg-outline-variant/40 rounded"></div>
          <div className="h-1 w-4/5 bg-outline-variant/30 rounded"></div>
          <div className="h-1 w-2/3 bg-outline-variant/20 rounded"></div>
        </div>
        <div className="w-full flex justify-end">
          <Icon name="done_all" size={10} className="text-emerald-600" />
        </div>
      </div>
    );
  };

  return (
    <tr className="hover:bg-surface-container-low/40 transition-colors group">
      
      {/* Document Column */}
      <td className="py-4 px-space-md">
        <div className="flex items-center gap-space-md min-w-0">
          {renderPreviewIcon()}
          
          <div className="min-w-0">
            <Link 
              href={
                item.status === "completed" 
                  ? `/translate/${item.id}/reader` 
                  : item.status === "processing" 
                    ? `/translate/${item.id}/progress` 
                    : `/translate/${item.id}/failed`
              } 
              className="font-headline-sm text-[15px] font-bold text-on-surface hover:text-primary transition-colors truncate block"
            >
              {item.fileName}
            </Link>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="font-label-caps text-label-caps text-on-surface-variant font-medium">
                {item.category}
              </span>
              <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
              {item.badges.map((badge, idx) => (
                <span 
                  key={idx} 
                  className={cn(
                    "font-label-caps text-label-caps font-semibold",
                    item.status === "failed" ? "text-error" : 
                    item.status === "processing" ? "text-primary-container" : "text-primary"
                  )}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </td>

      {/* Languages Column */}
      <td className="py-4 px-space-md">
        <div className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container font-label-md text-label-md text-on-surface",
          item.status === "failed" && "opacity-75"
        )}>
          <span className="font-bold text-primary">{item.sourceLangCode}</span>
          <Icon name="arrow_forward" size={14} className="text-outline" />
          <span className="font-bold text-secondary">{item.targetLangCode}</span>
          <span className="text-on-surface-variant text-[11px] ml-1">({item.sourceLangCode} → {item.targetLangCode === "EN" ? "US" : item.targetLangCode})</span>
        </div>
      </td>

      {/* Pages & Size Column */}
      <td className="py-4 px-space-md">
        <div className="flex flex-col">
          <span className="font-body-md text-body-md text-on-surface font-medium">{item.pageCount} pages</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">{item.fileSizeMb.toFixed(1)} MB</span>
        </div>
      </td>

      {/* Status Column */}
      <td className="py-4 px-space-md">
        {item.status === "completed" && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-label-md text-label-md font-semibold">Completed</span>
            {item.category === "Academic Paper" && (
              <Icon name="verified" size={16} className="text-emerald-600 ml-0.5" />
            )}
          </div>
        )}
        
        {item.status === "processing" && (
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-fixed text-primary font-label-md text-label-md">
            <svg className="animate-spin h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
            </svg>
            <span className="font-semibold">Stage 3/4 • {item.progressPercentage}%</span>
          </div>
        )}

        {item.status === "failed" && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-error cursor-help" title="Password protected or DRM encrypted. Please unlock and re-upload.">
            <Icon name="error" size={16} />
            <span className="font-label-md text-label-md font-semibold">Failed</span>
          </div>
        )}
      </td>

      {/* Date Column */}
      <td className="py-4 px-space-md">
        <div className="flex flex-col">
          <span className="font-label-md text-label-md text-on-surface font-medium">{item.processedAt}</span>
          {item.durationText && (
            <span className={cn(
              "font-body-sm text-body-sm text-[11px]",
              item.status === "processing" ? "text-primary font-semibold" : "text-on-surface-variant"
            )}>
              {item.durationText}
            </span>
          )}
          {item.errorMessage && (
            <span className="font-body-sm text-body-sm text-on-surface-variant text-[11px]">{item.errorMessage}</span>
          )}
        </div>
      </td>

      {/* Actions Column */}
      <td className="py-4 px-space-md text-right">
        <div className="flex items-center justify-end gap-1">
          
          {item.status === "completed" && (
            <>
              <button title="Open in Split-Pane Reader" className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
                <Icon name="visibility" size={20} />
              </button>
              <button title="Download" className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
                <Icon name="download" size={20} />
              </button>
            </>
          )}

          {item.status === "processing" && (
            <>
              <button title="View Live Pipeline Stream" className="p-1.5 text-primary hover:bg-primary-fixed rounded-lg transition-colors cursor-pointer">
                <Icon name="sync" size={20} />
              </button>
              <button title="Cancel Job" className="p-1.5 text-outline-variant hover:text-error hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
                <Icon name="cancel" size={20} />
              </button>
            </>
          )}

          {item.status === "failed" && (
            <>
              <button title="Provide Decryption Key & Retry" className="px-2 py-1 text-primary hover:bg-primary-fixed font-label-md text-label-md rounded-md transition-colors flex items-center gap-1 cursor-pointer">
                <Icon name="refresh" size={16} />
                <span>Retry</span>
              </button>
            </>
          )}

          {(item.status === "completed" || item.status === "failed") && (
            <button title={item.status === "failed" ? "Dismiss Job" : "Delete"} className="p-1.5 text-on-surface-variant hover:text-error hover:bg-rose-50 rounded-lg transition-colors cursor-pointer">
              <Icon name="delete" size={20} />
            </button>
          )}

        </div>
      </td>
    </tr>
  );
}
