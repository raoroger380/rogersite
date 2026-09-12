"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

const PHOTO_SLOTS = Array.from({ length: 9 }, (_, index) => ({
  id: index + 1,
  src: [
    "/photos/beijing.jpg",
    "/photos/chongqing.jpg",
    "/photos/guangzhou.jpg",
    "/photos/shanghai.jpg",
    "/photos/shenzhen.jpg",
    "/photos/hong-kong.jpg",
    "/photos/nanjing.jpg",
    "/photos/suzhou.jpg",
    "/photos/hangzhou.jpg",
  ][index],
  alt: [
    "北京",
    "重庆",
    "广州",
    "上海",
    "深圳",
    "香港",
    "南京",
    "苏州",
    "杭州",
  ][index],
}));

const preloadedPhotos = new Map<string, HTMLImageElement>();

function preloadPhoto(src: string) {
  if (typeof window === "undefined" || preloadedPhotos.has(src)) return;

  const image = new window.Image();
  image.decoding = "async";
  image.src = src;
  preloadedPhotos.set(src, image);
}

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
  photo?: { id: number; src: string; alt: string };
  onOpen?: (photo: { id: number; src: string; alt: string }) => void;
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
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(
    null,
  );
  const [loadedPhotoSrc, setLoadedPhotoSrc] = useState<string | null>(null);
  const [failedPhotoSrc, setFailedPhotoSrc] = useState<string | null>(null);
  const selectedPhoto =
    selectedPhotoIndex === null ? null : PHOTO_SLOTS[selectedPhotoIndex];
  const selectedPhotoNumber =
    selectedPhotoIndex === null ? 0 : selectedPhotoIndex + 1;
  const isPhotoLoaded = selectedPhoto?.src === loadedPhotoSrc;
  const isPhotoFailed = selectedPhoto?.src === failedPhotoSrc;

  const goTo = (next: number) => {
    setActive((next + PHOTO_SLOTS.length) % PHOTO_SLOTS.length);
  };

  const changeSelectedPhoto = (offset: number) => {
    setLoadedPhotoSrc(null);
    setFailedPhotoSrc(null);
    setSelectedPhotoIndex((current) =>
      current === null
        ? null
        : (current + offset + PHOTO_SLOTS.length) % PHOTO_SLOTS.length,
    );
  };

  const openPhoto = (photo: { id: number }) => {
    setLoadedPhotoSrc(null);
    setFailedPhotoSrc(null);
    setSelectedPhotoIndex(
      PHOTO_SLOTS.findIndex((slot) => slot.id === photo.id),
    );
  };

  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    [1, -1, 2].forEach((offset) => {
      const nextIndex =
        (selectedPhotoIndex + offset + PHOTO_SLOTS.length) %
        PHOTO_SLOTS.length;
      preloadPhoto(PHOTO_SLOTS[nextIndex].src);
    });
  }, [selectedPhotoIndex]);

  useEffect(() => {
    if (selectedPhotoIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedPhotoIndex(null);
      }
      if (event.key === "ArrowLeft") {
        setLoadedPhotoSrc(null);
        setFailedPhotoSrc(null);
        setSelectedPhotoIndex((current) =>
          current === null
            ? null
            : (current - 1 + PHOTO_SLOTS.length) % PHOTO_SLOTS.length,
        );
      }
      if (event.key === "ArrowRight") {
        setLoadedPhotoSrc(null);
        setFailedPhotoSrc(null);
        setSelectedPhotoIndex((current) =>
          current === null
            ? null
            : (current + 1) % PHOTO_SLOTS.length,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPhotoIndex]);

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
              onOpen={openPhoto}
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
                onOpen={openPhoto}
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
            onClick={() => setSelectedPhotoIndex(null)}
            onWheel={(event) => event.stopPropagation()}
            onTouchStart={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
            onTouchEnd={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="photo-lightbox-nav photo-lightbox-prev"
              onClick={(event) => {
                event.stopPropagation();
                changeSelectedPhoto(-1);
              }}
              aria-label="上一张照片"
              title="上一张照片"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              className="photo-lightbox-close"
              onClick={() => setSelectedPhotoIndex(null)}
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
            <button
              type="button"
              className="photo-lightbox-nav photo-lightbox-next"
              onClick={(event) => {
                event.stopPropagation();
                changeSelectedPhoto(1);
              }}
              aria-label="下一张照片"
              title="下一张照片"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </button>
            <div
              className={`photo-lightbox-loading${isPhotoLoaded ? " is-hidden" : ""}${isPhotoFailed ? " is-error" : ""}`}
              aria-live="polite"
            >
              {isPhotoFailed ? (
                <span>图片加载失败</span>
              ) : (
                <span className="photo-lightbox-spinner" aria-hidden="true" />
              )}
            </div>
            <img
              key={selectedPhoto.src}
              src={selectedPhoto.src}
              alt={selectedPhoto.alt}
              className={`photo-lightbox-image${isPhotoLoaded ? " is-loaded" : ""}`}
              onClick={(event) => event.stopPropagation()}
              onLoad={() => {
                setLoadedPhotoSrc(selectedPhoto.src);
                setFailedPhotoSrc(null);
              }}
              onError={() => {
                setLoadedPhotoSrc(null);
                setFailedPhotoSrc(selectedPhoto.src);
              }}
            />
            <div className="photo-lightbox-status" aria-live="polite">
              <strong>{selectedPhoto.alt}</strong>
              <span>
                {selectedPhotoNumber} / {PHOTO_SLOTS.length}
              </span>
            </div>
          </motion.div>,
          document.body,
        )}
    </section>
  );
}
