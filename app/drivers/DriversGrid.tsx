"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, Trophy, Star, Flag } from "lucide-react";
import ClientImage from "../components/ClientImage";

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

const sortOptions: { label: string; key: SortKey }[] = [
  { label: "Championship Position", key: "standing" },
  { label: "Points", key: "points" },
  { label: "Wins", key: "wins" },
  { label: "Name (A–Z)", key: "name" },
];

function positionBadgeColor(pos?: number) {
  if (!pos) return "bg-neutral-800 text-neutral-400";
  if (pos === 1) return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
  if (pos === 2) return "bg-neutral-400/20 text-neutral-300 border border-neutral-400/30";
  if (pos === 3) return "bg-amber-700/20 text-amber-500 border border-amber-600/30";
  return "bg-red-950/40 text-red-400 border border-red-800/30";
}

export default function DriversGrid({ drivers }: DriversGridProps) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("standing");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    let list = drivers.filter((d) => {
      if (!q) return true;
      return (
        d.full_name?.toLowerCase().includes(q) ||
        d.team?.toLowerCase().includes(q) ||
        d.code?.toLowerCase().includes(q) ||
        d.nationality?.toLowerCase().includes(q)
      );
    });

    list = [...list].sort((a, b) => {
      if (sortKey === "standing")
        return (a.standing_position ?? 999) - (b.standing_position ?? 999);
      if (sortKey === "points") return (b.points ?? 0) - (a.points ?? 0);
      if (sortKey === "wins") return (b.wins ?? 0) - (a.wins ?? 0);
      if (sortKey === "name")
        return (a.full_name ?? "").localeCompare(b.full_name ?? "");
      return 0;
    });

    return list;
  }, [drivers, search, sortKey]);

  return (
    <div>
      {/* ── Search & Filter Bar ───────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-up delay-100">
        {/* Search */}
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

        {/* Sort */}
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

      {/* ── Result count ─────────────────────────────────────────────── */}
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

      {/* ── Driver Cards Grid ─────────────────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg mb-2">No drivers found.</p>
          <p className="text-neutral-600 text-sm">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((driver, idx) => (
            <div
              key={driver.driver_id}
              className="professional-card rounded-2xl overflow-hidden group animate-fade-up"
              style={{ animationDelay: `${0.1 + idx * 0.04}s` }}
            >
              {/* Card top — image / gradient area */}
              <div className="relative h-36 bg-gradient-to-br from-neutral-900 via-neutral-950 to-red-950/20 overflow-hidden">
                <ClientImage
                  src="/images/driver-placeholder.png"
                  alt={driver.full_name}
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-transparent to-transparent" />

                {/* Position badge top-right */}
                <div
                  className={`absolute top-3 right-3 rounded-full px-3 py-1 text-xs font-bold ${positionBadgeColor(driver.standing_position)}`}
                >
                  {driver.standing_position
                    ? `#${driver.standing_position}`
                    : "—"}
                </div>

                {/* Driver code bottom-left */}
                <div className="absolute bottom-3 left-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 border-2 border-red-500/50 flex items-center justify-center shadow-lg">
                    <span className="text-white font-black text-sm tracking-tight">
                      {driver.code ?? "F1"}
                    </span>
                  </div>
                </div>

                {/* Permanent number badge */}
                {driver.permanent_number && (
                  <div className="absolute bottom-3 right-3 text-neutral-700 font-black text-4xl leading-none select-none">
                    {driver.permanent_number}
                  </div>
                )}
              </div>

              {/* Card body */}
              <div className="p-5 relative z-10">
                {/* Name */}
                <h2 className="text-xl font-black mb-0.5 group-hover:text-red-400 transition-colors leading-tight">
                  {driver.full_name}
                </h2>

                {/* Team */}
                <p className="text-red-500 text-xs font-bold uppercase tracking-wider mb-4">
                  {driver.team ?? "Team not available"}
                </p>

                {/* Info rows */}
                <div className="space-y-2 mb-5">
                  {driver.nationality && (
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <Flag size={13} className="text-neutral-600 shrink-0" />
                      {driver.nationality}
                    </div>
                  )}
                  {driver.permanent_number && (
                    <div className="flex items-center gap-2 text-sm text-neutral-400">
                      <span className="text-neutral-600 text-xs font-bold w-[13px] text-center">
                        #
                      </span>
                      Car {driver.permanent_number}
                    </div>
                  )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-neutral-900/80 border border-neutral-800/60 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star
                        size={11}
                        className="text-red-500 shrink-0"
                        fill="currentColor"
                      />
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wide font-semibold">
                        Points
                      </p>
                    </div>
                    <p className="text-2xl font-black text-white">
                      {driver.points ?? 0}
                    </p>
                  </div>

                  <div className="rounded-xl bg-neutral-900/80 border border-neutral-800/60 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Trophy
                        size={11}
                        className="text-yellow-500 shrink-0"
                        fill="currentColor"
                      />
                      <p className="text-[10px] text-neutral-500 uppercase tracking-wide font-semibold">
                        Wins
                      </p>
                    </div>
                    <p
                      className={`text-2xl font-black ${(driver.wins ?? 0) > 0 ? "text-yellow-400" : "text-white"}`}
                    >
                      {driver.wins ?? 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
