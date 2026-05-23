"use client";

import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { useGarage } from "@/lib/garage";

export default function GarageHero() {
  const { driver, constructor: team, hydrated, clear } = useGarage();

  // Avoid SSR/CSR mismatch — render nothing until localStorage is read
  if (!hydrated) return null;

  if (!driver && !team) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-6">
        <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-950/40 p-6 text-center text-sm text-zinc-500">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-red-500/80">
            Personal Garage
          </p>
          Tap the <Star className="inline h-3 w-3 align-text-bottom" /> on any
          driver and the <Heart className="inline h-3 w-3 align-text-bottom" />{" "}
          on any team to pin them here.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-6">
      <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-zinc-950 via-zinc-950 to-red-950/30 p-6 shadow-[0_0_60px_-30px_rgba(220,38,38,0.7)]">
        <div className="flex items-center justify-between">
          <p className="text-[11px] uppercase tracking-[0.4em] text-red-500/80">
            My Garage
          </p>
          <button
            type="button"
            onClick={clear}
            className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-red-400"
          >
            Reset
          </button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {driver && (
            <Link
              href={`/drivers`}
              className="block rounded-xl border border-white/10 bg-black/40 p-4 transition hover:border-red-500/60"
            >
              <div className="flex items-center gap-4">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-full font-mono text-lg font-black"
                  style={{
                    background: driver.team_colour
                      ? `#${driver.team_colour}`
                      : "#dc2626",
                    color: "#000",
                  }}
                >
                  {driver.number}
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Favourite driver
                  </p>
                  <p className="text-lg font-bold">{driver.full_name}</p>
                  {driver.team_name && (
                    <p className="text-xs text-zinc-400">{driver.team_name}</p>
                  )}
                </div>
              </div>
            </Link>
          )}

          {team && (
            <Link
              href={`/standings`}
              className="block rounded-xl border border-white/10 bg-black/40 p-4 transition hover:border-red-500/60"
            >
              <div className="flex items-center gap-4">
                <span
                  className="block h-12 w-2 rounded-full"
                  style={{
                    background: team.colour ? `#${team.colour}` : "#dc2626",
                    boxShadow: `0 0 16px ${team.colour ? `#${team.colour}` : "#dc2626"}88`,
                  }}
                />
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-500">
                    Favourite team
                  </p>
                  <p className="text-lg font-bold">{team.name}</p>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
