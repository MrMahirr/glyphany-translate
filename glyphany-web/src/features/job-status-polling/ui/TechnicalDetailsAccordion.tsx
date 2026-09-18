"use client";

import React, { useState } from "react";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";

export interface TechnicalDetailsAccordionProps {
  logs: string[];
}

export function TechnicalDetailsAccordion({ logs }: TechnicalDetailsAccordionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToCopy = logs.join("\n");
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  return (
    <div className="w-full text-left bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        aria-expanded={isExpanded}
        className="w-full flex items-center justify-between p-4 bg-surface-container-low hover:bg-surface-container transition-colors text-left cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Icon name="terminal" size={20} className="text-outline" />
          <span className="font-label-lg text-label-lg text-on-surface font-semibold">
            Technical details &amp; engine logs
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="font-label-md text-label-md text-on-surface-variant hidden sm:inline">
            Diagnostic Dump
          </span>
          <Icon 
            name="expand_more" 
            size={24} 
            className={cn(
              "text-outline transition-transform duration-200",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="flex flex-col p-5 bg-surface-container-lowest gap-space-md">
          <div className="flex items-center justify-between">
            <span className="font-label-caps text-label-caps uppercase text-on-surface-variant tracking-wider">
              Execution Pipeline Failure Trace
            </span>
            <button 
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-primary hover:text-on-surface font-label-md text-label-md transition-colors bg-surface-container-low px-2.5 py-1 rounded-md cursor-pointer"
            >
              <Icon name={copied ? "check" : "content_copy"} size={15} />
              <span>{copied ? "Copied!" : "Copy Error Log"}</span>
            </button>
          </div>

          <div className="w-full bg-inverse-surface rounded-lg p-4 font-mono text-xs text-inverse-on-surface leading-relaxed overflow-x-auto selection:bg-primary-container">
            {logs.map((log, index) => {
              // Simple coloring based on keywords just for demo/styling purposes
              const isError = log.includes("[CRITICAL]") || log.includes("FAILED");
              const isWarn = log.includes("[WARN]");
              const isInfo = log.includes("[INFO]");
              const isOK = log.includes("OK");
              
              if (log.includes("[CRITICAL]")) {
                return (
                  <div key={index} className="text-on-error-container bg-error-container/20 px-1 py-0.5 rounded inline-block mt-1 font-semibold">
                    &gt;&gt; {log}
                  </div>
                );
              }

              return (
                <div key={index} className={cn(
                  "mt-1",
                  isError ? "text-error-container font-bold" :
                  isWarn ? "text-tertiary-fixed-dim" : 
                  isInfo ? "text-tertiary-fixed-dim" :
                  isOK ? "text-surface-tint font-bold" : 
                  "text-tertiary-fixed-dim"
                )}>
                  {log}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
