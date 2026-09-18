import React from "react";
import Link from "next/link";
import { BRAND } from "@/shared/config/brand";
import { Icon } from "@/shared/ui/Icon";

/**
 * Public sayfalar (Landing) için footer bileşeni.
 * Copyright bilgisi ve yasal linkleri barındırır.
 */
export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low border-t border-outline-variant/30 py-space-xl">
      <div className="max-w-7xl mx-auto px-margin flex flex-col md:flex-row items-center justify-between gap-space-lg">
        
        {/* Brand */}
        <div className="flex items-center gap-space-sm">
          <div className="w-6 h-6 rounded bg-primary-container flex items-center justify-center">
            <Icon name="layers" size={14} className="text-on-primary" />
          </div>
          <span className="text-headline-sm text-on-surface font-bold">
            {BRAND.name}.ai
          </span>
        </div>

        {/* Copyright */}
        <p className="text-body-sm text-on-surface-variant text-center">
          {BRAND.copyright}
        </p>

        {/* Legal Links */}
        <div className="flex items-center gap-space-md text-body-sm text-on-surface-variant">
          <Link href="/privacy" className="hover:text-on-surface transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-on-surface transition-colors">
            Terms of Service
          </Link>
        </div>

      </div>
    </footer>
  );
}
