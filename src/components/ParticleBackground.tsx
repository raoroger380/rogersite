"use client";

import { useRef, useEffect } from "react";

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let mouse = { x: -1000, y: -1000 };
    let particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = Array.from({ length: Math.min(100, Math.floor((canvas.width * canvas.height) / 15000)) }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2.5 + 1,
        opacity: Math.random() * 0.35 + 0.25,
      }));
    };

    resize();

    const onMouseMove = (e: MouseEvent) => { mouse = { x: e.clientX, y: e.clientY }; };
    const onTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) mouse = { x: t.clientX, y: t.clientY };
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove);

    const getThemeColor = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouse;
      const particleColor = getThemeColor("--particle-rgb", "79, 100, 117");
      const linkColor = getThemeColor("--particle-link-rgb", "111, 132, 148");

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180 && dist > 0) {
          const force = (180 - dist) / 180;
          p.vx += (dx / dist) * force * 0.15;
          p.vy += (dy / dist) * force * 0.15;
        }

        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        p.vx *= 0.99;
        p.vy *= 0.99;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${particleColor}, ${p.opacity})`;
        ctx.fill();
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${particleColor}, ${(1 - dist / 150) * 0.25})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        const dx = particles[i].x - mx;
        const dy = particles[i].y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(mx, my);
          ctx.strokeStyle = `rgba(${linkColor}, ${(1 - dist / 150) * 0.35})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}
