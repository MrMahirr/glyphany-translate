"use client";

import React from "react";
import Link from "next/link";
import { Icon } from "@/shared/ui/Icon";

export function SettingsSidebar() {
  return (
    <aside className="lg:col-span-4 flex flex-col gap-space-md w-full">
      
      {/* Navigation Menu Card */}
      <nav aria-label="Account Settings Navigation" className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden p-space-sm flex flex-col gap-1">
        
        {/* Item 1: Profile */}
        <button type="button" className="w-full flex items-center gap-space-sm p-space-sm rounded-lg text-left text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all group cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors flex-shrink-0">
            <Icon name="person" size={20} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-headline-sm text-headline-sm text-on-surface">Profile</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Personal info &amp; security</span>
          </div>
        </button>

        {/* Item 2: Preferences (Active) */}
        <button type="button" className="w-full flex items-center gap-space-sm p-space-sm rounded-lg text-left bg-surface-container-low text-primary transition-all shadow-sm cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center flex-shrink-0">
            <Icon name="tune" size={20} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Preferences</span>
              <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-caps text-label-caps">Active</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Translation &amp; rendering specs</span>
          </div>
        </button>

        {/* Item 3: Usage & Billing */}
        <button type="button" className="w-full flex items-center gap-space-sm p-space-sm rounded-lg text-left text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all group cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors flex-shrink-0">
            <Icon name="credit_card" size={20} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-headline-sm text-headline-sm text-on-surface">Usage &amp; Billing</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Plans, tiers &amp; invoices</span>
          </div>
        </button>

        {/* Item 4: API Keys */}
        <button type="button" className="w-full flex items-center gap-space-sm p-space-sm rounded-lg text-left text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-all group cursor-pointer">
          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors flex-shrink-0">
            <Icon name="key" size={20} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="font-headline-sm text-headline-sm text-on-surface">API Keys</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Developer access &amp; tokens</span>
          </div>
        </button>
      </nav>

      {/* Subscription & Tier Indicator */}
      <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm relative overflow-hidden flex flex-col gap-space-sm">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-primary-fixed opacity-40 blur-2xl pointer-events-none"></div>
        <div className="flex items-center justify-between">
          <span className="font-label-caps text-label-caps uppercase text-primary tracking-wider">Active Tier</span>
          <span className="px-2 py-0.5 rounded-full bg-primary-container text-on-primary font-label-caps text-label-caps">PRO</span>
        </div>
        <div>
          <h4 className="font-headline-sm text-headline-sm text-on-surface">Pro Researcher Plan</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Renews automatically on Nov 28, 2024</p>
        </div>

        {/* Mini perks breakdown */}
        <div className="bg-surface-container-low rounded-lg p-space-sm flex flex-col gap-1.5 my-1">
          <div className="flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant flex items-center gap-1">
              <Icon name="check_circle" size={14} className="text-primary" />
              Vector LaTeX Engine
            </span>
            <span className="text-on-surface font-semibold">Enabled</span>
          </div>
          <div className="flex items-center justify-between font-label-md text-label-md">
            <span className="text-on-surface-variant flex items-center gap-1">
              <Icon name="check_circle" size={14} className="text-primary" />
              CAD Callout OCR
            </span>
            <span className="text-on-surface font-semibold">Unlimited</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link href="/enterprise" className="inline-flex items-center justify-between text-primary font-label-lg text-label-lg hover:underline">
            <span>Need custom LLM endpoints?</span>
            <Icon name="arrow_forward" size={16} />
          </Link>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Contact enterprise engineering for private VPC deployments and SOC2 compliance.</p>
        </div>
      </div>

      {/* Research Team Context Card */}
      <div className="bg-surface-container-low rounded-xl p-space-md shadow-sm flex items-center gap-space-sm">
        <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-semibold font-label-lg text-label-lg flex-shrink-0">
          QL
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="font-label-lg text-label-lg text-on-surface truncate">Quantum Labs International</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant truncate">Organization ID: org_9024f_v3</span>
        </div>
        <button type="button" title="Switch organization" className="p-1.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg cursor-pointer">
          <Icon name="swap_horiz" size={18} />
        </button>
      </div>

    </aside>
  );
}
