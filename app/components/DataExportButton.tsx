"use client";

import { Download } from "lucide-react";
import { useCallback, useState } from "react";
import { downloadCsv, type CsvRow } from "@/lib/csv";

interface Props {
  filename: string;
  /** Either a static array or a thunk for lazy/large datasets. */
  rows: CsvRow[] | (() => CsvRow[] | Promise<CsvRow[]>);
  /** Optional explicit column order; otherwise the union of keys is used. */
  columns?: string[];
  label?: string;
  className?: string;
  disabled?: boolean;
}

/**
 * Drop-in CSV export trigger.  Used on any data table.
 *
 *   <DataExportButton filename="standings-2026.csv" rows={standings} />
 */
export default function DataExportButton({
  filename,
  rows,
  columns,
  label = "Export CSV",
  className = "",
  disabled = false,
}: Props) {
  const [busy, setBusy] = useState(false);

  const onClick = useCallback(async () => {
    if (busy || disabled) return;
    setBusy(true);
    try {
      const data = typeof rows === "function" ? await rows() : rows;
      if (!data || data.length === 0) {
        return;
      }
      downloadCsv(filename, data, columns);
    } catch (err) {
      // Surface failure silently in console — the button visibly resets.
      console.error("[DataExportButton] export failed", err);
    } finally {
      setBusy(false);
    }
  }, [busy, columns, disabled, filename, rows]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy || disabled}
      className={
        "inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs " +
        "font-medium text-zinc-100 transition hover:bg-white/10 hover:border-white/20 " +
        "disabled:cursor-not-allowed disabled:opacity-50 " +
        className
      }
      aria-label={`Download ${filename} as CSV`}
    >
      <Download className="h-3.5 w-3.5" />
      {busy ? "Preparing…" : label}
    </button>
  );
}
