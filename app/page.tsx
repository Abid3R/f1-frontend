import Link from "next/link";

const features = [
  {
    title: "Driver Standings",
    description:
      "Track current Formula 1 driver ranking, points, wins and team performance.",
    href: "/standings",
    image: "/images/standings-f1-car.jpg",
  },
  {
    title: "Current Drivers",
    description:
      "Explore current F1 drivers with team, nationality, points and profile-style cards.",
    href: "/drivers",
    image: "/images/drivers-f1.jpg",
  },
  {
    title: "Race Schedule",
    description:
      "View race calendar, locations, countries and race weekend schedule data.",
    href: "/races",
    image: "/images/race-track.jpg",
  },
  {
    title: "Pit Stop Prediction",
    description:
      "Try a strategy demo that predicts whether a driver may pit on the next lap.",
    href: "/predictions",
    image: "/images/pit-stop.jpg",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white overflow-hidden">
      <section className="relative min-h-[90vh] flex items-center px-6 py-24">
        <img
          src="/images/hero-f1-car.jpg"
          alt="Formula racing car"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,38,38,0.35),transparent_35%)]" />

        <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-left">
            <p className="text-red-500 font-bold tracking-[0.25em] uppercase mb-4">
              Formula 1 Intelligence
            </p>

            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              F1 Stats,
              <span className="text-red-600"> Schedule </span>
              and Predictions
            </h1>

            <p className="text-lg text-neutral-300 max-w-2xl mb-8">
              A modern Formula 1 web application built with Next.js and
              FastAPI. It includes driver standings, current drivers, race
              schedule and a pit stop prediction demo.
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
                className="border border-neutral-500 hover:border-red-500 hover:bg-black/50 px-7 py-4 rounded-xl font-bold text-center transition"
              >
                Try Prediction
              </Link>
            </div>
          </div>

          <div className="animate-zoom-in glass-card rounded-3xl p-6 shadow-2xl">
            <div className="rounded-2xl bg-black/60 border border-neutral-800 p-6">
              <p className="text-red-400 font-semibold uppercase mb-4">
                Project Status
              </p>

              <h2 className="text-3xl font-black mb-4">
                Race Data Dashboard
              </h2>

              <p className="text-neutral-300 mb-6">
                Connected frontend and backend system with API-based F1 data
                and prediction-ready architecture.
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-neutral-900 p-4">
                  <p className="text-3xl font-black">5</p>
                  <p className="text-xs text-neutral-400">Pages</p>
                </div>

                <div className="rounded-xl bg-neutral-900 p-4">
                  <p className="text-3xl font-black">5</p>
                  <p className="text-xs text-neutral-400">APIs</p>
                </div>

                <div className="rounded-xl bg-neutral-900 p-4">
                  <p className="text-3xl font-black">ML</p>
                  <p className="text-xs text-neutral-400">Ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-red-500 font-semibold uppercase mb-3">
            Explore Features
          </p>

          <h2 className="text-4xl font-black mb-10">
            Professional F1 Dashboard Sections
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="professional-card rounded-2xl overflow-hidden group"
              >
                <div className="relative h-44">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-red-400 transition">
                    {feature.title}
                  </h3>

                  <p className="text-neutral-400 text-sm leading-6">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}