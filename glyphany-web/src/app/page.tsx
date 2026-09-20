"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { LandingHeader } from "@/widgets/landing-header/LandingHeader";
import { Footer } from "@/widgets/footer/Footer";
import { HeroSection } from "@/widgets/hero-section/HeroSection";
import { SocialProof } from "@/widgets/social-proof/SocialProof";
import { FeatureHighlights } from "@/widgets/feature-highlights/FeatureHighlights";
import { UploadDropzone } from "@/features/upload-pdf/ui/UploadDropzone";
import { LanguageSelector } from "@/features/select-language/ui/LanguageSelector";
import { Button } from "@/shared/ui/Button";
import { Icon } from "@/shared/ui/Icon";
import { uploadAndTranslate } from "@/features/upload-pdf/api/uploadApi";
import { toast } from "react-hot-toast";

/**
 * Main Landing Page.
 * Assembles the landing page components into the final layout.
 */
export default function LandingPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetLang, setTargetLang] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (!selectedFile) return;

    setIsTranslating(true);
    try {
      // API request to upload and start translation
      const response = await uploadAndTranslate({
        file: selectedFile,
        targetLang: targetLang,
      });
      
      // In a real app, we would redirect to a translation status/workspace page
      // with the ID or show a success state.
      router.push(`/translate/${response.id}/progress`);
      
      toast.success("Translation started! Check console for response.");
      console.log(response);

    } catch (error) {
      console.error("Translation upload failed", error);
      toast.error("Translation failed to start. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      <LandingHeader />

      <main className="flex-1 w-full pt-16">
        
        {/* Subtle Ambient Glow Background */}
        <div className="relative w-full overflow-hidden">
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[840px] h-[360px] bg-gradient-to-tr from-primary-fixed/35 via-surface-container-high/40 to-transparent blur-3xl -z-10 pointer-events-none rounded-full" />
          
          <HeroSection />

          {/* MAIN INTERACTIVE WORKSPACE (2-Column Desktop Grid) */}
          <section id="features" className="max-w-7xl mx-auto px-margin py-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
              
              {/* Left Column (Upload & Controls) */}
              <div className="lg:col-span-7 flex flex-col gap-space-md h-full">
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl shadow-surface-container/60 transition-all duration-300 flex flex-col justify-between flex-1">
                  
                  <div>
                    <UploadDropzone 
                      selectedFile={selectedFile} 
                      onFileSelect={setSelectedFile} 
                    />
                  </div>

                  {/* Translation Controls */}
                  <div className="mt-space-lg pt-space-md bg-surface-container-lowest flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-space-md border-t border-outline-variant/30">
                    <LanguageSelector 
                      value={targetLang} 
                      onChange={setTargetLang} 
                    />

                    <div className="flex flex-col sm:items-end justify-end pt-5">
                      <Button
                        variant="primary"
                        size="lg"
                        disabled={!selectedFile}
                        loading={isTranslating}
                        onClick={handleTranslate}
                        icon={isTranslating ? undefined : "arrow_forward"}
                        className="w-full sm:w-auto px-space-lg shadow-md"
                      >
                        {isTranslating ? "Neural Translating..." : "Translate Now"}
                      </Button>
                      <span className="font-label-md text-[11px] mt-1 text-center sm:text-right transition-colors duration-300">
                        {selectedFile 
                          ? <span className="text-primary">Ready to translate • Preserving layout matrix</span> 
                          : <span className="text-on-surface-variant">Select a file to begin translation</span>
                        }
                      </span>
                    </div>
                  </div>
                </div>

                {/* Micro-Trust Indicators Directly Beneath Card */}
                <div className="px-space-xs py-space-xs flex flex-wrap items-center justify-center sm:justify-start gap-x-space-md gap-y-1 text-on-surface-variant text-body-sm">
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="lock" size={16} className="text-primary" />
                    Enterprise-grade TLS encryption
                  </span>
                  <span className="hidden sm:inline text-outline-variant">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="auto_delete" size={16} className="text-primary" />
                    Files auto-deleted after 24h
                  </span>
                  <span className="hidden sm:inline text-outline-variant">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon name="security" size={16} className="text-primary" />
                    Zero AI model training
                  </span>
                </div>
              </div>

              {/* Right Column (Visual Demonstration & Features) */}
              <div className="lg:col-span-5">
                <FeatureHighlights />
              </div>

            </div>
          </section>

          <SocialProof />
        </div>
      </main>

      <Footer />
    </div>
  );
}
