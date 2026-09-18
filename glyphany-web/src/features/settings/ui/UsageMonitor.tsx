"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";

export function UsageMonitor() {
  return (
    <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md mb-space-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Icon name="analytics" size={20} className="text-primary" />
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">Billing Cycle Monitor</span>
          </div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">Monthly Translation Usage</h2>
        </div>
        <button type="button" className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg rounded-lg transition-all shadow-sm flex-shrink-0 cursor-pointer">
          <Icon name="add_circle" size={18} className="text-primary" />
          <span>Upgrade Quota</span>
        </button>
      </div>

      {/* Numeric Counter & Progress Bar */}
      <div className="bg-surface-container-low rounded-xl p-space-md mb-space-sm">
        <div className="flex flex-wrap items-baseline justify-between gap-2 mb-space-xs">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-[32px] leading-8 font-extrabold text-on-surface tracking-tight">12</span>
            <span className="font-body-lg text-body-lg text-on-surface-variant font-medium">of 50 pages translated this month</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-lg text-label-lg font-bold text-primary">24% used</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">(38 pages remaining)</span>
          </div>
        </div>

        {/* Visual Progress Track */}
        <div 
          role="progressbar" 
          aria-valuenow={24} 
          aria-valuemin={0} 
          aria-valuemax={100} 
          className="w-full bg-surface-container-highest h-3 rounded-full overflow-hidden p-0.5"
        >
          <div className="bg-primary-container h-full rounded-full transition-all duration-500 shadow-sm" style={{ width: "24%" }}></div>
        </div>

        {/* Page breakdown mini sparks */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-space-sm pt-space-xs">
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant">PDF Vector Pages</span>
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">9 pages</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Formula Extracts</span>
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">3 pages</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Cycle Reset</span>
            <span className="font-label-lg text-label-lg text-on-surface font-semibold">Nov 1, 2024</span>
          </div>
          <div className="flex flex-col">
            <span className="font-label-caps text-label-caps text-on-surface-variant">Time Remaining</span>
            <span className="font-label-lg text-label-lg text-primary font-semibold">7 days left</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-body-sm font-body-sm text-on-surface-variant">
        <div className="flex items-center gap-1.5">
          <Icon name="info" size={16} className="text-primary" />
          <span>Quota resets on Nov 1, 2024 at 00:00 UTC. Unused pages do not rollover.</span>
        </div>
        <Link href="/settings/history" className="hidden sm:inline font-label-md text-label-md text-primary hover:underline">
          View Page History
        </Link>
      </div>
    </section>
  );
}
