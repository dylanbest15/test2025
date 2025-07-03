import { getNotificationConfigForInvestment } from "@/lib/helpers/investment-notification";
import { InvestmentUpdateSchema } from "@/lib/validation/investments";
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

    // check if fund_goal needs to be updated
    if (parseResult.data.status === "confirmed") {
      // get fund pool for this investment
      const { data: fundPool, error: fundPoolError } = await supabase
        .from("fund_pools")
        .select("*")
        .eq("id", investmentData.fund_pool_id)
        .single()

        if (fundPoolError) {
          console.error("Failed to fetch fund pool:", fundPoolError)
        } else {
          // get all confirmed investments for fund pool
          const { data: confirmedInvestments, error: confirmedInvestmentsError } = await supabase
          .from("investments")
          .select("*")
          .eq("fund_pool_id", investmentData.fund_pool_id)
          .eq("status", "confirmed")

          if (confirmedInvestmentsError) {
            console.error("Failed to fetch confirmed investments:", confirmedInvestmentsError)
          } else {
            // calculate total confirmed amount
            const totalConfirmedAmount = confirmedInvestments.reduce((sum, inv) => sum + (inv.amount || 0), 0)

            // check if total exceeds fund goal
            if (totalConfirmedAmount > fundPool.fund_goal) {
              // update fund goal to match new total
              const { error: updateFundPoolError } = await supabase
              .from("fund_pools")
              .update({
                fund_goal: totalConfirmedAmount,
                updated_at: new Date().toISOString(),
              })
              .eq("id", investmentData.fund_pool_id)

              if (updateFundPoolError) {
                console.error("Failed to update fund pool goal:", updateFundPoolError)
              }
            }
          }
        }
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
    console.error('Investment update failed:', error);
    return NextResponse.json({ error: 'Failed to update investment' }, { status: 500 });
  }
}