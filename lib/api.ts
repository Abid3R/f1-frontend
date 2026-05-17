const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function fetchDriverStandings() {
  const response = await fetch(`${API_BASE}/api/standings/drivers`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch driver standings");
  }

  return response.json();
}

export async function fetchRaceSchedule(year = 2026) {
  const response = await fetch(`${API_BASE}/api/races/schedule?year=${year}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch race schedule");
  }

  return response.json();
}