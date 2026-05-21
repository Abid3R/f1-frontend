"use client";

import { Sparkles, Flame, Snowflake, AlertTriangle } from "lucide-react";

export interface PresetScenario {
  label: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
  values: {
    compound: string;
    lap_number: number;
    tyre_life: number;
    position: number;
    lap_time_delta: number;
    cumulative_degradation: number;
    race_progress: number;
    position_change: number;
  };
}

const PRESETS: PresetScenario[] = [
  {
    label: "Fresh Tyres",
    description: "Just-pitted, full pace ahead",
    icon: Snowflake,
    accent: "text-sky-400 border-sky-700/40 hover:bg-sky-900/20",
    values: {
      compound: "MEDIUM",
      lap_number: 12,
      tyre_life: 4,
      position: 5,
      lap_time_delta: -0.3,
      cumulative_degradation: 0.2,
      race_progress: 0.2,
      position_change: 1,
    },
  },
  {
    label: "Tyre Cliff",
    description: "Severe wear, pit overdue",
    icon: AlertTriangle,
    accent: "text-red-400 border-red-700/40 hover:bg-red-900/20",
    values: {
      compound: "SOFT",
      lap_number: 38,
      tyre_life: 36,
      position: 6,
      lap_time_delta: 2.1,
      cumulative_degradation: 5.4,
      race_progress: 0.65,
      position_change: -3,
    },
  },
  {
    label: "Mid-Stint",
    description: "Mid race, healthy mediums",
    icon: Sparkles,
    accent: "text-amber-400 border-amber-700/40 hover:bg-amber-900/20",
    values: {
      compound: "MEDIUM",
      lap_number: 28,
      tyre_life: 18,
      position: 4,
      lap_time_delta: 0.4,
      cumulative_degradation: 1.6,
      race_progress: 0.5,
      position_change: 0,
    },
  },
  {
    label: "Soft Attack",
    description: "Late softs, undercut window",
    icon: Flame,
    accent: "text-orange-400 border-orange-700/40 hover:bg-orange-900/20",
    values: {
      compound: "SOFT",
      lap_number: 48,
      tyre_life: 22,
      position: 3,
      lap_time_delta: 1.0,
      cumulative_degradation: 2.8,
      race_progress: 0.8,
      position_change: 2,
    },
  },
];

export default function PredictionPresets({
  onApply,
}: {
  onApply: (preset: PresetScenario["values"]) => void;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.22em]">
          Quick Scenarios
        </p>
        <p className="text-[10px] text-neutral-600">Click to auto-fill form</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {PRESETS.map((p) => {
          const Icon = p.icon;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => onApply(p.values)}
              className={`group relative rounded-xl border bg-neutral-950/60 px-3 py-3 text-left transition-all ${p.accent}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Icon size={14} />
                <span className="text-sm font-black text-white">{p.label}</span>
              </div>
              <p className="text-[11px] text-neutral-500 leading-snug">
                {p.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
