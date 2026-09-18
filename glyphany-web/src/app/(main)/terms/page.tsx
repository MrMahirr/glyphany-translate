"use client";

import React from "react";
import { LegalLayout } from "@/widgets/legal/LegalLayout";

export default function TermsOfServicePage() {
  return (
    <LegalLayout title="Terms of Service" lastUpdated="September 18, 2026">
      <h2>1. Acceptance of Terms</h2>
      <p>
        By accessing and using Glyphany.ai (the "Service"), you accept and agree to be bound by the terms 
        and provision of this agreement. In addition, when using these particular services, you shall be subject 
        to any posted guidelines or rules applicable to such services.
      </p>

      <h2>2. Description of Service</h2>
      <p>
        Glyphany provides a technical document translation platform utilizing AI-driven neural engines. 
        The Service includes vector rendering, LaTeX preservation, and automated glossary extraction. 
        We reserve the right to modify or discontinue, temporarily or permanently, the Service (or any part thereof) 
        with or without notice.
      </p>

      <h2>3. User Responsibilities &amp; Document Rights</h2>
      <p>
        You retain all intellectual property rights in the documents (the "Source Material") you submit 
        to the Service. By uploading Source Material, you grant Glyphany a limited, temporary license solely 
        for the purpose of processing, rendering, and translating the document as requested by you.
      </p>
      <ul>
        <li>You must not upload classified, illegal, or maliciously encoded documents.</li>
        <li>You are responsible for maintaining the confidentiality of your API keys and account credentials.</li>
        <li>Automated scraping or reverse engineering of the vector-rendering pipelines is strictly prohibited.</li>
      </ul>

      <h2>4. Quotas and Fair Use</h2>
      <p>
        Usage of the Service is subject to the page translation limits defined by your subscription tier 
        (e.g., the Pro Researcher Plan includes 50 pages per month). Unused quota does not roll over to the 
        following billing cycle. Accounts utilizing custom LLM endpoints (VPC) are subject to separate enterprise 
        SLAs and throttling thresholds.
      </p>

      <h2>5. Warranties and Limitations of Liability</h2>
      <p>
        While Glyphany strives for maximum linguistic and technical accuracy (ISO-17100 standard), neural machine 
        translation may occasionally produce errors or misinterpret complex mathematical theorems. 
        <strong>
          The translations are provided "as is". We make no warranties, expressed or implied, regarding the 
          infallibility of the translated technical jargon.
        </strong>
      </p>
      <p>
        In no event shall Glyphany.ai, nor its directors, employees, partners, agents, suppliers, or affiliates, 
        be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, 
        loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the translations 
        in production or academic environments.
      </p>
    </LegalLayout>
  );
}
