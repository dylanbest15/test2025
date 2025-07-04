import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Favorite } from "@/types/favorite";
import { Startup } from "@/types/startup";
import ViewFavorites from "@/app/(dashboard)/favorites/view-favorites";

// 1. Fetch user
// 2. Fetch user profile
// 3. Fetch investor favorites

interface JoinedFavorite extends Favorite {
  startup: Startup;
}

export default async function Favorites() {
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
    <div className="w-full bg-[#f8f9fa] pb-20">
      <ViewFavorites favorites={favorites} />
    </div>
  )
}