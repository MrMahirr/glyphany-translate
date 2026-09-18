"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";

export type ServiceStatus = "operational" | "degraded" | "outage";

interface ServiceHealth {
  id: string;
  name: string;
  status: ServiceStatus;
  uptime: string;
  description: string;
}

const mockServices: ServiceHealth[] = [
  {
    id: "core-api",
    name: "Core API & Routing",
    status: "operational",
    uptime: "99.99%",
    description: "Handles user authentication, file uploads, and job queuing.",
  },
  {
    id: "vector-ocr",
    name: "Vector OCR Engine",
    status: "operational",
    uptime: "99.95%",
    description: "Extracts MathML, tables, and layered diagrams from PDFs.",
  },
  {
    id: "neural-v4",
    name: "Neural Pipeline (v4.2)",
    status: "operational",
    uptime: "99.98%",
    description: "Our proprietary AI engine for context-aware document translation.",
  },
  {
    id: "deepl-sync",
    name: "DeepL Pro Integration",
    status: "operational",
    uptime: "99.90%",
    description: "Third-party connector for standard commercial localization.",
  },
  {
    id: "claude-sync",
    name: "Anthropic Claude API",
    status: "degraded",
    uptime: "98.50%",
    description: "Experiencing elevated latency for advanced STEM processing.",
  },
];

export function ServiceHealthCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
      {mockServices.map((service) => (
        <div 
          key={service.id} 
          className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold line-clamp-1">
              {service.name}
            </h3>
            <StatusIcon status={service.status} />
          </div>
          
          <p className="font-body-sm text-body-sm text-on-surface-variant flex-1">
            {service.description}
          </p>

          <div className="flex items-center justify-between mt-2 pt-3 border-t border-outline-variant/20">
            <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Uptime (30d)</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">{service.uptime}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusIcon({ status }: { status: ServiceStatus }) {
  if (status === "operational") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full font-label-caps text-label-caps">
        <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
        Operational
      </div>
    );
  }
  if (status === "degraded") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full font-label-caps text-label-caps animate-pulse">
        <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0"></span>
        Degraded
      </div>
    );
  }
  return (
    <div className="flex items-center gap-1.5 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full font-label-caps text-label-caps">
      <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0"></span>
      Outage
    </div>
  );
}
