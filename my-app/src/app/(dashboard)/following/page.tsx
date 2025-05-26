import { Favorite } from "@/types/favorite";
import { Startup } from "@/types/startup";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import ViewFollowing from "@/app/(dashboard)/following/(view-following)/view-following"

interface JoinedFavorite extends Favorite {
  startup: Startup;
}

export default async function Following() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/")
  }

  const { data, error } = await supabase
    .from("favorites")
    .select(`
      id,
      profile_id,
      startup_id,
      startup:startups!inner(*)
    `)
    .eq("profile_id", user.id)

  const favorites = data as JoinedFavorite[] | null;

  if (error) {
    console.error("Error fetching favorites with startups:", error);
    return <div>Error loading your followed startups</div>;
  }

  return (
    <div className="w-full bg-[#f8f9fa]">
      <ViewFollowing favorites={favorites} />
    </div>
  )

  // if (!favorites || favorites.length === 0) {
  //   return (
  //     <div className="container mx-auto py-8">
  //       <h1 className="text-2xl font-bold mb-6">Startups You're Following</h1>
  //       <p>You're not following any startups yet.</p>
  //     </div>
  //   );
  // }

  // return (
  //   <div className="container mx-auto p-8">
  //     <h1 className="text-2xl font-bold mb-6">Startups You're Following</h1>
      
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  //       {favorites.map((favorite) => (
  //         <div key={favorite.id} className="border rounded-lg p-4 shadow-sm">
  //           <h2 className="text-xl font-semibold">{favorite.startup.name}</h2>
  //           <p className="text-gray-600 mt-2">{favorite.startup.overview}</p>
  //           {/* Display other startup details as needed */}
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // )
}