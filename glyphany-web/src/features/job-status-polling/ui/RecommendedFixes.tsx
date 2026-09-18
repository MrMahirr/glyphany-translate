import React from "react";
import { Icon } from "@/shared/ui/Icon";

export function RecommendedFixes() {
  return (
    <div className="mt-2 flex flex-col gap-2">
      <span className="font-label-caps text-label-caps uppercase text-on-surface-variant font-semibold">
        Recommended Fixes
      </span>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FixCard 
          icon="lock_open"
          title="1. Verify DRM/Password"
          desc="Confirm that no document assembly or extract restrictions are enforced on the file properties."
        />
        <FixCard 
          icon="picture_as_pdf"
          title="2. Re-save as PDF/A"
          desc="Open in Preview/Acrobat and export as flattened PDF/A-1b to normalize nested compressed vectors."
        />
        <FixCard 
          icon="tune"
          title="3. Enable OCR Fallback"
          desc="Activate the rasterized OCR fallback engine in translation advanced settings before re-uploading."
        />
      </div>
    </div>
  );
}

function FixCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg bg-surface-container-low flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-on-surface font-label-md text-label-md font-semibold">
        <Icon name={icon} size={16} className="text-primary" />
        <span>{title}</span>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        {desc}
      </p>
    </div>
  );
}
