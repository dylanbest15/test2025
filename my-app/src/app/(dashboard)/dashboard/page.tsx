import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { FundPool } from "@/types/fund-pool";
import { Profile } from "@/types/profile";
import { Investment } from "@/types/investment";
import FounderDashboard from "@/app/(dashboard)/dashboard/(founders)/founder-dashboard";
import InvestorDashboard from "@/app/(dashboard)/dashboard/(investors)/investor-dashboard";
import { Startup } from "@/types/startup";

// 1. Fetch user
// 2. If user is a founder, then fetch user profile
// 3. If profile has a startup, then fetch joined investments
// 4. Render Founder Dashboard
// 5. If user is an investor, then fetch joined investments
// 6. Render Investor Dashboard

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
  startup: Startup;
}

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

  if (user.user_metadata.type === "founder") {
    // Render Founder Dashboard

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
        profile:profiles!inner(*),
        startup:startups!inner(*)

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
        <FounderDashboard investments={investments} />
      </div>
    )
  } else {
    // Render Investor Dashboard

    // Fetch investments
    let investments = null;
    const { data: investmentData, error: investmentErr } = await supabase
      .from("investments")
      .select(`
        id,
        amount,
        status,
        created_at,
        updated_at,
        fund_pool:fund_pools!inner(*),
        profile:profiles!inner(*),
        startup:startups!inner(*)
        `)
      .eq("profile_id", user.id)

    investments = investmentData as JoinedInvestment[] | null

    if (investmentErr) {
      console.error("Error fetching investments:", investmentErr)
      // return notFound();
    }

    return (
      <div className="w-full bg-[#f8f9fa] mb-20">
        <InvestorDashboard investments={investments} />
      </div>
    )
  }
}