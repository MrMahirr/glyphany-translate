"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";

export function TranslationEmptyState() {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm text-center relative overflow-hidden">
      
      {/* Ambient Decorative Backdrop Circle */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="max-w-xl mx-auto flex flex-col items-center relative z-10 py-6">
        
        {/* Custom Vector Illustration */}
        <div className="w-24 h-24 mb-space-md rounded-2xl bg-surface-container flex items-center justify-center relative shadow-inner">
          <svg className="w-14 h-14 text-primary" fill="none" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 36L20 44H36L44 36" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"></path>
            <path d="M8 24H48V38C48 40.2091 46.2091 42 44 42H12C9.79086 42 8 40.2091 8 38V24Z" stroke="currentColor" strokeDasharray="3 3" strokeWidth="2"></path>
            
            <rect fill="white" height="22" rx="2" stroke="currentColor" strokeWidth="2" width="16" x="20" y="10"></rect>
            <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" x1="24" x2="32" y1="16" y2="16"></line>
            <line stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" x1="24" x2="30" y1="20" y2="20"></line>
            <circle cx="25" cy="25" fill="currentColor" r="1.5"></circle>
            
            <path d="M42 14L43.5 17.5L47 19L43.5 20.5L42 24L40.5 20.5L37 19L40.5 17.5L42 14Z" fill="#4f46e5"></path>
            <circle cx="14" cy="18" fill="#4f46e5" r="1.5"></circle>
          </svg>
          
          <div className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1 shadow-md">
            <Icon name="add" size={14} />
          </div>
        </div>

        {/* Typography Content */}
        <h2 className="font-headline-md text-headline-md text-on-surface font-bold tracking-tight mb-2">
          No translations yet — upload your first PDF
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-md mb-space-lg">
          Drag and drop your academic papers, technical manuals, or patents to translate while keeping diagrams, math formulas, and bounding boxes 100% intact.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-space-sm mb-space-lg">
          <Link href="/" className="h-11 px-6 bg-primary-container hover:bg-primary text-on-primary rounded-lg font-label-lg text-label-lg flex items-center gap-2 shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-0.5">
            <Icon name="cloud_upload" size={20} />
            <span>Upload Document</span>
          </Link>
          <button type="button" className="h-11 px-5 bg-surface-container-low hover:bg-surface-container text-on-surface rounded-lg font-label-lg text-label-lg flex items-center gap-2 transition-colors cursor-pointer">
            <Icon name="science" size={18} />
            <span>Try with Sample Paper</span>
          </button>
        </div>

        {/* Supported Formats */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">PDF (VECTOR &amp; SCANNED)</span>
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">EPUB</span>
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">DOCX</span>
          <span className="px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-caps text-label-caps">PPTX</span>
          <span className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps font-bold">UP TO 100 MB</span>
        </div>

      </div>
    </div>
  );
}
