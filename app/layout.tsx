import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "./components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Intel – Stats, Schedule & Predictions",
  description:
    "Professional Formula 1 intelligence dashboard. Driver standings, race schedule, and AI-powered pit stop predictions. Built with Next.js and FastAPI.",
};

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Driver Standings" },
  { href: "/drivers", label: "Current Drivers" },
  { href: "/races", label: "Race Schedule" },
  { href: "/predictions", label: "Pit Stop Prediction" },
];

const techStack = [
  "Next.js 16 – App Router",
  "FastAPI (Python) Backend",
  "TypeScript",
  "Tailwind CSS v4",
  "OpenF1 API Data",
  "Framer Motion",
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-[#080808] text-white antialiased">
        <Navbar />

        <div className="pt-16">{children}</div>

        {/* ========== FOOTER ========== */}
        <footer className="bg-black border-t border-neutral-900 mt-20 relative overflow-hidden">
          {/* Red accent top line */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-700/60 to-transparent" />

          {/* Subtle background glow */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-red-900/5 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-7xl mx-auto px-6 py-14">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center shadow">
                    <span className="text-white font-black text-xs">F1</span>
                  </div>
                  <span className="text-white font-black text-xl">
                    F1 <span className="text-red-500">Intel</span>
                  </span>
                </div>
                <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">
                  A Formula 1 intelligence dashboard built for speed, live data,
                  and performance analytics. Powered by OpenF1 and FastAPI.
                </p>
                <div className="flex items-center gap-2 mt-5">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-dot-pulse" />
                  <span className="text-green-500 text-xs font-semibold">
                    Live API Ready
                  </span>
                </div>
              </div>

              {/* Nav links */}
              <div>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-5">
                  Navigation
                </h3>
                <div className="space-y-2.5">
                  {footerLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-2 text-neutral-500 hover:text-red-400 text-sm transition-colors group"
                    >
                      <div className="w-1 h-1 rounded-full bg-neutral-700 group-hover:bg-red-600 transition-colors" />
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div>
                <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-5">
                  Built With
                </h3>
                <div className="space-y-2.5">
                  {techStack.map((tech) => (
                    <div
                      key={tech}
                      className="flex items-center gap-2 text-sm text-neutral-500"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-red-700 shrink-0" />
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </footer>
      </body>
    </html>
  );
}
