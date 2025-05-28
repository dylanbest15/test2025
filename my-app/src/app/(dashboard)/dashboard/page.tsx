import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FundPool } from "@/types/fund-pool";
import { Profile } from "@/types/profile";
import { Investment } from "@/types/investment";
import ViewDashboard from "@/app/(dashboard)/dashboard/view-dashboard";

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
}

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

  const { data: profile, error } = await supabase.from("profiles").select().eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    // return notFound();
  }

  // If the user has a startup, fetch any investments
  let investments = null;
  if (profile.startup_id) {
    const { data: investmentData, error: investmentErr } = await supabase
      .from("investments")
      .select(`
        id,
        amount,
        status,
        created_at,
        updated_at,
        fund_pool:fund_pools!inner(*),
        profile:profiles!inner(*)
        `)
      .eq("startup_id", profile.startup_id)

      investments = investmentData as JoinedInvestment[] | null

    if (investmentErr) {
      console.error("Error fetching investments:", investmentErr)
      // return notFound();
    }
  }
  return (
    <div className="w-full bg-[#f8f9fa] mb-20">
      <ViewDashboard investments={investments} />
    </div>
  )
}