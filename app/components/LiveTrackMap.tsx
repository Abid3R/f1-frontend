"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchLivePositions, type LivePosition } from "@/lib/api";

/**
 * Pure SVG track map.  Polls /api/telemetry/positions every 5s, normalizes
 * (x,y) into the SVG viewBox, and renders a dot per driver labelled with
 * their three-letter code.  Team colour comes from OpenF1.
 *
 * No external map data needed — the visible "track" is implicit in the
 * scatter of recent positions.
 */
const POLL_MS = 5_000;
const PADDING = 16;
const W = 480;
const H = 320;

export default function LiveTrackMap() {
  const [pos, setPos] = useState<LivePosition[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const data = await fetchLivePositions();
        if (cancelled) return;
        setPos(data);
        setError(null);
        setLastUpdated(new Date());
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Live data unavailable.");
      }
    };
    tick();
    const id = setInterval(tick, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const projected = useMemo(() => {
    if (!pos || pos.length === 0) return [];
    const xs = pos.map((p) => p.x);
    const ys = pos.map((p) => p.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const sx = (W - 2 * PADDING) / Math.max(1, maxX - minX);
    const sy = (H - 2 * PADDING) / Math.max(1, maxY - minY);
    const s = Math.min(sx, sy);

    return pos.map((p) => ({
      ...p,
      px: PADDING + (p.x - minX) * s,
      // Y is inverted in SVG
      py: H - PADDING - (p.y - minY) * s,
    }));
  }, [pos]);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-bold">
          Live <span className="text-red-500">Track Map</span>
        </h2>
        <div className="text-[11px] text-zinc-500">
          {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : "Awaiting feed…"}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
          {error}
        </div>
      )}

      {!error && (!pos || pos.length === 0) && (
        <div className="text-sm text-zinc-500 mb-4">No active race session right now.</div>
      )}

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto rounded-lg bg-[#020409] border border-white/5"
        role="img"
        aria-label="Live driver positions on the track"
      >
        {/* Faint grid background */}
        <defs>
          <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M 32 0 L 0 0 0 32" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={W} height={H} fill="url(#grid)" />

        {projected.map((p) => {
          const colour = p.team_colour ? `#${p.team_colour}` : "#ef4444";
          return (
            <g key={p.driver_number}>
              <circle
                cx={p.px}
                cy={p.py}
                r={7}
                fill={colour}
                stroke="#020409"
                strokeWidth={1.5}
                style={{ transition: "cx 800ms ease, cy 800ms ease" }}
              />
              <text
                x={p.px + 9}
                y={p.py + 3.5}
                fontSize={9}
                fill="#e4e4e7"
                style={{ paintOrder: "stroke", stroke: "#020409", strokeWidth: 3 }}
              >
                {p.name_acronym ?? `#${p.driver_number}`}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
