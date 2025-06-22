"use client";

import { useState } from "react";
import { Pokemon } from "@/types";
import PokemonEditModal from "@/components/pokemon-edit-modal";

interface PokemonTableProps {
  pokemon: Pokemon[];
}

export default function PokemonTable({ pokemon }: PokemonTableProps) {
  const [editingPokemon, setEditingPokemon] = useState<Pokemon | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (pokemon: Pokemon) => {
    setEditingPokemon(pokemon);
    setShowEditModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingPokemon(null);
  };

  const getTypeColor = (typeName: string) => {
    switch (typeName.toLowerCase()) {
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
    <>
      <div className="table-responsive">
        <table className="table table-hover mb-0">
          <thead className="table-light">
            <tr>
              <th scope="col" className="text-center">
                Image
              </th>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col" className="text-center">
                Power
              </th>
              <th scope="col" className="text-center">
                Life
              </th>
              <th scope="col" className="text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {pokemon &&
              pokemon.map((poke) => (
                <tr key={poke.id}>
                  <td className="text-center align-middle">
                    <img
                      src={poke.image}
                      alt={poke.name}
                      className="rounded"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-pokemon.png";
                      }}
                    />
                  </td>
                  <td className="align-middle">
                    <strong>{poke.name}</strong>
                  </td>
                  <td className="align-middle">
                    <span
                      className={`badge ${getTypeColor(
                        poke.type_name
                      )} text-white`}
                    >
                      {poke.type_name}
                    </span>
                  </td>
                  <td className="text-center align-middle">
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="progress me-2"
                        style={{ width: "60px", height: "8px" }}
                      >
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: `${poke.power}%` }}
                          aria-valuenow={poke.power}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <span className="fw-bold">{poke.power}</span>
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <div className="d-flex align-items-center justify-content-center">
                      <div
                        className="progress me-2"
                        style={{ width: "60px", height: "8px" }}
                      >
                        <div
                          className="progress-bar bg-success"
                          role="progressbar"
                          style={{ width: `${poke.life}%` }}
                          aria-valuenow={poke.life}
                          aria-valuemin={0}
                          aria-valuemax={100}
                        ></div>
                      </div>
                      <span className="fw-bold">{poke.life}</span>
                    </div>
                  </td>
                  <td className="text-center align-middle">
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => handleEdit(poke)}
                      aria-label={`Edit ${poke.name}`}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {editingPokemon && (
        <PokemonEditModal
          pokemon={editingPokemon}
          show={showEditModal}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
