"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Trophy, Flag, CheckSquare, Square, ArrowLeftRight } from "lucide-react";
import DriversStatsOverview from "../components/DriversStatsOverview";
import TeamFilterChips from "../components/TeamFilterChips";
import DriverCompare from "../components/DriverCompare";

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

// ── Driver photo overrides ────────────────────────────────────────────────────
// These 4 are the documented showcase drivers per the image mapping guide.
// ALL other drivers are auto-resolved: "George Russell" → /images/george_russell.jpg
// Add overrides here ONLY when the filename doesn't match the auto-convention.
//
// To add more drivers — copy any commented line, remove the //, update the name:
// ─────────────────────────────────────────────────────────────────────────────
const driverImageOverrides: Record<string, string> = {
  // ── All 21 drivers — one entry per driver ─────────────────────────────────
  "Max Verstappen":          "/images/max_verstappen.jpg",
  "Liam Lawson":             "/images/liam_lawson.jpg",
  "George Russell":          "/images/george_russell_hd.avif",
  "Andrea Kimi Antonelli":   "/images/andrea_kimi_antonelli_hd.avif",
  "Kimi Antonelli":          "/images/andrea_kimi_antonelli_hd.avif", // API short alias
  "Charles Leclerc":         "/images/charles_leclerc_hd.webp",
  "Lewis Hamilton":          "/images/lewis_hamilton.jpg",
  "Lando Norris":            "/images/lando_norris.jpg",
  "Oscar Piastri":           "/images/oscar_piastri.png",    // PNG
  "Fernando Alonso":         "/images/fernando_alonso.jpg",
  "Lance Stroll":            "/images/lance_stroll.jpg",
  "Pierre Gasly":            "/images/pierre_gasly.jpg",
  "Esteban Ocon":            "/images/esteban_ocon.jpg",
  "Alexander Albon":         "/images/alexander_albon.jpg",
  "Carlos Sainz":            "/images/carlos_sainz.jpg",
  "Oliver Bearman":          "/images/oliver_bearman.jpeg",  // JPEG
  "Isack Hadjar":            "/images/isack_hadjar.png",     // PNG
  "Valtteri Bottas":         "/images/valtteri_bottas.jpg",
  "Gabriel Bortoleto":       "/images/gabriel_bortoleto.jpg",
  "Nico Hülkenberg":         "/images/nico_hulkenberg.jpg",
  "Nico Hulkenberg":         "/images/nico_hulkenberg.jpg",  // ASCII alias
  "Franco Colapinto":        "/images/franco_colapinto.png", // PNG
  "Arvid Lindblad":          "/images/arvid_lindblad.jpg",
  "Sergio Pérez":            "/images/sergio_perez.jpg",
  "Sergio Perez":            "/images/sergio_perez.jpg",  // ASCII alias
};

/** Auto-derives the image path from a driver's full name.
 *  "George Russell" → "/images/george_russell.jpg"
 *  Respects overrides above when present.                     */
function driverPhotoSrc(fullName: string): string {
  return (
    driverImageOverrides[fullName] ??
    `/images/${fullName
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")}.jpg`
  );
}

// ── Team color palette ────────────────────────────────────────────────────────
// gradient: card background when no photo is loaded
// accent:   top line, number pill, points bar, team label
// ─────────────────────────────────────────────────────────────────────────────
interface TeamStyle {
  gradient: string;
  accent: string;
}

function getTeamStyle(team?: string): TeamStyle {
  const t = (team ?? "").toLowerCase();
  if (t.includes("red bull"))
    return { gradient: "linear-gradient(145deg,#020c20,#0c2460)", accent: "#3671C6" };
  if (t.includes("mercedes"))
    return { gradient: "linear-gradient(145deg,#021a18,#074a44)", accent: "#27F4D2" };
  if (t.includes("ferrari"))
    return { gradient: "linear-gradient(145deg,#1a0005,#4a000f)", accent: "#E8002D" };
  if (t.includes("mclaren"))
    return { gradient: "linear-gradient(145deg,#1a0d00,#502800)", accent: "#FF8000" };
  if (t.includes("aston"))
    return { gradient: "linear-gradient(145deg,#021410,#073d30)", accent: "#358C75" };
  if (t.includes("alpine"))
    return { gradient: "linear-gradient(145deg,#18002a,#30005a)", accent: "#FF87BC" };
  if (t.includes("williams"))
    return { gradient: "linear-gradient(145deg,#020b1c,#062244)", accent: "#64C4FF" };
  if (t.includes("haas"))
    return { gradient: "linear-gradient(145deg,#0e0e0e,#242424)", accent: "#E8002D" };
  if (t.includes("rb") || t.includes("racing bulls") || t.includes("alphatauri"))
    return { gradient: "linear-gradient(145deg,#020820,#0c1c58)", accent: "#6692FF" };
  if (t.includes("sauber") || t.includes("kick") || t.includes("alfa"))
    return { gradient: "linear-gradient(145deg,#020d02,#083010)", accent: "#52E252" };
  // default F1 red theme
  return { gradient: "linear-gradient(145deg,#0d0d0d,#1a0507)", accent: "#E10600" };
}

// ── Sort options ──────────────────────────────────────────────────────────────
const sortOptions: { label: string; key: SortKey }[] = [
  { label: "Championship Position", key: "standing" },
  { label: "Points",                key: "points"   },
  { label: "Wins",                  key: "wins"     },
  { label: "Name (A–Z)",            key: "name"     },
];

// ── Position badge class ──────────────────────────────────────────────────────
function positionBadgeClass(pos?: number) {
  if (!pos) return "bg-neutral-800/80 text-neutral-400 border border-neutral-700/40";
  if (pos === 1) return "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40";
  if (pos === 2) return "bg-neutral-400/15 text-neutral-200 border border-neutral-400/30";
  if (pos === 3) return "bg-amber-700/20 text-amber-400 border border-amber-600/40";
  return "bg-red-950/60 text-red-400 border border-red-800/40";
}

// ── Single driver card ────────────────────────────────────────────────────────
// Extracted as its own component so the image-error state is per-card.
function DriverCard({
  driver,
  index,
  compareMode,
  selected,
  onToggle,
  selectionDisabled,
}: {
  driver: Driver;
  index: number;
  compareMode: boolean;
  selected: boolean;
  onToggle: () => void;
  selectionDisabled: boolean;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  const photoSrc   = driverPhotoSrc(driver.full_name);
  const teamStyle  = getTeamStyle(driver.team);
  const { accent } = teamStyle;

  // Max points for the progress bar reference (top driver ≈ 400)
  const barWidth = `${Math.min(100, ((driver.points ?? 0) / 400) * 100)}%`;

  return (
    <div
      className={`professional-card rounded-2xl overflow-hidden group animate-fade-up flex flex-col relative ${
        selected ? "ring-2 ring-red-500/70 shadow-[0_0_30px_rgba(220,38,38,0.35)]" : ""
      }`}
      style={{ animationDelay: `${0.1 + index * 0.04}s` }}
    >
      {/* Compare checkbox — only visible in compare mode */}
      {compareMode && (
        <button
          onClick={onToggle}
          disabled={selectionDisabled && !selected}
          className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm transition-all ${
            selected
              ? "bg-red-600 text-white border border-red-500 shadow-[0_0_18px_rgba(220,38,38,0.55)]"
              : selectionDisabled
              ? "bg-neutral-900/60 text-neutral-600 border border-neutral-800 cursor-not-allowed"
              : "bg-black/60 text-neutral-200 border border-neutral-700/60 hover:border-red-500/60 hover:text-white"
          }`}
          aria-pressed={selected}
        >
          {selected ? <CheckSquare size={12} /> : <Square size={12} />}
          {selected ? "Selected" : "Compare"}
        </button>
      )}
      {/* ────────────────────────────────────────────────────────────────
          IMAGE AREA  (272 px tall, full-bleed)
          Layer order (back → front):
            1. Team gradient base  — always visible
            2. Large number glyph  — team accent, very faint
            3. Driver photo        — overlays gradient; hidden on error
            4. Dark gradient mesh  — locks text readability
            5. Top accent line     — team color
            6. Position badge      — top-right
            7. Typography overlay  — name / team / code / number
          ──────────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden shrink-0"
        style={{ height: "17rem" }}
      >
        {/* 1. Team gradient base */}
        <div
          className="absolute inset-0"
          style={{ background: teamStyle.gradient }}
        />

        {/* 2. Large racing number — team accent, behind photo */}
        {driver.permanent_number && (
          <div
            className="absolute inset-0 flex items-center justify-end pr-6 select-none pointer-events-none overflow-hidden"
            aria-hidden="true"
          >
            <span
              className="font-black leading-none"
              style={{
                fontSize: "10rem",
                color: accent,
                opacity: 0.18,
                letterSpacing: "-0.05em",
              }}
            >
              {driver.permanent_number}
            </span>
          </div>
        )}

        {/* 3. Driver photo — floods container, auto-hidden on load failure */}
        {!imgFailed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoSrc}
            alt={driver.full_name}
            className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            style={{ border: "none", borderWidth: 0, margin: 0, padding: 0 }}
            onError={() => setImgFailed(true)}
          />
        )}

        {/* 4. Dark gradient mesh — text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none" />

        {/* 5. Top accent line — team color */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] pointer-events-none"
          style={{
            background: `linear-gradient(90deg, ${accent}, ${accent}55, transparent)`,
          }}
        />

        {/* 6. Position badge — top right */}
        <div
          className={`absolute top-3 right-3 rounded-full px-2.5 py-1 text-[11px] font-black backdrop-blur-sm ${positionBadgeClass(driver.standing_position)}`}
        >
          {driver.standing_position ? `P${driver.standing_position}` : "—"}
        </div>

        {/* 7. Typography overlay — bottom */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-10">
          {/* Team */}
          <p
            className="text-[10px] font-black uppercase tracking-[0.22em] mb-1 leading-none truncate"
            style={{ color: accent }}
          >
            {driver.team ?? "Team N/A"}
          </p>

          {/* Driver full name */}
          <h2 className="text-[1.3rem] font-black text-white leading-tight group-hover:text-red-300 transition-colors truncate">
            {driver.full_name}
          </h2>

          {/* Code + number pills */}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {driver.code && (
              <span className="text-[10px] font-black text-neutral-200 bg-black/60 border border-white/15 px-2 py-0.5 rounded uppercase tracking-widest backdrop-blur-sm">
                {driver.code}
              </span>
            )}
            {driver.permanent_number && (
              <span
                className="text-[10px] font-black px-2 py-0.5 rounded backdrop-blur-sm"
                style={{
                  color: accent,
                  background: `${accent}22`,
                  border: `1px solid ${accent}55`,
                }}
              >
                #{driver.permanent_number}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────────────
          STATS STRIP  — compact bottom bar
          ──────────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d0d0d] border-t border-neutral-800/50">
        {/* Nationality */}
        <div className="flex items-center gap-1.5 text-xs text-neutral-500 min-w-0">
          <Flag size={11} className="text-neutral-600 shrink-0" />
          <span className="truncate">{driver.nationality ?? "—"}</span>
        </div>

        {/* Points + Wins + bar */}
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
              <Trophy size={8} className="text-yellow-500" fill="currentColor" />
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

          {/* Points progress bar — team accent color */}
          <div className="hidden sm:block w-14">
            <div className="h-[3px] bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: barWidth,
                  background: `linear-gradient(90deg, ${accent}88, ${accent})`,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Grid container ────────────────────────────────────────────────────────────
export default function DriversGrid({ drivers }: DriversGridProps) {
  const [search, setSearch]       = useState("");
  const [sortKey, setSortKey]     = useState<SortKey>("standing");
  const [teamFilter, setTeamFilter] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    let list = drivers.filter((d) => {
      if (teamFilter && d.team !== teamFilter) return false;
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
  }, [drivers, search, sortKey, teamFilter]);

  const selectedDrivers = selectedIds
    .map((id) => drivers.find((d) => d.driver_id === id))
    .filter((d): d is Driver => Boolean(d));

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2)  return prev; // cap at 2
      return [...prev, id];
    });
  };

  const exitCompare = () => {
    setCompareMode(false);
    setSelectedIds([]);
  };

  return (
    <div>
      {/* ── Season Stats Overview ────────────────────────────────────── */}
      <DriversStatsOverview drivers={drivers} />

      {/* ── Search & Filter Bar ──────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 animate-fade-up delay-100">
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

        <button
          onClick={() => {
            if (compareMode) exitCompare();
            else setCompareMode(true);
          }}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-widest border transition-all ${
            compareMode
              ? "bg-red-600 border-red-500 text-white shadow-[0_0_18px_rgba(220,38,38,0.45)]"
              : "bg-neutral-900/60 border-neutral-800 text-neutral-300 hover:border-red-600/60 hover:text-white"
          }`}
        >
          <ArrowLeftRight size={14} />
          {compareMode ? "Exit Compare" : "Compare"}
        </button>
      </div>

      {/* ── Team filter chips ────────────────────────────────────────── */}
      <TeamFilterChips
        drivers={drivers}
        selectedTeam={teamFilter}
        onSelect={setTeamFilter}
      />

      {/* ── Compare panel (renders once 2 drivers selected) ──────────── */}
      {compareMode && selectedDrivers.length === 2 && (
        <DriverCompare
          a={selectedDrivers[0]}
          b={selectedDrivers[1]}
          onClear={() => setSelectedIds([])}
        />
      )}

      {/* ── Compare-mode hint ────────────────────────────────────────── */}
      {compareMode && selectedDrivers.length < 2 && (
        <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-950/30 border border-red-900/40 text-sm text-red-200">
          <ArrowLeftRight size={14} className="text-red-400" />
          Select <span className="font-bold text-white">{2 - selectedDrivers.length}</span>{" "}
          {2 - selectedDrivers.length === 1 ? "more driver" : "drivers"} to see a side-by-side comparison.
        </div>
      )}

      {/* ── Result count ─────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-neutral-500">
          Showing{" "}
          <span className="text-white font-semibold">{filtered.length}</span> of{" "}
          {drivers.length} drivers
          {teamFilter && (
            <span className="ml-2 text-red-400 font-semibold">· {teamFilter}</span>
          )}
        </p>
        {(search || teamFilter) && (
          <button
            onClick={() => {
              setSearch("");
              setTeamFilter(null);
            }}
            className="text-xs text-red-500 hover:text-red-400 font-semibold transition-colors"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* ── Cards grid ───────────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg mb-2">No drivers found.</p>
          <p className="text-neutral-600 text-sm">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((driver, idx) => (
            <DriverCard
              key={driver.driver_id}
              driver={driver}
              index={idx}
              compareMode={compareMode}
              selected={selectedIds.includes(driver.driver_id)}
              onToggle={() => toggleSelect(driver.driver_id)}
              selectionDisabled={selectedIds.length >= 2}
            />
          ))}
        </div>
      )}
    </div>
  );
}
