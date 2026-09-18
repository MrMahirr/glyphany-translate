"use client";

import React from "react";
import { LegalLayout } from "@/widgets/legal/LegalLayout";

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="September 18, 2026">
      <h2>1. Introduction</h2>
      <p>
        At Glyphany.ai ("we", "our", or "us"), we respect your privacy and are committed to protecting 
        the personal data and sensitive documents you trust us to translate. This Privacy Policy explains 
        how we collect, use, disclose, and safeguard your information when you use our neural translation 
        service and enterprise APIs.
      </p>

      <h2>2. Data We Collect</h2>
      <p>We may collect information about you in a variety of ways. The information we may collect includes:</p>
      <ul>
        <li>
          <strong>Account Data:</strong> Email address, organization name, billing details, and authentication tokens (e.g., Okta/SAML).
        </li>
        <li>
          <strong>Document Data:</strong> PDF files, LaTeX sources, CAD files, and text data you upload for translation.
        </li>
        <li>
          <strong>Telemetry Data:</strong> Translation engine preferences, error logs, formatting issues, and usage metrics to improve our rendering algorithms.
        </li>
      </ul>

      <h2>3. Zero Training Retention</h2>
      <p>
        For Enterprise and Pro tier users, we operate on a strict <strong>Zero Training Retention</strong> policy. 
        Your documents and their translations are processed ephemerally in RAM. They are <em>never</em> used to 
        train our foundational neural models (such as Neural v4.2). Once a translation job is completed and downloaded, 
        the source and output vectors are securely purged from our processing nodes.
      </p>

      <h2>4. Third-Party Engines</h2>
      <p>
        Depending on your <em>Preferred translation engine</em> settings, your document text (stripped of structural vectors) 
        may be routed to third-party subprocessors like <strong>DeepL Pro</strong> or <strong>Anthropic (Claude)</strong>. 
        We have signed strict Data Processing Agreements (DPAs) with these providers ensuring they do not retain or train 
        on your corporate data.
      </p>

      <h2>5. Security Protocols</h2>
      <p>
        We use administrative, technical, and physical security measures to help protect your personal information. 
        All data in transit is encrypted using <strong>TLS 1.3</strong>. Data at rest (such as your account preferences and glossaries) 
        is encrypted using AES-256. Our infrastructure is audited for SOC 2 Type II compliance annually.
      </p>

      <h2>6. Contact Us</h2>
      <p>
        If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer (DPO) at:
        <br />
        Email: <a href="mailto:privacy@glyphany.com">privacy@glyphany.com</a>
      </p>
    </LegalLayout>
  );
}
