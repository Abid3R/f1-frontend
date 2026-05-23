"use client";

import { useCallback, useState } from "react";
import { predictQualifying, type QualifyingSample } from "@/lib/api";

interface Row extends QualifyingSample {
  id: string;
}
function newRow(seed: Partial<QualifyingSample> = {}): Row {
  return {
    id: Math.random().toString(36).slice(2, 8),
    driver_number: seed.driver_number ?? 1,
    name: seed.name ?? "",
    team_colour: seed.team_colour ?? "",
    fp1_best: seed.fp1_best ?? 90,
    fp2_best: seed.fp2_best ?? 89.5,
    fp3_best: seed.fp3_best ?? 89.2,
    fuel_kg: seed.fuel_kg ?? 10,
    long_run_avg: seed.long_run_avg ?? 90.8,
  };
}

const SEED: Row[] = [
  newRow({ driver_number: 1, name: "Max Verstappen", team_colour: "1E40AF", fp3_best: 88.95, fuel_kg: 8 }),
  newRow({ driver_number: 4, name: "Lando Norris", team_colour: "F97316", fp3_best: 88.81, fuel_kg: 8 }),
  newRow({ driver_number: 16, name: "Charles Leclerc", team_colour: "DC2626", fp3_best: 89.12, fuel_kg: 8 }),
  newRow({ driver_number: 81, name: "Oscar Piastri", team_colour: "FB923C", fp3_best: 89.04, fuel_kg: 8 }),
  newRow({ driver_number: 63, name: "George Russell", team_colour: "06B6D4", fp3_best: 89.31, fuel_kg: 9 }),
];

export default function QualifyingPredictor() {
  const [rows, setRows] = useState<Row[]>(SEED);
  const [result, setResult] = useState<Awaited<ReturnType<typeof predictQualifying>> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const payload = rows.map(({ id: _id, ...r }) => r);
      const out = await predictQualifying(payload);
      setResult(out);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Qualifying prediction failed.");
      setResult(null);
    } finally {
      setLoading(false);
    }
  }, [rows]);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
      {/* ── Editor ───────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6 overflow-x-auto">
        <table className="w-full text-xs min-w-[700px]">
          <thead className="text-[10px] uppercase tracking-widest text-zinc-500">
            <tr>
              <th className="text-left py-2 pr-2">#</th>
              <th className="text-left pr-2">Driver</th>
              <th className="text-right pr-2">FP1</th>
              <th className="text-right pr-2">FP2</th>
              <th className="text-right pr-2">FP3</th>
              <th className="text-right pr-2">Fuel (kg)</th>
              <th className="text-right pr-2">Long-run</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-white/5">
                <td className="py-2 pr-2 font-mono">
                  <input
                    type="number"
                    value={r.driver_number}
                    min={1}
                    max={99}
                    onChange={(e) => upd(setRows, r.id, { driver_number: Number(e.target.value) })}
                    className="w-12 bg-transparent text-right text-zinc-200 outline-none"
                  />
                </td>
                <td className="pr-2">
                  <input
                    type="text"
                    value={r.name}
                    onChange={(e) => upd(setRows, r.id, { name: e.target.value })}
                    className="w-32 bg-transparent text-zinc-200 outline-none"
                  />
                </td>
                <Cell value={r.fp1_best ?? 0} onChange={(v) => upd(setRows, r.id, { fp1_best: v })} />
                <Cell value={r.fp2_best ?? 0} onChange={(v) => upd(setRows, r.id, { fp2_best: v })} />
                <Cell value={r.fp3_best ?? 0} onChange={(v) => upd(setRows, r.id, { fp3_best: v })} />
                <Cell value={r.fuel_kg ?? 0} onChange={(v) => upd(setRows, r.id, { fuel_kg: v })} />
                <Cell value={r.long_run_avg ?? 0} onChange={(v) => upd(setRows, r.id, { long_run_avg: v })} />
                <td>
                  <button
                    type="button"
                    onClick={() => setRows((arr) => arr.filter((x) => x.id !== r.id))}
                    className="text-zinc-500 hover:text-red-400"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setRows((arr) => [...arr, newRow()])}
            disabled={rows.length >= 20}
            className="text-xs text-zinc-400 hover:text-white"
          >
            + Add driver
          </button>
          <button
            type="button"
            onClick={run}
            disabled={loading || rows.length < 2}
            className="btn-red-glow rounded-lg px-4 py-2 text-sm font-bold disabled:opacity-40"
          >
            {loading ? "Predicting…" : "Predict Top 5"}
          </button>
        </div>
        {error && <p className="text-[11px] text-red-400 mt-2">{error}</p>}
      </section>

      {/* ── Result ───────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
        <h2 className="text-lg font-bold mb-3">
          Projected <span className="text-red-500">Top 5</span>
        </h2>
        {!result && <div className="text-sm text-zinc-500">Press <span className="font-semibold text-zinc-300">Predict</span> to run.</div>}
        {result && (
          <ol className="space-y-2">
            {result.top_5.map((r) => (
              <li
                key={r.driver_number}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2"
              >
                <span className="font-mono text-lg w-6 text-zinc-300">{r.position}</span>
                <span
                  className="inline-block h-3 w-3 rounded-full"
                  style={{
                    background: r.team_colour ? `#${r.team_colour}` : "#ef4444",
                    boxShadow: `0 0 8px ${r.team_colour ? `#${r.team_colour}` : "#ef4444"}55`,
                  }}
                />
                <span className="flex-1 text-sm text-zinc-200">{r.name}</span>
                <span className="font-mono text-xs text-zinc-400">{r.predicted_time.toFixed(2)}s</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

function Cell({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <td className="pr-2 text-right">
      <input
        type="number"
        step="0.01"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-20 bg-transparent text-right font-mono text-zinc-200 outline-none"
      />
    </td>
  );
}
function upd(setRows: React.Dispatch<React.SetStateAction<Row[]>>, id: string, patch: Partial<Row>) {
  setRows((arr) => arr.map((r) => (r.id === id ? { ...r, ...patch } : r)));
}
