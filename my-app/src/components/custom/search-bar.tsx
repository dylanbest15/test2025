'use client';

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockStartups, mockStartup } from "@/types/startup"
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("")
  const [results, setResults] = useState<mockStartup[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)

    if (query.trim() === "") {
      setResults([])
      setHasSearched(false)
      setIsOpen(false)
    } else {
      setHasSearched(true)
      const filteredResults = mockStartups.filter(
        (startup) =>
          startup.name.toLowerCase().includes(query.toLowerCase()) ||
          startup.location.toLowerCase().includes(query.toLowerCase()),
      )
      setResults(filteredResults)
      setIsOpen(true)
    }
  }

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // You can add additional logic here if needed
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen) return

    // Arrow down
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
    }
    // Arrow up
    else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0))
    }
    // Enter
    else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      handleResultClick(results[selectedIndex])
    }
    // Escape
    else if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  // Handle result click
  const handleResultClick = (startup: mockStartup) => {
    setIsOpen(false)
    // Navigate to the startup page
    router.push(`/${startup.id}`)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            type="search"
            placeholder="Search..."
            className="w-64 rounded-md pl-8 md:w-80"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => hasSearched && setIsOpen(true)}
          />
        </div>
      </form>
      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div ref={dropdownRef} className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card shadow-lg">
          <ul className="max-h-60 overflow-auto py-1 text-sm">
            {results.map((startup, index) => (
              <li
                key={startup.id}
                className={cn("cursor-pointer px-4 py-2 hover:bg-accent", selectedIndex === index && "bg-accent")}
                onClick={() => handleResultClick(startup)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="font-medium">{startup.name}</div>
                <div className="text-xs text-muted-foreground">{startup.location}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
      {isOpen && results.length === 0 && hasSearched && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-card p-4 shadow-lg">
          <p className="text-center text-sm text-muted-foreground">No results found</p>
        </div>
      )}
    </div>
  )
}