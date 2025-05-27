"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building2, Heart } from "lucide-react"
import type { Startup } from "@/types/startup"
import type { Favorite } from "@/types/favorite"
import { useCallback, useState } from "react"
import { toast } from "sonner"
import { createFavorite, deleteFavorite } from "@/app/(dashboard)/activity/actions"
import Link from "next/link"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import StartupSheet from "@/app/(dashboard)/search/(components)/startup-sheet"
import { useIsMobile } from "@/hooks/use-mobile"

interface JoinedFavorite extends Favorite {
  startup: Startup
}

interface FavoriteCardProps {
  favorite: JoinedFavorite
}

export function FavoriteCard({ favorite }: FavoriteCardProps) {
  const isMobile = useIsMobile()
  const [sheetOpen, setSheetOpen] = useState(false)
  const [following, setFollowing] = useState<boolean>(true)
  const [currentFavorite, setCurrentFavorite] = useState<JoinedFavorite>(favorite)

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

  const handleFollowClick = useCallback(
    async (e: React.MouseEvent) => {
      // Prevent the click from bubbling up to the parent Link
      e.preventDefault()
      e.stopPropagation()

      try {
        const favoriteData = {
          startup_id: currentFavorite.startup_id,
          profile_id: currentFavorite.profile_id,
        }

        // Store the current following state before making changes
        const wasFollowing = following

        if (wasFollowing) {
          await deleteFavorite(currentFavorite.id)
          setFollowing(false)
        } else {
          const newFavorite = await createFavorite(favoriteData)
          setFollowing(true)
          setCurrentFavorite({ ...currentFavorite, id: newFavorite.id })
        }

        toast.success(`${wasFollowing ? "Unfavorited" : "Favorited"} ${currentFavorite.startup.name}`, {
          description: wasFollowing ? "Removed from your favorite startups" : "Added to your favorite startups",
        })
        return true
      } catch (error) {
        toast.error("Operation failed", {
          description: "Failed to follow startup.",
        })
        console.error("Failed to follow startup:", error)
        throw error
      }
    },
    [following, currentFavorite.id, currentFavorite.startup_id, currentFavorite.profile_id, currentFavorite.startup.name],
  )

  return (
    <>
      <Link href={`/search/${currentFavorite.startup.id}`} onClick={handleCardClick}>
        <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-0 border-b border-gray-200 bg-white rounded-none">
          <CardContent className="px-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-6 flex-1">
                <div className="relative -mt-1 -ml-2">
                  {currentFavorite.startup.logo_url ? (
                    <div className="h-16 w-16 border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                      <img
                        src={currentFavorite.startup.logo_url || "/placeholder.svg"}
                        alt={`${currentFavorite.startup.name || "Company"} logo`}
                        className="object-contain max-h-full max-w-full"
                        style={{ objectPosition: "center" }}
                      />
                    </div>
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 flex items-center justify-center border border-gray-200">
                      <Building2 className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{currentFavorite.startup.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    {currentFavorite.startup.city}, {currentFavorite.startup.state}
                  </p>
                  {/* <p className="text-sm text-gray-500 line-clamp-2">{truncateOverview(startup.overview)}</p> */}
                </div>
                <div className="relative">
                  <button
                    onClick={handleFollowClick}
                    className="absolute right-0 top-0 p-2"
                    aria-label={following ? "Unfavorite startup" : "Favorite startup"}
                  >
                    <Heart
                      className={`h-6 w-6 stroke-gray-300 transition-colors ${following ? "fill-red-500" : "fill-white"}`}
                    />
                  </button>
                </div>
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
            <StartupSheet startup={favorite.startup} following={following} onFollowClick={handleFollowClick} onBack={() => setSheetOpen(false)} />
          </SheetContent>
        </Sheet>
      )}
    </>
  )
}