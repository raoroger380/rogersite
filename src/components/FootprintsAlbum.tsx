"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PHOTO_SLOTS = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
}));

function CameraIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M14.5 4h-5L7.8 6.5H4a2 2 0 0 0-2 2V18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8.5a2 2 0 0 0-2-2h-3.8L14.5 4Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

function PhotoCard({ compact = false }: { compact?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
      className={compact ? "album-photo album-photo-compact" : "album-photo"}
    >
      <div className="album-photo-inner">
        <CameraIcon />
        <span>PHOTO</span>
      </div>
    </motion.div>
  );
}

export default function FootprintsAlbum() {
  const [active, setActive] = useState(0);

  const goTo = (next: number) => {
    setActive((next + PHOTO_SLOTS.length) % PHOTO_SLOTS.length);
  };

  return (
    <section id="footprints-album" className="album-section relative z-10">
      <div className="section-container album-container">
        <div className="section-header album-header">
          <p className="overline">足迹相册</p>
          <h3>
            走过的<span className="gradient-text">画面</span>
          </h3>
          <p>把路上的风景留在这里。</p>
        </div>

        <div className="album-grid hidden md:grid">
          {PHOTO_SLOTS.map((slot) => (
            <PhotoCard key={slot.id} />
          ))}
        </div>

        <div className="md:hidden album-mobile">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -32 }}
              transition={{ duration: 0.28, ease: [0.22, 0.61, 0.36, 1] }}
              className="album-mobile-photo"
            >
              <PhotoCard compact />
            </motion.div>
          </AnimatePresence>

          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => goTo(active - 1)}
              className="project-nav-btn"
              aria-label="上一张照片"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              {PHOTO_SLOTS.map((slot, index) => (
                <button
                  key={slot.id}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`project-dot ${active === index ? "active" : ""}`}
                  aria-label={`查看第 ${index + 1} 张照片`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(active + 1)}
              className="project-nav-btn"
              aria-label="下一张照片"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
