import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="max-w-5xl mx-auto px-6 py-24">
        <p className="text-red-500 font-semibold mb-4">
          Formula 1 Data Project
        </p>

        <h1 className="text-5xl font-bold mb-6">
          F1 Stats and Predictions
        </h1>

        <p className="text-lg text-neutral-300 max-w-2xl mb-8">
          A Formula 1 website for driver standings, race schedules,
          live updates, and machine learning-based prediction features.
        </p>

        <div className="flex gap-4">
          <Link
            href="/standings"
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold"
          >
            View Driver Standings
          </Link>

          <Link
            href="/races"
            className="border border-neutral-600 hover:bg-neutral-800 px-6 py-3 rounded-lg font-semibold"
          >
            Race Schedule
          </Link>
        </div>
      </section>
    </main>
  );
}