"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";
import type { JobProgress } from "@/domain/job/jobDomains";

interface TranslationStepperProps {
  progress: JobProgress;
}

export function TranslationStepper({ progress }: TranslationStepperProps) {
  // Map job status to step index for UI logic
  const getActiveStep = () => {
    switch (progress.status) {
      case "pending": return 0;
      case "detecting_language": return 1;
      case "analyzing_layout": return 2;
      case "translating": return 3;
      case "finalizing": return 4;
      case "completed": return 5;
      default: return 0;
    }
  };

  const activeStep = getActiveStep();

  return (
    <div className="w-full bg-surface-container-lowest rounded-2xl p-6 sm:p-8 shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05),0_2px_6px_-1px_rgba(15,23,42,0.03)] border border-outline-variant/30 flex flex-col gap-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-outline-variant/20 pb-5">
        <div>
          <span className="font-label-caps text-label-caps tracking-widest text-primary uppercase font-bold">
            Document Stream Processing
          </span>
          <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface mt-1">
            Translating your document...
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">
            Preserving all mathematical equations, CAD layers, vector schematics, and tabular flow.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-lg border border-outline-variant/30 shrink-0">
          <Icon name="layers" size={18} className="text-primary" />
          <span className="font-label-md text-label-md text-on-surface font-semibold">
            100% Layout Lock
          </span>
        </div>
      </div>

      {/* Vertical Stepper Body */}
      <div className="relative pl-1 sm:pl-2">
        <StepItem 
          title="Detecting language"
          icon="translate"
          desc="Source verified • 100% lexical confidence index"
          time="0.4s"
          state={activeStep > 1 ? "completed" : activeStep === 1 ? "active" : "pending"}
          isLast={false}
        />
        
        <StepItem 
          title="Analyzing layout & diagrams"
          icon="schema"
          desc="Identified vector figures, equations, and tables"
          time="1.2s"
          state={activeStep > 2 ? "completed" : activeStep === 2 ? "active" : "pending"}
          isLast={false}
        />

        <StepItem 
          title="Translating text"
          icon="sync_alt"
          desc="Translating pages with contextual neural transformer..."
          time=""
          state={activeStep > 3 ? "completed" : activeStep === 3 ? "active" : "pending"}
          isLast={false}
          progressValue={progress.status === "translating" ? progress.percentage : undefined}
          pageInfo={progress.status === "translating" ? `Page ${progress.currentPage}/${progress.totalPages}` : undefined}
        />

        <StepItem 
          title="Finalizing document"
          icon="draw"
          desc="Reassembling vector layers, typography kerning, and generating preview."
          time=""
          state={activeStep > 4 ? "completed" : activeStep === 4 ? "active" : "pending"}
          isLast={true}
        />
      </div>

      {/* Overall Progress Section */}
      <div className="border-t border-outline-variant/20 pt-6 flex flex-col gap-2.5">
        <div className="flex items-center justify-between font-label-lg text-label-lg">
          <span className="text-on-surface font-semibold flex items-center gap-1.5">
            <Icon name="donut_large" size={18} className="text-primary" />
            Overall Progress
          </span>
          <span className="text-on-surface-variant font-mono text-body-sm">
            <span className="text-on-surface font-bold text-base">{progress.percentage}%</span>
            {progress.estimatedTimeRemainingSec && ` • Est. ${progress.estimatedTimeRemainingSec}s remaining`}
          </span>
        </div>

        {/* Main Linear Progress Bar */}
        <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden p-0.5">
          <div 
            className="h-full bg-gradient-to-r from-primary via-primary-container to-secondary rounded-full relative overflow-hidden transition-all duration-500 ease-out" 
            style={{ width: `${progress.percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-surface-container-lowest/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>

        <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant pt-0.5">
          <span>Stage {activeStep > 4 ? 4 : activeStep || 1} of 4</span>
          {progress.currentSpeedPagesPerSec && <span>Speed: ~{progress.currentSpeedPagesPerSec} pages / sec</span>}
        </div>
      </div>
    </div>
  );
}


interface StepItemProps {
  title: string;
  icon: string;
  desc: string;
  time: string;
  state: "completed" | "active" | "pending";
  isLast: boolean;
  progressValue?: number;
  pageInfo?: string;
}

function StepItem({ title, icon, desc, time, state, isLast, progressValue, pageInfo }: StepItemProps) {
  return (
    <div className={cn(
      "relative flex items-start gap-4 pb-8 group",
      state === "pending" && "opacity-60"
    )}>
      {!isLast && (
        <div className={cn(
          "absolute top-8 left-[17px] -bottom-1 w-[2px]",
          state === "completed" ? "bg-primary" : "bg-outline-variant/40"
        )} />
      )}

      {/* Indicator */}
      <div className={cn(
        "relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-4 ring-surface-container-lowest",
        state === "completed" && "bg-primary text-on-primary",
        state === "active" && "bg-primary-container text-on-primary shadow-[0_0_12px_rgba(79,70,229,0.35)]",
        state === "pending" && "bg-surface-container-high border border-outline-variant/60 text-on-surface-variant"
      )}>
        {state === "completed" ? (
          <Icon name="check" size={20} className="font-bold" />
        ) : state === "active" ? (
          <svg className="animate-spin h-5 w-5 text-on-primary" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"></circle>
            <path className="opacity-90" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
          </svg>
        ) : (
          <Icon name={icon} size={18} />
        )}
      </div>

      {/* Content */}
      <div className={cn(
        "pt-0.5 flex-1 min-w-0",
        state === "active" && "bg-surface-container-low/70 rounded-xl p-4 border border-primary/20"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-headline-sm text-headline-sm font-semibold",
              state === "active" ? "text-primary" : "text-on-surface"
            )}>
              {title}
            </span>
            <Icon 
              name={icon} 
              size={17} 
              className={cn(
                state === "active" ? "text-primary animate-pulse" : "text-on-surface-variant"
              )} 
            />
          </div>
          {time && (
            <span className="font-label-caps text-label-caps text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
              {time}
            </span>
          )}
          {state === "active" && (
            <span className="font-label-caps text-label-caps text-primary bg-primary-fixed px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Active
            </span>
          )}
          {state === "pending" && !time && (
            <span className="font-label-caps text-label-caps text-outline bg-surface-container-low px-2 py-0.5 rounded">
              Queued
            </span>
          )}
        </div>
        <p className={cn(
          "font-body-sm text-body-sm mt-1",
          state === "active" ? "text-on-surface mt-1.5" : "text-on-surface-variant"
        )}>
          {desc}
        </p>

        {state === "active" && progressValue !== undefined && (
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
              <div className="bg-primary h-1.5 rounded-full transition-all duration-300" style={{ width: `${progressValue}%` }}></div>
            </div>
            {pageInfo && (
              <span className="font-label-caps text-label-caps font-semibold text-on-surface-variant">
                {pageInfo} ({progressValue}%)
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
