"use client";

import React, { useState, useEffect, use } from "react";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { ReaderSubHeader } from "@/features/translation-reader/ui/ReaderSubHeader";
import { SplitPaneContainer } from "@/features/translation-reader/ui/SplitPaneContainer";
import { FilmstripFooter } from "@/features/translation-reader/ui/FilmstripFooter";
import { useReaderMode } from "@/features/translation-reader/hooks/useReaderMode";
import type { ReaderDocument } from "@/domain/translation-reader/readerDomains";
import { apiClient } from "@/lib/http";
import { toast } from "react-hot-toast";

export default function ReaderPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const { viewMode, toggleViewMode, hoveredNodeId, handleNodeHover } = useReaderMode("split");
  const [documentData, setDocumentData] = useState<ReaderDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ReaderDocument>(`/translations/${jobId}/content`);
        setDocumentData(response.data);
      } catch (error) {
        console.error("Failed to load translation content:", error);
        toast.error("Could not load document content. It might not be ready yet.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [jobId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-on-surface-variant">Loading translation...</p>
        </div>
      </div>
    );
  }

  if (!documentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <p className="text-error">Document not found or not processed.</p>
      </div>
    );
  }

  // Find the page matching currentPage, or default to the first page
  const pageData = documentData.pages.find(p => p.pageNumber === currentPage) || documentData.pages[0];

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-fixed">
      {/* Basic Navigation / Standard Top Header */}
      <LandingHeader />

      <main className="flex-1 w-full pt-16 flex flex-col">
        <ReaderSubHeader 
          viewMode={viewMode} 
          onViewModeChange={toggleViewMode} 
          downloadUrl={documentData.downloadUrl}
        />

        {/* Main Dual-Pane Workspace Canvas */}
        <SplitPaneContainer 
          viewMode={viewMode}
          pageData={pageData}
          sourceLangCode={documentData.sourceLang || "EN"}
          targetLangCode={documentData.targetLang || "ES"}
          sourceTitle={documentData.title || "Original Document"}
          targetTitle="Translated Document"
          hoveredNodeId={hoveredNodeId}
          onNodeHover={handleNodeHover}
        />
      </main>

      {/* DOCKED BOTTOM FILMSTRIP */}
      <FilmstripFooter 
        currentPage={currentPage}
        totalPages={documentData.totalPages || documentData.pages.length}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
