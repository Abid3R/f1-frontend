"use client";

import { useMemo } from "react";

/**
 * Teammate Battle Dashboard — head-to-head across four metrics:
 *   - Qualifying H2H
 *   - Race-finish H2H
 *   - Points contribution (season total)
 *   - Average pit-stop time (s)
 *
 * Designed to be re-used across pages: pass two driver "blocks" and the
 * component renders a duelling layout with diverging bars.
 */
export interface TeammateBlock {
  name: string;
  acronym?: string;
  team_colour?: string;
  quali_wins: number;
  race_wins: number;        // number of times finished ahead of teammate
  points: number;
  avg_pit_time: number;     // seconds
}

interface Props {
  a: TeammateBlock;
  b: TeammateBlock;
  title?: string;
}

export default function TeammateBattle({ a, b, title = "Teammate Battle" }: Props) {
  const rows = useMemo(() => ([
    row("Qualifying H2H", a.quali_wins, b.quali_wins, false),
    row("Race-finish H2H", a.race_wins, b.race_wins, false),
    row("Season Points", a.points, b.points, false),
    row("Avg. Pit Stop", a.avg_pit_time, b.avg_pit_time, true),
  ]), [a, b]);

  const colourA = a.team_colour ? `#${a.team_colour}` : "#ef4444";
  const colourB = b.team_colour ? `#${b.team_colour}` : "#38bdf8";

  return (
    <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
      <h2 className="text-lg font-bold mb-1">{title}</h2>
      <p className="text-xs text-zinc-500 mb-5">
        Side-by-side comparison across qualifying, race results, points & pit-lane pace.
      </p>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 mb-3 text-xs">
        <div className="flex items-center justify-end gap-2 font-semibold">
          <span className="text-zinc-300">{a.name}</span>
          <Dot colour={colourA} />
        </div>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">vs</span>
        <div className="flex items-center gap-2 font-semibold">
          <Dot colour={colourB} />
          <span className="text-zinc-300">{b.name}</span>
        </div>
      </div>

      <ul className="space-y-3">
        {rows.map((r) => {
          // Use the *better* score as a percentage of the sum for the bar widths.
          // For lowerIsBetter (pit time) we invert.
          const total = r.lowerIsBetter ? Math.max(r.va + r.vb, 0.0001) : Math.max(r.va + r.vb, 0.0001);
          const aShare = r.lowerIsBetter ? r.vb / total : r.va / total;
          const bShare = 1 - aShare;
          return (
            <li key={r.label}>
              <div className="flex items-baseline justify-between text-[11px] uppercase tracking-widest text-zinc-500 mb-1">
                <span>{r.label}</span>
                <span className="font-mono text-zinc-300">
                  {fmt(r.va, r.lowerIsBetter)} · {fmt(r.vb, r.lowerIsBetter)}
                </span>
              </div>
              <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-white/5">
                <div style={{ width: `${aShare * 100}%`, background: colourA, transition: "width 600ms ease" }} />
                <div style={{ width: `${bShare * 100}%`, background: colourB, transition: "width 600ms ease" }} />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function row(label: string, va: number, vb: number, lowerIsBetter: boolean) {
  return { label, va, vb, lowerIsBetter };
}
function fmt(v: number, isTime: boolean): string {
  if (isTime) return `${v.toFixed(2)}s`;
  return Number.isInteger(v) ? String(v) : v.toFixed(2);
}
function Dot({ colour }: { colour: string }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ background: colour, boxShadow: `0 0 8px ${colour}55` }}
    />
  );
}
