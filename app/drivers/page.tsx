import { fetchCurrentDrivers } from "@/lib/api";

export default async function DriversPage() {
  const drivers = await fetchCurrentDrivers();

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <section className="max-w-6xl mx-auto">
        <p className="text-red-500 font-semibold mb-3">
          Formula 1 Drivers
        </p>

        <h1 className="text-4xl font-bold mb-6">
          Current F1 Drivers
        </h1>

        <p className="text-neutral-300 mb-8">
          Current Formula 1 drivers collected from your FastAPI backend.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {drivers.map((driver: any) => (
            <div
              key={driver.driver_id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5 hover:border-red-600 transition"
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-red-400 font-semibold">
                  #{driver.standing_position}
                </p>

                <p className="text-sm text-neutral-400">
                  {driver.code || "N/A"}
                </p>
              </div>

              <h2 className="text-2xl font-bold">
                {driver.full_name}
              </h2>

              <p className="text-neutral-300 mt-2">
                Team: {driver.team}
              </p>

              <p className="text-neutral-300">
                Nationality: {driver.nationality}
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-neutral-800 p-3">
                  <p className="text-neutral-400 text-sm">Points</p>
                  <p className="text-xl font-bold">{driver.points}</p>
                </div>

                <div className="rounded-lg bg-neutral-800 p-3">
                  <p className="text-neutral-400 text-sm">Wins</p>
                  <p className="text-xl font-bold">{driver.wins}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}