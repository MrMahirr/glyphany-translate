"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import type { JobMetadata, JobStatus } from "@/domain/job/jobDomains";

interface DocumentMetadataCardProps {
  metadata: JobMetadata;
  status: JobStatus;
}

export function DocumentMetadataCard({ metadata, status }: DocumentMetadataCardProps) {
  const getStatusBadge = () => {
    switch(status) {
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-primary border border-primary/20 font-label-md text-label-md">
            <Icon name="check_circle" size={14} /> Completed
          </span>
        );
      case "failed":
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container/50 text-error border border-error/20 font-label-md text-label-md">
            <Icon name="error" size={14} /> {status === "failed" ? "Failed" : "Canceled"}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-primary border border-primary/20 font-label-md text-label-md">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
            In Progress
          </span>
        );
    }
  };

  const formattedSize = (metadata.fileSize / (1024 * 1024)).toFixed(1);

  return (
    <div className="w-full bg-surface-container-lowest rounded-xl p-5 shadow-[0_1px_3px_0_rgba(15,23,42,0.04),0_1px_2px_-1px_rgba(15,23,42,0.04)] border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start sm:items-center gap-3.5 min-w-0">
        
        <div className="w-11 h-11 rounded-lg bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <Icon name="picture_as_pdf" size={24} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface truncate">
              {metadata.fileName}
            </h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-fixed text-on-primary-fixed-variant">
              PDF
            </span>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>{metadata.pageCount} pages</span>
            <span className="text-outline-variant">•</span>
            <span>{formattedSize} MB</span>
            <span className="text-outline-variant">•</span>
            <span className="inline-flex items-center gap-1 text-on-surface font-medium">
              {metadata.sourceLang} 
              <Icon name="arrow_forward" size={14} className="text-primary" /> 
              {metadata.targetLang}
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center self-start sm:self-center shrink-0">
        {getStatusBadge()}
      </div>
    </div>
  );
}
