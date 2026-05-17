import { fetchRaceSchedule } from "@/lib/api";

export default async function RacesPage() {
  const races = await fetchRaceSchedule(2026);

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <section className="max-w-6xl mx-auto">
        <p className="text-red-500 font-semibold mb-3">
          Formula 1 Calendar
        </p>

        <h1 className="text-4xl font-bold mb-6">
          F1 Race Schedule
        </h1>

        <p className="text-neutral-300 mb-8">
          Race calendar collected from your FastAPI backend using OpenF1 data.
        </p>

        <div className="grid gap-5">
          {races.map((race: any, index: number) => (
            <div
              key={race.meeting_key || index}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 hover:border-red-600 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <p className="text-sm text-red-400 font-semibold">
                    Round {index + 1}
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {race.meeting_name || "Race name not available"}
                  </h2>

                  <p className="text-neutral-300 mt-2">
                    {race.location || "Location not available"},{" "}
                    {race.country_name || "Country not available"}
                  </p>
                </div>

                <div className="text-left md:text-right">
                  <p className="text-neutral-400 text-sm">
                    Start Date
                  </p>

                  <p className="font-semibold">
                    {race.date_start
                      ? new Date(race.date_start).toLocaleString()
                      : "Date not available"}
                  </p>

                  <p className="text-neutral-500 text-sm mt-1">
                    GMT Offset: {race.gmt_offset || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}