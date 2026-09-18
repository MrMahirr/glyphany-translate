"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BRAND } from "@/shared/config/brand";
import { Icon } from "@/shared/ui/Icon";
import { useActiveSection } from "@/shared/hooks/useActiveSection";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Dropdown, DropdownItem, DropdownDivider } from "@/shared/ui/Dropdown";
import { cn } from "@/shared/lib/cn";

const NAV_LINKS = [
  { label: "Features", href: "/#features", id: "features" },
  { label: "Formatting Guide", href: "/docs/formatting", id: "formatting" },
  { label: "Enterprise", href: "/enterprise", id: "enterprise" },
  { label: "System Status", href: "/status", id: "status" },
];

export function LandingHeader() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  // Hash scroll spy
  const activeSectionId = useActiveSection(["features"], 0.4);
  
  // Auth state
  const { isAuthenticated, user, logout } = useAuth();
  
  // Mobile Menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sayfa kaydırıldığında header'a gölge efekti eklemek için
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getLinkClasses = (link: { href: string; id: string }) => {
    let isActive = false;
    if (isHomePage) {
      isActive = activeSectionId === link.id;
    } else {
      isActive = pathname === link.href;
    }

    return cn(
      "text-label-lg transition-colors",
      isActive
        ? "text-primary font-bold"
        : "text-on-surface-variant hover:text-on-surface"
    );
  };

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300",
        isScrolled || isMobileMenuOpen 
          ? "bg-surface-container-lowest/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30" 
          : "bg-surface-container-lowest/80 backdrop-blur-md border-b border-transparent"
      )}
    >
      <div className="h-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-space-lg">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-space-sm cursor-pointer z-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center shadow-sm">
             <Icon name="layers" size={20} className="text-on-primary" />
          </div>
          <span className="text-headline-sm text-on-surface font-bold tracking-tight">
            {BRAND.name}
            <span className="text-primary-container">.ai</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-space-lg">
          {NAV_LINKS.map((link) => (
            <Link key={link.id} href={link.href} className={getLinkClasses(link)}>
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth Actions & User Profile */}
        <div className="hidden md:flex items-center gap-space-md">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="text-label-lg text-on-surface-variant hover:text-on-surface transition-colors px-space-sm py-space-xs"
              >
                Log in
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center justify-center text-label-lg text-on-surface bg-surface-container-lowest border border-outline-variant hover:bg-surface-container-low hover:text-on-surface px-space-md py-space-xs rounded-lg transition-all shadow-sm"
              >
                Sign up free
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/translations"
                className="text-label-lg text-primary hover:text-primary-container transition-colors font-semibold"
              >
                Dashboard
              </Link>
              
              <Dropdown
                align="right"
                trigger={
                  <div className="w-9 h-9 rounded-full bg-primary-container border-2 border-primary/20 flex items-center justify-center flex-shrink-0 cursor-pointer hover:border-primary/50 transition-colors">
                    <span className="text-on-primary font-label-md font-bold uppercase">
                      {user?.fullName?.[0] || user?.email?.[0] || "U"}
                    </span>
                  </div>
                }
              >
                <div className="px-4 py-2 border-b border-outline-variant/30 mb-1">
                  <p className="font-label-md text-on-surface font-bold truncate">{user?.fullName || "User"}</p>
                  <p className="font-body-sm text-on-surface-variant truncate">{user?.email}</p>
                </div>
                
                <DropdownItem href="/translations" icon={<Icon name="dashboard" size={18} />}>
                  Dashboard
                </DropdownItem>
                <DropdownItem href="/settings" icon={<Icon name="tune" size={18} />}>
                  Account Settings
                </DropdownItem>
                <DropdownItem href="/settings/history" icon={<Icon name="history" size={18} />}>
                  Usage History
                </DropdownItem>
                
                <DropdownDivider />
                
                <DropdownItem onClick={() => logout()} icon={<Icon name="logout" size={18} />} className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                  Log out
                </DropdownItem>
              </Dropdown>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle Button */}
        <div className="flex items-center md:hidden z-50">
          {isAuthenticated && (
            <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-primary/20 flex items-center justify-center flex-shrink-0 mr-3">
              <span className="text-on-primary font-label-sm font-bold uppercase">
                {user?.fullName?.[0] || user?.email?.[0] || "U"}
              </span>
            </div>
          )}
          <button 
            type="button" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1.5 text-on-surface-variant hover:text-on-surface rounded-lg bg-surface-container-lowest border border-outline-variant/30 shadow-sm transition-colors"
          >
            <Icon name={isMobileMenuOpen ? "close" : "menu"} size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      <div 
        className={cn(
          "md:hidden fixed top-16 left-0 right-0 bg-surface-container-lowest border-b border-outline-variant/30 shadow-lg overflow-hidden transition-all duration-300 origin-top",
          isMobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="px-4 pt-2 pb-6 flex flex-col gap-1 max-h-[80vh] overflow-y-auto">
          
          {/* Links */}
          <div className="py-2 flex flex-col gap-1">
            <span className="px-4 py-2 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Navigation</span>
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.id} 
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-xl",
                  isHomePage && activeSectionId === link.id 
                    ? "bg-primary-container text-on-primary font-semibold"
                    : "text-on-surface hover:bg-surface-container-low"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="my-2 border-t border-outline-variant/30"></div>

          {/* Auth Actions */}
          <div className="py-2 flex flex-col gap-1">
            {!isAuthenticated ? (
              <>
                <span className="px-4 py-2 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">Account</span>
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-on-surface hover:bg-surface-container-low rounded-xl"
                >
                  Log in
                </Link>
                <Link 
                  href="/login" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 text-primary font-semibold bg-surface-container-low hover:bg-surface-container rounded-xl mt-1"
                >
                  Sign up free
                </Link>
              </>
            ) : (
              <>
                <span className="px-4 py-2 text-label-caps font-label-caps text-on-surface-variant uppercase tracking-wider">My Account</span>
                <Link 
                  href="/translations" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container-low rounded-xl"
                >
                  <Icon name="dashboard" size={20} className="text-on-surface-variant" />
                  <span>Dashboard</span>
                </Link>
                <Link 
                  href="/settings" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-on-surface hover:bg-surface-container-low rounded-xl"
                >
                  <Icon name="tune" size={20} className="text-on-surface-variant" />
                  <span>Settings</span>
                </Link>
                <button 
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    logout();
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl"
                >
                  <Icon name="logout" size={20} />
                  <span>Log out</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
