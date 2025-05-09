"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Building, X } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import type { Startup } from "@/types/startup"
import ViewStartupResult from "@/app/(dashboard)/search/[startupId]/view-startup-result"
import Link from "next/link"

interface SearchCardProps {
  startup: Startup
}

export function SearchCard({ startup }: SearchCardProps) {
  const isMobile = useIsMobile()
  const router = useRouter()
  const [sheetOpen, setSheetOpen] = useState(false)

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
          <CardContent className="p-2 ps-4">
            <div className="flex items-center gap-3">
              {/* Logo placeholder */}
              <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                <Building className="h-5 w-5 text-gray-400" />
              </div>

              <div className="flex-grow min-w-0">
                <h3 className="font-medium text-base truncate">{startup.name}</h3>
                <p className="text-sm text-gray-500">
                  {startup.city}, {startup.state} • Founded {startup.year_founded}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
      
      {/* Mobile Sheet */}
      {isMobile && (
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetContent side="right" className="w-full sm:max-w-md p-0" aria-describedby={undefined}>
            <SheetTitle className="sr-only"></SheetTitle>
            <ViewStartupResult startup={startup} />
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}