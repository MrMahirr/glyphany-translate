"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";

interface ProgressControlBarProps {
  jobId: string;
  engineVersion: string;
  onCancel: () => void;
  isCancellable?: boolean;
}

export function ProgressControlBar({ 
  jobId, 
  engineVersion, 
  onCancel, 
  isCancellable = true 
}: ProgressControlBarProps) {
  return (
    <div className="w-full border-b border-outline-variant/30 bg-surface-container-lowest/60 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-margin py-space-sm flex items-center justify-between gap-space-md">
        
        {/* Job ID & Engine Version */}
        <div className="flex items-center gap-space-sm">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="font-label-caps text-label-caps tracking-wider text-on-surface-variant uppercase">
              Job ID #{jobId}
            </span>
          </div>
          <span className="hidden sm:inline font-body-sm text-body-sm text-on-surface-variant/80">
            • {engineVersion}
          </span>
        </div>

        {/* Cancel Action */}
        <div className="flex items-center gap-space-md">
          {isCancellable && (
            <button 
              onClick={onCancel}
              type="button"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container/40 transition-all font-label-md text-label-md cursor-pointer"
            >
              <Icon name="close" size={16} />
              <span>Cancel Translation</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
