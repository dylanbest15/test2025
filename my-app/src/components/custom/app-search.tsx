"use client"

import type React from "react"

import { mockInvestor, mockInvestors, mockStartups, type mockStartup } from "@/types/startup"
import { useState } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { SearchCard } from "./search-card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import InvestorCard from "./investor-card"

type SearchResult = mockStartup | mockInvestor;
type FilterType = "startups" | "investors"

export default function AppSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [filterType, setFilterType] = useState<FilterType>("startups")

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setResults([])
      setHasSearched(false)
    } else {
      setHasSearched(true)

      if (filterType === "startups") {
        const filteredResults = mockStartups.filter(
          (startup) =>
            startup.name.toLowerCase().includes(query.toLowerCase()) ||
            startup.location.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(filteredResults)
      } else {
        const filteredResults = mockInvestors.filter(
          (investor) =>
            investor.name.toLowerCase().includes(query.toLowerCase()) ||
            investor.location.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(filteredResults)
      }
    }
  }

  return (
    <div className="w-full md:w-1/2 p-6 md:p-10 flex-shrink-0 overflow-hidden h-full">
      <div className="pt-4 md:pt-0">
        <div className="max-w-xl h-full flex flex-col">

          {/* Filter Toggle */}
          <div className="flex space-x-2 mb-4">
            <Button
              variant="outline"
              className={cn(
                "flex-1",
                filterType === "startups" && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
              onClick={() => {
                setFilterType("startups")
                // Reset search results when changing filter
                if (searchQuery) {
                  handleSearch({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>)
                }
              }}
            >
              Startups
            </Button>
            <Button
              variant="outline"
              className={cn(
                "flex-1",
                filterType === "investors" && "bg-primary text-primary-foreground hover:bg-primary/90",
              )}
              onClick={() => {
                setFilterType("investors")
                // Reset search results when changing filter
                if (searchQuery) {
                  handleSearch({ target: { value: searchQuery } } as React.ChangeEvent<HTMLInputElement>)
                }
              }}
            >
              Investors
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              type="search"
              placeholder={`Search by ${filterType === "startups" ? "startup" : "investor"} name or location...`}
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {hasSearched && (
            <div className="max-h-[400px] overflow-y-auto pr-2">
              <div className="space-y-3">
                {results.length > 0 ? (
                  results.map((result) => (
                    <div key={result.id}>
                      {filterType === "startups" ? (
                        <SearchCard startup={result as mockStartup} />
                      ) : (
                        <InvestorCard investor={result as mockInvestor} />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No {filterType} found matching your search.</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
