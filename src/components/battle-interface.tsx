"use client";

import { useState } from "react";
import { Team, BattleLog, Pokemon } from "@/types";
import BattleDisplay from "@/components/battle-display";
import { useBattle } from "@/hooks/use-battle";
import { useTeams } from "@/hooks/use-teams";
import { usePokemon } from "@/hooks/use-pokemon";

interface BattleInterfaceProps {
  teams: Team[];
}

interface TeamPokemonDisplayProps {
  team: Team;
  pokemon: Pokemon[];
  teamColor: "primary" | "success";
  teamNumber: 1 | 2;
}

const TeamPokemonDisplay = ({
  team,
  pokemon,
  teamColor,
  teamNumber,
}: TeamPokemonDisplayProps) => {
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

  const getTypeEmoji = (typeName: string) => {
    switch (typeName?.toLowerCase()) {
      case "fire":
        return "🔥";
      case "water":
        return "💧";
      case "grass":
        return "🌿";
      default:
        return "⚡";
    }
  };

  return (
    <div className="mt-4">
      <div
        className={`bg-${teamColor} bg-opacity-10 rounded-4 p-4 border border-${teamColor} border-opacity-25`}
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className={`text-${teamColor} fw-bold mb-0`}>
            <i className="bi bi-shield-fill me-2"></i>
            {team.name}
          </h5>
          <div className={`badge bg-${teamColor} fs-6 px-3 py-2`}>
            <i className="bi bi-lightning-fill me-1"></i>
            {team.total_power} Power
          </div>
        </div>

        {/* Pokemon Grid */}
        <div className="row g-3">
          {pokemon.map((poke, index) => (
            <div key={poke.id} className="col-6 col-md-4">
              <div className="card bg-dark bg-opacity-25 border-0 h-100 hover-lift">
                <div className="position-relative">
                  <img
                    src={poke.image}
                    alt={poke.name}
                    className="card-img-top rounded-top"
                    style={{
                      height: "120px",
                      objectFit: "cover",
                      filter: "brightness(1.1) contrast(1.1)",
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-pokemon.png";
                    }}
                  />
                  {/* Pokemon Number Badge */}
                  <div className="position-absolute top-0 start-0 m-2">
                    <div className={`badge bg-${teamColor} rounded-pill`}>
                      #{index + 1}
                    </div>
                  </div>
                  {/* Type Badge */}
                  <div className="position-absolute top-0 end-0 m-2">
                    <div
                      className={`badge ${getTypeColor(
                        poke.type_name
                      )} rounded-pill`}
                    >
                      {getTypeEmoji(poke.type_name)}
                    </div>
                  </div>
                </div>
                <div className="card-body p-3 text-center">
                  <h6
                    className="card-title text-white fw-bold mb-2"
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                  >
                    {poke.name}
                  </h6>
                  <div className="row g-2 small">
                    <div className="col-6">
                      <div
                        className="text-danger fw-bold"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                      >
                        ⚔️ {poke.power}
                      </div>
                      <div className="text-white-50 small fw-bold">Power</div>
                    </div>
                    <div className="col-6">
                      <div
                        className="text-success fw-bold"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                      >
                        ❤️ {poke.life}
                      </div>
                      <div className="text-white-50 small fw-bold">Life</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Team Stats Summary */}
        <div className="mt-4 text-center">
          <div className="row g-3">
            <div className="col-4">
              <div className={`bg-${teamColor} bg-opacity-20 rounded-3 p-2`}>
                <div className={`text-white fw-bold`}>{pokemon.length}</div>
                <small className="text-white fw-bold">Pokémon</small>
              </div>
            </div>
            <div className="col-4">
              <div className={`bg-${teamColor} bg-opacity-20 rounded-3 p-2`}>
                <div className={`text-white fw-bold`}>
                  {Math.round(
                    pokemon.reduce((sum, p) => sum + p.power, 0) /
                      pokemon.length
                  )}
                </div>
                <small className="text-white fw-bold">Avg Power</small>
              </div>
            </div>
            <div className="col-4">
              <div className={`bg-${teamColor} bg-opacity-20 rounded-3 p-2`}>
                <div className={`text-white fw-bold`}>
                  {Math.round(
                    pokemon.reduce((sum, p) => sum + p.life, 0) / pokemon.length
                  )}
                </div>
                <small className="text-white fw-bold">Avg Life</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function BattleInterface({ teams }: BattleInterfaceProps) {
  const [selectedTeam1, setSelectedTeam1] = useState<string>("");
  const [selectedTeam2, setSelectedTeam2] = useState<string>("");
  const [battleStarted, setBattleStarted] = useState(false);

  const { data: teamsData = [], isLoading: teamsLoading } = useTeams();
  const { data: allPokemon = [], isLoading: pokemonLoading } = usePokemon();
  const {
    mutate: startBattle,
    data: battleResult,
    isPending: battlePending,
    error: battleError,
  } = useBattle();

  const handleStartBattle = () => {
    if (selectedTeam1 && selectedTeam2 && selectedTeam1 !== selectedTeam2) {
      startBattle(
        { team1_id: selectedTeam1, team2_id: selectedTeam2 },
        {
          onSuccess: () => {
            setBattleStarted(true);
          },
        }
      );
    }
  };

  const handleNewBattle = () => {
    setBattleStarted(false);
    setSelectedTeam1("");
    setSelectedTeam2("");
  };

  const getTeamById = (id: string): Team | undefined => {
    return teamsData.find((team) => team.id === id);
  };

  const getTeamPokemon = (team: Team): Pokemon[] => {
    if (!team || !team.pokemon_ids || !allPokemon) return [];
    return team.pokemon_ids
      .map((id) => allPokemon.find((pokemon) => pokemon.id === id))
      .filter(Boolean) as Pokemon[];
  };

  const selectedTeam1Data = selectedTeam1 ? getTeamById(selectedTeam1) : null;
  const selectedTeam2Data = selectedTeam2 ? getTeamById(selectedTeam2) : null;
  const team1Pokemon = selectedTeam1Data
    ? getTeamPokemon(selectedTeam1Data)
    : [];
  const team2Pokemon = selectedTeam2Data
    ? getTeamPokemon(selectedTeam2Data)
    : [];

  if (battleStarted && battleResult) {
    return (
      <div>
        <div className="container mb-4">
          <div className="text-center">
            <button
              className="btn btn-lg px-5 py-3 border-0 shadow-lg animate__animated animate__pulse"
              onClick={handleNewBattle}
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontSize: "1.1rem",
              }}
            >
              <i className="bi bi-arrow-left-circle me-2"></i>
              Start New Epic Battle
            </button>
          </div>
        </div>
        <BattleDisplay battleLog={battleResult} />
      </div>
    );
  }

  if (teamsLoading || pokemonLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="bg-dark bg-opacity-50 rounded-4 p-5">
            <div
              className="spinner-border text-warning mb-3"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Loading teams...</span>
            </div>
            <h4 className="text-white fw-bold">Preparing Battle Arena</h4>
            <p className="text-white-50 mb-0">
              Loading legendary teams and Pokémon...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (teamsData.length < 2) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="card border-0 shadow-lg bg-dark bg-opacity-75 text-white">
            <div className="card-body p-5">
              <i className="bi bi-shield-exclamation display-1 text-warning mb-4"></i>
              <h3 className="fw-bold text-warning mb-3">Insufficient Teams</h3>
              <p className="text-white-50 mb-4">
                You need at least 2 legendary teams to enter the battle arena.
              </p>
              <a href="/teams" className="btn btn-warning btn-lg px-5 py-3">
                <i className="bi bi-plus-circle me-2"></i>
                Create Legendary Teams
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      {/* Battle Setup Header */}
      <div className="text-center mb-5">
        <div className="bg-dark bg-opacity-50 rounded-4 p-4 mb-4 backdrop-blur">
          <h2 className="display-5 fw-bold text-white mb-2">
            <i className="bi bi-lightning-charge-fill text-warning me-3"></i>
            Choose Your Champions
            <i className="bi bi-lightning-charge-fill text-warning ms-3"></i>
          </h2>
          <p className="lead text-white-50 mb-0">
            Select two legendary teams for the ultimate showdown!
          </p>
        </div>
      </div>

      {/* Team Selection */}
      <div className="row mb-5 g-4">
        {/* Team 1 Selection */}
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-lg bg-dark bg-opacity-25 backdrop-blur">
            <div className="card-header bg-primary bg-opacity-75 text-white text-center border-0">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-shield-fill me-2"></i>
                TEAM 1 - CHALLENGERS
              </h4>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <label className="form-label text-white fw-bold mb-3">
                  <i className="bi bi-cursor-fill me-2"></i>
                  Select Your First Champion Team:
                </label>
                <select
                  className="form-select form-select-lg bg-dark text-white border-primary"
                  value={selectedTeam1}
                  onChange={(e) => setSelectedTeam1(e.target.value)}
                  style={{
                    boxShadow: "0 0 20px rgba(0,123,255,0.3)",
                    border: "2px solid #0d6efd",
                  }}
                >
                  <option value="">🏆 Choose a legendary team...</option>
                  {teamsData.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                      disabled={team.id === selectedTeam2}
                    >
                      ⚡ {team.name} (Power: {team.total_power})
                    </option>
                  ))}
                </select>
              </div>

              {/* Team 1 Pokemon Display */}
              {selectedTeam1Data && team1Pokemon.length > 0 && (
                <TeamPokemonDisplay
                  team={selectedTeam1Data}
                  pokemon={team1Pokemon}
                  teamColor="primary"
                  teamNumber={1}
                />
              )}
            </div>
          </div>
        </div>

        {/* Team 2 Selection */}
        <div className="col-lg-6">
          <div className="card h-100 border-0 shadow-lg bg-dark bg-opacity-25 backdrop-blur">
            <div className="card-header bg-success bg-opacity-75 text-white text-center border-0">
              <h4 className="mb-0 fw-bold">
                <i className="bi bi-shield-fill me-2"></i>
                TEAM 2 - DEFENDERS
              </h4>
            </div>
            <div className="card-body p-4">
              <div className="mb-4">
                <label className="form-label text-white fw-bold mb-3">
                  <i className="bi bi-cursor-fill me-2"></i>
                  Select Your Second Champion Team:
                </label>
                <select
                  className="form-select form-select-lg bg-dark text-white border-success"
                  value={selectedTeam2}
                  onChange={(e) => setSelectedTeam2(e.target.value)}
                  style={{
                    boxShadow: "0 0 20px rgba(25,135,84,0.3)",
                    border: "2px solid #198754",
                  }}
                >
                  <option value="">🏆 Choose a legendary team...</option>
                  {teamsData.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                      disabled={team.id === selectedTeam1}
                    >
                      ⚡ {team.name} (Power: {team.total_power})
                    </option>
                  ))}
                </select>
              </div>

              {/* Team 2 Pokemon Display */}
              {selectedTeam2Data && team2Pokemon.length > 0 && (
                <TeamPokemonDisplay
                  team={selectedTeam2Data}
                  pokemon={team2Pokemon}
                  teamColor="success"
                  teamNumber={2}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Battle Matchup Preview */}
      {selectedTeam1Data && selectedTeam2Data && (
        <div className="row mb-5">
          <div className="col-12">
            <div
              className="card border-0 shadow-lg bg-gradient text-white"
              style={{
                background:
                  "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)",
              }}
            >
              <div className="card-header bg-transparent border-0 text-center">
                <h3 className="fw-bold mb-0">
                  <i className="bi bi-lightning-fill me-2"></i>
                  ⚔️ EPIC BATTLE MATCHUP ⚔️
                  <i className="bi bi-lightning-fill ms-2"></i>
                </h3>
              </div>
              <div className="card-body p-4">
                <div className="row align-items-center">
                  <div className="col-5 text-center">
                    <div className="bg-white bg-opacity-20 rounded-4 p-4 backdrop-blur">
                      <div className="mb-3">
                        <i className="bi bi-shield-fill text-primary fs-1"></i>
                      </div>
                      <h4 className="fw-bold mb-2">{selectedTeam1Data.name}</h4>
                      <div className="display-6 fw-bold text-warning mb-2">
                        <i className="bi bi-lightning-fill"></i>
                        {selectedTeam1Data.total_power}
                      </div>
                      <div className="small opacity-75">Total Power</div>
                      <div className="mt-3">
                        <div className="badge bg-primary bg-opacity-75 fs-6 px-3 py-2">
                          {team1Pokemon.length} Champions Ready
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-2 text-center">
                    <div className="display-1 fw-bold animate__animated animate__pulse animate__infinite">
                      ⚡VS⚡
                    </div>
                  </div>

                  <div className="col-5 text-center">
                    <div className="bg-white bg-opacity-20 rounded-4 p-4 backdrop-blur">
                      <div className="mb-3">
                        <i className="bi bi-shield-fill text-success fs-1"></i>
                      </div>
                      <h4 className="fw-bold mb-2">{selectedTeam2Data.name}</h4>
                      <div className="display-6 fw-bold text-warning mb-2">
                        <i className="bi bi-lightning-fill"></i>
                        {selectedTeam2Data.total_power}
                      </div>
                      <div className="small opacity-75">Total Power</div>
                      <div className="mt-3">
                        <div className="badge bg-success bg-opacity-75 fs-6 px-3 py-2">
                          {team2Pokemon.length} Champions Ready
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Power Advantage & Type Analysis */}
                <div className="mt-4 text-center">
                  <div className="row g-3">
                    <div className="col-md-6">
                      {selectedTeam1Data.total_power >
                      selectedTeam2Data.total_power ? (
                        <div className="badge bg-primary bg-opacity-75 fs-6 px-4 py-3">
                          <i className="bi bi-trophy-fill me-2"></i>
                          {selectedTeam1Data.name} has the power advantage!
                        </div>
                      ) : selectedTeam2Data.total_power >
                        selectedTeam1Data.total_power ? (
                        <div className="badge bg-success bg-opacity-75 fs-6 px-4 py-3">
                          <i className="bi bi-trophy-fill me-2"></i>
                          {selectedTeam2Data.name} has the power advantage!
                        </div>
                      ) : (
                        <div className="badge bg-warning bg-opacity-75 text-dark fs-6 px-4 py-3">
                          <i className="bi bi-balance-scale me-2"></i>
                          Teams are perfectly matched!
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="badge bg-dark bg-opacity-50 fs-6 px-4 py-3">
                        <i className="bi bi-clock-fill me-2"></i>
                        Battle will have multiple epic rounds!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Battle Button */}
      <div className="text-center">
        <button
          className="btn btn-lg px-5 py-4 border-0 shadow-lg position-relative overflow-hidden"
          onClick={handleStartBattle}
          disabled={
            !selectedTeam1 ||
            !selectedTeam2 ||
            selectedTeam1 === selectedTeam2 ||
            battlePending
          }
          style={{
            background: battlePending
              ? "linear-gradient(135deg, #6c757d 0%, #495057 100%)"
              : "linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)",
            color: "white",
            fontSize: "1.3rem",
            fontWeight: "bold",
            transform: battlePending ? "scale(0.95)" : "scale(1)",
            transition: "all 0.3s ease",
          }}
        >
          {battlePending ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-3"
                role="status"
              ></span>
              <i className="bi bi-lightning-charge-fill me-2"></i>
              INITIALIZING EPIC BATTLE...
              <i className="bi bi-lightning-charge-fill ms-2"></i>
            </>
          ) : (
            <>
              <i className="bi bi-lightning-charge-fill me-3"></i>
              🔥 START LEGENDARY BATTLE 🔥
              <i className="bi bi-lightning-charge-fill ms-3"></i>
            </>
          )}
        </button>

        <div className="mt-4">
          <div className="bg-dark bg-opacity-50 rounded-pill px-4 py-2 d-inline-block">
            <small className="text-white-50">
              <i className="bi bi-info-circle me-2"></i>
              Battle will simulate epic 1v1 rounds with elemental mastery and
              type effectiveness
            </small>
          </div>
        </div>
      </div>

      {/* Battle Error */}
      {battleError && (
        <div className="alert alert-danger mt-4 bg-danger bg-opacity-25 border-danger text-white">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>Battle Arena Error:</strong> {battleError.message}
        </div>
      )}

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </div>
  );
}
