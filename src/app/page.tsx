import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
  return (
    <div className="row">
      <div className="col-12">
        <div className="hero-section text-center py-5 mb-5">
          <h1 className="display-4 fw-bold text-primary">
            🔥 Welcome to Pokémon Battle Arena! 💧
          </h1>
          <p className="lead text-muted mb-4">
            Build your ultimate team, manage your Pokémon, and engage in epic
            battles!
          </p>
        </div>

        <div className="row g-4 justify-content-center">
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card h-100 shadow-sm w-100">
              <div className="card-body text-center d-flex flex-column">
                <div className="mb-3">
                  <span className="display-6">🔥</span>
                </div>
                <h5 className="card-title">Manage Pokémon</h5>
                <p className="card-text text-muted flex-grow-1">
                  View and edit your Pokémon collection. Customize names, types,
                  power, and life stats.
                </p>
                <a href="/pokemon" className="btn btn-primary mt-auto">
                  View Pokémon →
                </a>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card h-100 shadow-sm w-100">
              <div className="card-body text-center d-flex flex-column">
                <div className="mb-3">
                  <span className="display-6">👥</span>
                </div>
                <h5 className="card-title">Build Teams</h5>
                <p className="card-text text-muted flex-grow-1">
                  Create powerful teams of exactly 6 Pokémon. View total team
                  power and strategize your lineup.
                </p>
                <a href="/teams" className="btn btn-success mt-auto">
                  Manage Teams →
                </a>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card h-100 shadow-sm w-100">
              <div className="card-body text-center d-flex flex-column">
                <div className="mb-3">
                  <span className="display-6">⚔️</span>
                </div>
                <h5 className="card-title">Epic Battles</h5>
                <p className="card-text text-muted flex-grow-1">
                  Simulate 1v1 battles between teams with real-time combat logs
                  and type effectiveness.
                </p>
                <a href="/battle" className="btn btn-danger mt-auto">
                  Start Battle →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
