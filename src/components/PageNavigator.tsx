"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import A350FlightTransition from "@/components/A350FlightTransition";

const PAGE_ORDER = [
  "hero",
  "about",
  "age",
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
  const firstResolve = useRef(true);
  const pendingPageRef = useRef<string | null>(null);
  const flightTimerRef = useRef<number | undefined>(undefined);
  const [contentVisible, setContentVisible] = useState(true);
  const [flightKey, setFlightKey] = useState(0);

  const navigateTo = (nextIndex: number, triggerFlight: boolean) => {
    if (nextIndex < 0 || nextIndex >= PAGE_ORDER.length) return;

    transitionLock.current = true;
    window.location.hash = `#${PAGE_ORDER[nextIndex]}`;
    window.setTimeout(() => {
      transitionLock.current = false;
    }, triggerFlight ? 2600 : 700);
  };

  const handleFlightComplete = () => {
    const target = pendingPageRef.current;
    if (!target) return;
    pendingPageRef.current = null;

    const nextIndex = PAGE_ORDER.indexOf(target);
    setDirection(nextIndex >= previousIndex.current ? 1 : -1);
    previousIndex.current = nextIndex;
    setPage(target);
    window.setTimeout(() => setContentVisible(true), 120);
  };

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

      if (firstResolve.current) {
        firstResolve.current = false;
        previousIndex.current = nextIndex;
        setPage(next);
        return;
      }

      if (pendingPageRef.current) {
        pendingPageRef.current = null;
        setContentVisible(true);
        window.clearTimeout(flightTimerRef.current);
      }

      if (previousIndex.current === 0 && nextIndex === 1) {
        setContentVisible(false);
        pendingPageRef.current = next;
        window.clearTimeout(flightTimerRef.current);
        flightTimerRef.current = window.setTimeout(() => {
          setFlightKey((key) => key + 1);
        }, 320);
        return;
      }

      setDirection(nextIndex >= previousIndex.current ? 1 : -1);
      previousIndex.current = nextIndex;
      setPage(next);
    };

    resolvePage();
    window.addEventListener("hashchange", resolvePage);
    return () => {
      window.removeEventListener("hashchange", resolvePage);
      window.clearTimeout(flightTimerRef.current);
    };
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
        navigateTo(
          nextIndex,
          previousIndex.current === 0 && nextIndex === 1 && direction === 1,
        );
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

      navigateTo(
        nextIndex,
        previousIndex.current === 0 && nextIndex === 1 && direction === 1,
      );
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
      <A350FlightTransition flightKey={flightKey} onComplete={handleFlightComplete} />
      <AnimatePresence mode="wait" initial={false}>
        <motion.section
          key={page}
          className="page-screen"
          initial={contentVisible ? { opacity: 0, y: 80 * direction } : { opacity: 1, y: 0 }}
          animate={{
            opacity: contentVisible ? 1 : 0,
            y: contentVisible ? 0 : -36,
          }}
          exit={
            contentVisible
              ? { opacity: 0, y: -80 * direction }
              : { opacity: 0, y: 0, transition: { duration: 0.1 } }
          }
          transition={{
            duration: contentVisible ? 0.5 : 0.42,
            ease: [0.22, 0.61, 0.36, 1],
          }}
        >
          {pages[page]}
        </motion.section>
      </AnimatePresence>
    </main>
  );
}
