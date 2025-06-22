import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pokémon Battle App",
  description:
    "A full-stack Pokémon battle application built with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">
              <span className="fs-4">⚡ Pokémon Battle</span>
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/pokemon">
                    Pokémon
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/teams">
                    Teams
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/battle">
                    Battle
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container mt-4">{children}</main>
        <footer className="bg-light text-center py-3 mt-5">
          <div className="container">
            <p className="text-muted mb-0">Pokémon Battle App</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
