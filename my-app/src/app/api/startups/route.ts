import { StartupCreateSchema } from "@/lib/validation/startups";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get("query")
  const city = searchParams.get("city")
  const state = searchParams.get("state")
  const industry = searchParams.get("industry")

  const supabase = await createClient()

  let queryBuilder = supabase.from("startups").select("*")

  // If industry filter is provided, we need to join with the startup_industries table
  if (industry && industry.trim() !== "") {
    // Use a subquery to find startups that have the selected industry
    const { data: startupIds, error: industryError } = await supabase
      .from("industries")
      .select("startup_id")
      .eq("name", industry)

    if (industryError) {
      console.error("Industry filter error:", industryError)
      return NextResponse.json({ error: industryError.message }, { status: 500 })
    }

    if (startupIds && startupIds.length > 0) {
      const uniqueStartupIds = [...new Set(startupIds.map((item) => item.startup_id))]
      queryBuilder = queryBuilder.in("id", uniqueStartupIds)
    } else {
      // No startups found with selected industry
      return NextResponse.json([])
    }
  }

  // Apply name filter if provided
  if (query && query.trim() !== "") {
    queryBuilder = queryBuilder.ilike("name", `%${query}%`)
  }

  // Apply city filter if provided
  if (city && city.trim() !== "") {
    queryBuilder = queryBuilder.ilike("city", `%${city}%`)
  }

  // Apply state filter if provided
  if (state && state.trim() === "all") {
    // Do nothing, include all states
  } else if (state && state.trim() !== "") {
    queryBuilder = queryBuilder.ilike("state", `%${state}%`)
  }

  // If no filters are provided, return empty array
  if (!query && !city && !state && !industry) {
    return NextResponse.json([])
  }

  // Execute the query
  const { data, error } = await queryBuilder.order("name")

  if (error) {
    console.error("Database error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const parseResult = StartupCreateSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
    }

  const { data, error } = await supabase.from('startups').insert(parseResult.data).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}