import { fetchRaceSchedule } from "@/lib/api";
import ClientImage from "../components/ClientImage";
import { AlertCircle, MapPin, Clock, Globe, Flag } from "lucide-react";

interface Race {
  meeting_key?: string | number;
  meeting_name?: string;
  location?: string;
  country_name?: string;
  date_start?: string;
  gmt_offset?: string;
}

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

/** Format a date string nicely. */
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
        {/* CSS gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-red-950/20" />

        {/* 3D animation video */}
        <video
          src="/videos/races-3d.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-28"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.2),transparent_55%)]" />

        {/* Track lines */}
        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "42%" }} />
          <div className="track-line track-line-2" style={{ top: "68%" }} />
        </div>

        {/* Bottom fade */}
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
          CIRCUIT MAP IMAGE (optional)
          ================================================================ */}
      <div className="max-w-7xl mx-auto px-6 mt-4">
        <ClientImage
          src="/images/circuit-map.png"
          alt="F1 circuit map"
          className="w-full h-40 object-cover rounded-2xl opacity-40 border border-neutral-800/40"
        />
      </div>

      {/* ================================================================
          CONTENT
          ================================================================ */}
      <section className="px-6 py-10 pb-20 max-w-7xl mx-auto">
        {/* Error state */}
        {apiError && <ErrorCard message={apiError} />}

        {/* Empty state */}
        {!apiError && races.length === 0 && (
          <div className="text-center py-20 glass-card rounded-2xl border border-neutral-800/50 p-12">
            <Globe size={40} className="text-neutral-700 mx-auto mb-4" />
            <p className="text-neutral-400 text-lg font-semibold mb-2">
              No race schedule found for this year.
            </p>
            <p className="text-neutral-600 text-sm">
              The 2026 schedule data may not be available yet in the OpenF1 API.
              Check back later or try a different year.
            </p>
          </div>
        )}

        {/* Race cards */}
        {!apiError && races.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-neutral-300">
                2026 FIA Formula 1 World Championship
              </h2>
              <span className="f1-badge">{races.length} Rounds</span>
            </div>

            <div className="grid gap-4">
              {races.map((race, idx) => {
                const { date, time } = formatDate(race.date_start);
                const roundNum = idx + 1;

                return (
                  <div
                    key={race.meeting_key ?? idx}
                    className="professional-card rounded-2xl overflow-hidden animate-fade-up group"
                    style={{ animationDelay: `${idx * 0.035}s` }}
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* ── Left accent strip ── */}
                      <div className="md:w-2 bg-gradient-to-b from-red-600 to-red-900 shrink-0 h-1.5 md:h-auto md:w-2 rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none" />

                      {/* ── Main content ── */}
                      <div className="flex flex-col md:flex-row md:items-center gap-5 p-5 md:p-6 flex-1 min-w-0">
                        {/* Round badge */}
                        <div className="shrink-0">
                          <div className="w-14 h-14 rounded-xl bg-red-950/40 border border-red-900/30 flex flex-col items-center justify-center">
                            <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                              R
                            </span>
                            <span className="text-2xl font-black text-red-400 leading-none">
                              {roundNum}
                            </span>
                          </div>
                        </div>

                        {/* Race name & location */}
                        <div className="flex-1 min-w-0">
                          <h2 className="text-xl md:text-2xl font-black group-hover:text-red-400 transition-colors leading-tight">
                            {race.meeting_name ?? "Race name not available"}
                          </h2>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            {(race.location || race.country_name) && (
                              <div className="flex items-center gap-1.5 text-sm text-neutral-400">
                                <MapPin
                                  size={13}
                                  className="text-red-600 shrink-0"
                                />
                                {[race.location, race.country_name]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            )}
                            {race.country_name && (
                              <div className="flex items-center gap-1.5 text-xs text-neutral-600">
                                <Flag size={11} className="shrink-0" />
                                {race.country_name}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Date & time card */}
                        <div className="shrink-0 rounded-xl bg-neutral-900/70 border border-neutral-800/60 p-4 min-w-[200px]">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Clock size={12} className="text-red-500 shrink-0" />
                            <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                              Start Date
                            </p>
                          </div>
                          <p className="font-bold text-sm text-white leading-snug">
                            {date}
                          </p>
                          {time && (
                            <p className="text-neutral-500 text-xs mt-1">
                              {time}
                            </p>
                          )}
                          {race.gmt_offset && (
                            <p className="text-neutral-700 text-[10px] mt-1.5">
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
