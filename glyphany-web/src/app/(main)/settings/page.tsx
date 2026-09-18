"use client";

import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { Icon } from "@/shared/ui/Icon";
import { SettingsSidebar } from "@/features/settings/ui/SettingsSidebar";
import { UsageMonitor } from "@/features/settings/ui/UsageMonitor";
import { PreferencesForm } from "@/features/settings/ui/PreferencesForm";
import { useSettings } from "@/features/settings/hooks/useSettings";

export default function SettingsPage() {
  const { preferences, updatePreference, savePreferences, discardChanges, isSaving, isSaved } = useSettings();

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <LandingHeader />

      <main className="flex-1 w-full pt-16 flex flex-col">
        <div className="w-full max-w-[1280px] mx-auto px-gutter py-space-lg md:py-space-xl">
          
          {/* Breadcrumbs & Meta Bar */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-lg">
            <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md">
              <Link href="/translations" className="hover:text-primary transition-colors flex items-center gap-1">
                <Icon name="folder_shared" size={16} />
                <span>Workspace</span>
              </Link>
              <Icon name="chevron_right" size={14} className="text-outline-variant" />
              <span className="text-on-surface font-semibold flex items-center gap-1">
                <span>Account Settings</span>
              </span>
            </div>
            
            <div className="flex items-center gap-space-sm">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Cloud Sync Active
              </span>
              <span className="font-body-sm text-body-sm text-on-surface-variant">Last saved 4 mins ago</span>
            </div>
          </div>

          {/* Layout Grid: 12 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
            
            {/* LEFT SIDEBAR: Navigation & Plan Status (4 Columns on LG) */}
            <SettingsSidebar />

            {/* MAIN CONTENT AREA: Preferences (8 Columns on LG) */}
            <div className="lg:col-span-8 flex flex-col gap-space-lg w-full">
              <UsageMonitor />
              
              <PreferencesForm 
                preferences={preferences}
                onUpdate={updatePreference}
                onSave={savePreferences}
                onDiscard={discardChanges}
                isSaving={isSaving}
                isSaved={isSaved}
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
