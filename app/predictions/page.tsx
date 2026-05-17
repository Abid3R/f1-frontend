"use client";

import { useState, useEffect, useRef } from "react";
import { fetchPitStopDemoPrediction } from "@/lib/api";
import {
  Cpu,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Loader2,
  Gauge,
  Activity,
  TrendingUp,
  RotateCcw,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface FormState {
  driver: string;
  race: string;
  compound: string;
  lap_number: number;
  tyre_life: number;
  position: number;
  lap_time_delta: number;
  cumulative_degradation: number;
  race_progress: number;
  position_change: number;
}

interface PredictionResult {
  driver: string;
  will_pit: boolean;
  percentage: number;
  compound: string;
  reason: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function probabilityColor(pct: number): string {
  if (pct >= 65) return "#dc2626";
  if (pct >= 35) return "#f59e0b";
  return "#22c55e";
}

function probabilityLabel(pct: number): { text: string; color: string } {
  if (pct >= 65) return { text: "HIGH", color: "text-red-400" };
  if (pct >= 35) return { text: "MEDIUM", color: "text-amber-400" };
  return { text: "LOW", color: "text-green-400" };
}

// ── Animated probability bar ─────────────────────────────────────────────────
function ProbabilityBar({ percentage }: { percentage: number }) {
  const [width, setWidth] = useState(0);
  const color = probabilityColor(percentage);

  useEffect(() => {
    const t = setTimeout(() => setWidth(percentage), 80);
    return () => clearTimeout(t);
  }, [percentage]);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
          Probability
        </p>
        <span className="text-2xl font-black" style={{ color }}>
          {percentage}%
        </span>
      </div>
      <div className="probability-bar-track">
        <div
          className="probability-bar"
          style={{
            width: `${width}%`,
            background: `linear-gradient(90deg, ${color}aa, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

// ── Field label wrapper ───────────────────────────────────────────────────────
function FieldLabel({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-neutral-300">{label}</span>
        {hint && <span className="text-[11px] text-neutral-600">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

const defaultForm: FormState = {
  driver: "Max Verstappen",
  race: "Japanese Grand Prix",
  compound: "MEDIUM",
  lap_number: 25,
  tyre_life: 15,
  position: 2,
  lap_time_delta: 1.1,
  cumulative_degradation: 3.4,
  race_progress: 0.55,
  position_change: -1,
};

const numFields: Array<[keyof FormState, string, string, string]> = [
  ["lap_number", "Lap Number", "1 – 70", "1"],
  ["tyre_life", "Tyre Life (laps)", "laps on set", "1"],
  ["position", "Race Position", "1 = lead", "1"],
  ["lap_time_delta", "Lap Time Delta (s)", "+/- baseline", "0.1"],
  ["cumulative_degradation", "Cumulative Degradation", "total drop", "0.1"],
  ["race_progress", "Race Progress", "0.0 – 1.0", "0.01"],
  ["position_change", "Position Change", "vs lap 1", "1"],
];

// ─────────────────────────────────────────────────────────────────────────────

export default function PredictionsPage() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const resultRef = useRef<HTMLDivElement>(null);

  function updateField(field: string, value: string) {
    setForm((previous) => ({
      ...previous,
      [field]:
        field === "driver" || field === "race" || field === "compound"
          ? value
          : Number(value),
    }));
  }

  async function handlePredict() {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await fetchPitStopDemoPrediction(form);
      setResult(data);

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Prediction failed. Make sure the backend server is running at http://127.0.0.1:8000."
      );
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(defaultForm);
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative px-6 py-24 overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-red-950/20" />

        {/* 3D animation video */}
        <video
          src="/videos/predictions-3d.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.22),transparent_55%)]" />

        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "38%" }} />
          <div className="track-line track-line-2" style={{ top: "62%" }} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="animate-fade-left">
            <p className="text-red-500 font-bold uppercase tracking-[0.25em] text-sm mb-4">
              Strategy Predictor
            </p>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-5">
              Pit Stop{" "}
              <span className="text-red-600">Prediction</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Enter the current race situation. The demo ML model on your
              FastAPI backend estimates whether the driver will pit on the next
              lap.
            </p>

            <div className="flex items-center gap-5 mt-6 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-dot-pulse" />
                <span className="text-red-400 text-xs font-bold uppercase tracking-wider">
                  FastAPI Backend
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">
                  Demo ML Model
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          PREDICTION SECTION
          ================================================================ */}
      <section className="px-6 py-10 pb-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ── INPUT FORM ───────────────────────────────────────────────── */}
          <div className="professional-card rounded-2xl p-6 animate-fade-left delay-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-900/40 flex items-center justify-center">
                  <Gauge size={18} className="text-red-400" />
                </div>
                <div>
                  <h2 className="text-lg font-black">Race Situation</h2>
                  <p className="text-xs text-neutral-600">
                    Configure the prediction inputs
                  </p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-red-400 transition-colors border border-neutral-800 hover:border-red-800 px-3 py-1.5 rounded-lg"
              >
                <RotateCcw size={11} />
                Reset
              </button>
            </div>

            <div className="grid gap-4">
              <FieldLabel label="Driver" hint="Full name">
                <input
                  className="f1-input"
                  value={form.driver}
                  onChange={(e) => updateField("driver", e.target.value)}
                  placeholder="Driver name"
                />
              </FieldLabel>

              <FieldLabel label="Race" hint="Grand Prix name">
                <input
                  className="f1-input"
                  value={form.race}
                  onChange={(e) => updateField("race", e.target.value)}
                  placeholder="Grand Prix name"
                />
              </FieldLabel>

              <FieldLabel label="Tyre Compound">
                <div className="relative">
                  <select
                    className="f1-input appearance-none pr-10 cursor-pointer"
                    value={form.compound}
                    onChange={(e) => updateField("compound", e.target.value)}
                  >
                    {["SOFT", "MEDIUM", "HARD", "INTERMEDIATE", "WET"].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
                  />
                </div>
              </FieldLabel>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {numFields.map(([field, label, hint, step]) => (
                  <FieldLabel key={field} label={label} hint={hint}>
                    <input
                      type="number"
                      step={step}
                      className="f1-input"
                      value={(form as unknown as Record<string, number>)[field]}
                      onChange={(e) => updateField(field, e.target.value)}
                    />
                  </FieldLabel>
                ))}
              </div>

              <button
                onClick={handlePredict}
                disabled={loading}
                className="btn-red-glow flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-white mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Analysing race data…
                  </>
                ) : (
                  <>
                    <Cpu size={18} />
                    Predict Pit Stop
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── RESULT PANEL ─────────────────────────────────────────────── */}
          <div
            ref={resultRef}
            className="professional-card rounded-2xl p-6 animate-fade-right delay-100 flex flex-col"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-900/40 flex items-center justify-center">
                <Activity size={18} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-lg font-black">Prediction Result</h2>
                <p className="text-xs text-neutral-600">
                  ML model output via FastAPI
                </p>
              </div>
            </div>

            {/* Empty state */}
            {!result && !error && !loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mb-4">
                  <TrendingUp size={28} className="text-neutral-700" />
                </div>
                <p className="text-neutral-500 font-semibold mb-2">
                  Awaiting Prediction
                </p>
                <p className="text-neutral-700 text-sm max-w-xs">
                  Configure the race situation and click{" "}
                  <span className="text-neutral-500">Predict Pit Stop</span>.
                </p>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <Loader2 size={36} className="text-red-500 animate-spin mb-4" />
                <p className="text-neutral-400 font-semibold">
                  Running prediction model…
                </p>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="rounded-xl bg-red-950/30 border border-red-900/50 p-5 flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="text-red-400 shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-red-300 font-bold text-sm mb-1">
                    Prediction Failed
                  </p>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div className="space-y-4 animate-reveal-card">
                {/* Driver info */}
                <div className="rounded-xl bg-neutral-900/70 border border-neutral-800/60 p-4">
                  <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-1">
                    Driver
                  </p>
                  <p className="text-xl font-black text-white">
                    {result.driver}
                  </p>
                  <p className="text-xs text-neutral-500 mt-1">
                    Compound:{" "}
                    <span className="text-neutral-300 font-semibold">
                      {result.compound}
                    </span>
                  </p>
                </div>

                {/* Will pit verdict */}
                <div
                  className={`rounded-xl p-5 border flex items-center gap-4 ${
                    result.will_pit
                      ? "bg-red-950/30 border-red-800/40"
                      : "bg-green-950/20 border-green-900/30"
                  }`}
                >
                  {result.will_pit ? (
                    <CheckCircle2
                      size={32}
                      className="text-red-400 shrink-0"
                    />
                  ) : (
                    <XCircle size={32} className="text-green-400 shrink-0" />
                  )}
                  <div>
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-0.5">
                      Will Pit Next Lap?
                    </p>
                    <p
                      className={`text-4xl font-black ${result.will_pit ? "text-red-400" : "text-green-400"}`}
                    >
                      {result.will_pit ? "YES" : "NO"}
                    </p>
                  </div>
                  <div className="ml-auto">
                    {(() => {
                      const lbl = probabilityLabel(result.percentage);
                      return (
                        <span
                          className={`text-xs font-black uppercase tracking-widest ${lbl.color}`}
                        >
                          {lbl.text}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {/* Probability bar */}
                <div className="rounded-xl bg-neutral-900/70 border border-neutral-800/60 p-4">
                  <ProbabilityBar percentage={result.percentage} />
                </div>

                {/* Reasons */}
                {result.reason && result.reason.length > 0 && (
                  <div className="rounded-xl bg-neutral-900/70 border border-neutral-800/60 p-4">
                    <p className="text-[10px] text-neutral-600 uppercase tracking-widest mb-3">
                      Analysis
                    </p>
                    <ul className="space-y-2">
                      {result.reason.map((item, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-neutral-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Re-predict hint */}
                <button
                  onClick={handlePredict}
                  className="w-full text-xs text-neutral-600 hover:text-red-400 transition-colors py-2 border border-neutral-800/50 hover:border-red-800/50 rounded-xl"
                >
                  Run another prediction →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── Info banner ──────────────────────────────────────────────────── */}
        <div className="mt-8 rounded-2xl glass-card hud-border p-5 animate-fade-up delay-300">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-9 h-9 rounded-xl bg-red-950/50 border border-red-900/40 flex items-center justify-center shrink-0">
              <Cpu size={18} className="text-red-400" />
            </div>
            <div>
              <p className="font-bold text-neutral-300 text-sm mb-1">
                About This Demo Model
              </p>
              <p className="text-neutral-500 text-xs leading-relaxed max-w-2xl">
                This prediction is powered by a demo ML model served via your
                FastAPI backend at{" "}
                <code className="text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded text-[11px]">
                  POST /api/predict/pitstop-demo
                </code>
                . Uses tyre life, lap time delta, race progress and position
                change to estimate pit stop likelihood. Not a real F1 strategy
                tool.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
