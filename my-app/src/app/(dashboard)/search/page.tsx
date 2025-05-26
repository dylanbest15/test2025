import StartupSearch from "@/app/(dashboard)/search/(startups)/startup-search";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import InvestorSearch from "@/app/(dashboard)/search/(investors)/investor-search";

export default async function Search() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

  if (user.user_metadata.type === 'investor') {

    let favorites = [];
    const { data: favoriteRes, error: favoriteErr } = await supabase
      .from("favorites")
      .select()
      .eq("profile_id", user.id)

    if (favoriteErr) {
      console.error("Error checking if startup is favorited:", favoriteErr);
    }
    if (favoriteRes) {
      favorites = favoriteRes;
    }

    return (
      <div className="w-full bg-[#f8f9fa]">
        <StartupSearch profileId={user.id} favorites={favorites} />
      </div>
    )
  } else if (user.user_metadata.type === 'founder') {
    return (
      <InvestorSearch />
    )
  }
}