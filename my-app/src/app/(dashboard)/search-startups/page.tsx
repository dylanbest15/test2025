import StartupSearch from "@/app/(dashboard)/search-startups/startup-search";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function SearchStartups() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

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
}