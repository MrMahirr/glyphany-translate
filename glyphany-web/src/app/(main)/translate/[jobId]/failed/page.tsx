import React from "react";
import Link from "next/link";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { Footer } from "@/widgets/footer/Footer";
import { TranslationFailedView } from "@/features/job-status-polling/ui/TranslationFailedView";
import { Icon } from "@/shared/ui/Icon";

export default function TranslationFailedPage({ params }: { params: { jobId: string } }) {
  const { jobId } = params;

  // Mock data representing a failed job context
  const mockFailedData = {
    jobId: jobId,
    fileName: "Quantum_Computing_Principles_v3.pdf",
    failedPage: 14,
    errorCode: "ERR_VECTOR_ENCRYPT_P14",
    errorMessage: "", // falls back to default component message
    logs: [
      "=== TransDoc Neural Layout Engine Diagnostics v4.2 ===",
      "Session: sess_94208a0df_tx884920 | Worker: node-eu-central-04",
      "[14:22:01.082] STAGE 1/4: PDF Structure & Font Table Deserialization -> OK (18ms)",
      "[14:22:01.104] STAGE 2/4: Optical Flow Bounding Box Clustering -> OK (14 pages)",
      "[14:22:01.458] STAGE 3/4: (LaTeX Math & Diagram Extraction) -> FAILED",
      "[CRITICAL] ParseError: Page 14 object token stream <0x0E> contains corrupt flate-encoded vector table",
      "[WARN] Layer 14-B stream decompression checksum mismatch: expected e3b0c442, received 8f14a091",
      "[INFO] Engine fallback to strict bounding box parser failed: DRM bitflag flagged on XRef subsection 4",
      "[HALT] Pipeline terminated gracefully without memory leak. Zero partial cache committed."
    ]
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <LandingHeader />

      <main className="flex-1 w-full pt-16">
        <div className="flex flex-col w-full min-w-0">
          
          <div className="relative w-full max-w-5xl mx-auto px-margin py-space-xl flex flex-col items-center">
            {/* Ambient Glow */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[540px] h-[340px] bg-gradient-to-b from-primary-fixed/30 via-surface-container-high/20 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />

            <TranslationFailedView {...mockFailedData} />

            {/* Footer Support Links */}
            <div className="w-full max-w-3xl mt-space-md flex flex-col sm:flex-row items-center justify-between gap-space-sm text-center sm:text-left px-2">
              <div className="flex items-center gap-2">
                <Icon name="help_outline" size={18} className="text-outline" />
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  Need guidance on complex mathematical PDF preparation?
                </span>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/docs/formatting" className="font-label-md text-label-md text-primary hover:underline inline-flex items-center gap-1">
                  <span>Read PDF Prep Guide</span>
                  <Icon name="open_in_new" size={14} />
                </Link>
                <span className="text-outline-variant font-light">•</span>
                <Link href="/status" className="font-label-md text-label-md text-on-surface-variant hover:text-on-surface">
                  System Status: <span className="text-primary font-semibold">All Systems Operational</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
