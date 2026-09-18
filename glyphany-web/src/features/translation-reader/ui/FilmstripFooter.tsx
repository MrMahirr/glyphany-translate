"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";

interface FilmstripFooterProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function FilmstripFooter({ currentPage, totalPages, onPageChange }: FilmstripFooterProps) {
  // Generate dummy thumbnails
  const thumbnails = Array.from({ length: Math.min(totalPages, 12) }, (_, i) => i + 1);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(0,0,0,0.06)] px-4 py-2.5">
      <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
        
        {/* Filmstrip Controls & Page Jump */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button type="button" className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface p-1.5 rounded-lg hover:bg-surface-container transition-colors font-label-caps text-label-caps cursor-pointer">
            <Icon name="view_carousel" size={18} />
            <span className="hidden md:inline">Thumbnails</span>
          </button>
          <div className="flex items-center gap-1 bg-surface-container-low px-2 py-1 rounded-lg">
            <span className="font-label-md text-label-md text-on-surface-variant">Jump:</span>
            <input 
              type="number" 
              min={1} 
              max={totalPages} 
              value={currentPage}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                if (val >= 1 && val <= totalPages) onPageChange(val);
              }}
              className="w-10 bg-transparent text-center font-label-md text-label-md text-primary font-bold focus:outline-none"
            />
            <span className="font-label-md text-label-md text-on-surface-variant">/ {totalPages}</span>
          </div>
        </div>

        {/* Scrollable Thumbnail Ribbon */}
        <div className="flex items-center gap-3 overflow-x-auto py-1 scroll-smooth max-w-full">
          {thumbnails.map(pageNum => {
            const isActive = pageNum === currentPage;
            return (
              <button 
                key={pageNum}
                type="button" 
                onClick={() => onPageChange(pageNum)}
                className={cn(
                  "group relative flex-shrink-0 flex flex-col items-center gap-1 p-1 rounded-lg transition-all cursor-pointer",
                  isActive ? "bg-primary-fixed/40" : "hover:bg-surface-container"
                )}
              >
                <div className={cn(
                  "w-12 h-16 rounded flex flex-col justify-between p-1.5",
                  isActive 
                    ? "bg-surface-container-lowest shadow-md ring-2 ring-primary-container" 
                    : "bg-surface-container-low shadow-xs group-hover:shadow-sm"
                )}>
                  <div className="space-y-1">
                    <div className={cn("h-1 rounded w-3/4", isActive ? "bg-primary" : "bg-on-surface-variant/30")}></div>
                    <div className={cn("h-1 rounded w-full", isActive ? "bg-on-surface-variant/30" : "bg-on-surface-variant/20")}></div>
                    <div className={cn("h-1 rounded w-5/6", isActive ? "bg-secondary-fixed h-3" : "bg-on-surface-variant/20")}></div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    {isActive && <span className="font-label-caps text-[8px] text-primary font-bold">SEC {pageNum}</span>}
                    <Icon name="check_circle" size={12} className={cn("self-end", isActive ? "text-emerald-600" : "text-emerald-600/50")} />
                  </div>
                </div>
                <span className={cn(
                  "font-label-caps text-[10px]",
                  isActive ? "text-primary font-bold" : "text-on-surface-variant"
                )}>
                  {pageNum} {isActive && "• Active"}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Navigation Utilities Right */}
        <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
          <button 
            type="button" 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Icon name="chevron_left" size={24} />
          </button>
          <button 
            type="button" 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Icon name="chevron_right" size={24} />
          </button>
        </div>

      </div>
    </footer>
  );
}
