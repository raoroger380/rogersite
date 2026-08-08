"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAGE_ORDER = [
  "hero",
  "about",
  "projects",
  "footprints",
  "footprints-album",
  "hobbies",
  "signature",
  "contact",
];

export default function PageNavigator({ pages }: { pages: Record<string, ReactNode> }) {
  const [page, setPage] = useState("hero");
  const [direction, setDirection] = useState(1);
  const previousIndex = useRef(0);
  const hasMounted = useRef(false);
  const transitionLock = useRef(false);
  const wheelDelta = useRef(0);
  const wheelDirection = useRef(0);
  const wheelResetTimer = useRef<number | undefined>(undefined);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }
    window.scrollTo(0, 0);
  }, [page]);

  useEffect(() => {
    const resolvePage = () => {
      const raw = window.location.hash.replace(/^#/, "");
      const next = PAGE_ORDER.includes(raw) ? raw : "hero";
      const nextIndex = PAGE_ORDER.indexOf(next);
      setDirection(nextIndex >= previousIndex.current ? 1 : -1);
      previousIndex.current = nextIndex;
      setPage(next);
    };

    resolvePage();
    window.addEventListener("hashchange", resolvePage);
    return () => window.removeEventListener("hashchange", resolvePage);
  }, []);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (transitionLock.current) {
        wheelDelta.current = 0;
        return;
      }

      const direction = event.deltaY > 0 ? 1 : event.deltaY < 0 ? -1 : 0;
      if (direction === 0) return;

      event.preventDefault();

      if (wheelDirection.current !== 0 && wheelDirection.current !== direction) {
        wheelDelta.current = 0;
      }
      wheelDirection.current = direction;
      wheelDelta.current += Math.abs(event.deltaY);

      const nextIndex = previousIndex.current + direction;
      if (nextIndex < 0 || nextIndex >= PAGE_ORDER.length) {
        wheelDelta.current = 0;
        return;
      }

      if (wheelDelta.current >= 420) {
        wheelDelta.current = 0;
        wheelDirection.current = 0;
        window.clearTimeout(wheelResetTimer.current);
        transitionLock.current = true;
        window.location.hash = `#${PAGE_ORDER[nextIndex]}`;
        window.setTimeout(() => {
          transitionLock.current = false;
        }, 700);
      } else {
        window.clearTimeout(wheelResetTimer.current);
        wheelResetTimer.current = window.setTimeout(() => {
          wheelDelta.current = 0;
          wheelDirection.current = 0;
        }, 800);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    const handleTouchStart = (event: TouchEvent) => {
      if (transitionLock.current || event.touches.length !== 1) return;
      const touch = event.touches[0];
      touchStart.current = { x: touch.clientX, y: touch.clientY };
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (transitionLock.current || !touchStart.current || event.touches.length !== 1) return;

      const touch = event.touches[0];
      const deltaY = touch.clientY - touchStart.current.y;
      const deltaX = touch.clientX - touchStart.current.x;
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 10) {
        event.preventDefault();
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!touchStart.current) return;
      const { x, y } = touchStart.current;
      touchStart.current = null;
      if (transitionLock.current) return;

      const touchEnd = event.changedTouches[0];
      if (!touchEnd) return;
      const deltaY = touchEnd.clientY - y;
      const deltaX = touchEnd.clientX - x;
      if (Math.abs(deltaY) < 70 || Math.abs(deltaX) > Math.abs(deltaY) * 1.5) return;

      const direction = deltaY > 0 ? -1 : 1;
      const nextIndex = previousIndex.current + direction;
      if (nextIndex < 0 || nextIndex >= PAGE_ORDER.length) return;

      transitionLock.current = true;
      window.location.hash = `#${PAGE_ORDER[nextIndex]}`;
      window.setTimeout(() => {
        transitionLock.current = false;
      }, 700);
    };

    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });
    window.addEventListener("touchcancel", handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.clearTimeout(wheelResetTimer.current);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, []);

  return (
    <main className="page-viewport">
      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={page}
          className="page-screen"
          initial={{ opacity: 0, y: 80 * direction }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -80 * direction }}
          transition={{ duration: 0.48, ease: [0.22, 0.61, 0.36, 1] }}
        >
          {pages[page]}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
