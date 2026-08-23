"use client";

import { useEffect } from "react";

const GLASS_SELECTOR = [
  ".glass-card",
  ".nav-glass-island",
  ".liquid-glass-btn",
  ".glow-btn",
  ".project-card",
  ".hobby-card",
  ".social-link",
  ".contact-shell",
  ".recent-chip",
  ".interest-tag",
].join(",");

export default function GlassPointer() {
  useEffect(() => {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onPointerMove = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const glass = target.closest<HTMLElement>(GLASS_SELECTOR);
      if (!glass) return;

      const rect = glass.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      glass.style.setProperty("--pointer-x", `${x}%`);
      glass.style.setProperty("--pointer-y", `${y}%`);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, []);

  return null;
}
