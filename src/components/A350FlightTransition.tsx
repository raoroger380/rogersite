"use client";

import { useEffect, useRef, useState } from "react";

interface A350FlightTransitionProps {
  flightKey: number;
  onComplete?: () => void;
}

export default function A350FlightTransition({ flightKey, onComplete }: A350FlightTransitionProps) {
  const [visible, setVisible] = useState(false);
  const onCompleteRef = useRef(onComplete);
  const completedRef = useRef(false);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    if (flightKey === 0) return;

    completedRef.current = false;
    setVisible(true);
    const fallbackTimer = window.setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onCompleteRef.current?.();
      }
      setVisible(false);
    }, 2200);
    return () => window.clearTimeout(fallbackTimer);
  }, [flightKey]);

  const handlePlaneAnimationEnd = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setVisible(false);
    onCompleteRef.current?.();
  };

  if (!visible) return null;

  return (
    <>
      <style>{`@keyframes a350-flight {
  0% { transform: translate(-50%, 100vh) scale(0.96); opacity: 0; }
  7% { opacity: 1; }
  93% { opacity: 1; }
  100% { transform: translate(-50%, -100vh) scale(1.03); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .a350-flight-plane {
    animation-duration: 1.4s !important;
  }
}`}</style>
      <div
        key={flightKey}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
      >
        <div
          className="a350-flight-plane"
          onAnimationEnd={handlePlaneAnimationEnd}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: "min(68vw, 82vh, 700px)",
            transform: "translate(-50%, 100vh) scale(0.96)",
            opacity: 0,
            animation: "a350-flight 1.4s cubic-bezier(0.65, 0, 0.35, 1) forwards",
            willChange: "transform, opacity",
          }}
        >
          <span className="a350-flight-trail" />
          <img
            src="/a350-flight.png"
            alt=""
            draggable={false}
            className="a350-flight-image"
          />
        </div>
      </div>
    </>
  );
}
