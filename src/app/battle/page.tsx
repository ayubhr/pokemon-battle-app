"use client";

import { useTeams } from "@/hooks/use-teams";
import BattleInterface from "@/components/battle-interface";

export default function BattlePage() {
  const { data: teams, isLoading, error, isError } = useTeams();

  if (isLoading) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #667eea 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated Background Elements */}
        <div className="position-absolute w-100 h-100" style={{ opacity: 0.1 }}>
          <div
            className="position-absolute animate__animated animate__pulse animate__infinite"
            style={{ top: "10%", left: "10%", fontSize: "8rem" }}
          >
            ⚡
          </div>
          <div
            className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-1s"
            style={{ top: "20%", right: "15%", fontSize: "6rem" }}
          >
            🔥
          </div>
          <div
            className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-2s"
            style={{ bottom: "20%", left: "20%", fontSize: "7rem" }}
          >
            💧
          </div>
          <div
            className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-3s"
            style={{ bottom: "10%", right: "10%", fontSize: "5rem" }}
          >
            🌿
          </div>
        </div>

        <div className="text-center">
          <div className="bg-dark bg-opacity-50 rounded-4 p-5 shadow-lg backdrop-blur">
            <div className="mb-4">
              <div
                className="spinner-border text-warning"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              >
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
            <h2 className="text-white fw-bold mb-3">
              <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
              Initializing Battle Arena
            </h2>
            <p className="text-white-50 mb-0">Preparing epic battles...</p>
            <div className="mt-3">
              <div
                className="progress"
                style={{ height: "8px", background: "rgba(255,255,255,0.2)" }}
              >
                <div
                  className="progress-bar bg-warning progress-bar-striped progress-bar-animated"
                  style={{ width: "75%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
        />
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card border-0 shadow-lg bg-dark bg-opacity-75 text-white">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill text-danger display-1"></i>
                  </div>
                  <h3 className="fw-bold mb-3">Battle Arena Error</h3>
                  <p className="text-white-50 mb-4">
                    {error?.message ||
                      "Failed to load battle data. Please try again later."}
                  </p>
                  <button
                    className="btn btn-danger btn-lg px-4"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Retry
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 75%, #764ba2 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Epic Header Section */}
      <div className="position-relative">
        {/* Animated Background Particles */}
        <div
          className="position-absolute w-100 h-100"
          style={{ opacity: 0.15, zIndex: 1 }}
        >
          <div
            className="position-absolute animate__animated animate__fadeInUp animate__infinite animate__slower"
            style={{ top: "5%", left: "5%", fontSize: "4rem" }}
          >
            ⚡
          </div>
          <div
            className="position-absolute animate__animated animate__fadeInDown animate__infinite animate__slower animate__delay-1s"
            style={{ top: "10%", right: "10%", fontSize: "3rem" }}
          >
            🔥
          </div>
          <div
            className="position-absolute animate__animated animate__fadeInLeft animate__infinite animate__slower animate__delay-2s"
            style={{ top: "15%", left: "50%", fontSize: "2.5rem" }}
          >
            💧
          </div>
          <div
            className="position-absolute animate__animated animate__fadeInRight animate__infinite animate__slower animate__delay-3s"
            style={{ top: "8%", right: "30%", fontSize: "3.5rem" }}
          >
            🌿
          </div>
        </div>

        {/* Main Header */}
        <div
          className="container-fluid py-5"
          style={{ zIndex: 2, position: "relative" }}
        >
          <div className="text-center mb-5">
            <div className="mb-4">
              <h1 className="display-2 fw-bold text-white mb-3 animate__animated animate__fadeInDown">
                <i className="bi bi-lightning-charge-fill text-warning me-3"></i>
                POKÉMON BATTLE ARENA
                <i className="bi bi-lightning-charge-fill text-warning ms-3"></i>
              </h1>
              <div className="h4 text-warning fw-bold mb-4 animate__animated animate__fadeInUp animate__delay-1s">
                ⚔️ LEGENDARY BATTLES AWAIT ⚔️
              </div>
              <p className="lead text-white-50 mb-0 animate__animated animate__fadeIn animate__delay-2s">
                Select your champions and witness epic 1v1 battles with
                elemental mastery!
              </p>
            </div>

            {/* Battle Stats Banner */}
            <div className="row justify-content-center animate__animated animate__fadeInUp animate__delay-3s">
              <div className="col-auto">
                <div className="bg-dark bg-opacity-50 rounded-pill px-4 py-2 backdrop-blur">
                  <div className="row g-4 text-center">
                    <div className="col">
                      <div className="text-warning fw-bold">🔥</div>
                      <small className="text-white-50">Fire</small>
                    </div>
                    <div className="col">
                      <div className="text-primary fw-bold">💧</div>
                      <small className="text-white-50">Water</small>
                    </div>
                    <div className="col">
                      <div className="text-success fw-bold">🌿</div>
                      <small className="text-white-50">Grass</small>
                    </div>
                    <div className="col">
                      <div className="text-warning fw-bold">⚡</div>
                      <small className="text-white-50">Power</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Battle Content */}
      <div
        className="container-fluid px-4"
        style={{ zIndex: 2, position: "relative" }}
      >
        {teams && teams.length >= 2 ? (
          <BattleInterface teams={teams} />
        ) : (
          <div className="row justify-content-center mb-5">
            <div className="col-lg-8">
              <div className="card border-0 shadow-lg bg-dark bg-opacity-75 text-white animate__animated animate__zoomIn">
                <div className="card-body text-center py-5">
                  <div className="mb-4">
                    <i className="bi bi-shield-exclamation display-1 text-warning animate__animated animate__pulse animate__infinite"></i>
                  </div>
                  <h3 className="fw-bold text-warning mb-3">Arena Not Ready</h3>
                  <p className="text-white-50 mb-4">
                    You need at least 2 legendary teams to enter the battle
                    arena.
                  </p>
                  <div className="mb-4">
                    <div className="bg-warning bg-opacity-20 rounded-3 p-3 d-inline-block">
                      <div className="text-warning fw-bold fs-4">
                        {teams?.length || 0} / 2
                      </div>
                      <small className="text-white-50">Teams Available</small>
                    </div>
                  </div>
                  <a href="/teams" className="btn btn-warning btn-lg px-5 py-3">
                    <i className="bi bi-plus-circle me-2"></i>
                    Create Legendary Teams
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Battle Rules Section */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg bg-dark bg-opacity-50 text-white backdrop-blur">
              <div className="card-header bg-transparent border-bottom border-warning">
                <h4 className="text-center text-warning fw-bold mb-0">
                  <i className="bi bi-book-fill me-2"></i>
                  BATTLE CODEX
                </h4>
              </div>
              <div className="card-body p-4">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="text-warning me-3 fs-4">⚔️</div>
                      <div>
                        <h6 className="text-warning fw-bold">Combat System</h6>
                        <p className="text-white-50 small mb-0">
                          1v1 battles until one team falls
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="text-warning me-3 fs-4">🧮</div>
                      <div>
                        <h6 className="text-warning fw-bold">Damage Formula</h6>
                        <p className="text-white-50 small mb-0">
                          <code className="text-info">
                            life - (power × type_factor)
                          </code>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="text-warning me-3 fs-4">🔄</div>
                      <div>
                        <h6 className="text-warning fw-bold">Type Mastery</h6>
                        <p className="text-white-50 small mb-0">
                          Fire {">"} Grass {">"} Water {">"} Fire
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <div className="d-flex align-items-start">
                      <div className="text-warning me-3 fs-4">🏆</div>
                      <div>
                        <h6 className="text-warning fw-bold">Victory</h6>
                        <p className="text-white-50 small mb-0">
                          Last team standing wins
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
}
