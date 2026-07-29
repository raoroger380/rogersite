"use client";

import { motion } from "framer-motion";

const nameText = "你好，我是";
const nameHighlight = "饶启烨";
const tagline = "14岁 / 学生 / 代码爱好者";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const letterVariant = {
  hidden: { opacity: 0, y: 30, rotateX: -90 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function Hero() {
  return (
    <section id="hero" className="relative z-10 min-h-screen flex items-center justify-center pb-20">
      <div className="section-container text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xs md:text-sm text-[var(--text-tertiary)] tracking-[0.25em] uppercase mb-6"
        >
          {tagline}
        </motion.p>
        <motion.h1
          variants={container} initial="hidden" animate="show"
          className="text-[2.5rem] sm:text-5xl md:text-7xl font-bold leading-[1.15] mb-4"
        >
          <span className="text-[var(--text-primary)] block">{nameText}</span>
          <span className="block mt-2">
            {nameHighlight.split("").map((char, i) => (
              <motion.span key={i} variants={letterVariant} className="gradient-text inline-block">
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="text-sm md:text-base text-[var(--text-secondary)] max-w-lg mx-auto mt-6 leading-relaxed"
        >
          从写第一行 HTML 开始，我就喜欢上了创造的感觉。
          这个网站是我折腾代码的小天地。
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
          className="flex flex-wrap items-center justify-center gap-4 mt-10"
        >
          <a href="#projects" className="glow-btn glow-btn-primary">
            看看我的项目
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7" /></svg>
          </a>
          <a href="#hobbies" className="glow-btn glow-btn-secondary">
            {"\u{1F916}"} 我的爱好
          </a>
          <a href="#contact" className="glow-btn glow-btn-secondary">找我玩</a>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="bounce-arrow flex flex-col items-center gap-2 text-[var(--text-tertiary)]">
            <span className="text-xs tracking-widest">往下翻</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
