"use client";

import React from "react";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { Footer } from "@/widgets/footer/Footer";
import { Icon } from "@/shared/ui/Icon";

import { StorageMetrics } from "@/features/translation-list/ui/StorageMetrics";
import { TranslationFilters } from "@/features/translation-list/ui/TranslationFilters";
import { TranslationTable } from "@/features/translation-list/ui/TranslationTable";
import { TranslationEmptyState } from "@/features/translation-list/ui/TranslationEmptyState";
import { useTranslationList } from "@/features/translation-list/hooks/useTranslationList";

export default function TranslationsPage() {
  const { data, isEmpty, toggleEmptyState, totalCount, storageUsedMb, storageTotalMb } = useTranslationList();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <LandingHeader />

      <main className="flex-1 w-full pt-16">
        <div className="flex flex-col w-full">
          
          {/* Secondary Context Navigation & Sub-Header Bar */}
          <div className="w-full bg-surface-container-low/70 backdrop-blur-md px-margin py-3 border-b-0">
            <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
              
              {/* Breadcrumb & Workspace Switcher */}
              <div className="flex items-center gap-space-sm min-w-0">
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-lowest rounded-lg shadow-sm">
                  <Icon name="folder_special" size={18} className="text-primary" />
                  <span className="font-label-md text-label-md text-on-surface font-semibold">Research Lab Workspace</span>
                  <Icon name="unfold_more" size={16} className="text-outline" />
                </div>
                <span className="text-outline-variant font-label-md">/</span>
                <span className="font-label-md text-label-md text-on-surface-variant truncate">Library &amp; Translation Queue</span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps tracking-wider">
                  v4.2 ENGINE
                </span>
              </div>

              {/* Live Engine Telemetry Pill */}
              <div className="flex items-center gap-space-md text-on-surface-variant font-label-md text-label-md">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface">Neural Layout Lock: Active</span>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 pl-space-sm bg-surface-container-high/60 px-2 py-0.5 rounded-md">
                  <Icon name="speed" size={16} className="text-primary" />
                  <span className="font-label-caps text-label-caps text-on-surface font-bold">GPU CLUSTER ONLINE</span>
                </div>
              </div>

            </div>
          </div>

          {/* Main Document Library Canvas */}
          <div className="max-w-[1280px] w-full mx-auto px-margin py-space-xl space-y-space-xl">
            
            <TranslationFilters />
            
            <StorageMetrics />

            {isEmpty ? (
              <TranslationEmptyState />
            ) : (
              <TranslationTable 
                data={data}
                totalCount={totalCount}
                storageUsedMb={storageUsedMb}
                storageTotalMb={storageTotalMb}
              />
            )}

            {/* Empty State Interactive Preview Toggle (For demonstration/development purposes) */}
            <div className="flex items-center justify-end mt-4">
              <button 
                onClick={toggleEmptyState}
                type="button" 
                className="font-label-md text-label-md text-primary hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Toggle Empty State Simulation</span>
                <Icon name="swap_vert" size={16} />
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
