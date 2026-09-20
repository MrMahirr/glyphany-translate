"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";
import { DocumentPane } from "./DocumentPane";
import type { ReaderViewMode, DocumentPage } from "@/domain/translation-reader/readerDomains";

interface SplitPaneContainerProps {
  viewMode: ReaderViewMode;
  pageData: DocumentPage;
  sourceLangCode: string;
  targetLangCode: string;
  sourceTitle: string;
  targetTitle: string;
  hoveredNodeId: string | null;
  onNodeHover: (nodeId: string | null) => void;
  onNodeClick?: (nodeId: string) => void;
}

export function SplitPaneContainer({
  viewMode,
  pageData,
  sourceLangCode,
  targetLangCode,
  sourceTitle,
  targetTitle,
  hoveredNodeId,
  onNodeHover,
  onNodeClick
}: SplitPaneContainerProps) {
  const showSource = viewMode === "split" || viewMode === "source";
  const showTarget = viewMode === "split" || viewMode === "target";

  return (
    <section className="relative w-full px-4 lg:px-8 py-6 pb-28 flex-1">
      <div 
        className={cn(
          "max-w-[1720px] mx-auto grid items-stretch gap-6 lg:gap-8 min-h-[calc(100vh-280px)]",
          viewMode === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 max-w-4xl"
        )}
      >
        {/* Source Pane */}
        {showSource && (
          <DocumentPane 
            paneType="source"
            langCode={sourceLangCode}
            title={sourceTitle}
            nodes={pageData.sourceNodes}
            hoveredNodeId={hoveredNodeId}
            onNodeHover={onNodeHover}
          />
        )}

        {/* Target Pane */}
        {showTarget && (
          <DocumentPane 
            paneType="target"
            langCode={targetLangCode}
            title={targetTitle}
            nodes={pageData.targetNodes}
            hoveredNodeId={hoveredNodeId}
            onNodeHover={onNodeHover}
            onNodeClick={onNodeClick}
          />
        )}
      </div>
    </section>
  );
}
