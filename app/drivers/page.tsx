import { fetchCurrentDrivers } from "@/lib/api";

export default async function DriversPage() {
  const drivers = await fetchCurrentDrivers();

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative px-6 py-24 overflow-hidden">
        <img
          src="/images/drivers-f1.jpg"
          alt="F1 drivers background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />

        <div className="relative max-w-6xl mx-auto animate-fade-up">
          <p className="text-red-500 font-bold uppercase tracking-[0.2em] mb-4">
            Formula 1 Grid
          </p>

          <h1 className="text-5xl font-black mb-5">
            Current F1 Drivers
          </h1>

          <p className="text-neutral-300 max-w-2xl">
            Explore current Formula 1 drivers with team, nationality,
            championship points, wins and current standing position.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver: any, index: number) => (
            <div
              key={driver.driver_id}
              className="professional-card rounded-2xl p-6 animate-fade-up"
              style={{ animationDelay: `${index * 0.04}s` }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="h-14 w-14 rounded-2xl bg-red-600 flex items-center justify-center">
                  <span className="font-black text-xl">
                    {driver.code || "F1"}
                  </span>
                </div>

                <p className="text-red-400 font-bold">
                  Standing #{driver.standing_position}
                </p>
              </div>

              <h2 className="text-2xl font-black mb-3">
                {driver.full_name}
              </h2>

              <div className="space-y-2 text-neutral-300">
                <p>Team: {driver.team || "Not available"}</p>
                <p>Nationality: {driver.nationality || "Not available"}</p>
                <p>Number: {driver.permanent_number || "N/A"}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="rounded-xl bg-neutral-800 p-4">
                  <p className="text-neutral-400 text-sm">Points</p>
                  <p className="text-2xl font-black">{driver.points}</p>
                </div>

                <div className="rounded-xl bg-neutral-800 p-4">
                  <p className="text-neutral-400 text-sm">Wins</p>
                  <p className="text-2xl font-black">{driver.wins}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}