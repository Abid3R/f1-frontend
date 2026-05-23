"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchStints, type StintRow } from "@/lib/api";

/**
 * Per-driver tyre-stint timeline for the latest race.  Each stint is rendered
 * as a horizontal bar coloured by compound (Pirelli convention).
 *
 *   Soft         → red
 *   Medium       → yellow
 *   Hard         → white
 *   Intermediate → green
 *   Wet          → blue
 */

const COMPOUND_COLOUR: Record<string, string> = {
  SOFT: "#ef4444",
  MEDIUM: "#facc15",
  HARD: "#f4f4f5",
  INTERMEDIATE: "#16a34a",
  WET: "#2563eb",
  UNKNOWN: "#3f3f46",
};

export default function TyreStintVisualizer({ sessionKey }: { sessionKey?: number }) {
  const [rows, setRows] = useState<StintRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchStints(sessionKey ? { sessionKey } : undefined);
        if (cancelled) return;
        setRows(data);
        setError(null);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Stint history unavailable.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionKey]);

  const grouped = useMemo(() => {
    if (!rows) return [];
    const byDriver: Record<number, StintRow[]> = {};
    for (const r of rows) {
      if (!byDriver[r.driver_number]) byDriver[r.driver_number] = [];
      byDriver[r.driver_number].push(r);
    }
    return Object.entries(byDriver)
      .map(([dn, list]) => ({
        driver_number: Number(dn),
        stints: [...list].sort((a, b) => a.stint_number - b.stint_number),
        last_lap: Math.max(...list.map((s) => s.lap_end ?? 0)),
      }))
      .sort((a, b) => a.driver_number - b.driver_number);
  }, [rows]);

  const maxLap = useMemo(() => Math.max(1, ...grouped.map((g) => g.last_lap)), [grouped]);

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-lg font-bold">
          Tyre <span className="text-red-500">Stint History</span>
        </h2>
        <div className="flex items-center gap-3 text-[10px] text-zinc-400">
          <Chip colour={COMPOUND_COLOUR.SOFT} label="Soft" />
          <Chip colour={COMPOUND_COLOUR.MEDIUM} label="Medium" dark />
          <Chip colour={COMPOUND_COLOUR.HARD} label="Hard" dark />
          <Chip colour={COMPOUND_COLOUR.INTERMEDIATE} label="Inter" />
          <Chip colour={COMPOUND_COLOUR.WET} label="Wet" />
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
          {error}
        </div>
      )}

      {!error && grouped.length === 0 && (
        <div className="text-sm text-zinc-500">No stint data for this session.</div>
      )}

      <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-2">
        {grouped.map((g) => (
          <li key={g.driver_number} className="grid grid-cols-[3rem_1fr] items-center gap-3">
            <span className="font-mono text-xs text-zinc-400">#{g.driver_number}</span>
            <div className="flex h-5 w-full overflow-hidden rounded-md border border-white/10 bg-white/[0.03]">
              {g.stints.map((s) => {
                const len = Math.max(0, (s.lap_end ?? 0) - (s.lap_start ?? 0) + 1);
                const pct = (len / maxLap) * 100;
                const colour = COMPOUND_COLOUR[(s.compound || "UNKNOWN").toUpperCase()] ?? COMPOUND_COLOUR.UNKNOWN;
                return (
                  <div
                    key={s.stint_number}
                    title={`Stint ${s.stint_number}: ${s.compound} (lap ${s.lap_start}–${s.lap_end})`}
                    style={{ width: `${pct}%`, background: colour }}
                    className="text-[9px] text-black/80 grid place-items-center font-bold"
                  >
                    {len >= 8 ? s.compound?.[0]?.toUpperCase() : ""}
                  </div>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ colour, label, dark = false }: { colour: string; label: string; dark?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span
        className="inline-block h-2.5 w-2.5 rounded-sm border border-black/40"
        style={{ background: colour, color: dark ? "#111" : "#fff" }}
      />
      {label}
    </span>
  );
}
