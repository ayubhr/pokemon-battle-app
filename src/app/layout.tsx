import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import QueryProvider from "@/components/query-provider";
import BootstrapClient from "@/components/bootstrap-client";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokémon Battle App",
  description: "Epic Pokémon battles with team management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <QueryProvider>
          <BootstrapClient />
          {/* Navigation */}
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow">
            <div className="container">
              <Link className="navbar-brand fw-bold fs-3" href="/">
                <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
                PokéBattle
              </Link>

              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarNav"
              >
                <span className="navbar-toggler-icon"></span>
              </button>

              <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                  <li className="nav-item">
                    <Link className="nav-link" href="/">
                      <i className="bi bi-house-fill me-1"></i>
                      Home
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/pokemon">
                      <i className="bi bi-collection me-1"></i>
                      Pokémon
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/teams">
                      <i className="bi bi-people-fill me-1"></i>
                      Teams
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" href="/battle">
                      <i className="bi bi-lightning-fill me-1"></i>
                      Battle
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main>{children}</main>

          {/* Footer */}
          <footer className="bg-dark text-light py-4 mt-5">
            <div className="container text-center">
              <p className="mb-0">
                <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                Pokémon Battle App - Built with Next.js & Supabase
                <i className="bi bi-lightning-charge-fill text-warning ms-2"></i>
              </p>
            </div>
          </footer>
        </QueryProvider>
      </body>
    </html>
  );
}
