import { FundPoolUpdateSchema } from "@/lib/validation/fund_pools";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { fundPoolId: string } }) {
  const supabase = await createClient();
  const { fundPoolId } = await params;
  const body = await req.json();
  const updateData = {
    ...body,
    updated_at: new Date().toISOString(),
  }

  const parseResult = FundPoolUpdateSchema.safeParse(updateData);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  try {
    // update fund pool
    const { data: fundPoolData, error: fundPoolErr } = await supabase
      .from('fund_pools')
      .update(parseResult.data)
      .eq('id', fundPoolId)
      .select()
      .single();

    if (fundPoolErr) {
      return NextResponse.json({ error: fundPoolErr.message }, { status: 500 });
    }

    return NextResponse.json(fundPoolData);
  } catch (error) {
    console.error('Fund Pool update failed:', error);
    return NextResponse.json({ error: 'Failed to update fund pool' }, { status: 500 });
  }
}