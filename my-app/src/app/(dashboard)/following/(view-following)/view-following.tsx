"use client"

import { useState } from "react"
import type { Favorite } from "@/types/favorite"
import type { Startup } from "@/types/startup"
import { FollowingCard } from "./following-card"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface JoinedFavorite extends Favorite {
  startup: Startup
}

interface ViewFollowingProps {
  favorites: JoinedFavorite[] | null
}

export default function ViewFollowing({ favorites }: ViewFollowingProps) {
  const [searchTerm, setSearchTerm] = useState("")

  if (!favorites || favorites.length === 0) {
    return (
      <div className="w-full p-4 flex-shrink-0 overflow-hidden h-full">
        <div className="max-w-xl h-full flex flex-col">
          <div className="max-h-[400px] overflow-y-auto">
            <p className="text-gray-500 text-center py-8">You're not following any startups yet.</p>
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
              {searchTerm ? "No startups found matching your search." : "You're not following any startups yet."}
            </p>
          ) : (
            filteredFavorites.map((favorite) => (
              <div key={favorite.id}>
                <FollowingCard favorite={favorite} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}