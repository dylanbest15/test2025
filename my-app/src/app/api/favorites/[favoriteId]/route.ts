import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: { favoriteId: string } }) {
  const supabase = await createClient();
  const { favoriteId } = params;

  if (!favoriteId) {
    return NextResponse.json({ error: "Favorite ID is required" }, { status: 400 });
  }

  const { error } = await supabase
    .from('favorites')
    .delete()
    .eq('id', favoriteId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}