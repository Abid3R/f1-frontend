interface RaceStatusBadgeProps {
  dateStr?: string;
}

/** Pure server-side badge showing if a race is past, this week, upcoming, or TBC. */
export default function RaceStatusBadge({ dateStr }: RaceStatusBadgeProps) {
  if (!dateStr) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
        TBC
      </span>
    );
  }

  const raceTime = new Date(dateStr).getTime();
  const now = Date.now();
  const diffMs = raceTime - now;
  const diffDays = diffMs / 86_400_000;

  // Past race
  if (diffDays < -1) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
        <span className="w-1 h-1 rounded-full bg-neutral-600" />
        Finished
      </span>
    );
  }

  // Within race weekend (±24h)
  if (diffDays >= -1 && diffDays <= 1) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/25 border border-red-500/50 text-[10px] font-black text-red-300 uppercase tracking-widest">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-dot-pulse" />
        Live
      </span>
    );
  }

  // Race within 7 days
  if (diffDays <= 7) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-600/15 border border-amber-600/40 text-[10px] font-black text-amber-400 uppercase tracking-widest">
        <span className="w-1 h-1 rounded-full bg-amber-400" />
        This Week · {Math.ceil(diffDays)}d
      </span>
    );
  }

  // Upcoming
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-600/10 border border-green-700/40 text-[10px] font-black text-green-400 uppercase tracking-widest">
      <span className="w-1 h-1 rounded-full bg-green-500" />
      In {Math.ceil(diffDays)}d
    </span>
  );
}
