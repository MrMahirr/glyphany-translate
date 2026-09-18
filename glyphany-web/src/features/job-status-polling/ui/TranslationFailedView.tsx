"use client";

import React, { useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Icon } from "@/shared/ui/Icon";
import { TechnicalDetailsAccordion } from "./TechnicalDetailsAccordion";
import { RecommendedFixes } from "./RecommendedFixes";

export interface TranslationFailedViewProps {
  jobId: string;
  fileName: string;
  failedPage?: number;
  errorCode: string;
  errorMessage: string;
  logs: string[];
}

export function TranslationFailedView({
  jobId,
  fileName,
  failedPage,
  errorCode,
  errorMessage,
  logs
}: TranslationFailedViewProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = () => {
    setIsRetrying(true);
    // Simulate retry action
    setTimeout(() => {
      setIsRetrying(false);
      toast.error("Retrying engine... In real app this would trigger API call.");
    }, 1800);
  };

  return (
    <div className="w-full max-w-3xl flex flex-col items-center">
      {/* Header with Back Link & Job ID */}
      <div className="w-full flex items-center justify-between mb-space-md">
        <Link href="/translations" className="inline-flex items-center gap-1.5 font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
          <Icon name="arrow_back" size={16} />
          <span>Back to Translation Queue</span>
        </Link>
        <div className="inline-flex items-center gap-space-xs font-label-caps text-label-caps uppercase text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
          <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
          <span>Job ID: #{jobId}</span>
        </div>
      </div>

      {/* Main Error Card */}
      <div className="w-full bg-surface-container-lowest rounded-xl shadow-xl p-6 sm:p-10 flex flex-col items-center text-center relative overflow-hidden">
        {/* Top Danger Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-surface-variant via-error-container to-surface-variant"></div>

        {/* Error Icon Illustration */}
        <div className="relative mb-space-lg">
          <div className="w-20 h-20 rounded-2xl bg-error-container/60 flex items-center justify-center text-error shadow-sm">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <rect className="fill-surface-container-lowest" height="36" rx="4" width="28" x="10" y="6"></rect>
              <path className="stroke-error" d="M12 12C12 9.79086 13.7909 8 16 8H28L36 16V36C36 38.2091 34.2091 40 32 40H16C13.7909 40 12 38.2091 12 36V12Z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
              <path className="stroke-error" d="M28 8V16H36" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
              <path className="stroke-error" d="M20 22L28 30M28 22L20 30" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
            </svg>
          </div>
          <span className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-surface-container-lowest shadow-md flex items-center justify-center text-error">
            <Icon name="priority_high" size={16} />
          </span>
        </div>

        {/* Error Headings */}
        <div className="inline-flex items-center gap-space-xs px-3 py-0.5 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps uppercase mb-space-sm">
          Stage 3 Pipeline Interruption
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs font-bold tracking-tight">
          Translation failed
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mb-space-lg leading-relaxed">
          {errorMessage ? errorMessage : (
            <>
              We couldn't process page {failedPage || "?"} of <span className="font-semibold text-on-surface bg-surface-container-low px-1.5 py-0.5 rounded text-sm font-mono">{fileName}</span>. The file stream encountered unreadable vector definitions, structural corruption, or an active security restriction.
            </>
          )}
        </p>

        {/* Diagnostic Metadata Pills */}
        <div className="w-full flex flex-wrap items-center justify-center gap-2 mb-space-xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface-variant">
            <Icon name="fingerprint" size={16} className="text-outline" />
            <span>Code:</span>
            <span className="font-mono text-on-surface font-semibold">{errorCode}</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface-variant">
            <Icon name="schedule" size={16} className="text-outline" />
            <span>Triggered: Just now</span>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-low font-label-md text-label-md text-on-surface-variant">
            <Icon name="description" size={16} className="text-outline" />
            <span>Spec: PDF 1.7 (Acrobat 8.x)</span>
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3 mb-space-lg">
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary-container text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-lg shadow-md hover:bg-primary transition-all active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <Icon name={isRetrying ? "sync" : "refresh"} size={18} className={isRetrying ? "animate-spin" : ""} />
            <span>{isRetrying ? "Restarting Engine..." : "Try Again"}</span>
          </button>
          <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-surface-container-low text-on-surface font-label-lg text-label-lg px-5 py-3 rounded-lg hover:bg-surface-container transition-all cursor-pointer">
            <Icon name="support_agent" size={18} className="text-on-surface-variant" />
            <span>Contact Support</span>
          </button>
          <Link href="/" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-transparent text-primary hover:text-on-surface font-label-lg text-label-lg px-4 py-3 rounded-lg transition-colors">
            <Icon name="file_upload" size={18} />
            <span>Upload Different File</span>
          </Link>
        </div>

        {/* Quota Protection Info */}
        <div className="w-full bg-surface-container-low rounded-xl p-4 mb-space-lg text-left flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center flex-shrink-0 text-primary mt-0.5">
            <Icon name="check_circle" size={18} />
          </div>
          <div className="flex-1">
            <p className="font-label-lg text-label-lg text-on-surface font-semibold">Quota protected</p>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              No credits were consumed for this attempt. Your account balance remains completely intact with <span className="font-semibold text-on-surface">38 pages available</span> in your billing cycle.
            </p>
          </div>
        </div>

        {/* Technical Details Accordion */}
        <TechnicalDetailsAccordion logs={logs} />
        
        {/* Recommended Fixes */}
        <RecommendedFixes />
        
      </div>
    </div>
  );
}
