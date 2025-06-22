"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Pokemon } from "@/types";
import { useUpdatePokemon, usePokemonTypes } from "@/hooks/use-pokemon";

// Define the props interface with clear documentation
interface PokemonEditModalProps {
  pokemon: Pokemon;
  show: boolean;
  onClose: () => void;
}

/**
 * Modal component for editing Pokemon information
 * Allows users to modify Pokemon name, type, power, life, and image
 * Uses optimistic updates for better user experience
 *
 * @param pokemon - The Pokemon object to edit
 * @param show - Whether the modal should be visible
 * @param onClose - Function to call when modal should be closed
 */
export default function PokemonEditModal({
  pokemon,
  show,
  onClose,
}: PokemonEditModalProps) {
  // ==================== STATE MANAGEMENT ====================

  // Form data state with proper typing
  const [formData, setFormData] = useState({
    name: "",
    type_id: "",
    power: 10,
    life: 10,
    image: "",
  });

  // Custom hooks for API operations and data fetching
  const updatePokemonMutation = useUpdatePokemon();
  const { data: pokemonTypes, isLoading: typesLoading } = usePokemonTypes();

  // ==================== MEMOIZED VALUES ====================

  /**
   * Get the current selected type information
   * Memoized to prevent unnecessary recalculations
   */
  const selectedType = useMemo(() => {
    if (!pokemonTypes || !formData.type_id) return null;
    return pokemonTypes.find((type) => type.id === formData.type_id) || null;
  }, [pokemonTypes, formData.type_id]);

  /**
   * Get type-specific styling information
   * Memoized to prevent recreating objects on every render
   */
  const typeStyles = useMemo(() => {
    const typeName =
      selectedType?.name?.toLowerCase() ||
      pokemon.type_name?.toLowerCase() ||
      "";

    const getTypeColor = () => {
      switch (typeName) {
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

    const getTypeIcon = () => {
      switch (typeName) {
        case "fire":
          return "bi-fire";
        case "water":
          return "bi-droplet-fill";
        case "grass":
          return "bi-tree-fill";
        default:
          return "bi-question-circle";
      }
    };

    return {
      colorClass: getTypeColor(),
      iconClass: getTypeIcon(),
      displayName:
        selectedType?.name || pokemon.type_name || pokemon.type || "Unknown",
    };
  }, [selectedType, pokemon]);

  // ==================== CALLBACKS ====================

  /**
   * Handle form submission
   * Validates data and calls the update mutation
   * Memoized to prevent unnecessary re-renders of child components
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate form data before submission
      if (!formData.name.trim()) {
        alert("Pokemon name cannot be empty");
        return;
      }

      if (formData.power < 10 || formData.power > 100) {
        alert("Power must be between 10 and 100");
        return;
      }

      if (formData.life < 10 || formData.life > 100) {
        alert("Life must be between 10 and 100");
        return;
      }

      if (!formData.type_id) {
        alert("Please select a Pokemon type");
        return;
      }

      try {
        await updatePokemonMutation.mutateAsync({
          id: pokemon.id,
          data: {
            name: formData.name.trim(),
            type_id: formData.type_id,
            power: Number(formData.power),
            life: Number(formData.life),
            image: formData.image.trim() || null,
          },
        });
        onClose();
      } catch (error) {
        console.error("Failed to update Pokemon:", error);
        // Error is already handled by the mutation hook
      }
    },
    [formData, pokemon.id, updatePokemonMutation, onClose]
  );

  /**
   * Handle input changes for form fields
   * Memoized to prevent unnecessary re-renders
   */
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]:
          name === "power" || name === "life"
            ? Math.max(10, Math.min(100, parseInt(value) || 10)) // Clamp values between 10-100
            : value,
      }));
    },
    []
  );

  /**
   * Handle backdrop click to close modal
   * Only closes if clicking on the backdrop, not the modal content
   */
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  /**
   * Handle escape key press to close modal
   * Memoized to prevent unnecessary event listener updates
   */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // ==================== EFFECTS ====================

  /**
   * Effect to initialize form data when modal opens
   * Also handles body scroll prevention and cleanup
   */
  useEffect(() => {
    if (show && pokemonTypes) {
      // Find the current Pokemon's type ID from the available types
      const currentType = pokemonTypes.find(
        (type) => type.name === pokemon.type_name || type.name === pokemon.type
      );

      // Initialize form with Pokemon data
      setFormData({
        name: pokemon.name,
        type_id: currentType?.id || "",
        power: pokemon.power,
        life: pokemon.life,
        image: pokemon.image || "",
      });

      // Prevent body scroll when modal is open to improve UX
      document.body.style.overflow = "hidden";

      // Add keyboard event listener for escape key
      document.addEventListener("keydown", handleKeyDown);
    } else {
      // Restore body scroll when modal is closed
      document.body.style.overflow = "unset";

      // Remove keyboard event listener
      document.removeEventListener("keydown", handleKeyDown);
    }

    // Cleanup function to prevent memory leaks
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [pokemon, show, pokemonTypes, handleKeyDown]);

  // ==================== RENDER GUARDS ====================

  // Don't render modal if not shown (prevents unnecessary DOM elements)
  if (!show) return null;

  // Show loading state if types are still loading
  if (typesLoading) {
    return (
      <div
        className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(5px)",
          zIndex: 1050,
        }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading Pokemon types...</span>
        </div>
      </div>
    );
  }

  // ==================== COMPONENT RENDER ====================

  return (
    <div
      className="modal-backdrop position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        backdropFilter: "blur(5px)",
        zIndex: 1050,
        padding: "1rem",
      }}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokemon-edit-title"
    >
      <div
        className="modal-content border-0 shadow-lg w-100"
        style={{
          maxWidth: "800px",
          maxHeight: "90vh",
          overflowY: "auto",
          background:
            "linear-gradient(135deg, #1e3c72 0%, #2a5298 25%, #667eea 75%, #764ba2 100%)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header border-0 text-white position-relative">
          <div className="w-100">
            <h4
              id="pokemon-edit-title"
              className="modal-title fw-bold mb-1"
              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
            >
              <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
              CHAMPION ENHANCEMENT
            </h4>
            <p className="mb-0 text-white-50 fw-bold">
              Upgrade {pokemon.name}'s abilities
            </p>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white ms-3"
            onClick={onClose}
            aria-label="Close modal"
            disabled={updatePokemonMutation.isPending}
          />
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body text-white p-4">
            {/* Error Display */}
            {updatePokemonMutation.isError && (
              <div
                className="alert alert-danger border-0 shadow mb-4"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                <strong>Enhancement Failed:</strong>{" "}
                {updatePokemonMutation.error?.message ||
                  "Failed to update Champion"}
              </div>
            )}

            <div className="row g-4">
              {/* Pokemon Preview Panel */}
              <div className="col-lg-5 col-md-6">
                <div className="card border-0 shadow bg-dark bg-opacity-50 text-white h-100">
                  <div className="card-header bg-transparent border-bottom border-warning text-center">
                    <h6 className="text-warning fw-bold mb-0">
                      <i className="bi bi-star-fill me-1"></i>
                      CHAMPION PROFILE
                    </h6>
                  </div>
                  <div className="card-body text-center p-4">
                    {/* Pokemon Image */}
                    <div className="mb-4">
                      <img
                        src={formData.image || "/pokemon/default.png"}
                        alt={formData.name || pokemon.name}
                        className="rounded-circle border border-warning shadow"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                          boxShadow: "0 0 20px rgba(255,193,7,0.3)",
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/pokemon/default.png";
                        }}
                      />
                    </div>

                    {/* Type Badge */}
                    <div className="mb-3">
                      <span
                        className={`badge px-3 py-2 fs-6 ${typeStyles.colorClass} text-white fw-bold`}
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                      >
                        <i className={`bi ${typeStyles.iconClass} me-2`} />
                        {typeStyles.displayName}
                      </span>
                    </div>

                    {/* Pokemon Name */}
                    <h5
                      className="text-white fw-bold mb-3"
                      style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.8)" }}
                    >
                      {formData.name || pokemon.name}
                    </h5>

                    {/* Power and Life Display */}
                    <div className="row g-3">
                      <div className="col-6">
                        <div className="bg-danger bg-opacity-20 rounded-3 p-3">
                          <div className="text-white fw-bold fs-4">
                            {formData.power}
                          </div>
                          <small className="text-white fw-bold">Power</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-success bg-opacity-20 rounded-3 p-3">
                          <div className="text-white fw-bold fs-4">
                            {formData.life}
                          </div>
                          <small className="text-white fw-bold">Life</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Controls Panel */}
              <div className="col-lg-7 col-md-6">
                <div className="card border-0 shadow bg-dark bg-opacity-50 text-white h-100">
                  <div className="card-header bg-transparent border-bottom border-info text-center">
                    <h6 className="text-info fw-bold mb-0">
                      <i className="bi bi-gear-fill me-1"></i>
                      ENHANCEMENT CONTROLS
                    </h6>
                  </div>
                  <div className="card-body p-4">
                    <div className="row g-4">
                      {/* Name Field */}
                      <div className="col-12">
                        <label
                          htmlFor="name"
                          className="form-label text-white fw-bold"
                        >
                          <i className="bi bi-tag-fill text-warning me-2"></i>
                          Champion Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg bg-dark bg-opacity-50 text-white border-warning"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          maxLength={50}
                          style={{ backdropFilter: "blur(10px)" }}
                          placeholder="Enter Pokemon name"
                        />
                      </div>

                      {/* Image URL Field */}
                      <div className="col-12">
                        <label
                          htmlFor="image"
                          className="form-label text-white fw-bold"
                        >
                          <i className="bi bi-image-fill text-info me-2"></i>
                          Image URL
                        </label>
                        <input
                          type="url"
                          className="form-control bg-dark bg-opacity-50 text-white border-info"
                          id="image"
                          name="image"
                          value={formData.image}
                          onChange={handleChange}
                          placeholder="https://example.com/pokemon-image.png"
                          style={{ backdropFilter: "blur(10px)" }}
                        />
                      </div>

                      {/* Type Selection Field */}
                      <div className="col-12">
                        <label
                          htmlFor="type_id"
                          className="form-label text-white fw-bold"
                        >
                          <i className="bi bi-tag-fill text-warning me-2"></i>
                          Type
                        </label>
                        <select
                          className="form-select bg-dark bg-opacity-50 text-white border-warning"
                          id="type_id"
                          name="type_id"
                          value={formData.type_id}
                          onChange={handleChange}
                          required
                          style={{ backdropFilter: "blur(10px)" }}
                        >
                          <option value="">Select a type</option>
                          {pokemonTypes?.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Power Field */}
                      <div className="col-sm-6">
                        <label
                          htmlFor="power"
                          className="form-label text-white fw-bold"
                        >
                          <i className="bi bi-lightning-fill text-danger me-2"></i>
                          Power Level
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-lg bg-dark bg-opacity-50 text-white border-danger"
                          id="power"
                          name="power"
                          value={formData.power}
                          onChange={handleChange}
                          min="10"
                          max="100"
                          required
                          style={{ backdropFilter: "blur(10px)" }}
                        />
                        <div
                          className="progress mt-2"
                          style={{ height: "8px" }}
                        >
                          <div
                            className="progress-bar bg-danger"
                            style={{ width: `${formData.power}%` }}
                            role="progressbar"
                            aria-valuenow={formData.power}
                            aria-valuemin={10}
                            aria-valuemax={100}
                          />
                        </div>
                        <small className="text-danger fw-bold">
                          {formData.power}/100
                        </small>
                      </div>

                      {/* Life Field */}
                      <div className="col-sm-6">
                        <label
                          htmlFor="life"
                          className="form-label text-white fw-bold"
                        >
                          <i className="bi bi-heart-fill text-success me-2"></i>
                          Life Points
                        </label>
                        <input
                          type="number"
                          className="form-control form-control-lg bg-dark bg-opacity-50 text-white border-success"
                          id="life"
                          name="life"
                          value={formData.life}
                          onChange={handleChange}
                          min="10"
                          max="100"
                          required
                          style={{ backdropFilter: "blur(10px)" }}
                        />
                        <div
                          className="progress mt-2"
                          style={{ height: "8px" }}
                        >
                          <div
                            className="progress-bar bg-success"
                            style={{ width: `${formData.life}%` }}
                            role="progressbar"
                            aria-valuenow={formData.life}
                            aria-valuemin={10}
                            aria-valuemax={100}
                          />
                        </div>
                        <small className="text-success fw-bold">
                          {formData.life}/100
                        </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-0 bg-dark bg-opacity-25 p-4">
            <div className="d-flex justify-content-between w-100 flex-wrap gap-3">
              <button
                type="button"
                className="btn btn-outline-light btn-lg px-4"
                onClick={onClose}
                disabled={updatePokemonMutation.isPending}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-warning btn-lg px-4"
                disabled={updatePokemonMutation.isPending}
              >
                {updatePokemonMutation.isPending ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Enhancing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-lightning-charge me-2"></i>
                    Enhance Champion
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
