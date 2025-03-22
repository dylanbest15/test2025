'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchCard } from "@/custom/ui/search-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { mockStartups, Startup } from "@/types/startup";
import { ArrowLeft, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const isMobile = useIsMobile()
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Startup[]>([])
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
    <main className="flex min-h-screen h-screen overflow-hidden relative">
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
        className={`w-full md:w-1/2 p-6 md:p-10 border-r flex-shrink-0 overflow-hidden transition-all duration-300 absolute md:relative ${showSearch ? "left-0" : "-left-full"
          } md:left-0 h-full bg-background z-40`}
      >
        <div className="pt-10 md:pt-0">
          <div className="max-w-xl h-full flex flex-col">
            <h2 className="text-2xl font-medium mb-6">Search for startups.</h2>

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="search"
                placeholder="Search by startup name or location..."
                className="pl-10"
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
                        <SearchCard {...startup}></SearchCard>
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

      {/* Fund Pool info - always visible */}
      <div className="w-full md:w-1/2 p-6 md:p-10 flex items-center justify-center flex-shrink-0">
        <div className="max-w-md">
          <h1 className="mb-2 text-4xl font-medium text-gray-900">The Fund Pool</h1>
          <p className="mb-8 text-gray-600">The new hub for startups and investors.</p>

          <div className="mb-8 h-px w-full bg-gray-200" />

          <p className="mb-6 text-gray-700">
            Join as a startup and connect with investors. Join as an investor and connect with startups.
          </p>

          <div className="flex flex-wrap gap-4">
            <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild variant="default" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>

  );
}
