// export async function GET(req: NextRequest, { params }: { params: { startupId: string } }) {
//   const supabase = await createClient();
//   const { startupId } = params;
//   const { data, error } = await supabase.from('fund_pools').select().eq('startup_id', startupId).single();
//   if (error) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
//   return NextResponse.json(data);
// }