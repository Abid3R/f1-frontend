"use client";

import { Building2 } from "lucide-react";

interface Driver {
  team?: string;
}

interface TeamFilterChipsProps {
  drivers: Driver[];
  selectedTeam: string | null;
  onSelect: (team: string | null) => void;
}

// Match the team-accent palette used by DriversGrid so chips feel native.
function teamAccent(team: string): string {
  const t = team.toLowerCase();
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

export default function TeamFilterChips({
  drivers,
  selectedTeam,
  onSelect,
}: TeamFilterChipsProps) {
  // Unique, non-empty team names, alphabetised.
  const teams = Array.from(
    new Set(
      drivers
        .map((d) => d.team)
        .filter((t): t is string => Boolean(t && t.trim()))
    )
  ).sort();

  if (teams.length === 0) return null;

  return (
    <div className="mb-6 animate-fade-up delay-150">
      <div className="flex items-center gap-2 mb-3">
        <Building2 size={14} className="text-neutral-500" />
        <p className="text-[11px] text-neutral-500 uppercase tracking-widest font-semibold">
          Filter by Team
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {/* All teams reset chip */}
        <button
          onClick={() => onSelect(null)}
          className={`text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all ${
            selectedTeam === null
              ? "bg-red-600 border-red-500 text-white shadow-[0_0_18px_rgba(220,38,38,0.45)]"
              : "bg-neutral-900/60 border-neutral-800 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
          }`}
        >
          All Teams
        </button>

        {teams.map((team) => {
          const active = selectedTeam === team;
          const accent = teamAccent(team);
          return (
            <button
              key={team}
              onClick={() => onSelect(active ? null : team)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-full border transition-all"
              style={
                active
                  ? {
                      background: `${accent}26`,
                      borderColor: `${accent}99`,
                      color: accent,
                      boxShadow: `0 0 18px ${accent}40`,
                    }
                  : {
                      background: "rgba(23,23,23,0.6)",
                      borderColor: "rgba(38,38,38,1)",
                      color: "rgb(163,163,163)",
                    }
              }
            >
              <span
                className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 align-middle"
                style={{ background: accent }}
              />
              {team}
            </button>
          );
        })}
      </div>
    </div>
  );
}
