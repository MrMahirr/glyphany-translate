/**
 * Brand configuration — merkezi uygulama kimliği.
 * Tüm componentler bu config üzerinden brand bilgilerini okur.
 */
export const BRAND = {
  name: "Glyphany",
  tagline: "Precision neural document & publication translation with sub-pixel layout preservation.",
  domain: "glyphany.ai",
  copyright: `© ${new Date().getFullYear()} Glyphany. Precision Neural Layout Document Translation. All rights reserved.`,
} as const;
