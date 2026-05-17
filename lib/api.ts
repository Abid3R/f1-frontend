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
