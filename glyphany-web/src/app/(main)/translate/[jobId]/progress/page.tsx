"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { Footer } from "@/widgets/footer/Footer";
import { ProgressControlBar } from "@/features/job-status-polling/ui/ProgressControlBar";
import { DocumentMetadataCard } from "@/features/job-status-polling/ui/DocumentMetadataCard";
import { TranslationStepper } from "@/features/job-status-polling/ui/TranslationStepper";
import { Icon } from "@/shared/ui/Icon";
import { useJobStatusPolling } from "@/features/job-status-polling/hooks/useJobStatusPolling";
import { cn } from "@/shared/lib/cn";
import type { JobStatusResponse } from "@/domain/job/jobDomains";

export default function ProgressPage({ params }: { params: Promise<{ jobId: string }> }) {
  const router = useRouter();
  const { jobId } = use(params);

  // Real-time polling via API
  const { jobData, cancelJob } = useJobStatusPolling({ jobId });

  const [isNotified, setIsNotified] = useState(false);

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to halt this document translation? Extracted layers will be discarded.")) {
      cancelJob();
      router.back();
    }
  };

  useEffect(() => {
    if (jobData?.progress.status === "completed") {
      router.push(`/translate/${jobId}/reader`);
    }
  }, [jobData?.progress.status, jobId, router]);

  if (!jobData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <Icon name="progress_activity" size={48} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <LandingHeader />

      <main className="flex-1 w-full pt-16">
        <div className="flex flex-col w-full min-w-0">
          
          {/* Subtle Ambient Glow Accents */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[320px] bg-gradient-to-b from-primary-fixed/40 via-surface-container-low/20 to-transparent blur-3xl pointer-events-none -z-10" />

            {/* Top Progress Control Bar */}
            <ProgressControlBar 
              jobId={jobData.id} 
              engineVersion={jobData.metadata.engineVersion}
              onCancel={handleCancel}
              isCancellable={jobData.progress.status !== "completed" && jobData.progress.status !== "canceled"}
            />

            {/* Main Centered Content Canvas */}
            <div className="max-w-3xl mx-auto px-margin pt-8 pb-16 w-full flex flex-col gap-6">
              
              <DocumentMetadataCard 
                metadata={jobData.metadata} 
                status={jobData.progress.status} 
              />

              {jobData.progress.status === 'failed' && (
                <div className="w-full bg-error/10 rounded-xl p-5 border border-error/30 flex flex-col items-start gap-2 shadow-sm">
                  <div className="flex items-center gap-2 text-error">
                    <Icon name="error" size={24} />
                    <h3 className="font-label-lg font-bold">Translation Failed</h3>
                  </div>
                  <p className="font-body-md text-on-surface-variant">
                    {jobData.progress.errorMessage || "An unexpected error occurred during translation processing."}
                  </p>
                </div>
              )}

              <TranslationStepper progress={jobData.progress} />

              {/* Calming Assurance & Background Notification Card */}
              <div className="w-full bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-container-low text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name="format_image_left" size={20} />
                  </div>
                  <div>
                    <h3 className="font-label-lg text-label-lg font-bold text-on-surface">You can safely close this window</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Translation runs independently on our high-performance cluster. We will keep your finished document securely cached for 7 days.
                    </p>
                  </div>
                </div>
                <div className="shrink-0 w-full sm:w-auto flex justify-end">
                  <button 
                    onClick={() => setIsNotified(!isNotified)}
                    className={cn(
                      "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border font-label-md text-label-md transition-colors shadow-sm",
                      isNotified 
                        ? "bg-primary-fixed text-on-primary-fixed-variant border-primary/30 hover:bg-primary-fixed/80" 
                        : "bg-surface-container-low hover:bg-surface-container border-outline-variant/40 text-on-surface"
                    )}
                  >
                    <Icon name={isNotified ? "check_circle" : "notifications"} size={16} className="text-primary" />
                    <span>{isNotified ? "Notification Scheduled" : "Notify me when ready"}</span>
                  </button>
                </div>
              </div>

              {/* Quick Technical Specs Drawer / Footnote */}
              <div className="flex items-center justify-between px-2 text-on-surface-variant font-body-sm text-body-sm mt-4">
                <div className="flex items-center gap-2">
                  <Icon name="verified_user" size={16} className="text-outline" />
                  <span>AES-256 Encrypted in transit &amp; at rest</span>
                </div>
                <div className="flex items-center gap-4">
                  <button className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Document Logs</button>
                  <span>•</span>
                  <button className="text-on-surface-variant hover:text-primary transition-colors text-body-sm">Live Support</button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
