import React from "react";
import { Icon } from "@/shared/ui/Icon";

/**
 * Landing page hero section.
 * Features AI badge, main display headline, and subtext.
 */
export function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-margin pt-14 pb-8 text-center flex flex-col items-center">
      {/* Centered Badge */}
      <div className="inline-flex items-center gap-space-xs px-space-md py-1 rounded-full bg-primary-fixed text-primary shadow-sm mb-space-md transition-transform hover:scale-[1.02]">
        <Icon name="auto_awesome" size={17} fill={1} className="leading-none text-primary" />
        <span className="font-label-caps text-label-caps uppercase tracking-wider text-on-primary-fixed-variant">
          AI-Powered Document Translation 2.0
        </span>
      </div>

      {/* Headline Verbatim */}
      <h1 className="font-display text-headline-xl md:text-display text-on-surface max-w-4xl tracking-tight leading-tight">
        Translate any PDF, keep every diagram intact
      </h1>

      {/* One-line subtext verbatim */}
      <p className="mt-space-md max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
        Preserve 100% of complex diagrams, charts, formulas, and exact multi-column layouts across 80+ languages.
      </p>
    </section>
  );
}
