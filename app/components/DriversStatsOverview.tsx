"use client";

import { Users, Briefcase, Award, Trophy } from "lucide-react";

interface Driver {
  driver_id: string;
  full_name: string;
  team?: string;
  points?: number;
  wins?: number;
}

interface StatCard {
  label: string;
  value: number | string;
  icon: typeof Users;
  accent: string;
  ring: string;
  iconBg: string;
}

export default function DriversStatsOverview({
  drivers,
}: {
  drivers: Driver[];
}) {
  const totalDrivers = drivers.length;
  const teams = new Set(
    drivers
      .map((d) => d.team)
      .filter((t): t is string => Boolean(t && t.trim()))
  );
  const totalTeams = teams.size;
  const totalPoints = drivers.reduce((acc, d) => acc + (d.points ?? 0), 0);
  const totalWins = drivers.reduce((acc, d) => acc + (d.wins ?? 0), 0);

  const cards: StatCard[] = [
    {
      label: "Total Drivers",
      value: totalDrivers,
      icon: Users,
      accent: "text-red-400",
      ring: "border-red-900/40",
      iconBg: "bg-red-950/40",
    },
    {
      label: "Active Teams",
      value: totalTeams,
      icon: Briefcase,
      accent: "text-blue-400",
      ring: "border-blue-900/40",
      iconBg: "bg-blue-950/40",
    },
    {
      label: "Total Points",
      value: totalPoints.toLocaleString(),
      icon: Award,
      accent: "text-emerald-400",
      ring: "border-emerald-900/40",
      iconBg: "bg-emerald-950/40",
    },
    {
      label: "Total Wins",
      value: totalWins,
      icon: Trophy,
      accent: "text-yellow-400",
      ring: "border-yellow-900/40",
      iconBg: "bg-yellow-950/40",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 animate-fade-up">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={`professional-card rounded-xl p-4 border ${card.ring} flex items-center gap-3 group hover:scale-[1.02] transition-transform`}
          >
            <div
              className={`${card.iconBg} ${card.accent} p-2.5 rounded-lg shrink-0`}
            >
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold mb-0.5">
                {card.label}
              </p>
              <p className={`text-xl md:text-2xl font-black leading-none ${card.accent}`}>
                {card.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
