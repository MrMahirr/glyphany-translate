"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import Link from "next/link";

export function TranslationFilters() {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg">
      
      {/* Title & Description */}
      <div className="space-y-1.5 max-w-xl">
        <div className="flex items-center gap-3">
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">My Translations</h1>
          <span className="px-3 py-0.5 rounded-full bg-surface-container text-primary font-label-caps text-label-caps font-bold">
            14 DOCUMENTS
          </span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Manage, view, and export your translated technical documents, patent filings, and complex vector diagrams.
        </p>
      </div>

      {/* Action Cluster */}
      <div className="flex flex-wrap items-center gap-space-sm">
        
        {/* Search Input */}
        <div className="relative min-w-[260px] flex-1 sm:flex-initial">
          <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
          <input 
            type="text" 
            placeholder="Search by title, language..." 
            className="w-full h-10 pl-9 pr-14 bg-surface-container-lowest text-on-surface placeholder:text-outline rounded-lg text-body-sm font-body-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-container"
          />
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 rounded bg-surface-container text-outline font-label-caps text-label-caps text-[10px] pointer-events-none">
            ⌘K
          </div>
        </div>

        {/* Filter: Languages */}
        <div className="relative">
          <select className="h-10 pl-3 pr-8 bg-surface-container-lowest text-on-surface rounded-lg text-label-md font-label-md shadow-sm appearance-none cursor-pointer hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container">
            <option>All Languages</option>
            <option>English → Spanish</option>
            <option>German → English</option>
            <option>French → English</option>
            <option>Japanese → English</option>
          </select>
          <Icon name="expand_more" size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
        </div>

        {/* Filter: Statuses */}
        <div className="relative">
          <select className="h-10 pl-3 pr-8 bg-surface-container-lowest text-on-surface rounded-lg text-label-md font-label-md shadow-sm appearance-none cursor-pointer hover:bg-surface-container-low transition-colors focus:outline-none focus:ring-2 focus:ring-primary-container">
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Processing</option>
            <option>Failed</option>
          </select>
          <Icon name="expand_more" size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-outline" />
        </div>

        {/* View Switcher Toggle */}
        <div className="flex items-center p-1 bg-surface-container rounded-lg shadow-inner">
          <button aria-label="Table View" type="button" className="p-1.5 rounded-md bg-surface-container-lowest text-primary shadow-sm flex items-center justify-center cursor-pointer">
            <Icon name="view_list" size={18} />
          </button>
          <button aria-label="Grid View" type="button" className="p-1.5 rounded-md text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors cursor-pointer">
            <Icon name="grid_view" size={18} />
          </button>
        </div>

        {/* Primary Upload CTA */}
        <Link href="/" className="h-10 px-4 flex items-center gap-2 bg-primary-container text-on-primary rounded-lg font-label-lg text-label-lg hover:bg-primary shadow-[0_4px_14px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0">
          <Icon name="add" size={18} />
          <span>New Translation</span>
        </Link>
      </div>
    </div>
  );
}
