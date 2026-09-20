"use client";

import React, { useState, useEffect, use } from "react";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { ReaderSubHeader } from "@/features/translation-reader/ui/ReaderSubHeader";
import { SplitPaneContainer } from "@/features/translation-reader/ui/SplitPaneContainer";
import { FilmstripFooter } from "@/features/translation-reader/ui/FilmstripFooter";
import { useReaderMode } from "@/features/translation-reader/hooks/useReaderMode";
import type { ReaderDocument } from "@/domain/translation-reader/readerDomains";
import { EditorModal } from "@/features/translation-reader/ui/EditorModal";
import type { DocumentNode } from "@/domain/translation-reader/readerDomains";
import { apiClient } from "@/lib/http";
import { toast } from "react-hot-toast";

export default function ReaderPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params);
  const [currentPage, setCurrentPage] = useState(1);
  const { viewMode, toggleViewMode, hoveredNodeId, handleNodeHover } = useReaderMode("split");
  const [documentData, setDocumentData] = useState<ReaderDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Editor state
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<ReaderDocument>(`/translations/${jobId}/content`);
        setDocumentData(response.data);
        setHasUnsavedChanges(false);
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

  const pageData = documentData.pages.find(p => p.pageNumber === currentPage) || documentData.pages[0];

  const handleNodeClick = (nodeId: string) => {
    setEditingNodeId(nodeId);
  };

  const handleSaveNode = (nodeId: string, newContent: string) => {
    setDocumentData(prev => {
      if (!prev) return prev;
      const newPages = prev.pages.map(page => ({
        ...page,
        targetNodes: page.targetNodes.map(node => 
          node.id === nodeId ? { ...node, content: newContent } : node
        )
      }));
      return { ...prev, pages: newPages };
    });
    setHasUnsavedChanges(true);
  };

  const handleRegeneratePdf = async () => {
    if (!documentData) return;
    setIsRegenerating(true);
    const toastId = toast.loading("Saving changes and regenerating PDF...");
    try {
      await apiClient.post(`/translations/${jobId}/regenerate`, {
        pages: documentData.pages
      });
      toast.success("Regeneration started! The PDF is being rebuilt.", { id: toastId });
      setHasUnsavedChanges(false);
      
      // Optionally redirect or poll status
      setTimeout(() => {
        window.location.reload(); // Reload to see the new status
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to regenerate PDF.", { id: toastId });
      setIsRegenerating(false);
    }
  };

  const handleRetranslate = async (originalText: string): Promise<string> => {
    try {
      const response = await apiClient.post<{ translatedText: string }>(`/translations/${jobId}/retranslate-block`, {
        text: originalText,
        sourceLang: documentData?.sourceLang || 'auto',
        targetLang: documentData?.targetLang || 'tr',
      });
      toast.success("Blok başarıyla tekrar çevrildi!");
      return response.data.translatedText;
    } catch (error) {
      console.error(error);
      toast.error("Tekrar çeviri başarısız oldu.");
      throw error;
    }
  };

  const editingSourceNode = editingNodeId 
    ? documentData.pages.flatMap(p => p.sourceNodes).find(n => n.id === editingNodeId)
    : undefined;
    
  const editingTargetNode = editingNodeId 
    ? documentData.pages.flatMap(p => p.targetNodes).find(n => n.id === editingNodeId)
    : undefined;

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-fixed">
      <LandingHeader />

      <main className="flex-1 w-full pt-16 flex flex-col">
        <ReaderSubHeader 
          viewMode={viewMode} 
          onViewModeChange={toggleViewMode} 
          downloadUrl={documentData.downloadUrl}
          hasUnsavedChanges={hasUnsavedChanges}
          onRegenerate={handleRegeneratePdf}
          isRegenerating={isRegenerating}
        />

        <SplitPaneContainer 
          viewMode={viewMode}
          pageData={pageData}
          sourceLangCode={documentData.sourceLang || "EN"}
          targetLangCode={documentData.targetLang || "ES"}
          sourceTitle={documentData.title || "Original Document"}
          targetTitle="Translated Document"
          hoveredNodeId={hoveredNodeId}
          onNodeHover={handleNodeHover}
          onNodeClick={handleNodeClick}
        />
      </main>

      <FilmstripFooter 
        currentPage={currentPage}
        totalPages={documentData.totalPages || documentData.pages.length}
        onPageChange={setCurrentPage}
      />

      <EditorModal 
        isOpen={!!editingNodeId}
        onClose={() => setEditingNodeId(null)}
        sourceNode={editingSourceNode}
        targetNode={editingTargetNode}
        onSave={handleSaveNode}
        onRetranslate={handleRetranslate}
      />
    </div>
  );
}

