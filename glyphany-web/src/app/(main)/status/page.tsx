"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { ServiceHealthCards } from "@/features/system-status/ui/ServiceHealthCards";
import { StatusTimeline } from "@/features/system-status/ui/StatusTimeline";

export default function SystemStatusPage() {
  return (
    <div className="w-full max-w-[1024px] mx-auto px-gutter py-space-lg md:py-space-xl min-h-screen">
      
      {/* Back to Home */}
      <Link href="/" className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary transition-colors mb-space-lg">
        <Icon name="arrow_back" size={16} />
        <span>Back to Workspace</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 mb-space-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-surface-container-high flex items-center justify-center">
            <Icon name="monitor_heart" size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
              System Status
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Current operational status of Glyphany.ai services and APIs.
            </p>
          </div>
        </div>
        
        {/* Global Status Banner */}
        <div className="mt-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-start sm:items-center gap-3">
          <Icon name="warning" size={24} className="text-amber-600 dark:text-amber-500 mt-0.5 sm:mt-0 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-label-lg text-label-lg text-amber-800 dark:text-amber-400 font-bold">
              Partial Service Degradation
            </h3>
            <p className="font-body-sm text-body-sm text-amber-700 dark:text-amber-500 mt-0.5">
              We are currently experiencing elevated latency with the Anthropic Claude API integration. Neural v4.2 and DeepL Pro pipelines remain fully operational.
            </p>
          </div>
        </div>
      </div>

      {/* Service Health Grid */}
      <div className="mb-space-xl">
        <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-4">Core Services</h2>
        <ServiceHealthCards />
      </div>

      {/* Incident Timeline */}
      <div className="mb-space-xl">
        <StatusTimeline />
      </div>

      {/* Footer / Contact */}
      <div className="text-center p-6 bg-surface-container-low rounded-2xl text-on-surface-variant">
        <p className="font-body-md text-body-md mb-2">
          Experiencing issues not listed here?
        </p>
        <Link href="/enterprise" className="inline-flex items-center gap-1.5 px-4 py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-lg text-label-lg transition-colors border border-outline-variant/30">
          <Icon name="support_agent" size={18} />
          <span>Contact Support</span>
        </Link>
      </div>
    </div>
  );
}
