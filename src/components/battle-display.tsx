"use client";

import { useState, useEffect, useCallback } from "react";
import { BattleLog, BattleRound, Pokemon } from "@/types";

interface BattleDisplayProps {
  battleLog: BattleLog;
}

interface PokemonWithStatus extends Pokemon {
  currentLife: number;
  isDefeated: boolean;
  isActive: boolean;
}

interface BattlePhaseProps {
  battleLog: BattleLog;
  onStartBattle: () => void;
  onResetBattle: () => void;
}

interface RoundWinner {
  winner: "pokemon1" | "pokemon2" | "draw";
  pokemon1Defeated: boolean;
  pokemon2Defeated: boolean;
  damageDealt1: number;
  damageDealt2: number;
}

// Helper function to determine round winner
const getRoundWinner = (round: BattleRound): RoundWinner => {
  const pokemon1Defeated = round.life1_after <= 0;
  const pokemon2Defeated = round.life2_after <= 0;

  if (pokemon1Defeated && pokemon2Defeated) {
    return {
      winner: "draw",
      pokemon1Defeated: true,
      pokemon2Defeated: true,
      damageDealt1: round.damage1,
      damageDealt2: round.damage2,
    };
  } else if (pokemon1Defeated) {
    return {
      winner: "pokemon2",
      pokemon1Defeated: true,
      pokemon2Defeated: false,
      damageDealt1: round.damage1,
      damageDealt2: round.damage2,
    };
  } else if (pokemon2Defeated) {
    return {
      winner: "pokemon1",
      pokemon1Defeated: false,
      pokemon2Defeated: true,
      damageDealt1: round.damage1,
      damageDealt2: round.damage2,
    };
  } else {
    // Determine winner by damage dealt
    const winner =
      round.damage1 > round.damage2
        ? "pokemon1"
        : round.damage2 > round.damage1
        ? "pokemon2"
        : "draw";
    return {
      winner,
      pokemon1Defeated: false,
      pokemon2Defeated: false,
      damageDealt1: round.damage1,
      damageDealt2: round.damage2,
    };
  }
};

// Reusable Components
const IntroPhase = ({
  battleLog,
  onStartBattle,
}: Pick<BattlePhaseProps, "battleLog" | "onStartBattle">) => (
  <div
    className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
    style={{ zIndex: 100 }}
  >
    <div className="text-center">
      <div className="bg-dark bg-opacity-75 text-white rounded-3 p-5 shadow-lg animate__animated animate__zoomIn">
        <h1 className="display-4 fw-bold mb-4">
          <i className="bi bi-lightning-charge-fill text-warning me-3"></i>
          EPIC BATTLE
          <i className="bi bi-lightning-charge-fill text-warning ms-3"></i>
        </h1>
        <div className="row mb-4">
          <div className="col-5 text-end">
            <h3 className="text-primary">{battleLog.team1.name}</h3>
            <div className="badge bg-primary fs-6">
              Power: {battleLog.team1.total_power}
            </div>
          </div>
          <div className="col-2 d-flex align-items-center justify-content-center">
            <div className="display-3 text-danger fw-bold">VS</div>
          </div>
          <div className="col-5 text-start">
            <h3 className="text-success">{battleLog.team2.name}</h3>
            <div className="badge bg-success fs-6">
              Power: {battleLog.team2.total_power}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <div className="text-muted">
            <i className="bi bi-info-circle me-2"></i>
            Battle will have {battleLog.rounds.length} rounds
          </div>
        </div>
        <button
          className="btn btn-danger btn-lg px-5 py-3 animate__animated animate__pulse animate__infinite"
          onClick={onStartBattle}
          style={{ fontSize: "1.25rem" }}
        >
          <i className="bi bi-play-fill me-2"></i>
          START BATTLE!
        </button>
      </div>
    </div>
  </div>
);

const VictoryPhase = ({
  battleLog,
  onResetBattle,
}: Pick<BattlePhaseProps, "battleLog" | "onResetBattle">) => {
  const team1Wins = battleLog.rounds.filter(
    (round) => getRoundWinner(round).winner === "pokemon1"
  ).length;
  const team2Wins = battleLog.rounds.filter(
    (round) => getRoundWinner(round).winner === "pokemon2"
  ).length;
  const draws = battleLog.rounds.filter(
    (round) => getRoundWinner(round).winner === "draw"
  ).length;

  return (
    <div
      className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
      style={{ zIndex: 100 }}
    >
      <div className="text-center">
        <div className="bg-success bg-opacity-90 text-white rounded-3 p-5 shadow-lg animate__animated animate__bounceIn">
          <div className="display-1 mb-4 animate__animated animate__rotateIn">
            <i className="bi bi-trophy-fill text-warning"></i>
          </div>
          <h1 className="display-3 fw-bold mb-4 animate__animated animate__flash animate__infinite">
            {battleLog.winner} WINS!
          </h1>

          {/* Battle Statistics */}
          <div className="row mb-4">
            <div className="col-4">
              <div className="bg-primary bg-opacity-75 rounded-3 p-3">
                <div className="fs-2 fw-bold">{team1Wins}</div>
                <div className="small">Team 1 Rounds</div>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-warning bg-opacity-75 rounded-3 p-3 text-dark">
                <div className="fs-2 fw-bold">{draws}</div>
                <div className="small">Draws</div>
              </div>
            </div>
            <div className="col-4">
              <div className="bg-success bg-opacity-75 rounded-3 p-3">
                <div className="fs-2 fw-bold">{team2Wins}</div>
                <div className="small">Team 2 Rounds</div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="badge bg-light text-dark fs-5 px-3 py-2">
              Battle completed in {battleLog.rounds.length} rounds
            </div>
          </div>
          <button
            className="btn btn-light btn-lg px-4 me-3"
            onClick={onResetBattle}
          >
            <i className="bi bi-arrow-counterclockwise me-2"></i>
            Watch Again
          </button>
        </div>
      </div>
    </div>
  );
};

interface TeamRosterProps {
  pokemon: PokemonWithStatus[];
  position: "top" | "bottom";
}

const TeamRoster = ({ pokemon, position }: TeamRosterProps) => (
  <div
    className="position-absolute w-100 d-flex justify-content-center"
    style={{
      [position]: position === "top" ? "100px" : "20px",
      zIndex: 10,
    }}
  >
    <div className="bg-dark bg-opacity-75 rounded-3 p-2">
      <div className="d-flex gap-2">
        {pokemon.map((poke, index) => (
          <div
            key={`${position}-${poke.id}-${index}`}
            className={`position-relative transition-all ${
              poke.isActive
                ? "border border-warning border-3 animate__animated animate__pulse"
                : ""
            }`}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              overflow: "hidden",
              opacity: poke.isDefeated ? 0.3 : 1,
              transform: poke.isActive ? "scale(1.2)" : "scale(1)",
              transition: "all 0.5s ease",
              filter: poke.isDefeated ? "grayscale(100%)" : "none",
            }}
          >
            <img
              src={poke.image}
              alt={poke.name}
              className="w-100 h-100"
              style={{ objectFit: "cover" }}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-pokemon.png";
              }}
            />
            {poke.isDefeated && (
              <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <i className="bi bi-x-circle-fill text-danger fs-5 animate__animated animate__bounceIn"></i>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

interface RoundWinnerDisplayProps {
  roundWinner: RoundWinner;
  round: BattleRound;
  showWinner: boolean;
}

const RoundWinnerDisplay = ({
  roundWinner,
  round,
  showWinner,
}: RoundWinnerDisplayProps) => {
  if (!showWinner) return null;

  const getWinnerText = () => {
    if (roundWinner.winner === "draw") {
      return "ROUND DRAW!";
    } else if (roundWinner.winner === "pokemon1") {
      return `${round.pokemon1.name.toUpperCase()} WINS ROUND!`;
    } else {
      return `${round.pokemon2.name.toUpperCase()} WINS ROUND!`;
    }
  };

  const getWinnerColor = () => {
    if (roundWinner.winner === "draw") return "bg-warning text-dark";
    if (roundWinner.winner === "pokemon1") return "bg-primary text-white";
    return "bg-success text-white";
  };

  return (
    <div
      className="position-absolute top-50 start-50 translate-middle"
      style={{ zIndex: 30 }}
    >
      <div
        className={`${getWinnerColor()} rounded-3 p-4 shadow-lg animate__animated animate__zoomIn`}
      >
        <div className="text-center">
          <div className="fs-3 fw-bold mb-2">{getWinnerText()}</div>
          <div className="row">
            <div className="col-6 text-center">
              <div className="fs-5">{roundWinner.damageDealt1}</div>
              <small>Damage</small>
            </div>
            <div className="col-6 text-center">
              <div className="fs-5">{roundWinner.damageDealt2}</div>
              <small>Damage</small>
            </div>
          </div>
          {(roundWinner.pokemon1Defeated || roundWinner.pokemon2Defeated) && (
            <div className="mt-2">
              <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
              Pokemon Defeated!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface PokemonBattlerProps {
  pokemon: Pokemon;
  currentLife: number;
  maxLife: number;
  damageDealt: number;
  damageTaken: number;
  typeFactor: number;
  isAnimating: boolean;
  showDamage: boolean;
  side: "left" | "right";
  isWinner: boolean;
  isDefeated: boolean;
}

const PokemonBattler = ({
  pokemon,
  currentLife,
  maxLife,
  damageDealt,
  damageTaken,
  typeFactor,
  isAnimating,
  showDamage,
  side,
  isWinner,
  isDefeated,
}: PokemonBattlerProps) => {
  const healthPercentage = Math.max(
    0,
    Math.min(100, (currentLife / maxLife) * 100)
  );

  const getHealthBarColor = (percentage: number) => {
    if (percentage > 60) return "bg-success";
    if (percentage > 30) return "bg-warning";
    return "bg-danger";
  };

  const getTypeColor = (typeName: string) => {
    switch (typeName?.toLowerCase()) {
      case "fire":
        return "bg-danger";
      case "water":
        return "bg-primary";
      case "grass":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="text-center" style={{ flex: "1", maxWidth: "400px" }}>
      <div
        className={`position-relative mb-4 ${
          isAnimating ? "animate__animated animate__shakeX" : ""
        } ${isWinner ? "animate__animated animate__pulse" : ""}`}
      >
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className={`rounded-3 border ${
            side === "left" ? "border-primary" : "border-success"
          } border-3 ${
            isDefeated ? "animate__animated animate__fadeOut" : ""
          } ${isWinner ? "border-warning border-4" : ""}`}
          style={{
            width: "200px",
            height: "200px",
            objectFit: "cover",
            boxShadow: isWinner
              ? "0 0 30px rgba(255,193,7,0.8)"
              : side === "left"
              ? "0 10px 30px rgba(0,123,255,0.3)"
              : "0 10px 30px rgba(40,167,69,0.3)",
            filter: isDefeated ? "grayscale(100%) brightness(0.5)" : "none",
            transition: "all 0.5s ease",
            transform: isWinner ? "scale(1.05)" : "scale(1)",
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder-pokemon.png";
          }}
        />

        {/* Winner Crown */}
        {isWinner && !isDefeated && (
          <div className="position-absolute top-0 start-50 translate-middle-x mt-n3">
            <i className="bi bi-award-fill text-warning fs-1 animate__animated animate__bounceIn"></i>
          </div>
        )}

        {/* Pokemon Name */}
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-n3">
          <div
            className={`${side === "left" ? "bg-primary" : "bg-success"} ${
              isWinner ? "bg-warning text-dark" : "text-white"
            } rounded-pill px-3 py-1 fw-bold shadow`}
          >
            {pokemon.name}
          </div>
        </div>
      </div>

      {/* Health Bar */}
      <div className="mb-3">
        <div className="d-flex justify-content-between small mb-1">
          <span>
            Life: {Math.max(0, currentLife)} / {maxLife}
          </span>
          <span>{healthPercentage.toFixed(1)}%</span>
        </div>
        <div className="progress" style={{ height: "25px" }}>
          <div
            className={`progress-bar ${getHealthBarColor(healthPercentage)} ${
              isAnimating ? "progress-bar-striped progress-bar-animated" : ""
            }`}
            role="progressbar"
            style={{
              width: `${healthPercentage}%`,
              transition: "width 1s ease-in-out",
            }}
          >
            <strong>{Math.max(0, currentLife)} HP</strong>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div
        className={`bg-white bg-opacity-90 rounded-3 p-3 shadow ${
          isWinner ? "border border-warning border-2" : ""
        }`}
      >
        <div className="row text-center">
          <div className="col-6">
            <div className="text-success fw-bold fs-4">{damageDealt}</div>
            <small className="text-muted">Damage Dealt</small>
          </div>
          <div className="col-6">
            <div className="text-danger fw-bold fs-4">-{damageTaken}</div>
            <small className="text-muted">Damage Taken</small>
          </div>
        </div>
        <div className="mt-2">
          <span
            className={`badge ${getTypeColor(pokemon.type_name)} text-white`}
          >
            {pokemon.type_name} • {typeFactor}x
          </span>
        </div>
      </div>

      {/* Damage Animation */}
      {showDamage && damageTaken > 0 && (
        <div className="position-absolute top-0 start-50 translate-middle-x animate__animated animate__bounceInDown">
          <div className="bg-danger text-white rounded-pill px-3 py-2 fw-bold fs-4">
            -{damageTaken}
          </div>
        </div>
      )}
    </div>
  );
};

interface BattleControlsProps {
  currentRound: number;
  totalRounds: number;
  isAutoPlaying: boolean;
  isFirstRound: boolean;
  isLastRound: boolean;
  onPause: () => void;
  onResume: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

const BattleControls = ({
  currentRound,
  totalRounds,
  isAutoPlaying,
  isFirstRound,
  isLastRound,
  onPause,
  onResume,
  onPrevious,
  onNext,
}: BattleControlsProps) => (
  <div
    className="position-fixed bottom-0 start-50 translate-middle-x mb-3"
    style={{ zIndex: 20 }}
  >
    <div className="bg-dark bg-opacity-90 rounded-pill px-4 py-2">
      <div className="d-flex align-items-center gap-2">
        <button
          className="btn btn-outline-light btn-sm"
          onClick={onPrevious}
          disabled={isFirstRound}
        >
          <i className="bi bi-chevron-left"></i>
        </button>

        {isAutoPlaying ? (
          <button className="btn btn-warning btn-sm px-3" onClick={onPause}>
            <i className="bi bi-pause-fill me-1"></i>
            Pause
          </button>
        ) : (
          <button
            className="btn btn-success btn-sm px-3"
            onClick={onResume}
            disabled={isLastRound}
          >
            <i className="bi bi-play-fill me-1"></i>
            Play
          </button>
        )}

        <button
          className="btn btn-outline-light btn-sm"
          onClick={onNext}
          disabled={isLastRound}
        >
          <i className="bi bi-chevron-right"></i>
        </button>

        <div className="text-white small ms-2">
          {currentRound + 1} / {totalRounds}
        </div>
      </div>
    </div>
  </div>
);

export default function BattleDisplay({ battleLog }: BattleDisplayProps) {
  const [currentRound, setCurrentRound] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [animatingHealth, setAnimatingHealth] = useState(false);
  const [battleStarted, setBattleStarted] = useState(false);
  const [showDamage, setShowDamage] = useState(false);
  const [roundTimer, setRoundTimer] = useState(5);
  const [showRoundTransition, setShowRoundTransition] = useState(false);
  const [battlePhase, setBattlePhase] = useState<
    "intro" | "fighting" | "victory"
  >("intro");
  const [showRoundWinner, setShowRoundWinner] = useState(false);

  // Safety checks
  if (!battleLog || !battleLog.rounds || battleLog.rounds.length === 0) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading battle...</span>
          </div>
          <p className="mt-3">Loading battle data...</p>
        </div>
      </div>
    );
  }

  // Ensure currentRound is within bounds
  const safeCurrentRound = Math.min(currentRound, battleLog.rounds.length - 1);
  const round = battleLog.rounds[safeCurrentRound];
  const isLastRound = safeCurrentRound === battleLog.rounds.length - 1;
  const isFirstRound = safeCurrentRound === 0;

  // Get round winner information
  const roundWinner = round ? getRoundWinner(round) : null;

  // Get team Pokemon status with proper error handling
  const getTeamPokemonStatus = useCallback(
    (teamNumber: 1 | 2): PokemonWithStatus[] => {
      try {
        const teamPokemon =
          teamNumber === 1
            ? battleLog.team1_remaining
            : battleLog.team2_remaining;
        if (!teamPokemon || !Array.isArray(teamPokemon)) {
          return [];
        }

        const currentRoundData = battleLog.rounds.slice(
          0,
          safeCurrentRound + 1
        );

        return teamPokemon.map((pokemon) => {
          if (!pokemon) {
            return {
              id: "",
              name: "Unknown",
              type: "",
              type_name: "",
              image: "/placeholder-pokemon.png",
              power: 0,
              life: 0,
              currentLife: 0,
              isDefeated: true,
              isActive: false,
            };
          }

          const pokemonRounds = currentRoundData.filter((r) => {
            if (!r) return false;
            const targetPokemon = teamNumber === 1 ? r.pokemon1 : r.pokemon2;
            return targetPokemon && targetPokemon.id === pokemon.id;
          });

          if (pokemonRounds.length === 0) {
            return {
              ...pokemon,
              currentLife: pokemon.life,
              isDefeated: false,
              isActive: false,
            };
          }

          const latestRound = pokemonRounds[pokemonRounds.length - 1];
          if (!latestRound) {
            return {
              ...pokemon,
              currentLife: pokemon.life,
              isDefeated: false,
              isActive: false,
            };
          }

          const currentLife =
            teamNumber === 1
              ? latestRound.life1_after
              : latestRound.life2_after;
          const isActive =
            round &&
            (teamNumber === 1
              ? latestRound.pokemon1?.id
              : latestRound.pokemon2?.id) === pokemon.id &&
            (teamNumber === 1 ? round.pokemon1?.id : round.pokemon2?.id) ===
              pokemon.id;

          return {
            ...pokemon,
            currentLife: Math.max(0, currentLife || 0),
            isDefeated: (currentLife || 0) <= 0,
            isActive: Boolean(isActive),
          };
        });
      } catch (error) {
        console.error("Error getting team Pokemon status:", error);
        return [];
      }
    },
    [battleLog, safeCurrentRound, round]
  );

  const team1Pokemon = getTeamPokemonStatus(1);
  const team2Pokemon = getTeamPokemonStatus(2);

  // Auto-play battle with timing
  const nextRound = useCallback(() => {
    if (safeCurrentRound < battleLog.rounds.length - 1) {
      setShowRoundTransition(true);
      setAnimatingHealth(true);

      setTimeout(() => {
        setCurrentRound((prev) =>
          Math.min(prev + 1, battleLog.rounds.length - 1)
        );
        setShowRoundTransition(false);
        setRoundTimer(5);

        // Show round winner
        setShowRoundWinner(true);
        setTimeout(() => setShowRoundWinner(false), 3000);
      }, 1000);

      setTimeout(() => {
        setAnimatingHealth(false);
        setShowDamage(true);
        setTimeout(() => setShowDamage(false), 2000);
      }, 1500);
    } else {
      setIsAutoPlaying(false);
      setBattlePhase("victory");
    }
  }, [safeCurrentRound, battleLog.rounds.length]);

  // Timer effect for auto-play
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isAutoPlaying && battlePhase === "fighting" && roundTimer > 0) {
      interval = setInterval(() => {
        setRoundTimer((prev) => {
          if (prev <= 1) {
            nextRound();
            return 5;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isAutoPlaying, battlePhase, roundTimer, nextRound]);

  // Battle control functions
  const startBattle = () => {
    setBattleStarted(true);
    setBattlePhase("fighting");
    setIsAutoPlaying(true);
    setRoundTimer(5);
  };

  const pauseBattle = () => {
    setIsAutoPlaying(false);
  };

  const resumeBattle = () => {
    if (battlePhase === "fighting" && !isLastRound) {
      setIsAutoPlaying(true);
    }
  };

  const goToPreviousRound = () => {
    if (!isFirstRound) {
      setIsAutoPlaying(false);
      setCurrentRound((prev) => Math.max(prev - 1, 0));
      setRoundTimer(5);
    }
  };

  const goToNextRound = () => {
    if (!isLastRound) {
      nextRound();
    }
  };

  const resetBattle = () => {
    setCurrentRound(0);
    setIsAutoPlaying(false);
    setBattleStarted(false);
    setBattlePhase("intro");
    setRoundTimer(5);
    setShowRoundWinner(false);
  };

  // Safety check for current round
  if (!round) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100">
        <div className="text-center">
          <div className="alert alert-warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            No battle data available for round {safeCurrentRound + 1}
          </div>
          <button className="btn btn-primary" onClick={resetBattle}>
            Reset Battle
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="battle-arena position-relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
      }}
    >
      {/* Intro Phase */}
      {battlePhase === "intro" && (
        <IntroPhase battleLog={battleLog} onStartBattle={startBattle} />
      )}

      {/* Victory Phase */}
      {battlePhase === "victory" && (
        <VictoryPhase battleLog={battleLog} onResetBattle={resetBattle} />
      )}

      {/* Battle Header */}
      {battleStarted && battlePhase === "fighting" && (
        <div className="container-fluid py-3">
          <div className="row align-items-center">
            <div className="col-3">
              <div className="bg-dark bg-opacity-75 text-white rounded-pill px-3 py-2 text-center">
                <strong>{battleLog.team1.name}</strong>
                <div className="small">Team 1</div>
              </div>
            </div>
            <div className="col-6 text-center">
              <div className="bg-dark bg-opacity-75 text-white rounded-pill px-4 py-2 d-inline-block">
                <div className="d-flex align-items-center justify-content-center gap-3">
                  <div className="fw-bold">ROUND {safeCurrentRound + 1}</div>
                  {isAutoPlaying && (
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="spinner-border spinner-border-sm text-warning"
                        role="status"
                      ></div>
                      <span className="badge bg-warning text-dark">
                        {roundTimer}s
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="col-3">
              <div className="bg-dark bg-opacity-75 text-white rounded-pill px-3 py-2 text-center">
                <strong>{battleLog.team2.name}</strong>
                <div className="small">Team 2</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Team Rosters */}
      {battleStarted && battlePhase === "fighting" && (
        <>
          <TeamRoster pokemon={team1Pokemon} position="top" />
          <TeamRoster pokemon={team2Pokemon} position="bottom" />
        </>
      )}

      {/* Round Winner Display */}
      {battleStarted && battlePhase === "fighting" && roundWinner && (
        <RoundWinnerDisplay
          roundWinner={roundWinner}
          round={round}
          showWinner={showRoundWinner}
        />
      )}

      {/* Main Battle Arena */}
      {battleStarted &&
        battlePhase === "fighting" &&
        round.pokemon1 &&
        round.pokemon2 && (
          <div
            className="d-flex align-items-center justify-content-between px-5 h-100"
            style={{ paddingTop: "180px", paddingBottom: "100px" }}
          >
            {/* Pokemon 1 */}
            <PokemonBattler
              pokemon={round.pokemon1}
              currentLife={round.life1_after}
              maxLife={round.pokemon1.life}
              damageDealt={round.damage1}
              damageTaken={round.damage2}
              typeFactor={round.type_factor1}
              isAnimating={animatingHealth}
              showDamage={showDamage}
              side="left"
              isWinner={roundWinner?.winner === "pokemon1"}
              isDefeated={round.life1_after <= 0}
            />

            {/* VS Section */}
            <div className="text-center mx-4">
              <div
                className={`display-1 fw-bold text-white mb-3 ${
                  showRoundTransition
                    ? "animate__animated animate__rotateIn"
                    : ""
                }`}
                style={{
                  textShadow: "3px 3px 6px rgba(0,0,0,0.7)",
                  transform: "rotate(-5deg)",
                }}
              >
                VS
              </div>
              <div className="bg-warning text-dark rounded-pill px-3 py-2 fw-bold">
                Type Factor: {round.type_factor1}x vs {round.type_factor2}x
              </div>
            </div>

            {/* Pokemon 2 */}
            <PokemonBattler
              pokemon={round.pokemon2}
              currentLife={round.life2_after}
              maxLife={round.pokemon2.life}
              damageDealt={round.damage2}
              damageTaken={round.damage1}
              typeFactor={round.type_factor2}
              isAnimating={animatingHealth}
              showDamage={showDamage}
              side="right"
              isWinner={roundWinner?.winner === "pokemon2"}
              isDefeated={round.life2_after <= 0}
            />
          </div>
        )}

      {/* Battle Controls */}
      {battleStarted && battlePhase === "fighting" && (
        <BattleControls
          currentRound={safeCurrentRound}
          totalRounds={battleLog.rounds.length}
          isAutoPlaying={isAutoPlaying}
          isFirstRound={isFirstRound}
          isLastRound={isLastRound}
          onPause={pauseBattle}
          onResume={resumeBattle}
          onPrevious={goToPreviousRound}
          onNext={goToNextRound}
        />
      )}

      {/* Round Transition Effect */}
      {showRoundTransition && (
        <div
          className="position-absolute w-100 h-100 d-flex align-items-center justify-content-center"
          style={{ zIndex: 50, backgroundColor: "rgba(0,0,0,0.7)" }}
        >
          <div className="text-center animate__animated animate__zoomIn">
            <div className="display-2 text-white fw-bold mb-3">
              ROUND {Math.min(safeCurrentRound + 2, battleLog.rounds.length)}
            </div>
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      )}

      {/* Add Animate.css */}
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
}
