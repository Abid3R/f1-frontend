// ─────────────────────────────────────────────────────────────────────────────
// F1 INSIGHTS HUB
// Pulls live data from multiple free public APIs (no API keys required):
//   • Jolpica/Ergast      — constructor standings, circuits, last race results
//   • REST Countries v3.1 — country flag images keyed by ISO/CCA names
//   • Wikipedia REST API  — short summary about Formula One (educational facts)
// All fetches are server-side with Next.js cache so the page is fast & quota-safe.
// ─────────────────────────────────────────────────────────────────────────────

import {
  Award,
  Globe2,
  Flag as FlagIcon,
  MapPin,
  Trophy,
  Calendar,
  ExternalLink,
  Sparkles,
  AlertCircle,
} from "lucide-react";

const SEASON = 2026;

// ── Types from the public APIs ───────────────────────────────────────────────
interface ConstructorStanding {
  position: string;
  points: string;
  wins: string;
  Constructor: { constructorId: string; name: string; nationality: string };
}

interface Circuit {
  circuitId: string;
  circuitName: string;
  url: string;
  Location: { locality: string; country: string; lat?: string; long?: string };
}

interface LastRaceResult {
  raceName: string;
  round: string;
  season: string;
  date: string;
  Circuit: { circuitName: string; Location: { locality: string; country: string } };
  Results: Array<{
    position: string;
    points: string;
    Driver: { givenName: string; familyName: string; code?: string };
    Constructor: { name: string };
    Time?: { time: string };
    status: string;
  }>;
}

interface WikiSummary {
  title: string;
  extract: string;
  content_urls?: { desktop?: { page?: string } };
}

// ── Data fetchers (cached for 1 hour) ────────────────────────────────────────
async function fetchConstructorStandings(): Promise<ConstructorStanding[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${SEASON}/constructorstandings.json`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return (
      data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings ??
      []
    );
  } catch {
    return [];
  }
}

async function fetchCircuits(): Promise<Circuit[]> {
  try {
    const res = await fetch(
      `https://api.jolpi.ca/ergast/f1/${SEASON}/circuits.json`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data?.MRData?.CircuitTable?.Circuits ?? [];
  } catch {
    return [];
  }
}

async function fetchLastRace(): Promise<LastRaceResult | null> {
  try {
    const res = await fetch(
      "https://api.jolpi.ca/ergast/f1/current/last/results.json",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races?.[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchCountryFlags(
  countries: string[]
): Promise<Record<string, string>> {
  // REST Countries doesn't take batch lookups, but it accepts the `all` endpoint
  // and individual /name/{name}. Using /name with deduped country list.
  const unique = Array.from(new Set(countries.filter(Boolean)));
  const flags: Record<string, string> = {};

  await Promise.all(
    unique.map(async (country) => {
      try {
        const res = await fetch(
          `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fields=name,flags`,
          { next: { revalidate: 86400 } } // 1-day cache; flags rarely change
        );
        if (!res.ok) return;
        const arr = await res.json();
        const flag = arr?.[0]?.flags?.png ?? arr?.[0]?.flags?.svg;
        if (flag) flags[country] = flag;
      } catch {
        /* swallow — fallback handled in UI */
      }
    })
  );

  return flags;
}

async function fetchF1WikiFact(): Promise<WikiSummary | null> {
  try {
    const res = await fetch(
      "https://en.wikipedia.org/api/rest_v1/page/summary/Formula_One",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// ── Team accent colors (mirrors DriversGrid palette) ─────────────────────────
function teamAccent(name: string): string {
  const t = name.toLowerCase();
  if (t.includes("red bull"))    return "#3671C6";
  if (t.includes("mercedes"))    return "#27F4D2";
  if (t.includes("ferrari"))     return "#E8002D";
  if (t.includes("mclaren"))     return "#FF8000";
  if (t.includes("aston"))       return "#358C75";
  if (t.includes("alpine"))      return "#FF87BC";
  if (t.includes("williams"))    return "#64C4FF";
  if (t.includes("haas"))        return "#E8002D";
  if (t.includes("rb") || t.includes("racing bulls") || t.includes("alphatauri"))
    return "#6692FF";
  if (t.includes("sauber") || t.includes("kick") || t.includes("alfa"))
    return "#52E252";
  return "#E10600";
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default async function InsightsPage() {
  const [constructors, circuits, lastRace, wikiFact] = await Promise.all([
    fetchConstructorStandings(),
    fetchCircuits(),
    fetchLastRace(),
    fetchF1WikiFact(),
  ]);

  // Collect all unique countries from circuits to hydrate flag images.
  const allCountries = [
    ...circuits.map((c) => c.Location.country),
    ...(lastRace ? [lastRace.Circuit.Location.country] : []),
  ];
  const flagMap = await fetchCountryFlags(allCountries);

  const leaderPoints = Number(constructors[0]?.points ?? 0);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative px-6 py-24 overflow-hidden min-h-[44vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-red-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.22),transparent_55%)]" />
        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "38%" }} />
          <div className="track-line track-line-3" style={{ top: "62%" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="animate-fade-left">
            <p className="text-red-500 font-bold uppercase tracking-[0.25em] text-sm mb-4 flex items-center gap-2">
              <Sparkles size={14} />
              F1 Intelligence Hub
            </p>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-5">
              Live <span className="text-red-600">Insights</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Aggregated live from the open Jolpica/Ergast F1 archive, REST
              Countries flag service, and Wikipedia&apos;s public knowledge base.
              No API keys, no paywalls — just open data.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-5 text-[11px] font-bold uppercase tracking-widest">
              <SourceChip label="Jolpica" />
              <SourceChip label="REST Countries" />
              <SourceChip label="Wikipedia" />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── CONSTRUCTOR STANDINGS ──────────────────── */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <SectionHeader
          icon={Trophy}
          eyebrow="Constructor Championship"
          title="2026 Constructors Standings"
          source="Jolpica F1 API"
        />

        {constructors.length === 0 ? (
          <EmptyState message="Constructor standings are not yet available for this season." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {constructors.map((row) => {
              const accent = teamAccent(row.Constructor.name);
              const points = Number(row.points) || 0;
              const wins = Number(row.wins) || 0;
              const pos = Number(row.position) || 0;
              const barWidth = `${Math.min(100, (points / Math.max(1, leaderPoints)) * 100)}%`;

              return (
                <div
                  key={row.Constructor.constructorId}
                  className="professional-card rounded-2xl p-5 border border-neutral-800/60 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{
                      background: `linear-gradient(90deg, ${accent}, ${accent}55, transparent)`,
                    }}
                  />

                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className="text-[10px] font-black uppercase tracking-[0.22em] leading-none mb-1"
                        style={{ color: accent }}
                      >
                        {row.Constructor.nationality}
                      </p>
                      <h3 className="text-lg font-black text-white leading-tight truncate">
                        {row.Constructor.name}
                      </h3>
                    </div>
                    <div
                      className="shrink-0 rounded-lg px-2.5 py-1 text-xs font-black"
                      style={{
                        color: accent,
                        background: `${accent}1c`,
                        border: `1px solid ${accent}55`,
                      }}
                    >
                      P{pos || "—"}
                    </div>
                  </div>

                  {/* Bar */}
                  <div className="mt-4 h-1.5 rounded-full bg-neutral-900 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: barWidth,
                        background: `linear-gradient(90deg, ${accent}88, ${accent})`,
                      }}
                    />
                  </div>

                  {/* Stats */}
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <div>
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                        Points
                      </p>
                      <p
                        className="text-xl font-black leading-none mt-0.5"
                        style={{ color: accent }}
                      >
                        {points}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-semibold">
                        Wins
                      </p>
                      <p className="text-xl font-black text-white leading-none mt-0.5">
                        {wins}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ──────────────────── LAST RACE ──────────────────── */}
      {lastRace && (
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <SectionHeader
            icon={Award}
            eyebrow="Last Race"
            title={lastRace.raceName}
            source="Jolpica F1 API"
          />

          <div className="mt-6 glass-card rounded-2xl border border-red-900/30 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/60">
              <div className="flex items-center gap-3 text-sm text-neutral-300 min-w-0">
                {flagMap[lastRace.Circuit.Location.country] && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={flagMap[lastRace.Circuit.Location.country]}
                    alt={lastRace.Circuit.Location.country}
                    className="w-8 h-5 object-cover rounded border border-neutral-800 shrink-0"
                  />
                )}
                <span className="truncate">
                  <span className="font-bold text-white">
                    {lastRace.Circuit.circuitName}
                  </span>{" "}
                  · {lastRace.Circuit.Location.locality},{" "}
                  {lastRace.Circuit.Location.country}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-semibold">
                <Calendar size={12} />
                Round {lastRace.round} · {lastRace.date}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-0">
              {lastRace.Results.slice(0, 3).map((r, idx) => {
                const podiumStyle = [
                  { label: "Winner",  color: "text-yellow-400", border: "border-yellow-500/40" },
                  { label: "2nd",     color: "text-neutral-200", border: "border-neutral-400/30" },
                  { label: "3rd",     color: "text-amber-400",   border: "border-amber-700/40" },
                ][idx];

                return (
                  <div
                    key={r.position}
                    className={`p-5 border-t sm:border-t-0 sm:border-l first:sm:border-l-0 ${podiumStyle.border}`}
                  >
                    <p className={`text-[10px] font-black uppercase tracking-widest ${podiumStyle.color} mb-2`}>
                      {podiumStyle.label}
                    </p>
                    <p className="text-white font-black text-lg leading-tight">
                      {r.Driver.givenName} {r.Driver.familyName}
                    </p>
                    <p className="text-[11px] text-neutral-500 font-semibold uppercase tracking-widest mt-1">
                      {r.Constructor.name}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-neutral-400">
                        {r.Time?.time ?? r.status}
                      </span>
                      <span className={`font-black ${podiumStyle.color}`}>
                        +{r.points} pts
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ──────────────────── CIRCUITS GALLERY ──────────────────── */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <SectionHeader
          icon={Globe2}
          eyebrow="World Tour"
          title={`Circuits of the ${SEASON} Season`}
          source="Jolpica F1 + REST Countries"
        />

        {circuits.length === 0 ? (
          <EmptyState message="Circuit data is currently unavailable." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {circuits.map((c) => {
              const flag = flagMap[c.Location.country];
              return (
                <a
                  key={c.circuitId}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="professional-card rounded-xl p-4 border border-neutral-800/60 group hover:border-red-700/40 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {flag ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={flag}
                        alt={c.Location.country}
                        className="w-10 h-6 object-cover rounded border border-neutral-800 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-6 rounded border border-neutral-800 bg-neutral-900 flex items-center justify-center shrink-0">
                        <FlagIcon size={10} className="text-neutral-600" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-bold text-sm leading-tight truncate group-hover:text-red-300 transition-colors">
                        {c.circuitName}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-[11px] text-neutral-500">
                        <MapPin size={10} />
                        <span className="truncate">
                          {c.Location.locality}, {c.Location.country}
                        </span>
                      </div>
                    </div>
                    <ExternalLink
                      size={13}
                      className="text-neutral-700 group-hover:text-red-400 transition-colors shrink-0"
                    />
                  </div>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* ──────────────────── WIKIPEDIA SPOTLIGHT ──────────────────── */}
      {wikiFact && (
        <section className="px-6 py-12 pb-24 max-w-7xl mx-auto">
          <SectionHeader
            icon={Sparkles}
            eyebrow="From The Archives"
            title="About Formula One"
            source="Wikipedia"
          />

          <article className="mt-6 glass-card rounded-2xl border border-neutral-800/60 p-6 md:p-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />
            <p className="text-neutral-300 leading-relaxed text-[15px] md:text-base">
              {wikiFact.extract}
            </p>
            {wikiFact.content_urls?.desktop?.page && (
              <a
                href={wikiFact.content_urls.desktop.page}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 mt-4 transition-colors"
              >
                Read on Wikipedia <ExternalLink size={12} />
              </a>
            )}
          </article>
        </section>
      )}
    </main>
  );
}

// ── Small presentational helpers ─────────────────────────────────────────────
function SourceChip({ label }: { label: string }) {
  return (
    <span className="px-2.5 py-1 rounded-full bg-neutral-900/70 border border-neutral-800 text-neutral-300">
      {label}
    </span>
  );
}

function SectionHeader({
  icon: Icon,
  eyebrow,
  title,
  source,
}: {
  icon: typeof Trophy;
  eyebrow: string;
  title: string;
  source: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <p className="text-red-500 font-bold uppercase tracking-[0.22em] text-[10px] mb-1 flex items-center gap-1.5">
          <Icon size={12} />
          {eyebrow}
        </p>
        <h2 className="text-2xl md:text-3xl font-black text-white leading-tight">
          {title}
        </h2>
      </div>
      <span className="text-[10px] text-neutral-600 font-bold uppercase tracking-widest">
        Source · {source}
      </span>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="mt-6 flex items-start gap-3 p-5 rounded-xl border border-neutral-800/60 bg-neutral-950/60">
      <AlertCircle size={18} className="text-neutral-500 mt-0.5 shrink-0" />
      <p className="text-sm text-neutral-400">{message}</p>
    </div>
  );
}
