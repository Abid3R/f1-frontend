import { fetchRaceSchedule } from "@/lib/api";
import ClientImage from "../components/ClientImage";
import { AlertCircle, MapPin, Clock, Globe, Flag } from "lucide-react";
import SeasonProgress from "../components/SeasonProgress";
import RaceStatusBadge from "../components/RaceStatusBadge";

interface Race {
  meeting_key?: string | number;
  meeting_name?: string;
  location?: string;
  country_name?: string;
  date_start?: string;
  gmt_offset?: string;
}

// ── Circuit image lookup ──────────────────────────────────────────────────────
// Keys are lowercase substrings matched against meeting_name + country_name + location.
// Ordered from most-specific to least-specific so "las vegas" beats a generic "united states".
const CIRCUIT_IMAGES: [string, string][] = [
  ["las vegas",      "/images/circuits/las-vegas.jpg"],
  ["abu dhabi",      "/images/circuits/abu-dhabi.png"],
  ["emilia",         "/images/circuits/emilia-romagna.png"],
  ["romagna",        "/images/circuits/emilia-romagna.png"],
  ["imola",          "/images/circuits/emilia-romagna.png"],
  ["sao paulo",      "/images/circuits/sao-paulo.jpg"],
  ["são paulo",      "/images/circuits/sao-paulo.jpg"],
  ["brazil",         "/images/circuits/sao-paulo.jpg"],
  ["saudi",          "/images/circuits/saudi-arabia.jpg"],
  ["jeddah",         "/images/circuits/saudi-arabia.jpg"],
  ["australia",      "/images/circuits/australia.jpg"],
  ["melbourne",      "/images/circuits/australia.jpg"],
  ["bahrain",        "/images/circuits/bahrain.jpg"],
  ["japan",          "/images/circuits/japan.jpg"],
  ["suzuka",         "/images/circuits/japan.jpg"],
  ["china",          "/images/circuits/china.png"],
  ["shanghai",       "/images/circuits/china.png"],
  ["monaco",         "/images/circuits/monaco.png"],
  ["canada",         "/images/circuits/canada.jpg"],
  ["montreal",       "/images/circuits/canada.jpg"],
  ["spain",          "/images/circuits/spain.jpg"],
  ["spanish",        "/images/circuits/spain.jpg"],
  ["barcelona",      "/images/circuits/spain.jpg"],
  ["austria",        "/images/circuits/austria.jpg"],
  ["spielberg",      "/images/circuits/austria.jpg"],
  ["britain",        "/images/circuits/britain.jpg"],
  ["british",        "/images/circuits/britain.jpg"],
  ["silverstone",    "/images/circuits/britain.jpg"],
  ["hungary",        "/images/circuits/hungary.jpg"],
  ["budapest",       "/images/circuits/hungary.jpg"],
  ["belgium",        "/images/circuits/belgium.jpg"],
  ["spa",            "/images/circuits/belgium.jpg"],
  ["netherlands",    "/images/circuits/netherlands.jpg"],
  ["dutch",          "/images/circuits/netherlands.jpg"],
  ["zandvoort",      "/images/circuits/netherlands.jpg"],
  ["italy",          "/images/circuits/italy.jpg"],
  ["italian",        "/images/circuits/italy.jpg"],
  ["monza",          "/images/circuits/italy.jpg"],
  ["azerbaijan",     "/images/circuits/azerbaijan.png"],
  ["baku",           "/images/circuits/azerbaijan.png"],
  ["singapore",      "/images/circuits/singapore.png"],
  ["mexico",         "/images/circuits/mexico.jpg"],
  ["qatar",          "/images/circuits/qatar.jpg"],
  ["lusail",         "/images/circuits/qatar.jpg"],
];

function getCircuitImage(race: Race): string | null {
  const haystack = [race.meeting_name, race.country_name, race.location]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  for (const [key, path] of CIRCUIT_IMAGES) {
    if (haystack.includes(key)) return path;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="glass-card-red rounded-2xl p-8 border border-red-900/40 flex items-start gap-4">
        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={22} />
        <div>
          <p className="font-bold text-red-300 mb-2">Backend Unavailable</p>
          <p className="text-neutral-400 text-sm leading-relaxed">{message}</p>
          <p className="text-neutral-500 text-xs mt-3">
            Start the FastAPI server:{" "}
            <code className="text-red-400 bg-red-950/40 px-2 py-0.5 rounded">
              uvicorn main:app --reload
            </code>{" "}
            then refresh this page.
          </p>
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr?: string) {
  if (!dateStr) return { date: "Date not available", time: "" };
  try {
    const d = new Date(dateStr);
    return {
      date: d.toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      time: d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      }),
    };
  } catch {
    return { date: dateStr, time: "" };
  }
}

export default async function RacesPage() {
  let races: Race[] = [];
  let apiError: string | null = null;

  try {
    races = await fetchRaceSchedule(2026);
  } catch (err: unknown) {
    apiError =
      err instanceof Error
        ? err.message
        : "Backend API is not available. Please start FastAPI server at http://127.0.0.1:8000.";
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative px-6 py-24 overflow-hidden min-h-[50vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-red-950/20" />

        <video
          src="/videos/races-3d.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-28"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.2),transparent_55%)]" />

        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "42%" }} />
          <div className="track-line track-line-2" style={{ top: "68%" }} />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="animate-fade-left">
            <p className="text-red-500 font-bold uppercase tracking-[0.25em] text-sm mb-4">
              Formula 1 Calendar
            </p>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-5">
              2026 Race{" "}
              <span className="text-red-600">Schedule</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
              The complete 2026 FIA Formula 1 World Championship race calendar,
              pulled live from your FastAPI backend. Locations, circuits and
              round-by-round schedule.
            </p>

            {!apiError && races.length > 0 && (
              <div className="flex items-center gap-2 mt-5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-dot-pulse" />
                <span className="text-green-500 text-sm font-semibold">
                  {races.length} rounds loaded
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================
          CONTENT
          ================================================================ */}
      <section className="px-6 py-10 pb-20 max-w-7xl mx-auto">
        {apiError && <ErrorCard message={apiError} />}

        {!apiError && races.length === 0 && (
          <div className="text-center py-20 glass-card rounded-2xl border border-neutral-800/50 p-12">
            <Globe size={40} className="text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg font-semibold mb-2">
              No race schedule found for this year.
            </p>
            <p className="text-neutral-600 text-sm">
              No schedule data returned from the backend.
            </p>
          </div>
        )}

        {!apiError && races.length > 0 && (
          <div>
            {/* Season progress timeline */}
            <SeasonProgress races={races} />

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-300">
                2026 FIA Formula 1 World Championship
              </h2>
              <span className="f1-badge">{races.length} Rounds</span>
            </div>

            <div className="grid gap-3">
              {races.map((race, idx) => {
                const { date, time } = formatDate(race.date_start);
                const roundNum = idx + 1;
                const circuitImg = getCircuitImage(race);

                return (
                  <div
                    key={race.meeting_key ?? idx}
                    className="professional-card rounded-2xl overflow-hidden animate-fade-up group"
                    style={{ animationDelay: `${idx * 0.03}s` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Red left accent strip */}
                      <div className="md:w-[3px] bg-gradient-to-b from-red-500 to-red-900/40 shrink-0 h-[3px] md:h-auto rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />

                      {/* Main content row */}
                      <div className="flex items-center gap-4 px-5 py-4 flex-1 min-w-0">

                        {/* Round badge */}
                        <div className="shrink-0 w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800/80 flex flex-col items-center justify-center">
                          <span className="text-[9px] text-red-600 font-bold uppercase tracking-widest leading-none mb-0.5">
                            RND
                          </span>
                          <span className="text-xl font-black text-white leading-none">
                            {roundNum}
                          </span>
                        </div>

                        {/* Circuit image thumbnail */}
                        <div className="shrink-0 w-20 h-14 md:w-24 md:h-16 rounded-lg overflow-hidden bg-neutral-900/80 border border-neutral-800/50 flex items-center justify-center">
                          {circuitImg ? (
                            <img
                              src={circuitImg}
                              alt={`${race.meeting_name ?? "circuit"} layout`}
                              className="w-full h-full object-contain p-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                              style={{
                                filter: "invert(1) brightness(0.85) sepia(0.3) hue-rotate(320deg) saturate(1.4)",
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Flag size={18} className="text-neutral-700" />
                            </div>
                          )}
                        </div>

                        {/* Race name & location */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-base md:text-lg font-black group-hover:text-red-400 transition-colors leading-tight truncate">
                              {race.meeting_name ?? "Race name not available"}
                            </h2>
                            <RaceStatusBadge dateStr={race.date_start} />
                          </div>
                          {(race.location || race.country_name) && (
                            <div className="flex items-center gap-1.5 mt-1 text-xs text-neutral-500">
                              <MapPin size={11} className="text-red-700 shrink-0" />
                              <span className="truncate">
                                {[race.location, race.country_name]
                                  .filter(Boolean)
                                  .join(", ")}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Date card */}
                        <div className="shrink-0 hidden sm:block rounded-xl bg-neutral-900/60 border border-neutral-800/50 px-4 py-3 min-w-[180px] text-right">
                          <div className="flex items-center justify-end gap-1.5 mb-1.5">
                            <Clock size={10} className="text-red-600 shrink-0" />
                            <p className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">
                              Race Start
                            </p>
                          </div>
                          <p className="font-bold text-xs text-white leading-snug">
                            {date}
                          </p>
                          {time && (
                            <p className="text-neutral-600 text-[10px] mt-0.5">
                              {time}
                            </p>
                          )}
                          {race.gmt_offset && (
                            <p className="text-neutral-700 text-[9px] mt-1">
                              GMT {race.gmt_offset}
                            </p>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
