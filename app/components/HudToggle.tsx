"use client";

import { useHudTheme } from "@/lib/hud-theme";
import { Gauge } from "lucide-react";

/**
 * Pit-Wall HUD mode toggle for the navbar.
 *
 * Pure cosmetic — swaps the global theme via context.
 */
export default function HudToggle() {
  const { isHud, toggle } = useHudTheme();

  return (
    <button
      type="button"
      onClick={toggle}
      title={isHud ? "Exit Pit-Wall HUD" : "Enable Pit-Wall HUD"}
      aria-pressed={isHud}
      className={
        "group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] " +
        "font-semibold uppercase tracking-wider transition border " +
        (isHud
          ? "bg-cyan-400/10 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(0,231,255,0.35)]"
          : "bg-white/5 text-zinc-300 border-white/10 hover:bg-white/10 hover:text-white")
      }
    >
      <Gauge className="h-3.5 w-3.5" />
      {isHud ? "HUD: ON" : "Pit-Wall HUD"}
    </button>
  );
}
