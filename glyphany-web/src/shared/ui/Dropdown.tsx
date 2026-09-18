"use client";

import React, { useRef, useState, ReactNode } from "react";
import { useClickOutside } from "../hooks/useClickOutside";
import { cn } from "../lib/cn";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
}

export function Dropdown({ trigger, children, align = "right", className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useClickOutside(dropdownRef, () => {
    if (isOpen) setIsOpen(false);
  });

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={toggleDropdown} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-2 w-56 rounded-xl bg-surface-container-lowest shadow-lg border border-outline-variant/30 py-2 animate-fade-in focus:outline-none",
            align === "right" ? "right-0 origin-top-right" : "left-0 origin-top-left",
            className
          )}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
        >
          {/* Children öğelerinin tıklanıldığında dropdown'ı kapatması isteniyorsa onClick üzerinden setIsOpen(false) yapılabilir.
              Bu örnekte esneklik bırakıyoruz. */}
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DropdownItem({ children, icon, className, ...props }: DropdownItemProps) {
  return (
    <a
      className={cn(
        "flex items-center gap-3 px-4 py-2 text-label-md text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer",
        className
      )}
      role="menuitem"
      {...props}
    >
      {icon && <span className="text-on-surface-variant flex-shrink-0">{icon}</span>}
      <span className="flex-1 truncate">{children}</span>
    </a>
  );
}

export function DropdownDivider() {
  return <div className="my-1 border-t border-outline-variant/30" />;
}
