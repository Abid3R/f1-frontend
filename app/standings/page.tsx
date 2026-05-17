import { fetchDriverStandings } from "@/lib/api";

export default async function StandingsPage() {
  const standings = await fetchDriverStandings();

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="relative px-6 py-24 overflow-hidden">
        <img
          src="/images/standings-f1-car.jpg"
          alt="F1 car standings background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />

        <div className="relative max-w-6xl mx-auto animate-fade-up">
          <p className="text-red-500 font-bold uppercase tracking-[0.2em] mb-4">
            Championship Table
          </p>

          <h1 className="text-5xl font-black mb-5">
            F1 Driver Standings
          </h1>

          <p className="text-neutral-300 max-w-2xl">
            Current Formula 1 driver standings displayed from your FastAPI
            backend. The table includes position, driver, team, points and wins.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="max-w-6xl mx-auto animate-fade-up">
          <div className="overflow-x-auto rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-red-700 text-white">
                  <th className="p-4 text-left">Position</th>
                  <th className="p-4 text-left">Driver</th>
                  <th className="p-4 text-left">Code</th>
                  <th className="p-4 text-left">Team</th>
                  <th className="p-4 text-left">Points</th>
                  <th className="p-4 text-left">Wins</th>
                </tr>
              </thead>

              <tbody>
                {standings.map((driver: any) => (
                  <tr
                    key={driver.position}
                    className="border-t border-neutral-800 hover:bg-neutral-800 transition"
                  >
                    <td className="p-4 font-black text-red-400">
                      #{driver.position}
                    </td>

                    <td className="p-4 font-semibold">
                      {driver.driver}
                    </td>

                    <td className="p-4 text-neutral-300">
                      {driver.code || "N/A"}
                    </td>

                    <td className="p-4">
                      {driver.team}
                    </td>

                    <td className="p-4 font-bold">
                      {driver.points}
                    </td>

                    <td className="p-4">
                      {driver.wins}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}