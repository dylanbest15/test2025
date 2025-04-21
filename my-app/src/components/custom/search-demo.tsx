'use client';

import { mockStartups, mockStartup } from "@/types/startup";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchCard } from "./search-card";

export default function SearchDemo() {
  const isMobile = useIsMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<mockStartup[]>([])
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setResults([])
      setHasSearched(false)
    } else {
      setHasSearched(true)
      const filteredResults = mockStartups.filter(
        (startup) =>
          startup.name.toLowerCase().includes(query.toLowerCase()) ||
          startup.location.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filteredResults)
    }
  }

  return (
    <>
      {/* Mobile toggle button - only visible on small screens */}
      {isMobile && (
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={() => setShowSearch(!showSearch)}
          aria-label={showSearch ? "Close search" : "Open search"}
        >
          {showSearch ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
      )}
      {/* Mobile search hint - only visible when search is hidden */}
      {isMobile && !showSearch && (
        <div className="fixed top-6 left-16 z-50 flex items-center text-sm text-gray-600 animate-pulse">
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Try searching for startups!</span>
        </div>
      )}
      {/* Search section - hidden by default on mobile */}
      <div
        className={`w-full md:w-1/2 p-6 md:p-10 flex-shrink-0 overflow-hidden transition-all duration-300 absolute md:relative ${showSearch ? "left-0" : "-left-full"
          } md:left-0 h-full bg-[#f8f9fa] z-40`}
      >
        <div className="pt-10 md:pt-0">
          <div className="max-w-xl h-full flex flex-col">
            <h2 className="text-xl font-medium mb-6 mt-4">Search for startups.</h2>
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search by startup name or location..."
                className="pl-10 bg-white"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            {hasSearched && (
              <div className="max-h-[400px] overflow-y-auto pr-2">
                <div className="space-y-3">
                  {results.length > 0 ? (
                    results.map((startup) => (
                      <div key={startup.id}>
                        <SearchCard startup={startup}></SearchCard>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No startups found matching your search.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}