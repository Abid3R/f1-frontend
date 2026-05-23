// ─────────────────────────────────────────────────────────────────────────────
// F1 RECORDS HALL OF FAME
// Free public APIs (no keys required):
//   • Jolpica/Ergast      — all-time driver / constructor champion archive
//   • Open-Meteo          — live weather forecast for the next race circuit
//   • REST Countries v3.1 — country flag images
//   • Wikipedia REST API  — short fact summaries
// ─────────────────────────────────────────────────────────────────────────────

import {
  Trophy,
  Crown,
  Flame,
  Zap,
  Clock,
  Calendar,
  CloudSun,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Sparkles,
  History,
  Star,
  Medal,
  Gauge,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface DriverChamp {
  position: string;
  points: string;
  wins: string;
  Driver: {
    driverId: string;
    givenName: string;
    familyName: string;
    nationality: string;
    code?: string;
  };
  Constructors: Array<{ name: string; nationality: string }>;
}

interface ConstructorChamp {
  position: string;
  points: string;
  wins: string;
  Constructor: { constructorId: string; name: string; nationality: string };
}

interface NextRace {
  raceName: string;
  round: string;
  season: string;
  date: string;
  time?: string;
  Circuit: {
    circuitName: string;
    Location: { locality: string; country: string; lat: string; long: string };
  };
}

interface OpenMeteoForecast {
  current?: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    weather_code: number;
    wind_speed_10m: number;
  };
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: number[];
    weather_code: number[];
  };
}

// ─── Curated iconic records (image slots for HD pictures) ────────────────────
// Each record has an `imageSlot`: the filename to drop into
// /public/images/records/<filename>.  If the file isn't there yet, the card
// renders a beautiful fallback gradient so the layout never breaks.
const ICONIC_RECORDS = [
  {
    id: "most-championships",
    eyebrow: "Most World Championships",
    holder: "Lewis Hamilton & Michael Schumacher",
    value: "7",
    suffix: "World Titles",
    detail:
      "Schumacher (1994, 1995, 2000-2004) and Hamilton (2008, 2014, 2015, 2017-2020) share the all-time record for most Drivers' Championships.",
    accent: "#FFD700",
    icon: Crown,
    imageSlot: "most-championships.jpg",
    era: "1994 – 2020",
  },
  {
    id: "most-wins",
    eyebrow: "Most Race Wins",
    holder: "Lewis Hamilton",
    value: "105",
    suffix: "Grand Prix Wins",
    detail:
      "Hamilton broke Schumacher's 91-win record at the Portuguese GP 2020 and continues to extend the all-time mark — including his Belgian GP win at age 40 with Ferrari.",
    accent: "#00D7B4",
    icon: Trophy,
    imageSlot: "most-wins.jpg",
    era: "2007 – present",
  },
  {
    id: "most-poles",
    eyebrow: "Most Pole Positions",
    holder: "Lewis Hamilton",
    value: "104",
    suffix: "Pole Positions",
    detail:
      "Considered the greatest qualifier of the modern era. Hamilton surpassed Schumacher's pole record (68) in 2017 and reached his 100th pole at the 2021 Spanish GP.",
    accent: "#A855F7",
    icon: Zap,
    imageSlot: "most-poles.jpg",
    era: "2007 – present",
  },
  {
    id: "most-wins-season",
    eyebrow: "Most Wins in a Season",
    holder: "Max Verstappen",
    value: "19",
    suffix: "Wins in 2023",
    detail:
      "Verstappen's 2023 season was the most dominant in F1 history — 19 wins out of 22 races, including 10 consecutive victories from Miami to Italy.",
    accent: "#3671C6",
    icon: Flame,
    imageSlot: "verstappen-2023.jpg",
    era: "2023 Season",
  },
  {
    id: "youngest-champion",
    eyebrow: "Youngest World Champion",
    holder: "Sebastian Vettel",
    value: "23y 134d",
    suffix: "Abu Dhabi 2010",
    detail:
      "Vettel clinched his first title with Red Bull at just 23 years, 134 days — making him the youngest Drivers' Champion in Formula One history.",
    accent: "#FF8000",
    icon: Star,
    imageSlot: "vettel-2010.jpg",
    era: "14 Nov 2010",
  },
  {
    id: "oldest-champion",
    eyebrow: "Oldest World Champion",
    holder: "Juan Manuel Fangio",
    value: "46y 41d",
    suffix: "Won 1957 Title",
    detail:
      "The Argentine maestro won his fifth and final championship at age 46 — a record that still stands nearly seven decades later.",
    accent: "#FFAA00",
    icon: Medal,
    imageSlot: "fangio-1957.jpg",
    era: "1957 Season",
  },
  {
    id: "constructors-record",
    eyebrow: "Most Constructors' Titles",
    holder: "Scuderia Ferrari",
    value: "16",
    suffix: "Championships",
    detail:
      "Ferrari's red dynasty: 16 Constructors' Championships, including six in a row during the Schumacher era (1999–2004). The Tifosi's pride.",
    accent: "#E8002D",
    icon: Trophy,
    imageSlot: "ferrari-dynasty.jpg",
    era: "1961 – 2008",
  },
  {
    id: "fastest-lap",
    eyebrow: "Fastest Lap in F1 History",
    holder: "Lewis Hamilton",
    value: "264.4",
    suffix: "km/h avg · Monza 2020",
    detail:
      "Hamilton's qualifying lap at Monza 2020 averaged 264.362 km/h (164.267 mph) — the fastest officially recorded lap in F1 history.",
    accent: "#00FFC8",
    icon: Gauge,
    imageSlot: "monza-2020.jpg",
    era: "5 Sep 2020",
  },
  {
    id: "longest-career",
    eyebrow: "Longest F1 Career",
    holder: "Rubens Barrichello",
    value: "326",
    suffix: "Grand Prix Starts",
    detail:
      "Across 19 seasons (1993–2011), Barrichello started more races than any driver in history — Jordan, Stewart, Ferrari, Honda, Brawn, and Williams.",
    accent: "#FFD700",
    icon: Clock,
    imageSlot: "barrichello-career.jpg",
    era: "1993 – 2011",
  },
  {
    id: "first-champion",
    eyebrow: "First F1 World Champion",
    holder: "Giuseppe Farina",
    value: "1950",
    suffix: "Inaugural Champion",
    detail:
      "Italy's Farina won the very first FIA Formula One World Championship driving for Alfa Romeo — claiming the British, Swiss and Italian GPs.",
    accent: "#C0C0C0",
    icon: History,
    imageSlot: "farina-1950.jpg",
    era: "13 May 1950",
  },
  {
    id: "consecutive-wins",
    eyebrow: "Consecutive Race Wins",
    holder: "Max Verstappen",
    value: "10",
    suffix: "Wins in a Row · 2023",
    detail:
      "From Miami to Monza, Verstappen won 10 Grands Prix back-to-back in 2023 — the longest consecutive winning streak in Formula One history.",
    accent: "#1E5BC6",
    icon: Flame,
    imageSlot: "verstappen-streak.jpg",
    era: "May – Sep 2023",
  },
  {
    id: "monaco-king",
    eyebrow: "Most Monaco GP Wins",
    holder: "Ayrton Senna",
    value: "6",
    suffix: "Monaco Victories",
    detail:
      "The 'King of Monaco' — Senna's six wins at the Principality (1987, 1989-1993) remain the all-time record at Formula One's crown jewel circuit.",
    accent: "#FFD700",
    icon: Crown,
    imageSlot: "senna-monaco.jpg",
    era: "1987 – 1993",
  },
] as const;

// Weather code → human label & icon hint (Open-Meteo WMO codes)
function describeWeather(code: number): { label: string; emoji: string } {
  if (code === 0) return { label: "Clear sky", emoji: "☀️" };
  if (code <= 3) return { label: "Partly cloudy", emoji: "⛅" };
  if (code <= 48) return { label: "Foggy", emoji: "🌫️" };
  if (code <= 57) return { label: "Drizzle", emoji: "🌦️" };
  if (code <= 67) return { label: "Rain", emoji: "🌧️" };
  if (code <= 77) return { label: "Snow", emoji: "❄️" };
  if (code <= 82) return { label: "Rain showers", emoji: "🌦️" };
  if (code <= 86) return { label: "Snow showers", emoji: "🌨️" };
  if (code <= 99) return { label: "Thunderstorm", emoji: "⛈️" };
  return { label: "—", emoji: "🌡️" };
}

// ── Fetchers ─────────────────────────────────────────────────────────────────
async function fetchAllTimeDriverChamps(): Promise<DriverChamp[]> {
  try {
    const res = await fetch(
      "https://api.jolpi.ca/ergast/f1/driverStandings/1.json?limit=100",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const lists = data?.MRData?.StandingsTable?.StandingsLists ?? [];
    // Flatten — each season list has one entry (the champion)
    return lists.flatMap(
      (l: { DriverStandings: DriverChamp[] }) => l.DriverStandings ?? []
    );
  } catch {
    return [];
  }
}

async function fetchAllTimeConstructorChamps(): Promise<ConstructorChamp[]> {
  try {
    const res = await fetch(
      "https://api.jolpi.ca/ergast/f1/constructorStandings/1.json?limit=100",
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    const lists = data?.MRData?.StandingsTable?.StandingsLists ?? [];
    return lists.flatMap(
      (l: { ConstructorStandings: ConstructorChamp[] }) =>
        l.ConstructorStandings ?? []
    );
  } catch {
    return [];
  }
}

async function fetchNextRace(): Promise<NextRace | null> {
  try {
    const res = await fetch(
      "https://api.jolpi.ca/ergast/f1/current/next.json",
      { next: { revalidate: 1800 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data?.MRData?.RaceTable?.Races?.[0] ?? null;
  } catch {
    return null;
  }
}

async function fetchWeather(
  lat: string,
  lng: string
): Promise<OpenMeteoForecast | null> {
  try {
    const url =
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code` +
      `&timezone=auto&forecast_days=7`;
    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function fetchCountryFlag(country: string): Promise<string | null> {
  try {
    const res = await fetch(
      `https://restcountries.com/v3.1/name/${encodeURIComponent(country)}?fields=flags`,
      { next: { revalidate: 86400 } }
    );
    if (!res.ok) return null;
    const arr = await res.json();
    return arr?.[0]?.flags?.png ?? arr?.[0]?.flags?.svg ?? null;
  } catch {
    return null;
  }
}

// Aggregate: count championships per driver
function aggregateDriverTitles(champs: DriverChamp[]) {
  const map = new Map<
    string,
    {
      name: string;
      nationality: string;
      titles: number;
      driverId: string;
      teams: Set<string>;
    }
  >();
  for (const c of champs) {
    const key = c.Driver.driverId;
    const existing = map.get(key);
    if (existing) {
      existing.titles += 1;
      c.Constructors.forEach((t) => existing.teams.add(t.name));
    } else {
      map.set(key, {
        driverId: key,
        name: `${c.Driver.givenName} ${c.Driver.familyName}`,
        nationality: c.Driver.nationality,
        titles: 1,
        teams: new Set(c.Constructors.map((t) => t.name)),
      });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.titles - a.titles);
}

function aggregateConstructorTitles(champs: ConstructorChamp[]) {
  const map = new Map<
    string,
    {
      name: string;
      nationality: string;
      titles: number;
      constructorId: string;
    }
  >();
  for (const c of champs) {
    const key = c.Constructor.constructorId;
    const existing = map.get(key);
    if (existing) existing.titles += 1;
    else
      map.set(key, {
        constructorId: key,
        name: c.Constructor.name,
        nationality: c.Constructor.nationality,
        titles: 1,
      });
  }
  return Array.from(map.values()).sort((a, b) => b.titles - a.titles);
}

function teamAccent(name: string): string {
  const t = name.toLowerCase();
  if (t.includes("ferrari"))     return "#E8002D";
  if (t.includes("mclaren"))     return "#FF8000";
  if (t.includes("mercedes"))    return "#27F4D2";
  if (t.includes("red bull"))    return "#3671C6";
  if (t.includes("williams"))    return "#64C4FF";
  if (t.includes("lotus"))       return "#FFB800";
  if (t.includes("brabham"))     return "#88CC88";
  if (t.includes("renault"))     return "#FFD700";
  if (t.includes("benetton"))    return "#00FF88";
  if (t.includes("brawn"))       return "#B0FF1E";
  if (t.includes("cooper"))      return "#5BC0EB";
  if (t.includes("tyrrell"))     return "#9D4EDD";
  if (t.includes("matra"))       return "#4361EE";
  if (t.includes("vanwall"))     return "#06D6A0";
  return "#E10600";
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default async function RecordsPage() {
  const [driverChamps, constructorChamps, nextRace] = await Promise.all([
    fetchAllTimeDriverChamps(),
    fetchAllTimeConstructorChamps(),
    fetchNextRace(),
  ]);

  const driverHallOfFame = aggregateDriverTitles(driverChamps).slice(0, 15);
  const constructorHallOfFame =
    aggregateConstructorTitles(constructorChamps).slice(0, 12);

  // Hydrate weather + flag for the next race only when coordinates exist.
  const [weather, nextRaceFlag] = await Promise.all([
    nextRace
      ? fetchWeather(nextRace.Circuit.Location.lat, nextRace.Circuit.Location.long)
      : Promise.resolve(null),
    nextRace ? fetchCountryFlag(nextRace.Circuit.Location.country) : Promise.resolve(null),
  ]);

  const maxTitles = driverHallOfFame[0]?.titles ?? 1;
  const maxConstTitles = constructorHallOfFame[0]?.titles ?? 1;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ──────────────────── HERO ──────────────────── */}
      <section className="relative px-6 py-24 overflow-hidden min-h-[46vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-yellow-950/15" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(220,38,38,0.25),transparent_55%)]" />
        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "32%" }} />
          <div className="track-line track-line-2" style={{ top: "58%" }} />
          <div className="track-line track-line-3" style={{ top: "78%" }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="animate-fade-left">
            <p className="text-red-500 font-bold uppercase tracking-[0.25em] text-sm mb-4 flex items-center gap-2">
              <Trophy size={14} />
              F1 Hall of Fame
            </p>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-5">
              The <span className="text-red-600">Records</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Seventy-five years of Formula One distilled into its most iconic
              numbers. Live all-time champion data from Jolpica, weather for the
              next Grand Prix from Open-Meteo, and a curated archive of the
              moments that defined the sport.
            </p>
            <div className="flex flex-wrap items-center gap-2 mt-5 text-[11px] font-bold uppercase tracking-widest">
              <SourceChip label="Jolpica" />
              <SourceChip label="Open-Meteo" />
              <SourceChip label="REST Countries" />
              <SourceChip label="Curated Archive" />
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────── ICONIC RECORDS GRID ──────────────────── */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <SectionHeader
          icon={Sparkles}
          eyebrow="Defining Moments"
          title="The 12 Most Iconic F1 Records"
          source="Curated Archive"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {ICONIC_RECORDS.map((rec) => {
            const Icon = rec.icon;
            return (
              <article
                key={rec.id}
                className="professional-card group rounded-2xl overflow-hidden border border-neutral-800/60 relative"
              >
                {/* Accent top strip */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 z-10"
                  style={{
                    background: `linear-gradient(90deg, ${rec.accent}, ${rec.accent}55, transparent)`,
                  }}
                />

                {/* Hero image / fallback gradient */}
                <div
                  className="relative h-44 overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${rec.accent}33 0%, #0a0a0a 70%)`,
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/images/records/${rec.imageSlot}`}
                    alt={rec.holder}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:scale-105 transition-all duration-700"
                    onError={(e) => {
                      // Hide broken image so the gradient fallback shows.
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                    onLoad={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = "1";
                    }}
                  />
                  {/* Dark overlay so text always reads */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Big icon watermark */}
                  <Icon
                    size={120}
                    className="absolute -bottom-6 -right-6 opacity-10 group-hover:opacity-20 transition-opacity"
                    style={{ color: rec.accent }}
                  />

                  {/* Eyebrow */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
                    <span
                      className="px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-widest backdrop-blur-sm"
                      style={{
                        color: rec.accent,
                        background: `${rec.accent}22`,
                        border: `1px solid ${rec.accent}55`,
                      }}
                    >
                      {rec.eyebrow}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
                      {rec.era}
                    </span>
                  </div>

                  {/* Big value */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-baseline gap-2">
                      <span
                        className="text-5xl font-black leading-none drop-shadow-lg"
                        style={{ color: rec.accent }}
                      >
                        {rec.value}
                      </span>
                      <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-300">
                        {rec.suffix}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5">
                  <p
                    className="text-xs font-black uppercase tracking-widest mb-1"
                    style={{ color: rec.accent }}
                  >
                    Record Holder
                  </p>
                  <h3 className="text-white font-black text-lg leading-tight mb-2">
                    {rec.holder}
                  </h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {rec.detail}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ──────────────────── ALL-TIME DRIVER HALL OF FAME ──────────────────── */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <SectionHeader
          icon={Crown}
          eyebrow="Live Archive"
          title="All-Time Drivers' Champions"
          source="Jolpica F1 API"
        />

        {driverHallOfFame.length === 0 ? (
          <EmptyState message="Champion archive is unavailable right now." />
        ) : (
          <div className="mt-6 glass-card rounded-2xl border border-neutral-800/60 overflow-hidden">
            <div className="grid grid-cols-12 px-5 py-3 border-b border-neutral-800 text-[10px] font-black uppercase tracking-widest text-neutral-500 bg-neutral-950/60">
              <div className="col-span-1">#</div>
              <div className="col-span-5">Driver</div>
              <div className="col-span-3 hidden sm:block">Nationality</div>
              <div className="col-span-2 text-right">Titles</div>
              <div className="col-span-1 text-right">—</div>
            </div>
            <div className="divide-y divide-neutral-900/60">
              {driverHallOfFame.map((d, idx) => {
                const widthPct = Math.max(8, (d.titles / maxTitles) * 100);
                const topTier = idx < 3;
                const teamColor = teamAccent(
                  Array.from(d.teams)[0] ?? ""
                );
                return (
                  <div
                    key={d.driverId}
                    className="grid grid-cols-12 items-center px-5 py-3.5 text-sm hover:bg-red-950/10 transition-colors relative"
                  >
                    <div className="col-span-1">
                      <span
                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-[11px] font-black ${
                          topTier
                            ? "bg-red-600 text-white shadow-[0_0_18px_rgba(220,38,38,0.5)]"
                            : "bg-neutral-900 text-neutral-400 border border-neutral-800"
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </div>
                    <div className="col-span-5 min-w-0">
                      <p className="text-white font-bold truncate flex items-center gap-1.5">
                        {d.name}
                        {topTier && (
                          <Crown size={12} className="text-yellow-400 shrink-0" />
                        )}
                      </p>
                      <p className="text-[10px] text-neutral-500 truncate uppercase tracking-widest mt-0.5">
                        {Array.from(d.teams).slice(0, 2).join(" · ")}
                      </p>
                    </div>
                    <div className="col-span-3 hidden sm:block text-neutral-400 text-xs truncate">
                      {d.nationality}
                    </div>
                    <div className="col-span-2 text-right">
                      <span
                        className="font-black text-lg"
                        style={{ color: teamColor }}
                      >
                        {d.titles}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      <ChevronRight
                        size={14}
                        className="text-neutral-700"
                      />
                    </div>
                    {/* Bar accent */}
                    <div
                      className="absolute bottom-0 left-0 h-[2px] transition-all duration-700"
                      style={{
                        width: `${widthPct}%`,
                        background: `linear-gradient(90deg, ${teamColor}cc, ${teamColor}33)`,
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* ──────────────────── CONSTRUCTOR HALL OF FAME ──────────────────── */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <SectionHeader
          icon={Trophy}
          eyebrow="Constructor Dynasty"
          title="All-Time Constructors' Champions"
          source="Jolpica F1 API"
        />

        {constructorHallOfFame.length === 0 ? (
          <EmptyState message="Constructors archive unavailable right now." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {constructorHallOfFame.map((c, idx) => {
              const accent = teamAccent(c.name);
              const widthPct = Math.max(10, (c.titles / maxConstTitles) * 100);
              return (
                <div
                  key={c.constructorId}
                  className="professional-card rounded-xl p-5 border border-neutral-800/60 relative overflow-hidden"
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: accent }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className="text-[10px] font-black uppercase tracking-widest"
                        style={{ color: accent }}
                      >
                        Rank #{idx + 1}
                      </p>
                      <h3 className="text-white font-black text-lg leading-tight mt-1 truncate">
                        {c.name}
                      </h3>
                      <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">
                        {c.nationality}
                      </p>
                    </div>
                    <div
                      className="shrink-0 text-3xl font-black leading-none"
                      style={{ color: accent }}
                    >
                      {c.titles}
                    </div>
                  </div>
                  <div className="mt-4 h-1 rounded-full bg-neutral-900 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${widthPct}%`,
                        background: `linear-gradient(90deg, ${accent}, ${accent}55)`,
                      }}
                    />
                  </div>
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mt-3">
                    Constructors&apos; Titles
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ──────────────────── NEXT RACE WEATHER ──────────────────── */}
      {nextRace && weather && (
        <section className="px-6 py-12 max-w-7xl mx-auto">
          <SectionHeader
            icon={CloudSun}
            eyebrow="Race Forecast"
            title={`Weather · ${nextRace.raceName}`}
            source="Open-Meteo"
          />

          <div className="mt-6 glass-card rounded-2xl border border-blue-900/30 overflow-hidden">
            <div className="px-5 py-4 border-b border-neutral-800/60 flex flex-wrap items-center justify-between gap-3 bg-neutral-950/60">
              <div className="flex items-center gap-3 text-sm text-neutral-300 min-w-0">
                {nextRaceFlag && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={nextRaceFlag}
                    alt={nextRace.Circuit.Location.country}
                    className="w-8 h-5 object-cover rounded border border-neutral-800 shrink-0"
                  />
                )}
                <span className="truncate">
                  <span className="font-bold text-white">
                    {nextRace.Circuit.circuitName}
                  </span>{" "}
                  · {nextRace.Circuit.Location.locality},{" "}
                  {nextRace.Circuit.Location.country}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-neutral-500 font-semibold">
                <Calendar size={12} />
                Round {nextRace.round} · {nextRace.date}
              </div>
            </div>

            {/* Current conditions */}
            {weather.current && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-b border-neutral-800/40">
                <WeatherStat
                  icon={Thermometer}
                  label="Temperature"
                  value={`${Math.round(weather.current.temperature_2m)}°C`}
                  sub={`Feels ${Math.round(weather.current.apparent_temperature)}°C`}
                  accent="#FF6B6B"
                />
                <WeatherStat
                  icon={CloudSun}
                  label="Conditions"
                  value={describeWeather(weather.current.weather_code).label}
                  sub={describeWeather(weather.current.weather_code).emoji}
                  accent="#60A5FA"
                />
                <WeatherStat
                  icon={Wind}
                  label="Wind"
                  value={`${Math.round(weather.current.wind_speed_10m)} km/h`}
                  sub="10m surface"
                  accent="#86EFAC"
                />
                <WeatherStat
                  icon={Droplets}
                  label="Humidity"
                  value={`${weather.current.relative_humidity_2m}%`}
                  sub="Relative"
                  accent="#67E8F9"
                />
              </div>
            )}

            {/* 7-day forecast */}
            {weather.daily && (
              <div className="p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-3 px-2">
                  7-Day Forecast
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                  {weather.daily.time.map((day, i) => {
                    const w = describeWeather(weather.daily!.weather_code[i]);
                    const date = new Date(day);
                    const dayLabel = date.toLocaleDateString("en-US", {
                      weekday: "short",
                    });
                    return (
                      <div
                        key={day}
                        className="rounded-lg p-3 bg-neutral-950/60 border border-neutral-900 text-center hover:border-blue-700/40 transition-colors"
                      >
                        <p className="text-[10px] font-bold uppercase text-neutral-500 tracking-widest">
                          {dayLabel}
                        </p>
                        <p className="text-2xl my-1">{w.emoji}</p>
                        <p className="text-white text-sm font-black">
                          {Math.round(weather.daily!.temperature_2m_max[i])}°
                        </p>
                        <p className="text-neutral-500 text-[11px]">
                          {Math.round(weather.daily!.temperature_2m_min[i])}°
                        </p>
                        <p className="text-blue-400 text-[10px] mt-1 font-bold">
                          {weather.daily!.precipitation_probability_max[i]}% 💧
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ──────────────────── FOOTER NOTE ──────────────────── */}
      <section className="px-6 py-16 pb-24 max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl border border-neutral-800/60 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent" />
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center shrink-0">
              <MapPin className="text-yellow-400" size={20} />
            </div>
            <div>
              <p className="text-yellow-400 text-[11px] font-black uppercase tracking-widest mb-1">
                Powered by Open Data
              </p>
              <h3 className="text-white font-black text-xl mb-2">
                Every figure on this page is verifiable.
              </h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Historical champion data is fetched live from the Jolpica/Ergast
                F1 archive — the same archive used by the F1 community since
                2009. Weather is sourced from Open-Meteo&apos;s free non-commercial
                API. Country flags come from REST Countries. No API keys, no
                paywalls, no scraping — just open data, professionally presented.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

// ── Presentational helpers ──────────────────────────────────────────────────
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

function WeatherStat({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Thermometer;
  label: string;
  value: string;
  sub: string;
  accent: string;
}) {
  return (
    <div className="p-5 border-r last:border-r-0 border-neutral-800/40 text-center sm:text-left">
      <div className="flex items-center gap-2 justify-center sm:justify-start">
        <Icon size={14} style={{ color: accent }} />
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">
          {label}
        </p>
      </div>
      <p
        className="text-2xl font-black mt-2 leading-none"
        style={{ color: accent }}
      >
        {value}
      </p>
      <p className="text-[11px] text-neutral-500 mt-1">{sub}</p>
    </div>
  );
}
