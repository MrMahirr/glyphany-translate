import React from "react";
import { Icon } from "@/shared/ui/Icon";

/**
 * Feature highlights widget.
 * Right column of the main workspace containing the neural visualizer demo and 3 core features.
 */
export function FeatureHighlights() {
  return (
    <div className="flex flex-col gap-space-lg h-full">
      
      {/* Visual Preview Frame */}
      <div className="relative bg-surface-container-lowest rounded-2xl p-space-md shadow-xl shadow-surface-container/60 overflow-hidden group">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-primary-fixed/40 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between pb-space-sm">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-error/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-primary/70" />
            <span className="ml-2 font-label-md text-label-md text-on-surface-variant">
              Neural Diagram Matcher
            </span>
          </div>
          <span className="font-label-caps text-label-caps bg-surface-container-high px-2 py-0.5 rounded text-primary uppercase">
            v2.4 Live Engine
          </span>
        </div>

        {/* Custom Document Comparison Illustration */}
        <div className="relative w-full rounded-xl overflow-hidden bg-surface-container-lowest flex items-center justify-center p-2">
          <img 
            className="w-full h-auto object-contain rounded-lg transition-transform duration-500 group-hover:scale-[1.01]" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCe42qXtplsu0ERyPZ_M4UPRtikYnC4-sWdngcy1enS2ngw7JD2aYremTImchQZ96q5UvDhKuXePcUJLelT4cTti3pBuXmYvB6MLA6t_GPzH9ikezE2mcALeMYaVwQQj8PCZH-9Pvw8bxl95DtE1unHSauCWhnPZDfkIv5x5Dx0DYOQckVGOtPa2dbGcGNXTQBH2cisskqCsa6lXcCHGdOlI1QVv6tY6cqljuTUwTgMVuMfr9RzLXq5"
            alt="Technical document translation diagram" 
          />
        </div>
      </div>

      {/* 3 Concise Feature Highlight Cards */}
      <div className="flex flex-col gap-space-sm">
        
        {/* Feature 1 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex items-start gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
            <Icon name="polyline" size={22} />
          </div>
          <div className="min-w-0">
            <h4 className="font-headline-sm text-body-lg font-bold text-on-surface">Preserved Vector Diagrams</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Vector charts, SVG diagrams, and annotations stay identical in position, stroke weight, and visual clarity.
            </p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex items-start gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
            <Icon name="vertical_split" size={22} />
          </div>
          <div className="min-w-0">
            <h4 className="font-headline-sm text-body-lg font-bold text-on-surface">Side-by-Side Dual View</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Compare original and translated pages in synchronized split-screen view with pixel-accurate bounding inspection.
            </p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm hover:shadow-md transition-all flex items-start gap-space-md">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high text-primary flex items-center justify-center flex-shrink-0">
            <Icon name="functions" size={22} />
          </div>
          <div className="min-w-0">
            <h4 className="font-headline-sm text-body-lg font-bold text-on-surface">Instant Book &amp; Math Formula OCR</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
              Handles complex equations, multi-column tables, and 500+ page technical books without layout drift or text distortion.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
