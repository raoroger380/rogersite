"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const PHOTO_SLOTS = Array.from({ length: 6 }, (_, index) => ({
  id: index + 1,
  src: [
    "/photos/beijing.jpg",
    "/photos/chongqing.jpg",
    "/photos/guangzhou.jpg",
    "/photos/guangzhou-2.jpg",
    "/photos/shenzhen.jpg",
    "/photos/shenzhen-2.jpg",
  ][index],
  alt: ["北京", "重庆", "广州", "广州 2", "深圳", "深圳 2"][index],
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

function PhotoCard({
  compact = false,
  photo,
  onOpen,
}: {
  compact?: boolean;
  photo?: { src: string; alt: string };
  onOpen?: (photo: { src: string; alt: string }) => void;
}) {
  const cardClassName = compact
    ? "album-photo album-photo-compact"
    : "album-photo";

  if (!photo) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
        className={cardClassName}
      >
        <div className="album-photo-inner">
          <CameraIcon />
          <span>PHOTO</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42 }}
      className={cardClassName}
      onClick={() => onOpen?.(photo)}
      aria-label={`查看${photo.alt}照片`}
    >
      <div className="album-photo-inner">
        <span className="album-photo-name">{photo.alt}</span>
        <CameraIcon />
        <span className="album-photo-hint">点击可观看</span>
      </div>
    </motion.button>
  );
}

export default function FootprintsAlbum() {
  const [active, setActive] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const goTo = (next: number) => {
    setActive((next + PHOTO_SLOTS.length) % PHOTO_SLOTS.length);
  };

  useEffect(() => {
    if (!selectedPhoto) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhoto(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhoto]);

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
            <PhotoCard
              key={slot.id}
              photo={slot}
              onOpen={setSelectedPhoto}
            />
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
              <PhotoCard
                compact
                photo={PHOTO_SLOTS[active]}
                onOpen={setSelectedPhoto}
              />
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

      {selectedPhoto &&
        createPortal(
          <motion.div
            className="photo-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={selectedPhoto.alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSelectedPhoto(null)}
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="photo-lightbox-close"
              onClick={() => setSelectedPhoto(null)}
              aria-label="关闭图片"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className="photo-lightbox-image"
              onClick={(event) => event.stopPropagation()}
            />
          </motion.div>,
          document.body,
        )}
    </section>
  );
}
