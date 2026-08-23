"use client";

import { useState, useEffect, useRef, type CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "首页", href: "#hero", ids: ["#hero"] },
  { label: "关于", href: "#about", ids: ["#about"] },
  { label: "项目", href: "#projects", ids: ["#projects"] },
  { label: "足迹", href: "#footprints", ids: ["#footprints", "#footprints-album"] },
  { label: "爱好", href: "#hobbies", ids: ["#hobbies"] },
  { label: "签名", href: "#signature", ids: ["#signature"] },
  { label: "联系", href: "#contact", ids: ["#contact"] },
];

type Theme = "light" | "dark";
type ThemeTransition = {
  x: number;
  y: number;
  next: Theme;
};

export default function Navbar() {
  const [active, setActive] = useState("#hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);
  const [navHidden, setNavHidden] = useState(false);
  const [themeTransition, setThemeTransition] = useState<ThemeTransition | null>(null);
  const touchStartY = useRef<number | null>(null);
  const themeTransitionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const updateActive = () => {
      const hash = window.location.hash || "#hero";
      const matched = NAV_ITEMS.find((item) => item.ids.includes(hash));
      if (matched) {
        setActive(matched.href);
        if (matched.href === "#hero") setNavHidden(false);
      }
    };
    updateActive();
    window.addEventListener("hashchange", updateActive);
    return () => window.removeEventListener("hashchange", updateActive);
  }, []);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (window.matchMedia("(hover: none), (pointer: coarse)").matches) {
        return;
      }
      if (Math.abs(event.deltaY) < 4) return;
      setNavHidden(event.deltaY > 0);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        touchStartY.current = event.touches[0].clientY;
      }
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (touchStartY.current === null) return;
      const touchEnd = event.changedTouches[0];
      const deltaY = touchEnd ? touchEnd.clientY - touchStartY.current : 0;
      touchStartY.current = null;
      if (Math.abs(deltaY) < 24) return;
      // 手指向上滑 = 页面向下切换，收起导航；反向则显示。
      setNavHidden(deltaY < 0);
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as Theme | null;
    setTheme(storedTheme ?? "dark");
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const layer = themeTransitionRef.current;
    if (!layer || !themeTransition) return;

    layer.replaceChildren();
    const background = document.querySelector(".liquid-background")?.cloneNode(true);
    const page = document.querySelector(".page-viewport")?.cloneNode(true);
    if (background) layer.appendChild(background);
    if (page) layer.appendChild(page);

    return () => layer.replaceChildren();
  }, [themeTransition]);

  const activeTheme = theme ?? "dark";
  const scrolled = active !== "#hero";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (themeTransition) return;
    const next: Theme = activeTheme === "dark" ? "light" : "dark";
    const rect = event.currentTarget.getBoundingClientRect();

    setThemeTransition({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
      next,
    });
  };

  const completeThemeTransition = () => {
    if (!themeTransition) return;
    setTheme(themeTransition.next);
    setThemeTransition(null);
  };

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (window.location.hash === href) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.location.hash = href;
  };

  return (
    <>
      <nav className={`navbar-shell fixed top-0 left-0 right-0 z-50 ${scrolled ? "is-scrolled" : ""} ${navHidden ? "is-hidden" : ""}`}>
        <div className="section-container flex items-center justify-between gap-3 md:gap-6">
          <div className="nav-glass-island brand-glass flex shrink-0 items-center">
            <button
              onClick={() => scrollTo("#hero")}
              className="group flex shrink-0 items-center gap-3 pr-1 text-lg font-bold text-[var(--text-primary)] tracking-tight transition-opacity hover:opacity-90"
              aria-label="返回首页"
            >
              <span className="avatar-glass relative h-10 w-10 shrink-0 rounded-full p-[2px]">
                <img
                  src="/site-icon.png"
                  alt="Airbus 350-1000 图标"
                  className="h-full w-full rounded-full object-cover"
                />
                <span className="pointer-events-none absolute inset-0 rounded-full border border-white/45" />
              </span>
              <span className="brand-name gradient-text shrink-0 text-base md:text-lg">
                Airbus 350-1000
              </span>
            </button>
          </div>

          <div className="nav-glass-island nav-links-glass mx-auto hidden md:flex items-center p-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={`nav-link-btn relative text-sm transition-colors ${
                  active === item.href
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {active === item.href && (
                  <motion.span
                    layoutId="nav-glass-pill"
                    className="nav-active-glass absolute"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-3 md:ml-0">
            <div className="nav-glass-island theme-glass inline-flex items-center p-1.5">
              <button
                onClick={toggleTheme}
                className="theme-switch relative inline-flex h-9 w-[74px] items-center justify-between text-[var(--text-tertiary)]"
                aria-label={`切换到${activeTheme === "dark" ? "浅色" : "深色"}模式`}
                type="button"
              >
                <motion.span
                  className="theme-knob absolute"
                  animate={{ x: activeTheme === "dark" ? 38 : 0 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center transition-colors duration-300 ${
                    activeTheme === "light" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
                  }`}
                  aria-hidden="true"
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                  </svg>
                </span>
                <span
                  className={`relative z-10 flex h-7 w-7 items-center justify-center transition-colors duration-300 ${
                    activeTheme === "dark" ? "text-[var(--text-primary)]" : "text-[var(--text-tertiary)]"
                  }`}
                  aria-hidden="true"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M21 14.7A8.5 8.5 0 0 1 9.3 3a.75.75 0 0 0-.82-1.1A10 10 0 1 0 22.1 15.52a.75.75 0 0 0-1.1-.82Z" />
                  </svg>
                </span>
              </button>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="nav-glass-island menu-glass md:hidden inline-flex items-center justify-center"
              aria-label="Toggle menu"
            >
              <motion.span
                animate={menuOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-[2px] bg-[var(--text-primary)] rounded-full"
              />
              <motion.span
                animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="block w-6 h-[2px] bg-[var(--text-primary)] rounded-full"
              />
              <motion.span
                animate={menuOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block w-6 h-[2px] bg-[var(--text-primary)] rounded-full"
              />
            </button>
          </div>
        </div>
      </nav>

      {themeTransition && (
        <div
          key={`${themeTransition.next}-${themeTransition.x}-${themeTransition.y}`}
          ref={themeTransitionRef}
          className="theme-transition-orb"
          data-transition-theme={themeTransition.next}
          aria-hidden="true"
          onAnimationEnd={completeThemeTransition}
              style={
                {
                  "--theme-origin-x": `${themeTransition.x}px`,
                  "--theme-origin-y": `${themeTransition.y}px`,
                } as CSSProperties
              }
        />
      )}

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            className="mobile-nav-panel fixed top-24 left-4 right-4 z-40 md:hidden"
          >
            <div className="flex flex-col gap-2 p-3">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`mobile-nav-link text-left text-lg transition-colors ${
                    active === item.href
                      ? "active text-[var(--text-primary)]"
                      : "text-[var(--text-tertiary)]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}


