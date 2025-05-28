import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ViewActivity from "@/app/(dashboard)/activity/view-activity";
import { Favorite } from "@/types/favorite";
import { Startup } from "@/types/startup";
import { FundPool } from "@/types/fund-pool";
import { Profile } from "@/types/profile";
import { Investment } from "@/types/investment";

interface JoinedInvestment extends Investment {
  fund_pool: FundPool;
  profile: Profile;
}

interface JoinedFavorite extends Favorite {
  startup: Startup;
}

export default async function Activity() {
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

  let favorites = null;
  if (user.user_metadata.type === 'investor') {
    const { data: favoriteData, error: favoriteErr } = await supabase
      .from("favorites")
      .select(`
      id,
      profile_id,
      startup_id,
      startup:startups!inner(*)
    `)
      .eq("profile_id", user.id)

    favorites = favoriteData as JoinedFavorite[] | null;

    if (favoriteErr) {
      console.error("Error fetching favorites with startups:", favoriteErr);
      return <div>Error loading your favorite startups</div>;
    }
  }

  return (
    <div className="w-full bg-[#f8f9fa] mb-20">
      <ViewActivity profileType={user.user_metadata.type} investments={investments} favorites={favorites} />
    </div>
  )
}