"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Trophy, Star, Flag } from "lucide-react";

interface Driver {
  driver_id: string;
  full_name: string;
  code?: string;
  team?: string;
  nationality?: string;
  permanent_number?: string | number;
  standing_position?: number;
  points?: number;
  wins?: number;
}

interface DriversGridProps {
  drivers: Driver[];
}

type SortKey = "standing" | "points" | "wins" | "name";

// ── Driver photo mapping ──────────────────────────────────────────────────────
// To add more drivers: copy any line below, change the name key and image filename.
// Image files live in:  public/images/<image_name>
// Naming convention:    lowercase full name, spaces → underscores  (e.g. "george_russell.jpg")
// ─────────────────────────────────────────────────────────────────────────────
const driverImages: Record<string, string> = {
  "Max Verstappen":     "/images/max_verstappen.jpg",
  "Lewis Hamilton":     "/images/lewis_hamilton.jpg",
  "Charles Leclerc":    "/images/charles_leclerc.jpg",
  "Lando Norris":       "/images/lando_norris.jpg",
  // ── Copy/paste block — one line per driver ────────────────────────────────
  // "George Russell":     "/images/george_russell.jpg",
  // "Carlos Sainz":       "/images/carlos_sainz.jpg",
  // "Oscar Piastri":      "/images/oscar_piastri.jpg",
  // "Fernando Alonso":    "/images/fernando_alonso.jpg",
  // "Lance Stroll":       "/images/lance_stroll.jpg",
  // "Esteban Ocon":       "/images/esteban_ocon.jpg",
  // "Pierre Gasly":       "/images/pierre_gasly.jpg",
  // "Nico Hulkenberg":    "/images/nico_hulkenberg.jpg",
  // "Valtteri Bottas":    "/images/valtteri_bottas.jpg",
  // "Zhou Guanyu":        "/images/zhou_guanyu.jpg",
  // "Yuki Tsunoda":       "/images/yuki_tsunoda.jpg",
  // "Logan Sargeant":     "/images/logan_sargeant.jpg",
  // "Nyck De Vries":      "/images/nyck_de_vries.jpg",
  // "Kevin Magnussen":    "/images/kevin_magnussen.jpg",
  // "Alexander Albon":    "/images/alexander_albon.jpg",
  // "Daniel Ricciardo":   "/images/daniel_ricciardo.jpg",
};

// ── Sort options ──────────────────────────────────────────────────────────────
const sortOptions: { label: string; key: SortKey }[] = [
  { label: "Championship Position", key: "standing" },
  { label: "Points",                key: "points"   },
  { label: "Wins",                  key: "wins"     },
  { label: "Name (A–Z)",            key: "name"     },
];

// ── Position badge style ──────────────────────────────────────────────────────
function positionBadgeClass(pos?: number) {
  if (!pos) return "bg-neutral-800/80 text-neutral-400 border border-neutral-700/50";
  if (pos === 1) return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40";
  if (pos === 2) return "bg-neutral-400/15 text-neutral-200 border border-neutral-400/30";
  if (pos === 3) return "bg-amber-700/20 text-amber-400 border border-amber-600/40";
  return "bg-red-950/60 text-red-400 border border-red-800/40";
}

// ─────────────────────────────────────────────────────────────────────────────

export default function DriversGrid({ drivers }: DriversGridProps) {
  const [search, setSearch]   = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("standing");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    let list = drivers.filter((d) => {
      if (!q) return true;
      return (
        d.full_name?.toLowerCase().includes(q)   ||
        d.team?.toLowerCase().includes(q)        ||
        d.code?.toLowerCase().includes(q)        ||
        d.nationality?.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sortKey === "standing") return (a.standing_position ?? 999) - (b.standing_position ?? 999);
      if (sortKey === "points")   return (b.points ?? 0) - (a.points ?? 0);
      if (sortKey === "wins")     return (b.wins   ?? 0) - (a.wins   ?? 0);
      if (sortKey === "name")     return (a.full_name ?? "").localeCompare(b.full_name ?? "");
      return 0;
    });

    return list;
  }, [drivers, search, sortKey]);

  return (
    <div>
      {/* ── Search & Filter Bar ──────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-up delay-100">
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search driver, team, nationality…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="f1-input pl-10"
          />
        </div>

        {/* Sort dropdown */}
        <div className="relative">
          <SlidersHorizontal
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none z-10"
          />
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="f1-input pl-10 pr-4 min-w-[220px] appearance-none cursor-pointer"
          >
            {sortOptions.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Result count ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-neutral-500">
          Showing{" "}
          <span className="text-white font-semibold">{filtered.length}</span> of{" "}
          {drivers.length} drivers
        </p>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-xs text-red-500 hover:text-red-400 font-semibold transition-colors"
          >
            Clear search
          </button>
        )}
      </div>

      {/* ── Driver Cards Grid ─────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg mb-2">No drivers found.</p>
          <p className="text-neutral-600 text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((driver, idx) => {
            const photoSrc = driverImages[driver.full_name];

            return (
              <div
                key={driver.driver_id}
                className="professional-card rounded-2xl overflow-hidden group animate-fade-up flex flex-col"
                style={{ animationDelay: `${0.1 + idx * 0.04}s` }}
              >
                {/* ── IMAGE AREA — full-bleed, zero border/padding ─────────── */}
                <div
                  className="relative overflow-hidden shrink-0"
                  style={{ height: "17rem" /* 272px — tall, magazine-style */ }}
                >
                  {/* Driver photo — floods entire container, no gaps */}
                  {photoSrc && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={photoSrc}
                      alt={driver.full_name}
                      className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                      style={{
                        border:      "none",
                        borderWidth: 0,
                        margin:      0,
                        padding:     0,
                      }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  )}

                  {/* Gradient fallback bg (always behind, doubles as base for gradient mesh) */}
                  <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/25 -z-0" />

                  {/* Dark gradient mesh — bottom overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent pointer-events-none" />

                  {/* Top accent line — neon red strip */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-600 via-red-500/60 to-transparent" />

                  {/* Position badge — top right */}
                  <div
                    className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-black backdrop-blur-sm ${positionBadgeClass(driver.standing_position)}`}
                  >
                    {driver.standing_position ? `P${driver.standing_position}` : "—"}
                  </div>

                  {/* Racing number watermark — large translucent, center-right */}
                  {driver.permanent_number && (
                    <div
                      className="absolute right-3 top-1/2 -translate-y-1/2 font-black leading-none select-none pointer-events-none"
                      style={{
                        fontSize: "7rem",
                        color: "rgba(255,255,255,0.06)",
                        letterSpacing: "-0.04em",
                      }}
                    >
                      {driver.permanent_number}
                    </div>
                  )}

                  {/* ── Typography overlay — anchored to the bottom ── */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-8">
                    {/* Team name */}
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.22em] mb-1 leading-none truncate"
                      style={{ color: "#E10600" }}
                    >
                      {driver.team ?? "Team N/A"}
                    </p>

                    {/* Driver full name */}
                    <h2 className="text-[1.35rem] font-black text-white leading-tight group-hover:text-red-300 transition-colors truncate">
                      {driver.full_name}
                    </h2>

                    {/* Code pill + number pill */}
                    <div className="flex items-center gap-2 mt-2">
                      {driver.code && (
                        <span className="text-[10px] font-black text-neutral-300 bg-neutral-900/80 border border-neutral-700/60 px-2 py-0.5 rounded uppercase tracking-widest backdrop-blur-sm">
                          {driver.code}
                        </span>
                      )}
                      {driver.permanent_number && (
                        <span
                          className="text-[10px] font-black px-2 py-0.5 rounded backdrop-blur-sm"
                          style={{
                            color: "#E10600",
                            background: "rgba(225,6,0,0.15)",
                            border: "1px solid rgba(225,6,0,0.35)",
                          }}
                        >
                          #{driver.permanent_number}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ── STATS STRIP — compact bottom bar ────────────────────── */}
                <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d] border-t border-neutral-800/60">
                  {/* Nationality */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 min-w-0">
                    <Flag size={11} className="text-neutral-600 shrink-0" />
                    <span className="truncate">{driver.nationality ?? "—"}</span>
                  </div>

                  {/* Points + Wins */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-[9px] text-neutral-600 uppercase tracking-wider leading-none mb-0.5">
                        PTS
                      </p>
                      <p className="text-sm font-black text-white leading-none">
                        {driver.points ?? 0}
                      </p>
                    </div>

                    <div className="w-px h-6 bg-neutral-800" />

                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-0.5">
                        <Trophy
                          size={8}
                          className="text-yellow-500"
                          fill="currentColor"
                        />
                        <p className="text-[9px] text-neutral-600 uppercase tracking-wider leading-none">
                          WINS
                        </p>
                      </div>
                      <p
                        className={`text-sm font-black leading-none ${
                          (driver.wins ?? 0) > 0 ? "text-yellow-400" : "text-white"
                        }`}
                      >
                        {driver.wins ?? 0}
                      </p>
                    </div>

                    {/* Championship points bar */}
                    <div className="hidden sm:block w-16">
                      <div className="h-[3px] bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, ((driver.points ?? 0) / 400) * 100)}%`,
                            background: "linear-gradient(90deg, #b91c1c, #E10600)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
