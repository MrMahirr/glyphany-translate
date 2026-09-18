"use client";

import { useState, useEffect } from "react";

/**
 * Sayfa kaydırıldıkça ekranda görünür olan (Intersection Observer) hedef section'ı algılar.
 * @param sectionIds Gözlemlenecek section ID listesi (örn: ["features", "pricing"])
 * @param threshold Gözlemlenecek alanın ekrandaki görünürlük yüzdesi eşiği
 * @returns Aktif olan section'ın id'si
 */
export function useActiveSection(sectionIds: string[], threshold = 0.5) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Eğer hash URL ile geldiysek, sayfa açılışında onu aktif say
    const hash = window.location.hash.replace("#", "");
    if (hash && sectionIds.includes(hash)) {
      setActiveId(hash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -20% 0px", // Üstten ve alttan pay
        threshold,
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (element) {
          observer.unobserve(element);
        }
      });
    };
  }, [sectionIds, threshold]);

  return activeId;
}
