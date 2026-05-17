import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "F1 Stats and Predictions",
  description: "Formula 1 stats, race schedule and prediction website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-black text-white px-8 py-4 flex gap-6 items-center">
          <Link href="/" className="font-bold text-red-500 text-xl">
            F1 Stats
          </Link>

          <Link href="/standings" className="hover:text-red-400">
            Standings
          </Link>

          <Link href="/drivers" className="hover:text-red-400">
            Drivers
          </Link>

          <Link href="/races" className="hover:text-red-400">
            Races
          </Link>

          <Link href="/predictions" className="hover:text-red-400">
            Predictions
          </Link>
        </nav>

        {children}
      </body>
    </html>
  );
}