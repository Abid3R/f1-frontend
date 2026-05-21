"use client";

import { useEffect, useState } from "react";
import { Clock, MapPin, Flag } from "lucide-react";
import { fetchRaceSchedule } from "@/lib/api";

interface Race {
  round?: number;
  meeting_name?: string;
  country_name?: string;
  location?: string;
  date_start?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(target: Date): TimeLeft | null {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function NextRaceCountdown() {
  const [race, setRace] = useState<Race | null>(null);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch next race once
  useEffect(() => {
    fetchRaceSchedule(2026)
      .then((data: Race[]) => {
        const now = Date.now();
        const upcoming = data
          .filter((r) => r.date_start && new Date(r.date_start).getTime() > now)
          .sort(
            (a, b) =>
              new Date(a.date_start!).getTime() -
              new Date(b.date_start!).getTime()
          );
        setRace(upcoming[0] ?? data[0] ?? null);
      })
      .catch(() => setError("backend offline"));
  }, []);

  // Tick every second
  useEffect(() => {
    if (!race?.date_start) return;
    const target = new Date(race.date_start);
    const update = () => setTimeLeft(calcTimeLeft(target));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [race]);

  if (error || !race) return null;

  const units = [
    { label: "Days", value: timeLeft?.days ?? 0 },
    { label: "Hours", value: timeLeft?.hours ?? 0 },
    { label: "Minutes", value: timeLeft?.minutes ?? 0 },
    { label: "Seconds", value: timeLeft?.seconds ?? 0 },
  ];

  return (
    <section className="relative px-6 -mt-6 mb-12 z-20">
      <div className="max-w-7xl mx-auto">
        <div className="relative glass-card rounded-2xl border border-red-900/40 overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.18),transparent_60%)] pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent" />

          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 md:p-8 items-center">
            {/* Left: race info */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/40 border border-red-800/40 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-dot-pulse" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">
                  Next Race · Round {race.round}
                </span>
              </div>
              <h3 className="text-2xl md:text-3xl font-black text-white mb-2 leading-tight">
                {race.meeting_name?.replace(/Grand Prix/i, "").trim() ||
                  "Next GP"}
                <span className="text-red-500 ml-2">GP</span>
              </h3>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-red-500" />
                  {race.location ?? race.country_name ?? "TBC"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Flag size={14} className="text-red-500" />
                  {race.country_name ?? "—"}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-red-500" />
                  {race.date_start
                    ? new Date(race.date_start).toLocaleDateString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "TBC"}
                </span>
              </div>
            </div>

            {/* Right: countdown digits */}
            <div className="grid grid-cols-4 gap-3">
              {units.map((u) => (
                <div
                  key={u.label}
                  className="relative bg-neutral-950/80 border border-neutral-800 rounded-xl p-3 text-center overflow-hidden"
                >
                  <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />
                  <p className="text-3xl md:text-4xl font-black text-white tabular-nums tracking-tight">
                    {String(u.value).padStart(2, "0")}
                  </p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mt-1">
                    {u.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
