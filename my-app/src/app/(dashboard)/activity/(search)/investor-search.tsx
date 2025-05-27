'use client';

import { useState } from "react";
import { Loader, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { getInvestors } from "@/app/(dashboard)/activity/actions";
import { Profile } from "@/types/profile";
import { InvestorCard } from "@/app/(dashboard)/activity/(search)/investor-card";

export default function InvestorSearch() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<Profile[]>([])
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false)

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
        const investors = await getInvestors(query)
        setResults(investors)
      } catch (error) {
        console.log('Error fetching startups', error)
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
            placeholder="Search by investor name..."
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
              results.map((investor) => (
                <div key={investor.id}>
                  <InvestorCard investor={investor}></InvestorCard>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No investors found matching your search.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}