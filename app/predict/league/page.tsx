import PredictionLeague from "./PredictionLeague";

export const metadata = {
  title: "Prediction League — F1 Intelligence Platform",
  description:
    "Pick your podium for the next race. Earn points when the chequered flag falls.",
};

export default function PredictionLeaguePage() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.4em] text-red-500/80">
          Phase 5 · Game On
        </p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Prediction <span className="text-red-500">League</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          Lock in your top-3 before lights out. Score{" "}
          <span className="font-semibold text-zinc-200">10 / 6 / 4</span> for an
          exact match and{" "}
          <span className="font-semibold text-zinc-200">2</span> for any podium
          finisher — leaderboards live on this device.
        </p>
      </header>

      <PredictionLeague />
    </main>
  );
}
