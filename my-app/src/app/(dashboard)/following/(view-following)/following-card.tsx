"use client"

import type React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import type { Startup } from "@/types/startup"
import { Favorite } from "@/types/favorite"

interface JoinedFavorite extends Favorite {
  startup: Startup;
}

interface FollowingCardProps {
  favorite: JoinedFavorite;
}

export function FollowingCard({ favorite }: FollowingCardProps) {
  // Function to truncate bio text
  const truncateOverview = (overview: string, maxLength = 150) => {
    if (!overview) return ""
    return overview.length > maxLength ? `${overview.substring(0, maxLength)}...` : overview
  }

  return (
    <Card className="w-full overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer border-0 border-b border-gray-200 bg-white rounded-none">
      <CardContent className="px-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6 flex-1">
            <div className="relative -mt-1 -ml-2">
              {favorite.startup.logo_url ? (
                <div className="h-16 w-16 border border-gray-200 overflow-hidden flex items-center justify-center bg-white">
                  <img
                    src={favorite.startup.logo_url || "/placeholder.svg"}
                    alt={`${favorite.startup.name || "Company"} logo`}
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
              <h3 className="font-semibold text-lg text-gray-900 leading-tight mb-1">{favorite.startup.name}</h3>
              <p className="text-sm text-gray-600 mb-1">
                {favorite.startup.city}, {favorite.startup.state}
              </p>
              {/* <p className="text-sm text-gray-500 line-clamp-2">{truncateOverview(startup.overview)}</p> */}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


