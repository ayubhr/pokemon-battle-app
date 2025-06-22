import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/teams - Get all teams ordered by power
export async function GET() {
  try {
    const supabase = await createClient();

    // Use our PostgreSQL function to get teams by power
    const { data: teamsData, error } = await supabase.rpc("get_teams_by_power");

    if (error) {
      console.error("Error fetching teams:", error);
      return NextResponse.json(
        { error: "Failed to fetch teams" },
        { status: 500 }
      );
    }

    if (!teamsData || teamsData.length === 0) {
      return NextResponse.json({ teams: [] });
    }

    // For each team, get the Pokemon details
    const teamsWithPokemon = await Promise.all(
      teamsData.map(async (teamRow: any) => {
        const { data: pokemonData, error: pokemonError } = await supabase.rpc(
          "get_team_details",
          {
            team_uuid: teamRow.team_id,
          }
        );

        if (pokemonError) {
          console.error("Error fetching team Pokemon:", pokemonError);
          return {
            id: teamRow.team_id,
            name: teamRow.team_name,
            pokemon_ids: teamRow.pokemon_ids,
            total_power: teamRow.total_power,
            created_at: teamRow.created_at,
            pokemon: [],
          };
        }

        return {
          id: teamRow.team_id,
          name: teamRow.team_name,
          pokemon_ids: teamRow.pokemon_ids,
          total_power: teamRow.total_power,
          created_at: teamRow.created_at,
          pokemon:
            pokemonData?.map((pokemon: any) => ({
              id: pokemon.pokemon_id,
              name: pokemon.pokemon_name,
              type: pokemon.pokemon_type_name,
              type_name: pokemon.pokemon_type_name,
              image: pokemon.pokemon_image,
              power: pokemon.pokemon_power,
              life: pokemon.pokemon_life,
            })) || [],
        };
      })
    );

    return NextResponse.json({ teams: teamsWithPokemon });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/teams - Create a new team
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse request body
    const body = await request.json();
    const { name, pokemon_ids } = body;

    // Validate required fields
    if (!name || !pokemon_ids) {
      return NextResponse.json(
        { error: "Missing required fields: name, pokemon_ids" },
        { status: 400 }
      );
    }

    // Validate team name
    if (!name.trim()) {
      return NextResponse.json(
        { error: "Team name cannot be empty" },
        { status: 400 }
      );
    }

    // Validate pokemon_ids array
    if (!Array.isArray(pokemon_ids) || pokemon_ids.length !== 6) {
      return NextResponse.json(
        { error: "Team must contain exactly 6 Pokemon IDs" },
        { status: 400 }
      );
    }

    // Use our PostgreSQL function to insert team
    const { data, error } = await supabase.rpc("insert_team", {
      team_name: name.trim(),
      pokemon_ids: pokemon_ids,
    });

    if (error) {
      console.error("Error creating team:", error);
      return NextResponse.json(
        { error: error.message || "Failed to create team" },
        { status: 400 }
      );
    }

    // Get the created team details
    const { data: teamData, error: fetchError } = await supabase.rpc(
      "get_team_details",
      {
        team_uuid: data,
      }
    );

    if (fetchError) {
      console.error("Error fetching team details:", fetchError);
      return NextResponse.json(
        { error: "Team created but failed to fetch details" },
        { status: 500 }
      );
    }

    // Calculate total power and format response
    const totalPower =
      teamData?.reduce(
        (sum: number, pokemon: any) => sum + pokemon.pokemon_power,
        0
      ) || 0;

    const team = {
      id: data,
      name: name.trim(),
      pokemon_ids: pokemon_ids,
      total_power: totalPower,
      pokemon:
        teamData?.map((pokemon: any) => ({
          id: pokemon.pokemon_id,
          name: pokemon.pokemon_name,
          type: pokemon.pokemon_type_name,
          image: pokemon.pokemon_image,
          power: pokemon.pokemon_power,
          life: pokemon.pokemon_life,
        })) || [],
    };

    return NextResponse.json({ team }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
