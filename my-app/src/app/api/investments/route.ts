import { getNotificationConfigForInvestment } from "@/lib/helpers/investment-notification";
import { InvestmentCreateSchema } from "@/lib/validation/investments";
import { Notification } from "@/types/notification";
import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const body = await req.json();

  const parseResult = InvestmentCreateSchema.safeParse(body);
  if (!parseResult.success) {
    return NextResponse.json({ error: parseResult.error.format() }, { status: 400 });
  }

  try {
    // create investment
    const { data: investmentData, error: investmentErr } = await supabase
      .from('investments')
      .insert(parseResult.data)
      .select()
      .single();

    if (investmentErr) {
      return NextResponse.json({ error: investmentErr.message }, { status: 500 });
    }

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
    console.error('Investment creation failed:', error);
    return NextResponse.json({ error: 'Failed to create investment' }, { status: 500 });
  }

}