const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

/** Generic fetch with a timeout and a descriptive error message. */
async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10_000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    const isAbort =
      err instanceof Error && err.name === "AbortError";
    throw new Error(
      isAbort
        ? "Request timed out. Is the FastAPI backend running at http://127.0.0.1:8000?"
        : "Cannot reach the backend. Please start the FastAPI server at http://127.0.0.1:8000."
    );
  }
}

export async function fetchDriverStandings() {
  const response = await apiFetch(`${API_BASE}/api/standings/drivers`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Driver standings unavailable (HTTP ${response.status}). Check the FastAPI backend.`
    );
  }

  return response.json();
}

export async function fetchRaceSchedule(year = 2026) {
  const response = await apiFetch(
    `${API_BASE}/api/races/schedule?year=${year}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    throw new Error(
      `Race schedule unavailable (HTTP ${response.status}). Check the FastAPI backend.`
    );
  }

  return response.json();
}

export async function fetchCurrentDrivers() {
  const response = await apiFetch(`${API_BASE}/api/drivers/current`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      `Driver list unavailable (HTTP ${response.status}). Check the FastAPI backend.`
    );
  }

  return response.json();
}

export async function fetchPitStopDemoPrediction(features: object) {
  const response = await apiFetch(`${API_BASE}/api/predict/pitstop-demo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(features),
  });

  if (!response.ok) {
    throw new Error(
      `Prediction failed (HTTP ${response.status}). Check the FastAPI backend.`
    );
  }

  return response.json();
}

// ── Telemetry / live ──────────────────────────────────────────────────────────
export interface TelemetrySample {
  t: string;
  elapsed: number;
  speed: number | null;
  rpm: number | null;
  gear: number | null;
  throttle: number | null;
  brake: number | null;
  drs: number | null;
}

export interface TelemetryTrace {
  driver_number: number;
  lap_number: number;
  lap_duration: number | null;
  samples: TelemetrySample[];
}

export async function fetchTelemetryCompare(params: {
  year: number;
  meetingKey?: number;
  sessionName?: string;
  driverA: number;
  driverB: number;
  lapA: number;
  lapB?: number;
}): Promise<{ driver_a: TelemetryTrace; driver_b: TelemetryTrace }> {
  const q = new URLSearchParams({
    year: String(params.year),
    driver_a: String(params.driverA),
    driver_b: String(params.driverB),
    lap_a: String(params.lapA),
    session_name: params.sessionName ?? "Race",
  });
  if (params.meetingKey !== undefined) q.set("meeting_key", String(params.meetingKey));
  if (params.lapB !== undefined) q.set("lap_b", String(params.lapB));
  const r = await apiFetch(`${API_BASE}/api/telemetry/compare?${q}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Telemetry unavailable (HTTP ${r.status}).`);
  return r.json();
}

export interface LiveInterval {
  driver_number: number;
  gap_to_leader: number | string | null;
  interval: number | string | null;
  date: string | null;
}
export async function fetchLiveIntervals(sessionKey?: number): Promise<LiveInterval[]> {
  const q = sessionKey ? `?session_key=${sessionKey}` : "";
  const r = await apiFetch(`${API_BASE}/api/telemetry/intervals${q}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Intervals unavailable (HTTP ${r.status}).`);
  return r.json();
}

export interface LivePosition {
  driver_number: number;
  x: number;
  y: number;
  z: number | null;
  date: string | null;
  name_acronym: string | null;
  team_name: string | null;
  team_colour: string | null;
  full_name: string | null;
}
export async function fetchLivePositions(sessionKey?: number): Promise<LivePosition[]> {
  const q = sessionKey ? `?session_key=${sessionKey}` : "";
  const r = await apiFetch(`${API_BASE}/api/telemetry/positions${q}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Positions unavailable (HTTP ${r.status}).`);
  return r.json();
}

export interface StintRow {
  driver_number: number;
  stint_number: number;
  compound: string;
  tyre_age_at_start: number | null;
  lap_start: number;
  lap_end: number;
}
export async function fetchStints(params?: { sessionKey?: number; driverNumber?: number }): Promise<StintRow[]> {
  const q = new URLSearchParams();
  if (params?.sessionKey) q.set("session_key", String(params.sessionKey));
  if (params?.driverNumber) q.set("driver_number", String(params.driverNumber));
  const qs = q.toString() ? `?${q}` : "";
  const r = await apiFetch(`${API_BASE}/api/telemetry/stints${qs}`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Stint history unavailable (HTTP ${r.status}).`);
  return r.json();
}

// ── Strategy / qualifying predictors ─────────────────────────────────────────
export interface StrategyStint {
  compound: "SOFT" | "MEDIUM" | "HARD" | "INTERMEDIATE" | "WET";
  laps: number;
}
export interface StrategyRequest {
  base_pace: number;
  total_laps: number;
  stints: StrategyStint[];
  starting_fuel_kg?: number;
  fuel_consumption_per_lap?: number;
  optimize_pit_window?: boolean;
  starting_compound?: string;
  second_compound?: string;
}
export interface StrategyResult {
  laps: Array<{ lap: number; stint: number; compound: string; lap_time: number }>;
  total_time_seconds: number;
  stint_count: number;
  pit_count: number;
  optimal_pit_window: null | {
    best_pit_lap: number;
    best_total_time: number;
    window: Array<{ pit_lap: number; total_time: number }>;
  };
}
export async function predictStrategy(body: StrategyRequest): Promise<StrategyResult> {
  const r = await apiFetch(`${API_BASE}/api/predict/strategy`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Strategy prediction failed (HTTP ${r.status}).`);
  return r.json();
}

export interface QualifyingSample {
  driver_number: number;
  name: string;
  team_colour?: string;
  fp1_best?: number;
  fp2_best?: number;
  fp3_best?: number;
  fuel_kg?: number;
  long_run_avg?: number;
}
export async function predictQualifying(samples: QualifyingSample[]): Promise<{
  top_5: Array<{ position: number; driver_number: number; name: string; team_colour: string | null; predicted_time: number }>;
}> {
  const r = await apiFetch(`${API_BASE}/api/predict/qualifying`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ samples }),
  });
  if (!r.ok) throw new Error(`Qualifying prediction failed (HTTP ${r.status}).`);
  return r.json();
}

// ── Circuits + weather ────────────────────────────────────────────────────────
export interface CircuitInfo {
  slug: string;
  name: string;
  country: string;
  city: string;
  lat: number;
  lon: number;
  length_km: number;
  turns: number;
  drs_zones: number;
  lap_record: string;
  race_distance_km: number;
  race_laps: number;
  safety_car_probability: number;
  tyre_demand: string;
  notes: string;
}
export async function fetchCircuits(): Promise<CircuitInfo[]> {
  const r = await apiFetch(`${API_BASE}/api/circuits/`, { cache: "force-cache" });
  if (!r.ok) throw new Error(`Circuits unavailable (HTTP ${r.status}).`);
  return r.json();
}
export async function fetchCircuit(slug: string): Promise<CircuitInfo> {
  const r = await apiFetch(`${API_BASE}/api/circuits/${slug}`, { cache: "force-cache" });
  if (!r.ok) throw new Error(`Circuit '${slug}' unavailable (HTTP ${r.status}).`);
  return r.json();
}
export interface CircuitWeather {
  circuit: { slug: string; name: string };
  forecast: {
    latitude: number;
    longitude: number;
    timezone: string;
    current: {
      temperature: number | null;
      precipitation: number | null;
      wind_speed: number | null;
      weather_code: number | null;
    };
    days: Array<{
      date: string;
      t_max: number | null;
      t_min: number | null;
      precipitation_sum: number | null;
      rain_probability: number | null;
      wind_speed_max: number | null;
      weather_code: number | null;
    }>;
  };
}
export async function fetchCircuitWeather(slug: string): Promise<CircuitWeather> {
  const r = await apiFetch(`${API_BASE}/api/circuits/${slug}/weather`, { cache: "no-store" });
  if (!r.ok) throw new Error(`Weather unavailable (HTTP ${r.status}).`);
  return r.json();
}
