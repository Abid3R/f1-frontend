import type { Metadata } from "next";
import StrategySandbox from "./StrategySandbox";

export const metadata: Metadata = {
  title: "Race Strategy Simulator · F1 Intel",
  description:
    "Simulate tyre degradation, fuel burn, and pit-window optimization across any race length.",
};

export default function StrategyPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-400">
          Strategy Engine
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
          Race Strategy <span className="text-red-500">Simulator</span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Plot a stint plan, watch the lap times degrade under tyre wear and
          fuel burn, and ask the engine for the optimum pit window.
        </p>
      </header>

      <StrategySandbox />
    </main>
  );
}
