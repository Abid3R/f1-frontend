import Link from "next/link";
import ClientImage from "./components/ClientImage";
import NextRaceCountdown from "./components/NextRaceCountdown";
import LiveStatsTicker from "./components/LiveStatsTicker";
import GarageHero from "./components/GarageHero";
import {
  BarChart3,
  Users,
  Calendar,
  Cpu,
  Globe,
  Activity,
  TrendingUp,
  Database,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// ── Feature cards data ───────────────────────────────────────────────────────
const features = [
  {
    title: "Driver Standings",
    description:
      "Live championship table with points, wins and team data pulled from your FastAPI backend.",
    href: "/standings",
    image: "/images/driver_standings.jpg",
    video: "/videos/standings-3d.mp4",
    icon: BarChart3,
    delay: "delay-100",
  },
  {
    title: "Current Drivers",
    description:
      "Full grid of current F1 drivers with nationality, team, number and performance stats.",
    href: "/drivers",
    image: "/images/drivers-f1.jpg",
    video: "/videos/drivers-3d.mp4",
    icon: Users,
    delay: "delay-200",
  },
  {
    title: "Race Schedule",
    description:
      "Complete 2026 F1 race calendar with circuit locations and round-by-round schedule data.",
    href: "/races",
    image: "/images/race_schedule.jpg",
    video: "/videos/races-3d.mp4",
    icon: Calendar,
    delay: "delay-300",
  },
  {
    title: "Pit Stop Prediction",
    description:
      "ML-powered demo that estimates pit stop likelihood based on tyre life, lap data and race position.",
    href: "/predictions",
    image: "/images/pit_stop_prediction.jpg",
    video: "/videos/predictions-3d.mp4",
    icon: Cpu,
    delay: "delay-400",
  },
];

// ── Dashboard metrics data ────────────────────────────────────────────────────
const metrics = [
  {
    label: "Live APIs",
    value: "5",
    sub: "FastAPI endpoints",
    icon: Activity,
    delay: "delay-100",
  },
  {
    label: "Driver Data",
    value: "20+",
    sub: "Current F1 drivers",
    icon: Users,
    delay: "delay-200",
  },
  {
    label: "Race Calendar",
    value: "24",
    sub: "Rounds in 2026",
    icon: Globe,
    delay: "delay-300",
  },
  {
    label: "ML Ready",
    value: "AI",
    sub: "Pit stop strategy model",
    icon: TrendingUp,
    delay: "delay-400",
  },
];

// ── F1 Circuits for the world circuit section ─────────────────────────────────
const circuits = [
  { name: "Bahrain GP", country: "BHR", round: 1 },
  { name: "Saudi Arabian GP", country: "KSA", round: 2 },
  { name: "Australian GP", country: "AUS", round: 3 },
  { name: "Japanese GP", country: "JPN", round: 4 },
  { name: "Chinese GP", country: "CHN", round: 5 },
  { name: "Miami GP", country: "USA", round: 6 },
  { name: "Emilia Romagna GP", country: "ITA", round: 7 },
  { name: "Monaco GP", country: "MCO", round: 8 },
  { name: "Canadian GP", country: "CAN", round: 9 },
  { name: "Spanish GP", country: "ESP", round: 10 },
  { name: "Austrian GP", country: "AUT", round: 11 },
  { name: "British GP", country: "GBR", round: 12 },
  { name: "Hungarian GP", country: "HUN", round: 13 },
  { name: "Belgian GP", country: "BEL", round: 14 },
  { name: "Dutch GP", country: "NLD", round: 15 },
  { name: "Italian GP", country: "ITA", round: 16 },
  { name: "Azerbaijan GP", country: "AZE", round: 17 },
  { name: "Singapore GP", country: "SGP", round: 18 },
  { name: "USA GP", country: "USA", round: 19 },
  { name: "Mexico City GP", country: "MEX", round: 20 },
  { name: "São Paulo GP", country: "BRA", round: 21 },
  { name: "Las Vegas GP", country: "USA", round: 22 },
  { name: "Qatar GP", country: "QAT", round: 23 },
  { name: "Abu Dhabi GP", country: "UAE", round: 24 },
];

// ─────────────────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white overflow-x-hidden">
      {/* ================================================================
          1. HERO SECTION
          ================================================================ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden hero-gradient">
        {/* Optional hero background image */}
        <ClientImage
          src="/images/hero-f1-car.jpg"
          alt="Formula 1 race car background"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(220,38,38,0.28),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(120,10,10,0.18),transparent_55%)]" />

        {/* Animated track lines */}
        <div className="track-container absolute inset-0 pointer-events-none">
          <div className="track-line" style={{ top: "35%" }} />
          <div className="track-line track-line-2" style={{ top: "52%" }} />
          <div className="track-line track-line-3" style={{ top: "68%" }} />
        </div>

        {/* Hero content grid */}
        <div className="relative max-w-7xl mx-auto px-6 w-full pt-8 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* ── Left: Text ── */}
            <div>
              {/* Badge */}
              <div className="animate-fade-left delay-0 inline-flex items-center gap-2 f1-badge mb-6">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 animate-dot-pulse" />
                Formula 1 Intelligence Dashboard
              </div>

              <h1 className="animate-fade-left delay-100 text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] mb-6">
                F1 Stats,{" "}
                <span className="text-red-600">Schedule</span>
                <br />& Prediction
                <br />
                <span className="text-red-600">Engine</span>
              </h1>

              <p className="animate-fade-left delay-200 text-lg text-neutral-400 max-w-lg leading-relaxed mb-10">
                A modern Formula 1 web application built with{" "}
                <span className="text-white font-semibold">Next.js</span> and{" "}
                <span className="text-white font-semibold">FastAPI</span>.
                Driver standings, race schedule, current grid and an AI-powered
                pit stop prediction demo.
              </p>

              <div className="animate-fade-left delay-300 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/standings"
                  className="btn-red-glow flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-white text-base"
                >
                  Explore Dashboard
                  <ArrowRight size={16} />
                </Link>
                <Link
                  href="/predictions"
                  className="flex items-center justify-center gap-2 border border-neutral-600 hover:border-red-600 hover:bg-red-950/30 px-8 py-4 rounded-xl font-bold transition-all"
                >
                  Try Pit Stop Prediction
                  <ChevronRight size={16} />
                </Link>
              </div>

            </div>

            {/* ── Right: 3D Animation ── */}
            <div className="animate-fade-right delay-400 relative flex items-center justify-center overflow-hidden">
              {/* Deep red glow orb behind the car */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-[560px] h-[560px] bg-red-700/20 rounded-full blur-[140px]" />
              </div>
              {/* GIF — screen blend removes dark bg, radial mask dissolves all edges */}
              <img
                src="/videos/hero-3d.gif"
                alt="F1 car 3D animation"
                className="w-full max-w-3xl relative z-10 select-none pointer-events-none scale-110"
                style={{
                  mixBlendMode: "screen",
                  filter:
                    "drop-shadow(0 0 60px rgba(220,38,38,0.5)) drop-shadow(0 0 20px rgba(220,38,38,0.35)) brightness(1.08) contrast(1.05)",
                  maskImage:
                    "radial-gradient(ellipse 88% 82% at 52% 50%, black 38%, rgba(0,0,0,0.7) 58%, transparent 100%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse 88% 82% at 52% 50%, black 38%, rgba(0,0,0,0.7) 58%, transparent 100%)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />
      </section>

      {/* ================================================================
          1b. NEXT RACE COUNTDOWN (live)
          ================================================================ */}
      <NextRaceCountdown />

      {/* ================================================================
          1b2. MY GARAGE (personalized hero — Phase 5b)
          ================================================================ */}
      <GarageHero />

      {/* ================================================================
          1c. LIVE F1 FACTS TICKER
          ================================================================ */}
      <LiveStatsTicker />

      {/* ================================================================
          2. FEATURE CARDS SECTION
          ================================================================ */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="animate-fade-up text-red-500 font-bold tracking-[0.2em] uppercase text-sm mb-3">
            Explore Features
          </p>
          <h2 className="animate-fade-up delay-100 text-4xl md:text-5xl font-black">
            Professional F1{" "}
            <span className="text-red-600">Dashboard</span>
          </h2>
          <p className="animate-fade-up delay-200 text-neutral-400 mt-3 max-w-xl">
            Four dedicated sections each pulling live data from your FastAPI
            backend and the OpenF1 data API.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <Link
                key={feat.title}
                href={feat.href}
                className={`professional-card rounded-2xl overflow-hidden group animate-fade-up ${feat.delay} flex flex-col`}
              >
                {/* Card image area — full-bleed, no border/padding/letterboxing */}
                <div className="relative h-52 bg-[#0a0a0a] overflow-hidden shrink-0">
                  {/* 3D video — always present, animates even without photo files */}
                  <video
                    src={feat.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-55 group-hover:opacity-80 transition-opacity duration-700"
                    style={{ border: "none", borderWidth: 0, margin: 0, padding: 0 }}
                  />
                  {/* Optional photo overlay — renders on top when available */}
                  <ClientImage
                    src={feat.image}
                    alt={feat.title}
                    className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                    style={{ border: "none", margin: 0, padding: 0, borderWidth: 0 }}
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  {/* Red top accent line */}
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-600 via-red-500/50 to-transparent" />
                  {/* Icon badge — always visible */}
                  <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-red-600/20 border border-red-600/30 flex items-center justify-center backdrop-blur-sm">
                    <Icon size={20} className="text-red-400" />
                  </div>
                  {/* Hover title stamp */}
                  <div className="absolute bottom-0 left-0 right-0 px-5 pb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-[10px] font-black text-red-400 uppercase tracking-[0.22em]">
                      {feat.title}
                    </p>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col flex-1 relative z-10">
                  <h3 className="text-lg font-bold mb-2 group-hover:text-red-400 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-neutral-500 text-sm leading-relaxed flex-1">
                    {feat.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-4 text-red-500 text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                    View Section
                    <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ================================================================
          3. RACE INTELLIGENCE DASHBOARD SECTION
          ================================================================ */}
      <section className="relative py-20 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/10 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.06),transparent_65%)] pointer-events-none" />

        {/* Track lines */}
        <div className="track-container absolute inset-0 pointer-events-none">
          <div className="track-line" style={{ top: "30%" }} />
          <div className="track-line track-line-2" style={{ top: "70%" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="animate-fade-up text-red-500 font-bold tracking-[0.2em] uppercase text-sm mb-3">
              Race Intelligence
            </p>
            <h2 className="animate-fade-up delay-100 text-4xl md:text-5xl font-black">
              Dashboard{" "}
              <span className="text-red-600">Metrics</span>
            </h2>
            <p className="animate-fade-up delay-200 text-neutral-400 mt-3 max-w-lg mx-auto">
              Real-time F1 data infrastructure ready to display standings,
              driver profiles and AI-powered strategy predictions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {metrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <div
                  key={metric.label}
                  className={`metric-card rounded-2xl p-6 animate-fade-up ${metric.delay}`}
                >
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-red-950/50 border border-red-900/40 flex items-center justify-center">
                      <Icon size={20} className="text-red-400" />
                    </div>
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-widest">
                      HUD
                    </span>
                  </div>

                  {/* Value */}
                  <p className="text-4xl font-black text-white mb-1">
                    {metric.value}
                  </p>
                  <p className="text-red-400 font-bold text-sm mb-1">
                    {metric.label}
                  </p>
                  <p className="text-neutral-600 text-xs">{metric.sub}</p>

                  {/* Bottom bar */}
                  <div className="mt-4 h-[3px] bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full w-3/4 bg-gradient-to-r from-red-700 to-red-500 rounded-full" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tech badges row */}
          <div className="flex flex-wrap justify-center gap-3 mt-14 animate-fade-up delay-500">
            {[
              "Next.js 16",
              "FastAPI",
              "TypeScript",
              "OpenF1 API",
              "Tailwind CSS",
              "Framer Motion",
            ].map((tech) => (
              <span
                key={tech}
                className="px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/60 text-neutral-400 text-xs font-semibold hover:border-red-700 hover:text-red-400 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          4. GLOBAL CIRCUIT CALENDAR SECTION
          ================================================================ */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <p className="animate-fade-up text-red-500 font-bold tracking-[0.2em] uppercase text-sm mb-3">
              World Calendar
            </p>
            <h2 className="animate-fade-up delay-100 text-4xl md:text-5xl font-black">
              Global Formula 1{" "}
              <span className="text-red-600">Race Calendar</span>
            </h2>
            <p className="animate-fade-up delay-200 text-neutral-400 mt-3 max-w-xl">
              24 rounds spanning five continents. Full schedule data pulled from
              your FastAPI backend and the OpenF1 API.
            </p>
          </div>

          {/* Optional world map image */}
          <div className="relative rounded-3xl overflow-hidden glass-card hud-border p-0 animate-zoom-in delay-200">
            <ClientImage
              src="/images/world-map-f1.png"
              alt="F1 World Race Map"
              className="w-full h-[260px] object-cover opacity-20"
            />

            {/* Circuit grid */}
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {circuits.map((c) => (
                  <div
                    key={c.round}
                    className="flex items-center gap-2.5 group"
                  >
                    <div className="circuit-dot w-2 h-2 rounded-full bg-red-600 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-neutral-300 group-hover:text-red-400 transition-colors truncate">
                        {c.name.replace(" GP", "")}
                      </p>
                      <p className="text-[10px] text-neutral-600">{c.country}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between pt-5 border-t border-neutral-800/60">
                <div className="flex items-center gap-2 text-sm text-neutral-500">
                  <Database size={14} className="text-red-600" />
                  <span>
                    24 rounds · 2026 FIA Formula 1 World Championship
                  </span>
                </div>
                <Link
                  href="/races"
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 font-semibold transition-colors"
                >
                  Full Schedule
                  <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================
          5. FINAL CTA SECTION
          ================================================================ */}
      <section className="py-20 px-6 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-950/12 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(220,38,38,0.08),transparent_60%)] pointer-events-none" />

        {/* Track lines */}
        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "50%" }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <p className="animate-fade-up text-red-500 font-bold tracking-[0.2em] uppercase text-sm mb-4">
            Ready to Explore?
          </p>

          <h2 className="animate-fade-up delay-100 text-4xl md:text-6xl font-black mb-6">
            Start Your{" "}
            <span className="text-red-600">F1 Journey</span>
          </h2>

          <p className="animate-fade-up delay-200 text-neutral-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Dive into driver standings, explore the full grid, check the race
            calendar or run a pit stop prediction simulation with the FastAPI
            backend.
          </p>

          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/standings"
              className="btn-red-glow flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold text-white text-base"
            >
              View Standings
              <BarChart3 size={16} />
            </Link>
            <Link
              href="/predictions"
              className="flex items-center justify-center gap-2 border border-neutral-700 hover:border-red-600 hover:bg-red-950/30 px-10 py-4 rounded-xl font-bold transition-all"
            >
              Try Pit Stop AI
              <Cpu size={16} />
            </Link>
          </div>

          {/* Driver mini cards row */}
          <div className="animate-fade-up delay-500 flex items-center justify-center gap-3 mt-10 flex-wrap">
            {["Standings", "Drivers", "Races", "Predictions"].map((page) => (
              <Link
                key={page}
                href={`/${page.toLowerCase()}`}
                className="px-4 py-1.5 rounded-full border border-neutral-800 bg-neutral-900/40 text-neutral-500 text-xs font-semibold hover:border-red-700/50 hover:text-red-400 transition-all"
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
