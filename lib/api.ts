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