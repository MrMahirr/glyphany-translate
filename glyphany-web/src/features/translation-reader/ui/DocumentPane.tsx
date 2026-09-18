"use client";

import React from "react";
import { cn } from "@/shared/lib/cn";
import { Icon } from "@/shared/ui/Icon";
import type { DocumentNode } from "@/domain/translation-reader/readerDomains";

interface DocumentPaneProps {
  paneType: "source" | "target";
  langCode: string;
  nodes: DocumentNode[];
  hoveredNodeId: string | null;
  onNodeHover: (nodeId: string | null) => void;
  title: string;
}

export function DocumentPane({
  paneType,
  langCode,
  nodes,
  hoveredNodeId,
  onNodeHover,
  title
}: DocumentPaneProps) {
  const isTarget = paneType === "target";

  return (
    <div className="flex flex-col bg-surface-container-lowest rounded-xl shadow-md overflow-hidden h-full">
      
      {/* Pane Ribbon Header */}
      <div className="bg-surface-container-low px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn(
            "font-label-caps text-label-caps px-2 py-0.5 rounded font-bold tracking-wider",
            isTarget ? "bg-primary-fixed text-primary" : "bg-surface-container-highest text-primary"
          )}>
            {isTarget ? `TARGET • ${langCode}` : `SOURCE • ${langCode}`}
          </span>
          <span className="font-label-md text-label-md text-on-surface-variant font-semibold">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-3 text-on-surface-variant">
          {isTarget ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-label-caps text-label-caps font-semibold">
              <Icon name="verified" size={13} />
              99.8% Lexical Precision
            </span>
          ) : (
            <>
              <span className="font-label-caps text-label-caps bg-surface-container px-2 py-0.5 rounded text-tertiary">
                Vector Math Engine
              </span>
              <button className="hover:text-on-surface cursor-pointer" title="Inspect Layout Box Coordinates">
                <Icon name="view_in_ar" size={17} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pane Content Render */}
      <div className="p-8 md:p-12 text-on-surface font-serif selection:bg-primary-fixed leading-relaxed flex-1 overflow-y-auto">
        {nodes.map((node) => (
          <NodeRenderer
            key={node.id}
            node={node}
            isHovered={hoveredNodeId === node.id}
            onHover={() => onNodeHover(node.id)}
            onLeave={() => onNodeHover(null)}
          />
        ))}
      </div>
    </div>
  );
}

function NodeRenderer({
  node,
  isHovered,
  onHover,
  onLeave,
}: {
  node: DocumentNode;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  
  if (node.type === "heading") {
    return (
      <div 
        className={cn(
          "mb-6 transition-colors rounded p-2",
          isHovered && "bg-primary-fixed text-on-primary-fixed-variant"
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <span className="block font-sans font-label-caps text-label-caps text-primary tracking-widest uppercase mb-1">
          {node.metadata?.subtitle}
        </span>
        <h1 className="font-serif text-[26px] md:text-[30px] font-bold text-on-surface leading-tight tracking-tight" dangerouslySetInnerHTML={{ __html: node.content }} />
      </div>
    );
  }

  if (node.type === "paragraph") {
    return (
      <p 
        className={cn(
          "text-[15px] md:text-[16px] text-on-surface leading-[1.8] mb-6 font-serif transition-colors p-2 rounded cursor-pointer hover:bg-surface-container",
          isHovered && "bg-primary-fixed text-on-primary-fixed-variant"
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
        dangerouslySetInnerHTML={{ __html: node.content }}
      />
    );
  }

  if (node.type === "equation") {
    return (
      <div 
        className={cn(
          "my-6 p-5 rounded-lg font-mono text-[14px] md:text-[15px] text-center shadow-inner flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer",
          isHovered ? "bg-primary-fixed text-on-primary-fixed-variant" : "bg-surface-container-low text-primary-container"
        )}
        onMouseEnter={onHover}
        onMouseLeave={onLeave}
      >
        <span className="font-serif italic text-on-surface" dangerouslySetInnerHTML={{ __html: node.content }} />
        {node.metadata?.caption && (
          <span className="text-on-surface-variant font-sans font-label-caps text-label-caps tracking-widest mt-1">
            {node.metadata.caption}
          </span>
        )}
      </div>
    );
  }

  if (node.type === "note") {
    return (
      <p className="font-sans text-[12px] text-on-surface-variant mt-2.5 leading-normal" dangerouslySetInnerHTML={{ __html: node.content }} />
    );
  }

  // Placeholder for diagrams / complex components
  return (
    <div 
      className={cn(
        "my-8 p-5 rounded-xl shadow-sm transition-colors cursor-pointer",
        isHovered ? "bg-primary-fixed" : "bg-surface-container-low"
      )}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="font-sans font-label-caps text-label-caps uppercase text-primary tracking-wider font-bold">
          {node.metadata?.title || "Technical Diagram"}
        </span>
      </div>
      <div className="relative w-full bg-surface-container-lowest rounded-lg p-6 overflow-x-auto" dangerouslySetInnerHTML={{ __html: node.content }} />
    </div>
  );
}
