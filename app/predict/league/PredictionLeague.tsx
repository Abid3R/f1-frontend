"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Trophy, Lock, Unlock, Trash2 } from "lucide-react";

// 2025/2026 grid pool — could be wired to /api/drivers later
const DRIVER_POOL: { name: string; team: string; colour: string }[] = [
  { name: "Max Verstappen", team: "Red Bull", colour: "1E40AF" },
  { name: "Lando Norris", team: "McLaren", colour: "F97316" },
  { name: "Oscar Piastri", team: "McLaren", colour: "FB923C" },
  { name: "Charles Leclerc", team: "Ferrari", colour: "DC2626" },
  { name: "Lewis Hamilton", team: "Ferrari", colour: "EF4444" },
  { name: "George Russell", team: "Mercedes", colour: "06B6D4" },
  { name: "Andrea Kimi Antonelli", team: "Mercedes", colour: "0EA5E9" },
  { name: "Yuki Tsunoda", team: "Red Bull", colour: "1D4ED8" },
  { name: "Fernando Alonso", team: "Aston Martin", colour: "10B981" },
  { name: "Lance Stroll", team: "Aston Martin", colour: "14B8A6" },
  { name: "Pierre Gasly", team: "Alpine", colour: "EC4899" },
  { name: "Esteban Ocon", team: "Haas", colour: "F1F5F9" },
];

interface PodiumPick {
  p1: string;
  p2: string;
  p3: string;
}
interface Entry {
  id: string;
  player: string;
  race: string;
  picks: PodiumPick;
  locked: boolean;
  score: number | null;
  actual?: PodiumPick;
  createdAt: string;
}
const KEY = "f1-prediction-league";

function load(): Entry[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Entry[]) : [];
  } catch {
    return [];
  }
}
function save(rows: Entry[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    /* ignore */
  }
}

function scorePick(pick: PodiumPick, actual: PodiumPick): number {
  let pts = 0;
  const podium = [actual.p1, actual.p2, actual.p3];
  if (pick.p1 === actual.p1) pts += 10;
  else if (podium.includes(pick.p1)) pts += 2;
  if (pick.p2 === actual.p2) pts += 6;
  else if (podium.includes(pick.p2)) pts += 2;
  if (pick.p3 === actual.p3) pts += 4;
  else if (podium.includes(pick.p3)) pts += 2;
  return pts;
}

const EMPTY_PICK: PodiumPick = { p1: "", p2: "", p3: "" };

export default function PredictionLeague() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [player, setPlayer] = useState("");
  const [race, setRace] = useState("Australian GP");
  const [picks, setPicks] = useState<PodiumPick>(EMPTY_PICK);
  const [actual, setActual] = useState<PodiumPick>(EMPTY_PICK);

  useEffect(() => {
    setEntries(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) save(entries);
  }, [entries, hydrated]);

  const usedNames = useMemo(
    () => new Set([picks.p1, picks.p2, picks.p3].filter(Boolean)),
    [picks]
  );

  const canSubmit =
    player.trim().length > 1 &&
    picks.p1 &&
    picks.p2 &&
    picks.p3 &&
    new Set([picks.p1, picks.p2, picks.p3]).size === 3;

  const submit = useCallback(() => {
    if (!canSubmit) return;
    const entry: Entry = {
      id: Math.random().toString(36).slice(2, 10),
      player: player.trim(),
      race,
      picks: { ...picks },
      locked: true,
      score: null,
      createdAt: new Date().toISOString(),
    };
    setEntries((arr) => [entry, ...arr]);
    setPicks(EMPTY_PICK);
  }, [canSubmit, player, race, picks]);

  const applyResult = useCallback(() => {
    if (!actual.p1 || !actual.p2 || !actual.p3) return;
    if (new Set([actual.p1, actual.p2, actual.p3]).size !== 3) return;
    setEntries((arr) =>
      arr.map((e) =>
        e.race === race
          ? { ...e, score: scorePick(e.picks, actual), actual: { ...actual } }
          : e
      )
    );
  }, [actual, race]);

  const remove = (id: string) =>
    setEntries((arr) => arr.filter((e) => e.id !== id));

  const leaderboard = useMemo(() => {
    const totals = new Map<string, { player: string; total: number; races: number }>();
    for (const e of entries) {
      const cur = totals.get(e.player) ?? { player: e.player, total: 0, races: 0 };
      cur.total += e.score ?? 0;
      cur.races += 1;
      totals.set(e.player, cur);
    }
    return Array.from(totals.values()).sort((a, b) => b.total - a.total);
  }, [entries]);

  if (!hydrated) return null;

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_360px]">
      {/* ── Left: Pick + History ─────────────────────────────────────────── */}
      <div className="space-y-8">
        {/* Pick card */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
            Your <span className="text-red-500">Podium</span>
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TextInput label="Player name" value={player} onChange={setPlayer} />
            <TextInput label="Race" value={race} onChange={setRace} />
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["p1", "p2", "p3"] as const).map((slot, i) => (
              <PodiumSlot
                key={slot}
                place={i + 1}
                value={picks[slot]}
                onChange={(v) => setPicks((p) => ({ ...p, [slot]: v }))}
                pool={DRIVER_POOL}
                disabledNames={usedNames}
                selfValue={picks[slot]}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={submit}
            disabled={!canSubmit}
            className="btn-red-glow mt-6 rounded-lg px-5 py-2 text-sm font-bold disabled:opacity-40"
          >
            Lock In Pick
          </button>
        </section>

        {/* Race result card */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
            Actual <span className="text-red-500">Result</span> for{" "}
            <span className="text-zinc-100">{race}</span>
          </h2>
          <p className="mt-1 text-[11px] text-zinc-500">
            Once the race is over, enter the real podium to score every pick for
            this Grand Prix.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["p1", "p2", "p3"] as const).map((slot, i) => (
              <PodiumSlot
                key={slot}
                place={i + 1}
                value={actual[slot]}
                onChange={(v) => setActual((a) => ({ ...a, [slot]: v }))}
                pool={DRIVER_POOL}
                disabledNames={new Set([actual.p1, actual.p2, actual.p3].filter(Boolean))}
                selfValue={actual[slot]}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={applyResult}
            className="mt-5 rounded-lg border border-white/10 px-4 py-2 text-sm font-semibold text-zinc-200 hover:border-red-500/60 hover:text-white"
          >
            Score this Grand Prix
          </button>
        </section>

        {/* History */}
        <section className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-300">
            Pick <span className="text-red-500">History</span>
          </h2>
          {entries.length === 0 ? (
            <p className="mt-3 text-xs text-zinc-500">
              No picks yet — lock one in above to start the league.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-zinc-100">{e.player}</span>
                    <span className="text-[10px] text-zinc-500">{e.race}</span>
                  </div>
                  <div className="font-mono text-zinc-300">
                    <span className="text-red-400">1.</span> {e.picks.p1.split(" ").pop()} ·{" "}
                    <span className="text-red-400">2.</span> {e.picks.p2.split(" ").pop()} ·{" "}
                    <span className="text-red-400">3.</span> {e.picks.p3.split(" ").pop()}
                  </div>
                  <div className="flex items-center gap-3">
                    {e.locked ? (
                      <Lock className="h-3 w-3 text-zinc-500" />
                    ) : (
                      <Unlock className="h-3 w-3 text-zinc-500" />
                    )}
                    {e.score !== null && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 font-mono text-[11px] text-red-300">
                        {e.score} pts
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => remove(e.id)}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ── Right: Leaderboard ───────────────────────────────────────────── */}
      <aside className="rounded-2xl border border-white/10 bg-zinc-950/60 p-6">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-300">
          <Trophy className="h-4 w-4 text-red-500" /> Leaderboard
        </h2>
        {leaderboard.length === 0 ? (
          <p className="mt-3 text-xs text-zinc-500">
            No scored picks yet. Enter a race result to populate the board.
          </p>
        ) : (
          <ol className="mt-4 space-y-2">
            {leaderboard.map((row, i) => (
              <li
                key={row.player}
                className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="w-5 font-mono text-zinc-400">{i + 1}</span>
                  <span className="font-semibold text-zinc-100">{row.player}</span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-red-300">{row.total} pts</p>
                  <p className="text-[10px] text-zinc-500">
                    {row.races} race{row.races === 1 ? "" : "s"}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </aside>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 font-mono text-sm text-zinc-100 outline-none focus:border-red-500/60"
      />
    </label>
  );
}

function PodiumSlot({
  place,
  value,
  onChange,
  pool,
  disabledNames,
  selfValue,
}: {
  place: number;
  value: string;
  onChange: (v: string) => void;
  pool: typeof DRIVER_POOL;
  disabledNames: Set<string>;
  selfValue: string;
}) {
  const medal = place === 1 ? "🥇" : place === 2 ? "🥈" : "🥉";
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-widest text-zinc-500">
        {medal} P{place}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-red-500/60"
      >
        <option value="">— Select driver —</option>
        {pool.map((d) => {
          const isDisabled = disabledNames.has(d.name) && d.name !== selfValue;
          return (
            <option key={d.name} value={d.name} disabled={isDisabled}>
              {d.name} ({d.team})
            </option>
          );
        })}
      </select>
    </label>
  );
}
