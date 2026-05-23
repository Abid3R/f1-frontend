"use client";

/**
 * My Garage — client-side favourites for a single driver and constructor.
 *
 * Persisted in localStorage; surfaced to the homepage hero and the
 * star/heart toggles on driver/constructor cards.
 */
import { createContext, useCallback, useContext, useEffect, useState } from "react";

export interface FavoriteDriver {
  number: number;
  full_name: string;
  team_name?: string;
  team_colour?: string;
  acronym?: string;
}
export interface FavoriteConstructor {
  name: string;
  colour?: string;
}

interface Garage {
  driver: FavoriteDriver | null;
  constructor: FavoriteConstructor | null;
  setDriver: (d: FavoriteDriver | null) => void;
  setConstructor: (c: FavoriteConstructor | null) => void;
  clear: () => void;
  hydrated: boolean;
}

const GarageContext = createContext<Garage | null>(null);
const KEY = "f1-my-garage";

interface PersistedGarage {
  driver: FavoriteDriver | null;
  constructor: FavoriteConstructor | null;
}

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedGarage>({ driver: null, constructor: null });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PersistedGarage>;
        setState({
          driver: parsed.driver ?? null,
          constructor: parsed.constructor ?? null,
        });
      }
    } catch {
      // ignore
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state, hydrated]);

  const setDriver = useCallback((d: FavoriteDriver | null) => {
    setState((s) => ({ ...s, driver: d }));
  }, []);
  const setConstructor = useCallback((c: FavoriteConstructor | null) => {
    setState((s) => ({ ...s, constructor: c }));
  }, []);
  const clear = useCallback(() => {
    setState({ driver: null, constructor: null });
  }, []);

  return (
    <GarageContext.Provider value={{ ...state, setDriver, setConstructor, clear, hydrated }}>
      {children}
    </GarageContext.Provider>
  );
}

export function useGarage(): Garage {
  const v = useContext(GarageContext);
  if (!v) {
    return {
      driver: null,
      constructor: null,
      setDriver: () => {},
      setConstructor: () => {},
      clear: () => {},
      hydrated: false,
    };
  }
  return v;
}
