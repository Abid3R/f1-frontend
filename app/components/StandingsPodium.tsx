import { Trophy, Medal, Award } from "lucide-react";

interface DriverStanding {
  position: number;
  driver: string;
  code?: string;
  team: string;
  points: number;
  wins: number;
}

const PODIUM_META = [
  {
    pos: 1,
    icon: Trophy,
    label: "P1 Leader",
    height: "h-44",
    accent: "from-yellow-500 to-yellow-700",
    text: "text-yellow-400",
    border: "border-yellow-500/40",
    glow: "shadow-[0_0_60px_rgba(234,179,8,0.18)]",
  },
  {
    pos: 2,
    icon: Medal,
    label: "P2",
    height: "h-36",
    accent: "from-neutral-300 to-neutral-500",
    text: "text-neutral-200",
    border: "border-neutral-500/40",
    glow: "shadow-[0_0_40px_rgba(212,212,212,0.10)]",
  },
  {
    pos: 3,
    icon: Award,
    label: "P3",
    height: "h-28",
    accent: "from-amber-600 to-amber-800",
    text: "text-amber-400",
    border: "border-amber-700/40",
    glow: "shadow-[0_0_40px_rgba(180,83,9,0.18)]",
  },
];

// Visual order on the podium: P2 | P1 | P3
const VISUAL_ORDER = [2, 1, 3];

export default function StandingsPodium({
  standings,
}: {
  standings: DriverStanding[];
}) {
  // Pull top 3 by position
  const podium = VISUAL_ORDER.map((pos) =>
    standings.find((d) => d.position === pos)
  );

  if (!podium[1]) return null; // Need at least the leader

  const leaderPoints = podium[1]?.points ?? 0;

  return (
    <section className="px-6 max-w-7xl mx-auto mt-2 mb-4 animate-fade-up">
      <div className="relative glass-card rounded-2xl border border-red-900/30 overflow-hidden p-6 md:p-8">
        {/* Background accents */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.10),transparent_60%)] pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

        {/* Header */}
        <div className="relative flex items-center justify-between mb-6">
          <div>
            <p className="text-red-500 font-bold uppercase tracking-[0.22em] text-[10px] mb-1">
              Championship Podium
            </p>
            <h3 className="text-xl font-black text-white">Top 3 Drivers</h3>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/40 border border-red-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-dot-pulse" />
            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
              Live
            </span>
          </div>
        </div>

        {/* Podium */}
        <div className="relative grid grid-cols-3 gap-3 md:gap-5 items-end">
          {podium.map((driver, idx) => {
            const meta = PODIUM_META.find((m) => m.pos === VISUAL_ORDER[idx])!;
            const Icon = meta.icon;
            if (!driver) {
              return (
                <div
                  key={meta.pos}
                  className={`relative ${meta.height} rounded-xl border border-neutral-800/60 bg-neutral-950/60 flex items-center justify-center`}
                >
                  <span className="text-neutral-700 text-xs">—</span>
                </div>
              );
            }

            const gap =
              meta.pos === 1
                ? 0
                : leaderPoints - driver.points;

            return (
              <div
                key={driver.position}
                className={`relative rounded-xl border ${meta.border} bg-gradient-to-b from-neutral-950 to-black overflow-hidden ${meta.glow} flex flex-col`}
              >
                {/* Top accent bar */}
                <div
                  className={`h-1 bg-gradient-to-r ${meta.accent}`}
                />

                <div className={`relative ${meta.height} flex flex-col items-center justify-end p-4`}>
                  {/* Background big position */}
                  <span
                    aria-hidden
                    className={`absolute -top-2 right-2 font-black opacity-[0.08] select-none ${meta.text}`}
                    style={{ fontSize: "5rem", lineHeight: 1 }}
                  >
                    {driver.position}
                  </span>

                  {/* Icon */}
                  <div className={`mb-2 ${meta.text}`}>
                    <Icon size={meta.pos === 1 ? 28 : 22} />
                  </div>

                  {/* Driver name */}
                  <p className="text-white font-black text-sm md:text-base text-center leading-tight truncate w-full">
                    {driver.driver}
                  </p>

                  {/* Team */}
                  <p className="text-[10px] text-neutral-500 font-semibold uppercase tracking-widest mt-0.5 text-center truncate w-full">
                    {driver.team}
                  </p>
                </div>

                {/* Stats footer */}
                <div className="flex items-center justify-between gap-2 px-3 py-2.5 border-t border-neutral-800/60 bg-black/60">
                  <div>
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest leading-none">
                      Points
                    </p>
                    <p className={`text-base font-black leading-tight ${meta.text}`}>
                      {driver.points}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] text-neutral-600 uppercase tracking-widest leading-none">
                      {meta.pos === 1 ? "Wins" : "Gap"}
                    </p>
                    <p className="text-base font-black text-white leading-tight">
                      {meta.pos === 1 ? driver.wins : `-${gap}`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
