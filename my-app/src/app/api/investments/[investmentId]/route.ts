import { getNotificationConfigForInvestment } from "@/lib/helpers/investment-notification";
import { InvestmentUpdateSchema } from "@/lib/validation/investments";
import { Notification } from "@/types/notification";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { investmentId: string } }) {
  const supabase = await createClient();
  const { investmentId } = await params;
  const body = await req.json();
  const updateData = {
    ...body,
    updated_at: new Date().toISOString(),
  }

  const parseResult = InvestmentUpdateSchema.safeParse(updateData);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  try {
    // update investment
    const { data: investmentData, error: investmentErr } = await supabase
      .from('investments')
      .update(parseResult.data)
      .eq('id', investmentId)
      .select()
      .single();

    if (investmentErr) {
      return NextResponse.json({ error: investmentErr.message }, { status: 500 });
    }

    console.log(investmentData);

    // create notification
    const notificationConfig = getNotificationConfigForInvestment(investmentData)

    if (notificationConfig) {
      const { error: notificationError } = await supabase.from("notifications").insert(notificationConfig)

      if (notificationError) {
        console.error("Failed to create notification:", notificationError)
      }
    }

    // TODO: SEND EMAIL
    return NextResponse.json(investmentData, { status: 201 });
  } catch (error) {
    console.error('Investment update failed:', error);
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 });
  }
}