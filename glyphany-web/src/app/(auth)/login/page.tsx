"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BRAND } from "@/shared/config/brand";
import { Icon } from "@/shared/ui/Icon";
import { Divider } from "@/shared/ui/Divider";
import { AuthTabs } from "@/features/auth/ui/AuthTabs";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";
import { SocialAuthButtons } from "@/features/auth/ui/SocialAuthButtons";
import { getMe } from "@/features/auth/api/authApi";
import { useAuthStore } from "@/features/auth/store/authStore";

type AuthTab = "login" | "signup";

/**
 * Login / Register Page.
 * Full-screen centered auth card with gradient background glow effects,
 * floating MathML badge, social auth, enterprise SSO, and trust badges.
 * Referans: plan/frontend-desing/login.html + login.png
 */
import { Suspense } from "react";

function LoginPageContent() {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
      
      // Fetch user profile immediately
      getMe()
        .then((user) => {
          setAuth(user, token);
          router.push("/");
        })
        .catch(() => {
          // If token is invalid or backend fails
          localStorage.removeItem("auth_token");
        });
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8 overflow-hidden bg-surface">
      {/* ── Background Glow Effects ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary-fixed-dim/40 blur-3xl" />
        <div className="absolute top-1/3 -right-48 w-[32rem] h-[32rem] rounded-full bg-secondary-fixed/50 blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-surface-container-high/60 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "radial-gradient(#3525cd 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* ── Top-Right Navigation ── */}
      <div className="absolute top-4 right-6 sm:top-6 sm:right-10 flex items-center gap-4 z-20">
        <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded-full shadow-sm">
          <Icon name="translate" size={16} className="text-primary" />
          <span className="text-label-caps text-on-surface">EN-US</span>
        </div>
        <a
          href="/"
          className="inline-flex items-center gap-1 text-label-lg text-on-surface-variant hover:text-primary transition-colors"
        >
          <Icon name="arrow_back" size={16} />
          <span>Back to {BRAND.name}</span>
        </a>
      </div>

      {/* ── Main Auth Card ── */}
      <div className="relative w-full max-w-[480px] z-10 my-auto animate-slide-up">
        {/* Floating Badge */}
        <div className="hidden lg:flex items-center gap-2 absolute -top-10 -left-12 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-md animate-pulse-soft">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          <span className="text-label-caps text-primary uppercase">
            Preserving MathML &amp; Vector Layouts
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-6 sm:p-10 transition-all">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                <Icon
                  name="layers"
                  size={24}
                  className="text-on-primary"
                />
              </div>
              <span className="text-headline-md tracking-tight text-on-surface">
                {BRAND.name}
                <span className="text-primary-container font-black">.ai</span>
              </span>
            </div>
            <p className="text-body-sm text-on-surface-variant max-w-[320px]">
              {BRAND.tagline}
            </p>
          </div>

          {/* Tabs */}
          <AuthTabs activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Form — Login or Register */}
          {activeTab === "login" ? <LoginForm /> : <RegisterForm />}

          {/* Divider */}
          <Divider text="or authenticate with" className="my-6" />

          {/* Social Auth */}
          <SocialAuthButtons />

          {/* Footer Bar */}
          <div className="mt-6 pt-5 bg-surface-container-low -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-5 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <a
              href="#"
              className="text-label-lg text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Icon name="domain" size={16} className="text-primary" />
              <span>Enterprise SSO (Okta/SAML)</span>
              <Icon name="chevron_right" size={14} />
            </a>
            <div className="flex items-center gap-1 text-on-surface-variant text-label-caps">
              <Icon
                name="verified_user"
                size={15}
                className="text-primary"
              />
              <span>TLS 1.3 / E2EE</span>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-on-surface-variant">
          <TrustBadge icon="verified" label="SOC 2 Type II" />
          <span className="text-outline-variant text-[12px]">•</span>
          <TrustBadge icon="gavel" label="ISO-17100 Certified" />
          <span className="text-outline-variant text-[12px]">•</span>
          <TrustBadge icon="shield" label="Zero Training Retention" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}

/* ─── Trust Badge Sub-Component ─── */

function TrustBadge({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon name={icon} size={16} className="text-primary" />
      <span className="text-label-caps">{label}</span>
    </div>
  );
}
