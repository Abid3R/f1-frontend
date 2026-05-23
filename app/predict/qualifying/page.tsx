import type { Metadata } from "next";
import QualifyingPredictor from "./QualifyingPredictor";

export const metadata: Metadata = {
  title: "Qualifying Predictor · F1 Intel",
  description:
    "Project the qualifying top-5 from FP1/FP2/FP3 best laps and estimated fuel loads.",
};

export default function QualifyingPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-400">
          Qualifying Engine
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
          Qualifying <span className="text-red-500">Predictor</span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Enter each driver&apos;s best FP1 / FP2 / FP3 laps and a fuel estimate.
          The engine fuel-corrects each run, blends them, and ranks the projected
          top-5 grid.
        </p>
      </header>

      <QualifyingPredictor />
    </main>
  );
}
