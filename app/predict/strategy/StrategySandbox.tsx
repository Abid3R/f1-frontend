"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { predictStrategy, type StrategyRequest, type StrategyResult, type StrategyStint } from "@/lib/api";
import DataExportButton from "@/app/components/DataExportButton";

const COMPOUNDS: StrategyStint["compound"][] = ["SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"];
const COMPOUND_COLOUR: Record<string, string> = {
  SOFT: "#ef4444",
  MEDIUM: "#facc15",
  HARD: "#e4e4e7",
  INTERMEDIATE: "#16a34a",
  WET: "#2563eb",
};

interface StintEditor extends StrategyStint {
  id: string;
}
function newStint(c: StrategyStint["compound"], l: number): StintEditor {
  return { id: Math.random().toString(36).slice(2, 8), compound: c, laps: l };
}

export default function StrategySandbox() {
  const [basePace, setBasePace] = useState(90);
  const [totalLaps, setTotalLaps] = useState(57);
  const [fuelKg, setFuelKg] = useState(110);
  const [fuelPerLap, setFuelPerLap] = useState(1.9);
  const [stints, setStints] = useState<StintEditor[]>([newStint("MEDIUM", 22), newStint("HARD", 35)]);
  const [optimize, setOptimize] = useState(false);
  const [startCompound, setStartCompound] = useState<StrategyStint["compound"]>("MEDIUM");
  const [secondCompound, setSecondCompound] = useState<StrategyStint["compound"]>("HARD");

  const [result, setResult] = useState<StrategyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const stintTotal = useMemo(() => stints.reduce((acc, s) => acc + s.laps, 0), [stints]);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const body: StrategyRequest = {
        base_pace: basePace,
        total_laps: totalLaps,
        stints: stints.map(({ compound, laps }) => ({ compound, laps })),
        starting_fuel_kg: fuelKg,
        fuel_consumption_per_lap: fuelPerLap,
        optimize_pit_window: optimize,
        starting_compound: startCompound,
        second_compound: secondCompound,
      };
      const res = await predictStrategy(body);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Strategy simulation failed.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [basePace, totalLaps, stints, fuelKg, fuelPerLap, optimize, startCompound, secondCompound]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
      {/* ── Controls ─────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 space-y-5">
        <SliderField label="Base lap pace" value={basePace} onChange={setBasePace} min={70} max={120} step={0.5} unit="s" />
        <SliderField label="Total race laps" value={totalLaps} onChange={setTotalLaps} min={20} max={80} step={1} unit="laps" />
        <SliderField label="Starting fuel" value={fuelKg} onChange={setFuelKg} min={50} max={120} step={1} unit="kg" />
        <SliderField label="Fuel burn / lap" value={fuelPerLap} onChange={setFuelPerLap} min={1.0} max={3.5} step={0.05} unit="kg" />

        <div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500">Stint plan</span>
            <span className={"text-[11px] font-mono " + (stintTotal === totalLaps ? "text-emerald-400" : "text-amber-300")}>
              {stintTotal} / {totalLaps} laps
            </span>
          </div>
          <ul className="space-y-2">
            {stints.map((s, i) => (
              <li key={s.id} className="grid grid-cols-[1fr_5rem_2.25rem] items-center gap-2">
                <select
                  value={s.compound}
                  onChange={(e) => setStints((arr) => arr.map((x) => (x.id === s.id ? { ...x, compound: e.target.value as StrategyStint["compound"] } : x)))}
                  className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1.5 text-xs"
                  style={{ borderLeft: `3px solid ${COMPOUND_COLOUR[s.compound]}` }}
                >
                  {COMPOUNDS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <input
                  type="number"
                  min={1}
                  max={80}
                  value={s.laps}
                  onChange={(e) => setStints((arr) => arr.map((x) => (x.id === s.id ? { ...x, laps: Number(e.target.value) } : x)))}
                  className="rounded-md border border-white/10 bg-zinc-900 px-2 py-1.5 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setStints((arr) => arr.length > 1 ? arr.filter((x) => x.id !== s.id) : arr)}
                  className="text-zinc-500 hover:text-red-400 transition text-xs"
                  aria-label={`Remove stint ${i + 1}`}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => stints.length < 4 && setStints((arr) => [...arr, newStint("HARD", 15)])}
            disabled={stints.length >= 4}
            className="mt-3 text-xs text-zinc-400 hover:text-white disabled:opacity-40"
          >
            + Add stint
          </button>
        </div>

        <label className="flex items-center gap-2 text-xs text-zinc-300">
          <input
            type="checkbox"
            checked={optimize}
            onChange={(e) => setOptimize(e.target.checked)}
            className="accent-red-500"
          />
          Solve for optimum 1-stop pit window
        </label>

        {optimize && (
          <div className="grid grid-cols-2 gap-2">
            <label className="text-xs">
              <span className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-1">Start</span>
              <select
                value={startCompound}
                onChange={(e) => setStartCompound(e.target.value as StrategyStint["compound"])}
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-2 py-1.5"
              >
                {COMPOUNDS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
            <label className="text-xs">
              <span className="block text-[11px] uppercase tracking-widest text-zinc-500 mb-1">Second</span>
              <select
                value={secondCompound}
                onChange={(e) => setSecondCompound(e.target.value as StrategyStint["compound"])}
                className="w-full rounded-md border border-white/10 bg-zinc-900 px-2 py-1.5"
              >
                {COMPOUNDS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
        )}

        <button
          type="button"
          onClick={run}
          disabled={loading || stintTotal !== totalLaps}
          className="btn-red-glow w-full rounded-lg px-4 py-2.5 text-sm font-bold disabled:opacity-40"
        >
          {loading ? "Simulating…" : "Run Simulation"}
        </button>
        {stintTotal !== totalLaps && (
          <p className="text-[11px] text-amber-400">Adjust stint lap counts to match the race distance.</p>
        )}
        {error && <p className="text-[11px] text-red-400">{error}</p>}
      </section>

      {/* ── Output ───────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-lg font-bold">Per-lap pace projection</h2>
          {result && (
            <DataExportButton filename="strategy-laps.csv" rows={result.laps} />
          )}
        </div>

        {!result && (
          <div className="grid h-80 place-items-center text-sm text-zinc-500">
            Configure the stint plan and press <span className="ml-1 font-semibold text-zinc-300">Run Simulation</span>.
          </div>
        )}

        {result && (
          <>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <Metric label="Total race time" value={`${(result.total_time_seconds / 60).toFixed(2)} min`} />
              <Metric label="Pit stops" value={String(result.pit_count)} />
              <Metric label="Stints" value={String(result.stint_count)} />
            </div>

            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={result.laps} margin={{ top: 10, right: 24, left: 0, bottom: 8 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                  <XAxis dataKey="lap" tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                  <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} domain={["auto", "auto"]} />
                  <Tooltip
                    contentStyle={{
                      background: "#0a0a0a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                    }}
                  />
                  <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
                  <Line
                    type="monotone"
                    dataKey="lap_time"
                    name="Lap time (s)"
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={false}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {result.optimal_pit_window && (
              <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-500/5 p-4 text-sm">
                <div className="font-semibold text-emerald-300">
                  Optimum 1-stop pit window
                </div>
                <div className="mt-1 text-zinc-300">
                  Pit on lap{" "}
                  <span className="font-mono text-white">{result.optimal_pit_window.best_pit_lap}</span>{" "}
                  for an estimated total race time of{" "}
                  <span className="font-mono text-white">
                    {(result.optimal_pit_window.best_total_time / 60).toFixed(2)} min
                  </span>
                  .
                </div>
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {result.optimal_pit_window.window.map((w) => (
                    <div
                      key={w.pit_lap}
                      className="rounded-md border border-white/10 bg-black/30 px-2 py-1 font-mono text-zinc-300"
                    >
                      L{w.pit_lap} → {(w.total_time / 60).toFixed(2)}m
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// ── Small UI primitives ──────────────────────────────────────────────────────
function SliderField({
  label, value, onChange, min, max, step, unit,
}: {
  label: string; value: number; onChange: (v: number) => void;
  min: number; max: number; step: number; unit: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-1">
        <span className="text-[11px] uppercase tracking-widest text-zinc-500">{label}</span>
        <span className="font-mono text-xs text-zinc-200">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="f1-slider"
        style={{ "--slider-pct": `${pct}%` } as React.CSSProperties}
      />
    </div>
  );
}
function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/40 px-4 py-3">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</div>
      <div className="font-mono text-xl text-white">{value}</div>
    </div>
  );
}
