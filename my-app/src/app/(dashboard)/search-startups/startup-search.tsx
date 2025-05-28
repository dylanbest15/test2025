"use client"

import type React from "react"
import type { Startup } from "@/types/startup"
import { useState, useMemo } from "react"
import { Loader, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { getStartups } from "@/app/(dashboard)/search-startups/actions"
import { StartupCard } from "@/app/(dashboard)/search-startups/(components)/startup-card"
import type { Favorite } from "@/types/favorite"

interface StartupSearchProps {
  profileId: string;
  favorites: Favorite[]
}

export default function StartupSearch({ profileId, favorites }: StartupSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Startup[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  // Create a Map for O(1) lookup performance instead of O(n) array searches
  const favoritesMap = useMemo(() => {
    const map = new Map<string, Favorite>()
    favorites.forEach((favorite) => {
      map.set(favorite.startup_id, favorite)
    })
    return map
  }, [favorites])

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setResults([])
      setHasSearched(false)
    } else {
      setHasSearched(true)
      setLoading(true)
      try {
        const startups = await getStartups(query)
        setResults(startups)
      } catch (error) {
        console.log("Error fetching startups", error)
      } finally {
        setLoading(false)
      }
    }
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
            placeholder="Search by startup name..."
            className="pl-10 bg-white"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        {hasSearched && (
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              results.map((startup) => {
                // Find the favorite for this startup (if it exists)
                const favorite = favoritesMap.get(startup.id) || null

                return (
                  <div key={startup.id}>
                    <StartupCard startup={startup} profileId={profileId} favorite={favorite} />
                  </div>
                )
              })
            ) : (
              <p className="text-gray-500 text-center py-4">No startups found matching your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}