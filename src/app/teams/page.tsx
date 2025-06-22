"use client";

import { useTeams } from "@/hooks/use-teams";
import TeamsDisplay from "@/components/teams-display";
import CreateTeamForm from "@/components/create-team-form";
import { TeamWithPokemon } from "@/types";

export default function TeamsPage() {
  const { data: teams, isLoading, error, isError } = useTeams();

  if (isLoading) {
    return (
      <div
        className="min-vh-100"
        style={{
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 75%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-6">
              <div className="card border-0 shadow-lg bg-dark bg-opacity-25 text-white backdrop-blur">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <div
                      className="spinner-border text-success"
                      role="status"
                      style={{ width: "4rem", height: "4rem" }}
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                  <h3
                    className="text-white fw-bold mb-3"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    <i className="bi bi-people-fill text-success me-2"></i>
                    Loading Squads
                  </h3>
                  <p className="text-white-50 fw-bold">
                    Assembling your legendary battle teams...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="min-vh-100"
        style={{
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 75%, #764ba2 100%)",
          position: "relative",
        }}
      >
        <div className="container-fluid py-5">
          <div className="row justify-content-center">
            <div className="col-12 col-md-8">
              <div className="card border-0 shadow-lg bg-danger bg-opacity-25 text-white backdrop-blur">
                <div className="card-body text-center p-5">
                  <div className="mb-4">
                    <i className="bi bi-exclamation-triangle-fill text-danger fs-1"></i>
                  </div>
                  <h3
                    className="text-white fw-bold mb-3"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    Connection Failed
                  </h3>
                  <p className="text-white-50 fw-bold">
                    {error?.message ||
                      "Failed to load teams data. Please try again later."}
                  </p>
                  <button
                    className="btn btn-danger btn-lg mt-3"
                    onClick={() => window.location.reload()}
                  >
                    <i className="bi bi-arrow-clockwise me-2"></i>
                    Retry Connection
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Ensure teams is an array and properly typed
  const safeTeams: TeamWithPokemon[] = Array.isArray(teams) ? teams : [];

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
      {/* Animated Background Particles */}
      <div
        className="position-absolute w-100 h-100"
        style={{ opacity: 0.1, zIndex: 1 }}
      >
        <div
          className="position-absolute animate__animated animate__fadeInUp animate__infinite animate__slower"
          style={{ top: "5%", left: "5%", fontSize: "3rem" }}
        >
          👥
        </div>
        <div
          className="position-absolute animate__animated animate__fadeInDown animate__infinite animate__slower animate__delay-1s"
          style={{ top: "10%", right: "10%", fontSize: "2.5rem" }}
        >
          🏆
        </div>
        <div
          className="position-absolute animate__animated animate__fadeInLeft animate__infinite animate__slower animate__delay-2s"
          style={{ top: "15%", left: "50%", fontSize: "2rem" }}
        >
          ⚔️
        </div>
        <div
          className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-3s"
          style={{ bottom: "20%", left: "15%", fontSize: "2.5rem" }}
        >
          🛡️
        </div>
        <div
          className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-4s"
          style={{ bottom: "15%", right: "20%", fontSize: "2rem" }}
        >
          ⚡
        </div>
      </div>

      <div
        className="container-fluid py-5"
        style={{ zIndex: 2, position: "relative" }}
      >
        {/* Epic Header */}
        <div className="row justify-content-center mb-5">
          <div className="col-12">
            <div className="bg-dark bg-opacity-50 rounded-4 p-4 backdrop-blur text-center animate__animated animate__fadeInDown">
              <div className="d-flex justify-content-between align-items-center flex-wrap">
                <div className="flex-grow-1">
                  <h1
                    className="display-4 fw-bold text-white mb-2"
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    <i className="bi bi-people-fill text-success me-3"></i>
                    SQUAD COMMAND CENTER
                    <i className="bi bi-people-fill text-success ms-3"></i>
                  </h1>
                  <p className="text-white-50 fw-bold mb-0">
                    Forge legendary battle formations
                  </p>
                </div>
                <div className="ms-3">
                  <div className="bg-success bg-opacity-20 rounded-pill px-4 py-3 backdrop-blur">
                    <div className="text-white fw-bold fs-4">
                      <i className="bi bi-shield-fill  me-2"></i>
                      {safeTeams.length}
                    </div>
                    <small className="text-white fw-bold">Squads</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-4">
          {/* Teams Display */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg bg-dark bg-opacity-25 backdrop-blur animate__animated animate__fadeInLeft animate__delay-1s">
              <div className="card-header bg-transparent border-bottom border-success text-center">
                <h3 className="text-success fw-bold mb-0">
                  <i className="bi bi-trophy-fill me-2"></i>
                  LEGENDARY SQUADS RANKED BY POWER
                  <i className="bi bi-trophy-fill ms-2"></i>
                </h3>
              </div>
              <div className="card-body p-0">
                <TeamsDisplay teams={safeTeams} />
              </div>
            </div>
          </div>

          {/* Create Team Form */}
          <div className="col-lg-4">
            <div
              className="sticky-top animate__animated animate__fadeInRight animate__delay-2s"
              style={{ top: "2rem" }}
            >
              <CreateTeamForm />
            </div>
          </div>
        </div>

        {/* Squad Rules & Stats */}
        <div className="row justify-content-center mt-5">
          <div className="col-12">
            <div className="row g-4">
              {/* Rules Card */}
              <div className="col-lg-8">
                <div className="card border-0 shadow-lg bg-info bg-opacity-25 text-white backdrop-blur animate__animated animate__fadeInUp animate__delay-3s">
                  <div className="card-body p-4">
                    <div className="row align-items-center">
                      <div className="col-auto">
                        <div className="bg-info bg-opacity-30 rounded-circle p-3">
                          <i className="bi bi-info-circle-fill text-info fs-2"></i>
                        </div>
                      </div>
                      <div className="col">
                        <h5
                          className="text-white fw-bold mb-2"
                          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                        >
                          <i className="bi bi-shield-check text-success me-2"></i>
                          Squad Formation Rules
                        </h5>
                        <p className="text-white-50 fw-bold mb-0">
                          Each legendary squad must contain exactly{" "}
                          <span className="text-warning fw-bold">
                            6 Champions
                          </span>
                          . Squads are ranked by{" "}
                          <span className="text-success fw-bold">
                            Total Power
                          </span>{" "}
                          and optimized for maximum battle effectiveness.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-lg bg-warning bg-opacity-25 text-white backdrop-blur animate__animated animate__fadeInUp animate__delay-4s">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="bi bi-lightning-charge-fill text-warning fs-1"></i>
                    </div>
                    <h6 className="text-warning fw-bold">Total Squad Power</h6>
                    <div className="text-white fw-bold fs-3">
                      {safeTeams.reduce(
                        (sum, team) => sum + (team.total_power || 0),
                        0
                      )}
                    </div>
                    <small className="text-white-50 fw-bold">
                      Combined Strength
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Squad Stats */}
        {safeTeams.length > 0 && (
          <div className="row justify-content-center mt-4">
            <div className="col-12">
              <div className="row g-4">
                <div className="col-md-3">
                  <div className="card border-0 shadow bg-success bg-opacity-25 text-white backdrop-blur">
                    <div className="card-body text-center p-4">
                      <div className="mb-3">
                        <i className="bi bi-trophy text-success fs-1"></i>
                      </div>
                      <h6 className="text-success fw-bold">Strongest Squad</h6>
                      <div className="text-white fw-bold fs-5">
                        {Math.max(...safeTeams.map((t) => t.total_power || 0))}
                      </div>
                      <small className="text-white-50 fw-bold">Max Power</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow bg-primary bg-opacity-25 text-white backdrop-blur">
                    <div className="card-body text-center p-4">
                      <div className="mb-3">
                        <i className="bi bi-graph-up text-primary fs-1"></i>
                      </div>
                      <h6 className="text-primary fw-bold">Average Power</h6>
                      <div className="text-white fw-bold fs-5">
                        {safeTeams.length > 0
                          ? Math.round(
                              safeTeams.reduce(
                                (sum, team) => sum + (team.total_power || 0),
                                0
                              ) / safeTeams.length
                            )
                          : 0}
                      </div>
                      <small className="text-white-50 fw-bold">Per Squad</small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow bg-danger bg-opacity-25 text-white backdrop-blur">
                    <div className="card-body text-center p-4">
                      <div className="mb-3">
                        <i className="bi bi-people text-danger fs-1"></i>
                      </div>
                      <h6 className="text-danger fw-bold">Total Champions</h6>
                      <div className="text-white fw-bold fs-5">
                        {safeTeams.length * 6}
                      </div>
                      <small className="text-white-50 fw-bold">
                        In Service
                      </small>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card border-0 shadow bg-warning bg-opacity-25 text-white backdrop-blur">
                    <div className="card-body text-center p-4">
                      <div className="mb-3">
                        <i className="bi bi-shield-fill text-warning fs-1"></i>
                      </div>
                      <h6 className="text-warning fw-bold">Battle Ready</h6>
                      <div className="text-white fw-bold fs-5">
                        {safeTeams.length}
                      </div>
                      <small className="text-white-50 fw-bold">
                        Formations
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
}
