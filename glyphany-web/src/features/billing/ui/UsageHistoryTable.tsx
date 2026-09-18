"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";

interface UsageRecord {
  id: string;
  date: string;
  documentName: string;
  engineUsed: string;
  pagesBilled: number;
  status: "completed" | "failed" | "refunded";
}

const mockUsageHistory: UsageRecord[] = [
  {
    id: "TR-9082",
    date: "Sep 18, 2026",
    documentName: "Quantum_Computing_Principles_v3.pdf",
    engineUsed: "Auto (v4.2)",
    pagesBilled: 48,
    status: "completed",
  },
  {
    id: "TR-9071",
    date: "Sep 15, 2026",
    documentName: "Navier_Stokes_Equations.tex",
    engineUsed: "Claude 3.5 Sonnet",
    pagesBilled: 12,
    status: "completed",
  },
  {
    id: "TR-9065",
    date: "Sep 14, 2026",
    documentName: "Biomedical_Research_Q3.pdf",
    engineUsed: "DeepL Pro",
    pagesBilled: 0,
    status: "failed",
  },
  {
    id: "TR-9050",
    date: "Sep 10, 2026",
    documentName: "Aerodynamics_Manual_Rev2.pdf",
    engineUsed: "Auto (v4.2)",
    pagesBilled: 34,
    status: "completed",
  },
  {
    id: "TR-9042",
    date: "Sep 08, 2026",
    documentName: "AI_Safety_Guidelines.docx",
    engineUsed: "DeepL Pro",
    pagesBilled: 5,
    status: "refunded",
  },
];

export function UsageHistoryTable() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/30 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant/30">
              <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant font-semibold">Date</th>
              <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant font-semibold">Job ID</th>
              <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant font-semibold">Document</th>
              <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant font-semibold">Engine</th>
              <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant font-semibold text-right">Pages Billed</th>
              <th className="px-6 py-4 font-label-lg text-label-lg text-on-surface-variant font-semibold text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {mockUsageHistory.map((record) => (
              <tr 
                key={record.id} 
                className="hover:bg-surface-container-lowest transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {record.date}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-label-md text-label-md text-primary bg-primary-fixed/30 px-2 py-1 rounded">
                    {record.id}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 max-w-[240px] sm:max-w-[320px]">
                    <Icon name="description" size={18} className="text-outline-variant flex-shrink-0" />
                    <span className="font-body-md text-body-md text-on-surface truncate" title={record.documentName}>
                      {record.documentName}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {record.engineUsed}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <span className={cn(
                    "font-label-lg text-label-lg",
                    record.status === "completed" ? "text-on-surface" : "text-outline-variant line-through"
                  )}>
                    {record.pagesBilled}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <StatusBadge status={record.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer (Mock) */}
      <div className="px-6 py-4 bg-surface-container-lowest border-t border-outline-variant/30 flex items-center justify-between">
        <span className="font-body-sm text-body-sm text-on-surface-variant">
          Showing 1 to 5 of 24 records
        </span>
        <div className="flex items-center gap-2">
          <button type="button" className="p-1 rounded text-outline-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-50" disabled>
            <Icon name="chevron_left" size={20} />
          </button>
          <button type="button" className="p-1 rounded text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
            <Icon name="chevron_right" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: UsageRecord["status"] }) {
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 font-label-caps text-label-caps">
        <Icon name="check_circle" size={14} />
        Billed
      </span>
    );
  }
  if (status === "refunded") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 font-label-caps text-label-caps">
        <Icon name="replay" size={14} />
        Refunded
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface-variant font-label-caps text-label-caps">
      <Icon name="error" size={14} />
      Failed (No Charge)
    </span>
  );
}
