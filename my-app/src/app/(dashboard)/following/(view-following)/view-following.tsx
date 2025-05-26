import { Favorite } from "@/types/favorite";
import { Startup } from "@/types/startup";
import { FollowingCard } from "./following-card";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface JoinedFavorite extends Favorite {
  startup: Startup;
}

interface ViewFollowingProps {
  favorites: JoinedFavorite[] | null;
}

export default function ViewFollowing({ favorites }: ViewFollowingProps) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="w-full p-4 flex-shrink-0 overflow-hidden h-full">
      <div className="max-w-xl h-full flex flex-col">
        <div className="max-h-[400px] overflow-y-auto">
          <p className="text-gray-500 text-center py-8">You're not following any startups yet.</p>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="w-full p-4 flex-shrink-0 overflow-hidden h-full">
      <div className="max-w-xl h-full flex flex-col">
      <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder="Filter by startup name..."
              className="pl-10 bg-white"
              // value={searchQuery}
              // onChange={handleSearch}
            />
          </div>
        <div className="max-h-[400px] overflow-y-auto">
          {favorites.map((favorite) => (
            <div key={favorite.id}>
              <FollowingCard favorite={favorite} />
            </div>
          ))}
        </div>
      </div>
    </div>

    // <div className="container mx-auto p-8">
    //   <h1 className="text-2xl font-bold mb-6">Startups You're Following</h1>

    //   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //     {favorites.map((favorite) => (
    //       <div key={favorite.id} className="border rounded-lg p-4 shadow-sm">
    //         <h2 className="text-xl font-semibold">{favorite.startup.name}</h2>
    //         <p className="text-gray-600 mt-2">{favorite.startup.overview}</p>
    //         {/* Display other startup details as needed */}
    //       </div>
    //     ))}
    //   </div>
    // </div>
  )
}