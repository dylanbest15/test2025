import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import CreateStartupWrapper from "@/app/(dashboard)/my-startup/(create-startup)/create-startup-wrapper"
import ViewStartup from "@/app/(dashboard)/my-startup/(view-startup)/view-startup"

// 1. Fetch user and user profile
// 2. If profile does not have a startup, then render Create Startup
// 3. If profile has a startup, then fetch startup
// 4. Fetch startup industries
// 5. Fetch startup fund pools
// 6. If startup fund pools exist, find open fund pool
// 6. If open fund pool exists, fetch open fund pool investments
// 7. Render View Startup

export default async function MyStartup() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (error) {
    console.error("Error fetching profile:", error)
    // return notFound();
  }

  // If the user doesn't have a startup, render the create form
  if (!profile.startup_id) {
    return <CreateStartupWrapper profile={profile} />
  }

  // If the user has a startup, fetch and render it
  if (profile.startup_id) {
    const { data: startup, error: startupErr } = await supabase
      .from("startups")
      .select("*")
      .eq("id", profile.startup_id)
      .single()

    if (startupErr) {
      console.error("Error fetching startup:", startupErr)
      // return notFound();
    }

    let industries = [];
    // Fetch startup industries
    const { data: industryRes, error: industryErr } = await supabase.from('industries')
      .select("*")
      .eq('startup_id', startup.id)

    if (industryErr) {
      console.error("Error fetching industries:", industryErr);
      // return notFound();
    }
    if (industryRes) {
      industries = industryRes.map(industry => industry.name);
    }

    let fundPools = [];
    // Fetch fund pools
    const { data: fundPoolRes, error: fundPoolErr } = await supabase
      .from("fund_pools")
      .select("*")
      .eq("startup_id", profile.startup_id)

    if (fundPoolErr) {
      console.error("Error fetching fund pool:", fundPoolErr)
      // return notFound();
    }
    if (fundPoolRes) {
      fundPools = fundPoolRes;
    }

    let openFundPool = null;
    let investments = [];
    // If fund pools exist, find open fund pool
    if (fundPools && fundPools.length > 0) {
      openFundPool = fundPools.find((pool) => pool.status === "open")

      // If open fund pool exists, find investments
      if (openFundPool) {
        const { data: investmentRes, error: investmentErr } = await supabase
        .from("investments")
        .select("*")
        .in("status", ["needs_action", "pending", "confirmed"])
        .eq("fund_pool_id", openFundPool.id)
  
        if (investmentErr) {
          console.error("Error fetching industries:", industryErr);
          // return notFound();
        }
        if (investmentRes) {
          investments = investmentRes;
        }
      }
    }

    if (startup) {
      return <ViewStartup startup={startup} industries={industries} openFundPool={openFundPool} fundPools={fundPools} investments={investments} />
    }
  }
}