import { fetchCurrentDrivers } from "@/lib/api";
import DriversGrid from "./DriversGrid";
import { AlertCircle } from "lucide-react";

function ErrorCard({ message }: { message: string }) {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="glass-card-red rounded-2xl p-8 border border-red-900/40 flex items-start gap-4">
        <AlertCircle className="text-red-400 shrink-0 mt-0.5" size={22} />
        <div>
          <p className="font-bold text-red-300 mb-2">Backend Unavailable</p>
          <p className="text-neutral-400 text-sm leading-relaxed">{message}</p>
          <p className="text-neutral-500 text-xs mt-3">
            Start the FastAPI server:{" "}
            <code className="text-red-400 bg-red-950/40 px-2 py-0.5 rounded">
              uvicorn main:app --reload
            </code>{" "}
            then refresh this page.
          </p>
        </div>
      </div>
    </div>
  );
}

export default async function DriversPage() {
  let drivers: any[] = [];
  let apiError: string | null = null;

  try {
    drivers = await fetchCurrentDrivers();
  } catch (err: unknown) {
    apiError =
      err instanceof Error
        ? err.message
        : "Backend API is not available. Please start FastAPI server at http://127.0.0.1:8000.";
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ================================================================
          HERO
          ================================================================ */}
      <section className="relative px-6 py-24 overflow-hidden min-h-[50vh] flex items-center">
        {/* CSS gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-neutral-950 to-red-950/20" />

        {/* 3D animation video */}
        <video
          src="/videos/drivers-3d.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-28"
        />

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(220,38,38,0.22),transparent_55%)]" />

        {/* Track lines */}
        <div className="track-container absolute inset-0">
          <div className="track-line" style={{ top: "38%" }} />
          <div className="track-line track-line-3" style={{ top: "62%" }} />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#080808] to-transparent" />

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="animate-fade-left">
            <p className="text-red-500 font-bold uppercase tracking-[0.25em] text-sm mb-4">
              Formula 1 Grid
            </p>
            <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-tight mb-5">
              Current{" "}
              <span className="text-red-600">F1 Drivers</span>
            </h1>
            <p className="text-neutral-400 max-w-2xl text-lg leading-relaxed">
              Explore the full Formula 1 driver grid. Search by name, team or
              nationality, and sort by championship position, points or wins.
            </p>
            {!apiError && (
              <div className="flex items-center gap-2 mt-5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-dot-pulse" />
                <span className="text-green-500 text-sm font-semibold">
                  {drivers.length} drivers loaded from backend
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================================================================
          CONTENT
          ================================================================ */}
      <section className="px-6 py-10 pb-20 max-w-7xl mx-auto">
        {apiError ? (
          <ErrorCard message={apiError} />
        ) : drivers.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-neutral-500 text-lg">
              No driver data returned by the backend.
            </p>
          </div>
        ) : (
          <DriversGrid drivers={drivers} />
        )}
      </section>
    </main>
  );
}
