import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchCircuit, fetchCircuitWeather } from "@/lib/api";

type Params = Promise<{ slug: string }>;

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  try {
    const c = await fetchCircuit(slug);
    return {
      title: `${c.name} — Circuit Guide`,
      description: c.notes,
    };
  } catch {
    return { title: "Unknown circuit" };
  }
}

export default async function CircuitDetailPage({ params }: { params: Params }) {
  const { slug } = await params;

  let circuit;
  try {
    circuit = await fetchCircuit(slug);
  } catch {
    notFound();
  }

  let weather: Awaited<ReturnType<typeof fetchCircuitWeather>> | null = null;
  try {
    weather = await fetchCircuitWeather(slug);
  } catch {
    weather = null;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Link href="/circuits" className="text-xs uppercase tracking-widest text-zinc-500 hover:text-white">
        ← All circuits
      </Link>

      <header className="mt-4">
        <p className="text-[11px] uppercase tracking-[0.4em] text-red-500/80">{circuit.country}</p>
        <h1 className="mt-1 text-4xl font-black tracking-tight">{circuit.name}</h1>
        <p className="mt-2 text-sm text-zinc-400">{circuit.city}</p>
      </header>

      <section className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* ── Key Stats ─────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
            Track <span className="text-red-500">Dossier</span>
          </h2>
          <dl className="mt-5 grid grid-cols-2 gap-y-3 text-sm md:grid-cols-3">
            <Stat label="Length" value={`${circuit.length_km} km`} />
            <Stat label="Turns" value={String(circuit.turns)} />
            <Stat label="DRS zones" value={String(circuit.drs_zones)} />
            <Stat label="Race laps" value={String(circuit.race_laps)} />
            <Stat label="Race distance" value={`${circuit.race_distance_km} km`} />
            <Stat label="Lap record" value={circuit.lap_record} />
            <Stat label="Tyre demand" value={circuit.tyre_demand} />
            <Stat label="Safety-car prob." value={`${Math.round(circuit.safety_car_probability * 100)}%`} />
            <Stat label="Coords" value={`${circuit.lat.toFixed(2)}, ${circuit.lon.toFixed(2)}`} />
          </dl>
          <p className="mt-6 text-sm leading-relaxed text-zinc-300">{circuit.notes}</p>
        </div>

        {/* ── Weather Forecast ──────────────────────────────────────────── */}
        <div className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
            3-Day <span className="text-red-500">Forecast</span>
          </h2>
          {!weather && (
            <p className="mt-4 text-xs text-zinc-500">
              Live weather feed unavailable. Check that the FastAPI backend can reach Open-Meteo.
            </p>
          )}
          {weather && (
            <>
              {weather.forecast.current && (
                <div className="mt-4 rounded-xl border border-white/10 bg-black/40 px-4 py-3">
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Current at venue
                  </p>
                  <p className="mt-1 font-mono text-xl">
                    {Math.round(weather.forecast.current.temperature ?? 0)}°C
                  </p>
                  <p className="text-[11px] text-zinc-400">
                    Wind {Math.round(weather.forecast.current.wind_speed ?? 0)} km/h
                  </p>
                </div>
              )}
              <ul className="mt-4 space-y-2">
                {weather.forecast.days.map((d) => (
                  <li
                    key={d.date}
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-xs"
                  >
                    <span className="font-mono text-zinc-400">{d.date}</span>
                    <span className="text-zinc-200">
                      {Math.round(d.t_min ?? 0)}° / {Math.round(d.t_max ?? 0)}°
                    </span>
                    <span className="text-zinc-400">
                      {Math.round(d.precipitation_sum ?? 0)} mm · {Math.round(d.wind_speed_max ?? 0)} km/h
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</dt>
      <dd className="mt-0.5 font-mono text-zinc-100">{value}</dd>
    </div>
  );
}
