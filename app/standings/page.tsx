import { fetchDriverStandings } from "@/lib/api";
import { Trophy, Users, Star, TrendingUp, AlertCircle } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface DriverStanding {
  position: number;
  driver: string;
  code?: string;
  team: string;
  points: number;
  wins: number;
}

// ── Error Card ───────────────────────────────────────────────────────────────
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

// ── Position color helper ────────────────────────────────────────────────────
function positionColor(pos: number) {
  if (pos === 1) return "text-yellow-400";
  if (pos === 2) return "text-neutral-300";
  if (pos === 3) return "text-amber-600";
  return "text-red-500";
}

// ─────────────────────────────────────────────────────────────────────────────

export default async function StandingsPage() {
  let standings: DriverStanding[] = [];
  let apiError: string | null = null;

  try {
    standings = await fetchDriverStandings();
  } catch (err: unknown) {
    apiError =
      err instanceof Error
        ? err.message
        : "Backend API is not available. Please start FastAPI server at http://127.0.0.1:8000.";
  }

  // ── Derived stats ──────────────────────────────────────────────────────────
  const leader = standings[0] ?? null;
  const totalWins = standings.reduce((s, d) => s + (d.wins ?? 0), 0);
  const topPoints = standings[0]?.points ?? 0;

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative px-6 py-24 overflow-hidden min-h-[50vh] flex items-center">
        {/* CSS gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-red-950/20" />

        {/* 3D animation video */}
        <video
          src="/videos/standings-3d.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.22),transparent_55%)]" />

        {/* Track lines */}
        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "40%" }} />
          <div className="track-line track-line-2" style={{ top: "65%" }} />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="animate-fade-left">
            <p className="text-red-500 font-bold uppercase tracking-[0.25em] text-sm mb-4">
              Championship Table
            </p>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-5">
              F1 Driver{" "}
              <span className="text-red-600">Standings</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Current Formula 1 driver championship standings from your FastAPI
              backend. Live position, points, wins and constructor data.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================
          STAT SUMMARY CARDS
          ================================================================ */}
      {!apiError && standings.length > 0 && (
        <section className="px-6 py-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                icon: Users,
                label: "Total Drivers",
                value: String(standings.length),
                delay: "delay-0",
              },
              {
                icon: Trophy,
                label: "Championship Leader",
                value: leader?.code ?? leader?.driver?.split(" ")[1] ?? "—",
                delay: "delay-100",
              },
              {
                icon: Star,
                label: "Total Race Wins",
                value: String(totalWins),
                delay: "delay-200",
              },
              {
                icon: TrendingUp,
                label: "Leader Points",
                value: String(topPoints),
                delay: "delay-300",
              },
            ].map(({ icon: Icon, label, value, delay }) => (
              <div
                key={label}
                className={`metric-card rounded-2xl p-5 animate-fade-up ${delay}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-red-950/50 border border-red-900/40 flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-red-400" />
                  </div>
                  <p className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
                    {label}
                  </p>
                </div>
                <p className="text-3xl font-black text-white">{value}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ================================================================
          ERROR STATE
          ================================================================ */}
      {apiError && <ErrorCard message={apiError} />}

      {/* ================================================================
          STANDINGS TABLE
          ================================================================ */}
      {!apiError && standings.length === 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <p className="text-neutral-500 text-lg">
            No standings data returned by the backend.
          </p>
        </div>
      )}

      {!apiError && standings.length > 0 && (
        <section className="px-6 py-6 pb-20 max-w-7xl mx-auto">
          <div className="animate-fade-up delay-200">
            {/* Section header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-300">
                Driver Championship Rankings
              </h2>
              <span className="f1-badge">
                {standings.length} Drivers
              </span>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-2xl border border-neutral-800/80 shadow-2xl">
              <table className="w-full f1-table">
                <thead>
                  <tr className="bg-red-700/90">
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-red-100 w-16">
                      Pos
                    </th>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-red-100">
                      Driver
                    </th>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-red-100 hidden sm:table-cell">
                      Code
                    </th>
                    <th className="p-4 text-left text-xs font-bold uppercase tracking-widest text-red-100">
                      Constructor
                    </th>
                    <th className="p-4 text-right text-xs font-bold uppercase tracking-widest text-red-100">
                      Points
                    </th>
                    <th className="p-4 text-right text-xs font-bold uppercase tracking-widest text-red-100 hidden md:table-cell">
                      Wins
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-neutral-950/80">
                  {standings.map((driver, idx) => (
                    <tr
                      key={driver.position}
                      className="border-t border-neutral-800/60 hover:bg-red-950/10 transition-colors group"
                      style={{ animationDelay: `${idx * 0.03}s` }}
                    >
                      {/* Position */}
                      <td className="p-4 pl-5">
                        <span
                          className={`text-xl font-black ${positionColor(driver.position)}`}
                        >
                          {driver.position}
                        </span>
                      </td>

                      {/* Driver */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {/* Helmet icon placeholder */}
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-800 to-neutral-900 border border-neutral-700 flex items-center justify-center shrink-0 text-[10px] font-black text-red-300">
                            {driver.code?.slice(0, 2) ?? driver.position}
                          </div>
                          <span className="font-bold text-white group-hover:text-red-300 transition-colors">
                            {driver.driver}
                          </span>
                        </div>
                      </td>

                      {/* Code */}
                      <td className="p-4 hidden sm:table-cell">
                        <code className="text-neutral-400 text-xs bg-neutral-900 px-2 py-1 rounded font-mono">
                          {driver.code ?? "—"}
                        </code>
                      </td>

                      {/* Team */}
                      <td className="p-4 text-neutral-300 text-sm">
                        {driver.team}
                      </td>

                      {/* Points */}
                      <td className="p-4 text-right">
                        <span className="font-black text-white text-lg">
                          {driver.points}
                        </span>
                        <span className="text-neutral-600 text-xs ml-1">
                          pts
                        </span>
                      </td>

                      {/* Wins */}
                      <td className="p-4 text-right hidden md:table-cell">
                        <span
                          className={`font-bold ${driver.wins > 0 ? "text-yellow-400" : "text-neutral-600"}`}
                        >
                          {driver.wins}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
