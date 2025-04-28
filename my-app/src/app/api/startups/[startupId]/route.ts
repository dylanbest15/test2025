import { StartupUpdateSchema } from "@/lib/validation/startups";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// export async function GET(req: NextRequest, { params }: { params: { startupId: string } }) {
//   const supabase = await createClient();
//   const { startupId } = await params;
//   const { data, error } = await supabase.from('startups').select().eq('id', startupId).single();
//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
//   return NextResponse.json(data);
// }

export async function PUT(req: NextRequest, { params }: { params: { startupId: string } }) {
  const supabase = await createClient();
  const { startupId } = params;
  const body = await req.json();
  const updateData = {
    ...body,
    updated_at: new Date().toISOString(),
  }

  const parseResult = StartupUpdateSchema.safeParse(updateData);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  const { data, error } = await supabase.from('startups').update(parseResult.data).eq('id', startupId).select().single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}