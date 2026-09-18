"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";

export function StorageMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-space-md">
      
      {/* Cloud Storage Metric */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-primary">
          <Icon name="cloud_done" size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Cloud Storage</span>
            <span className="font-label-caps text-label-caps text-primary font-bold">8.5%</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: "8.5%" }}></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant mt-1 block">85.7 MB of 1 GB used</span>
        </div>
      </div>

      {/* Layout Precision */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
          <Icon name="verified" size={20} />
        </div>
        <div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Layout Precision</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">99.94%</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant block">Zero schema distortion</span>
        </div>
      </div>

      {/* Target Locales */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-surface-container text-secondary flex items-center justify-center">
          <Icon name="translate" size={20} />
        </div>
        <div>
          <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Target Locales</span>
          <span className="font-headline-sm text-headline-sm text-on-surface font-bold">8 Active</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant block">ES, DE, JA, ZH, FR, IT, KO, AR</span>
        </div>
      </div>

      {/* Security Mode */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Icon name="lock_reset" size={20} />
          </div>
          <div>
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase block">Security Mode</span>
            <span className="font-headline-sm text-headline-sm text-on-surface font-bold">SOC2 / HIPAA</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant block">No LLM training policy</span>
          </div>
        </div>
      </div>

    </div>
  );
}
