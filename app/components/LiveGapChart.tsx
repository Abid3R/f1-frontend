"use client";

import { useEffect, useState } from "react";
import { fetchLiveIntervals, type LiveInterval } from "@/lib/api";

/**
 * Latest gap-to-leader for every driver in the current race.
 *
 * Polls /api/telemetry/intervals every 15s.  Renders a bar list — the largest
 * gap defines the bar width.  Use during a live race; outside race weekends
 * the backend will return 404 from the underlying OpenF1 endpoint, which we
 * surface as a friendly empty state.
 */
const POLL_MS = 15_000;

export default function LiveGapChart() {
  const [rows, setRows] = useState<LiveInterval[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    let cancelled = false;
    const tick = async () => {
      try {
        const data = await fetchLiveIntervals();
        if (cancelled) return;
        setRows(data);
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

  const maxGap = rows
    ? Math.max(0.0001, ...rows.map((r) => (typeof r.gap_to_leader === "number" ? r.gap_to_leader : 0)))
    : 0.0001;

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-bold">
          Live <span className="text-red-500">Gap Chart</span>
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

      {!error && rows && rows.length === 0 && (
        <div className="text-sm text-zinc-500">No active race session right now.</div>
      )}

      {rows && rows.length > 0 && (
        <ul className="space-y-1.5 max-h-[360px] overflow-y-auto pr-2">
          {rows.map((r) => {
            const gap = typeof r.gap_to_leader === "number" ? r.gap_to_leader : null;
            const width = gap === null ? 0 : Math.min(100, (gap / maxGap) * 100);
            return (
              <li key={r.driver_number} className="grid grid-cols-[3rem_3rem_1fr_4rem] items-center gap-3 text-xs">
                <span className="font-mono text-zinc-500">#{r.driver_number}</span>
                <span className="font-mono text-zinc-300">
                  {gap === null ? "—" : gap === 0 ? "LDR" : `+${gap.toFixed(2)}`}
                </span>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 to-red-700"
                    style={{ width: `${width}%`, transition: "width 600ms ease" }}
                  />
                </div>
                <span className="font-mono text-[10px] text-zinc-500 text-right">
                  {typeof r.interval === "number" ? `+${r.interval.toFixed(2)}` : "—"}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
