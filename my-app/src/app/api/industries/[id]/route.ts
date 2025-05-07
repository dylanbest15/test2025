import { IndustryUpdateSchema } from "@/lib/validation/industries";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { id } = await params;
  const type = req.nextUrl.searchParams.get('type'); // 'startup' or 'investor'
  const industries = await req.json();
  const updateData = {
    type,
    industries
  }

  const parseResult = IndustryUpdateSchema.safeParse(updateData);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  if (!['startup', 'investor'].includes(type || '')) {
    return NextResponse.json({ error: 'Invalid user type' }, { status: 400 });
  }

  // Delete existing entries
  const { error: deleteError } = await supabase
    .from('industries')
    .delete()
    .eq(type === 'startup' ? 'startup_id' : 'profile_id', id);

  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Insert new industries
  const inserts = industries.map((industry: string) => ({
    name: industry.trim(),
    startup_id: type === 'startup' ? id : null,
    profile_id: type === 'investor' ? id : null
  }));

  const { data, error: insertError } = await supabase
    .from('industries')
    .insert(inserts);

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}