"use client";

import { useEffect, useState } from "react";

export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-[3px] z-[100] pointer-events-none">
      <div
        className="h-full bg-gradient-to-r from-red-700 via-red-500 to-red-400 shadow-[0_0_12px_rgba(220,38,38,0.6)] transition-[width] duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
