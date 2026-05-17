import { fetchRaceSchedule } from "@/lib/api";

export default async function RacesPage() {
  const races = await fetchRaceSchedule(2026);

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative px-6 py-24 overflow-hidden">
        <img
          src="/images/race-track.jpg"
          alt="F1 race track background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />

        <div className="relative max-w-6xl mx-auto animate-fade-up">
          <p className="text-red-500 font-bold uppercase tracking-[0.2em] mb-4">
            Formula 1 Calendar
          </p>

          <h1 className="text-5xl font-black mb-5">
            F1 Race Schedule
          </h1>

          <p className="text-neutral-300 max-w-2xl">
            Race calendar collected from your FastAPI backend using OpenF1 data.
            Each card shows race name, country, location and start date.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid gap-6">
          {races.map((race: any, index: number) => (
            <div
              key={race.meeting_key || index}
              className="professional-card rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div>
                  <p className="text-red-400 font-bold mb-2">
                    Round {index + 1}
                  </p>

                  <h2 className="text-2xl md:text-3xl font-black">
                    {race.meeting_name || "Race name not available"}
                  </h2>

                  <p className="text-neutral-300 mt-2">
                    {race.location || "Location not available"},{" "}
                    {race.country_name || "Country not available"}
                  </p>
                </div>

                <div className="rounded-xl bg-neutral-800 p-5 min-w-[240px]">
                  <p className="text-neutral-400 text-sm mb-1">
                    Start Date
                  </p>

                  <p className="font-bold">
                    {race.date_start
                      ? new Date(race.date_start).toLocaleString()
                      : "Date not available"}
                  </p>

                  <p className="text-neutral-500 text-sm mt-2">
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