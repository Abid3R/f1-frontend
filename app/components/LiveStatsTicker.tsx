"use client";

import { Zap, Flag, Trophy, Gauge, Activity, Globe } from "lucide-react";

const TICKER_ITEMS = [
  { icon: Zap, label: "Top Speed", value: "372 km/h" },
  { icon: Gauge, label: "0–100 km/h", value: "2.6 s" },
  { icon: Flag, label: "2026 Rounds", value: "24" },
  { icon: Trophy, label: "Champions", value: "34 unique" },
  { icon: Activity, label: "G-Force in turns", value: "≈ 6.5 G" },
  { icon: Globe, label: "Continents Raced", value: "5" },
  { icon: Zap, label: "Engine RPM", value: "15,000 max" },
  { icon: Gauge, label: "Pit Stop Record", value: "1.80 s" },
  { icon: Flag, label: "Race Distance", value: "305 km" },
  { icon: Trophy, label: "Active Teams", value: "10" },
];

export default function LiveStatsTicker() {
  // Duplicate the array so the marquee loops seamlessly
  const loop = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="relative w-full overflow-hidden border-y border-neutral-900 bg-gradient-to-r from-black via-red-950/10 to-black py-3">
      {/* Edge fades */}
      <div className="absolute top-0 left-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
      <div className="absolute top-0 right-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

      {/* Live indicator pill */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-600/20 border border-red-600/40 backdrop-blur-sm">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-dot-pulse" />
        <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">
          F1 Facts
        </span>
      </div>

      {/* Scrolling track */}
      <div className="ticker-track flex gap-10 whitespace-nowrap md:pl-32">
        {loop.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.label}-${i}`}
              className="inline-flex items-center gap-2 text-sm shrink-0"
            >
              <Icon size={14} className="text-red-500 shrink-0" />
              <span className="text-neutral-500 font-semibold uppercase text-[11px] tracking-widest">
                {item.label}
              </span>
              <span className="text-white font-black">{item.value}</span>
              <span className="text-red-700 mx-3">/</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .ticker-track {
          animation: ticker-scroll 45s linear infinite;
          will-change: transform;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
}
