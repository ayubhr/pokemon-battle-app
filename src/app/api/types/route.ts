import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";

// GET /api/types - Get all Pokemon types
export async function GET() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("pokemon_type")
      .select("id, name")
      .order("name");

    if (error) {
      console.error("Error fetching types:", error);
      return NextResponse.json(
        { error: "Failed to fetch types" },
        { status: 500 }
      );
    }

    const types =
      data?.map((type: any) => ({
        id: type.id,
        name: type.name,
      })) || [];

    return NextResponse.json(types);
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
