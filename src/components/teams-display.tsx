"use client";

import { useState, useCallback, useMemo } from "react";
import { TeamWithPokemon } from "@/types";
import TeamEditModal from "@/components/team-edit-modal";

// Define interface for component props with clear documentation
interface TeamsDisplayProps {
  teams: TeamWithPokemon[];
}

/**
 * Component to display a list of Pokemon teams with their details
 * Shows team information, Pokemon grid, and provides edit functionality
 *
 * Features:
 * - Team ranking by power
 * - Pokemon grid display for each team
 * - Type distribution statistics
 * - Team editing capability
 *
 * @param teams - Array of teams with Pokemon data to display
 */
export default function TeamsDisplay({ teams }: TeamsDisplayProps) {
  // ==================== STATE MANAGEMENT ====================

  // Track which team is currently selected for editing
  const [selectedTeam, setSelectedTeam] = useState<TeamWithPokemon | null>(
    null
  );

  // ==================== MEMOIZED VALUES ====================

  /**
   * Check if teams array is valid and has content
   * Memoized to prevent unnecessary recalculations
   */
  const hasTeams = useMemo(() => {
    return Array.isArray(teams) && teams.length > 0;
  }, [teams]);

  /**
   * Pre-calculate team statistics for better performance
   * Memoized to prevent recalculating on every render
   */
  const teamStats = useMemo(() => {
    if (!hasTeams) return { totalTeams: 0, totalPower: 0, averagePower: 0 };

    const totalPower = teams.reduce(
      (sum, team) => sum + (team.total_power || 0),
      0
    );
    const averagePower = Math.round(totalPower / teams.length);

    return {
      totalTeams: teams.length,
      totalPower,
      averagePower,
    };
  }, [teams, hasTeams]);

  // ==================== CALLBACK FUNCTIONS ====================

  /**
   * Handle team edit button click
   * Opens the edit modal for the selected team
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleEditTeam = useCallback((team: TeamWithPokemon) => {
    setSelectedTeam(team);
  }, []);

  /**
   * Handle modal close
   * Resets the selected team to close the modal
   * Memoized to prevent unnecessary re-renders
   */
  const handleCloseModal = useCallback(() => {
    setSelectedTeam(null);
  }, []);

  /**
   * Get type-specific CSS class for Pokemon type badges
   * Memoized function to prevent recreation on every render
   */
  const getTypeColor = useCallback((typeName: string) => {
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
  }, []);

  /**
   * Calculate type distribution for a team
   * Returns object with count of each Pokemon type
   * Memoized per team to improve performance
   */
  const getTypeDistribution = useCallback(
    (teamPokemon: TeamWithPokemon["pokemon"]) => {
      if (!Array.isArray(teamPokemon)) {
        return { fire: 0, water: 0, grass: 0, other: 0 };
      }

      return teamPokemon.reduce(
        (acc, pokemon) => {
          const type = pokemon.type_name?.toLowerCase() || "other";
          switch (type) {
            case "fire":
              acc.fire++;
              break;
            case "water":
              acc.water++;
              break;
            case "grass":
              acc.grass++;
              break;
            default:
              acc.other++;
          }
          return acc;
        },
        { fire: 0, water: 0, grass: 0, other: 0 }
      );
    },
    []
  );

  // ==================== RENDER GUARDS ====================

  // Show empty state if no teams are available
  if (!hasTeams) {
    return (
      <div className="text-center py-5">
        <div className="mb-4">
          <i
            className="bi bi-shield-exclamation text-white-50"
            style={{ fontSize: "5rem" }}
          ></i>
        </div>
        <h4
          className="text-white fw-bold mb-3"
          style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
        >
          No Squads Assembled
        </h4>
        <p className="text-white-50 fw-bold">
          Your battle formations await creation!
        </p>
        <div className="mt-4">
          <small className="text-white-50">
            Create your first team to start battling with your Pokemon champions
          </small>
        </div>
      </div>
    );
  }

  // ==================== COMPONENT RENDER ====================

  return (
    <>
      {/* Teams Statistics Header */}
      <div className="bg-dark bg-opacity-25 p-3 mb-4 rounded-3">
        <div className="row text-center">
          <div className="col-md-4">
            <div className="text-success fw-bold fs-5">
              {teamStats.totalTeams}
            </div>
            <small className="text-white-50">Total Teams</small>
          </div>
          <div className="col-md-4">
            <div className="text-warning fw-bold fs-5">
              {teamStats.totalPower}
            </div>
            <small className="text-white-50">Combined Power</small>
          </div>
          <div className="col-md-4">
            <div className="text-info fw-bold fs-5">
              {teamStats.averagePower}
            </div>
            <small className="text-white-50">Average Power</small>
          </div>
        </div>
      </div>

      {/* Teams List */}
      <div className="p-4">
        <div className="row g-4">
          {teams.map((team, index) => {
            // Calculate type distribution for this team
            const typeDistribution = getTypeDistribution(team.pokemon);
            const totalLife = (team.pokemon || []).reduce(
              (sum, p) => sum + (p.life || 0),
              0
            );

            return (
            <div key={team.id} className="col-12">
              <div className="card border-0 shadow-lg bg-dark bg-opacity-50 text-white backdrop-blur hover-lift">
                <div className="card-body p-4">
                    {/* Team Header Section */}
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div className="d-flex align-items-center">
                        {/* Team Rank Badge */}
                      <div className="bg-success bg-opacity-30 rounded-circle p-3 me-3">
                          <span className="text-white fw-bold fs-4">
                          #{index + 1}
                        </span>
                      </div>

                        {/* Team Information */}
                      <div>
                        <h5
                          className="text-white fw-bold mb-1"
                            style={{
                              textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                            }}
                        >
                          {team.name}
                        </h5>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
                            <span className="text-white fw-bold">
                              Power: {team.total_power || 0}
                          </span>
                          </div>
                        </div>
                      </div>

                      {/* Team Actions */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-outline-warning btn-sm hover-lift"
                        onClick={() => handleEditTeam(team)}
                        title="Modify Squad"
                          type="button"
                      >
                        <i className="bi bi-pencil-square me-1"></i>
                        Modify
                      </button>
                      <div className="bg-warning bg-opacity-20 rounded-pill px-3 py-2">
                          <small className="text-white fw-bold">
                            <i className="bi bi-people-fill me-1"></i>
                            {team.pokemon?.length || 0} Champions
                        </small>
                        </div>
                    </div>
                  </div>

                    {/* Pokemon Grid Section */}
                  <div className="row g-3">
                      {(team.pokemon || []).map((pokemon, pokemonIndex) => (
                      <div
                          key={`${pokemon.id}-${pokemonIndex}`}
                        className="col-lg-2 col-md-3 col-sm-4 col-6"
                      >
                        <div className="card border-0 bg-dark bg-opacity-75 text-white h-100 hover-lift">
                          <div className="card-body p-3 text-center">
                              {/* Pokemon Image */}
                            <div className="mb-2">
                              <img
                                src={pokemon.image || "/pokemon/default.png"}
                                  alt={`${pokemon.name} - ${
                                    pokemon.type_name || pokemon.type
                                  } type Pokemon`}
                                className="rounded-circle"
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                }}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/pokemon/default.png";
                                }}
                                  loading="lazy" // Optimize image loading
                              />
                            </div>

                              {/* Pokemon Name */}
                            <h6
                              className="text-white fw-bold mb-1"
                              style={{
                                fontSize: "0.8rem",
                                textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                              }}
                            >
                              {pokemon.name}
                            </h6>

                              {/* Pokemon Type Badge */}
                            <div className="mb-2">
                              <span
                                  className={`badge ${getTypeColor(
                                    pokemon.type_name || pokemon.type
                                  )}`}
                                >
                                  {pokemon.type_name || pokemon.type}
                              </span>
                            </div>

                              {/* Pokemon Stats */}
                            <div className="d-flex justify-content-between">
                                <small
                                  className="text-warning fw-bold"
                                  title="Power"
                                >
                                <i className="bi bi-lightning-fill"></i>{" "}
                                  {pokemon.power || 0}
                              </small>
                                <small
                                  className="text-success fw-bold"
                                  title="Life"
                                >
                                <i className="bi bi-heart-fill"></i>{" "}
                                  {pokemon.life || 0}
                              </small>
                              </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                    {/* Team Statistics Section */}
                  <div className="row mt-3">
                    <div className="col-12">
                      <div className="bg-dark bg-opacity-50 rounded-3 p-3">
                        <div className="row text-center">
                            {/* Fire Type Count */}
                          <div className="col-md-3 col-6">
                            <div className="text-danger fw-bold">
                              <i className="bi bi-fire me-1"></i>
                                Fire: {typeDistribution.fire}
                              </div>
                            </div>

                            {/* Water Type Count */}
                          <div className="col-md-3 col-6">
                            <div className="text-primary fw-bold">
                              <i className="bi bi-droplet me-1"></i>
                                Water: {typeDistribution.water}
                              </div>
                            </div>

                            {/* Grass Type Count */}
                          <div className="col-md-3 col-6">
                            <div className="text-success fw-bold">
                              <i className="bi bi-tree me-1"></i>
                                Grass: {typeDistribution.grass}
                              </div>
                            </div>

                            {/* Total Life Points */}
                          <div className="col-md-3 col-6">
                            <div className="text-info fw-bold">
                              <i className="bi bi-heart-fill me-1"></i>
                                Total Life: {totalLife}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Edit Modal */}
      {selectedTeam && (
        <TeamEditModal
          team={selectedTeam}
          show={Boolean(selectedTeam)}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
