"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/drivers", label: "Drivers" },
  { href: "/races", label: "Races" },
  { href: "/insights", label: "Insights" },
  { href: "/records", label: "Records" },
  { href: "/predictions", label: "Predictions" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/96 backdrop-blur-xl shadow-2xl border-b border-neutral-900/80"
          : "bg-black/70 backdrop-blur-md"
      }`}
    >
      {/* Top red accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center group-hover:bg-red-500 transition-colors shadow-lg">
              <span className="text-white font-black text-xs tracking-tight">
                F1
              </span>
            </div>
            <span className="text-white font-black text-xl tracking-tight">
              F1{" "}
              <span className="text-red-500 group-hover:text-red-400 transition-colors">
                Intel
              </span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link text-sm font-semibold tracking-wide transition-colors pb-0.5 ${
                    isActive
                      ? "text-red-400 nav-link-active"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/predictions"
              className="btn-red-glow flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold text-white"
            >
              <Zap size={14} />
              Predict
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-neutral-300 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-800/70 animate-fade-in">
            <div className="space-y-1 pb-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-red-950/40 text-red-400 border-l-2 border-red-500 pl-4"
                        : "text-neutral-400 hover:text-white hover:bg-white/5 border-l-2 border-transparent"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
            <div className="pt-3 border-t border-neutral-800/50">
              <Link
                href="/predictions"
                className="btn-red-glow flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold text-white w-full"
              >
                <Zap size={14} />
                Try Pit Stop Prediction
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
