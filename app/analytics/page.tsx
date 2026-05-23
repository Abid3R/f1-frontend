import type { Metadata } from "next";
import TeammateBattle, { type TeammateBlock } from "@/app/components/TeammateBattle";
import TyreStintVisualizer from "@/app/components/TyreStintVisualizer";

export const metadata: Metadata = {
  title: "Analytics · F1 Intel",
  description:
    "Deep-dive F1 analytics — teammate head-to-head dashboards and tyre stint timelines for the latest race weekend.",
};

// A few hand-picked teammate matchups for the 2025 season — easily extended.
const MATCHUPS: { title: string; a: TeammateBlock; b: TeammateBlock }[] = [
  {
    title: "Red Bull · Verstappen vs. Tsunoda (2025 mid-season snapshot)",
    a: {
      name: "Max Verstappen",
      acronym: "VER",
      team_colour: "1E3A8A",
      quali_wins: 11,
      race_wins: 13,
      points: 268,
      avg_pit_time: 2.27,
    },
    b: {
      name: "Yuki Tsunoda",
      acronym: "TSU",
      team_colour: "60A5FA",
      quali_wins: 3,
      race_wins: 1,
      points: 27,
      avg_pit_time: 2.41,
    },
  },
  {
    title: "McLaren · Norris vs. Piastri (2025)",
    a: {
      name: "Lando Norris",
      acronym: "NOR",
      team_colour: "F97316",
      quali_wins: 9,
      race_wins: 7,
      points: 298,
      avg_pit_time: 2.18,
    },
    b: {
      name: "Oscar Piastri",
      acronym: "PIA",
      team_colour: "FB923C",
      quali_wins: 5,
      race_wins: 7,
      points: 281,
      avg_pit_time: 2.22,
    },
  },
  {
    title: "Ferrari · Leclerc vs. Hamilton (2025)",
    a: {
      name: "Charles Leclerc",
      acronym: "LEC",
      team_colour: "DC2626",
      quali_wins: 8,
      race_wins: 9,
      points: 215,
      avg_pit_time: 2.31,
    },
    b: {
      name: "Lewis Hamilton",
      acronym: "HAM",
      team_colour: "B91C1C",
      quali_wins: 6,
      race_wins: 5,
      points: 198,
      avg_pit_time: 2.34,
    },
  },
];

export default function AnalyticsPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-red-400">
          Performance Analytics
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tight">
          Deep-Dive <span className="text-red-500">Analytics</span>
        </h1>
        <p className="mt-3 max-w-2xl text-zinc-400">
          Teammate H2H dashboards & tyre stint timelines for every car on the grid.
        </p>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {MATCHUPS.map((m) => (
          <TeammateBattle key={m.title} a={m.a} b={m.b} title={m.title} />
        ))}
      </section>

      <section className="mt-10">
        <TyreStintVisualizer />
      </section>
    </main>
  );
}
