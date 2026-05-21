import { Flag, Trophy, Calendar } from "lucide-react";

interface Race {
  meeting_name?: string;
  date_start?: string;
}

export default function SeasonProgress({ races }: { races: Race[] }) {
  if (!races.length) return null;

  const now = Date.now();
  const total = races.length;

  // Count past / next / remaining
  const sorted = [...races].sort((a, b) => {
    const ta = a.date_start ? new Date(a.date_start).getTime() : 0;
    const tb = b.date_start ? new Date(b.date_start).getTime() : 0;
    return ta - tb;
  });

  const pastCount = sorted.filter(
    (r) => r.date_start && new Date(r.date_start).getTime() < now
  ).length;
  const remaining = total - pastCount;
  const pct = Math.round((pastCount / total) * 100);

  const nextRace = sorted.find(
    (r) => r.date_start && new Date(r.date_start).getTime() >= now
  );
  const nextName = nextRace?.meeting_name?.replace(/Grand Prix/i, "").trim();

  return (
    <div className="mb-8 animate-fade-up">
      <div className="relative glass-card rounded-2xl border border-neutral-800/60 p-5 md:p-6 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-700/50 to-transparent" />

        {/* Stat row */}
        <div className="grid grid-cols-3 gap-4 mb-5">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
              <Flag size={11} className="text-red-500" />
              Rounds Done
            </div>
            <p className="text-2xl font-black text-white tabular-nums">
              {pastCount}
              <span className="text-neutral-700 text-base"> / {total}</span>
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
              <Trophy size={11} className="text-red-500" />
              Remaining
            </div>
            <p className="text-2xl font-black text-white tabular-nums">
              {remaining}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1.5 text-[10px] uppercase tracking-widest text-neutral-500 font-bold mb-1">
              <Calendar size={11} className="text-red-500" />
              Next Up
            </div>
            <p className="text-sm font-black text-red-400 truncate">
              {nextName ?? "Season Complete"}
            </p>
          </div>
        </div>

        {/* Round-by-round timeline */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
              Season Progress
            </p>
            <p className="text-[10px] font-black text-red-400">{pct}%</p>
          </div>
          <div className="relative h-2.5 bg-neutral-900 rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-red-700 via-red-500 to-red-400 rounded-full transition-all duration-700 shadow-[0_0_18px_rgba(220,38,38,0.55)]"
              style={{ width: `${pct}%` }}
            />
            {/* Round tick marks */}
            <div className="absolute inset-0 flex">
              {sorted.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 border-r border-black/40 last:border-r-0"
                />
              ))}
            </div>
          </div>
          <div className="flex justify-between mt-1.5 text-[9px] text-neutral-600 font-semibold">
            <span>R1</span>
            <span>R{Math.ceil(total / 2)}</span>
            <span>R{total}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
