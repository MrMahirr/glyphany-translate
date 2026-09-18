"use client";

import React from "react";
import Link from "next/link";
import { BRAND } from "@/shared/config/brand";
import { Icon } from "@/shared/ui/Icon";
import { ForgotPasswordForm } from "@/features/auth/ui/ForgotPasswordForm";

export default function ForgotPasswordPage() {
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
            backgroundImage: "radial-gradient(#3525cd 1px, transparent 1px)",
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
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-label-lg text-on-surface-variant hover:text-primary transition-colors"
        >
          <Icon name="arrow_back" size={16} />
          <span>Back to {BRAND.name}</span>
        </Link>
      </div>

      {/* ── Main Auth Card ── */}
      <div className="relative w-full max-w-[480px] z-10 my-auto animate-slide-up">
        {/* Floating Badge */}
        <div className="hidden lg:flex items-center gap-2 absolute -top-10 -left-12 bg-surface-container-lowest px-3 py-1.5 rounded-full shadow-md animate-pulse-soft">
          <span className="inline-block w-2 h-2 rounded-full bg-primary" />
          <span className="text-label-caps text-primary uppercase">
            Account Recovery
          </span>
        </div>

        {/* Card Container */}
        <div className="bg-surface-container-lowest rounded-2xl shadow-2xl p-6 sm:p-10 transition-all">
          {/* Brand Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-[0_4px_12px_rgba(79,70,229,0.3)]">
                <Icon name="layers" size={24} className="text-on-primary" />
              </div>
              <span className="text-headline-md tracking-tight text-on-surface">
                {BRAND.name}
                <span className="text-primary-container font-black">.ai</span>
              </span>
            </div>
          </div>

          {/* Form */}
          <ForgotPasswordForm />

          {/* Footer Bar */}
          <div className="mt-8 pt-5 bg-surface-container-low -mx-6 -mb-6 sm:-mx-10 sm:-mb-10 p-5 rounded-b-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <Link
              href="/login"
              className="text-label-lg text-on-surface hover:text-primary transition-colors flex items-center gap-1.5"
            >
              <Icon name="login" size={16} className="text-primary" />
              <span>Remembered it? Sign in</span>
              <Icon name="chevron_right" size={14} />
            </Link>
            <div className="flex items-center gap-1 text-on-surface-variant text-label-caps">
              <Icon name="verified_user" size={15} className="text-primary" />
              <span>TLS 1.3 / E2EE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
