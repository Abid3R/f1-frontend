import Link from "next/link";
import { fetchCircuits, type CircuitInfo } from "@/lib/api";

export const metadata = {
  title: "Circuit Guides — F1 Intelligence Platform",
  description:
    "Length, turns, DRS zones, lap records, tyre demand and safety-car probability for every venue on the F1 calendar.",
};

export const dynamic = "force-dynamic";

async function loadCircuits(): Promise<CircuitInfo[]> {
  try {
    return await fetchCircuits();
  } catch {
    return [];
  }
}

export default async function CircuitsIndex() {
  const circuits = await loadCircuits();

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10">
        <p className="text-[11px] uppercase tracking-[0.4em] text-red-500/80">Phase 4 · Track Atlas</p>
        <h1 className="mt-2 text-4xl font-black tracking-tight">
          Circuit <span className="text-red-500">Guides</span>
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-zinc-400">
          A dossier on every Grand Prix venue — lap records, tyre demand,
          safety-car probability and 3-day weather, distilled into one screen.
        </p>
      </header>

      {circuits.length === 0 ? (
        <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          Circuit data is offline. Start the FastAPI backend at http://127.0.0.1:8000.
        </p>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {circuits.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/circuits/${c.slug}`}
                className="block rounded-2xl border border-white/10 bg-zinc-950/60 p-5 transition hover:border-red-500/60 hover:bg-zinc-900/70"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{c.name}</h2>
                  <span className="text-[11px] uppercase tracking-widest text-zinc-500">
                    {c.country}
                  </span>
                </div>
                <p className="mt-1 text-xs text-zinc-400">{c.city}</p>

                <dl className="mt-4 grid grid-cols-2 gap-y-2 text-xs">
                  <dt className="text-zinc-500">Length</dt>
                  <dd className="text-right font-mono text-zinc-200">{c.length_km} km</dd>

                  <dt className="text-zinc-500">Turns</dt>
                  <dd className="text-right font-mono text-zinc-200">{c.turns}</dd>

                  <dt className="text-zinc-500">DRS zones</dt>
                  <dd className="text-right font-mono text-zinc-200">{c.drs_zones}</dd>

                  <dt className="text-zinc-500">Laps</dt>
                  <dd className="text-right font-mono text-zinc-200">{c.race_laps}</dd>
                </dl>

                <div className="mt-4 flex flex-wrap gap-2 text-[10px] uppercase tracking-widest">
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-zinc-400">
                    Tyre: {c.tyre_demand}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-zinc-400">
                    SC: {Math.round(c.safety_car_probability * 100)}%
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
