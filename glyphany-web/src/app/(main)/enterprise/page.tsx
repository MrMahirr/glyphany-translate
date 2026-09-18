"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";
import { BRAND } from "@/shared/config/brand";
import { ContactForm } from "@/features/enterprise/ui/ContactForm";

export default function EnterprisePage() {
  return (
    <div className="w-full max-w-[1280px] mx-auto px-gutter py-space-xl min-h-screen">
      
      {/* Back to Workspace */}
      <Link href="/" className="inline-flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary transition-colors mb-space-lg">
        <Icon name="arrow_back" size={16} />
        <span>Back to Workspace</span>
      </Link>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
        
        {/* Left Column: Copy & Value Props */}
        <div className="flex-1 lg:py-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-container/50 border border-primary/20 text-primary font-label-caps text-label-caps uppercase tracking-wider mb-6">
            <Icon name="domain" size={16} />
            <span>Glyphany for Enterprise</span>
          </div>
          
          <h1 className="font-display-mobile md:font-display text-[40px] md:text-[56px] leading-[1.1] text-on-surface tracking-tight mb-6">
            Scale your technical translation operations
          </h1>
          
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-12">
            Secure, scalable, and API-first. Bring {BRAND.name}'s context-aware neural engines directly into your company's workflow with SOC 2 compliance and zero data retention.
          </p>

          <div className="flex flex-col gap-8">
            {/* Feature 1 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 mt-1 text-primary">
                <Icon name="vpn_key" size={24} />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">Single Sign-On (SSO)</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Integrate securely with Okta, Azure AD, or any SAML 2.0 identity provider for centralized access control.</p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 mt-1 text-primary">
                <Icon name="api" size={24} />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">High-Throughput API</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Automate translation pipelines directly from your CMS or CI/CD pipelines with REST APIs and webhooks.</p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center flex-shrink-0 mt-1 text-primary">
                <Icon name="gpp_good" size={24} />
              </div>
              <div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-1">Zero Training Retention</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">We guarantee your corporate documents are processed entirely in RAM and never used to train foundational AI models.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="w-full lg:w-[540px] flex-shrink-0">
          <ContactForm />
        </div>

      </div>
    </div>
  );
}
