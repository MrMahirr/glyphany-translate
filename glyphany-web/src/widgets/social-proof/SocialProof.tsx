import React from "react";
import { Icon } from "@/shared/ui/Icon";

/**
 * Social proof widget.
 * Features a large statistical milestone and trusted institutional logos.
 */
export function SocialProof() {
  return (
    <section className="max-w-7xl mx-auto px-margin pt-14 pb-16 mt-6">
      <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col items-center text-center gap-space-lg">
        {/* Big Stat Header */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-space-sm">
          <Icon name="verified" size={28} className="text-primary" />
          <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
            Over 2,400,000 pages translated with zero broken layout reports
          </p>
        </div>

        {/* Technical Institutions & Tech Universities Logos */}
        <div className="w-full flex flex-wrap items-center justify-center gap-x-10 gap-y-4 pt-space-xs text-on-surface-variant">
          
          <InstitutionLogo name="MIT Labs">
            <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
          </InstitutionLogo>

          <InstitutionLogo name="ETH Zürich">
            <path d="M12 2L4 5V11.09C4 16.14 7.41 20.85 12 22C16.59 20.85 20 16.14 20 11.09V5L12 2M12 4.4L18 6.65V11.09C18 15.08 15.45 18.78 12 19.89C8.55 18.78 6 15.08 6 11.09V6.65L12 4.4Z" />
          </InstitutionLogo>

          <InstitutionLogo name="CERN Research">
            <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4C9.11 4 6.6 5.64 5.35 8.04C2.34 8.36 0 10.91 0 14C0 17.31 2.69 20 6 20H19C21.76 20 24 17.76 24 15C24 12.36 21.95 10.22 19.35 10.04Z" />
          </InstitutionLogo>

          <InstitutionLogo name="Stanford BioTech">
            <path d="M12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12A10 10 0 0 0 12 2M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M12 6A6 6 0 0 0 6 12A6 6 0 0 0 12 18A6 6 0 0 0 18 12A6 6 0 0 0 12 6M12 8A4 4 0 0 1 16 12A4 4 0 0 1 12 16A4 4 0 0 1 8 12A4 4 0 0 1 12 8Z" />
          </InstitutionLogo>

          <InstitutionLogo name="Fraunhofer IP">
            <path d="M12 2L1 21H23L12 2M12 6L19.53 19H4.47L12 6M11 10V14H13V10H11M11 16V18H13V16H11Z" />
          </InstitutionLogo>

        </div>
      </div>
    </section>
  );
}

function InstitutionLogo({ name, children }: { name: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition-all cursor-default">
      <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 24 24">
        {children}
      </svg>
      <span className="font-headline-sm text-body-md font-bold tracking-tight">{name}</span>
    </div>
  );
}
