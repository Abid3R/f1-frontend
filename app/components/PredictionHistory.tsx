"use client";

import { useEffect, useState } from "react";
import { History, Trash2, CheckCircle2, XCircle } from "lucide-react";

export interface HistoryItem {
  id: string;
  driver: string;
  compound: string;
  percentage: number;
  will_pit: boolean;
  ts: number;
}

const STORAGE_KEY = "f1_prediction_history_v1";
const MAX_ITEMS = 8;

// ── Exported helpers so the predictions page can write entries ────────────────
export function pushHistoryItem(item: Omit<HistoryItem, "id" | "ts">) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: HistoryItem[] = raw ? JSON.parse(raw) : [];
    const entry: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ts: Date.now(),
    };
    const updated = [entry, ...list].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("f1-history-updated"));
  } catch {
    /* localStorage blocked – silent fail */
  }
}

function timeAgo(ts: number) {
  const sec = Math.floor((Date.now() - ts) / 1000);
  if (sec < 60) return `${sec}s ago`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86_400) return `${Math.floor(sec / 3600)}h ago`;
  return `${Math.floor(sec / 86_400)}d ago`;
}

export default function PredictionHistory() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  const reload = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  };

  useEffect(() => {
    reload();
    const onUpdate = () => reload();
    window.addEventListener("f1-history-updated", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("f1-history-updated", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const clear = () => {
    localStorage.removeItem(STORAGE_KEY);
    setItems([]);
  };

  if (items.length === 0) {
    return (
      <div className="glass-card rounded-2xl border border-neutral-800/60 p-5">
        <div className="flex items-center gap-2 mb-3">
          <History size={14} className="text-red-500" />
          <p className="text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
            Prediction History
          </p>
        </div>
        <p className="text-sm text-neutral-600 text-center py-6">
          Predictions you run will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl border border-neutral-800/60 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <History size={14} className="text-red-500" />
          <p className="text-xs font-black uppercase tracking-[0.22em] text-neutral-500">
            Prediction History
          </p>
          <span className="text-[10px] font-bold text-red-400 bg-red-950/50 border border-red-800/40 px-1.5 py-0.5 rounded-full">
            {items.length}
          </span>
        </div>
        <button
          onClick={clear}
          className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 hover:text-red-400 transition-colors uppercase tracking-widest"
        >
          <Trash2 size={11} />
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-2.5 rounded-lg bg-neutral-950/60 border border-neutral-800/40 hover:border-red-900/40 transition-colors"
          >
            {item.will_pit ? (
              <CheckCircle2
                size={16}
                className="text-red-400 shrink-0"
              />
            ) : (
              <XCircle size={16} className="text-green-400 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">
                {item.driver}{" "}
                <span className="text-neutral-600 font-normal text-xs">
                  · {item.compound}
                </span>
              </p>
              <p className="text-[10px] text-neutral-600">
                {item.will_pit ? "Predicted pit" : "No pit"} ·{" "}
                {timeAgo(item.ts)}
              </p>
            </div>
            <span
              className={`text-sm font-black tabular-nums ${
                item.percentage >= 65
                  ? "text-red-400"
                  : item.percentage >= 35
                  ? "text-amber-400"
                  : "text-green-400"
              }`}
            >
              {item.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
