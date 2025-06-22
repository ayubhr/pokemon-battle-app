import Image from "next/image";
import styles from "./page.module.css";

export default function HomePage() {
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
        <div
          className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-4s"
          style={{ bottom: "20%", left: "15%", fontSize: "3rem" }}
        >
          ⚔️
        </div>
        <div
          className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-5s"
          style={{ bottom: "15%", right: "20%", fontSize: "2.5rem" }}
        >
          🏆
        </div>
      </div>

      <div
        className="container-fluid py-5"
        style={{ zIndex: 2, position: "relative" }}
      >
        {/* Epic Hero Section */}
        <div className="hero-section text-center py-5 mb-5">
          <div className="bg-dark bg-opacity-50 rounded-4 p-5 backdrop-blur animate__animated animate__fadeInDown">
            <h1
              className="display-2 fw-bold text-white mb-4"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            >
              <i className="bi bi-lightning-charge-fill text-warning me-3"></i>
              POKÉMON BATTLE ARENA
              <i className="bi bi-lightning-charge-fill text-warning ms-3"></i>
            </h1>
            <div className="h4 text-warning fw-bold mb-4 animate__animated animate__fadeInUp animate__delay-1s">
              🏆 THE ULTIMATE TRAINING GROUND 🏆
            </div>
            <p className="lead text-white-50 mb-4 animate__animated animate__fadeIn animate__delay-2s">
              Build your ultimate team, master your Pokémon, and engage in
              legendary battles!
            </p>

            {/* Stats Banner */}
            <div className="row justify-content-center animate__animated animate__fadeInUp animate__delay-3s">
              <div className="col-auto">
                <div className="bg-white bg-opacity-20 rounded-pill px-4 py-3 backdrop-blur">
                  <div className="row g-4 text-center">
                    <div className="col">
                      <div className="text-danger fw-bold fs-4">🔥</div>
                      <small className="text-black fw-bold">Fire</small>
                    </div>
                    <div className="col">
                      <div className="text-primary fw-bold fs-4">💧</div>
                      <small className="text-black fw-bold">Water</small>
                    </div>
                    <div className="col">
                      <div className="text-success fw-bold fs-4">🌿</div>
                      <small className="text-black fw-bold">Grass</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Epic Feature Cards */}
        <div className="row g-4 justify-content-center px-4">
          <div className="col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card h-100 border-0 shadow-lg bg-dark bg-opacity-25 text-white backdrop-blur hover-lift animate__animated animate__fadeInUp animate__delay-1s">
              <div className="card-body text-center d-flex flex-column p-4">
                <div className="mb-4">
                  <div
                    className="bg-danger bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <span className="display-4">🔥</span>
                  </div>
                </div>
                <h5
                  className="card-title text-white fw-bold mb-3"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                >
                  Manage Champions
                </h5>
                <p className="card-text text-white-50 flex-grow-1 fw-bold">
                  View and customize your legendary Pokémon collection. Master
                  their powers and abilities.
                </p>
                <a
                  href="/pokemon"
                  className="btn btn-danger btn-lg mt-auto px-4 py-3 border-0 shadow"
                  style={{
                    background:
                      "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                  }}
                >
                  <i className="bi bi-lightning-fill me-2"></i>
                  Train Pokémon
                </a>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card h-100 border-0 shadow-lg bg-dark bg-opacity-25 text-white backdrop-blur hover-lift animate__animated animate__fadeInUp animate__delay-2s">
              <div className="card-body text-center d-flex flex-column p-4">
                <div className="mb-4">
                  <div
                    className="bg-success bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <span className="display-4">👥</span>
                  </div>
                </div>
                <h5
                  className="card-title text-white fw-bold mb-3"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                >
                  Build Squads
                </h5>
                <p className="card-text text-white-50 flex-grow-1 fw-bold">
                  Create legendary teams of 6 champions. Strategize your
                  ultimate battle formation.
                </p>
                <a
                  href="/teams"
                  className="btn btn-success btn-lg mt-auto px-4 py-3 border-0 shadow"
                  style={{
                    background:
                      "linear-gradient(135deg, #198754 0%, #146c43 100%)",
                  }}
                >
                  <i className="bi bi-people-fill me-2"></i>
                  Form Teams
                </a>
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-md-4 col-lg-3 d-flex">
            <div className="card h-100 border-0 shadow-lg bg-dark bg-opacity-25 text-white backdrop-blur hover-lift animate__animated animate__fadeInUp animate__delay-3s">
              <div className="card-body text-center d-flex flex-column p-4">
                <div className="mb-4">
                  <div
                    className="bg-warning bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <span className="display-4">⚔️</span>
                  </div>
                </div>
                <h5
                  className="card-title text-white fw-bold mb-3"
                  style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                >
                  Epic Battles
                </h5>
                <p className="card-text text-white-50 flex-grow-1 fw-bold">
                  Enter the arena for legendary 1v1 battles with elemental
                  mastery and real-time combat.
                </p>
                <a
                  href="/battle"
                  className="btn btn-lg mt-auto px-4 py-3 border-0 shadow text-white fw-bold"
                  style={{
                    background:
                      "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)",
                  }}
                >
                  <i className="bi bi-lightning-charge-fill me-2"></i>
                  Enter Arena
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Features Section */}
        <div className="row justify-content-center mt-5 px-4">
          <div className="col-lg-10">
            <div className="card border-0 shadow-lg bg-dark bg-opacity-50 text-white backdrop-blur animate__animated animate__fadeInUp animate__delay-4s">
              <div className="card-header bg-transparent border-bottom border-warning text-center">
                <h3 className="text-warning fw-bold mb-0">
                  <i className="bi bi-star-fill me-2"></i>
                  LEGENDARY FEATURES
                  <i className="bi bi-star-fill ms-2"></i>
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="row g-4 text-center">
                  <div className="col-md-3">
                    <div className="mb-3">
                      <i className="bi bi-lightning-charge-fill text-warning fs-1"></i>
                    </div>
                    <h6 className="text-warning fw-bold">Type Mastery</h6>
                    <p className="text-white-50 small fw-bold">
                      Master fire, water, and grass elements
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <i className="bi bi-graph-up text-success fs-1"></i>
                    </div>
                    <h6 className="text-success fw-bold">Power Scaling</h6>
                    <p className="text-white-50 small fw-bold">
                      Strategic damage calculations
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <i className="bi bi-trophy-fill text-primary fs-1"></i>
                    </div>
                    <h6 className="text-primary fw-bold">Epic Victories</h6>
                    <p className="text-white-50 small fw-bold">
                      Legendary battle outcomes
                    </p>
                  </div>
                  <div className="col-md-3">
                    <div className="mb-3">
                      <i className="bi bi-shield-fill text-danger fs-1"></i>
                    </div>
                    <h6 className="text-danger fw-bold">Team Strategy</h6>
                    <p className="text-white-50 small fw-bold">
                      Ultimate tactical gameplay
                    </p>
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
