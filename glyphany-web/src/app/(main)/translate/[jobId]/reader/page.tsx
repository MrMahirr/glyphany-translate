"use client";

import React, { useState } from "react";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { ReaderSubHeader } from "@/features/translation-reader/ui/ReaderSubHeader";
import { SplitPaneContainer } from "@/features/translation-reader/ui/SplitPaneContainer";
import { FilmstripFooter } from "@/features/translation-reader/ui/FilmstripFooter";
import { useReaderMode } from "@/features/translation-reader/hooks/useReaderMode";
import type { ReaderDocument } from "@/domain/translation-reader/readerDomains";

// --- Mock Data ---
const mockDocument: ReaderDocument = {
  id: "doc-1",
  title: "Quantum_Computing_Principles_v3",
  totalPages: 48,
  sourceLang: "EN",
  targetLang: "ES",
  pages: [
    {
      pageNumber: 3,
      sourceNodes: [
        {
          id: "node-1",
          type: "heading",
          content: "2.4 — Bloch Sphere Geometric Formalism and Deterministic State Teleportation",
          metadata: { subtitle: "Chapter II • Foundations" }
        },
        {
          id: "node-2",
          type: "paragraph",
          content: "The spatial orientation of an arbitrary single-qubit state $|\psi\\rangle$ within the complex projective Hilbert space $\\mathbb{C}\\mathrm{P}^1$ may be isomorphically mapped to the surface of a three-dimensional unit Riemannian manifold, customarily denominated as the <em>Bloch sphere</em>. In such a framework, the arbitrary state vector admits parameterized spherical representation:"
        },
        {
          id: "node-3",
          type: "equation",
          content: "|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩",
          metadata: { caption: "Equation (2.19) • Polar Decomposition" }
        },
        {
          id: "node-4",
          type: "paragraph",
          content: "Teleportation exploits nonlocal correlations distributed across maximally entangled Einstein-Podolsky-Rosen (EPR) pairs. By preparing a canonical Bell state $|\\Phi^+\\rangle_{AB} = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$, an unmeasured target state $|\\psi\\rangle_C$ held by the transmitting node (Alice) undergoes a joint Bell-state projective measurement with subsystem $A$."
        },
        {
          id: "node-5",
          type: "note",
          content: "<em>Note:</em> The classical communications latency $\\Delta \\tau = d/c$ strictly enforces relativistic causality, precluding instantaneous superluminal signaling across spacelike intervals."
        }
      ],
      targetNodes: [
        {
          id: "node-1",
          type: "heading",
          content: "2.4 — Formalismo Geométrico de la Esfera de Bloch y Teletransportación Determinista de Estados",
          metadata: { subtitle: "Capítulo II • Fundamentos" }
        },
        {
          id: "node-2",
          type: "paragraph",
          content: "La orientación espacial de un estado cuántico arbitrario de un único cúbit $|\\psi\\rangle$ dentro del espacio de Hilbert proyectivo complejo $\\mathbb{C}\\mathrm{P}^1$ puede proyectarse isomórficamente sobre la superficie de una variedad riemanniana tridimensional unitaria, denominada convencionalmente como la <em>esfera de Bloch</em>. En dicho marco teórico, el vector de estado arbitrario adopta la siguiente parametrización esférica canónica:"
        },
        {
          id: "node-3",
          type: "equation",
          content: "|ψ⟩ = cos(θ/2)|0⟩ + e<sup>iφ</sup> sin(θ/2)|1⟩",
          metadata: { caption: "Ecuación (2.19) • Descomposición Polar Esférica" }
        },
        {
          id: "node-4",
          type: "paragraph",
          content: "El protocolo de teletransportación aprovecha las correlaciones no locales distribuidas a través de pares entrelazados máximos de Einstein-Podolsky-Rosen (EPR). Mediante la preparación previa del estado de Bell canónico $|\\Phi^+\\rangle_{AB} = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$, el nodo transmisor (Alice), que custodia el estado objetivo sin medir $|\\psi\\rangle_C$, efectúa una medición proyectiva de Bell conjunta sobre el subsistema compuesto."
        },
        {
          id: "node-5",
          type: "note",
          content: "<em>Anotación:</em> La latencia de propagación del canal clásico $\\Delta \\tau = d/c$ preserva la causalidad relativista, imposibilitando la transferencia de información superlumínica instantánea."
        }
      ]
    }
  ]
};

export default function ReaderPage({ params }: { params: { jobId: string } }) {
  const [currentPage, setCurrentPage] = useState(3);
  const { viewMode, toggleViewMode, hoveredNodeId, handleNodeHover } = useReaderMode("split");

  // Mock fetching current page data
  const pageData = mockDocument.pages[0]; // In a real app, find the page matching currentPage

  return (
    <div className="flex flex-col min-h-screen bg-surface selection:bg-primary-fixed">
      {/* Basic Navigation / Standard Top Header */}
      <LandingHeader />

      <main className="flex-1 w-full pt-16 flex flex-col">
        {/* Document Sub-Header & Synchronized Control Bar */}
        <ReaderSubHeader 
          viewMode={viewMode} 
          onViewModeChange={toggleViewMode} 
        />

        {/* Main Dual-Pane Workspace Canvas */}
        <SplitPaneContainer 
          viewMode={viewMode}
          pageData={pageData}
          sourceLangCode={mockDocument.sourceLang}
          targetLangCode={mockDocument.targetLang}
          sourceTitle="Section 2.4 • Bloch Representation"
          targetTitle="Español Académico Neutro"
          hoveredNodeId={hoveredNodeId}
          onNodeHover={handleNodeHover}
        />
      </main>

      {/* DOCKED BOTTOM FILMSTRIP */}
      <FilmstripFooter 
        currentPage={currentPage}
        totalPages={mockDocument.totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
