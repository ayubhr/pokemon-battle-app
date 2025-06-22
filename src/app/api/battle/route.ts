import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import type { BattleLog, BattleRound, Pokemon } from "@/types";

interface PokemonBattleState extends Pokemon {
  current_life: number;
  type_id: string;
}

// POST /api/battle - Simulate a battle between two teams
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Parse request body
    const body = await request.json();
    const { team1_id, team2_id } = body;

    // Validate required fields
    if (!team1_id || !team2_id) {
      return NextResponse.json(
        { error: "Missing required fields: team1_id, team2_id" },
        { status: 400 }
      );
    }

    if (team1_id === team2_id) {
      return NextResponse.json(
        { error: "Teams cannot battle themselves" },
        { status: 400 }
      );
    }

    // Get team 1 details
    const { data: team1Data, error: team1Error } = await supabase.rpc(
      "get_team_details",
      {
        team_uuid: team1_id,
      }
    );

    if (team1Error || !team1Data || team1Data.length === 0) {
      return NextResponse.json(
        { error: "Team 1 not found or has no Pokemon" },
        { status: 404 }
      );
    }

    // Get team 2 details
    const { data: team2Data, error: team2Error } = await supabase.rpc(
      "get_team_details",
      {
        team_uuid: team2_id,
      }
    );

    if (team2Error || !team2Data || team2Data.length === 0) {
      return NextResponse.json(
        { error: "Team 2 not found or has no Pokemon" },
        { status: 404 }
      );
    }

    // Get all type IDs for lookup
    const { data: typesData } = await supabase
      .from("pokemon_type")
      .select("id, name");

    const typeMap = new Map(typesData?.map((t) => [t.name, t.id]) || []);

    // Prepare Pokemon battle states
    const team1Pokemon: PokemonBattleState[] = team1Data.map((p: any) => ({
      id: p.pokemon_id,
      name: p.pokemon_name,
      type: p.pokemon_type_name,
      type_name: p.pokemon_type_name,
      type_id: typeMap.get(p.pokemon_type_name) || "",
      image: p.pokemon_image,
      power: p.pokemon_power,
      life: p.pokemon_life,
      current_life: p.pokemon_life,
    }));

    const team2Pokemon: PokemonBattleState[] = team2Data.map((p: any) => ({
      id: p.pokemon_id,
      name: p.pokemon_name,
      type: p.pokemon_type_name,
      type_name: p.pokemon_type_name,
      type_id: typeMap.get(p.pokemon_type_name) || "",
      image: p.pokemon_image,
      power: p.pokemon_power,
      life: p.pokemon_life,
      current_life: p.pokemon_life,
    }));

    // Simulate battle
    const battleResult = await simulateBattle(
      supabase,
      team1Pokemon,
      team2Pokemon
    );

    return NextResponse.json({ battle: battleResult });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

async function simulateBattle(
  supabase: any,
  team1: PokemonBattleState[],
  team2: PokemonBattleState[]
): Promise<BattleLog> {
  const rounds: BattleRound[] = [];
  let team1Index = 0;
  let team2Index = 0;
  let roundCount = 0;
  const maxRounds = 100; // Prevent infinite battles

  while (
    team1Index < team1.length &&
    team2Index < team2.length &&
    roundCount < maxRounds
  ) {
    const pokemon1 = team1[team1Index];
    const pokemon2 = team2[team2Index];

    // Skip defeated Pokemon
    if (pokemon1.current_life <= 0) {
      team1Index++;
      continue;
    }
    if (pokemon2.current_life <= 0) {
      team2Index++;
      continue;
    }

    roundCount++;

    // Get type effectiveness factors
    const factor1 = await getTypeFactor(
      supabase,
      pokemon1.type_id,
      pokemon2.type_id
    );
    const factor2 = await getTypeFactor(
      supabase,
      pokemon2.type_id,
      pokemon1.type_id
    );

    // Calculate damage
    const damage1 = Math.round(pokemon1.power * factor1);
    const damage2 = Math.round(pokemon2.power * factor2);

    // Store life before damage
    const life1Before = pokemon1.current_life;
    const life2Before = pokemon2.current_life;

    // Apply damage
    pokemon1.current_life = Math.max(0, pokemon1.current_life - damage2);
    pokemon2.current_life = Math.max(0, pokemon2.current_life - damage1);

    // Create battle round
    const round: BattleRound = {
      pokemon1: {
        id: pokemon1.id,
        name: pokemon1.name,
        type: pokemon1.type,
        type_name: pokemon1.type,
        image: pokemon1.image,
        power: pokemon1.power,
        life: pokemon1.life,
      },
      pokemon2: {
        id: pokemon2.id,
        name: pokemon2.name,
        type: pokemon2.type,
        type_name: pokemon2.type,
        image: pokemon2.image,
        power: pokemon2.power,
        life: pokemon2.life,
      },
      life1_before: life1Before,
      life2_before: life2Before,
      life1_after: pokemon1.current_life,
      life2_after: pokemon2.current_life,
      damage1: damage1,
      damage2: damage2,
      type_factor1: factor1,
      type_factor2: factor2,
    };

    rounds.push(round);

    // Move to next Pokemon if defeated
    if (pokemon1.current_life <= 0) {
      team1Index++;
    }
    if (pokemon2.current_life <= 0) {
      team2Index++;
    }
  }

  // Determine winner
  const team1HasAlive = team1.some((p) => p.current_life > 0);
  const team2HasAlive = team2.some((p) => p.current_life > 0);

  let winner = "Draw";
  if (team1HasAlive && !team2HasAlive) {
    winner = "Team 1";
  } else if (team2HasAlive && !team1HasAlive) {
    winner = "Team 2";
  }

  return {
    team1: {
      id: "team1",
      name: "Team 1",
      pokemon_ids: team1.map((p) => p.id),
      total_power: team1.reduce((sum, p) => sum + p.power, 0),
    },
    team2: {
      id: "team2",
      name: "Team 2",
      pokemon_ids: team2.map((p) => p.id),
      total_power: team2.reduce((sum, p) => sum + p.power, 0),
    },
    rounds,
    winner,
    team1_remaining: team1
      .filter((p) => p.current_life > 0)
      .map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        type_name: p.type,
        image: p.image,
        power: p.power,
        life: p.life,
      })),
    team2_remaining: team2
      .filter((p) => p.current_life > 0)
      .map((p) => ({
        id: p.id,
        name: p.name,
        type: p.type,
        type_name: p.type,
        image: p.image,
        power: p.power,
        life: p.life,
      })),
  };
}

async function getTypeFactor(
  supabase: any,
  attackerTypeId: string,
  defenderTypeId: string
): Promise<number> {
  try {
    const { data } = await supabase.rpc("get_type_factor", {
      attacker_type: attackerTypeId,
      defender_type: defenderTypeId,
    });
    return data || 1.0;
  } catch (error) {
    console.error("Error getting type factor:", error);
    return 1.0; // Default to neutral effectiveness
  }
}
