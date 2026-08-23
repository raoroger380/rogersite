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

type ParticleState = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  phase: number;
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
    const finePointer =
      window.innerWidth >= 768 &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const cursorLight = root.querySelector<HTMLDivElement>("[data-cursor-light]");
    const particleCanvas = root.querySelector<HTMLCanvasElement>("[data-particle-canvas]");
    const particleContext = particleCanvas?.getContext("2d");

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
    let pointerActive = false;
    let pointerSpeed = 0;
    let previousPointerX = mouseX;
    let previousPointerY = mouseY;
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;
    let canvasDpr = 1;
    let particleColor = "155, 182, 196";

    const particles: ParticleState[] = [];

    const refreshParticleTheme = () => {
      const accentRgb = getComputedStyle(document.documentElement)
        .getPropertyValue("--accent-rgb")
        .trim();
      if (accentRgb) particleColor = accentRgb;
    };

    const resizeParticleCanvas = () => {
      if (!particleCanvas || !particleContext) return;
      canvasWidth = window.innerWidth;
      canvasHeight = window.innerHeight;
      canvasDpr = Math.min(window.devicePixelRatio || 1, 1.5);
      particleCanvas.width = Math.floor(canvasWidth * canvasDpr);
      particleCanvas.height = Math.floor(canvasHeight * canvasDpr);
      particleCanvas.style.width = `${canvasWidth}px`;
      particleCanvas.style.height = `${canvasHeight}px`;
      particleContext.setTransform(canvasDpr, 0, 0, canvasDpr, 0, 0);
    };

    const createParticles = () => {
      const compactViewport = !finePointer || canvasWidth < 768;
      const count = compactViewport
        ? 24
        : Math.min(
            54,
            Math.max(42, Math.round((canvasWidth * canvasHeight) / 19000)),
          );
      particles.length = 0;
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * canvasWidth,
          y: Math.random() * canvasHeight,
          vx: (Math.random() - 0.5) * 0.12,
          vy: (Math.random() - 0.5) * 0.12,
          size: compactViewport
            ? 1.5 + Math.random() * 2.2
            : 1.15 + Math.random() * 2.1,
          alpha: compactViewport
            ? 0.34 + Math.random() * 0.24
            : 0.22 + Math.random() * 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const drawParticles = () => {
      if (!particleContext) return;
      particleContext.clearRect(0, 0, canvasWidth, canvasHeight);

      particles.forEach((particle) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const proximity = pointerActive && distance < 320
          ? 1 - distance / 320
          : 0;
        const pulse = 0.82 + Math.sin(time * 0.8 + particle.phase) * 0.18;
        const alpha = particle.alpha * pulse + proximity * 0.14;

        if (pointerActive && pointerSpeed > 0.4 && proximity > 0.02) {
          particleContext.beginPath();
          particleContext.moveTo(
            particle.x - particle.vx * 22,
            particle.y - particle.vy * 22,
          );
          particleContext.lineTo(particle.x, particle.y);
          const trailStrength = Math.min(1, pointerSpeed / 24);
          particleContext.strokeStyle = `rgba(${particleColor}, ${Math.min(0.16, alpha * 0.8 * trailStrength)})`;
          particleContext.lineWidth = Math.max(0.5, particle.size * 0.55);
          particleContext.stroke();
        }

        particleContext.beginPath();
        particleContext.arc(
          particle.x,
          particle.y,
          particle.size * 2.6 + proximity * 1.2,
          0,
          Math.PI * 2,
        );
        particleContext.fillStyle = `rgba(${particleColor}, ${Math.min(0.12, alpha * 0.22)})`;
        particleContext.fill();

        particleContext.beginPath();
        particleContext.arc(
          particle.x,
          particle.y,
          particle.size + proximity * 0.7,
          0,
          Math.PI * 2,
        );
        particleContext.fillStyle = `rgba(${particleColor}, ${Math.min(0.48, alpha)})`;
        particleContext.fill();
      });
    };

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

    if (!particleCanvas || !particleContext) return;

    particleCanvas.style.display = "block";
    resizeParticleCanvas();
    createParticles();
    refreshParticleTheme();

    const themeObserver = new MutationObserver(() => {
      refreshParticleTheme();
      if (!finePointer) drawParticles();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // 触摸设备只绘制一帧低密度装饰粒子，不启动 RAF、指针物理或光晕跟随。
    // 这样移动端能保留一点空间层次，同时避免主题切换和 backdrop-filter 叠加闪烁。
    if (!finePointer) {
      if (cursorLight) cursorLight.remove();
      drawParticles();
      window.addEventListener("resize", resizeParticleCanvas, { passive: true });

      return () => {
        themeObserver.disconnect();
        window.removeEventListener("resize", resizeParticleCanvas);
      };
    }

    const onHashChange = () => {
      scrollTarget = getPageDepth();
    };

    const onPointerMove = (event: PointerEvent) => {
      const deltaX = event.clientX - previousPointerX;
      const deltaY = event.clientY - previousPointerY;
      mouseX = event.clientX;
      mouseY = event.clientY;
      previousPointerX = mouseX;
      previousPointerY = mouseY;
      pointerSpeed = Math.min(70, Math.sqrt(deltaX * deltaX + deltaY * deltaY));
      pointerActive = true;

      // 位置更新时立即给附近粒子一个小冲量，不等待多帧累积排斥力。
      const impulseRadius = 360;
      const impulseStrength = prefersReducedMotion ? 0.72 : 1.08;
      particles.forEach((particle) => {
        const awayX = particle.x - mouseX;
        const awayY = particle.y - mouseY;
        const distance = Math.sqrt(awayX * awayX + awayY * awayY);
        if (distance < impulseRadius && distance > 0.01) {
          const proximity = 1 - distance / impulseRadius;
          const impulse = proximity * proximity * impulseStrength;
          particle.vx += (awayX / distance) * impulse;
          particle.vy += (awayY / distance) * impulse;
        }
      });
    };

    const onPointerLeave = () => {
      pointerActive = false;
    };

    const animate = () => {
      time += 0.008;
      const width = window.innerWidth;
      const height = window.innerHeight;
      pointerSpeed *= 0.9;

      scrollVelocity += (scrollTarget - scrollCurrent) * 0.014;
      scrollVelocity *= 0.91;
      scrollCurrent += scrollVelocity;

      cursorX += (mouseX - cursorX) * 0.07;
      cursorY += (mouseY - cursorY) * 0.07;
      if (finePointer && cursorLight) {
        cursorLight.style.opacity = pointerActive ? "1" : "0";
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

        if (finePointer && pointerActive && dist < 420 && dist > 0.01) {
          const normalizedDistance = 1 - dist / 420;
          const strength = normalizedDistance * normalizedDistance * 0.24;
          influenceX = (dx / dist) * strength * 58;
          influenceY = (dy / dist) * strength * 58;
          proximity = normalizedDistance * 0.08;
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

      particles.forEach((particle) => {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (pointerActive && distance < 360 && distance > 0.01) {
          const proximity = 1 - distance / 360;
          const repulsion = proximity * proximity * (prefersReducedMotion ? 0.034 : 0.058);
          particle.vx -= (dx / distance) * repulsion;
          particle.vy -= (dy / distance) * repulsion;
        }

        particle.vx += Math.sin(time * 0.42 + particle.phase) * 0.0018;
        particle.vy += Math.cos(time * 0.36 + particle.phase * 1.3) * 0.0018;
        particle.vx *= 0.988;
        particle.vy *= 0.988;
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < -24) particle.x = canvasWidth + 24;
        if (particle.x > canvasWidth + 24) particle.x = -24;
        if (particle.y < -24) particle.y = canvasHeight + 24;
        if (particle.y > canvasHeight + 24) particle.y = -24;
      });

      drawParticles();

      raf = requestAnimationFrame(animate);
    };

    scrollTarget = getPageDepth();
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerleave", onPointerLeave, { passive: true });
    window.addEventListener("resize", resizeParticleCanvas, { passive: true });
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      themeObserver.disconnect();
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("resize", resizeParticleCanvas);
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
      <canvas
        className="liquid-particle-canvas"
        data-particle-canvas
        aria-hidden="true"
      />
      <div className="liquid-ambient-light" />
      <div className="liquid-noise" />
      <div className="cursor-ambient-light" data-cursor-light />
    </div>
  );
}
