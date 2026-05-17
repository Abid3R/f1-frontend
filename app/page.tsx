import Link from "next/link";

const features = [
  {
    title: "Driver Standings",
    description:
      "View current Formula 1 driver standings, points, wins, teams and ranking positions.",
    href: "/standings",
  },
  {
    title: "Current Drivers",
    description:
      "Explore current F1 drivers with team, nationality, points, wins and profile-style cards.",
    href: "/drivers",
  },
  {
    title: "Race Schedule",
    description:
      "Check the Formula 1 race calendar with race locations, countries and session dates.",
    href: "/races",
  },
  {
    title: "Pit Stop Prediction",
    description:
      "Use a strategy demo model to estimate whether a driver may pit on the next lap.",
    href: "/predictions",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      <section className="relative px-6 py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.08),transparent_30%)]" />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <p className="text-red-500 font-semibold tracking-wide uppercase mb-4">
              Formula 1 Data Project
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              F1 Stats,
              <span className="text-red-600"> Schedule </span>
              and Predictions
            </h1>

            <p className="text-lg text-neutral-300 max-w-2xl mb-8">
              A modern Formula 1 web application built with Next.js and
              FastAPI. It shows driver standings, current drivers, race
              schedules and a pit stop prediction demo.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/standings"
                className="bg-red-600 hover:bg-red-700 px-7 py-4 rounded-xl font-bold text-center transition"
              >
                View Standings
              </Link>

              <Link
                href="/predictions"
                className="border border-neutral-600 hover:border-red-500 hover:bg-neutral-900 px-7 py-4 rounded-xl font-bold text-center transition"
              >
                Try Prediction
              </Link>
            </div>
          </div>

          <div className="relative animate-slide-up">
            <div className="rounded-3xl border border-neutral-800 bg-neutral-900/80 p-5 shadow-2xl">
              <div className="rounded-2xl bg-gradient-to-br from-red-700 via-neutral-900 to-black p-8 min-h-[360px] flex flex-col justify-between">
                <div>
                  <p className="text-sm text-red-200 font-semibold uppercase">
                    Live Project Preview
                  </p>

                  <h2 className="text-4xl font-black mt-4">
                    Race Intelligence Dashboard
                  </h2>

                  <p className="text-neutral-300 mt-4">
                    Built for F1 statistics, race data, strategy analysis and
                    future machine learning integration.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-8">
                  <div className="rounded-xl bg-black/40 p-4">
                    <p className="text-3xl font-black">4+</p>
                    <p className="text-xs text-neutral-300">Pages</p>
                  </div>

                  <div className="rounded-xl bg-black/40 p-4">
                    <p className="text-3xl font-black">4+</p>
                    <p className="text-xs text-neutral-300">APIs</p>
                  </div>

                  <div className="rounded-xl bg-black/40 p-4">
                    <p className="text-3xl font-black">ML</p>
                    <p className="text-xs text-neutral-300">Ready</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-red-600/30 rounded-full blur-3xl" />
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-neutral-900">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500 font-semibold uppercase mb-3">
            Website Features
          </p>

          <h2 className="text-4xl font-black mb-10">
            Explore the F1 Dashboard
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="group rounded-2xl border border-neutral-800 bg-neutral-900 p-6 hover:border-red-600 hover:-translate-y-1 transition duration-300"
              >
                <div className="h-12 w-12 rounded-xl bg-red-600/20 border border-red-600/40 flex items-center justify-center mb-5">
                  <span className="text-red-500 font-black text-xl">F1</span>
                </div>

                <h3 className="text-xl font-bold mb-3 group-hover:text-red-400">
                  {feature.title}
                </h3>

                <p className="text-neutral-400 text-sm leading-6">
                  {feature.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="max-w-6xl mx-auto rounded-3xl border border-neutral-800 bg-gradient-to-r from-neutral-900 to-black p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <p className="text-red-500 font-semibold mb-2">
                Backend
              </p>
              <h3 className="text-2xl font-bold mb-3">
                FastAPI
              </h3>
              <p className="text-neutral-400">
                Provides API routes for standings, drivers, race schedule and
                prediction demo.
              </p>
            </div>

            <div>
              <p className="text-red-500 font-semibold mb-2">
                Frontend
              </p>
              <h3 className="text-2xl font-bold mb-3">
                Next.js
              </h3>
              <p className="text-neutral-400">
                Displays clean dashboard pages with responsive layout and F1
                style design.
              </p>
            </div>

            <div>
              <p className="text-red-500 font-semibold mb-2">
                Future Upgrade
              </p>
              <h3 className="text-2xl font-bold mb-3">
                Machine Learning
              </h3>
              <p className="text-neutral-400">
                The current prediction demo can later be replaced with a real
                trained pit stop model.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}