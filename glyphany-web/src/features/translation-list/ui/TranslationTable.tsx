"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import { TranslationTableRow } from "./TranslationTableRow";
import type { TranslationListItem } from "@/entities/translation-page/translationPageDomains";

interface TranslationTableProps {
  data: TranslationListItem[];
  totalCount: number;
  storageUsedMb: number;
  storageTotalMb: number;
  onCancel?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function TranslationTable({ data, totalCount, storageUsedMb, storageTotalMb, onCancel, onDelete }: TranslationTableProps) {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low/60 text-on-surface-variant font-label-caps text-label-caps tracking-wider uppercase">
              <th className="py-3.5 px-space-md font-semibold">Document</th>
              <th className="py-3.5 px-space-md font-semibold">Languages</th>
              <th className="py-3.5 px-space-md font-semibold">Pages &amp; Size</th>
              <th className="py-3.5 px-space-md font-semibold">Status</th>
              <th className="py-3.5 px-space-md font-semibold">Date Processed</th>
              <th className="py-3.5 px-space-md font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {data.map((item) => (
              <TranslationTableRow 
                key={item.id} 
                item={item} 
                onCancel={onCancel}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination & Storage Summary Bar */}
      <div className="px-space-md py-4 bg-surface-container-low/40 flex flex-col sm:flex-row items-center justify-between gap-space-md border-t border-outline-variant/30">
        
        <div className="flex items-center gap-3">
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Showing <strong className="font-semibold text-on-surface">1</strong> to <strong className="font-semibold text-on-surface">{data.length}</strong> of <strong className="font-semibold text-on-surface">{totalCount}</strong> translation jobs
          </span>
          <span className="hidden md:inline text-outline-variant">•</span>
          <span className="hidden md:inline font-body-sm text-body-sm text-on-surface-variant">
            Storage: <span className="font-semibold text-on-surface">{storageUsedMb} MB / {storageTotalMb / 1024} GB</span> (Free Academic Tier)
          </span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-1">
          <button type="button" disabled className="px-2.5 py-1 text-outline font-label-md text-label-md rounded-md hover:bg-surface-container transition-colors disabled:opacity-40 flex items-center cursor-not-allowed">
            <Icon name="chevron_left" size={16} />
            <span className="hidden sm:inline">Prev</span>
          </button>
          
          <button type="button" className="w-8 h-8 rounded-md bg-primary-container text-on-primary font-label-md text-label-md font-bold shadow-sm cursor-pointer">
            1
          </button>
          <button type="button" className="w-8 h-8 rounded-md hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors cursor-pointer">
            2
          </button>
          <button type="button" className="w-8 h-8 rounded-md hover:bg-surface-container text-on-surface font-label-md text-label-md transition-colors cursor-pointer">
            3
          </button>
          
          <button type="button" className="px-2.5 py-1 text-on-surface hover:text-primary font-label-md text-label-md rounded-md hover:bg-surface-container transition-colors flex items-center cursor-pointer">
            <span className="hidden sm:inline">Next</span>
            <Icon name="chevron_right" size={16} />
          </button>
        </div>

      </div>
    </div>
  );
}
