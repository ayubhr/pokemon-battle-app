import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/pokemon - Get all Pokemon with type information
export async function GET() {
  try {
    const supabase = await createClient();

    // Use our PostgreSQL function to get Pokemon with types
    const { data, error } = await supabase.rpc("get_pokemon_with_types");

    console.log("get pokemon");
    if (error) {
      console.error("Error fetching Pokemon:", error);
      return NextResponse.json(
        { error: "Failed to fetch Pokemon" },
        { status: 500 }
      );
    }

    // Transform the data to match our TypeScript interface
    const pokemon =
      data?.map((row: any) => ({
        id: row.pokemon_id,
        name: row.pokemon_name,
        type: row.type_name,
        type_name: row.type_name,
        image: row.pokemon_image,
        power: row.pokemon_power,
        life: row.pokemon_life,
      })) || [];

    return NextResponse.json({ pokemon });
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
