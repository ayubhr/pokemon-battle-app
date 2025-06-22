import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { name, pokemon_ids } = await request.json();
    const teamId = params.id;

    // Validate team ID (UUID format)
    if (!teamId || typeof teamId !== "string") {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    // Validate pokemon_ids array
    if (!Array.isArray(pokemon_ids) || pokemon_ids.length !== 6) {
      return NextResponse.json(
        { error: "Team must contain exactly 6 Pokémon" },
        { status: 400 }
      );
    }

    // Validate all pokemon_ids are strings (UUIDs)
    const validIds = pokemon_ids.every(
      (id) => typeof id === "string" && id.length > 0
    );
    if (!validIds) {
      return NextResponse.json(
        { error: "All Pokémon IDs must be valid UUIDs" },
        { status: 400 }
      );
    }

    // Check if all Pokémon exist
    const { data: pokemonCheck, error: pokemonError } = await supabase
      .from("pokemon")
      .select("id")
      .in("id", pokemon_ids);

    if (pokemonError) {
      console.error("Error checking Pokémon:", pokemonError);
      return NextResponse.json(
        { error: "Failed to validate Pokémon" },
        { status: 500 }
      );
    }

    if (pokemonCheck.length !== 6) {
      return NextResponse.json(
        { error: "One or more Pokémon not found" },
        { status: 400 }
      );
    }

    // Update the team
    const { data: updatedTeam, error: updateError } = await supabase
      .from("team")
      .update({
        name: name.trim(),
        pokemon_ids,
      })
      .eq("id", teamId)
      .select(
        `
        id,
        name,
        pokemon_ids,
        created_at
      `
      )
      .single();

    if (updateError) {
      console.error("Error updating team:", updateError);
      return NextResponse.json(
        { error: "Failed to update team" },
        { status: 500 }
      );
    }

    // Get updated team with Pokemon details and calculate total power
    const { data: pokemon, error: pokemonFetchError } = await supabase
      .from("pokemon")
      .select(
        `
        id,
        name,
        type,
        image,
        power,
        life,
        pokemon_type!inner(name)
      `
      )
      .in("id", updatedTeam.pokemon_ids);

    if (pokemonFetchError) {
      console.error("Error fetching Pokémon details:", pokemonFetchError);
      return NextResponse.json(
        { error: "Failed to fetch updated team details" },
        { status: 500 }
      );
    }

    // Transform Pokemon data
    const transformedPokemon = pokemon.map((poke: any) => ({
      id: poke.id,
      name: poke.name,
      type: poke.pokemon_type.name,
      type_name: poke.pokemon_type.name,
      image: poke.image,
      power: poke.power,
      life: poke.life,
    }));

    // Calculate total power
    const totalPower = transformedPokemon.reduce(
      (sum: number, poke: any) => sum + poke.power,
      0
    );

    const teamWithDetails = {
      id: updatedTeam.id,
      name: updatedTeam.name,
      pokemon_ids: updatedTeam.pokemon_ids,
      created_at: updatedTeam.created_at,
      pokemon: transformedPokemon,
      total_power: totalPower,
    };

    return NextResponse.json({ team: teamWithDetails });
  } catch (error) {
    console.error("Error in PUT /api/teams/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const teamId = params.id;

    // Validate team ID (UUID format)
    if (!teamId || typeof teamId !== "string") {
      return NextResponse.json({ error: "Invalid team ID" }, { status: 400 });
    }

    // Delete the team
    const { error: deleteError } = await supabase
      .from("team")
      .delete()
      .eq("id", teamId);

    if (deleteError) {
      console.error("Error deleting team:", deleteError);
      return NextResponse.json(
        { error: "Failed to delete team" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Team deleted successfully",
      deleted_id: teamId,
    });
  } catch (error) {
    console.error("Error in DELETE /api/teams/[id]:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
