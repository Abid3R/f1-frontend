import type { Metadata } from "next";
import TelemetryWorkbench from "./TelemetryWorkbench";

export const metadata: Metadata = {
  title: "Live Telemetry · F1 Intel",
  description:
    "Side-by-side telemetry comparison for any two F1 drivers on any lap — speed, throttle, brake, RPM and gear traces from OpenF1.",
};

export default function TelemetryPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-400">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
          Live Race Center
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
          Telemetry <span className="text-red-500">Workbench</span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Pull any two drivers and overlay their lap traces — speed, throttle,
          brake, RPM, gear — directly from OpenF1.  Drop in a meeting key from
          the race schedule to switch sessions.
        </p>
      </header>

      <TelemetryWorkbench />
    </main>
  );
}
