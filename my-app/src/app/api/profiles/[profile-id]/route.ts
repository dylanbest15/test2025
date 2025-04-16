import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;
  const { data, error } = await supabase.from('profiles').select().eq('id', id).single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = params;
  const body = await req.json();

  // Validate input
  // const parseResult = ProfileUpdateSchema.safeParse(body);
  // if (!parseResult.success) {
  //   return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  // }

  // replace body with parseResults.data
  const { data, error } = await supabase.from('profiles').update(body).eq('id', id).select().single();
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