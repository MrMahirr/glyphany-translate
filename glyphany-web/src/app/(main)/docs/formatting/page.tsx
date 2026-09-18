"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { BRAND } from "@/shared/config/brand";

export default function FormattingGuidePage() {
  return (
    <div className="w-full max-w-[960px] mx-auto px-gutter py-space-lg md:py-space-xl min-h-screen">
      
      {/* Back to Workspace */}
      <Link href="/" className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary transition-colors mb-space-lg">
        <Icon name="arrow_back" size={16} />
        <span>Back to Workspace</span>
      </Link>

      {/* Header */}
      <div className="mb-space-xl border-b border-outline-variant/30 pb-space-md flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
          <Icon name="design_services" size={28} />
        </div>
        <div>
          <h1 className="font-display-mobile md:font-display text-on-surface tracking-tight mb-2">
            Document Formatting Guide
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-2xl">
            Best practices for preparing your PDFs, LaTeX, and CAD files for optimal neural translation and vector preservation.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="bg-surface-container-lowest rounded-2xl p-6 sm:p-10 shadow-sm border border-outline-variant/20">
        <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-on-surface prose-p:text-on-surface-variant prose-li:text-on-surface-variant prose-a:text-primary">
          
          <h2>1. PDF Preparation for OCR</h2>
          <p>
            For best results, ensure your PDF contains actual text layers (Vector PDF) rather than being a scanned image (Raster PDF). 
            If you must upload a scanned document, ensure the resolution is at least <strong>300 DPI</strong>.
          </p>
          <ul>
            <li>Avoid heavily watermarked documents, as they interfere with bounding box detection.</li>
            <li>Flatten transparent layers before exporting to PDF to prevent visual artifacts during split-pane rendering.</li>
          </ul>

          <h2>2. Preserving Mathematical Formulas</h2>
          <p>
            {BRAND.name} automatically detects and protects mathematical formulas from being translated, keeping them intact as pure math tokens.
            However, for complex multi-line equations, we strongly recommend compiling them using standard LaTeX environments like <code>\begin&#123;equation&#125;</code> or <code>\begin&#123;align&#125;</code>.
          </p>
          <div className="bg-amber-50 dark:bg-amber-900/10 border-l-4 border-amber-500 p-4 my-4 rounded-r-lg">
            <p className="text-amber-800 dark:text-amber-400 m-0 font-body-sm">
              <strong>Note:</strong> Hand-drawn formulas or low-quality images of formulas cannot be accurately reconstructed into LaTeX and will be treated as standard image blocks.
            </p>
          </div>

          <h2>3. Diagram and Chart Localization</h2>
          <p>
            Our Vector Engine supports bilingual diagram rendering (Overlay Mode). To utilize this feature:
          </p>
          <ul>
            <li>Ensure callouts in your CAD or Vector graphics are selectable text paths, not outlined shapes.</li>
            <li>Leave adequate negative space around labels to accommodate text expansion (e.g., translating English to German often requires 30% more space).</li>
          </ul>

          <h2>4. Supported File Formats</h2>
          <table className="w-full mt-4 text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-outline-variant/30">
                <th className="py-2">Format</th>
                <th className="py-2">Max Size</th>
                <th className="py-2">Vector Support</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-outline-variant/20">
                <td className="py-2 font-semibold text-on-surface">.pdf</td>
                <td className="py-2">50 MB</td>
                <td className="py-2 text-emerald-600">Full (Native)</td>
              </tr>
              <tr className="border-b border-outline-variant/20">
                <td className="py-2 font-semibold text-on-surface">.tex (LaTeX)</td>
                <td className="py-2">10 MB</td>
                <td className="py-2 text-emerald-600">Full (Native)</td>
              </tr>
              <tr className="border-b border-outline-variant/20">
                <td className="py-2 font-semibold text-on-surface">.docx</td>
                <td className="py-2">25 MB</td>
                <td className="py-2 text-amber-600">Partial (Beta)</td>
              </tr>
            </tbody>
          </table>

        </article>
      </main>

      <div className="mt-8 flex items-center justify-center gap-4 text-body-sm text-on-surface-variant">
        <span>Still facing formatting issues?</span>
        <Link href="/enterprise" className="text-primary hover:underline font-semibold">
          Contact our Enterprise Support
        </Link>
      </div>

    </div>
  );
}
