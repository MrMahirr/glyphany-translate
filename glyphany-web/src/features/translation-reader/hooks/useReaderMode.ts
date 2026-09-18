"use client";

import { useState, useCallback } from "react";
import type { ReaderViewMode } from "@/domain/translation-reader/readerDomains";

export function useReaderMode(initialMode: ReaderViewMode = "split") {
  const [viewMode, setViewMode] = useState<ReaderViewMode>(initialMode);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  const toggleViewMode = useCallback((mode: ReaderViewMode) => {
    setViewMode(mode);
  }, []);

  const handleNodeHover = useCallback((nodeId: string | null) => {
    setHoveredNodeId(nodeId);
  }, []);

  return {
    viewMode,
    toggleViewMode,
    hoveredNodeId,
    handleNodeHover,
  };
}
