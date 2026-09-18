import React from "react";
import Link from "next/link";
import { BRAND } from "@/shared/config/brand";
import { Icon } from "@/shared/ui/Icon";

/**
 * Public sayfalar (Landing) için üst navigasyon çubuğu.
 * Logo, navigation linkleri ve Auth call-to-action butonlarını içerir.
 */
export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-16 max-w-7xl mx-auto px-margin flex items-center justify-between gap-space-lg">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-space-sm cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
             <Icon name="layers" size={20} className="text-on-primary" />
          </div>
          <span className="text-headline-sm text-on-surface font-bold tracking-tight">
            {BRAND.name}
            <span className="text-primary-container">.ai</span>
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-space-lg">
          <Link href="#features" className="transition-colors text-primary font-bold">
            Features
          </Link>
          <Link href="#formats" className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">
            Supported Formats
          </Link>
          <Link href="#enterprise" className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">
            Enterprise
          </Link>
          <Link href="#pricing" className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-space-md">
          <Link
            href="/login"
            className="hidden sm:inline-flex text-label-lg text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs"
          >
            Log in
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center text-label-lg text-on-surface bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:text-on-surface px-space-md py-space-xs rounded-lg transition-all shadow-sm"
          >
            Sign up free
          </Link>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 ml-space-xs">
            <Icon name="person" size={18} className="text-on-primary" />
          </div>
        </div>

      </div>
    </header>
  );
}
