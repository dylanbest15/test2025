"use client"

import type React from "react"
import { statesAndProvinces, type Startup } from "@/types/startup"
import { useState, useMemo, useRef, useCallback } from "react"
import { Loader, Search, Building, Briefcase } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStartups } from "@/app/(dashboard)/search-startups/actions"
import { StartupCard } from "@/app/(dashboard)/search-startups/(components)/startup-card"
import type { Favorite } from "@/types/favorite"
import { INDUSTRIES } from "@/types/industries"

interface StartupSearchProps {
  profileId: string
  favorites: Favorite[]
}

// Fix the useDebounce hook by properly typing the useRef call
function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args)
      }, delay)
    },
    [callback, delay],
  ) as T
}

export default function StartupSearch({ profileId, favorites }: StartupSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [cityFilter, setCityFilter] = useState("")
  const [stateFilter, setStateFilter] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState("")
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

  // Search function that includes all filters
  const performSearch = useCallback(async (query: string, city: string, state: string, industry: string) => {
    if (query.trim() === "" && city.trim() === "" && state.trim() === "" && industry.trim() === "") {
      setResults([])
      setHasSearched(false)
      return
    }

    setHasSearched(true)
    setLoading(true)
    try {
      const startups = await getStartups(query, city, state, industry)
      setResults(startups)
    } catch (error) {
      console.log("Error fetching startups", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search to prevent excessive API calls
  const debouncedSearch = useDebounce(performSearch, 300)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query, cityFilter, stateFilter, selectedIndustry)
  }

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const city = e.target.value
    setCityFilter(city)
    debouncedSearch(searchQuery, city, stateFilter, selectedIndustry)
  }

  const handleStateChange = (value: string) => {
    setStateFilter(value)
    debouncedSearch(searchQuery, cityFilter, value, selectedIndustry)
  }

  const handleIndustryChange = (value: string) => {
    setSelectedIndustry(value)
    debouncedSearch(searchQuery, cityFilter, stateFilter, value)
  }

  // Helper function to format location display
  const formatLocationDisplay = () => {
    const selectedState = statesAndProvinces.find((state) => state.value === stateFilter)

    if (cityFilter && selectedState) {
      return `in ${cityFilter}, ${selectedState.label}`
    } else if (cityFilter) {
      return `in ${cityFilter}`
    } else if (selectedState) {
      return `in ${selectedState.label}`
    }
    return ""
  }

  return (
    <div className="w-full p-4 flex-shrink-0 overflow-hidden h-full">
      <div className="max-w-xl h-full flex flex-col">
        <div className="space-y-4 mb-6">
          {/* Name search input */}
          <div className="relative">
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

          {/* Location filters */}
          <div className="flex gap-2">
            {/* City filter */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                <Building className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="City"
                className="pl-10 bg-white w-full"
                value={cityFilter}
                onChange={handleCityChange}
              />
            </div>

            {/* State filter dropdown */}
            <div className="flex-1">
              <Select value={stateFilter} onValueChange={handleStateChange}>
                <SelectTrigger className="bg-white w-full">
                  <SelectValue placeholder="State/Province" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states/provinces</SelectItem>
                  {statesAndProvinces.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label} ({state.value})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Industry filter */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
              <Briefcase className="h-4 w-4 text-gray-400" />
            </div>
            <Select value={selectedIndustry} onValueChange={handleIndustryChange}>
              <SelectTrigger className="bg-white w-full pl-10">
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All industries</SelectItem>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasSearched && (
          <div className="max-h-[400px] overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <Loader className="h-8 w-8 text-gray-400 animate-spin" />
              </div>
            ) : results.length > 0 ? (
              <>
                <p className="text-sm text-gray-500 mb-4">
                  Found {results.length} startup{results.length !== 1 ? "s" : ""}
                  {searchQuery && ` matching "${searchQuery}"`}
                  {formatLocationDisplay()}
                  {selectedIndustry && selectedIndustry !== "all" && ` in ${selectedIndustry}`}
                </p>
                {results.map((startup) => {
                  // Find the favorite for this startup (if it exists)
                  const favorite = favoritesMap.get(startup.id) || null

                  return (
                    <div key={startup.id} className="mb-4">
                      <StartupCard startup={startup} profileId={profileId} favorite={favorite} />
                    </div>
                  )
                })}
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No startups found
                {searchQuery && ` matching "${searchQuery}"`}
                {formatLocationDisplay()}
                {selectedIndustry && selectedIndustry !== "all" && ` in ${selectedIndustry}`}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}