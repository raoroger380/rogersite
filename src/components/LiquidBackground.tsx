"use client";

import { useEffect, useRef } from "react";

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

type BlobState = {
  node: HTMLDivElement;
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  speed: number;
  phase: number;
  scrollFactor: number;
};

export default function LiquidBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLDivElement>("[data-blob]"));
    if (!nodes.length) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    ).matches;
    const cursorLight = root.querySelector<HTMLDivElement>("[data-cursor-light]");

    const blobs: BlobState[] = nodes.map((node, index) => {
      const size = 260 + (index % 3) * 110 + ((index * 41) % 90);
      return {
        node,
        baseX: (index * 0.23 + 0.12) % 1,
        baseY: (index * 0.2 + 0.2) % 1,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size,
        speed: 0.35 + (index % 3) * 0.12,
        phase: index * 1.7,
        scrollFactor: [0.08, 0.14, 0.22, 0.3, 0.4][index % 5],
      };
    });

    blobs.forEach((state) => {
      state.node.style.width = `${state.size}px`;
      state.node.style.height = `${state.size}px`;
    });

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight * 0.42;
    let cursorX = mouseX;
    let cursorY = mouseY;
    let scrollTarget = 0;
    let scrollCurrent = 0;
    let scrollVelocity = 0;
    let raf = 0;
    let time = Math.random() * 100;

    const getPageDepth = () => {
      const hash = window.location.hash.replace(/^#/, "");
      const index = PAGE_ORDER.indexOf(hash);
      return index < 0 ? 0 : index / (PAGE_ORDER.length - 1);
    };

    const positionBlob = (
      state: BlobState,
      x: number,
      y: number,
      scale = 1,
    ) => {
      state.node.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    };

    const placeInitialBlobs = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      blobs.forEach((state) => {
        state.x = state.baseX * width;
        state.y = state.baseY * height;
        positionBlob(state, state.x - state.size / 2, state.y - state.size / 2);
      });
    };

    placeInitialBlobs();

    if (prefersReducedMotion) {
      if (cursorLight) cursorLight.remove();
      return;
    }

    const onHashChange = () => {
      scrollTarget = getPageDepth();
    };

    const onWheel = (event: WheelEvent) => {
      scrollVelocity += event.deltaY * 0.00022;
      scrollVelocity = Math.max(-0.18, Math.min(0.18, scrollVelocity));
    };

    const onPointerMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
    };

    const animate = () => {
      time += 0.008;
      const width = window.innerWidth;
      const height = window.innerHeight;

      scrollVelocity += (scrollTarget - scrollCurrent) * 0.014;
      scrollVelocity *= 0.91;
      scrollCurrent += scrollVelocity;

      cursorX += (mouseX - cursorX) * 0.07;
      cursorY += (mouseY - cursorY) * 0.07;
      if (finePointer && cursorLight) {
        cursorLight.style.opacity = "1";
        cursorLight.style.transform = `translate3d(${cursorX - 140}px, ${cursorY - 140}px, 0)`;
      }

      blobs.forEach((state) => {
        const targetX =
          state.baseX * width + Math.sin(time * state.speed + state.phase) * 22;
        const targetY =
          state.baseY * height +
          Math.cos(time * state.speed * 0.82 + state.phase * 1.4) * 26 +
          scrollCurrent * state.scrollFactor * 260;

        const dx = mouseX - state.x;
        const dy = mouseY - state.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let influenceX = 0;
        let influenceY = 0;
        let proximity = 0;

        if (finePointer && dist < 380 && dist > 0.01) {
          const strength = (1 - dist / 380) * 0.34;
          influenceX = (dx / dist) * strength * 48;
          influenceY = (dy / dist) * strength * 48;
          proximity = (1 - dist / 380) * 0.07;
        }

        state.vx += (targetX + influenceX - state.x) * 0.032;
        state.vy += (targetY + influenceY - state.y) * 0.032;
        state.vx *= 0.94;
        state.vy *= 0.94;
        state.x += state.vx;
        state.y += state.vy;

        positionBlob(
          state,
          state.x - state.size / 2,
          state.y - state.size / 2,
          1 + proximity,
        );
      });

      raf = requestAnimationFrame(animate);
    };

    scrollTarget = getPageDepth();
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("wheel", onWheel, { passive: true });
    if (finePointer) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
    }
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <div ref={rootRef} className="liquid-background" aria-hidden="true">
      <div className="liquid-atmosphere" />
      {Array.from({ length: 5 }, (_, index) => (
        <div
          key={index}
          data-blob
          className={`liquid-blob liquid-blob-${index + 1}`}
        />
      ))}
      <div className="liquid-ambient-light" />
      <div className="liquid-noise" />
      <div className="cursor-ambient-light" data-cursor-light />
    </div>
  );
}
