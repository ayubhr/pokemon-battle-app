import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// PUT /api/pokemon/[id] - Update a Pokemon
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    // Parse request body
    const body = await request.json();
    const { name, type_id, power, life, image } = body;

    // Validate required fields
    if (!name || power === undefined || life === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: name, power, life" },
        { status: 400 }
      );
    }

    // Validate power and life constraints (10-100)
    if (power < 10 || power > 100 || life < 10 || life > 100) {
      return NextResponse.json(
        { error: "Power and life must be between 10 and 100" },
        { status: 400 }
      );
    }

    // If type_id is provided, validate it exists
    if (type_id) {
      const { data: typeExists } = await supabase
        .from("pokemon_type")
        .select("id")
        .eq("id", type_id)
        .single();

      if (!typeExists) {
        return NextResponse.json(
          { error: "Invalid type ID provided" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      power,
      life,
      image: image || null,
      updated_at: new Date().toISOString(),
    };

    // Add type if provided
    if (type_id) {
      updateData.type = type_id;
    }

    // Update the Pokemon
    const { data, error } = await supabase
      .from("pokemon")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating Pokemon:", error);
      return NextResponse.json(
        { error: "Failed to update Pokemon" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    // Get the type information
    const { data: typeData } = await supabase
      .from("pokemon_type")
      .select("name")
      .eq("id", data.type)
      .single();

    // Transform response to match our interface
    const pokemon = {
      id: data.id,
      name: data.name,
      type: typeData?.name || "Unknown",
      type_name: typeData?.name || "Unknown",
      image: data.image,
      power: data.power,
      life: data.life,
    };

    return NextResponse.json(pokemon);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/pokemon/[id] - Get a specific Pokemon
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient();
    const { id } = params;

    const { data, error } = await supabase
      .from("pokemon")
      .select()
      .eq("id", id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Pokemon not found" }, { status: 404 });
    }

    // Get the type information
    const { data: typeData } = await supabase
      .from("pokemon_type")
      .select("name")
      .eq("id", data.type)
      .single();

    const pokemon = {
      id: data.id,
      name: data.name,
      type: typeData?.name || "Unknown",
      type_name: typeData?.name || "Unknown",
      image: data.image,
      power: data.power,
      life: data.life,
    };

    return NextResponse.json(pokemon);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
