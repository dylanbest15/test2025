import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { startupId: string } }) {
  const supabase = await createClient();
  const { startupId } = await params;
  const { data, error } = await supabase.from('startups').select().eq('id', startupId).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}