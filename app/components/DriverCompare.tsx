"use client";

import { X, ArrowLeftRight, Crown } from "lucide-react";

interface Driver {
  driver_id: string;
  full_name: string;
  code?: string;
  team?: string;
  nationality?: string;
  permanent_number?: string | number;
  standing_position?: number;
  points?: number;
  wins?: number;
}

interface DriverCompareProps {
  a: Driver;
  b: Driver;
  onClear: () => void;
}

function fmt(n?: number) {
  return typeof n === "number" ? n : "—";
}

// Returns 1 if a wins, -1 if b wins, 0 tie. Lower-is-better when 'lower' is true.
function compare(
  av: number | undefined,
  bv: number | undefined,
  lower = false
): 1 | -1 | 0 {
  if (av == null && bv == null) return 0;
  if (av == null) return -1;
  if (bv == null) return 1;
  if (av === bv) return 0;
  const aBeatsB = lower ? av < bv : av > bv;
  return aBeatsB ? 1 : -1;
}

interface StatRow {
  label: string;
  av: number | undefined;
  bv: number | undefined;
  lowerIsBetter?: boolean;
}

export default function DriverCompare({ a, b, onClear }: DriverCompareProps) {
  const rows: StatRow[] = [
    { label: "Championship Pos", av: a.standing_position, bv: b.standing_position, lowerIsBetter: true },
    { label: "Points",           av: a.points,            bv: b.points },
    { label: "Wins",             av: a.wins,              bv: b.wins  },
  ];

  return (
    <div className="glass-card rounded-2xl border border-red-900/40 p-5 md:p-6 mb-8 animate-fade-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <ArrowLeftRight size={16} className="text-red-500" />
          <p className="text-red-500 font-bold uppercase tracking-[0.22em] text-[10px]">
            Driver Comparison
          </p>
        </div>
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-[11px] font-bold text-neutral-400 hover:text-white px-2.5 py-1 rounded-md hover:bg-neutral-800/60 transition-colors"
        >
          <X size={12} />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-3 md:gap-5 items-start">
        {/* Left driver */}
        <DriverHeader driver={a} side="left" />

        <div className="hidden md:flex flex-col items-center justify-center pt-6 text-neutral-700">
          <ArrowLeftRight size={20} />
          <span className="text-[9px] uppercase tracking-widest mt-1">vs</span>
        </div>

        {/* Right driver */}
        <DriverHeader driver={b} side="right" />
      </div>

      {/* Stat rows */}
      <div className="mt-5 border-t border-neutral-800/60 pt-4 space-y-2">
        {rows.map((row) => {
          const result = compare(row.av, row.bv, row.lowerIsBetter);
          const aWins = result === 1;
          const bWins = result === -1;
          return (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-3"
            >
              <div
                className={`text-right text-sm font-bold ${
                  aWins ? "text-green-400" : "text-neutral-300"
                }`}
              >
                <span className="inline-flex items-center gap-1.5 justify-end">
                  {aWins && <Crown size={12} className="text-green-400" />}
                  {fmt(row.av)}
                </span>
              </div>
              <div className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold text-center min-w-[120px]">
                {row.label}
              </div>
              <div
                className={`text-left text-sm font-bold ${
                  bWins ? "text-green-400" : "text-neutral-300"
                }`}
              >
                <span className="inline-flex items-center gap-1.5">
                  {fmt(row.bv)}
                  {bWins && <Crown size={12} className="text-green-400" />}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DriverHeader({
  driver,
  side,
}: {
  driver: Driver;
  side: "left" | "right";
}) {
  return (
    <div
      className={`flex flex-col ${
        side === "left" ? "md:items-end md:text-right" : "md:items-start md:text-left"
      } items-center text-center`}
    >
      <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-1">
        {driver.team ?? "Team N/A"}
      </p>
      <h4 className="text-base md:text-lg font-black text-white leading-tight">
        {driver.full_name}
      </h4>
      <div className="flex items-center gap-1.5 mt-1.5">
        {driver.code && (
          <span className="text-[10px] font-black text-neutral-300 bg-neutral-800/80 border border-neutral-700/40 px-1.5 py-0.5 rounded uppercase tracking-widest">
            {driver.code}
          </span>
        )}
        {driver.permanent_number && (
          <span className="text-[10px] font-black text-red-400 bg-red-950/40 border border-red-900/40 px-1.5 py-0.5 rounded">
            #{driver.permanent_number}
          </span>
        )}
        {driver.nationality && (
          <span className="text-[10px] text-neutral-500">{driver.nationality}</span>
        )}
      </div>
    </div>
  );
}
