"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { UsageHistoryTable } from "@/features/billing/ui/UsageHistoryTable";

export default function UsageHistoryPage() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-gutter py-space-lg md:py-space-xl min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-space-xs text-on-surface-variant font-label-md text-label-md mb-space-lg">
        <Link href="/settings" className="hover:text-primary transition-colors flex items-center gap-1">
          <Icon name="tune" size={16} />
          <span>Account Settings</span>
        </Link>
        <Icon name="chevron_right" size={14} className="text-outline-variant" />
        <span className="text-on-surface font-semibold flex items-center gap-1">
          <span>Usage History</span>
        </span>
      </div>

      {/* Header */}
      <div className="mb-space-lg flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight mb-2">
            Usage History
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-2xl">
            Review your past translation jobs, billing status, and the number of pages deducted from your monthly quota.
          </p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-lg text-label-lg transition-colors border border-outline-variant/30 cursor-pointer">
            <Icon name="download" size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-lg">
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Total Pages Translated</div>
          <div className="text-display-mobile font-display-mobile font-extrabold text-primary tracking-tight">1,248</div>
          <div className="text-body-sm font-body-sm text-on-surface-variant mt-1">Lifetime total</div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Pages Refunded</div>
          <div className="text-display-mobile font-display-mobile font-extrabold text-amber-600 tracking-tight">42</div>
          <div className="text-body-sm font-body-sm text-on-surface-variant mt-1">Due to processing errors</div>
        </div>
        <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/30">
          <div className="text-label-caps font-label-caps text-on-surface-variant uppercase mb-1">Current Billing Cycle</div>
          <div className="text-display-mobile font-display-mobile font-extrabold text-on-surface tracking-tight">Nov 1</div>
          <div className="text-body-sm font-body-sm text-on-surface-variant mt-1">Quota resets automatically</div>
        </div>
      </div>

      {/* Table */}
      <UsageHistoryTable />

    </div>
  );
}
