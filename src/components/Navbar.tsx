"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { label: "首页", href: "#hero" },
  { label: "关于", href: "#about" },
  { label: "项目", href: "#projects" },
  { label: "技能", href: "#skills" },
  { label: "爱好", href: "#hobbies" },
  { label: "签名", href: "#signature" },
  { label: "联系", href: "#contact" },
];

type Theme = "light" | "dark";

export default function Navbar() {
  const [active, setActive] = useState("#hero");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const sections = NAV_ITEMS.map((item) => item.href.slice(1));
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.getBoundingClientRect().top <= 200) {
          setActive(`#${sections[i]}`);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as Theme | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setTheme(storedTheme ?? (prefersDark ? "dark" : "light"));
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  const activeTheme = theme ?? "light";

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "nav-blur" : "bg-transparent"
        }`}
      >
        <div className="section-container flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => scrollTo("#hero")}
            className="flex items-center gap-3 text-lg font-bold text-[var(--text-primary)] tracking-tight hover:opacity-80 transition-opacity"
            aria-label="返回首页"
          >
            <img
              src="/site-icon.png"
              alt="Airbus 350-1000 图标"
              className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--card-bg)] shadow-sm"
            />
            <span className="gradient-text">Airbus 350-1000</span>
          </button>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollTo(item.href)}
                className={`relative text-sm transition-colors ${
                  active === item.href
                    ? "text-[var(--text-primary)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                {item.label}
                {active === item.href && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full bg-[var(--accent-gradient)]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => setTheme((current) => ((current ?? "light") === "dark" ? "light" : "dark"))}
            className="relative ml-auto md:ml-0 inline-flex h-9 w-[74px] items-center justify-between rounded-full border border-[var(--border-subtle)] bg-[var(--card-bg)] px-1.5 text-[var(--text-tertiary)] shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--border-glow)] focus:outline-none focus:ring-2 focus:ring-[var(--border-glow)]"
            aria-label={`切换到${activeTheme === "dark" ? "浅色" : "深色"}模式`}
            type="button"
          >
            <motion.span
              className="absolute top-1 h-7 w-7 rounded-full bg-[var(--accent)] shadow-[var(--accent-shadow)]"
              animate={{ x: activeTheme === "dark" ? 34 : 0 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            />
            <span
              className={`relative z-10 flex h-7 w-7 items-center justify-center transition-colors duration-300 ${
                activeTheme === "light" ? "text-white" : "text-[var(--text-tertiary)]"
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
                activeTheme === "dark" ? "text-white" : "text-[var(--text-tertiary)]"
              }`}
              aria-hidden="true"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 14.7A8.5 8.5 0 0 1 9.3 3a.75.75 0 0 0-.82-1.1A10 10 0 1 0 22.1 15.52a.75.75 0 0 0-1.1-.82Z" />
              </svg>
            </span>
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col gap-1.5 p-2"
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
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 nav-blur md:hidden"
          >
            <div className="flex flex-col p-6 gap-4">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.href}
                  onClick={() => scrollTo(item.href)}
                  className={`text-left text-lg py-2 transition-colors ${
                    active === item.href
                      ? "text-[var(--text-primary)]"
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


