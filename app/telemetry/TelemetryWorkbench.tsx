"use client";

import { useCallback, useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchTelemetryCompare, type TelemetryTrace } from "@/lib/api";
import DataExportButton from "@/app/components/DataExportButton";
import LiveGapChart from "@/app/components/LiveGapChart";
import LiveTrackMap from "@/app/components/LiveTrackMap";

type Channel = "speed" | "rpm" | "gear" | "throttle" | "brake";
const CHANNELS: { id: Channel; label: string; unit: string }[] = [
  { id: "speed", label: "Speed", unit: "km/h" },
  { id: "throttle", label: "Throttle", unit: "%" },
  { id: "brake", label: "Brake", unit: "%" },
  { id: "rpm", label: "RPM", unit: "rev/min" },
  { id: "gear", label: "Gear", unit: "" },
];

const TEAM_FALLBACK_A = "#ef4444";
const TEAM_FALLBACK_B = "#38bdf8";

function alignSamples(a: TelemetryTrace, b: TelemetryTrace, channel: Channel) {
  // Build a merged time-axis (elapsed seconds) so recharts has a clean X.
  const map: Record<string, { t: number; a?: number | null; b?: number | null }> = {};
  for (const s of a.samples) {
    const key = s.elapsed.toFixed(2);
    map[key] = { t: s.elapsed, a: s[channel] ?? null };
  }
  for (const s of b.samples) {
    const key = s.elapsed.toFixed(2);
    if (!map[key]) map[key] = { t: s.elapsed };
    map[key].b = s[channel] ?? null;
  }
  return Object.values(map).sort((x, y) => x.t - y.t);
}

export default function TelemetryWorkbench() {
  const [year, setYear] = useState(2025);
  const [meetingKey, setMeetingKey] = useState<string>("");
  const [sessionName, setSessionName] = useState("Race");
  const [driverA, setDriverA] = useState(1);
  const [driverB, setDriverB] = useState(4);
  const [lapA, setLapA] = useState(20);
  const [lapB, setLapB] = useState<string>("");
  const [channel, setChannel] = useState<Channel>("speed");

  const [data, setData] = useState<{ a: TelemetryTrace; b: TelemetryTrace } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onLoad = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetchTelemetryCompare({
        year,
        meetingKey: meetingKey ? Number(meetingKey) : undefined,
        sessionName,
        driverA,
        driverB,
        lapA,
        lapB: lapB ? Number(lapB) : undefined,
      });
      setData({ a: res.driver_a, b: res.driver_b });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Telemetry fetch failed.");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [year, meetingKey, sessionName, driverA, driverB, lapA, lapB]);

  const chartData = useMemo(() => {
    if (!data) return [];
    return alignSamples(data.a, data.b, channel);
  }, [data, channel]);

  const csvRows = useMemo(() => {
    if (!data) return [];
    return chartData.map((row) => ({
      elapsed: row.t,
      driver_a: row.a ?? "",
      driver_b: row.b ?? "",
      channel,
    }));
  }, [chartData, data, channel]);

  return (
    <div className="space-y-8">
      {/* ── Inputs ─────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <NumberField label="Year" value={year} onChange={setYear} min={2018} max={2030} />
          <TextField
            label="Meeting Key (optional)"
            value={meetingKey}
            onChange={setMeetingKey}
            placeholder="e.g. 1229"
          />
          <SelectField
            label="Session"
            value={sessionName}
            onChange={setSessionName}
            options={["Race", "Qualifying", "Sprint", "Practice 3", "Practice 2", "Practice 1"]}
          />
          <SelectField
            label="Channel"
            value={channel}
            onChange={(v) => setChannel(v as Channel)}
            options={CHANNELS.map((c) => c.id)}
          />
          <NumberField label="Driver A #" value={driverA} onChange={setDriverA} min={1} max={99} />
          <NumberField label="Driver B #" value={driverB} onChange={setDriverB} min={1} max={99} />
          <NumberField label="Lap A" value={lapA} onChange={setLapA} min={1} max={120} />
          <TextField
            label="Lap B (optional)"
            value={lapB}
            onChange={setLapB}
            placeholder={`= Lap A (${lapA})`}
          />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onLoad}
            disabled={loading}
            className="btn-red-glow rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-50"
          >
            {loading ? "Loading…" : "Load Telemetry"}
          </button>
          {data && (
            <DataExportButton
              filename={`telemetry-${channel}-${driverA}vs${driverB}.csv`}
              rows={csvRows}
              columns={["elapsed", "driver_a", "driver_b", "channel"]}
            />
          )}
          {error && <span className="text-red-400 text-sm">{error}</span>}
        </div>
      </section>

      {/* ── Chart ──────────────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-bold">
            Trace · <span className="text-red-500">{CHANNELS.find((c) => c.id === channel)?.label}</span>
          </h2>
          {data && (
            <div className="text-xs text-zinc-500">
              Lap {data.a.lap_number} ({data.a.lap_duration?.toFixed(3) ?? "—"}s) vs Lap{" "}
              {data.b.lap_number} ({data.b.lap_duration?.toFixed(3) ?? "—"}s)
            </div>
          )}
        </div>

        <div className="h-[420px] w-full">
          {!data && !loading && (
            <div className="grid h-full place-items-center text-sm text-zinc-500">
              Pick two drivers + a lap, then press <span className="mx-1 font-semibold text-zinc-300">Load Telemetry</span>.
            </div>
          )}
          {loading && (
            <div className="grid h-full place-items-center text-sm text-zinc-500">
              Streaming samples from OpenF1…
            </div>
          )}
          {data && !loading && (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 24, left: 0, bottom: 8 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="t"
                  tick={{ fill: "#a1a1aa", fontSize: 11 }}
                  label={{ value: "Lap time (s)", fill: "#71717a", fontSize: 11, position: "insideBottom", offset: -2 }}
                />
                <YAxis tick={{ fill: "#a1a1aa", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "#0a0a0a",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 8,
                    color: "#fafafa",
                  }}
                />
                <Legend wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="a"
                  name={`#${data.a.driver_number}`}
                  stroke={TEAM_FALLBACK_A}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="b"
                  name={`#${data.b.driver_number}`}
                  stroke={TEAM_FALLBACK_B}
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </section>

      {/* ── Live race center: gap chart + track map ────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveGapChart />
        <LiveTrackMap />
      </section>
    </div>
  );
}

// ── Tiny field helpers ────────────────────────────────────────────────────────
function NumberField({
  label, value, onChange, min, max,
}: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500/60"
      />
    </label>
  );
}
function TextField({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500/60"
      />
    </label>
  );
}
function SelectField({
  label, value, onChange, options,
}: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-zinc-900 px-3 py-2 text-sm text-white outline-none focus:border-red-500/60"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}
