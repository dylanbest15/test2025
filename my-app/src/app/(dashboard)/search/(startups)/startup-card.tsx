"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building, Building2 } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import type { Startup } from "@/types/startup"
import ViewStartupResult from "@/app/(dashboard)/search/[startupId]/view-startup-result"
import Link from "next/link"

interface StartupCardProps {
  startup: Startup
}

export function StartupCard({ startup }: StartupCardProps) {
  const isMobile = useIsMobile()
  const [sheetOpen, setSheetOpen] = useState(false)

  // Function to truncate bio text
  const truncateOverview = (overview: string, maxLength = 150) => {
    if (!overview) return ""
    return overview.length > maxLength ? `${overview.substring(0, maxLength)}...` : overview
  }

  const handleCardClick = (e: React.MouseEvent) => {
    if (isMobile) {
      e.preventDefault()
      setSheetOpen(true)
    }
  }

  return (
    <>
      <Link href={`/search/${startup.id}`} onClick={handleCardClick}>
        <Card className="overflow-hidden hover:shadow-md transition-all duration-200 cursor-pointer">
          <CardContent className="ps-4">
            <div className="flex items-start">
              <div className="relative mr-4">
                {startup.logo_url ? (
                  <div className="h-10 w-10 border-2 border-border overflow-hidden rounded-md flex items-center justify-center">
                    <img
                      src={startup.logo_url || "/placeholder.svg"}
                      alt={`${startup.name || "Company"} logo`}
                      className="object-contain max-h-full max-w-full"
                      style={{ objectPosition: "center" }}
                    />
                  </div>
                ) : (
                  <div className="h-10 w-10 bg-gray-10 flex items-center justify-center rounded-md border-2 border-border">
                    <Building2 className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-base leading-tight">{startup.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {startup.city}, {startup.state}
                </p>
                <p className="text-sm text-gray-500 mt-1">{truncateOverview(startup.overview)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>

      {/* Mobile Sheet */}
      {isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent
            side="right"
            className="w-full sm:max-w-md p-0 overflow-hidden flex flex-col [&>button]:hidden"
            aria-describedby={undefined}
          >
            <SheetTitle className="sr-only">Startup Details</SheetTitle>
            <ViewStartupResult startup={startup} onBack={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}