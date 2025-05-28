"use client"

import { useState } from "react"
import type { Favorite } from "@/types/favorite"
import type { Startup } from "@/types/startup"
import { FavoriteCard } from "@/app/(dashboard)/favorites/(components)/favorite-card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface JoinedFavorite extends Favorite {
  startup: Startup
}

interface ViewFavoritesProps {
  favorites: JoinedFavorite[] | null
}

export default function ViewFavorites({ favorites }: ViewFavoritesProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!favorites || favorites.length === 0) {
    return (
      <div className="w-full p-4 flex-shrink-0 overflow-hidden h-full">
        <div className="max-w-xl h-full flex flex-col">
          <div className="max-h-[400px] overflow-y-auto">
            <p className="text-gray-500 text-center py-8">You don't have any favorite startups yet.</p>
          </div>
        </div>
      </div>
    )
  }

  // Filter favorites based on search term
  const filteredFavorites = favorites.filter((favorite) =>
    favorite.startup.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {filteredFavorites.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              {searchTerm ? "No startups found matching your search." : "You don't have any favorite startups yet."}
            </p>
          ) : (
            filteredFavorites.map((favorite) => (
              <div key={favorite.id}>
                <FavoriteCard favorite={favorite} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}