"use client"

import type React from "react"
import { statesAndProvinces, type Startup } from "@/types/startup"
import { useState, useMemo, useRef, useCallback } from "react"
import { Loader, Search, Briefcase, Filter, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { getStartups } from "@/app/(dashboard)/search-startups/actions"
import { StartupCard } from "@/app/(dashboard)/search-startups/(components)/startup-card"
import type { Favorite } from "@/types/favorite"
import { INDUSTRIES } from "@/types/industries"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"

interface StartupSearchProps {
  profileId: string
  favorites: Favorite[]
}

// Debounce hook for simple search
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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  // Create a Map for O(1) lookup performance instead of O(n) array searches
  const favoritesMap = useMemo(() => {
    const map = new Map<string, Favorite>()
    favorites.forEach((favorite) => {
      map.set(favorite.startup_id, favorite)
    })
    return map
  }, [favorites])

  // Search function for advanced filters (button-triggered)
  const performAdvancedSearch = useCallback(async () => {
    // Check if at least one filter has a value
    if (searchQuery.trim() === "" && cityFilter.trim() === "" && stateFilter === "" && selectedIndustry === "") {
      setResults([])
      setHasSearched(false)
      return
    }

    setHasSearched(true)
    setLoading(true)
    try {
      const startups = await getStartups(searchQuery, cityFilter, stateFilter, selectedIndustry)
      setResults(startups)
    } catch (error) {
      console.log("Error fetching startups", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [searchQuery, cityFilter, stateFilter, selectedIndustry])

  // Search function for simple name search (real-time)
  const performSimpleSearch = useCallback(async (query: string) => {
    if (query.trim() === "") {
      setResults([])
      setHasSearched(false)
      return
    }

    setHasSearched(true)
    setLoading(true)
    try {
      const startups = await getStartups(query, "", "", "")
      setResults(startups)
    } catch (error) {
      console.log("Error fetching startups", error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounced search for simple mode
  const debouncedSimpleSearch = useDebounce(performSimpleSearch, 300)

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    // Only trigger real-time search when advanced filters are hidden
    if (!showAdvancedFilters) {
      debouncedSimpleSearch(query)
    }
  }

  // Handle form submission for advanced search
  const handleAdvancedSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    performAdvancedSearch()
  }

  // Handle Enter key in input fields (only for advanced mode)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showAdvancedFilters) {
      performAdvancedSearch()
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setCityFilter("")
    setStateFilter("")
    setSelectedIndustry("")
    setResults([])
    setHasSearched(false)
    setShowAdvancedFilters(false)
  }

  // Toggle advanced filters
  const toggleAdvancedFilters = () => {
    const newShowAdvanced = !showAdvancedFilters
    setShowAdvancedFilters(newShowAdvanced)

    // If hiding advanced filters, clear them and trigger simple search
    if (!newShowAdvanced) {
      setCityFilter("")
      setStateFilter("")
      setSelectedIndustry("")
      // Trigger simple search with current query
      if (searchQuery.trim() !== "") {
        debouncedSimpleSearch(searchQuery)
      } else {
        setResults([])
        setHasSearched(false)
      }
    }
  }

  // Check if any advanced filters are active
  const hasActiveAdvancedFilters = cityFilter.trim() !== "" || stateFilter !== "" || selectedIndustry !== ""

  // Check if any filters are active
  const hasActiveFilters = searchQuery.trim() !== "" || hasActiveAdvancedFilters

  // Helper function to format location display
  const formatLocationDisplay = () => {
    const selectedState = statesAndProvinces.find((state) => state.value === stateFilter)

    if (cityFilter && selectedState) {
      return ` in ${cityFilter}, ${selectedState.label}`
    } else if (cityFilter) {
      return ` in ${cityFilter}`
    } else if (selectedState) {
      return ` in ${selectedState.label}`
    }
    return ""
  }

  return (
    <div className="w-full p-4 flex-shrink-0 overflow-hidden h-full">
      <div className="max-w-xl h-full flex flex-col">
        <div className="space-y-4 mb-6">
        <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search by startup name..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleKeyDown}
              />
            </div>
            <Button
              variant={showAdvancedFilters ? "default" : "outline"}
              size="icon"
              className={cn(
                "relative",
                showAdvancedFilters || hasActiveAdvancedFilters
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "border-gray-300 hover:bg-gray-50",
              )}
              onClick={toggleAdvancedFilters}
              aria-label="Toggle advanced filters"
            >
              <Filter className="h-4 w-4" />
              {hasActiveAdvancedFilters && !showAdvancedFilters && (
                <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </div>

          {/* Advanced Filters Toggle */}
          <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <CollapsibleContent className="space-y-4 mt-4">
              <form onSubmit={handleAdvancedSubmit} className="space-y-4">
                {/* Location filters */}
                <div className="flex gap-2">
                  {/* City filter */}
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                    <Input
                      type="text"
                      placeholder="City"
                      className="pl-10 bg-white w-full"
                      value={cityFilter}
                      onChange={(e) => setCityFilter(e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                  </div>

                  {/* State filter dropdown */}
                  <div className="flex-1">
                    <Select value={stateFilter} onValueChange={setStateFilter}>
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
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
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

                {/* Search and Clear buttons */}
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={!hasActiveFilters}>
                    <Search className="h-4 w-4 mr-2" />
                    Search Startups
                  </Button>
                  {hasActiveFilters && (
                    <Button type="button" variant="outline" onClick={clearFilters}>
                      Clear
                    </Button>
                  )}
                </div>
              </form>
            </CollapsibleContent>
          </Collapsible>
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
                  {showAdvancedFilters && formatLocationDisplay()}
                  {showAdvancedFilters && selectedIndustry && ` in ${selectedIndustry}`}
                </p>
                {results.map((startup) => {
                  // Find the favorite for this startup (if it exists)
                  const favorite = favoritesMap.get(startup.id) || null

                  return (
                    <div key={startup.id}>
                      <StartupCard startup={startup} profileId={profileId} favorite={favorite} />
                    </div>
                  )
                })}
              </>
            ) : (
              <p className="text-gray-500 text-center py-4">
                No startups found
                {searchQuery && ` matching "${searchQuery}"`}
                {showAdvancedFilters && formatLocationDisplay()}
                {showAdvancedFilters && selectedIndustry && ` in ${selectedIndustry}`}.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}