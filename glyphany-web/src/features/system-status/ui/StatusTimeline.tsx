"use client";

import React from "react";
import { Icon } from "@/shared/ui/Icon";

const mockIncidents = [
  {
    id: "INC-992",
    date: "Sep 16, 2026",
    title: "Elevated Error Rates on PDF Ingestion",
    description: "We identified and resolved an issue causing a 5% failure rate when processing heavily nested MathML elements. A patch was deployed to the Vector OCR engine.",
    status: "resolved",
  },
  {
    id: "INC-985",
    date: "Sep 12, 2026",
    title: "DeepL API Latency",
    description: "Upstream connection timeouts caused delays in translations relying on the DeepL Pro engine. The provider has resolved the networking issue.",
    status: "resolved",
  },
];

export function StatusTimeline() {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-6">Past Incidents</h3>
      
      <div className="flex flex-col gap-8">
        {mockIncidents.map((incident, index) => (
          <div key={incident.id} className="relative pl-6 sm:pl-8">
            {/* Timeline Line */}
            {index !== mockIncidents.length - 1 && (
              <div className="absolute left-[11px] sm:left-[15px] top-6 bottom-[-24px] w-px bg-outline-variant/30"></div>
            )}
            
            {/* Timeline Dot */}
            <div className="absolute left-0 sm:left-1 top-1.5 w-6 h-6 rounded-full bg-surface-container border-2 border-surface flex items-center justify-center shadow-sm z-10">
              <Icon name="check" size={14} className="text-emerald-600" />
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h4 className="font-label-lg text-label-lg text-on-surface font-semibold">{incident.title}</h4>
                <span className="font-body-sm text-body-sm text-on-surface-variant">{incident.date}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {incident.description}
              </p>
            </div>
          </div>
        ))}

        <div className="pt-4 border-t border-outline-variant/20 text-center">
          <span className="font-body-sm text-body-sm text-on-surface-variant">No other incidents reported in the last 30 days.</span>
        </div>
      </div>
    </div>
  );
}
