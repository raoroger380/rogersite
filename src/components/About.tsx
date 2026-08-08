"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function About() {
  const [today, setToday] = useState("");

  useEffect(() => {
    const value = new Intl.DateTimeFormat("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date());
    setToday(value.replace(/\//g, "."));
  }, []);

  return (
    <section
      id="about"
      className="relative z-10 flex w-full items-center justify-center px-3 py-2 md:px-4 md:py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 26, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        className="boarding-frame w-full max-w-[860px]"
      >
        <div className="boarding-pass w-full">
          <div className="relative z-10 px-4 py-5 sm:px-12 sm:py-10">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[var(--text-tertiary)] sm:text-[11px]">
                Boarding Pass / 登机牌
              </p>
              <h3 className="mt-2 text-2xl font-bold gradient-text sm:text-4xl">
                人生航班
              </h3>
            </div>
            <div className="text-right">
              <p className="text-[10px] tracking-[0.2em] text-[var(--text-tertiary)] sm:text-[11px]">
                Airbus 350-1000
              </p>
              <span className="boarding-stamp">LIFE / 人生</span>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:mt-7 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
            <div className="flex items-center gap-4">
              <img
                src="/site-icon.png"
                alt="Airbus 350-1000 头像"
                className="h-14 w-14 rounded-full object-cover shadow-[0_10px_24px_rgba(0,0,0,0.18)] ring-1 ring-white/40 sm:h-20 sm:w-20"
              />
              <div>
                <p className="boarding-field-label">乘客 / Passenger</p>
                <p className="mt-1 text-xl font-bold text-[var(--text-primary)] sm:text-3xl">
                  饶启烨
                </p>
                <p className="mt-1 text-xs text-[var(--text-tertiary)] sm:text-sm">学生 / 探索者</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2.5 sm:w-[340px] sm:gap-4">
              <div className="boarding-field">
                <span className="boarding-field-label">航班</span>
                <strong>人生</strong>
              </div>
              <div className="boarding-field">
                <span className="boarding-field-label">座位</span>
                <strong>佛山</strong>
              </div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-4 sm:gap-4">
            <div className="boarding-field">
              <span className="boarding-field-label">舱位</span>
              <strong>学生</strong>
            </div>
            <div className="boarding-field">
              <span className="boarding-field-label">状态</span>
              <strong>探索中</strong>
            </div>
            <div className="boarding-field">
              <span className="boarding-field-label">日期</span>
              <strong>{today || "------"}</strong>
            </div>
            <div className="boarding-field">
              <span className="boarding-field-label">目的地</span>
              <strong>下一站</strong>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2.5 sm:mt-5 sm:grid-cols-2 sm:gap-4">
            <div className="boarding-route">
              <span className="boarding-field-label">出发地</span>
              <strong>校园</strong>
            </div>
            <div className="boarding-route">
              <span className="boarding-field-label">目标</span>
              <strong>考上好大学</strong>
            </div>
          </div>
          </div>

          <div className="boarding-perforation" />

          <div className="relative z-10 flex flex-row items-center justify-between gap-3 px-4 py-4 sm:gap-5 sm:px-12 sm:py-7">
            <div className="text-left">
              <p className="hidden text-[11px] uppercase tracking-[0.22em] text-[var(--text-tertiary)] sm:block">
                RQY · Life Flight · 佛山 → 下一站
              </p>
              <p className="text-sm font-semibold text-[var(--text-primary)] sm:mt-1 sm:text-base">
                人生航班正在登机
              </p>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="boarding-barcode" aria-hidden="true" />
              <span className="text-[8px] tracking-[0.18em] text-[var(--text-tertiary)] sm:text-[9px]">
                RQY-2026
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
