import { fetchDriverStandings } from "@/lib/api";

export default async function StandingsPage() {
  const standings = await fetchDriverStandings();

  return (
    <main className="min-h-screen bg-neutral-950 text-white p-8">
      <section className="max-w-6xl mx-auto">
        <p className="text-red-500 font-semibold mb-3">
          Formula 1 Championship
        </p>

        <h1 className="text-4xl font-bold mb-6">
          F1 Driver Standings
        </h1>

        <p className="text-neutral-300 mb-8">
          Current driver standings collected from your FastAPI backend.
        </p>

        <div className="overflow-x-auto rounded-xl border border-neutral-800">
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
                  className="border-t border-neutral-800 hover:bg-neutral-900"
                >
                  <td className="p-4 font-bold">{driver.position}</td>
                  <td className="p-4">{driver.driver}</td>
                  <td className="p-4 text-neutral-300">{driver.code || "N/A"}</td>
                  <td className="p-4">{driver.team}</td>
                  <td className="p-4 font-semibold">{driver.points}</td>
                  <td className="p-4">{driver.wins}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}