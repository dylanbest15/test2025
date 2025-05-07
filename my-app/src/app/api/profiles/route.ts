import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   const supabase = await createClient();
//   const { data, error } = await supabase.from('profiles').select();
//   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
//   return NextResponse.json(data);
// }

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const query = searchParams.get('query');
  
  const supabase = await createClient();

  // query investors by name
  const { data, error } = await supabase.from('profiles')
    .select()
    .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
    .eq('type', 'investor')
    .eq('investor_active', true)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}