"use client";

/**
 * Pit-Wall HUD mode — a dark/neon theme toggle.
 *
 * When enabled it sets `data-theme="hud"` on <html>, which globals.css uses
 * to switch colour variables (cyan, neon green, hot pink) and overlay scanlines.
 *
 * Persisted in localStorage; SSR-safe (reads only after mount).
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Theme = "default" | "hud";

interface Ctx {
  theme: Theme;
  toggle: () => void;
  isHud: boolean;
}

const ThemeContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "f1-hud-theme";

export function HudThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("default");

  // Hydrate from localStorage on mount only.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored === "hud" || stored === "default") {
        setTheme(stored);
      }
    } catch {
      // ignore (Safari private mode etc.)
    }
  }, []);

  // Reflect on <html> so global CSS variables can swap.
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "hud" ? "default" : "hud"));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggle, isHud: theme === "hud" }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useHudTheme(): Ctx {
  const v = useContext(ThemeContext);
  if (!v) {
    // Safe degraded default if used outside provider.
    return { theme: "default", toggle: () => {}, isHud: false };
  }
  return v;
}
