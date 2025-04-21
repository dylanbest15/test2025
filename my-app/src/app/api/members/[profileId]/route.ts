import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { profileId: string } }) {
  const supabase = await createClient();
  const { profileId } = await params;
  const { data, error } = await supabase.from('members').select().eq('id', profileId).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}