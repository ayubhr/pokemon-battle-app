"use client";

import { useState, useEffect } from "react";
import { TeamWithPokemon, Pokemon } from "@/types";
import { useUpdateTeam, useDeleteTeam } from "@/hooks/use-teams";
import { usePokemon } from "@/hooks/use-pokemon";

interface TeamEditModalProps {
  team: TeamWithPokemon | null;
  show: boolean;
  onClose: () => void;
}

export default function TeamEditModal({
  team,
  show,
  onClose,
}: TeamEditModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    pokemon_ids: [] as string[],
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: allPokemon } = usePokemon();
  const updateTeamMutation = useUpdateTeam();
  const deleteTeamMutation = useDeleteTeam();

  useEffect(() => {
    if (show && team) {
      setFormData({
        name: team.name,
        pokemon_ids: [...team.pokemon_ids],
      });
      setShowDeleteConfirm(false);
    }
  }, [team, show]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!team) return;

    if (formData.pokemon_ids.length !== 6) {
      alert("Team must contain exactly 6 Pokémon");
      return;
    }

    try {
      await updateTeamMutation.mutateAsync({
        id: team.id,
        name: formData.name,
        pokemon_ids: formData.pokemon_ids,
      });
      onClose();
    } catch (error) {
      console.error("Failed to update team:", error);
    }
  };

  const handleDelete = async () => {
    if (!team) return;

    try {
      await deleteTeamMutation.mutateAsync(team.id);
      onClose();
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  const handlePokemonToggle = (pokemonId: string) => {
    setFormData((prev) => {
      const isSelected = prev.pokemon_ids.includes(pokemonId);

      if (isSelected) {
        // Remove Pokemon
        return {
          ...prev,
          pokemon_ids: prev.pokemon_ids.filter((id) => id !== pokemonId),
        };
      } else {
        // Add Pokemon (only if less than 6)
        if (prev.pokemon_ids.length < 6) {
          return {
            ...prev,
            pokemon_ids: [...prev.pokemon_ids, pokemonId],
          };
        }
        return prev;
      }
    });
  };

  if (!show || !team) return null;

  const selectedPokemon =
    allPokemon?.filter((p) => formData.pokemon_ids.includes(p.id)) || [];
  const availablePokemon =
    allPokemon?.filter((p) => !formData.pokemon_ids.includes(p.id)) || [];

  return (
    <>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
        style={{ zIndex: 1055 }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          role="document"
        >
          <div
            className="modal-content border-0 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 75%, #764ba2 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            {/* Epic Header */}
            <div className="modal-header border-0 text-white position-relative overflow-hidden">
              <div
                className="position-absolute w-100 h-100"
                style={{ opacity: 0.1, zIndex: 1 }}
              >
                <div
                  className="position-absolute animate__animated animate__pulse animate__infinite"
                  style={{ top: "10%", left: "10%", fontSize: "2rem" }}
                >
                  👥
                </div>
                <div
                  className="position-absolute animate__animated animate__pulse animate__infinite animate__delay-1s"
                  style={{ top: "10%", right: "10%", fontSize: "1.5rem" }}
                >
                  🏆
                </div>
              </div>
              <div style={{ zIndex: 2, position: "relative" }}>
                <h4
                  className="modal-title fw-bold"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                >
                  <i className="bi bi-people-fill text-success me-2"></i>
                  SQUAD REFORMATION
                </h4>
                <p className="mb-0 text-white-50 fw-bold">
                  Modify {team.name}'s battle formation
                </p>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white position-relative"
                onClick={onClose}
                aria-label="Close"
                disabled={
                  updateTeamMutation.isPending || deleteTeamMutation.isPending
                }
                style={{ zIndex: 3 }}
              ></button>
            </div>

            {!showDeleteConfirm ? (
              <form onSubmit={handleSubmit}>
                <div
                  className="modal-body text-white"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  {(updateTeamMutation.isError ||
                    deleteTeamMutation.isError) && (
                    <div
                      className="alert alert-danger border-0 shadow animate__animated animate__shakeX"
                      role="alert"
                    >
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      <strong>Operation Failed:</strong>{" "}
                      {updateTeamMutation.error?.message ||
                        deleteTeamMutation.error?.message ||
                        "Failed to modify squad"}
                    </div>
                  )}

                  <div className="row g-4">
                    {/* Team Name */}
                    <div className="col-12">
                      <div className="card border-0 shadow bg-dark bg-opacity-50 text-white">
                        <div className="card-header bg-transparent border-bottom border-info text-center">
                          <h6 className="text-info fw-bold mb-0">
                            <i className="bi bi-badge-wc me-1"></i>
                            SQUAD IDENTITY
                          </h6>
                        </div>
                        <div className="card-body p-4">
                          <label
                            htmlFor="teamName"
                            className="form-label text-white fw-bold"
                          >
                            <i className="bi bi-shield-fill text-info me-2"></i>
                            Squad Name
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg bg-dark bg-opacity-50 text-white border-info"
                            id="teamName"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            required
                            disabled={updateTeamMutation.isPending}
                            style={{ backdropFilter: "blur(10px)" }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selected Pokemon */}
                    <div className="col-lg-6">
                      <div className="card border-0 shadow bg-dark bg-opacity-50 text-white h-100">
                        <div className="card-header bg-transparent border-bottom border-success text-center">
                          <h6 className="text-success fw-bold mb-0">
                            <i className="bi bi-star-fill me-1"></i>
                            SELECTED CHAMPIONS ({formData.pokemon_ids.length}/6)
                          </h6>
                        </div>
                        <div
                          className="card-body p-3"
                          style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                          {selectedPokemon.length > 0 ? (
                            <div className="row g-3">
                              {selectedPokemon.map((pokemon) => (
                                <div key={pokemon.id} className="col-12">
                                  <div className="card bg-success bg-opacity-20 border-success text-white">
                                    <div className="card-body p-3">
                                      <div className="row align-items-center">
                                        <div className="col-auto">
                                          <img
                                            src={pokemon.image}
                                            alt={pokemon.name}
                                            className="rounded-circle border border-success"
                                            style={{
                                              width: "50px",
                                              height: "50px",
                                              objectFit: "cover",
                                            }}
                                            onError={(e) => {
                                              const target =
                                                e.target as HTMLImageElement;
                                              target.src =
                                                "/placeholder-pokemon.png";
                                            }}
                                          />
                                        </div>
                                        <div className="col">
                                          <h6 className="text-white fw-bold mb-1">
                                            {pokemon.name}
                                          </h6>
                                          <div className="row g-2 small">
                                            <div className="col-4">
                                              <span
                                                className={`badge bg-${
                                                  pokemon.type_name?.toLowerCase() ===
                                                  "fire"
                                                    ? "danger"
                                                    : pokemon.type_name?.toLowerCase() ===
                                                      "water"
                                                    ? "primary"
                                                    : pokemon.type_name?.toLowerCase() ===
                                                      "grass"
                                                    ? "success"
                                                    : "secondary"
                                                }`}
                                              >
                                                {pokemon.type_name}
                                              </span>
                                            </div>
                                            <div className="col-4">
                                              <small className="text-warning">
                                                ⚔️ {pokemon.power}
                                              </small>
                                            </div>
                                            <div className="col-4">
                                              <small className="text-success">
                                                ❤️ {pokemon.life}
                                              </small>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="col-auto">
                                          <button
                                            type="button"
                                            className="btn btn-outline-danger btn-sm"
                                            onClick={() =>
                                              handlePokemonToggle(pokemon.id)
                                            }
                                            disabled={
                                              updateTeamMutation.isPending
                                            }
                                          >
                                            <i className="bi bi-dash-circle"></i>
                                          </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4">
                              <i
                                className="bi bi-shield-exclamation text-white-50"
                                style={{ fontSize: "3rem" }}
                              ></i>
                              <p className="text-white-50 fw-bold mt-2">
                                No champions selected
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Available Pokemon */}
                    <div className="col-lg-6">
                      <div className="card border-0 shadow bg-dark bg-opacity-50 text-white h-100">
                        <div className="card-header bg-transparent border-bottom border-warning text-center">
                          <h6 className="text-warning fw-bold mb-0">
                            <i className="bi bi-plus-circle me-1"></i>
                            AVAILABLE CHAMPIONS
                          </h6>
                        </div>
                        <div
                          className="card-body p-3"
                          style={{ maxHeight: "400px", overflowY: "auto" }}
                        >
                          <div className="row g-3">
                            {availablePokemon.map((pokemon) => (
                              <div key={pokemon.id} className="col-12">
                                <div className="card bg-warning bg-opacity-20 border-warning text-white">
                                  <div className="card-body p-3">
                                    <div className="row align-items-center">
                                      <div className="col-auto">
                                        <img
                                          src={pokemon.image}
                                          alt={pokemon.name}
                                          className="rounded-circle border border-warning"
                                          style={{
                                            width: "50px",
                                            height: "50px",
                                            objectFit: "cover",
                                          }}
                                          onError={(e) => {
                                            const target =
                                              e.target as HTMLImageElement;
                                            target.src =
                                              "/placeholder-pokemon.png";
                                          }}
                                        />
                                      </div>
                                      <div className="col">
                                        <h6 className="text-white fw-bold mb-1">
                                          {pokemon.name}
                                        </h6>
                                        <div className="row g-2 small">
                                          <div className="col-4">
                                            <span
                                              className={`badge bg-${
                                                pokemon.type_name?.toLowerCase() ===
                                                "fire"
                                                  ? "danger"
                                                  : pokemon.type_name?.toLowerCase() ===
                                                    "water"
                                                  ? "primary"
                                                  : pokemon.type_name?.toLowerCase() ===
                                                    "grass"
                                                  ? "success"
                                                  : "secondary"
                                              }`}
                                            >
                                              {pokemon.type_name}
                                            </span>
                                          </div>
                                          <div className="col-4">
                                            <small className="text-warning">
                                              ⚔️ {pokemon.power}
                                            </small>
                                          </div>
                                          <div className="col-4">
                                            <small className="text-success">
                                              ❤️ {pokemon.life}
                                            </small>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-auto">
                                        <button
                                          type="button"
                                          className="btn btn-outline-success btn-sm"
                                          onClick={() =>
                                            handlePokemonToggle(pokemon.id)
                                          }
                                          disabled={
                                            updateTeamMutation.isPending ||
                                            formData.pokemon_ids.length >= 6
                                          }
                                        >
                                          <i className="bi bi-plus-circle"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="modal-footer border-0 text-white"
                  style={{ position: "relative", zIndex: 2 }}
                >
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-lg px-4"
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={
                      updateTeamMutation.isPending ||
                      deleteTeamMutation.isPending
                    }
                  >
                    <i className="bi bi-trash-fill me-2"></i>
                    Delete Squad
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light btn-lg px-4"
                    onClick={onClose}
                    disabled={updateTeamMutation.isPending}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-lg px-4 text-white fw-bold"
                    disabled={
                      updateTeamMutation.isPending ||
                      formData.pokemon_ids.length !== 6
                    }
                    style={{
                      background:
                        "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
                      border: "none",
                      boxShadow: "0 4px 15px rgba(40,167,69,0.3)",
                    }}
                  >
                    {updateTeamMutation.isPending ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-shield-check me-2"></i>
                        Update Squad ({formData.pokemon_ids.length}/6)
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Delete Confirmation */
              <div
                className="modal-body text-white text-center py-5"
                style={{ position: "relative", zIndex: 2 }}
              >
                <div className="mb-4">
                  <i
                    className="bi bi-exclamation-triangle-fill text-danger"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </div>
                <h4
                  className="text-white fw-bold mb-3"
                  style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                >
                  Confirm Squad Deletion
                </h4>
                <p className="text-white-50 fw-bold mb-4">
                  Are you sure you want to permanently delete{" "}
                  <span className="text-warning">"{team.name}"</span>? This
                  action cannot be undone.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-light btn-lg px-4"
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteTeamMutation.isPending}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-lg px-4"
                    onClick={handleDelete}
                    disabled={deleteTeamMutation.isPending}
                  >
                    {deleteTeamMutation.isPending ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Deleting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-trash-fill me-2"></i>
                        Delete Squad
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" style={{ zIndex: 1050 }}></div>

      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"
      />
    </>
  );
}
