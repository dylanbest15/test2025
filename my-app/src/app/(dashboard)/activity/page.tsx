import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ViewActivity from "@/app/(dashboard)/activity/view-activity";
import { Favorite } from "@/types/favorite";
import { Startup } from "@/types/startup";

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

  let favorites = null;
  if (user.user_metadata.type === 'investor') {
    const { data, error } = await supabase
      .from("favorites")
      .select(`
      id,
      profile_id,
      startup_id,
      startup:startups!inner(*)
    `)
      .eq("profile_id", user.id)

    favorites = data as JoinedFavorite[] | null;

    if (error) {
      console.error("Error fetching favorites with startups:", error);
      return <div>Error loading your favorite startups</div>;
    }
  }

  return (
    <div className="w-full bg-[#f8f9fa]">
      <ViewActivity profileType={user.user_metadata.type} favorites={favorites} />
    </div>
  )
}