"use client";

import { useState } from "react";
import { Pokemon } from "@/types";
import { usePokemon } from "@/hooks/use-pokemon";
import { useCreateTeam } from "@/hooks/use-teams";

export default function CreateTeamForm() {
  const [teamName, setTeamName] = useState("");
  const [selectedPokemon, setSelectedPokemon] = useState<string[]>([]);

  const { data: availablePokemon = [], isLoading: pokemonLoading } =
    usePokemon();
  const createTeamMutation = useCreateTeam();

  const handlePokemonToggle = (pokemonId: string) => {
    setSelectedPokemon((prev) => {
      if (prev.includes(pokemonId)) {
        return prev.filter((id) => id !== pokemonId);
      } else if (prev.length < 6) {
        return [...prev, pokemonId];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedPokemon.length !== 6) {
      return;
    }

    try {
      await createTeamMutation.mutateAsync({
        name: teamName,
        pokemon_ids: selectedPokemon,
      });

      // Reset form on success
      setTeamName("");
      setSelectedPokemon([]);
    } catch (error) {
      // Error is handled by the mutation
      console.error("Failed to create team:", error);
    }
  };

  const getTotalPower = () => {
    return selectedPokemon.reduce((total, pokemonId) => {
      const pokemon = availablePokemon.find((p) => p.id === pokemonId);
      return total + (pokemon?.power || 0);
    }, 0);
  };

  if (pokemonLoading) {
    return (
      <div className="card shadow">
        <div className="card-header bg-success text-white">
          <h5 className="card-title mb-0">
            <i className="bi bi-plus-circle me-2"></i>
            Create New Team
          </h5>
        </div>
        <div className="card-body text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow">
      <div className="card-header bg-success text-white">
        <h5 className="card-title mb-0">
          <i className="bi bi-plus-circle me-2"></i>
          Create New Team
        </h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          {createTeamMutation.isError && (
            <div className="alert alert-danger alert-dismissible" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {createTeamMutation.error?.message || "Failed to create team"}
              <button
                type="button"
                className="btn-close"
                onClick={() => createTeamMutation.reset()}
                aria-label="Close"
              ></button>
            </div>
          )}

          {createTeamMutation.isSuccess && (
            <div className="alert alert-success alert-dismissible" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              Team created successfully!
              <button
                type="button"
                className="btn-close"
                onClick={() => createTeamMutation.reset()}
                aria-label="Close"
              ></button>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="teamName" className="form-label fw-bold">
              Team Name
            </label>
            <input
              type="text"
              className="form-control"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name..."
              required
              disabled={createTeamMutation.isPending}
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">
              Select Pokémon ({selectedPokemon.length}/6)
            </label>

            {selectedPokemon.length !== 6 && (
              <div className="alert alert-warning py-2 mb-2">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  You must select exactly 6 Pokémon
                </small>
              </div>
            )}

            {selectedPokemon.length > 0 && (
              <div className="mb-2">
                <small className="text-muted">
                  Total Power:{" "}
                  <span className="fw-bold text-warning">
                    {getTotalPower()}
                  </span>
                </small>
              </div>
            )}

            <div
              className="border rounded p-2"
              style={{ maxHeight: "300px", overflowY: "auto" }}
            >
              {availablePokemon.length > 0 ? (
                <div className="row g-2">
                  {availablePokemon.map((pokemon) => {
                    const isSelected = selectedPokemon.includes(pokemon.id);
                    const canSelect = selectedPokemon.length < 6 || isSelected;

                    return (
                      <div key={pokemon.id} className="col-6">
                        <div
                          className={`card h-100 ${
                            isSelected
                              ? "border-primary bg-light"
                              : canSelect
                              ? "border-light"
                              : "border-light opacity-50"
                          }`}
                          style={{
                            cursor:
                              canSelect && !createTeamMutation.isPending
                                ? "pointer"
                                : "not-allowed",
                          }}
                          onClick={() =>
                            canSelect &&
                            !createTeamMutation.isPending &&
                            handlePokemonToggle(pokemon.id)
                          }
                        >
                          <div className="card-body p-2 text-center">
                            <img
                              src={pokemon.image}
                              alt={pokemon.name}
                              className="rounded mb-1"
                              style={{
                                width: "140px",
                                height: "140px",
                                objectFit: "cover",
                              }}
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = "/placeholder-pokemon.png";
                              }}
                            />
                            <div className="small fw-bold">{pokemon.name}</div>
                            <div className="small text-muted">
                              <i className="bi bi-lightning-fill text-warning"></i>{" "}
                              {pokemon.power}
                            </div>
                            {isSelected && (
                              <div className="mt-1">
                                <i className="bi bi-check-circle-fill text-primary"></i>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-inbox text-muted"></i>
                  <p className="text-muted mb-0 small">No Pokémon available</p>
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success w-100"
            disabled={
              selectedPokemon.length !== 6 || createTeamMutation.isPending
            }
          >
            {createTeamMutation.isPending ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating Team...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Create Team
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
