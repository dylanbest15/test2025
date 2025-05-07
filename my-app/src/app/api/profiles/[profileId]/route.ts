import { ProfileUpdateSchema } from "@/lib/validation/profiles";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest, { params }: { params: { profileId: string } }) {
//   const supabase = await createClient();
//   const { profileId } = await params;
//   const { data, error } = await supabase.from('profiles').select().eq('id', profileId).single();
//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
//   return NextResponse.json(data);
// }

export async function PUT(req: NextRequest, { params }: { params: { profileId: string } }) {
  const supabase = await createClient();
  const { profileId } = await params;
  const body = await req.json();
  const updateData = {
    ...body,
    updated_at: new Date().toISOString(),
  }

  const parseResult = ProfileUpdateSchema.safeParse(updateData);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  const { data, error } = await supabase.from('profiles').update(parseResult.data).eq('id', profileId).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   const supabase = await createClient();
//   const { id } = params;
//   const { error } = await supabase.from('profiles').delete().eq('id', id);
//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
//   return NextResponse.json({ message: 'Profile deleted successfully' });
// }