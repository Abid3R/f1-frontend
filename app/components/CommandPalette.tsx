"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  BarChart3,
  Users,
  Calendar,
  Cpu,
  Home,
  CornerDownLeft,
} from "lucide-react";

interface Command {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  keywords: string;
  hint: string;
}

const COMMANDS: Command[] = [
  { label: "Home", href: "/", icon: Home, keywords: "home dashboard main start", hint: "Main page" },
  { label: "Driver Standings", href: "/standings", icon: BarChart3, keywords: "standings drivers championship points wins", hint: "Championship table" },
  { label: "Current Drivers", href: "/drivers", icon: Users, keywords: "drivers grid roster team", hint: "Full grid" },
  { label: "Race Schedule", href: "/races", icon: Calendar, keywords: "races schedule calendar rounds circuits", hint: "2026 calendar" },
  { label: "Pit Stop Prediction", href: "/predictions", icon: Cpu, keywords: "predict pit stop ai ml model lightgbm", hint: "AI model" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Filter commands
  const filtered = COMMANDS.filter((cmd) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      cmd.label.toLowerCase().includes(q) ||
      cmd.keywords.toLowerCase().includes(q)
    );
  });

  // Global keyboard handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Open with Ctrl/Cmd + K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (!open) return;
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => (a + 1) % Math.max(filtered.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive(
          (a) => (a - 1 + filtered.length) % Math.max(filtered.length, 1)
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[active];
        if (cmd) {
          setOpen(false);
          router.push(cmd.href);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, filtered, active, router]);

  // Focus input when opened, reset state when closed
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  // Reset active when query changes
  useEffect(() => {
    setActive(0);
  }, [query]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh] px-4"
      onClick={() => setOpen(false)}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-xl rounded-2xl border border-red-900/40 bg-neutral-950/95 shadow-[0_30px_80px_rgba(220,38,38,0.25)] overflow-hidden animate-fade-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-neutral-800">
          <Search size={18} className="text-red-500 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages… (try 'predict', 'races', 'drivers')"
            className="flex-1 bg-transparent text-white placeholder:text-neutral-500 outline-none text-base"
          />
          <kbd className="hidden sm:inline px-2 py-0.5 text-[10px] font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 rounded">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <div className="px-4 py-10 text-center text-neutral-500 text-sm">
              No matches found.
            </div>
          )}
          {filtered.map((cmd, i) => {
            const Icon = cmd.icon;
            const isActive = i === active;
            return (
              <button
                key={cmd.href}
                onMouseEnter={() => setActive(i)}
                onClick={() => {
                  setOpen(false);
                  router.push(cmd.href);
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-colors ${
                  isActive
                    ? "bg-red-950/40 border border-red-800/40"
                    : "border border-transparent hover:bg-neutral-900"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isActive
                      ? "bg-red-600/20 border border-red-600/40"
                      : "bg-neutral-900 border border-neutral-800"
                  }`}
                >
                  <Icon
                    size={16}
                    className={isActive ? "text-red-400" : "text-neutral-400"}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-bold ${
                      isActive ? "text-red-300" : "text-white"
                    }`}
                  >
                    {cmd.label}
                  </p>
                  <p className="text-xs text-neutral-500">{cmd.hint}</p>
                </div>
                {isActive && (
                  <CornerDownLeft size={14} className="text-red-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer hint */}
        <div className="flex items-center justify-between gap-3 px-5 py-2.5 border-t border-neutral-800 bg-neutral-950 text-[11px] text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[10px]">
                ↑↓
              </kbd>
              navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-neutral-900 border border-neutral-800 rounded text-[10px]">
                ⏎
              </kbd>
              open
            </span>
          </div>
          <span className="text-red-500 font-semibold">F1 Intel</span>
        </div>
      </div>
    </div>
  );
}
