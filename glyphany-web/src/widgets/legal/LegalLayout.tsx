"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/shared/config/brand";
import { Icon } from "@/shared/ui/Icon";
import { cn } from "@/shared/lib/cn";

interface LegalLayoutProps {
  children: React.ReactNode;
  title: string;
  lastUpdated: string;
}

const navItems = [
  { label: "Privacy Policy", href: "/privacy", icon: "shield" },
  { label: "Terms of Service", href: "/terms", icon: "gavel" },
  { label: "Cookie Policy", href: "#", icon: "cookie" },
];

export function LegalLayout({ children, title, lastUpdated }: LegalLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="w-full max-w-[1280px] mx-auto px-gutter py-space-lg md:py-space-xl min-h-[80vh]">
      
      {/* ── Header Area ── */}
      <div className="mb-space-xl border-b border-outline-variant/30 pb-space-md">
        <h1 className="font-display-mobile md:font-display text-on-surface tracking-tight mb-2">
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-body-md text-on-surface-variant">
          <span>{BRAND.name}</span>
          <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
          <span>Last updated: <span className="font-semibold text-on-surface">{lastUpdated}</span></span>
        </div>
      </div>

      {/* ── Content & Sidebar Grid ── */}
      <div className="flex flex-col lg:flex-row gap-space-xl items-start">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0 lg:sticky lg:top-24">
          <nav className="flex flex-col gap-1 bg-surface-container-lowest rounded-xl p-3 shadow-sm">
            <span className="font-label-caps text-label-caps text-on-surface-variant px-3 py-2 uppercase tracking-wider">
              Legal Documents
            </span>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg font-label-lg text-label-lg transition-colors group cursor-pointer",
                    isActive 
                      ? "bg-primary-container text-on-primary shadow-sm" 
                      : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  )}
                >
                  <Icon 
                    name={item.icon} 
                    size={18} 
                    className={cn(
                      "transition-colors", 
                      isActive ? "text-primary" : "text-outline group-hover:text-primary"
                    )} 
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-6 p-4 rounded-xl bg-surface-container-low text-body-sm text-on-surface-variant">
            Have questions about our policies? Contact our legal team at{" "}
            <a href="mailto:legal@glyphany.com" className="text-primary font-semibold hover:underline">
              legal@{BRAND.name.toLowerCase()}.com
            </a>
          </div>
        </aside>

        {/* Prose Content Area */}
        <main className="flex-1 min-w-0 bg-surface-container-lowest rounded-2xl p-6 sm:p-10 shadow-sm">
          <article className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-on-surface prose-p:text-on-surface-variant prose-a:text-primary hover:prose-a:text-primary-container prose-a:no-underline hover:prose-a:underline prose-li:text-on-surface-variant">
            {children}
          </article>
        </main>
      </div>
    </div>
  );
}
