/**
 * Tiny CSV serializer + browser downloader used by <DataExportButton />.
 *
 * Handles:
 *   - mixed-key arrays (union of all keys across rows)
 *   - cells containing commas, quotes, newlines (RFC-4180 quoting)
 *   - null/undefined → empty string
 *   - nested objects/arrays → JSON.stringify
 */

export type CsvRow = Record<string, unknown>;

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s: string;
  if (typeof value === "object") {
    try {
      s = JSON.stringify(value);
    } catch {
      s = String(value);
    }
  } else {
    s = String(value);
  }
  // Quote only when necessary.
  if (/[",\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function rowsToCsv(rows: CsvRow[], columns?: string[]): string {
  if (rows.length === 0) return "";
  const cols =
    columns && columns.length > 0
      ? columns
      : Array.from(
          rows.reduce<Set<string>>((acc, r) => {
            Object.keys(r).forEach((k) => acc.add(k));
            return acc;
          }, new Set<string>())
        );

  const header = cols.map(escapeCell).join(",");
  const body = rows
    .map((r) => cols.map((c) => escapeCell(r[c])).join(","))
    .join("\r\n");

  return `${header}\r\n${body}`;
}

export function downloadCsv(filename: string, rows: CsvRow[], columns?: string[]): void {
  const csv = rowsToCsv(rows, columns);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
